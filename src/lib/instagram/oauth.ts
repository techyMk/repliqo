import { serverEnv, igScopes } from "../env";

// Build the Instagram authorize URL (Instagram Login flavor).
// Docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
export function buildInstagramAuthUrl(state: string): string {
  if (!serverEnv.INSTAGRAM_CLIENT_ID || !serverEnv.INSTAGRAM_REDIRECT_URI) {
    throw new Error("Instagram OAuth env vars are missing.");
  }
  const url = new URL("https://www.instagram.com/oauth/authorize");
  url.searchParams.set("client_id", serverEnv.INSTAGRAM_CLIENT_ID);
  url.searchParams.set("redirect_uri", serverEnv.INSTAGRAM_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", igScopes().join(","));
  url.searchParams.set("state", state);
  return url.toString();
}
