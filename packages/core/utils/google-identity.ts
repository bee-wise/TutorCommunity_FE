export interface GoogleCredentialResponse {
  credential?: string;
}

export interface GoogleIdentityApi {
  initialize(config: {
    client_id: string;
    nonce: string;
    ux_mode: "popup";
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  renderButton(
    parent: HTMLElement,
    options: {
      type: "standard";
      theme: "outline";
      size: "large";
      shape: "pill";
      text: "signin_with" | "signup_with";
      width: string;
      locale: "vi";
    },
  ): void;
}

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleIdentityApi } };
  }
}

let scriptPromise: Promise<GoogleIdentityApi> | null = null;

export function loadGoogleIdentity(): Promise<GoogleIdentityApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Identity chỉ hoạt động trong trình duyệt."));
  }
  const existingApi = window.google?.accounts?.id;
  if (existingApi) return Promise.resolve(existingApi);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<GoogleIdentityApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const api = window.google?.accounts?.id;
      if (api) resolve(api);
      else {
        scriptPromise = null;
        reject(new Error("Không thể khởi tạo Google Identity."));
      }
    };
    script.onerror = () => {
      scriptPromise = null;
      script.remove();
      reject(new Error("Không thể tải Google Identity. Vui lòng thử lại."));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}
