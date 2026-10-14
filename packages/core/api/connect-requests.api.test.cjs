/* eslint-disable @typescript-eslint/no-require-imports -- Native Node harness transpiles the TypeScript API module. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");

const originalTs = require.extensions[".ts"];
const originalLoad = Module._load;
let response;
let requestConfig;

require.extensions[".ts"] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText,
  filename,
);
Module._load = function (name, parent, isMain) {
  if (name === "../configs/client") return {
    apiClient: {
      post: async (_url, _body, config) => {
        requestConfig = config;
        return response;
      },
    },
  };
  return originalLoad.call(this, name, parent, isMain);
};

const { connectRequestsApi, ActiveConnectionExistsError } = require("./connect-requests.api.ts");
const tutorId = "20000000-0000-4000-8000-000000000001";
const roomId = "30000000-0000-4000-8000-000000000001";
const connectionId = "10000000-0000-4000-8000-000000000001";

after(() => {
  Module._load = originalLoad;
  require.extensions[".ts"] = originalTs;
});

test("create parses the new 201 connection response", async () => {
  response = {
    success: true,
    code: "CONNECTION_CREATED",
    data: { connectRequestId: connectionId, chatRoomId: roomId, connectionStatus: "ACTIVE" },
  };
  assert.deepEqual(await connectRequestsApi.create({ tutorId }), {
    connectRequestId: connectionId,
    chatRoomId: roomId,
  });
  assert.equal(requestConfig.validateStatus(409), true);
  assert.equal(requestConfig.validateStatus(400), false);
});

test("create exposes the active room from a 409 conflict", async () => {
  response = {
    success: false,
    code: "ACTIVE_CONNECTION_EXISTS",
    data: {
      activeChatRoomId: roomId,
      activeConnection: { id: connectionId, tutorId },
    },
  };
  await assert.rejects(connectRequestsApi.create({ tutorId }), (error) => {
    assert.ok(error instanceof ActiveConnectionExistsError);
    assert.equal(error.activeChatRoomId, roomId);
    assert.equal(error.activeTutorId, tutorId);
    assert.equal(error.activeConnectRequestId, connectionId);
    return true;
  });
});
