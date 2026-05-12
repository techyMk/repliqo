// =============================================================================
// Instagram Graph API client (Instagram Login flavor, no Facebook Page required)
//
// Endpoints we care about:
//   OAuth authorize:  https://www.instagram.com/oauth/authorize
//   Short-lived token: POST https://api.instagram.com/oauth/access_token
//   Long-lived token:  GET  https://graph.instagram.com/access_token
//   User info:         GET  https://graph.instagram.com/me
//   Send DM:           POST https://graph.instagram.com/v23.0/me/messages
//   Reply to comment:  POST https://graph.instagram.com/{comment_id}/replies
//
// Per the build doc (Part 4.1, 4.7), graph.instagram.com responses can be
// flaky for some app configs — we fall back to graph.facebook.com when needed.
// =============================================================================

import { serverEnv } from "../env";

const GRAPH_VERSION = "v23.0";
const INSTAGRAM_OAUTH_BASE = "https://api.instagram.com";
const GRAPH_INSTAGRAM = "https://graph.instagram.com";
const GRAPH_FACEBOOK = `https://graph.facebook.com/${GRAPH_VERSION}`;

export class InstagramApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: number,
    public subcode?: number,
    public fbTraceId?: string,
    public raw?: unknown
  ) {
    super(message);
    this.name = "InstagramApiError";
  }
}

async function metaFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }

  if (!res.ok) {
    const err = body?.error;
    throw new InstagramApiError(
      err?.message || `Meta API ${res.status}`,
      res.status,
      err?.code,
      err?.error_subcode,
      err?.fbtrace_id,
      body
    );
  }
  return body as T;
}

// -----------------------------------------------------------------------------
// OAuth: exchange code → short-lived → long-lived
// -----------------------------------------------------------------------------

export type ShortLivedToken = { access_token: string; user_id: string };
export type LongLivedToken = {
  access_token: string;
  token_type: "bearer" | string;
  expires_in: number; // seconds (~60 days)
};

