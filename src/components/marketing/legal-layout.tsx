import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <MarketingNav />
      <section className="pt-32 pb-16 border-b border-white/[0.05]">
        <div className="container max-w-3xl">
          <div className="text-xs tracking-widest uppercase text-muted-foreground">
            Legal
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated <time>{updated}</time>
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <article className="prose prose-invert prose-neutral max-w-none text-foreground/90 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-white/10 [&_code]:bg-white/[0.04] [&_strong]:text-foreground [&_a]:underline [&_a]:underline-offset-2">
            {children}
          </article>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
