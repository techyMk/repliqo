import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const lastModified = new Date();

  // Marketing-only — dashboard, API routes, and auth pages are not indexable.
  const routes = [
    { url: "", changeFrequency: "weekly" as const, priority: 1.0 },
    { url: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "/changelog", changeFrequency: "weekly" as const, priority: 0.6 },
    { url: "/contact", changeFrequency: "yearly" as const, priority: 0.5 },
    { url: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { url: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
    { url: "/security", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  return routes.map((r) => ({
    url: `${base}${r.url}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
