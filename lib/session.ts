export const SESSION_COOKIE_NAME = "scratchgolf_session";
const SESSION_VALUE = "authenticated";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toHex(signature);
}

export async function createSessionCookieValue(): Promise<string> {
  const signature = await hmac(SESSION_VALUE, getSecret());
  return `${SESSION_VALUE}.${signature}`;
}

export async function isValidSessionCookieValue(
  cookieValue: string | undefined,
): Promise<boolean> {
  if (!cookieValue) return false;
  const [value, signature] = cookieValue.split(".");
  if (value !== SESSION_VALUE || !signature) return false;
  const expected = await hmac(SESSION_VALUE, getSecret());
  return signature === expected;
}
