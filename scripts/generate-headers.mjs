// Generates dist/_headers (Netlify's HTTP header syntax) after the Vite build.
// The CSP's script-src is hash-pinned against the actual inline <script> that
// ships in dist/index.html, so it stays correct even after minification and
// never needs 'unsafe-inline' / 'unsafe-eval'.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distIndexPath = path.join(rootDir, "dist", "index.html");

if (!existsSync(distIndexPath)) {
  console.error("[generate-headers] dist/index.html not found — run `vite build` first.");
  process.exit(1);
}

const html = readFileSync(distIndexPath, "utf8");

function sha256Base64(content) {
  return createHash("sha256").update(content, "utf8").digest("base64");
}

const scriptHashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((m) => m[1].trim())
  .filter(Boolean)
  .map((code) => `'sha256-${sha256Base64(code)}'`);

if (scriptHashes.length === 0) {
  console.warn("[generate-headers] no inline <script> found in dist/index.html — script-src will only allow 'self'.");
}

// Read the n8n webhook origin from the build-time env, if configured, so the
// analytics POST in src/lib/analytics.ts isn't blocked by connect-src.
const webhookUrl = process.env.VITE_N8N_WEBHOOK_URL;
let webhookOrigin = "";
if (webhookUrl) {
  try {
    webhookOrigin = new URL(webhookUrl).origin;
  } catch {
    console.warn(`[generate-headers] VITE_N8N_WEBHOOK_URL is not a valid URL, ignoring: ${webhookUrl}`);
  }
}

const connectSrc = ["'self'", "https://wa.me", "https://*.whatsapp.com", webhookOrigin].filter(Boolean).join(" ");

const csp = [
  `default-src 'self'`,
  `script-src 'self' ${scriptHashes.join(" ")}`.trim(),
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  `img-src 'self' data: blob:`,
  `media-src 'self' blob:`,
  `connect-src ${connectSrc}`,
  `frame-src 'none'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const headers = `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), interest-cohort=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
`;

writeFileSync(path.join(rootDir, "dist", "_headers"), headers);
console.log("[generate-headers] wrote dist/_headers");
