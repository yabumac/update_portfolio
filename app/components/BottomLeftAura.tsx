"use client";

import { useReactiveColor } from "../context/ReactiveColorContext";

export default function BottomLeftAura() {
  const { currentColor } = useReactiveColor();
  const { r, g, b } = currentColor;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-2 left-2 z-30 h-28 w-28 sm:h-36 sm:w-36 select-none transition-all duration-1000 ease-out"
      style={{
        background: `radial-gradient(circle at 35% 65%, rgba(${r}, ${g}, ${b}, 0.22), transparent 72%)`,
        filter: "blur(40px)",
      }}
    />
  );
}
