"use client";

import { useEffect, useRef, useState } from "react";
import { uploadInterviewVideo } from "@workspace/core/ai-interviews/services/video-upload";
import type { InterviewPrompt } from "@workspace/core/ai-interviews/schemas/tutor.schema";

interface PendingVideo { prompt: InterviewPrompt; blob: Blob; status: "uploading" | "failed"; task: Promise<void> }

export function useInterviewUploads() {
  const items = useRef(new Map<string, PendingVideo>());
  const controller = useRef(new AbortController());
  const [pending, setPending] = useState(0);
  const [failed, setFailed] = useState(0);
  useEffect(() => {
    controller.current = new AbortController();
    return () => controller.current.abort();
  }, []);
  function updateCounts() {
    setPending(items.current.size);
    setFailed([...items.current.values()].filter((item) => item.status === "failed").length);
  }
  function upload(prompt: InterviewPrompt, blob: Blob) {
    const key = prompt.video_upload.key;
    const previous = items.current.get(key);
    const item: PendingVideo = { prompt, blob, status: "uploading", task: Promise.resolve() };
    item.task = (previous?.task ?? Promise.resolve()).catch(() => undefined).then(() =>
      uploadInterviewVideo(prompt.video_upload, blob, controller.current.signal),
    ).then(() => {
      if (items.current.get(key) === item) items.current.delete(key);
    }).catch(() => { item.status = "failed"; }).finally(updateCounts);
    items.current.set(key, item); updateCounts();
  }
  function retryUploads() {
    for (const item of items.current.values()) if (item.status === "failed") upload(item.prompt, item.blob);
  }
  async function waitForUploads() {
    await Promise.all([...items.current.values()].map((item) => item.task));
    if (items.current.size) throw new Error("Video chưa tải xong. Hãy thử tải lại video trước khi nộp bài.");
  }
  return { pending, failed, upload, retryUploads, waitForUploads };
}
