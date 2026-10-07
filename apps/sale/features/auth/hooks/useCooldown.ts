"use client";

import { useCallback, useEffect, useState } from "react";

export function useCooldown(initialSeconds = 0) {
  const [deadline, setDeadline] = useState(() => Date.now() + initialSeconds * 1000);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [deadline, secondsLeft]);

  const start = useCallback((seconds: number) => {
    const duration = Math.max(0, Math.ceil(seconds));
    setDeadline(Date.now() + duration * 1000);
    setSecondsLeft(duration);
  }, []);

  return { secondsLeft, start };
}
