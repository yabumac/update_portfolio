"use client";

import { useEffect, useRef, useState } from "react";

export default function SectionDivider({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setProgress(100);
      return;
    }

    const calculateProgress = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Start when the section's top is near 85% of viewport height (just as it comes into view)
      // Reach 100% when the section header scrolls to near top (around 20% of viewport)
      const startTrigger = viewportHeight * 0.85;
      const endTrigger = viewportHeight * 0.2;

      const totalDistance = startTrigger - endTrigger;
      const traveled = startTrigger - rect.top;

      const rawRatio = traveled / totalDistance;
      const clamped = Math.max(0, Math.min(1, rawRatio));

      targetProgressRef.current = clamped * 100;
    };

    const updateLoop = () => {
      // Smooth interpolation for fluid spring-like dot glide
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.15;

      if (Math.abs(diff) > 0.05) {
        setProgress(Math.round(currentProgressRef.current * 10) / 10);
      }

      rafRef.current = requestAnimationFrame(updateLoop);
    };

    const onScroll = () => {
      calculateProgress();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", calculateProgress, { passive: true });
    calculateProgress();
    rafRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", calculateProgress);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sectionRef]);

  return (
    <div
      className="absolute inset-x-0 top-0 h-4 -translate-y-1/2 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Background track line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 bg-line" />

      {/* Active gold/amber loading progress line */}
      <div
        className="absolute top-1/2 left-0 h-[1.5px] -translate-y-1/2 bg-gradient-to-r from-amber/20 via-amber/80 to-amber transition-none"
        style={{
          width: `${progress}%`,
          boxShadow: progress > 1 ? "0 0 10px var(--amber)" : "none",
        }}
      />

      {/* Dynamic traveling gold dot (clean, non-blinking) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-none"
        style={{
          left: `${Math.max(1, Math.min(99, progress))}%`,
        }}
      >
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span
            className="h-2 w-2 rounded-full bg-amber ring-2 ring-base"
            style={{
              boxShadow: "0 0 8px var(--amber), 0 0 3px var(--amber)",
            }}
          />
        </span>
      </div>
    </div>
  );
}
