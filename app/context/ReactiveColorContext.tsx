"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type ShowcaseSlide = {
  id: string;
  category: string;
  title: string;
  highlight: string;
  description: string;
  stack: string[];
  image?: string;
  themeColor: {
    r: number;
    g: number;
    b: number;
    hex: string;
    accentClass: string;
  };
};

export const SLIDES: ShowcaseSlide[] = [
  {
    id: "edtech-rag",
    category: "AI / EDTECH SYSTEMS",
    title: "EdTech Hub — LMS + RAG",
    highlight: "Live in Production",
    description:
      "Context-aware AI answers for educators inside the learning platform, turning standard curricula into interactive guided intelligence.",
    stack: ["Python", "RAG", "LMS", "LLM"],
    themeColor: {
      r: 122,
      g: 92,
      b: 255,
      hex: "#7a5cff",
      accentClass: "text-[#9d7eff]",
    },
  },
  {
    id: "curriculum-modules",
    category: "INTERACTIVE LEARNING SYSTEMS",
    title: "Digitized Curriculum Modules",
    highlight: "60+ Modules Shipped",
    description:
      "Transforms printed curricula into rich interactive digital learning modules that students and educators can actively navigate.",
    stack: ["Elixir", "Authoring", "LMS"],
    themeColor: {
      r: 242,
      g: 169,
      b: 59,
      hex: "#f2a93b",
      accentClass: "text-amber",
    },
  },
  {
    id: "telegram-bots",
    category: "MOBILE AI INFRASTRUCTURE",
    title: "MoE Telegram AI Bots",
    highlight: "4,000+ School Leaders",
    description:
      "Direct mobile AI guidance putting ministry circulars and intelligent assistance directly onto leaders' smartphones nationwide.",
    stack: ["Telegram", "Python", "AI", "FastAPI"],
    themeColor: {
      r: 46,
      g: 230,
      b: 200,
      hex: "#2ee6c8",
      accentClass: "text-[#2ee6c8]",
    },
  },
  {
    id: "nard-candles",
    category: "DIGITAL PRODUCT & COMMERCE",
    title: "NARD Candles Store",
    highlight: "Live Commerce • Chapa",
    description:
      "A bespoke minimalist storefront delivering an elegant sensory shopping journey with seamless integrated local checkout.",
    stack: ["React", "Tailwind", "Chapa"],
    themeColor: {
      r: 224,
      g: 122,
      b: 95,
      hex: "#e07a5f",
      accentClass: "text-[#f08a70]",
    },
  },
];

type ReactiveColorContextType = {
  activeIdx: number;
  setActiveIdx: (idx: number) => void;
  activeSlide: ShowcaseSlide;
  currentColor: ShowcaseSlide["themeColor"];
  nextSlide: () => void;
  prevSlide: () => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  slides: ShowcaseSlide[];
};

const defaultSlide = SLIDES[0];

const ReactiveColorContext = createContext<ReactiveColorContextType>({
  activeIdx: 0,
  setActiveIdx: () => {},
  activeSlide: defaultSlide,
  currentColor: defaultSlide.themeColor,
  nextSlide: () => {},
  prevSlide: () => {},
  isPaused: false,
  setIsPaused: () => {},
  slides: SLIDES,
});

export function ReactiveColorProvider({ children }: { children: React.ReactNode }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const activeSlide = SLIDES[activeIdx] || SLIDES[0];

  return (
    <ReactiveColorContext.Provider
      value={{
        activeIdx,
        setActiveIdx,
        activeSlide,
        currentColor: activeSlide.themeColor,
        nextSlide,
        prevSlide,
        isPaused,
        setIsPaused,
        slides: SLIDES,
      }}
    >
      {children}
    </ReactiveColorContext.Provider>
  );
}

export function useReactiveColor() {
  return useContext(ReactiveColorContext);
}
