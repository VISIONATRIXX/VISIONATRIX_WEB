"use client";

import { useRef, useState, useEffect, memo } from "react";
import { motion, useScroll, useTransform, useSpring, MotionStyle } from "framer-motion";

interface ScrollAnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  enableY?: boolean;
  enableScale?: boolean;
  enableOpacity?: boolean;
}

export default memo(function ScrollAnimatedWrapper({
  children,
  className = "",
  enableY = true,
  enableScale = true,
  enableOpacity = true,
}: ScrollAnimatedWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // On mobile, skip all scroll tracking — render plain div for zero overhead
  if (isMobile) {
    return (
      <div ref={ref} className={`w-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <DesktopScrollWrapper
      ref={ref}
      className={className}
      enableY={enableY}
      enableScale={enableScale}
      enableOpacity={enableOpacity}
    >
      {children}
    </DesktopScrollWrapper>
  );
});

// Separate desktop-only component to avoid loading scroll hooks on mobile
import { forwardRef } from "react";

interface DesktopScrollWrapperProps {
  children: React.ReactNode;
  className: string;
  enableY: boolean;
  enableScale: boolean;
  enableOpacity: boolean;
}

const DesktopScrollWrapper = forwardRef<HTMLDivElement, DesktopScrollWrapperProps>(
  function DesktopScrollWrapper({ children, className, enableY, enableScale, enableOpacity }, ref) {
    const innerRef = useRef<HTMLDivElement>(null);
    
    const { scrollYProgress } = useScroll({
      target: innerRef,
      offset: ["start end", "end start"],
    });

    // Lighter spring config — less computation per frame
    const smoothProgress = useSpring(scrollYProgress, {
      stiffness: 60,
      damping: 20,
      restDelta: 0.002
    });

    const opacityVal = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4]);
    const scaleVal = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0.96, 1, 1, 0.96]);
    const yVal = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [30, 0, 0, -30]);

    const style: MotionStyle = {};
    if (enableOpacity) style.opacity = opacityVal;
    if (enableScale) style.scale = scaleVal;
    if (enableY) style.y = yVal;

    return (
      <motion.div
        ref={(node) => {
          // Merge refs
          (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        style={style}
        className={`w-full ${className}`}
      >
        {children}
      </motion.div>
    );
  }
);
