export type OrbAudioLevels = { level: number; bass: number; mid: number; high: number };

const averageBand = (
  bins: Uint8Array,
  sampleRate: number,
  fftSize: number,
  fromHz: number,
  toHz: number,
) => {
  const first = Math.max(0, Math.floor((fromHz * fftSize) / sampleRate));
  const last = Math.min(bins.length, Math.ceil((toHz * fftSize) / sampleRate));
  let sum = 0;
  for (let index = first; index < last; index++) sum += bins[index];
  return last > first ? sum / (last - first) / 255 : 0;
};

export function analyseOrbAudio(
  samples: Float32Array,
  bins: Uint8Array,
  sampleRate: number,
  fftSize: number,
  noiseFloor: number,
): OrbAudioLevels & { noiseFloor: number } {
  let squareSum = 0;
  for (let index = 0; index < samples.length; index++) {
    squareSum += samples[index] * samples[index];
  }
  const rms = Math.sqrt(squareSum / samples.length);
  const nextFloor = rms < 0.075 ? noiseFloor + (rms - noiseFloor) * 0.008 : noiseFloor;
  const level = Math.min(1, Math.max(0, rms - Math.max(0.008, nextFloor * 1.4)) * 7);
  const band = (from: number, to: number) =>
    Math.min(1, Math.max(0, averageBand(bins, sampleRate, fftSize, from, to) - 0.035) * 2.4 * Math.min(1, level * 3));

  return {
    level,
    bass: band(70, 280),
    mid: band(280, 1800),
    high: band(1800, 6000),
    noiseFloor: nextFloor,
  };
}
