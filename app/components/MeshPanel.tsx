"use client";

import { useEffect, useRef } from "react";

// Subtle 3D reactive mesh wireframe.
// - Calm, original undulation tempo.
// - 3D perspective response to cursor movement across the entire page (subtle flex).
// - Gold/warm brown wireframe is dominant (crisp 1px lines, no blur on the main mesh).
// - Rare pop colors that only appear occasionally as subtle traveling pulses.
// - Breakout lines that visibly escape past the box border into a blurred smoky mirror background.
// - Seamless color blending in both dark and luxury light mode.

export default function MeshPanel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Global 3D cursor tilt (reacts to mouse movement across the whole window)
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized from -1 to 1 across window
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      // Subtle flex tilt angles (max ~14 degrees)
      targetTiltY = nx * 0.28;
      targetTiltX = -ny * 0.18;
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

    // Rare accent colors (rarely shown)
    const RARE_VIOLET = { r: 122, g: 92, b: 255 };
    const RARE_CYAN = { r: 46, g: 230, b: 200 };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.getAttribute("data-theme") === "light";

      // Smooth 3D tilt inertia
      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;

      // Original calm tempo
      const slow = prefersReduced ? 7 : t / 1000;
      const breathing = prefersReduced ? 0 : Math.sin(slow * 0.35) * 0.02;
      const curTiltX = tiltX + breathing;
      const curTiltY = tiltY;

      // Define the inner "box" boundary (centered with padding so breakout lines can escape)
      const padX = Math.max(28, width * 0.08);
      const padY = Math.max(28, height * 0.08);
      const boxLeft = padX;
      const boxTop = padY;
      const boxWidth = width - padX * 2;
      const boxHeight = height - padY * 2;
      const cx = width / 2;
      const cy = height / 2;

      // Palette: warm brown to amber gold (dominant)
      const dark = isLight ? [165, 142, 120] : [64, 43, 28];
      const lit = isLight ? [184, 115, 20] : [214, 149, 78];

      // Grid settings
      const narrow = width < 560;
      const rows = narrow ? 8 : 12;
      const cols = narrow ? 13 : 19;
      const amp = Math.min(boxWidth, boxHeight) * 0.055;
      const f = 2.4;

      // Precalculate 3D points
      const px: number[][] = [];
      const py: number[][] = [];
      const light: number[][] = [];
      const isOutside: boolean[][] = [];

      // 3D rotation trig
      const cosY = Math.cos(curTiltY);
      const sinY = Math.sin(curTiltY);
      const cosX = Math.cos(curTiltX);
      const sinX = Math.sin(curTiltX);

      // A gentle wave pulse for rare breakout timing (every ~7 seconds)
      const breakoutCycle = Math.sin(slow * 0.45);
      const allowBreakout = breakoutCycle > 0.15;

      for (let r = 0; r < rows; r++) {
        px.push([]);
        py.push([]);
        light.push([]);
        isOutside.push([]);

        for (let c = 0; c < cols; c++) {
          const nx = c / (cols - 1) - 0.5;
          const ny = r / (rows - 1) - 0.5;

          // Original wave math
          const zv =
            amp *
            (Math.sin(nx * Math.PI * 2 + slow * 0.35) *
              Math.cos(ny * Math.PI * 2 - slow * 0.28) +
              0.5 * Math.sin((nx + ny) * Math.PI * 3 + slow * 0.5));

          // Breakout factor: outer perimeter points gently stretch past the box
          const isEdge = (r === 0 || r === rows - 1 || c === cols - 1) && (nx + ny > 0.1 || nx - ny < -0.2);
          const stretch = (isEdge && allowBreakout)
            ? 1.0 + (breakoutCycle - 0.15) * 0.38
            : 1.0;

          // 3D rotation: Yaw around Y, Pitch around X
          const x1 = nx * cosY + (zv / boxWidth) * sinY;
          const z1 = -nx * sinY + (zv / boxWidth) * cosY;
          const y1 = ny * cosX - z1 * sinX;
          const z2 = ny * sinX + z1 * cosX;

          // Perspective projection
          const sc = f / (f + z2);
          const screenX = cx + x1 * boxWidth * sc * stretch;
          const screenY = cy + y1 * boxHeight * sc * stretch;

          px[r].push(screenX);
          py[r].push(screenY);

          // Test if point is outside the inner box
          const outside =
            screenX < boxLeft ||
            screenX > boxLeft + boxWidth ||
            screenY < boxTop ||
            screenY > boxTop + boxHeight;
          isOutside[r].push(outside);

          // Original light calculation (lit from top-right)
          const dir = (0.5 + nx) * 0.85 + (0.5 - ny) * 0.85;
          light[r].push(Math.max(0, Math.min(1, 0.26 + dir * 0.9)));
        }
      }

      // Rare traveling light pulse (appears only once every ~8 seconds on row 3 or 7)
      const pulsePeriod = 8.0;
      const pulseTime = slow % pulsePeriod;
      const pulseActive = pulseTime < 1.6;
      const pulseCol = pulseActive ? (pulseTime / 1.6) * cols : -99;
      const pulseRow = (Math.floor(slow / pulsePeriod) % 2 === 0) ? 3 : 7;

      // Draw all segments
      // 1. Segments inside the box: crisp 1px lines, no blur, dominant gold.
      // 2. Segments that break out into the background: soft blurred smoky mirror glow.
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (c < cols - 1) {
            drawSegment(r, c, r, c + 1);
          }
          if (r < rows - 1) {
            drawSegment(r, c, r + 1, c);
          }
        }
      }

      function drawSegment(r1: number, c1: number, r2: number, c2: number) {
        const x1 = px[r1][c1];
        const y1 = py[r1][c1];
        const x2 = px[r2][c2];
        const y2 = py[r2][c2];
        const lm = (light[r1][c1] + light[r2][c2]) / 2;
        const out = isOutside[r1][c1] || isOutside[r2][c2];

        // Rare pulse check
        const isPulse =
          pulseActive &&
          r1 === pulseRow &&
          Math.abs(c1 - pulseCol) < 1.4;

        ctx.save();

        if (out) {
          // BREAKOUT LINE: outside the box in the smoky background
          // Ethereal smoky blurred glow
          const blurColor = isPulse
            ? `rgba(${RARE_CYAN.r},${RARE_CYAN.g},${RARE_CYAN.b},`
            : isLight
            ? "rgba(184,115,20,"
            : "rgba(214,149,78,";

          ctx.shadowBlur = 8;
          ctx.shadowColor = `${blurColor}0.5)`;
          ctx.strokeStyle = `${blurColor}0.75)`;
          ctx.lineWidth = 1.2;
        } else if (isPulse) {
          // Rare subtle color pulse inside the wireframe
          const pop = (Math.floor(slow / pulsePeriod) % 2 === 0) ? RARE_VIOLET : RARE_CYAN;
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(${pop.r},${pop.g},${pop.b},0.8)`;
          ctx.lineWidth = 1.2;
        } else {
          // STANDARD WIREFRAME: 100% crisp 1px line, zero blur, dominant gold
          const red = Math.round(dark[0] + (lit[0] - dark[0]) * lm);
          const green = Math.round(dark[1] + (lit[1] - dark[1]) * lm);
          const blue = Math.round(dark[2] + (lit[2] - dark[2]) * lm);
          const alpha = 0.35 + 0.6 * lm;

          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(${red},${green},${blue},${alpha.toFixed(2)})`;
          ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
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

  return (
    <div
      ref={containerRef}
      className="relative select-none p-2 sm:p-4"
    >
      {/* Background Smoky Mirror Glass: sits behind the box and blurs breakout lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 border border-line/50 rounded-sm bg-surface/40 backdrop-blur-md transition-colors duration-300"
        style={{
          boxShadow: "0 20px 45px -15px rgba(0,0,0,0.25)",
        }}
      />

      {/* Main Inner Mesh Box: blended into the theme card surface */}
      <figure className="relative z-10 border border-line bg-surface/70 transition-colors duration-300">
        <canvas
          ref={canvasRef}
          className="h-48 w-full sm:h-64 lg:h-[370px]"
          role="img"
          aria-label="3D reactive wireframe surface lit from top right"
        />

        {/* Subtle lighting overlay: perfectly matched for both dark and cream light mode */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 130% at 85% 0%, rgba(214,149,78,0.12), transparent 58%)",
          }}
        />

        {/* Telemetry caption */}
        <figcaption className="absolute right-3 bottom-3 left-3 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted">
          <span>SURF / MESH-01</span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_6px_var(--amber)]"
              aria-hidden="true"
            />
            ONLINE
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
