// =============================================================================
// Dynamic OG image rendered by Next.js's ImageResponse at /opengraph-image.
// This is what previews when someone shares the site on Slack, Twitter, LinkedIn.
// Edge runtime keeps it fast and free on the Vercel free tier.
// =============================================================================

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Repliqo — Instagram DM automation, done right.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          // Solid base color + two layered radial gradients tinted with the
          // Repliqo brand (pink → purple → blue). Satori doesn't accept the
          // CSS `background` shorthand, so layers are stacked via backgroundImage.
          backgroundColor: "#08080a",
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 12% 90%, rgba(255,31,142,0.32), transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at 90% 10%, rgba(30,144,255,0.28), transparent 60%), " +
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(156,43,245,0.18), transparent 70%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* faint dot grid for texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            display: "flex",
          }}
        />

        {/* logo + wordmark — gradient R bug */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, zIndex: 1 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: "#0a0a0c",
              backgroundImage:
                "linear-gradient(135deg, #FF1F8E 0%, #9C2BF5 55%, #1E90FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.12) inset, 0 8px 24px -8px rgba(156,43,245,0.5)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 32 32">
              <path
                d="M9 10C9 8.89543 9.89543 8 11 8H19.5C22.5376 8 25 10.4624 25 13.5C25 16.5376 22.5376 19 19.5 19H17L14 23L13 19H11C9.89543 19 9 18.1046 9 17V10Z"
                fill="white"
              />
              <circle cx="14" cy="13.5" r="1.25" fill="#9C2BF5" />
              <circle cx="18" cy="13.5" r="1.25" fill="#9C2BF5" />
              <circle cx="22" cy="13.5" r="1.25" fill="#9C2BF5" />
            </svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Repliqo
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", zIndex: 1, gap: 24 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              maxWidth: 980,
              backgroundImage:
                "linear-gradient(180deg, #ffffff 0%, #c0c0c0 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Turn Instagram comments into automated sales.
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.6)",
              maxWidth: 800,
              letterSpacing: "-0.01em",
            }}
          >
            Reply once. Automate forever — for creators, brands, and agencies.
          </div>
        </div>

        {/* footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              color: "rgba(255,255,255,0.65)",
              fontSize: 18,
              letterSpacing: "-0.01em",
            }}
          >
            <span>repliqo.app</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span>Sub-second response</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span>Official Instagram API</span>
          </div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            v0.6
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
