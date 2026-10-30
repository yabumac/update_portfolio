import type { Metadata } from "next";
import { Space_Grotesk, Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Yabsera Teshome — Tech Lead & Full-stack/AI Developer",
  description:
    "Yabsera Teshome builds AI-driven EdTech systems end-to-end. Tech Lead at EdTech Hub. 4,000+ school leaders reached, 60+ modules shipped.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-text">
        {children}
      </body>
    </html>
  );
}
