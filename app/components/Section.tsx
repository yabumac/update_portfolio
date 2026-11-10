"use client";

import { useEffect, useRef, useState } from "react";
import SectionDivider from "./SectionDivider";

type SectionProps = {
  id: string;
  label: string;
  children: React.ReactNode;
};

export default function Section({ id, label, children }: SectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle or set revealed based on visibility in viewport
        if (entry.isIntersecting) {
          setRevealed(true);
        } else if (entry.boundingClientRect.top > window.innerHeight) {
          // If scrolled back above it, reset so it can reveal again on next scroll
          setRevealed(false);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative border-b border-line transition-colors duration-300"
    >
      {/* Dynamic scrolling waypoint track and traveling gold progress dot */}
      <SectionDivider sectionRef={sectionRef} />

      <div
        className={`mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28 transition-all duration-700 ease-out ${
          revealed
            ? "opacity-100 translate-y-0 filter-none"
            : "opacity-15 translate-y-8 blur-[2px]"
        }`}
      >
        <div className="mb-12 flex items-baseline gap-3">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_6px_var(--amber)]"
            aria-hidden="true"
          />
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            {label}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
