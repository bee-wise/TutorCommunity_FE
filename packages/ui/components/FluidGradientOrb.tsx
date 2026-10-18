"use client";

import Strands from "./fluid-orb/Strands";
import { useOrbAudio, type FluidOrbState } from "./fluid-orb/useOrbAudio";

const DEFAULT_COLORS = ["#F65A86", "#FFC36B", "#4A68F4"] as const;
const STATE_LABELS: Record<FluidOrbState, string> = {
  idle: "Sẵn sàng",
  listening: "Đang lắng nghe",
  processing: "Đang xử lý",
  speaking: "Đang phản hồi",
};

export type FluidGradientOrbProps = {
  state: FluidOrbState;
  audioStream?: MediaStream | null;
  size?: number | string;
  intensity?: number;
  colors?: readonly [string, string, string];
  className?: string;
};

export function FluidGradientOrb({
  state,
  audioStream,
  size = 280,
  intensity = 1,
  colors = DEFAULT_COLORS,
  className,
}: FluidGradientOrbProps) {
  const { sample, error } = useOrbAudio(state, audioStream);
  const palette = [colors[0], "#FF8E76", colors[1], "#FFF0D8", "#56DBD8", colors[2], "#6145D7"];

  return (
    <div className={className} style={{ position: "relative", width: size, maxWidth: "100%", aspectRatio: "1" }}>
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full"
        style={{
          background: `radial-gradient(circle at 45% 45%, #fff8ee 12%, ${colors[1]} 35%, #68dbe9 65%, ${colors[2]} 90%)`,
          boxShadow: `0 18px 54px -24px ${colors[2]}`,
        }}
      />
      <div className="absolute inset-0" aria-hidden="true">
        <Strands
          colors={palette}
          glass
          lightMode
          interactive={false}
          clickPulse={false}
          intro={false}
          maxDevicePixelRatio={1.75}
          energy={state === "processing" ? 1 : state === "idle" ? 0.7 : 0.82}
          speed={state === "processing" ? 1.45 : 1.2}
          amplitude={1.75}
          waviness={1.5}
          spread={2.1}
          thickness={1.35}
          glow={1.2}
          saturation={1.3}
          intensity={Math.max(0, Math.min(2, intensity)) * 1.35}
          audioSample={sample}
        />
      </div>
      <span className="sr-only" role="status">{STATE_LABELS[state]}</span>
      {error && <p role="alert" className="absolute inset-x-0 bottom-0 rounded-xl bg-background/90 px-3 py-2 text-center text-xs text-destructive shadow-sm">{error}</p>}
    </div>
  );
}
