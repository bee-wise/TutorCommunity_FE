import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

// All API writes are intercepted in an isolated browser context. No real interviews are started.
const packageDirectory = process.env.BEEWISE_PLAYWRIGHT_MODULE_DIR;
const requireRuntime = createRequire(packageDirectory ? path.join(packageDirectory, "package.json") : import.meta.url);
const { chromium } = requireRuntime("playwright");
const saleUrl = process.env.BEEWISE_SALE_QA_URL ?? "http://localhost:3100";
const staffUrl = process.env.BEEWISE_STAFF_QA_URL ?? "http://localhost:3102";
const outputDirectory = path.resolve(process.env.BEEWISE_QA_OUTPUT ?? ".tmp/ai-interviews-qa");
await mkdir(outputDirectory, { recursive: true });
const id = "12345678-1234-4234-9234-123456789abc";
const tutorId = "12345678-1234-4234-9234-123456789abd";
const now = "2026-10-10T08:00:00Z";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
const localServers = [];

async function startLocalServer(app, url) {
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", `apps/${app}`, "-p", new URL(url).port], { stdio: ["ignore", "pipe", "pipe"] });
  localServers.push(child);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`QA server ${app} did not become ready`)), 30000);
    child.on("error", (error) => { clearTimeout(timer); reject(error); });
    child.on("exit", (code) => { clearTimeout(timer); reject(new Error(`QA server ${app} exited with ${code}`)); });
    child.stderr.on("data", (chunk) => process.stderr.write(chunk));
    child.stdout.on("data", (chunk) => { if (chunk.toString().includes("Ready in")) { clearTimeout(timer); resolve(); } });
  });
}

