import assert from "node:assert/strict";
import test from "node:test";
import { analyseOrbAudio } from "./orb-audio.ts";

test("quiet input stays below the noise floor", () => {
  const samples = new Float32Array(2048).fill(0.004);
  const bins = new Uint8Array(1024).fill(3);
  const result = analyseOrbAudio(samples, bins, 48000, 2048, 0.008);
  assert.equal(result.level, 0);
  assert.equal(result.bass, 0);
  assert.equal(result.mid, 0);
  assert.equal(result.high, 0);
});

test("voice-level input raises RMS and its occupied frequency band", () => {
  const samples = Float32Array.from({ length: 2048 }, (_, index) => Math.sin(index * 0.09) * 0.22);
  const bins = new Uint8Array(1024);
  bins.fill(150, 12, 34);
  const result = analyseOrbAudio(samples, bins, 48000, 2048, 0.008);
  assert.ok(result.level > 0.5);
  assert.ok(result.mid > result.high);
});
