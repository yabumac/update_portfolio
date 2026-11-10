"use client";

import { useEffect, useState, useRef } from "react";
import { useReactiveColor } from "../context/ReactiveColorContext";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "#systems", label: "systems" },
  { href: "#experience", label: "experience" },
  { href: "#skills", label: "skills" },
  { href: "#contact", label: "contact" },
];

export default function HeroBottomBar({ scrollY = 0 }: { scrollY?: number }) {
  const { currentColor } = useReactiveColor();
  const { r, g, b, hex } = currentColor;

  const [internalScrollY, setInternalScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(800);
  const [collisionFlash, setCollisionFlash] = useState(false);
  const hasCollidedRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setInternalScrollY(window.scrollY);
    };
    const handleResize = () => {
      setViewportHeight(window.innerHeight || 800);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeY = scrollY || internalScrollY;

  // Collision triggers around scrollY = 70px to 95px
  // As activeY reaches 75px, the bottom flare shoots up and hits the top
  const flightProgress = Math.min(1, Math.max(0, activeY / 75));
  const isDockedAtTop = activeY >= 75;

  // Trigger the brief "BOOM" collision color flare
  useEffect(() => {
    if (activeY >= 75 && !hasCollidedRef.current) {
      hasCollidedRef.current = true;
      setCollisionFlash(true);
      const timer = setTimeout(() => {
        setCollisionFlash(false);
      }, 550);
      return () => clearTimeout(timer);
    } else if (activeY < 45) {
      hasCollidedRef.current = false;
      setCollisionFlash(false);
    }
  }, [activeY]);

  // Distance from bottom-6 to top-0
  const flightDistance = viewportHeight - 64;
  const flareTranslateY = -flightProgress * flightDistance;
  const flareOpacity = isDockedAtTop ? 0 : Math.max(0, 1 - flightProgress * 1.4);

  return (
    <>
      {/* 1. BOTTOM FLARE: at bottom of hero screen, shoots up fast on scroll */}
      <aside
        aria-label="Scroll prompt and location"
        style={{
          transform: `translate(-50%, ${flareTranslateY}px)`,
          opacity: flareOpacity,
          pointerEvents: flareOpacity > 0.1 ? "auto" : "none",
        }}
        className="fixed bottom-6 left-1/2 z-40 w-auto select-none transition-transform duration-100 ease-out"
      >
        <a
          href="#systems"
          className="group relative flex items-center gap-3 rounded-full border border-line bg-surface/90 px-4 py-2 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-amber"
          style={{
            boxShadow: `0 8px 30px -4px rgba(${r}, ${g}, ${b}, 0.25)`,
          }}
        >
          {/* Subtle colored glow edge */}
          <div
            aria-hidden="true"
            className="absolute -inset-0.5 rounded-full opacity-40 blur-sm transition-colors duration-700"
            style={{
              background: `radial-gradient(circle, rgba(${r}, ${g}, ${b}, 0.5), transparent 70%)`,
            }}
          />

          <span className="relative flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted group-hover:text-text transition-colors">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full transition-colors duration-700"
              style={{ backgroundColor: hex }}
            />
            <span>Addis Ababa / remote</span>
          </span>

          <span className="relative text-line font-mono text-xs">•</span>

          <span className="relative flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted group-hover:text-amber transition-colors">
            <span>Scroll to explore</span>
            <svg
              className="h-3 w-3 text-amber transition-transform duration-200 group-hover:translate-y-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </a>
      </aside>

      {/* 2. BOOM COLLISION IMPACT FLASH (short-lived color flare burst across top navbar) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 inset-x-0 z-50 h-16 transition-opacity duration-500 ease-out ${
          collisionFlash ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `radial-gradient(ellipse 70% 100% at 50% 0%, rgba(${r}, ${g}, ${b}, 0.75), transparent 85%)`,
          filter: "blur(18px)",
        }}
      />

      {/* 3. MINIMAL STICKY TOP NAVBAR (pinned to the very top, slim & takes minimal space) */}
      <nav
        aria-label="Main persistent navigation"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ease-out ${
          isDockedAtTop
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative border-b border-line/70 bg-base/85 backdrop-blur-md transition-colors duration-300">
          {/* Subtle bottom hairline in active color */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[1px] opacity-40 transition-colors duration-700"
            style={{
              background: `linear-gradient(to right, transparent, rgba(${r}, ${g}, ${b}, 0.8), transparent)`,
            }}
          />

          <div className="mx-auto flex h-11 max-w-6xl items-center justify-between px-4 sm:h-12 sm:px-8">
            {/* Left: compact brand */}
            <a
              href="#top"
              className="flex items-center gap-2 font-mono text-xs tracking-tight text-text hover:text-amber transition-colors"
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full transition-colors duration-700"
                style={{ backgroundColor: hex }}
              />
              <span className="font-semibold">yabsera</span>
              <span className="hidden font-mono text-[10px] text-muted sm:inline">
                // 9.03°N
              </span>
            </a>

            {/* Center: quick nav links */}
            <ul className="flex items-center gap-4 font-mono text-xs text-muted sm:gap-6">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:text-text transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right: compact location flare & theme toggle */}
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted/70 lg:inline">
                Addis Ababa / remote
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
