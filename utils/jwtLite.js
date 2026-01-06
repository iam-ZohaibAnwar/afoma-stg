/**
 * Lightweight JWT helpers for the client.
 *
 * IMPORTANT:
 * - This does NOT verify signatures (you can't securely verify on the client anyway).
 * - Use this only for UI decisions (role-based menus, etc).
 * - Real authZ must be enforced server-side (middleware / APIs).
 */

function base64UrlDecode(input) {
  if (!input) return null;
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  // Browser
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    const binary = window.atob(padded);
    // Convert binary string to UTF-8
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  // Node / SSR fallback
  // eslint-disable-next-line no-undef
  return Buffer.from(padded, "base64").toString("utf8");
}

export function decodeJwtPayload(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const json = base64UrlDecode(parts[1]);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isJwtExpired(payload) {
  const exp = payload?.exp;
  if (!exp) return false; // treat missing exp as non-expiring for UI purposes
  const nowSec = Math.floor(Date.now() / 1000);
  return exp <= nowSec;
}

