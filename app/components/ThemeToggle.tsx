"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initial = stored === "light" || (!stored && prefersLight) ? "light" : "dark";
    
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const applyTheme = (t: "dark" | "light") => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t);
    if (t === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const isLight = mounted ? theme === "light" : false;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      suppressHydrationWarning
      className="group relative inline-flex items-center gap-2 border border-line bg-surface/80 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted backdrop-blur transition-all duration-200 hover:border-amber hover:text-text cursor-pointer select-none"
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
      aria-label={`Current theme is ${isLight ? "light" : "dark"}. Click to toggle.`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full transition-all duration-200 ${
          isLight ? "bg-amber shadow-[0_0_6px_var(--amber)]" : "bg-amber/60"
        }`}
        aria-hidden="true"
      />
      <span className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted group-hover:text-amber transition-colors">
          MODE:
        </span>
        <span className="font-semibold text-text">
          {isLight ? "LIGHT" : "DARK"}
        </span>
      </span>
      {isLight ? (
        <svg
          className="h-3 w-3 text-amber"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg
          className="h-3 w-3 text-muted group-hover:text-amber transition-colors"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
