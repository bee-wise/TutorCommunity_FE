"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@workspace/ui/components/ui/bee-toast";

export interface UseVoiceRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  silenceTimeoutMs?: number; // Auto-trigger after N ms of user silence
  autoStopOnFinal?: boolean; // Auto-stop listening once a final transcript is received
  onResult?: (transcript: string, isFinal: boolean) => void;
  onSpeechEnd?: (finalTranscript: string) => void;
  onError?: (error: string) => void;
  onEnd?: (finalTranscript: string) => void;
}

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function useVoiceRecognition(options: UseVoiceRecognitionOptions = {}) {
  const {
    lang = "vi-VN",
    continuous = false,
    interimResults = true,
    silenceTimeoutMs = 1200,
    autoStopOnFinal = true,
    onResult,
    onSpeechEnd,
    onError,
    onEnd,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const latestTranscriptRef = useRef("");
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredEndRef = useRef(false);

  const callbacksRef = useRef({ onResult, onSpeechEnd, onError, onEnd });

  useEffect(() => {
    callbacksRef.current = { onResult, onSpeechEnd, onError, onEnd };
  }, [onResult, onSpeechEnd, onError, onEnd]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const win = window as unknown as IWindow;
    const SpeechRecognitionClass =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const triggerSpeechEnd = useCallback((text: string) => {
    if (hasTriggeredEndRef.current) return;
    const trimmed = text.trim();
    if (trimmed) {
      hasTriggeredEndRef.current = true;
      callbacksRef.current.onSpeechEnd?.(trimmed);
    }
  }, []);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore if already stopped
      }
      setIsListening(false);
    }

    if (latestTranscriptRef.current && !hasTriggeredEndRef.current) {
      triggerSpeechEnd(latestTranscriptRef.current);
    }
  }, [clearSilenceTimer, triggerSpeechEnd]);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const win = window as unknown as IWindow;
    const SpeechRecognitionClass =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      toast.warning("Trình duyệt không hỗ trợ", {
        description:
          "Vui lòng sử dụng Chrome, Edge hoặc Safari để dùng tính năng nhận diện giọng nói.",
      });
      return;
    }

    clearSilenceTimer();
    hasTriggeredEndRef.current = false;
    latestTranscriptRef.current = "";
    setTranscript("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = lang;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0]?.transcript || "";
          currentTranscript += text;
          if (result.isFinal) {
            isFinal = true;
          }
        }

        const trimmed = currentTranscript.trim();
        if (trimmed) {
          latestTranscriptRef.current = trimmed;
          setTranscript(trimmed);
          callbacksRef.current.onResult?.(trimmed, isFinal);

          // Reset silence timer on each spoken phrase
          clearSilenceTimer();

          if (isFinal && autoStopOnFinal) {
            triggerSpeechEnd(trimmed);
            try {
              recognition.stop();
            } catch {
              // Ignore
            }
          } else if (silenceTimeoutMs > 0) {
            // If user pauses for `silenceTimeoutMs`, auto trigger search & stop
            silenceTimerRef.current = setTimeout(() => {
              triggerSpeechEnd(latestTranscriptRef.current);
              try {
                recognition.stop();
              } catch {
                // Ignore
              }
            }, silenceTimeoutMs);
          }
        }
      };

      recognition.onspeechend = () => {
        // Browser detected end of speech
        if (latestTranscriptRef.current && !hasTriggeredEndRef.current) {
          triggerSpeechEnd(latestTranscriptRef.current);
        }
      };

      recognition.onerror = (event: any) => {
        clearSilenceTimer();
        setIsListening(false);
        let errorMsg = "Đã xảy ra lỗi khi nhận diện giọng nói.";

        if (
          event.error === "not-allowed" ||
          event.error === "permission-denied"
        ) {
          errorMsg =
            "Vui lòng cấp quyền truy cập micro trên trình duyệt để tìm kiếm bằng giọng nói.";
          toast.error("Không có quyền truy cập micro", {
            description: errorMsg,
          });
        } else if (event.error === "no-speech") {
          errorMsg = "Không nghe thấy giọng nói. Vui lòng thử lại.";
        } else if (event.error === "network") {
          errorMsg = "Lỗi kết nối mạng khi xử lý giọng nói.";
          toast.error("Lỗi mạng", { description: errorMsg });
        }

        callbacksRef.current.onError?.(errorMsg);
      };

      recognition.onend = () => {
        clearSilenceTimer();
        setIsListening(false);
        if (latestTranscriptRef.current && !hasTriggeredEndRef.current) {
          triggerSpeechEnd(latestTranscriptRef.current);
        }
        callbacksRef.current.onEnd?.(latestTranscriptRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      clearSilenceTimer();
      setIsListening(false);
      toast.error("Không thể khởi động micro", {
        description:
          "Vui lòng kiểm tra lại thiết bị hoặc quyền micro của trình duyệt.",
      });
    }
  }, [
    autoStopOnFinal,
    clearSilenceTimer,
    continuous,
    interimResults,
    lang,
    silenceTimeoutMs,
    triggerSpeechEnd,
  ]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    latestTranscriptRef.current = "";
    setTranscript("");
  }, []);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, [clearSilenceTimer]);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
}
