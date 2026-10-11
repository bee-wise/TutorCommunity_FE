import type { z } from "zod";
import type { videoUploadSchema } from "../schemas/tutor.schema";

// R2 is an external presigned upload, not a BeeWise API request. Never send session cookies.
export async function uploadInterviewVideo(upload: z.infer<typeof videoUploadSchema>, video: Blob, signal?: AbortSignal): Promise<void> {
  const response = await fetch(upload.url, {
    method: "PUT", body: video, headers: { "Content-Type": upload.content_type },
    credentials: "omit", signal,
  });
  if (!response.ok) throw new Error("Chưa tải được video. Giữ trang mở và thử tải lại trước khi nộp bài.");
}
