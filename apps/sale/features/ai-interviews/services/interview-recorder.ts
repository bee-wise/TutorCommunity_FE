export interface CapturedAnswer { audio: Blob; video: Blob | null; durationMs: number }
export interface RecordingFormats { audio: string; video: string; videoMime: "video/webm" | "video/mp4" }

export function getRecordingFormats(): RecordingFormats {
  if (typeof MediaRecorder === "undefined") throw new Error("Trình duyệt chưa hỗ trợ ghi hình. Hãy dùng Chrome, Edge, Firefox hoặc Safari mới.");
  const audio = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type));
  const video = ["video/webm;codecs=vp8,opus", "video/webm", "video/mp4"].find((type) => MediaRecorder.isTypeSupported(type));
  if (!audio || !video) throw new Error("Không tìm được định dạng ghi âm và video được hỗ trợ.");
  return { audio, video, videoMime: video.startsWith("video/mp4") ? "video/mp4" : "video/webm" };
}

function collectRecorder(recorder: MediaRecorder): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    recorder.onerror = () => reject(new Error("Thiết bị không ghi được âm thanh hoặc video. Vui lòng kiểm tra lại."));
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType }));
  });
}

export class InterviewRecorder {
  private audioRecorder: MediaRecorder | null = null;
  private videoRecorder: MediaRecorder | null = null;
  private result: Promise<[Blob, Blob | null]> | null = null;
  private audioContext: AudioContext | null = null;
  private signalTimer: ReturnType<typeof setInterval> | null = null;
  private startedAt = 0;
  private audible = false;
  private stopping: Promise<CapturedAnswer> | null = null;

  constructor(public readonly stream: MediaStream, public readonly formats: RecordingFormats) {}

  async start(withVideo: boolean): Promise<void> {
    if (this.result) throw new Error("Bản ghi trước đang được xử lý.");
    if (this.stream.getTracks().some((track) => track.readyState !== "live")) throw new Error("Camera hoặc micro đã ngắt. Hãy kiểm tra lại thiết bị.");
    this.audioContext = new AudioContext();
    await this.audioContext.resume();
    const analyser = this.audioContext.createAnalyser();
    this.audioContext.createMediaStreamSource(this.stream).connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    this.audible = false;
    this.signalTimer = setInterval(() => {
      analyser.getByteTimeDomainData(samples);
      if (samples.some((sample) => Math.abs(sample - 128) > 1)) this.audible = true;
    }, 100);
    this.audioRecorder = new MediaRecorder(new MediaStream(this.stream.getAudioTracks()), { mimeType: this.formats.audio, audioBitsPerSecond: 96000 });
    this.videoRecorder = withVideo ? new MediaRecorder(this.stream, { mimeType: this.formats.video, videoBitsPerSecond: 1000000 }) : null;
    this.result = Promise.all([collectRecorder(this.audioRecorder), this.videoRecorder ? collectRecorder(this.videoRecorder) : Promise.resolve(null)]);
    // Recorder errors can occur before stop() is invoked.
    void this.result.catch(() => undefined);
    this.startedAt = performance.now(); this.stopping = null;
    try { this.audioRecorder.start(1000); this.videoRecorder?.start(1000); }
    catch (error) { this.dispose(); throw error; }
  }

  stop(): Promise<CapturedAnswer> {
    if (this.stopping) return this.stopping;
    const result = this.result;
    if (!result) return Promise.reject(new Error("Chưa có bản ghi."));
    const durationMs = Math.max(1, Math.round(performance.now() - this.startedAt));
    for (const recorder of [this.audioRecorder, this.videoRecorder]) if (recorder?.state !== "inactive") recorder?.stop();
    this.stopping = result.then(([audio, video]) => {
      if (!this.audible || this.stream.getAudioTracks().some((track) => track.readyState !== "live")) throw new Error("Micro không thu được tín hiệu. Hãy kiểm tra micro rồi ghi lại.");
      return { audio, video, durationMs };
    }).finally(() => { this.result = null; this.clearSignal(); });
    return this.stopping;
  }

  private clearSignal(): void {
    if (this.signalTimer) clearInterval(this.signalTimer);
    this.signalTimer = null;
    if (this.audioContext) void this.audioContext.close();
    this.audioContext = null;
  }
  dispose(): void {
    for (const recorder of [this.audioRecorder, this.videoRecorder]) if (recorder?.state !== "inactive") recorder?.stop();
    this.clearSignal();
    this.stream.getTracks().forEach((track) => track.stop());
    this.result = null;
  }
}
