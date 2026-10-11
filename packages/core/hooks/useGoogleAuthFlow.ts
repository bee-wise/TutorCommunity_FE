"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/useAuthStore";
import { ApiError, handleApiError } from "../sys-libs/error-handler";
import { queryKeys } from "../sys-libs/queryKeys";
import type { MeType } from "../types/auth.type";
import type { GoogleLinkRequest, GoogleRegistrationRequest } from "../schemas/google-auth.schema";
import { getRoleRedirectPath } from "../utils/auth-redirect";
import { loadGoogleIdentity, type GoogleCredentialResponse } from "../utils/google-identity";
import { getSaleAuthUrl } from "../utils/sale-auth-url";

type Application = "SALE" | "LMS";
type Stage = "loading" | "ready" | "exchanging" | "register" | "link" | "error" | "expired" | "sale-required" | "complete";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  "151967691870-esdvukbkk00eejhcp7jm5pc3n1k7ccs0.apps.googleusercontent.com";

function getGoogleErrorMessage(error: ApiError): string {
  if (error.statusCode === 429) {
    return error.retryAfterSeconds
      ? `Bạn đã thử quá nhiều lần. Vui lòng chờ ${error.retryAfterSeconds} giây.`
      : "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.";
  }
  if (error.code === "GOOGLE_INVALID_CREDENTIAL") return "Phiên Google đã hết hạn. Vui lòng bắt đầu lại.";
  if (error.statusCode === 409) return "Thông tin tài khoản đã thay đổi. Vui lòng bắt đầu lại.";
  if (error.statusCode === 503) return "Đăng nhập Google tạm thời không khả dụng. Vui lòng thử lại sau.";
  return error.message;
}

async function getCurrentUser(): Promise<MeType> {
  const response = await authService.getMe();
  if (!response.success || !response.data) {
    throw new ApiError("Không thể tải tài khoản BeeWise sau khi đăng nhập.", 401);
  }
  return response.data;
}

