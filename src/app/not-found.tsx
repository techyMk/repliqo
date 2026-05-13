"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

// Interactive 404. Five layered behaviors compose the "expensive" feel:
//  1. Cursor parallax — icon tilts in 3D toward the cursor, aurora drifts in
//     the opposite direction for depth.
//  2. Magnetic CTAs — the back-home buttons pull toward the cursor when near.
//  3. Glitch on the "404" digits — random brief glitch every few seconds.
//  4. Click-to-pulse — clicking the icon triggers a spring scale-pulse + ripple.
//  5. Floating particles — 14 small dots drift on their own loops and are
//     gently nudged when the cursor passes near.
export default function NotFound() {
  // Track mouse position normalized to viewport center, -1..1 on each axis.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // Spring-smooth so the parallax settles after a fast cursor move.
  const smx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.6 });

  // Map normalized cursor → transforms across 8 depth planes.
  // Foreground moves WITH cursor (positive range), background AGAINST cursor
  // (negative range). The greater the magnitude, the "closer" the layer reads.
  const iconRotateY    = useTransform(smx, [-1, 1], [-18, 18]);
  const iconRotateX    = useTransform(smy, [-1, 1], [12, -12]);
  const iconTranslateX = useTransform(smx, [-1, 1], [-14, 14]);
  const iconTranslateY = useTransform(smy, [-1, 1], [-10, 10]);

  // Aurora layer — drifts opposite (deep)
  const auroraX = useTransform(smx, [-1, 1], [40, -40]);
  const auroraY = useTransform(smy, [-1, 1], [30, -30]);

  // Dot grid — drifts opposite, smaller magnitude (deepest)
  const gridX = useTransform(smx, [-1, 1], [22, -22]);
  const gridY = useTransform(smy, [-1, 1], [16, -16]);

  // Four background orbs — each with a unique direction + magnitude so they
  // read as four different depth planes drifting independently.
  const orb1X = useTransform(smx, [-1, 1], [-70, 70]);
  const orb1Y = useTransform(smy, [-1, 1], [-50, 50]);
  const orb2X = useTransform(smx, [-1, 1], [55, -55]);
  const orb2Y = useTransform(smy, [-1, 1], [-40, 40]);
  const orb3X = useTransform(smx, [-1, 1], [-45, 45]);
  const orb3Y = useTransform(smy, [-1, 1], [35, -35]);
  const orb4X = useTransform(smx, [-1, 1], [35, -35]);
  const orb4Y = useTransform(smy, [-1, 1], [25, -25]);

  // Click-to-pulse state for the icon frame.
  const [pulseKey, setPulseKey] = useState(0);

  // Random glitch trigger for the 404 digits.
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 280);
      // 1.2s – 5.5s gap between glitches; feels natural, not pattern-y.
      timer = setTimeout(tick, 1200 + Math.random() * 4300);
    };
    timer = setTimeout(tick, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2))));
      my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2))));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden select-none">
      {/* ─────────────────────────────────────────────────────────────────────
          BACKGROUND PARALLAX STACK (deepest first)
          Each layer parallaxes with a different magnitude + direction so the
          page reads as a real 3D space rather than a flat panel.
         ─────────────────────────────────────────────────────────────────── */}

      {/* 1. Static base — fixed dark layer, never moves. Anchors the eye. */}
      <div aria-hidden className="absolute inset-0 -z-30 bg-background" />

      {/* 2. Four colored orbs — heaviest parallax, largest depth offset.
            Positioned at the four corners so the eye reads them as ambient
            light leaking from off-screen. Heavy blur makes them feel like
            light, not graphics. */}
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
        <motion.div
          style={{ x: orb1X, y: orb1Y }}
          className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full"
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-60"
            style={{ backgroundColor: "hsl(var(--brand-pink) / 0.35)" }}
          />
        </motion.div>
        <motion.div
          style={{ x: orb2X, y: orb2Y }}
          className="absolute -right-40 -top-24 h-[460px] w-[460px] rounded-full"
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-50"
            style={{ backgroundColor: "hsl(var(--brand-blue) / 0.35)" }}
          />
        </motion.div>
        <motion.div
          style={{ x: orb3X, y: orb3Y }}
          className="absolute -left-24 -bottom-32 h-[480px] w-[480px] rounded-full"
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-55"
            style={{ backgroundColor: "hsl(var(--brand-purple) / 0.40)" }}
          />
        </motion.div>
        <motion.div
          style={{ x: orb4X, y: orb4Y }}
          className="absolute -right-32 -bottom-40 h-[440px] w-[440px] rounded-full"
        >
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-50"
            style={{ backgroundColor: "hsl(var(--brand-pink) / 0.30)" }}
          />
        </motion.div>
      </div>

      {/* 3. Dot grid — parallaxes opposite the cursor. Most subtle, gives the
            background a sense of structure (like graph paper drifting). */}
      <motion.div
        aria-hidden
        style={{ x: gridX, y: gridY }}
        className="absolute -inset-10 -z-10 bg-dot-grid mask-radial opacity-25"
      />

      {/* 4. Large slow aurora — rotates + parallaxes opposite. Wraps the icon
            in a colored haze. */}
      <motion.div
        aria-hidden
        style={{ x: auroraX, y: auroraY }}
        className="absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="aurora h-[900px] w-[900px] animate-aurora-rotate opacity-60" />
      </motion.div>

      {/* 5. Inner pulsing aurora — beats with the halo behind the icon. */}
      <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="aurora h-[560px] w-[560px] animate-halo-pulse opacity-80" />
      </div>

      {/* Floating particles — independent drifts + light cursor influence */}
      <ParticleField mx={smx} my={smy} />

      {/* Icon — 3D tilt + magnetic translate + click pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          x: iconTranslateX,
          y: iconTranslateY,
          rotateX: iconRotateX,
          rotateY: iconRotateY,
          transformPerspective: 800,
          transformStyle: "preserve-3d",
        }}
        className="relative cursor-pointer"
      >
        {/* Brand halo behind the icon — pulses + parallax */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 m-auto h-48 w-48 rounded-[2.5rem] blur-2xl animate-halo-pulse"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, hsl(var(--brand-purple) / 0.55), hsl(var(--brand-pink) / 0.30), transparent 70%)",
          }}
        />

        {/* Pulse ring on click */}
        <motion.span
          key={pulseKey}
          aria-hidden
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 m-auto h-44 w-44 rounded-[2.25rem] border border-[hsl(var(--brand-purple)/0.6)] pointer-events-none"
        />

        <motion.div
          onClick={() => setPulseKey((k) => k + 1)}
          whileTap={{ scale: 0.94 }}
          className="inline-flex h-44 w-44 items-center justify-center rounded-[2.25rem] border border-white/10 bg-white/[0.03] backdrop-blur-sm glow-ring animate-float"
        >
          <LogoMark
            className="h-32 w-32 drop-shadow-[0_0_28px_hsl(var(--brand-purple)/0.5)]"
            aria-hidden
          />
        </motion.div>
      </motion.div>

      {/* 404 digits — panning brand gradient, glitching at random intervals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "mt-10 text-[6.5rem] sm:text-[9rem] leading-none font-semibold tracking-tightest tabular-nums relative",
          glitching && "animate-glitch"
        )}
        style={{
          backgroundImage:
            "linear-gradient(90deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)) 40%, hsl(var(--brand-blue)) 70%, hsl(var(--brand-purple)) 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          animation: "gradient-pan 6s ease-in-out infinite",
        }}
      >
        404
        {/* Chromatic-aberration ghost layers — visible only during glitch */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-100",
            glitching ? "opacity-80" : "opacity-0"
          )}
          style={{
            color: "hsl(var(--brand-pink))",
            transform: "translate(-3px, 0)",
            mixBlendMode: "screen",
          }}
        >
          404
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-100",
            glitching ? "opacity-80" : "opacity-0"
          )}
          style={{
            color: "hsl(var(--brand-blue))",
            transform: "translate(3px, 0)",
            mixBlendMode: "screen",
          }}
        >
          404
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tightest text-balance"
      >
        Page
        <span className="font-display italic font-normal text-brand-gradient"> not </span>
        found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-3 text-[13px] text-muted-foreground max-w-sm leading-relaxed"
      >
        The page you're looking for has moved or doesn't exist. Let's get you back somewhere useful.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 flex items-center gap-3"
      >
        <MagneticButton strength={0.35}>
          <Button asChild className="group">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to home
            </Link>
          </Button>
        </MagneticButton>
        <MagneticButton strength={0.35}>
          <Button asChild variant="secondary">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </MagneticButton>
      </motion.div>

    </main>
  );
}

