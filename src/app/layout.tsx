import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

// Geist Sans for UI/body, Geist Mono for code, Instrument Serif for the
// occasional display accent (hero headline, page titles). All loaded
// self-hosted via next/font — zero FOUT, zero external requests at runtime.
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

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
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
