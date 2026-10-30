"use client";

import { useEffect, useRef } from "react";
import MeshPanel from "./MeshPanel";

export default function Hero() {
  const meterRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = meterRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    const phase = 0;
    const baseAmber = "#f2a93b";
    const baseViolet = "#7a5cff";
    const muted = "#2c2936";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // An idle "assistant/audio level" style waveform: two thin lines that
    // gently breathe until the pointer moves over the hero.
    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      const segments = 96;
      const segment = w / segments;
      const mid = h / 2;

      // baseline rail
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.stroke();

      // upper + lower level lines (visual "signal" / idle meter)
      const t = performance.now() / 1000;
      for (let s = 0; s < segments; s++) {
        const x = s * segment;
        const idle = prefersReduced
          ? 0.5
          : 0.35 + 0.25 * Math.sin(t * 0.8 + s * 0.35);

        // upper signal — amber when moving fast, violet toward lower energy
        const yUp = mid - 10 - idle * (h * 0.3);
        const color =
          idle > 0.5 ? baseAmber : baseViolet;
        ctx.fillStyle = color;
        ctx.fillRect(x, yUp, segment * 0.85, 1.5);

        const yDn = mid + 10 + idle * (h * 0.3);
        ctx.fillStyle = color;
        ctx.fillRect(x, yDn, segment * 0.85, 1.5);
      }
      raf = requestAnimationFrame(draw);
      void phase;
    };

    if (prefersReduced) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <header className="relative border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <nav className="mb-20 flex items-center justify-between text-sm">
          <a
            href="#top"
            className="font-mono text-xs tracking-tight text-muted hover:text-amber"
          >
            yabsera — control room v1.0
          </a>
          <ul className="flex items-center gap-5 font-mono text-xs text-muted sm:gap-7">
            <li>
              <a href="#systems" className="hover:text-text">
                systems
              </a>
            </li>
            <li>
              <a href="#experience" className="hover:text-text">
                experience
              </a>
            </li>
            <li>
              <a href="#skills" className="hover:text-text">
                skills
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-amber">
                contact
              </a>
            </li>
          </ul>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="readout-in mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-amber" />
              system online
            </p>

            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-text sm:text-6xl lg:text-7xl">
              4,000+ school leaders
              <br />
              use what I
              <br />
              built.
            </h1>

            <p className="readout-in mt-8 max-w-lg text-lg leading-relaxed text-muted">
              I&apos;m Yabsera Teshome — a tech lead and full-stack/AI developer
              in Addis Ababa who ships EdTech systems end-to-end. From RAG
              pipelines and chatbots to 60+ interactive learning modules. I also
              mix records.
            </p>

            <div className="readout-in mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#systems"
                className="inline-flex items-center gap-2 border border-amber px-5 py-3 font-medium text-amber hover:bg-amber hover:text-base"
              >
                See what I&apos;ve built
              </a>
              <span className="font-mono text-xs text-muted">
                Addis Ababa / remote
              </span>
            </div>
          </div>

          <div className="lg:col-span-4">
            <MeshPanel />
          </div>
        </div>

        <div className="mt-16 h-16" aria-hidden="true">
          <canvas
            ref={meterRef}
            className="h-16 w-full"
            aria-label="Idle level meter"
          />
        </div>
      </div>
    </header>
  );
}
