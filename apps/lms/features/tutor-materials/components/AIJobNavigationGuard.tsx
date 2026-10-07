"use client";
import { useEffect } from "react";
import { useAIJobsStore } from "../store/ai-jobs.store";

export function AIJobNavigationGuard() {
  const running = useAIJobsStore((state) =>
    Object.values(state.jobs).some((job) => job.status === "running"),
  );
  useEffect(() => {
    if (!running) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [running]);
  return null;
}