export async function exchangeCodeForShortLivedToken(
  code: string
): Promise<ShortLivedToken> {
  if (!serverEnv.INSTAGRAM_CLIENT_ID || !serverEnv.INSTAGRAM_CLIENT_SECRET || !serverEnv.INSTAGRAM_REDIRECT_URI) {
    throw new Error("Instagram OAuth env vars are missing.");
  }
  const form = new URLSearchParams({
    client_id: serverEnv.INSTAGRAM_CLIENT_ID,
    client_secret: serverEnv.INSTAGRAM_CLIENT_SECRET,
    grant_type: "authorization_code",
    redirect_uri: serverEnv.INSTAGRAM_REDIRECT_URI,
    code,
  });
  return metaFetch<ShortLivedToken>(`${INSTAGRAM_OAUTH_BASE}/oauth/access_token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
}

// Per build doc Part 3.5 / 4.1: this call sometimes returns "Unsupported request"
// — we try GET first, then POST, then a versioned path. Caller decides what to do
// if it ultimately fails (typically: keep the short-lived token and try again later).
export async function exchangeForLongLivedToken(
  shortLivedToken: string
): Promise<LongLivedToken> {
  if (!serverEnv.INSTAGRAM_CLIENT_SECRET) {
    throw new Error("INSTAGRAM_CLIENT_SECRET is not set.");
  }
  const qs = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: serverEnv.INSTAGRAM_CLIENT_SECRET,
    access_token: shortLivedToken,
  });

  const variants: Array<{ url: string; init: RequestInit }> = [
    { url: `${GRAPH_INSTAGRAM}/access_token?${qs}`, init: { method: "GET" } },
    { url: `${GRAPH_INSTAGRAM}/access_token`, init: { method: "POST", body: qs.toString(), headers: { "content-type": "application/x-www-form-urlencoded" } } },
    { url: `${GRAPH_INSTAGRAM}/${GRAPH_VERSION}/access_token?${qs}`, init: { method: "GET" } },
  ];

  let lastErr: unknown;
  for (const v of variants) {
    try { return await metaFetch<LongLivedToken>(v.url, v.init); }
    catch (err) { lastErr = err; }
  }
  throw lastErr;
}

export async function refreshLongLivedToken(longLivedToken: string): Promise<LongLivedToken> {
  const qs = new URLSearchParams({
    grant_type: "ig_refresh_token",
    access_token: longLivedToken,
  });
  return metaFetch<LongLivedToken>(`${GRAPH_INSTAGRAM}/refresh_access_token?${qs}`);
}

// -----------------------------------------------------------------------------
// User / media
// -----------------------------------------------------------------------------

export type IGUserProfile = {
  id: string;
  username: string;
  account_type?: "BUSINESS" | "CREATOR" | "PERSONAL";
  media_count?: number;
  followers_count?: number;
  follows_count?: number;
  profile_picture_url?: string;
};

export async function getMe(accessToken: string): Promise<IGUserProfile> {
  const fields = "id,username,account_type,media_count,followers_count,follows_count,profile_picture_url";
  const qs = new URLSearchParams({ fields, access_token: accessToken });
  return metaFetch<IGUserProfile>(`${GRAPH_INSTAGRAM}/me?${qs}`);
}

export type IGMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "REELS";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  comments_count?: number;
  like_count?: number;
};

export async function listMedia(accessToken: string, limit = 25): Promise<IGMedia[]> {
  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,comments_count,like_count";
  const qs = new URLSearchParams({ fields, limit: String(limit), access_token: accessToken });
  const res = await metaFetch<{ data: IGMedia[] }>(`${GRAPH_INSTAGRAM}/me/media?${qs}`);
  return res.data || [];
}

// -----------------------------------------------------------------------------
// Comment reply (public reply to a comment)
// -----------------------------------------------------------------------------

export async function replyToComment(opts: {
  accessToken: string;
  commentId: string;
  message: string;
}): Promise<{ id: string }> {
  const { accessToken, commentId, message } = opts;
  const url = `${GRAPH_INSTAGRAM}/${commentId}/replies`;
  return metaFetch<{ id: string }>(url, {
    method: "POST",
    body: JSON.stringify({ message, access_token: accessToken }),
  });
}

// -----------------------------------------------------------------------------
// DMs
// -----------------------------------------------------------------------------

// Private Reply (DM triggered from a comment) — only valid within 7 days of the comment.
export async function sendPrivateReply(opts: {
  accessToken: string;
  igUserId: string;        // the business IG user id
  commentId: string;
  message: string;
  buttons?: Array<{ title: string; url?: string; payload?: string }>;
}): Promise<{ message_id: string; recipient_id?: string }> {
  const { accessToken, igUserId, commentId, message, buttons } = opts;
  const url = `${GRAPH_INSTAGRAM}/${GRAPH_VERSION}/${igUserId}/messages`;

  const body: any = {
    recipient: { comment_id: commentId },
    access_token: accessToken,
  };

  if (buttons && buttons.length > 0) {
    body.message = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: message,
          buttons: buttons.map((b) =>
            b.url
              ? { type: "web_url", url: b.url, title: b.title }
              : { type: "postback", title: b.title, payload: b.payload || "FOLLOW_GATE" }
          ),
        },
      },
    };
  } else {
    body.message = { text: message };
  }

  return metaFetch<{ message_id: string; recipient_id?: string }>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Send a follow-up DM to a user inside an existing messaging context.
export async function sendDirectMessage(opts: {
  accessToken: string;
  igUserId: string;
  recipientIgsid: string;
  message: string;
  buttons?: Array<{ title: string; url?: string; payload?: string }>;
}): Promise<{ message_id: string }> {
  const { accessToken, igUserId, recipientIgsid, message, buttons } = opts;
  const url = `${GRAPH_INSTAGRAM}/${GRAPH_VERSION}/${igUserId}/messages`;

  const body: any = {
    recipient: { id: recipientIgsid },
    access_token: accessToken,
  };
  if (buttons && buttons.length > 0) {
    body.message = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: message,
          buttons: buttons.map((b) =>
            b.url
              ? { type: "web_url", url: b.url, title: b.title }
              : { type: "postback", title: b.title, payload: b.payload || "FOLLOW_GATE" }
          ),
        },
      },
    };
  } else {
    body.message = { text: message };
  }
  return metaFetch<{ message_id: string }>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Check follow status for an IGSID inside an existing messaging conversation.
// Per Part 4.6 of the build doc: this only works for IGSIDs that are inside
// a messaging context; treat null/errors as "not following" and re-check on
// postback.
export async function checkFollowStatus(opts: {
  accessToken: string;
  igUserId: string;
  recipientIgsid: string;
}): Promise<{ isFollowing: boolean; raw?: unknown }> {
  const { accessToken, igUserId, recipientIgsid } = opts;
  const qs = new URLSearchParams({
    fields: "is_user_follow_business",
    access_token: accessToken,
  });
  try {
    const res = await metaFetch<{ is_user_follow_business?: boolean }>(
      `${GRAPH_INSTAGRAM}/${GRAPH_VERSION}/${recipientIgsid}?${qs}`
    );
    return { isFollowing: Boolean(res.is_user_follow_business), raw: res };
  } catch (err) {
    // Try the Facebook Graph base as a fallback (Part 4.1).
    try {
      const res = await metaFetch<{ is_user_follow_business?: boolean }>(
        `${GRAPH_FACEBOOK}/${recipientIgsid}?${qs}`
      );
      return { isFollowing: Boolean(res.is_user_follow_business), raw: res };
    } catch {
      return { isFollowing: false, raw: err };
    }
  }
}

// -----------------------------------------------------------------------------
// Webhook subscription helpers (one-time setup or admin-triggered)
// -----------------------------------------------------------------------------

export async function subscribeWebhooks(opts: {
  accessToken: string;
  igUserId: string;
}): Promise<{ success: boolean }> {
  const { accessToken, igUserId } = opts;
  const url = `${GRAPH_INSTAGRAM}/${GRAPH_VERSION}/${igUserId}/subscribed_apps`;
  const body = new URLSearchParams({
    subscribed_fields: "comments,messages,messaging_postbacks,message_reactions",
    access_token: accessToken,
  });
  return metaFetch<{ success: boolean }>(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}
