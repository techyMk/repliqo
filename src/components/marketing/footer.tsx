import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function MarketingFooter() {
  return (
    <footer className="pt-16 pb-10">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-white/[0.06]">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-[13px] text-muted-foreground max-w-xs leading-relaxed">
              Instagram DM automation for modern creators, brands, and agencies.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              ["Features", "#features"],
              ["How it works", "#how"],
              ["Pricing", "#pricing"],
              ["Changelog", "/changelog"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["About", "/about"],
              ["Contact", "/contact"],
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Security", "/security"],
            ]}
          />
        </div>
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} Repliqo, Inc. All rights reserved.</span>
          <span className="hidden md:inline">Built on the official Instagram API · Not affiliated with Meta.</span>
          <span>
            Designed &amp; developed by{" "}
            <a
              href="https://techymk.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-gradient hover:underline underline-offset-4"
            >
              techyMk
            </a>
          </span>
        </div>
        <div className="md:hidden mt-2 text-[11px] text-muted-foreground">
          Built on the official Instagram API · Not affiliated with Meta.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="text-[11px] font-medium tracking-[0.18em] uppercase text-foreground/85">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
