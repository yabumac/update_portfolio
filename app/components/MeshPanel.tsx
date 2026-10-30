"use client";

import { useEffect, useRef } from "react";

// A slow, alive wireframe "surface" drawn on a 2D canvas.
// No WebGL, no external engine: a light undulating mesh in warm brown,
// lit softly from the top-right. Static single frame under reduced motion.

export default function MeshPanel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // warm brown palette, lit toward amber
    const dark = [64, 43, 28];
    const lit = [214, 149, 78];

    const edgeColor = (l: number) => {
      const r = Math.round(dark[0] + (lit[0] - dark[0]) * l);
      const g = Math.round(dark[1] + (lit[1] - dark[1]) * l);
      const b = Math.round(dark[2] + (lit[2] - dark[2]) * l);
      return `rgba(${r},${g},${b},${(0.35 + 0.6 * l).toFixed(2)})`;
    };

    const drawEdge = (
      x1: number,
      y1: number,
      l1: number,
      x2: number,
      y2: number,
      l2: number
    ) => {
      const lm = (l1 + l2) / 2;
      ctx.strokeStyle = edgeColor(lm);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      const margin = 24;
      const w = width - margin * 2;
      const h = height - margin * 2;
      const f = 2.4;
      const amp = Math.min(width, height) * 0.055;
      const narrow = width < 560;
      const rows = narrow ? 7 : 12;
      const cols = narrow ? 12 : 19;
      const slow = reduced ? 7 : t / 1000;

      const px: number[][] = [];
      const py: number[][] = [];
      const light: number[][] = [];

      for (let r = 0; r < rows; r++) {
        px.push([]);
        py.push([]);
        light.push([]);
        for (let c = 0; c < cols; c++) {
          const nx = c / (cols - 1) - 0.5;
          const ny = r / (rows - 1) - 0.5;
          const zv =
            amp *
            (Math.sin(nx * Math.PI * 2 + slow * 0.35) *
              Math.cos(ny * Math.PI * 2 - slow * 0.28) +
              0.5 * Math.sin((nx + ny) * Math.PI * 3 + slow * 0.5));
          const sc = f / (f + zv);
          px[r].push(width / 2 + nx * w * sc);
          py[r].push(height / 2 + ny * h * sc);

          // soft light from the top-right, slight bias down-left
          const dir = (0.5 + nx) * 0.85 + (0.5 - ny) * 0.85;
          light[r].push(Math.max(0, Math.min(1, 0.26 + dir * 0.9)));
        }
      }

      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (c < cols - 1) {
            drawEdge(
              px[r][c], py[r][c], light[r][c],
              px[r][c + 1], py[r][c + 1], light[r][c + 1]
            );
          }
          if (r < rows - 1) {
            drawEdge(
              px[r][c], py[r][c], light[r][c],
              px[r + 1][c], py[r + 1][c], light[r + 1][c]
            );
          }
        }
      }
    };

    if (reduced) {
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
    };
  }, []);

  return (
    <figure className="relative overflow-hidden border border-line bg-surface">
      <canvas
        ref={canvasRef}
        className="h-44 w-full sm:h-56 lg:h-[360px]"
        role="img"
        aria-label="Slow-moving brown wireframe surface lit from the top right"
      />
      {/* soft directional light from the top-right, laid over the mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 130% at 82% 0%, rgba(242,169,59,0.14), transparent 58%), radial-gradient(140% 140% at 10% 100%, rgba(20,19,26,0.55), transparent 70%)",
        }}
      />
      <figcaption className="absolute right-3 bottom-3 left-3 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted">
        <span>surf / mesh-01</span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-amber"
            aria-hidden="true"
          />
          idle
        </span>
      </figcaption>
    </figure>
  );
}