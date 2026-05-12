// =============================================================================
// Fake Instagram media used by the post picker when the connected account is
// a demo account. Shape matches IGMedia from lib/instagram/client.ts so the
// picker doesn't need to care which path the data came from.
// =============================================================================

import type { IGMedia } from "../instagram/client";

type Seed = {
  slug: string;
  type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "REELS";
  caption: string;
  likes: number;
  comments: number;
  daysAgo: number;
};

const SEEDS: Seed[] = [
  { slug: "drop",     type: "IMAGE",           caption: "New drop. Limited stock. Comment LINK for early access.",                 likes: 4820,  comments: 614,  daysAgo: 2 },
  { slug: "guide",    type: "CAROUSEL_ALBUM",  caption: "Free 30-page guide — comment GUIDE to unlock the PDF 📩",                  likes: 12480, comments: 1894, daysAgo: 8 },
  { slug: "course",   type: "REELS",           caption: "Cohort #4 opens Monday. Comment COURSE for the syllabus.",                likes: 9214,  comments: 412,  daysAgo: 14 },
  { slug: "studio",   type: "IMAGE",           caption: "Studio day. Comment PRICE for the rate card.",                            likes: 2480,  comments: 122,  daysAgo: 18 },
  { slug: "case",     type: "CAROUSEL_ALBUM",  caption: "How we hit $40K in 30 days — full case study in your DMs, comment INFO.", likes: 7820,  comments: 901,  daysAgo: 24 },
  { slug: "talk",     type: "REELS",           caption: "The 3-step DM funnel that 10x'd my drop. Comment FUNNEL to get it.",      likes: 18420, comments: 2104, daysAgo: 30 },
  { slug: "behind",   type: "IMAGE",           caption: "Behind the build — early prototypes 👀",                                  likes: 1820,  comments: 64,   daysAgo: 37 },
  { slug: "stack",    type: "CAROUSEL_ALBUM",  caption: "My exact tool stack for 2026.",                                           likes: 6210,  comments: 318,  daysAgo: 44 },
  { slug: "feature",  type: "IMAGE",           caption: "Got featured in TC today. Wild week.",                                    likes: 11240, comments: 712,  daysAgo: 52 },
  { slug: "tools",    type: "REELS",           caption: "5 tools that replaced my whole agency. Comment TOOLS for the list.",      likes: 24010, comments: 3104, daysAgo: 61 },
  { slug: "office",   type: "IMAGE",           caption: "New office. Same chaos.",                                                 likes: 3320,  comments: 184,  daysAgo: 75 },
  { slug: "launch",   type: "CAROUSEL_ALBUM",  caption: "Launch day → 0 to 12k followers in 90 days. AMA in the comments.",        likes: 31280, comments: 4220, daysAgo: 90 },
];

export function buildDemoMedia(igUserId: string, limit = 24): IGMedia[] {
  return SEEDS.slice(0, limit).map((s) => {
    const ts = new Date(Date.now() - s.daysAgo * 86400_000);
    const url = `https://picsum.photos/seed/repliqo-${s.slug}/640/640`;
    return {
      id: `${igUserId}_media_${s.slug}`,
      caption: s.caption,
      media_type: s.type,
      thumbnail_url: url,
      media_url: url,
      permalink: `https://instagram.com/p/${s.slug}/`,
      timestamp: ts.toISOString(),
      comments_count: s.comments,
      like_count: s.likes,
    } satisfies IGMedia;
  });
}
