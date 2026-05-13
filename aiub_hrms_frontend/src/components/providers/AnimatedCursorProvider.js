"use client";
import dynamic from "next/dynamic";
const AnimatedCursor = dynamic(() => import("react-animated-cursor"), { ssr: false });

export default function AnimatedCursorProvider() {
  return (
    <AnimatedCursor
      innerSize={8}
      outerSize={32}
      color="var(--cursor-color, 59, 130, 246)"
      outerAlpha={0.15}
      innerScale={0.8}
      outerScale={1.4}
      trailingSpeed={6}
    />
  );
}
