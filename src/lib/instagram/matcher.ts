import type { MatchMode } from "../types";

// Match a comment against a list of keywords. Returns the first matching keyword
// or null. Used by the webhook processor to decide whether to fire an automation.
export function matchKeyword(opts: {
  text: string;
  keywords: string[];
  mode: MatchMode;
  caseSensitive: boolean;
}): string | null {
  const { text, keywords, mode, caseSensitive } = opts;
  if (!text || keywords.length === 0) return null;

  const haystack = caseSensitive ? text : text.toLowerCase();

  for (const raw of keywords) {
    const k = caseSensitive ? raw : raw.toLowerCase();
    if (mode === "exact" && haystack.trim() === k) return raw;
    if (mode === "starts_with" && haystack.trim().startsWith(k)) return raw;
    if (mode === "contains") {
      // Token-level match so "linker" doesn't trigger on "link"
      const tokens = haystack.split(/[^\p{L}\p{N}_]+/u);
      if (tokens.includes(k)) return raw;
    }
  }
  return null;
}

// Replace simple template variables in a DM/reply body.
// Supported: {username}, {keyword}, {first_name}
export function renderTemplate(
  body: string,
  vars: { username?: string; keyword?: string; first_name?: string }
): string {
  return body
    .replace(/\{username\}/g, vars.username || "")
    .replace(/\{keyword\}/g, vars.keyword || "")
    .replace(/\{first_name\}/g, vars.first_name || "");
}
