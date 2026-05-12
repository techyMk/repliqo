"use client";

// Honest "built with" strip — the actual stack powering Repliqo. Doubles
// as a technical signal for anyone evaluating the project as a portfolio piece.
const stack = [
  "NEXT.JS 15",
  "REACT 18",
  "TYPESCRIPT",
  "TAILWIND CSS",
  "SUPABASE",
  "POSTGRES",
  "FRAMER MOTION",
  "INSTAGRAM API",
  "VERCEL",
  "ZOD",
];

export function LogosRow() {
  return (
    <section className="py-14 border-y border-white/[0.05] bg-background relative overflow-hidden">
      <div className="container">
        <p className="text-center text-[11px] text-muted-foreground tracking-[0.2em] uppercase">
          Built with the modern web stack
        </p>
      </div>
      <div className="group mt-7 relative mask-fade-edges overflow-hidden">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...stack, ...stack].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="mx-8 text-[15px] font-semibold tracking-[0.18em] text-foreground/55 hover:text-foreground/95 transition-colors whitespace-nowrap"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
