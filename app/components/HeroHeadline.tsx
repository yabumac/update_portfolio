"use client";

import { useEffect, useRef, useState } from "react";
import { useReactiveColor } from "../context/ReactiveColorContext";

// Concise, high-impact 3-line punchlines that fit the design with zero overflow
const HEADLINES = [
  {
    lines: ["4,000+ leaders", "use what I", "built."],
  },
  {
    lines: ["60+ modules", "shipped to", "scale."],
  },
  {
    lines: ["Applied AI", "shipped for", "impact."],
  },
  {
    lines: ["Full systems", "built end", "to end."],
  },
];

// Tactical Call of Duty / Black Ops military cipher characters
const COD_CIPHERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&<>/_[]$";

export default function HeroHeadline() {
  const { activeIdx, currentColor } = useReactiveColor();
  const { r, g, b, hex } = currentColor;

  const targetHeadline = HEADLINES[activeIdx % HEADLINES.length];
  const [displayedLines, setDisplayedLines] = useState<string[]>(targetHeadline.lines);
  const [activeCursorPos, setActiveCursorPos] = useState<{ line: number; col: number } | null>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplayedLines(targetHeadline.lines);
      return;
    }

    const lines = targetHeadline.lines;
    const totalChars = lines.reduce((acc, l) => acc + l.length, 0);

    // Call of Duty terminal typewriter cipher cadence:
    // Snappy, rhythmic, left-to-right decipher
    const startTime = performance.now();
    const duration = 1050; // Total sequence duration in ms

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Map progress to total characters across lines sequentially (Left to Right)
      const currentGlobalChar = Math.floor(progress * (totalChars + 2));

      let charCounter = 0;
      let activeLine = -1;
      let activeCol = -1;

      const nextLines = lines.map((line, lineIdx) => {
        let result = "";
        for (let c = 0; c < line.length; c++) {
          const targetChar = line[c];
          const globalIdx = charCounter;
          charCounter++;

          if (targetChar === " ") {
            result += " ";
            continue;
          }

          // Case 1: Already decoded and locked
          if (globalIdx < currentGlobalChar) {
            result += targetChar;
          }
          // Case 2: Under the active decipher playhead (tactical COD scramble)
          else if (globalIdx === currentGlobalChar || globalIdx === currentGlobalChar + 1) {
            activeLine = lineIdx;
            activeCol = c;
            // Rapid cipher tick
            const randCipher = COD_CIPHERS[Math.floor((now / 35 + globalIdx * 7) % COD_CIPHERS.length)];
            result += randCipher;
          }
          // Case 3: Ahead of the playhead (not yet reached)
          else {
            result += "";
          }
        }
        return result;
      });

      setDisplayedLines(nextLines);
      if (activeLine >= 0) {
        setActiveCursorPos({ line: activeLine, col: activeCol });
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        // Finalize: lock full text, trigger brief COD chromatic snap
        setDisplayedLines(lines);
        setActiveCursorPos(null);
        setIsGlitching(true);
        const timer = setTimeout(() => {
          setIsGlitching(false);
        }, 280);
        return () => clearTimeout(timer);
      }
    };

    animRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [activeIdx, targetHeadline]);

  // First letter of Line 1 for dreamy flowing gradient
  const line0 = displayedLines[0] || "";
  const firstChar = line0.charAt(0);
  const restOfLine0 = line0.slice(1);

  // Secondary soft accent for the dreamy gradient flow
  const secondaryColor =
    activeIdx === 0
      ? "#f2a93b" // Violet blends into warm gold
      : activeIdx === 1
      ? "#ff8a50" // Gold blends into warm sunset peach
      : activeIdx === 2
      ? "#7a5cff" // Cyan blends into royal violet
      : "#f2a93b"; // Terracotta blends into amber gold

  return (
    // STRICT FIXED HEIGHT: Prevents any vertical movement of elements below it!
    <div className="relative h-[155px] sm:h-[185px] lg:h-[215px] w-full select-none overflow-visible">
      <h1
        className={`font-display text-5xl font-bold leading-[0.95] tracking-tight text-text sm:text-6xl lg:text-7xl h-full flex flex-col justify-between whitespace-nowrap text-left ${
          isGlitching ? "cod-glitch-active" : ""
        }`}
        aria-label={targetHeadline.lines.join(" ")}
      >
        {/* Line 1: First letter has the flowy dreamy gradient */}
        <div className="h-[48px] sm:h-[58px] lg:h-[68px] flex items-center text-left">
          {firstChar && (
            <span
              className="inline-block transition-all duration-1000 ease-out font-display mr-0.5"
              style={{
                backgroundImage: `linear-gradient(135deg, ${hex}, ${secondaryColor}, #ffffff)`,
                backgroundSize: "220% 220%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: `drop-shadow(0 0 16px rgba(${r}, ${g}, ${b}, 0.45))`,
                animation: "dreamy-flow 5s ease-in-out infinite alternate",
              }}
            >
              {firstChar}
            </span>
          )}
          <span>{restOfLine0}</span>
          {activeCursorPos?.line === 0 && (
            <span
              className="inline-block h-[0.75em] w-[0.35em] ml-1 align-baseline transition-colors"
              style={{ backgroundColor: hex, boxShadow: `0 0 8px ${hex}` }}
            />
          )}
        </div>

        {/* Line 2 */}
        <div className="h-[48px] sm:h-[58px] lg:h-[68px] flex items-center text-left">
          <span>{displayedLines[1] || ""}</span>
          {activeCursorPos?.line === 1 && (
            <span
              className="inline-block h-[0.75em] w-[0.35em] ml-1 align-baseline transition-colors"
              style={{ backgroundColor: hex, boxShadow: `0 0 8px ${hex}` }}
            />
          )}
        </div>

        {/* Line 3 */}
        <div className="h-[48px] sm:h-[58px] lg:h-[68px] flex items-center text-left">
          <span>{displayedLines[2] || ""}</span>
          {activeCursorPos?.line === 2 && (
            <span
              className="inline-block h-[0.75em] w-[0.35em] ml-1 align-baseline transition-colors"
              style={{ backgroundColor: hex, boxShadow: `0 0 8px ${hex}` }}
            />
          )}
        </div>
      </h1>
    </div>
  );
}
