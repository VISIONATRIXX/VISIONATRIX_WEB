"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Add custom cursor active class to body when mounted
    document.body.classList.add("custom-cursor-active");

    const cursor = cursorRef.current;
    if (!cursor) return;

    let isVisible = false;

    const moveCursor = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      
      if (!isVisible) {
        cursor.style.opacity = "1";
        isVisible = true;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".calendar-day") ||
        target.closest("select") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest(".interactive-tab") ||
        target.closest("[role='button']") ||
        target.classList.contains("interactive") ||
        target.closest(".interactive");

      if (isInteractive) {
        cursor.classList.add("cursor-hovered");
      } else {
        cursor.classList.remove("cursor-hovered");
      }
    };

    const handleMouseDown = () => {
      cursor.classList.add("cursor-clicked");
    };
    
    const handleMouseUp = () => {
      cursor.classList.remove("cursor-clicked");
    };
    
    // Hide cursor when it leaves the window
    const handleMouseLeave = () => {
      cursor.style.opacity = "0";
      isVisible = false;
    };
    
    const handleMouseEnter = () => {
      cursor.style.opacity = "1";
      isVisible = true;
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 transition-opacity duration-300 will-change-transform"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
      }}
    >
      {/* Outer Ring */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c5a880]/60 w-7 h-7 transition-all duration-150 ease-out cursor-outer"
      />
      
      {/* Inner Dot */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c5a880] w-1.5 h-1.5 transition-all duration-100 ease-out cursor-inner"
      />
    </div>
  );
}
