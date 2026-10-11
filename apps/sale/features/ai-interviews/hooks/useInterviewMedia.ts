"use client";

import { useEffect, useRef, useState } from "react";
import { InterviewRecorder, getRecordingFormats } from "../services/interview-recorder";

export function useInterviewMedia() {
  const recorderRef = useRef<InterviewRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [deviceError, setDeviceError] = useState("");
  const [requesting, setRequesting] = useState(false);
  const generation = useRef(0);
  useEffect(() => () => { generation.current += 1; recorderRef.current?.dispose(); }, []);

  async function requestDevices() {
    const version = ++generation.current;
    setRequesting(true); setDeviceError("");
    recorderRef.current?.dispose(); recorderRef.current = null; setStream(null);
    try {
      const formats = getRecordingFormats();
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera và micro cần kết nối HTTPS hoặc localhost.");
      const nextStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { width: { ideal: 640 }, height: { ideal: 480 } } });
      if (generation.current !== version) { nextStream.getTracks().forEach((track) => track.stop()); return; }
      const recorder = new InterviewRecorder(nextStream, formats);
      recorderRef.current = recorder; setStream(nextStream);
      nextStream.getTracks().forEach((track) => track.addEventListener("ended", () => setDeviceError("Camera hoặc micro đã ngắt. Hãy kiểm tra lại thiết bị."), { once: true }));
    } catch (error) {
      if (generation.current === version) setDeviceError(error instanceof Error && error.name !== "NotAllowedError" ? error.message : "Hãy cấp quyền camera và micro trong trình duyệt rồi thử lại.");
    } finally { if (generation.current === version) setRequesting(false); }
  }
  function releaseDevices() {
    generation.current += 1; recorderRef.current?.dispose(); recorderRef.current = null; setStream(null);
  }
  return { recorderRef, stream, deviceError, requesting, requestDevices, releaseDevices };
}
