import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Repliqo — Automate Conversations",
    template: "%s · Repliqo",
  },
  description:
    "Repliqo turns Instagram comments into automated DMs. Reply once, automate forever — for creators, brands, and agencies.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Repliqo — Automate Conversations",
    description: "Instagram DM automation, done right.",
    type: "website",
    siteName: "Repliqo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repliqo",
    description: "Instagram DM automation, done right.",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