// -----------------------------------------------------------------------------
// Floating particles — 14 dots that drift on independent loops and get gently
// nudged by the cursor parallax. Light enough that perf stays smooth.
// -----------------------------------------------------------------------------
function ParticleField({
  mx,
  my,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // Deterministic positions so SSR + client render match.
  const particles = [
    { left: "12%", top: "18%", size: 4, dur: 7, delay: 0,   parallax: 22 },
    { left: "88%", top: "22%", size: 3, dur: 9, delay: 1.2, parallax: -24 },
    { left: "8%",  top: "70%", size: 5, dur: 6, delay: 2.4, parallax: 18 },
    { left: "92%", top: "78%", size: 4, dur: 8, delay: 0.6, parallax: -20 },
    { left: "30%", top: "12%", size: 3, dur: 7, delay: 1.8, parallax: 16 },
    { left: "70%", top: "10%", size: 4, dur: 9, delay: 3.0, parallax: -18 },
    { left: "20%", top: "50%", size: 2, dur: 5, delay: 0.8, parallax: 14 },
    { left: "80%", top: "55%", size: 5, dur: 10, delay: 2.1, parallax: -16 },
    { left: "45%", top: "85%", size: 3, dur: 7, delay: 1.4, parallax: 12 },
    { left: "55%", top: "8%",  size: 4, dur: 8, delay: 2.7, parallax: -14 },
    { left: "15%", top: "35%", size: 2, dur: 6, delay: 3.3, parallax: 20 },
    { left: "85%", top: "40%", size: 3, dur: 9, delay: 0.4, parallax: -22 },
    { left: "35%", top: "65%", size: 4, dur: 7, delay: 1.6, parallax: 10 },
    { left: "65%", top: "72%", size: 2, dur: 8, delay: 2.3, parallax: -10 },
  ];

  return (
    <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
      {particles.map((p, i) => (
        <Particle key={i} p={p} mx={mx} my={my} />
      ))}
    </div>
  );
}

function Particle({
  p,
  mx,
  my,
}: {
  p: {
    left: string;
    top: string;
    size: number;
    dur: number;
    delay: number;
    parallax: number;
  };
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // Outer wrapper carries the cursor-parallax translate via motion value style.
  // Inner span owns the keyframe drift + opacity loop. They compose without
  // fighting over the transform.
  const tx = useTransform(mx, [-1, 1], [-p.parallax, p.parallax]);
  const ty = useTransform(my, [-1, 1], [-p.parallax, p.parallax]);
  return (
    <motion.span
      className="absolute"
      style={{ left: p.left, top: p.top, x: tx, y: ty }}
    >
      <motion.span
        className="block rounded-full"
        style={{
          width: p.size,
          height: p.size,
          backgroundColor:
            p.size > 3
              ? "hsl(var(--brand-purple) / 0.7)"
              : "hsl(var(--brand-pink) / 0.55)",
          boxShadow: "0 0 12px 2px hsl(var(--brand-purple) / 0.35)",
        }}
        animate={{
          y: [0, -12, 0, 10, 0],
          x: [0, 8, 0, -6, 0],
          opacity: [0.5, 1, 0.6, 0.9, 0.5],
        }}
        transition={{
          duration: p.dur,
          repeat: Infinity,
          ease: "easeInOut",
          delay: p.delay,
        }}
      />
    </motion.span>
  );
}
