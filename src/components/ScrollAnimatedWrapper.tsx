"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionStyle } from "framer-motion";

interface ScrollAnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  enableY?: boolean;
  enableScale?: boolean;
  enableOpacity?: boolean;
}

export default function ScrollAnimatedWrapper({
  children,
  className = "",
  enableY = true,
  enableScale = true,
  enableOpacity = true,
}: ScrollAnimatedWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the element relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth out the scroll values using springs for butter-smooth 60 FPS performance
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001
  });

  // Professional Luxury transforms:
  // - Entering: start end (0.0) -> center (0.25)
  // - Fully active / visible in viewport center (0.25 to 0.75)
  // - Exiting: center (0.75) -> end start (1.0)
  const opacityVal = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4]);
  const scaleVal = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0.94, 1, 1, 0.94]);
  const yVal = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [40, 0, 0, -40]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Decoupled custom styling
  const style: MotionStyle = {};
  if (!isMobile) {
    if (enableOpacity) style.opacity = opacityVal;
    if (enableScale) style.scale = scaleVal;
    if (enableY) style.y = yVal;
  } else {
    // Explicitly reset on mobile to avoid values getting stuck in faded state (e.g. opacity 0.4)
    style.opacity = 1;
    style.scale = 1;
    style.y = 0;
  }

  return (
    <motion.div
      ref={ref}
      style={style}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
