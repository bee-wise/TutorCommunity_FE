"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { analyseOrbAudio, type OrbAudioLevels } from "./orb-audio";

export type FluidOrbState = "idle" | "listening" | "processing" | "speaking";

const EMPTY: OrbAudioLevels = { level: 0, bass: 0, mid: 0, high: 0 };

export function useOrbAudio(state: FluidOrbState, audioStream?: MediaStream | null) {
  const analyzer = useRef<{
    node: AnalyserNode;
    samples: Float32Array<ArrayBuffer>;
    bins: Uint8Array<ArrayBuffer>;
    sampleRate: number;
    noiseFloor: number;
  } | null>(null);
  const levels = useRef<OrbAudioLevels>({ ...EMPTY });
  const [error, setError] = useState<{ state: FluidOrbState; message: string } | null>(null);

  useEffect(() => {
    let active = true;
    // Supplied streams belong to the caller; only stop tracks captured here.
    let ownedStream: MediaStream | null = null;
    let context: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let endedTrack: MediaStreamTrack | null = null;
    const onEnded = () => {
      analyzer.current = null;
      source?.disconnect();
      source = null;
      if (context) {
        void context.close();
        context = null;
      }
      if (active) setError({ state, message: "Nguồn âm thanh đã ngắt kết nối." });
    };

    analyzer.current = null;

    const connect = async () => {
      if (state !== "listening" && state !== "speaking") return;
      try {
        let stream = audioStream;
        if (!stream && state === "listening") {
          if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("Trình duyệt không hỗ trợ micro.");
          }
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          ownedStream = stream;
        }
        if (!active) {
          ownedStream?.getTracks().forEach((track) => track.stop());
          return;
        }
        if (!stream) return;
        endedTrack = stream.getAudioTracks().find((track) => track.readyState === "live") ?? null;
        if (!endedTrack) throw new Error("Nguồn âm thanh không có track đang hoạt động.");
        if (typeof AudioContext === "undefined") throw new Error("Trình duyệt không hỗ trợ Web Audio.");
        context = new AudioContext();
        const node = context.createAnalyser();
        node.fftSize = 2048;
        node.smoothingTimeConstant = 0.75;
        source = context.createMediaStreamSource(stream);
        source.connect(node);
        endedTrack.addEventListener("ended", onEnded);
        analyzer.current = {
          node,
          samples: new Float32Array(node.fftSize),
          bins: new Uint8Array(node.frequencyBinCount),
          sampleRate: context.sampleRate,
          noiseFloor: 0.008,
        };
        await context.resume();
        if (active) setError(null);
      } catch (cause) {
        analyzer.current = null;
        endedTrack?.removeEventListener("ended", onEnded);
        source?.disconnect();
        source = null;
        if (context) {
          void context.close();
          context = null;
        }
        ownedStream?.getTracks().forEach((track) => track.stop());
        ownedStream = null;
        if (active) {
          setError({ state, message:
            cause instanceof DOMException && cause.name === "NotAllowedError"
              ? "Micro bị từ chối. Hãy cấp quyền trong trình duyệt để tiếp tục."
              : cause instanceof Error ? cause.message : "Không thể kết nối âm thanh.",
          });
        }
      }
    };

    void connect();
    return () => {
      active = false;
      analyzer.current = null;
      endedTrack?.removeEventListener("ended", onEnded);
      source?.disconnect();
      void context?.close();
      ownedStream?.getTracks().forEach((track) => track.stop());
    };
  }, [state, audioStream]);

  const sample = useCallback((delta: number) => {
    const current = analyzer.current;
    let target: OrbAudioLevels = EMPTY;
    if (current) {
      current.node.getFloatTimeDomainData(current.samples);
      current.node.getByteFrequencyData(current.bins);
      const measured = analyseOrbAudio(
        current.samples, current.bins, current.sampleRate, current.node.fftSize, current.noiseFloor,
      );
      current.noiseFloor = measured.noiseFloor;
      target = measured;
    }
    const step = Math.min(delta, 0.05);
    for (const key of ["level", "bass", "mid", "high"] as const) {
      const rate = target[key] > levels.current[key] ? 14 : 5;
      levels.current[key] += (target[key] - levels.current[key]) * (1 - Math.exp(-rate * step));
    }
    return levels.current;
  }, []);

  return { sample, error: error?.state === state ? error.message : null };
}
