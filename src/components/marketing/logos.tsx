"use client";

// Replace these with real customer wordmarks later. For now they're abstract
// uppercase tokens that read as a brand bar.
const brands = [
  "LUMA", "NORTHWAVE", "PROXY", "STUDIO &", "CIRCUIT",
  "FRAME", "EAST", "MAKEFILE", "TIDE", "NOVA",
];

export function LogosRow() {
  return (
    <section className="py-14 border-y border-white/[0.05] bg-background relative overflow-hidden">
      <div className="container">
        <p className="text-center text-[11px] text-muted-foreground tracking-[0.2em] uppercase">
          Trusted by creators and brands you've heard of
        </p>
      </div>
      <div className="mt-7 relative mask-fade-edges overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...brands, ...brands].map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="mx-8 text-[15px] font-semibold tracking-[0.18em] text-foreground/55 hover:text-foreground/85 transition-colors whitespace-nowrap"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
