"use client";

import { useEffect, useRef } from "react";
import { experienceMain, experienceBuild, type Experience } from "../data";
import Section from "./Section";

const laneDot: Record<"a" | "b", string> = {
  a: "bg-amber",
  b: "bg-violet",
};

function Entry({ job, lane }: { job: Experience; lane: "a" | "b" }) {
  return (
    <li data-item data-lane={lane} className="relative pb-12 last:pb-0">
      <span
        data-dot
        className={`absolute top-1 -left-[33px] h-2 w-2 rounded-full ${laneDot[lane]}`}
        aria-hidden="true"
      />
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-xl font-semibold text-text">
          {job.where}
        </h3>
        <span className="text-sm text-muted">{job.role}</span>
      </div>
      <p className="mb-3 font-mono text-xs text-muted">{job.range}</p>
      <ul className="max-w-xl space-y-1">
        {job.outcomes.map((o) => (
          <li key={o} className="text-sm leading-relaxed text-muted">
            {o}
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function Experience() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-item]"));
    if (!items.length) return;

    let raf = 0;

    // Text fades in progressively as it scrolls through the viewport, and the
    // lane dot blinks once when the entry reaches the top. Lane B (violet)
    // ramps over a longer window, so it trails lane A slightly.
    const update = () => {
      const vh = window.innerHeight;
      for (const el of items) {
        const rect = el.getBoundingClientRect();
        const lane = el.dataset.lane === "b" ? "b" : "a";
        const span = lane === "b" ? vh * 0.95 : vh * 0.65;
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / span));

        el.style.opacity = String(0.15 + 0.85 * progress);

        const dot = el.querySelector<HTMLElement>("[data-dot]");
        if (!dot) continue;
        dot.style.opacity = String(0.2 + 0.8 * progress);
        dot.classList.toggle("dot-blink", progress >= 0.985);
      }
    };

    const tick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, []);

  return (
    <Section id="experience" label="Experience">
      <p className="mb-12 max-w-xl text-sm leading-relaxed text-muted">
        One signal, two lanes. Scroll the chain — each stop lights up as it
        passes.
      </p>

      <div ref={rootRef} className="grid gap-14 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="mb-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            <span
              className="inline-block h-2 w-2 rounded-full bg-amber"
              aria-hidden="true"
            />
            lane A / leads &amp; systems
          </div>
          <ol className="relative border-l border-line pl-8">
            {experienceMain.map((job) => (
              <Entry key={job.where} job={job} lane="a" />
            ))}
          </ol>
        </div>

        <div>
          <div className="mb-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            <span
              className="inline-block h-2 w-2 rounded-full bg-violet"
              aria-hidden="true"
            />
            lane B / products &amp; builds
          </div>
          <ol className="relative border-l border-line pl-8">
            {experienceBuild.map((job) => (
              <Entry key={job.where} job={job} lane="b" />
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}