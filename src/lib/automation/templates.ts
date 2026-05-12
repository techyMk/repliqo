// =============================================================================
// Pre-built automation templates. Each maps to default values for the builder
// — keywords, copy, follow gate, etc. The user can edit anything after picking.
//
// Selected from the patterns most creators use in practice. Keep this list
// curated, not exhaustive.
// =============================================================================

export type AutomationTemplateId =
  | "blank"
  | "drop"
  | "link-in-bio"
  | "course-lead"
  | "follow-gate"
  | "ebook"
  | "qualify";

export type AutomationTemplate = {
  id: AutomationTemplateId;
  category: "Sales" | "Lead gen" | "Engagement" | "Custom";
  name: string;
  description: string;
  keywords: string[];
  defaults: {
    name: string;
    comment_reply: string | null;
    dm_message: string;
    dm_button_label: string | null;
    dm_button_url: string | null;
    follow_gate_enabled: boolean;
    follow_gate_message: string | null;
    follow_gate_cta: string;
    match_mode: "contains" | "exact" | "starts_with";
    rate_limit_per_hour: number;
  };
};

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: "drop",
    category: "Sales",
    name: "Product drop link",
    description: "Reply to comments asking for a link with a public reply + a DM containing your shop link.",
    keywords: ["link", "price", "drop", "shop"],
    defaults: {
      name: "Product drop · Comment → DM",
      comment_reply: "Sent! Check your DMs 📩",
      dm_message: "Hey {username} 👋 here's the link you asked for — limited stock.",
      dm_button_label: "Shop the drop",
      dm_button_url: "",
      follow_gate_enabled: false,
      follow_gate_message: null,
      follow_gate_cta: "I'm following!",
      match_mode: "contains",
      rate_limit_per_hour: 300,
    },
  },
  {
    id: "follow-gate",
    category: "Engagement",
    name: "Follow gate",
    description: "Send the link only if the commenter follows you. Adds the most followers per dollar.",
    keywords: ["link", "info", "guide"],
    defaults: {
      name: "Follow gate · Comment → Follow → DM",
      comment_reply: "DM'd you 👀",
      dm_message: "Locked content. Here's the link 👇",
      dm_button_label: "Get the link",
      dm_button_url: "",
      follow_gate_enabled: true,
      follow_gate_message: "Almost there! Follow first, then tap to unlock the link 🔓",
      follow_gate_cta: "I'm following!",
      match_mode: "contains",
      rate_limit_per_hour: 250,
    },
  },
  {
    id: "course-lead",
    category: "Lead gen",
    name: "Course / cohort signup",
    description: "Capture leads who comment with intent. Auto-DM your application or waitlist link.",
    keywords: ["course", "cohort", "apply", "join"],
    defaults: {
      name: "Course signup · Comment → DM",
      comment_reply: "Just DM'd you the syllabus ✨",
      dm_message:
        "Welcome {username} — here's a 7-day preview of the course. Drop your email below and you're in.",
      dm_button_label: "View course",
      dm_button_url: "",
      follow_gate_enabled: false,
      follow_gate_message: null,
      follow_gate_cta: "I'm following!",
      match_mode: "contains",
      rate_limit_per_hour: 200,
    },
  },
  {
    id: "ebook",
    category: "Lead gen",
    name: "Free guide / ebook",
    description: "Drop a free PDF or Notion doc to anyone who comments the keyword.",
    keywords: ["guide", "ebook", "free", "pdf"],
    defaults: {
      name: "Free guide · Comment → DM",
      comment_reply: "Sent! Check your DMs 📩",
      dm_message: "Here's the free guide as promised — let me know what you build with it!",
      dm_button_label: "Download the guide",
      dm_button_url: "",
      follow_gate_enabled: false,
      follow_gate_message: null,
      follow_gate_cta: "I'm following!",
      match_mode: "contains",
      rate_limit_per_hour: 400,
    },
  },
  {
    id: "link-in-bio",
    category: "Engagement",
    name: "Link in bio shortcut",
    description: "Catch every 'link?' comment with your main link-in-bio. Set and forget.",
    keywords: ["link?", "link", "where", "url"],
    defaults: {
      name: "Link in bio · Comment → DM",
      comment_reply: "Sent! 📩",
      dm_message: "Hey {username}! Everything I shared lives here 👇",
      dm_button_label: "All my links",
      dm_button_url: "",
      follow_gate_enabled: false,
      follow_gate_message: null,
      follow_gate_cta: "I'm following!",
      match_mode: "contains",
      rate_limit_per_hour: 500,
    },
  },
  {
    id: "qualify",
    category: "Lead gen",
    name: "Qualify a lead",
    description: "Open a conversation by asking a qualifying question before sharing pricing.",
    keywords: ["info", "pricing", "demo"],
    defaults: {
      name: "Qualify a lead",
      comment_reply: "DM incoming!",
      dm_message:
        "Quick question — what's the size of your team? Reply 1) Solo  2) 2–10  3) 10+",
      dm_button_label: null,
      dm_button_url: null,
      follow_gate_enabled: false,
      follow_gate_message: null,
      follow_gate_cta: "I'm following!",
      match_mode: "contains",
      rate_limit_per_hour: 150,
    },
  },
  {
    id: "blank",
    category: "Custom",
    name: "Start from scratch",
    description: "Build an automation step by step. No defaults, full control.",
    keywords: [],
    defaults: {
      name: "",
      comment_reply: "",
      dm_message: "",
      dm_button_label: null,
      dm_button_url: null,
      follow_gate_enabled: false,
      follow_gate_message: null,
      follow_gate_cta: "I'm following!",
      match_mode: "contains",
      rate_limit_per_hour: 200,
    },
  },
];

export function findTemplate(id: string | null | undefined): AutomationTemplate | undefined {
  if (!id) return undefined;
  return AUTOMATION_TEMPLATES.find((t) => t.id === id);
}
