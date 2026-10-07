/* eslint-disable @typescript-eslint/no-require-imports -- Isolated hook harness mocks browser paint and Next navigation. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");
const originalTs = require.extensions[".ts"];
const originalLoad = Module._load;
const originals = { window: global.window, raf: global.requestAnimationFrame, cancel: global.cancelAnimationFrame };
let runtime;

require.extensions[".ts"] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename);
};
Module._load = function (request, parent, isMain) {
  if (parent?.filename.endsWith("usePreviewTransition.ts")) {
    if (request === "react") return {
      useState: () => ["waiting", (phase) => runtime.phases.push(phase)],
      useRef: (value) => ({ current: value }),
      useCallback: (callback) => callback,
      useEffect: (effect) => runtime.effects.push(effect),
    };
    if (request === "next/navigation") return { useRouter: () => runtime.router };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { usePreviewTransition } = require("../hooks/usePreviewTransition.ts");

function setup({ ready = true, reduced = false } = {}) {
  const frames = new Map();
  let frameId = 0;
  runtime = { phases: [], effects: [], navigations: [], prefetches: [] };
  runtime.router = {
    prefetch: (href) => runtime.prefetches.push(href),
    replace: (href) => runtime.navigations.push(href),
  };
  global.window = { matchMedia: () => ({ matches: reduced }) };
  global.requestAnimationFrame = (callback) => { frames.set(++frameId, callback); return frameId; };
  global.cancelAnimationFrame = (id) => frames.delete(id);
  const hook = usePreviewTransition("/classes?ai=01", ready);
  const cleanups = runtime.effects.map((effect) => effect()).filter(Boolean);
  return {
    hook, frames,
    paint: () => { const batch = [...frames.values()]; frames.clear(); batch.forEach((callback) => callback()); },
    cleanup: () => cleanups.forEach((cleanup) => cleanup()),
  };
}

test("entry waits for data and two paint frames, not mount-time animation", () => {
  const loading = setup({ ready: false });
  assert.equal(loading.frames.size, 0);
  assert.deepEqual(runtime.phases, []);
  loading.cleanup();
  const ready = setup();
  assert.equal(ready.hook.phase, "waiting");
  ready.paint();
  assert.deepEqual(runtime.phases, []);
  ready.paint();
  assert.deepEqual(runtime.phases, ["entering"]);
  ready.cleanup();
});

test("Back navigates only after the root transform exits, once", () => {
  const view = setup();
  view.paint(); view.paint();
  const root = {};
  view.hook.onTransitionEnd({ target: root, currentTarget: root, propertyName: "transform" });
  assert.equal(runtime.phases.at(-1), "entered");
  view.hook.leave();
  assert.equal(runtime.phases.at(-1), "leaving");
  assert.deepEqual(runtime.navigations, []);
  view.hook.onTransitionEnd({ target: {}, currentTarget: root, propertyName: "transform" });
  view.hook.onTransitionEnd({ target: root, currentTarget: root, propertyName: "opacity" });
  assert.deepEqual(runtime.navigations, []);
  view.hook.onTransitionEnd({ target: root, currentTarget: root, propertyName: "transform" });
  view.hook.onTransitionEnd({ target: root, currentTarget: root, propertyName: "transform" });
  assert.deepEqual(runtime.navigations, ["/classes?ai=01"]);
  view.cleanup();
});

test("reduced-motion bypasses sliding; unmount cancels pending paint", () => {
  const reduced = setup({ reduced: true });
  reduced.paint(); reduced.paint();
  assert.deepEqual(runtime.phases, ["entered"]);
  reduced.hook.leave();
  assert.deepEqual(runtime.navigations, ["/classes?ai=01"]);
  reduced.cleanup();
  const unmounted = setup();
  unmounted.paint();
  unmounted.cleanup();
  assert.equal(unmounted.frames.size, 0);
  unmounted.paint();
  assert.deepEqual(runtime.phases, []);
});

after(() => {
  Module._load = originalLoad;
  if (originalTs) require.extensions[".ts"] = originalTs; else delete require.extensions[".ts"];
  if (originals.window === undefined) delete global.window; else global.window = originals.window;
  if (originals.raf === undefined) delete global.requestAnimationFrame; else global.requestAnimationFrame = originals.raf;
  if (originals.cancel === undefined) delete global.cancelAnimationFrame; else global.cancelAnimationFrame = originals.cancel;
});
