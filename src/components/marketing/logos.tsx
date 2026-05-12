"use client";

// Placeholder "social proof" row — abstract wordmarks. Replace later.
const brands = ["LUMA", "NORTHWAVE", "PROXY", "STUDIO &", "CIRCUIT", "FRAME", "EAST"];

export function LogosRow() {
  return (
    <section className="py-12 border-y border-white/[0.05] bg-background">
      <div className="container">
        <p className="text-center text-xs text-muted-foreground tracking-widest uppercase">
          Trusted by 12,000+ creators and brands
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {brands.map((b) => (
            <span
              key={b}
              className="text-sm font-semibold tracking-widest text-foreground/60"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
