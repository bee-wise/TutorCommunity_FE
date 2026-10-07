"use client";

import { useRef } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent, Ref } from "react";

const OTP_LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  inputRef: Ref<HTMLInputElement>;
  disabled?: boolean;
  hasError?: boolean;
  errorId?: string;
  hintId?: string;
}

export function OtpInput({
  value,
  onChange,
  onBlur,
  inputRef,
  disabled = false,
  hasError = false,
  errorId,
  hintId,
}: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) =>
    value[index] && value[index] !== " " ? value[index] : "",
  );

  const focusAt = (index: number) => {
    const input = inputs.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))];
    input?.focus();
    input?.select();
  };

  const commit = (next: string[]) => onChange(next.join("").trimEnd());

  const insertDigit = (index: number, digit: string) => {
    const next = [...digits];
    next[index] = digit;
    commit(next);
    if (index < OTP_LENGTH - 1) focusAt(index + 1);
  };

  const insertText = (index: number, text: string) => {
    const pastedDigits = text.replace(/\D/g, "");
    if (!pastedDigits || pastedDigits.length > OTP_LENGTH) return;

    if (pastedDigits.length === OTP_LENGTH) {
      onChange(pastedDigits);
      focusAt(OTP_LENGTH - 1);
      return;
    }

    const start = Math.min(index, OTP_LENGTH - pastedDigits.length);
    const next = [...digits];
    for (let offset = 0; offset < pastedDigits.length; offset++) {
      next[start + offset] = pastedDigits[offset];
    }
    commit(next);
    focusAt(start + pastedDigits.length);
  };

  const eraseBackwards = (index: number) => {
    const target = digits[index] ? index : Math.max(0, index - 1);
    const next = [...digits];
    next[target] = "";
    commit(next);
    focusAt(Math.max(0, target - (target === index ? 1 : 0)));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      insertDigit(index, event.key);
      return;
    }

    switch (event.key) {
      case "Backspace":
        event.preventDefault();
        eraseBackwards(index);
        break;
      case "Delete": {
        event.preventDefault();
        const next = [...digits];
        next[index] = "";
        commit(next);
        break;
      }
      case "ArrowLeft":
        event.preventDefault();
        focusAt(index - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        focusAt(index + 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(OTP_LENGTH - 1);
        break;
      default:
        if (event.key.length === 1) event.preventDefault();
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const text = event.currentTarget.value;
    if (!text) {
      eraseBackwards(index);
      return;
    }

    const numericText = text.replace(/\D/g, "");
    if (!numericText) return;
    if (numericText.length === OTP_LENGTH) {
      insertText(index, numericText);
      return;
    }

    const inputType = (event.nativeEvent as InputEvent).inputType;
    if (inputType === "insertText") {
      insertDigit(index, numericText.at(-1)!);
    } else {
      insertText(index, numericText);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
    event.preventDefault();
    insertText(index, event.clipboardData.getData("text"));
  };

  return (
    <div role="group" aria-label="Mã xác minh gồm 6 chữ số" className="flex w-full gap-2 sm:gap-2.5">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element;
            if (index === 0) {
              if (typeof inputRef === "function") inputRef(element);
              else if (inputRef) inputRef.current = element;
            }
          }}
          id={`recovery-otp-${index}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={OTP_LENGTH}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Chữ số ${index + 1} của mã xác minh`}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : hintId}
          value={digit}
          disabled={disabled}
          onFocus={(event) => event.currentTarget.select()}
          onBlur={onBlur}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onChange={(event) => handleInput(event, index)}
          onPaste={(event) => handlePaste(event, index)}
          className={`h-11 min-w-0 flex-1 rounded-xl border bg-background text-center font-nunito text-xl font-extrabold text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 ${hasError ? "border-destructive" : digit ? "border-primary/40" : "border-border hover:border-primary/40"}`}
        />
      ))}
    </div>
  );
}
