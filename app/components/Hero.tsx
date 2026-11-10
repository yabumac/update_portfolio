"use client";

import { useEffect, useRef, useState } from "react";
import HeroShowcase from "./HeroShowcase";
import ThemeToggle from "./ThemeToggle";
import HeroBottomBar from "./HeroBottomBar";
import { useReactiveColor } from "../context/ReactiveColorContext";

export default function Hero() {
  const { currentColor } = useReactiveColor();
  const { r, g, b } = currentColor;

  const meterRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = meterRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Idle level meter waveform
    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const baseAmber = isLight ? "#b87314" : "#f2a93b";
      const baseViolet = isLight ? "#6848d7" : "#7a5cff";
      const muted = isLight ? "#ddd3c3" : "#2c2936";

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

      // upper + lower level lines
      const t = performance.now() / 1000;
      for (let s = 0; s < segments; s++) {
        const x = s * segment;
        const idle = prefersReduced
          ? 0.5
          : 0.35 + 0.25 * Math.sin(t * 0.8 + s * 0.35);

        const yUp = mid - 10 - idle * (h * 0.3);
        const color = idle > 0.5 ? baseAmber : baseViolet;
        ctx.fillStyle = color;
        ctx.fillRect(x, yUp, segment * 0.85, 1.5);

        const yDn = mid + 10 + idle * (h * 0.3);
        ctx.fillStyle = color;
        ctx.fillRect(x, yDn, segment * 0.85, 1.5);
      }
      raf = requestAnimationFrame(draw);
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

  // Wave meter appears as user scrolls down through hero
  const waveOpacity = Math.min(1, Math.max(0, scrollY / 70));
  const waveTranslateY = (1 - waveOpacity) * 8;

  return (
    <header className="relative border-b border-line transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <nav className="mb-16 flex flex-wrap items-center justify-between gap-4 text-sm">
          {/* Brand with subtle reactive cloudy aura */}
          <div className="relative inline-flex items-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-4 rounded-full transition-all duration-1000 ease-out"
              style={{
                background: `radial-gradient(ellipse at 50% 50%, rgba(${r}, ${g}, ${b}, 0.22), transparent 75%)`,
                filter: "blur(26px)",
              }}
            />
            <a
              href="#top"
              className="relative z-10 font-mono text-xs tracking-tight text-muted hover:text-amber transition-colors"
            >
              yabsera — control room v1.0
            </a>
          </div>

          <div className="flex items-center gap-4 sm:gap-7">
            <ul className="flex items-center gap-4 font-mono text-xs text-muted sm:gap-6">
              <li>
                <a href="#systems" className="hover:text-text transition-colors">
                  systems
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-text transition-colors">
                  experience
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-text transition-colors">
                  skills
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber transition-colors">
                  contact
                </a>
              </li>
            </ul>
            <ThemeToggle />
          </div>
        </nav>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
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
                className="inline-flex items-center gap-2 border border-amber px-5 py-3 font-medium text-amber hover:bg-amber hover:text-base transition-colors"
              >
                See what I&apos;ve built
              </a>
              <span className="font-mono text-xs text-muted">
                Addis Ababa / remote
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroShowcase />
          </div>
        </div>

        {/* Waveform idle meter: appears smoothly as the user scrolls */}
        <div
          className="mt-16 h-16 transition-all duration-300 ease-out"
          style={{
            opacity: waveOpacity,
            transform: `translateY(${waveTranslateY}px)`,
            pointerEvents: waveOpacity > 0.2 ? "auto" : "none",
          }}
          aria-hidden="true"
        >
          <canvas
            ref={meterRef}
            className="h-16 w-full"
            aria-label="Idle level meter"
          />
        </div>
      </div>

      {/* Floating Bottom Flare that flies up on scroll, collides into top bar, and sticks as minimal top nav */}
      <HeroBottomBar scrollY={scrollY} />
    </header>
  );
}
