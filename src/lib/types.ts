// =============================================================================
// Shared application types — mirror the public schema and webhook payloads.
// =============================================================================

export type PlanTier = "free" | "starter" | "growth" | "agency";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: PlanTier;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type InstagramAccount = {
  id: string;
  user_id: string;
  ig_user_id: string;
  username: string;
  account_type: "BUSINESS" | "CREATOR" | null;
  profile_picture_url: string | null;
  followers_count: number;
  follows_count: number;
  media_count: number;
  access_token_encrypted: string;
  token_expires_at: string | null;
  scopes: string[];
  status: "active" | "expired" | "revoked" | "error";
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AutomationStatus = "draft" | "active" | "paused" | "archived";
export type MatchMode = "contains" | "exact" | "starts_with";

export type Automation = {
  id: string;
  user_id: string;
  ig_account_id: string;
  name: string;
  description: string | null;
  post_id: string | null;
  post_thumbnail_url: string | null;
  post_caption: string | null;
  status: AutomationStatus;
  match_mode: MatchMode;
  case_sensitive: boolean;
  comment_reply: string | null;
  dm_message: string;
  dm_button_label: string | null;
  dm_button_url: string | null;
  follow_gate_enabled: boolean;
  follow_gate_message: string | null;
  follow_gate_cta: string | null;
  rate_limit_per_hour: number;
  total_sends_limit: number | null;
  send_count: number;
  triggers_count: number;
  dms_sent_count: number;
  replies_sent_count: number;
  created_at: string;
  updated_at: string;
};

export type AutomationKeyword = {
  id: string;
  automation_id: string;
  keyword: string;
  created_at: string;
};

export type AutomationLogEvent =
  | "comment_received"
  | "reply_sent"
  | "dm_sent"
  | "follow_gate_sent"
  | "follow_gate_passed"
  | "rate_limited"
  | "error"
  | "duplicate_skipped";

export type AutomationLog = {
  id: string;
  automation_id: string;
  ig_account_id: string;
  user_id: string;
  event_type: AutomationLogEvent;
  comment_id: string | null;
  commenter_ig_id: string | null;
  commenter_username: string | null;
  matched_keyword: string | null;
  raw_comment_text: string | null;
  comment_reply_id: string | null;
  dm_message_id: string | null;
  status: "success" | "failed" | "pending" | "skipped";
  error_code: string | null;
  error_message: string | null;
  created_at: string;
};

// ---- Inbound Meta webhook shapes (partial — what we actually consume) ----

export type IGCommentChange = {
  field: "comments";
  value: {
    id: string;                                         // comment id
    text: string;
    from: { id: string; username?: string };
    media: { id: string; media_product_type?: string };
    parent_id?: string;
  };
};

export type IGMessagingEvent = {
  sender: { id: string };                               // IGSID
  recipient: { id: string };                            // business IG user id
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    quick_reply?: { payload: string };
    is_echo?: boolean;
  };
  postback?: { payload: string; title?: string };
};

export type IGWebhookEntry = {
  id: string;                                           // business IG user id
  time: number;
  changes?: IGCommentChange[];
  messaging?: IGMessagingEvent[];
};

export type IGWebhookPayload = {
  object: "instagram";
  entry: IGWebhookEntry[];
};