export function useGoogleAuthFlow({
  application,
  returnUrl,
  context = "signin_with",
  enabled = true,
  onLmsAccessNotActivated,
}: {
  application: Application;
  returnUrl?: string | null;
  context?: "signin_with" | "signup_with";
  enabled?: boolean;
  onLmsAccessNotActivated?: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.login);
  const buttonRef = useRef<HTMLDivElement>(null);
  const credentialRef = useRef<string | null>(null);
  const exchangeUsedRef = useRef(false);
  const expiresAtRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const mountedRef = useRef(false);
  const initializedRef = useRef(false);
  const startInFlightRef = useRef(false);
  const busyRef = useRef(false);
  const startRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const [stage, setStage] = useState<Stage>("loading");
  const [error, setError] = useState<ApiError | null>(null);
  const [retryAfter, setRetryAfter] = useState(0);

  const isLmsAccessNotActivated = useCallback(
    (apiError: ApiError) => {
      return (
        application === "LMS" &&
        (apiError.code === "LMS_ACCESS_NOT_ACTIVATED" ||
          (apiError.statusCode === 403 &&
            (apiError.code === "FORBIDDEN_LMS" ||
              apiError.message?.toLowerCase().includes("lms"))))
      );
    },
    [application],
  );

  const handleLmsNotActivated = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      queryClient.clear();
      useAuthStore.getState().logout();
      setStage("ready");
      onLmsAccessNotActivated?.();
      void startRef.current();
    }
  }, [onLmsAccessNotActivated, queryClient]);

  const finish = useCallback((user: MeType) => {
    if (
      application === "LMS" &&
      user.role === "TUTOR" &&
      user.canAccessTutorLms === false
    ) {
      void handleLmsNotActivated();
      return;
    }

    queryClient.clear();
    queryClient.setQueryData([queryKeys.authKey.getMe], user);
    setUser(user);
    setStage("complete");
    toast.success("Đăng nhập Google thành công.", { position: "top-right" });
    router.replace(getRoleRedirectPath(user, {
      returnUrl,
      preferReturnUrl: true,
    }, application));
  }, [application, handleLmsNotActivated, queryClient, returnUrl, router, setUser]);

  const challengeMutation = useMutation({
    mutationKey: queryKeys.googleAuth.challenge(application),
    mutationFn: () => authService.googleChallenge(application),
    retry: false,
  });

  const exchangeMutation = useMutation({
    mutationKey: queryKeys.googleAuth.exchange(application),
    mutationFn: async () => {
      const credential = credentialRef.current;
      credentialRef.current = null;
      if (!credential) throw new ApiError("Không nhận được thông tin từ Google.", 400);
      const outcome = await authService.googleExchange(credential);
      const user = outcome.status === "AUTHENTICATED" ? await getCurrentUser() : null;
      return { outcome, user };
    },
    retry: false,
    gcTime: 0,
    onSuccess: ({ outcome, user }) => {
      if (!mountedRef.current) return;
      if (user) return finish(user);
      if (outcome.status === "REGISTRATION_REQUIRED") {
        setStage(application === "SALE" ? "register" : "sale-required");
      } else if (outcome.status === "LINK_REQUIRED") {
        setStage("link");
      }
    },
    onError: (cause) => {
      if (!mountedRef.current) return;
      const apiError = handleApiError(cause);
      if (isLmsAccessNotActivated(apiError)) {
        void handleLmsNotActivated();
        return;
      }
      setError(apiError);
      setRetryAfter(apiError.statusCode === 429 ? apiError.retryAfterSeconds ?? 0 : 0);
      setStage(apiError.code === "GOOGLE_REGISTER_ON_SALE" ? "sale-required" : "error");
    },
    onSettled: () => { busyRef.current = false; },
  });

  const registerMutation = useMutation({
    mutationKey: queryKeys.googleAuth.register(application),
    mutationFn: async (values: GoogleRegistrationRequest) => {
      await authService.googleRegister(values);
      return getCurrentUser();
    },
    retry: false,
    onMutate: () => { busyRef.current = true; },
    onSuccess: finish,
    onError: (cause) => {
      const apiError = handleApiError(cause);
      if (isLmsAccessNotActivated(apiError)) {
        void handleLmsNotActivated();
        return;
      }
      setError(apiError);
      if (apiError.statusCode === 409 || apiError.code === "GOOGLE_INVALID_CREDENTIAL" || apiError.statusCode === 503 || apiError.statusCode === 429) {
        setRetryAfter(apiError.statusCode === 429 ? apiError.retryAfterSeconds ?? 0 : 0);
        setStage("error");
      }
    },
    onSettled: () => { busyRef.current = false; },
  });

  const linkMutation = useMutation({
    mutationKey: queryKeys.googleAuth.link(application),
    mutationFn: async (values: GoogleLinkRequest) => {
      await authService.googleLink(values);
      return getCurrentUser();
    },
    retry: false,
    onMutate: () => { busyRef.current = true; },
    onSuccess: finish,
    onError: (cause) => {
      const apiError = handleApiError(cause);
      if (isLmsAccessNotActivated(apiError)) {
        void handleLmsNotActivated();
        return;
      }
      setError(apiError);
      if (apiError.statusCode === 409 || apiError.code === "GOOGLE_INVALID_CREDENTIAL" || apiError.statusCode === 503 || apiError.statusCode === 429) {
        setRetryAfter(apiError.statusCode === 429 ? apiError.retryAfterSeconds ?? 0 : 0);
        setStage("error");
      }
    },
    onSettled: () => { busyRef.current = false; },
  });

  const exchangeCredential = exchangeMutation.mutate;
  const resetExchange = exchangeMutation.reset;
  const resetRegistration = registerMutation.reset;
  const resetLink = linkMutation.reset;
  const beginChallenge = challengeMutation.mutateAsync;

  const onCredential = useCallback((response: GoogleCredentialResponse) => {
    if (!mountedRef.current || exchangeUsedRef.current) return;
    if (Date.now() >= expiresAtRef.current) {
      exchangeUsedRef.current = true;
      setStage("expired");
      buttonRef.current?.replaceChildren();
      return;
    }
    if (!response.credential) {
      exchangeUsedRef.current = true;
      setError(new ApiError("Google không cung cấp thông tin đăng nhập. Vui lòng bắt đầu lại.", 400));
      setStage("error");
      return;
    }
    exchangeUsedRef.current = true;
    busyRef.current = true;
    credentialRef.current = response.credential;
    setStage("exchanging");
    exchangeCredential();
  }, [exchangeCredential]);

  const start = useCallback(async () => {
    if (!enabled || startInFlightRef.current || busyRef.current) return;
    startInFlightRef.current = true;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    buttonRef.current?.replaceChildren();
    credentialRef.current = null;
    exchangeUsedRef.current = false;
    setError(null);
    setRetryAfter(0);
    setStage("loading");
    resetExchange();
    resetRegistration();
    resetLink();

    try {
      const challenge = await beginChallenge();
      if (!mountedRef.current) return;
      const google = await loadGoogleIdentity();
      if (!mountedRef.current) return;
      const expiresAt = Date.parse(challenge.expiresAt);
      if (expiresAt <= Date.now()) throw new ApiError("Phiên Google đã hết hạn. Vui lòng bắt đầu lại.", 400);
      const parent = buttonRef.current;
      if (!parent) return;
      expiresAtRef.current = expiresAt;
      google.initialize({
        client_id: GOOGLE_CLIENT_ID,
        nonce: challenge.nonce,
        ux_mode: "popup",
        callback: onCredential,
      });
      google.renderButton(parent, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "pill",
        text: context,
        width: String(Math.min(parent.clientWidth || 320, 400)),
        locale: "vi",
      });
      setStage("ready");
      timerRef.current = window.setTimeout(() => {
        setStage("expired");
        buttonRef.current?.replaceChildren();
      }, expiresAt - Date.now());
    } catch (cause) {
      if (!mountedRef.current) return;
      const apiError = handleApiError(cause);
      setError(apiError);
      setRetryAfter(apiError.statusCode === 429 ? apiError.retryAfterSeconds ?? 0 : 0);
      setStage(apiError.code === "GOOGLE_REGISTER_ON_SALE" ? "sale-required" : "error");
    } finally {
      startInFlightRef.current = false;
    }
  }, [beginChallenge, context, enabled, onCredential, resetExchange, resetLink, resetRegistration]);
  useEffect(() => {
    startRef.current = start;
  }, [start]);

  useEffect(() => {
    mountedRef.current = true;
    if (enabled && !initializedRef.current) {
      initializedRef.current = true;
      void start();
    }
    return () => {
      mountedRef.current = false;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [enabled, start]);

  useEffect(() => {
    if (retryAfter <= 0) return;
    const timer = window.setTimeout(() => setRetryAfter((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [retryAfter]);

  const cancel = () => {
    if (busyRef.current) return;
    setStage("expired");
    exchangeUsedRef.current = true;
    expiresAtRef.current = 0;
    buttonRef.current?.replaceChildren();
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  };

  const saleRegistrationUrl = getSaleAuthUrl("/register");

  return {
    buttonRef,
    stage,
    error,
    errorMessage: error ? getGoogleErrorMessage(error) : null,
    retryAfter,
    hints: exchangeMutation.data?.outcome,
    saleRegistrationUrl,
    registerAccount: (values: GoogleRegistrationRequest) => {
      if (busyRef.current) return;
      busyRef.current = true;
      registerMutation.mutate(values);
    },
    linkAccount: (values: GoogleLinkRequest) => {
      if (busyRef.current) return;
      busyRef.current = true;
      linkMutation.mutate(values);
    },
    isRegisterPending: registerMutation.isPending,
    isLinkPending: linkMutation.isPending,
    isBusy: exchangeMutation.isPending || registerMutation.isPending || linkMutation.isPending,
    start: () => { void start(); },
    cancel,
  };
}
