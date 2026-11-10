"use client";

import { useEffect, useRef } from "react";
import { useReactiveColor, type ShowcaseSlide } from "../context/ReactiveColorContext";

export default function HeroShowcase() {
  const {
    activeIdx,
    setActiveIdx,
    activeSlide,
    currentColor,
    nextSlide,
    prevSlide,
    setIsPaused,
    slides,
  } = useReactiveColor();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Frameless 3D Reactive Background Mesh
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Global cursor tracking across window for subtle 3D flex
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetTiltY = nx * 0.25;
      targetTiltX = -ny * 0.16;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const frame = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.getAttribute("data-theme") === "light";

      // Smooth 3D tilt spring
      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;

      const slow = prefersReduced ? 7 : t / 1000;
      const breathing = prefersReduced ? 0 : Math.sin(slow * 0.35) * 0.02;
      const curTiltX = tiltX + breathing;
      const curTiltY = tiltY;

      // Crisp gold palette (dominant)
      const dark = isLight ? [160, 138, 118] : [64, 43, 28];
      const lit = isLight ? [184, 115, 20] : [214, 149, 78];

      const rows = 10;
      const cols = 16;
      const w = width * 0.88;
      const h = height * 0.82;
      const amp = Math.min(w, h) * 0.055;
      const f = 2.4;
      const cx = width / 2;
      const cy = height / 2;

      const px: number[][] = [];
      const py: number[][] = [];
      const light: number[][] = [];

      const cosY = Math.cos(curTiltY);
      const sinY = Math.sin(curTiltY);
      const cosX = Math.cos(curTiltX);
      const sinX = Math.sin(curTiltX);

      for (let r = 0; r < rows; r++) {
        px.push([]);
        py.push([]);
        light.push([]);

        for (let c = 0; c < cols; c++) {
          const nx = c / (cols - 1) - 0.5;
          const ny = r / (rows - 1) - 0.5;

          // Calm wave undulation
          const zv =
            amp *
            (Math.sin(nx * Math.PI * 2 + slow * 0.35) *
              Math.cos(ny * Math.PI * 2 - slow * 0.28) +
              0.5 * Math.sin((nx + ny) * Math.PI * 3 + slow * 0.5));

          // 3D rotation: Yaw around Y, Pitch around X
          const x1 = nx * cosY + (zv / w) * sinY;
          const z1 = -nx * sinY + (zv / w) * cosY;
          const y1 = ny * cosX - z1 * sinX;
          const z2 = ny * sinX + z1 * cosX;

          const sc = f / (f + z2);
          px[r].push(cx + x1 * w * sc);
          py[r].push(cy + y1 * h * sc);

          const dir = (0.5 + nx) * 0.85 + (0.5 - ny) * 0.85;
          light[r].push(Math.max(0, Math.min(1, 0.26 + dir * 0.9)));
        }
      }

      // Draw clean, crisp 1px wireframe lines
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (c < cols - 1) {
            drawEdge(ctx, px[r][c], py[r][c], light[r][c], px[r][c + 1], py[r][c + 1], light[r][c + 1]);
          }
          if (r < rows - 1) {
            drawEdge(ctx, px[r][c], py[r][c], light[r][c], px[r + 1][c], py[r + 1][c], light[r + 1][c]);
          }
        }
      }

      function drawEdge(c2d: CanvasRenderingContext2D, x1: number, y1: number, l1: number, x2: number, y2: number, l2: number) {
        const lm = (l1 + l2) / 2;
        const red = Math.round(dark[0] + (lit[0] - dark[0]) * lm);
        const green = Math.round(dark[1] + (lit[1] - dark[1]) * lm);
        const blue = Math.round(dark[2] + (lit[2] - dark[2]) * lm);
        const alpha = (0.28 + 0.55 * lm).toFixed(2);

        c2d.strokeStyle = `rgba(${red},${green},${blue},${alpha})`;
        c2d.beginPath();
        c2d.moveTo(x1, y1);
        c2d.lineTo(x2, y2);
        c2d.stroke();
      }
    };

    if (prefersReduced) {
      frame(0);
    } else {
      const loop = (now: number) => {
        frame(now);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const { r, g, b } = currentColor;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex h-[480px] w-full items-center justify-center sm:h-[520px] lg:h-[560px]"
    >
      {/* LAYER 0: Reactive Ambient Background Aura (color dictated by the current slide/picture) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 z-0 transition-all duration-1000 ease-out sm:-inset-10"
        style={{
          background: `radial-gradient(circle at 60% 45%, rgba(${r}, ${g}, ${b}, 0.22), transparent 68%)`,
          filter: "blur(60px)",
        }}
      />

      {/* LAYER 1: Frameless 3D Reactive Mesh (fades out at edges into the background) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        style={{
          maskImage:
            "radial-gradient(ellipse 92% 88% at 50% 50%, black 35%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 92% 88% at 50% 50%, black 35%, transparent 95%)",
        }}
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      {/* LAYER 2: Auto-sliding Showcase Gallery (borderless, fading into the mesh) */}
      <div
        className="relative z-20 w-full max-w-[490px] px-2"
        style={{
          maskImage:
            "radial-gradient(ellipse 98% 95% at 50% 50%, black 72%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 98% 95% at 50% 50%, black 72%, transparent 100%)",
        }}
      >
        <div className="relative overflow-hidden rounded-xl bg-surface/80 p-5 shadow-2xl backdrop-blur-md sm:p-7 transition-colors duration-500">
          {/* Subtle top ambient accent bar matching active slide color */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[1.5px] transition-colors duration-700"
            style={{
              background: `linear-gradient(to right, transparent, rgba(${r}, ${g}, ${b}, 0.8), transparent)`,
            }}
          />

          {/* Slide Header: Category & Counter */}
          <div className="mb-4 flex items-center justify-between">
            <span
              className="font-mono text-[10px] font-semibold tracking-widest uppercase transition-colors duration-500"
              style={{ color: activeSlide.themeColor.hex }}
            >
              {activeSlide.category}
            </span>
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
              <span className="font-semibold text-text">0{activeIdx + 1}</span>
              <span>/</span>
              <span>0{slides.length}</span>
            </div>
          </div>

          {/* Slide Visual Mockup Preview */}
          <div className="relative mb-5 h-44 w-full overflow-hidden rounded-lg bg-base/80 sm:h-52">
            {activeSlide.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                className="h-full w-full object-cover transition-transform duration-700"
              />
            ) : (
              <SlideMockupGraphic slide={activeSlide} />
            )}

            {/* Soft inner vignette */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent"
            />

            {/* Highlight badge floating inside mockup */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-surface/90 px-2.5 py-1 backdrop-blur font-mono text-[11px] text-text border border-line/60">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: activeSlide.themeColor.hex,
                  boxShadow: `0 0 6px ${activeSlide.themeColor.hex}`,
                }}
              />
              <span>{activeSlide.highlight}</span>
            </div>
          </div>

          {/* Slide Info */}
          <div className="mb-4">
            <h3 className="font-display text-xl font-bold tracking-tight text-text sm:text-2xl">
              {activeSlide.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2 sm:text-sm">
              {activeSlide.description}
            </p>
          </div>

          {/* Stack tags */}
          <div className="mb-6 flex flex-wrap gap-1.5">
            {activeSlide.stack.map((tag) => (
              <span
                key={tag}
                className="rounded-none border border-line bg-surface/70 px-2 py-0.5 font-mono text-[10px] tracking-wider text-muted transition-colors hover:text-text"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Gallery Navigation Controls: Prev/Next & Slide Indicator Bars */}
          <div className="flex items-center justify-between border-t border-line/60 pt-4">
            {/* Pill progress bars */}
            <div className="flex items-center gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveIdx(idx)}
                  className="group relative h-1.5 cursor-pointer rounded-full transition-all duration-300"
                  style={{
                    width: idx === activeIdx ? "28px" : "10px",
                    backgroundColor:
                      idx === activeIdx
                        ? activeSlide.themeColor.hex
                        : "var(--line)",
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Chevron buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="flex h-7 w-7 cursor-pointer items-center justify-center border border-line bg-surface text-muted transition-colors hover:border-amber hover:text-text"
                aria-label="Previous slide"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="flex h-7 w-7 cursor-pointer items-center justify-center border border-line bg-surface text-muted transition-colors hover:border-amber hover:text-text"
                aria-label="Next slide"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tailored, high-fidelity UI mockup graphics for each slide
function SlideMockupGraphic({ slide }: { slide: ShowcaseSlide }) {
  const { hex } = slide.themeColor;

  if (slide.id === "edtech-rag") {
    return (
      <div className="relative h-full w-full p-4 font-mono text-[11px] select-none">
        <div className="mb-2 flex items-center justify-between border-b border-line/60 pb-2 text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hex }} />
            <span>edtech-rag-pipeline // query</span>
          </span>
          <span className="text-[10px] text-muted/70">latency: 48ms</span>
        </div>
        <div className="space-y-2">
          <div className="rounded bg-surface/60 p-2 text-text">
            <span className="text-[#9d7eff]">&gt; Query:</span> &quot;How do I structure
            formative assessments for grade 7 biology?&quot;
          </div>
          <div className="rounded bg-surface/40 p-2 text-muted/90 text-[10px] leading-relaxed">
            <span className="text-[#2ee6c8]">&lt; RAG:</span> Retrieved 3 Ministry
            curriculum units. Synthesizing diagnostic rubrics...
          </div>
        </div>
      </div>
    );
  }

  if (slide.id === "curriculum-modules") {
    return (
      <div className="relative h-full w-full p-4 font-mono text-[11px] select-none">
        <div className="mb-3 flex items-center justify-between border-b border-line/60 pb-2 text-muted">
          <span>curriculum-authoring // v2.4</span>
          <span className="text-amber">60 modules</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Unit 01", state: "Shipped", val: "100%" },
            { label: "Unit 02", state: "Active", val: "88%" },
            { label: "Unit 03", state: "Review", val: "64%" },
          ].map((m) => (
            <div key={m.label} className="border border-line/60 bg-surface/50 p-2">
              <div className="text-[10px] text-muted">{m.label}</div>
              <div className="font-semibold text-text">{m.val}</div>
              <div className="mt-1 text-[9px] text-amber">{m.state}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.id === "telegram-bots") {
    return (
      <div className="relative h-full w-full p-4 font-mono text-[11px] select-none">
        <div className="mb-2 flex items-center justify-between border-b border-line/60 pb-2 text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hex }} />
            <span>telegram-bot-gateway</span>
          </span>
          <span className="text-[#2ee6c8]">4,000+ active</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-end">
            <div className="rounded bg-[#2ee6c8]/15 px-2.5 py-1.5 text-text">
              /guidance latest_directives
            </div>
          </div>
          <div className="flex justify-start">
            <div className="rounded bg-surface/60 px-2.5 py-1.5 text-muted text-[10px]">
              Found: Directive #2026/04 issued to 4,000 school leaders.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NARD Candles
  return (
    <div className="relative h-full w-full p-4 font-mono text-[11px] select-none">
      <div className="mb-3 flex items-center justify-between border-b border-line/60 pb-2 text-muted">
        <span>nard-store // checkout</span>
        <span className="text-[#f08a70]">Chapa Pay</span>
      </div>
      <div className="flex items-center justify-between border border-line/60 bg-surface/50 p-2.5">
        <div>
          <div className="font-display font-semibold text-text">Santal &amp; Amber Noir</div>
          <div className="text-[10px] text-muted">Hand-poured 220g • Soy Wax</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-[#f08a70]">1,450 ETB</div>
          <div className="text-[9px] text-muted">In stock</div>
        </div>
      </div>
    </div>
  );
}
