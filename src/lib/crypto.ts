import crypto from "node:crypto";
import { serverEnv } from "./env";

// AES-256-GCM token-at-rest encryption.
// Layout: base64(iv | ciphertext | authTag)

const ALGO = "aes-256-gcm";
const IV_BYTES = 12;
const KEY_BYTES = 32;

function getKey(): Buffer {
  const key = serverEnv.TOKEN_ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "TOKEN_ENCRYPTION_KEY is not set. Generate one: openssl rand -hex 32"
    );
  }
  const buf = Buffer.from(key, "hex");
  if (buf.length !== KEY_BYTES) {
    throw new Error(
      `TOKEN_ENCRYPTION_KEY must be ${KEY_BYTES} bytes (hex-encoded). Got ${buf.length}.`
    );
  }
  return buf;
}

export function encryptToken(plaintext: string): string {
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, enc, tag]).toString("base64");
}

export function decryptToken(payload: string): string {
  const buf = Buffer.from(payload, "base64");
  const iv = buf.subarray(0, IV_BYTES);
  const tag = buf.subarray(buf.length - 16);
  const enc = buf.subarray(IV_BYTES, buf.length - 16);
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString("utf8");
}

// HMAC-SHA256 verification for Meta's x-hub-signature-256 header.
// Meta sends "sha256=<hex>" — we compare against HMAC of the RAW request body.
export function verifyMetaSignature(
  rawBody: string | Buffer,
  signatureHeader: string | null | undefined,
  appSecret: string
): boolean {
  if (!signatureHeader) return false;
  const expected = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice(7)
    : signatureHeader;
  const computed = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");
  if (expected.length !== computed.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(computed));
}

// Generate a random URL-safe state token for OAuth flows
export function generateOAuthState(): string {
  return crypto.randomBytes(24).toString("base64url");
}