async function createSession(role, mobile = false) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const jwt = ["e30", Buffer.from(JSON.stringify({ role: role.toUpperCase() })).toString("base64url"), "qa-only"].join(".");
  await context.addCookies([{ name: "beewise_access_token", value: jwt, domain: "localhost", path: "/" }, { name: "beewise_has_session", value: "1", domain: "localhost", path: "/" }]);
  const session = { context, calls: [], phase: "NOT_STARTED", answerCount: 0, videoCount: 0, submitted: false, decision: false, grant: false, policyCreated: false, activated: false };
  const rubricContent = { version: "v1", language: "vi", questions: Array.from({ length: 6 }, (_, index) => ({ q_code: `Q${index + 1}`, text: "Nêu kinh nghiệm giảng dạy", prep_seconds: 30, answer_seconds: 90, weight: 1 / 6, criteria: [{ criterion_code: `Q${index + 1}.C1`, description: "Có ví dụ cụ thể", levels: ["Chưa thể hiện", "Ít", "Cơ bản", "Tốt", "Rất tốt"] }] })), thresholds: { pass: 70 }, extra_setting: { enabled: true } };
  const prompt = {
    q_code: "Q1", kind: "main", title: "Kinh nghiệm giảng dạy", group: "Giới thiệu", question_number: 1, total_questions: 1,
    text: "Chia sẻ kinh nghiệm giảng dạy của bạn.\nNêu một ví dụ cụ thể.", prep_seconds: 1, answer_seconds: 2,
    video_upload: { url: "https://qa-r2.invalid/video", method: "PUT", content_type: "video/webm", key: "qa-video" },
  };
  const state = () => ({ interview_id: id, status: session.submitted ? "COMPLETED" : "IN_PROGRESS", intro: "Xin chào, hãy chia sẻ kinh nghiệm của bạn.", prompt: session.answerCount && !session.processing ? null : prompt, all_answered: session.answerCount > 0 && !session.processing, outro: "Cảm ơn bạn đã hoàn thành." });
  const summary = { overall_score: 75, score_complete: true, assessment_level: "Meets Expectations", requires_human_review: true, human_review_reasons: ["DATA_CONFLICT"], questions: [{ q_code: "Q1", title: "Giới thiệu", points: 15, max_points: 20 }] };
  const packageData = () => ({
    interview: { interview_id: id, tutor_id: tutorId, status: session.decision ? "APPROVED" : "PENDING_REVIEW", rubric_version: "v1", language: "vi", overall_score: 75, manual_review_required: true, started_at: now, submitted_at: now },
    summary,
    report: { data_conflicts: [{ q_code: "Q1", criterion_codes: ["Q1.C1"], interview_quote: "Tôi đã dạy 5 năm.", profile: { fact_id: "experience", label: "Kinh nghiệm", text: "2 năm" }, note: "Cần xác minh số năm", status: "OPEN" }], strengths: ["Giải thích rõ"], improvements: ["Thêm ví dụ"], verification_required: [], items_to_check: [] },
    questions: [{ q_code: "Q1", title: "Giới thiệu", objective: "Kinh nghiệm và cách dạy", max_points: 20, points: 15, turn: null, criteria: [{ criterion_code: "Q1.C1", description: "Kinh nghiệm", weight: 1, levels: ["Chưa thể hiện", "Ít", "Cơ bản", "Tốt", "Rất tốt"], score_status: "SCORED", score: 3, effective_score: 3, evidence: [{ q_code: "Q1", quote: "Tôi chuẩn bị bài theo mục tiêu.", type: "DIRECT" }] }] }],
    decisions: session.decision ? [{ id: 1, decision: "APPROVED", reason: null, feedback: "Đạt yêu cầu", details: null, consultant_id: id, created_at: now, synced_at: null }] : [], tutor: { fullName: "Gia sư kiểm thử", experience: "2 năm" }, tutor_error: null,
  });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "qa-r2.invalid") {
      const headers = { "access-control-allow-origin": "*", "access-control-allow-methods": "PUT,OPTIONS", "access-control-allow-headers": "content-type" };
      if (route.request().method() === "OPTIONS") return route.fulfill({ status: 200, headers });
      session.videoCount += 1;
      if (session.failVideoOnce) { session.failVideoOnce = false; return route.fulfill({ status: 500, headers }); }
      return route.fulfill({ status: 200, headers });
    }
    if (url.hostname !== "localhost") return route.abort();
    return route.continue();
  });
  await context.route("**/api/**", async (route) => {
    const request = route.request(); const url = new URL(request.url()); const pathname = url.pathname;
    session.calls.push({ path: pathname, method: request.method(), body: request.postData() });
    const respond = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (pathname === "/api/auth/me") return respond({ success: true, data: { id: tutorId, firstName: "Gia sư", lastName: "kiểm thử", fullName: "Gia sư kiểm thử", email: "qa@example.invalid", role: role.toUpperCase(), status: "ACTIVE", permissions: [], tutorProfileId: tutorId, tutorProfileStatus: "APPROVED", tutorOnboardingStatus: "APPROVED", isInterviewed: false, canAccessTutorLms: false } });
    const endpoint = pathname.replace("/api/ai/interview", "");
    if (endpoint === "/policy") return respond({ version: "v1", content: "Quy định kiểm thử\nDạy đúng lịch và bảo vệ dữ liệu học viên.", confirmation_text: "Tôi đã đọc và hiểu quy định kiểm thử." });
    if (endpoint === "/me/eligibility") return respond({ state: session.phase, attempts_used: session.phase === "NOT_STARTED" ? 0 : 1, attempts_allowed: 1, interview_id: session.phase === "NOT_STARTED" ? null : id, policy_version: "v1" });
    if (endpoint === "/mic-check") return respond({ ok: true });
    if (endpoint === "/consents") {
      const body = request.postDataJSON();
      assert.deepEqual(body, { policy_version: "v1", checks: { camera: true, mic: true, network: true, time_confirmed: true } });
      return respond({ consent_id: id }, 201);
    }
    if (endpoint === "/interviews" && request.method() === "POST") { session.phase = "IN_PROGRESS"; return respond(state(), 201); }
    if (endpoint === `/interviews/${id}`) {
      if (session.processing) { session.processingReads = (session.processingReads ?? 0) + 1; if (session.processingReads >= 2) session.processing = false; }
      return respond(state());
    }
    if (endpoint === `/interviews/${id}/answer`) {
      session.answerCount += 1;
      if (session.testProcessing) { session.processing = true; return respond({ detail: { code: "processing", message: "Đang xử lý câu trả lời." } }, 409); }
      return respond(state());
    }
    if (endpoint === `/interviews/${id}/submit`) { session.submitted = true; session.phase = "USED"; return respond({ interview_id: id, status: "COMPLETED" }); }
    if (endpoint === `/interviews/${id}/heartbeat`) return respond({ interview_id: id, status: "IN_PROGRESS" });
    if (endpoint === `/interviews/${id}/package`) return respond(packageData());
    if (endpoint === "/interviews") return respond([{ interview_id: id, tutor_id: tutorId, status: "PENDING_REVIEW", overall_score: 75, manual_review_required: true, started_at: now, submitted_at: now, last_activity_at: now }]);
    if (endpoint === "/audit-logs") return respond([]);
    if (endpoint === `/interviews/${id}/override`) return respond({ criterion_code: "Q1.C1", override_level: 4, overall_score: 80, summary });
    if (endpoint === `/interviews/${id}/decision`) { session.decision = true; return respond({ decision_id: 1, status: "APPROVED" }); }
    if (endpoint === `/tutors/${tutorId}/attempt-grants`) { session.grant = true; return respond({ grant_id: 1, attempts_allowed: 2 }, 201); }
    if (endpoint === "/policies" && request.method() === "POST") { session.policyCreated = true; return respond({ version: "v2", is_active: false }, 201); }
    if (endpoint === "/policies") return respond([{ version: "v1", content: "Nội dung quy định", confirmation_text: "Tôi đồng ý", is_active: true, created_by: id, created_at: now }, ...(session.policyCreated ? [{ version: "v2", content: "Quy định mới", confirmation_text: "Tôi đã đọc", is_active: session.activated, created_by: id, created_at: now }] : [])]);
    if (endpoint === "/policies/v2/activate") { session.activated = true; return route.fulfill({ status: 204 }); }
    if (endpoint === "/rubrics" && request.method() === "POST") {
      session.rubricUploadCount = (session.rubricUploadCount ?? 0) + 1;
      if (session.rubricUploadCount === 1) return respond({ detail: { code: "rubric_invalid", message: "Kiểm thử: vui lòng kiểm tra cấu hình barem." } }, 422);
      const source = request.postData().match(/filename="rubric\.toml"[^]*?\r\n\r\n([^]*?)\r\n--/)?.[1];
      assert.ok(source, "Editor must upload a TOML file through multipart");
      assert.ok(process.env.BEEWISE_PYTHON, "Set BEEWISE_PYTHON to verify uploaded TOML");
      const parsed = spawnSync(process.env.BEEWISE_PYTHON, ["-c", "import json,sys,tomllib; print(json.dumps(tomllib.loads(sys.stdin.read()),ensure_ascii=False))"], { input: source, encoding: "utf8" });
      assert.equal(parsed.status, 0, parsed.stderr); session.createdRubric = JSON.parse(parsed.stdout);
      assert.equal(session.createdRubric.version, "v2"); assert.equal(session.createdRubric.thresholds.pass, 80);
      assert.deepEqual(session.createdRubric.extra_setting, rubricContent.extra_setting);
      assert.equal(session.createdRubric.questions.length, 6);
      return respond({ version: "v2", is_active: false, note: "Đổi ngưỡng đánh giá", created_by: id, created_at: now }, 201);
    }
    if (endpoint === "/rubrics") return respond([{ version: "v1", is_active: !session.rubricActivated, is_default: false, note: "Barem kiểm thử", created_by: id, created_at: now }, ...(session.createdRubric ? [{ version: "v2", is_active: Boolean(session.rubricActivated), is_default: false, note: "Đổi ngưỡng đánh giá", created_by: id, created_at: now }] : [])]);
    if (endpoint === "/rubrics/v1") return respond({ version: "v1", is_active: true, note: null, content: rubricContent });
    if (endpoint === "/rubrics/v2") return respond({ version: "v2", is_active: Boolean(session.rubricActivated), note: "Đổi ngưỡng đánh giá", content: session.createdRubric });
    if (endpoint === "/rubrics/v2/activate") { session.rubricActivated = true; return route.fulfill({ status: 204 }); }
    return respond({ success: true, data: [] });
  });
  if (role === "tutor") await context.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      const audio = new AudioContext(); await audio.resume();
      const source = audio.createOscillator(); source.frequency.value = 250;
      const gain = audio.createGain(); gain.gain.value = 0.1;
      const output = audio.createMediaStreamDestination(); source.connect(gain); gain.connect(output); source.start();
      const canvas = document.createElement("canvas"); canvas.width = 640; canvas.height = 480;
      const painter = canvas.getContext("2d"); painter.fillStyle = "#0c1eaa"; painter.fillRect(0, 0, 640, 480);
      return new MediaStream([...output.stream.getAudioTracks(), ...canvas.captureStream(10).getVideoTracks()]);
    };
  });
  session.page = await context.newPage(); session.errors = [];
  session.page.on("pageerror", (error) => session.errors.push(error.message));
  return session;
}
async function screenshot(session, name) { await session.page.screenshot({ path: path.join(outputDirectory, `${name}.png`), fullPage: true }); }

