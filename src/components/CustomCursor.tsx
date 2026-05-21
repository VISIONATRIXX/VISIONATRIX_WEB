"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Enable custom cursor styles across the page
    document.body.classList.add("custom-cursor-active");

    const cursor = cursorRef.current;
    const outer = cursorOuterRef.current;
    const inner = cursorInnerRef.current;
    if (!cursor || !outer || !inner) return;

    let mouseCoords = { x: -100, y: -100 };
    let outerCoords = { x: -100, y: -100 };
    let innerCoords = { x: -100, y: -100 };
    let isVisible = false;

    const moveCursor = (e: MouseEvent) => {
      mouseCoords.x = e.clientX;
      mouseCoords.y = e.clientY;
      
      if (!isVisible) {
        cursor.style.opacity = "1";
        isVisible = true;
      }
    };

    // Smooth Spring Dynamics Frame Loop
    let animationFrameId: number;
    const updatePhysics = () => {
      // Lerp for outer circle (springy lag)
      outerCoords.x += (mouseCoords.x - outerCoords.x) * 0.15;
      outerCoords.y += (mouseCoords.y - outerCoords.y) * 0.15;

      // Lerp for inner dot (tighter tracking)
      innerCoords.x += (mouseCoords.x - innerCoords.x) * 0.45;
      innerCoords.y += (mouseCoords.y - innerCoords.y) * 0.45;

      if (cursorOuterRef.current) {
        cursorOuterRef.current.style.transform = `translate3d(${outerCoords.x}px, ${outerCoords.y}px, 0) translate(-50%, -50%)`;
      }
      if (cursorInnerRef.current) {
        cursorInnerRef.current.style.transform = `translate3d(${innerCoords.x}px, ${innerCoords.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Look for elements requesting a specific custom cursor label (e.g. data-cursor="view")
      const hoveredCursorElement = target.closest("[data-cursor]") as HTMLElement;
      if (hoveredCursorElement) {
        const cursorLabel = hoveredCursorElement.getAttribute("data-cursor");
        if (cursorLabel) {
          setTooltipText(cursorLabel.toUpperCase());
          cursor.classList.add("cursor-hovered");
          return;
        }
      }

      // Check standard interactive nodes
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
        setTooltipText("");
      } else {
        cursor.classList.remove("cursor-hovered");
        setTooltipText("");
      }
    };

    const handleMouseDown = () => {
      cursor.classList.add("cursor-clicked");
    };
    
    const handleMouseUp = () => {
      cursor.classList.remove("cursor-clicked");
    };
    
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
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 transition-opacity duration-300 w-full h-full"
    >
      {/* Outer Ring */}
      <div
        ref={cursorOuterRef}
        className="absolute rounded-full border border-[#c5a880]/60 w-7 h-7 transition-[width,height,border-color,background,box-shadow,opacity] duration-150 ease-out cursor-outer flex items-center justify-center"
        style={{
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          willChange: "transform",
        }}
      >
        {/* Monospace telemetry custom cursor tooltip label */}
        {tooltipText && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 font-mono text-[8px] font-extrabold tracking-[0.25em] text-[#c5a880] border border-[#c5a880]/20 bg-[#050507]/90 px-2 py-0.5 rounded-[2px] whitespace-nowrap shadow-lg select-none pointer-events-none uppercase">
            [ {tooltipText} ]
          </div>
        )}
      </div>
      
      {/* Inner Dot */}
      <div
        ref={cursorInnerRef}
        className="absolute rounded-full bg-[#c5a880] w-1.5 h-1.5 transition-[width,height,background-color,box-shadow,opacity] duration-100 ease-out cursor-inner"
        style={{
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
