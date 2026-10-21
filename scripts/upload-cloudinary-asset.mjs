// Uploads one local file to Cloudinary with a fixed public_id, so its URL is predictable.
// Usage (PowerShell, repo root):
//   npm run assets:upload -- <local-file> <public_id>
//   npm run assets:upload -- apps/sale/public/video/videoplayback.mp4 Beewise/Assets/Videos/tutor-intro-sample
// Reads CLOUDINARY_* from .env.local. Overwrites an existing asset with the same public_id.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

const [file, publicId] = process.argv.slice(2);
if (!file || !publicId) throw new Error("Usage: npm run assets:upload -- <local-file> <public_id>");

const root = resolve(import.meta.dirname, "..");
const env = Object.fromEntries(
  readFileSync(resolve(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => /^\s*CLOUDINARY_\w+\s*=/.test(l))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);
const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = env;
if (!cloud || !key || !secret) throw new Error("Missing CLOUDINARY_* in .env.local");

const ext = extname(file).toLowerCase();
const type = [".mp4", ".webm", ".mov"].includes(ext) ? "video" : [".pdf", ".zip", ".json"].includes(ext) ? "raw" : "image";
const timestamp = Math.floor(Date.now() / 1000);
const params = { overwrite: "true", public_id: publicId, timestamp: String(timestamp) };
const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
const signature = createHash("sha1").update(toSign + secret).digest("hex");

const form = new FormData();
form.append("file", new Blob([readFileSync(resolve(root, file))]), basename(file));
for (const [k, v] of Object.entries(params)) form.append(k, v);
form.append("api_key", key);
form.append("signature", signature);

const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${type}/upload`, { method: "POST", body: form });
const data = await res.json();
if (!res.ok) throw new Error(`Upload failed: HTTP ${res.status} ${JSON.stringify(data)}`);
console.log(`Uploaded ${file}\n${data.secure_url}`);