try {
  if (process.env.BEEWISE_QA_AUTO_START === "1") await Promise.all([startLocalServer("sale", saleUrl), startLocalServer("staff", staffUrl)]);
  const tutor = await createSession("tutor"); const page = tutor.page;
  tutor.testProcessing = true; tutor.failVideoOnce = true;
  await page.goto(`${saleUrl}/tutor/onboarding`);
  await page.getByRole("heading", { name: "Quy định nền tảng", exact: true }).waitFor();
  assert.equal(await page.getByRole("heading", { name: "Quy định nền tảng", exact: true }).count(), 1, "The recorder UI must mount only once across breakpoints");
  await screenshot(tutor, "tutor-policy-desktop");
  await page.getByRole("checkbox", { name: "Tôi đã đọc và hiểu quy định kiểm thử." }).check();
  await page.getByRole("button", { name: "Tiếp tục kiểm tra thiết bị" }).click();
  await page.getByRole("button", { name: "Kết nối camera và micro" }).click();
  await page.getByRole("button", { name: "Ghi thử micro", exact: true }).click();
  await page.getByText("Micro đã đạt kiểm tra", { exact: true }).first().waitFor({ timeout: 15000 });
  assert.equal(tutor.calls.filter((call) => call.path.endsWith("/interviews") && call.method === "POST").length, 0);
  await page.getByRole("checkbox", { name: "Tôi đã dành đủ thời gian" }).check();
  await page.getByRole("button", { name: "Xác nhận kiểm tra", exact: true }).click();
  await page.getByRole("button", { name: "Có, bắt đầu phỏng vấn" }).waitFor();
  assert.equal(tutor.calls.filter((call) => call.path.endsWith("/interviews") && call.method === "POST").length, 0);
  await page.getByRole("button", { name: "Có, bắt đầu phỏng vấn" }).click();
  await page.getByRole("button", { name: "Xem câu hỏi đầu tiên" }).click();
  await page.getByRole("button", { name: "Nộp bài phỏng vấn", exact: true }).waitFor({ timeout: 15000 });
  assert.equal(tutor.answerCount, 1); assert.ok(tutor.videoCount >= 1);
  assert.equal(await page.getByRole("button", { name: "Nộp bài phỏng vấn", exact: true }).isDisabled(), true);
  await page.getByRole("button", { name: "Thử tải lại 1 video", exact: true }).click();
  await screenshot(tutor, "tutor-complete-desktop");
  await page.getByRole("button", { name: "Nộp bài phỏng vấn", exact: true }).click();
  await page.getByRole("heading", { name: "Đã nộp, chờ chấm" }).waitFor(); assert.equal(tutor.submitted, true);
  assert.deepEqual(tutor.errors, []); results.push("Tutor: policy → real MediaRecorder pre-check → explicit start → timed audio/video → processing recovery without duplicate answers → failed video retry → submit; single mounted instance"); await tutor.context.close();

  const consultant = await createSession("consultant");
  await consultant.page.goto(`${staffUrl}/consultant/ai-interviews`);
  await consultant.page.getByRole("link", { name: "Xem hồ sơ", exact: true }).click();
  await consultant.page.getByRole("heading", { name: "Mâu thuẫn cần xác minh" }).waitFor(); await screenshot(consultant, "consultant-review-desktop");
  await consultant.page.getByText("Barem và điểm Consultant", { exact: true }).click();
  await consultant.page.getByRole("radio", { name: "4", exact: true }).check();
  await consultant.page.getByLabel("Lý do chấm lại").fill("Bằng chứng đầy đủ trong bản chép lời.");
  await consultant.page.getByRole("button", { name: "Lưu điểm Consultant", exact: true }).click();
  await consultant.page.getByLabel("Phản hồi gửi gia sư").fill("Đạt yêu cầu");
  await consultant.page.getByRole("button", { name: "Lưu quyết định", exact: true }).click();
  await consultant.page.getByText("Đang chờ đồng bộ BeeWise Core").waitFor(); assert.equal(consultant.decision, true);
  assert.deepEqual(consultant.errors, []); results.push("Consultant: queue → package/conflicts → criterion override → decision → Core sync state"); await consultant.context.close();

  const admin = await createSession("admin", true);
  await admin.page.goto(`${staffUrl}/admin/ai-interviews`);
  await admin.page.getByRole("link", { name: "Xem hồ sơ", exact: true }).click();
  await admin.page.getByRole("heading", { name: "Thao tác Admin", exact: true }).waitFor();
  assert.equal(await admin.page.getByRole("button", { name: "Lưu quyết định", exact: true }).count(), 0);
  await admin.page.getByRole("button", { name: "Xóa dữ liệu phỏng vấn", exact: true }).click();
  assert.equal(await admin.page.getByRole("button", { name: "Xác nhận", exact: true }).isDisabled(), true);
  await admin.page.getByRole("button", { name: "Hủy", exact: true }).click();
  await screenshot(admin, "admin-review-mobile");
  await admin.page.goto(`${staffUrl}/admin/ai-interviews/settings`);
  await admin.page.getByRole("button", { name: "Sao chép để sửa", exact: true }).click();
  assert.equal(await admin.page.getByLabel("Nội dung quy định", { exact: true }).inputValue(), "Nội dung quy định");
  assert.equal(await admin.page.getByLabel("Câu xác nhận của gia sư", { exact: true }).inputValue(), "Tôi đồng ý");
  assert.equal(await admin.page.getByLabel("Phiên bản", { exact: true }).inputValue(), "");
  await admin.page.getByLabel("Phiên bản", { exact: true }).fill("v2");
  await admin.page.getByLabel("Nội dung quy định", { exact: true }).fill("Quy định mới");
  await admin.page.getByLabel("Câu xác nhận của gia sư", { exact: true }).fill("Tôi đã đọc");
  await admin.page.getByRole("button", { name: "Tạo quy định", exact: true }).click();
  await admin.page.getByRole("heading", { name: "Quy định v2", exact: true }).waitFor();
  await admin.page.getByRole("button", { name: "Áp dụng", exact: true }).last().click();
  await admin.page.getByRole("button", { name: "Xác nhận áp dụng", exact: true }).click();
  await admin.page.getByText("Đã áp dụng quy định mới.", { exact: true }).waitFor();
  assert.equal(admin.activated, true);
  await admin.page.getByRole("button", { name: "Bộ câu hỏi và barem", exact: true }).click();
  await admin.page.getByLabel("File TOML", { exact: true }).setInputFiles({ name: "sample.toml", mimeType: "application/toml", buffer: Buffer.from('version = "v2"') });
  await admin.page.getByText("sample.toml · 0.0 KB", { exact: true }).waitFor();
  await admin.page.getByRole("button", { name: "Bỏ file TOML", exact: true }).click();
  await admin.page.getByText("Chưa chọn file", { exact: true }).waitFor();
  await admin.page.getByRole("button", { name: "Xem cấu hình và lịch sử", exact: true }).click();
  await admin.page.getByRole("heading", { name: "Cấu hình v1", exact: true }).waitFor(); await screenshot(admin, "admin-rubric-mobile");
  const exported = admin.page.waitForEvent("download");
  await admin.page.getByRole("button", { name: "Xuất TOML", exact: true }).click();
  assert.equal((await exported).suggestedFilename(), "rubric-v1.toml");
  await admin.page.getByRole("button", { name: "Chỉnh thành bản mới", exact: true }).click();
  await admin.page.getByLabel("Phiên bản rubric mới", { exact: true }).fill("v2");
  const thresholdToggle = admin.page.getByRole("button", { name: "Ngưỡng đánh giá", exact: true });
  if (await thresholdToggle.getAttribute("aria-expanded") === "false") await thresholdToggle.click();
  await admin.page.getByLabel("rubric.thresholds.pass", { exact: true }).fill("80");
  await admin.page.getByRole("heading", { name: "Tạo bộ câu hỏi từ v1", exact: true }).locator("..").getByLabel("Ghi chú thay đổi", { exact: true }).fill("Đổi ngưỡng đánh giá");
  await admin.page.getByRole("button", { name: "Tạo phiên bản rubric", exact: true }).click();
  await admin.page.getByRole("alert").filter({ hasText: "Kiểm thử: vui lòng kiểm tra cấu hình barem." }).first().waitFor();
  assert.equal(await admin.page.getByLabel("Phiên bản rubric mới", { exact: true }).inputValue(), "v2");
  assert.equal(await admin.page.getByLabel("rubric.thresholds.pass", { exact: true }).inputValue(), "80");
  await screenshot(admin, "admin-rubric-editor-mobile");
  await admin.page.getByRole("button", { name: "Tạo phiên bản rubric", exact: true }).click();
  await admin.page.getByRole("heading", { name: "Cấu hình v2", exact: true }).waitFor();
  assert.equal(admin.rubricActivated, undefined, "Creating a version must not activate it");
  await admin.page.getByRole("heading", { name: "Rubric v2", exact: true }).locator("..").locator("..").getByRole("button", { name: "Áp dụng", exact: true }).click();
  await admin.page.getByRole("button", { name: "Xác nhận áp dụng", exact: true }).click();
  await admin.page.getByText("Đã áp dụng bộ câu hỏi mới.", { exact: true }).waitFor();
  assert.equal(admin.rubricActivated, true);
  assert.equal(await admin.page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  assert.deepEqual(admin.errors, []); results.push("Admin: mobile package → delete guard → copy/create/activate policy → export TOML → edit rubric/retain draft on validation error → create separate version → activate; no page overflow"); await admin.context.close();
  process.stdout.write(JSON.stringify({ passed: results, screenshots: outputDirectory }, null, 2) + "\n");
} finally {
  await browser.close();
  for (const child of localServers) {
    if (!child.pid || child.exitCode !== null) continue;
    if (process.platform === "win32") spawnSync("taskkill.exe", ["/PID", String(child.pid), "/T", "/F"]);
    else child.kill("SIGTERM");
  }
}
