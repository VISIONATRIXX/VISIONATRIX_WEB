"use client";

import { useEffect, useRef } from "react";

interface PixelatedLogoBackgroundProps {
  logoSrc?: string;
  pixelSize?: number;
  className?: string;
}

export default function PixelatedLogoBackground({
  logoSrc = "/LOGO.png",
  pixelSize = 5,
  className = ""
}: PixelatedLogoBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const img: HTMLImageElement = new Image();
    let imgLoaded = false;

    // Mouse tracking state
    let mouseX = -1000;
    let mouseY = -1000;
    let cachedRect = canvas.getBoundingClientRect();

    const updateRect = () => {
      if (canvas) cachedRect = canvas.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      mouseX = e.clientX - cachedRect.left;
      mouseY = e.clientY - cachedRect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("scroll", updateRect, { passive: true });

    interface Pixel {
      origX: number;
      origY: number;
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      currentOpacity: number;
      targetOpacity: number;
      speed: number;
      colorPrefix: string;
      isLogo: boolean;
    }

    let pixels: Pixel[] = [];
    let width = 0;
    let height = 0;

    const initPixels = () => {
      if (!canvas || !container || !imgLoaded) return;

      width = canvas.width = container.clientWidth || window.innerWidth;
      height = canvas.height = container.clientHeight || 500;

      // Create an offscreen canvas to sample the exact silhouette of LOGO.png
      const offCanvas = document.createElement("canvas");
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) return;

      // Calculate logo scale (Desktop: 750-950px, Mobile: ~88% width)
      let logoWidth = Math.min(width * 0.72, 920);
      if (width < 640) {
        logoWidth = Math.min(width * 0.88, 380);
      }
      const aspect = img.height / img.width;
      let logoHeight = logoWidth * aspect;

      // Restrain height if footer height is compact
      if (logoHeight > height * 0.88) {
        logoHeight = height * 0.88;
        logoWidth = logoHeight / aspect;
      }

      offCanvas.width = Math.floor(logoWidth);
      offCanvas.height = Math.floor(logoHeight);

      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      offCtx.drawImage(img, 0, 0, offCanvas.width, offCanvas.height);

      const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const data = imgData.data;

      // Position centered in footer container
      const logoOffsetX = Math.floor((width - logoWidth) / 2);
      const logoOffsetY = Math.floor((height - logoHeight) / 2);

      pixels = [];

      const step = pixelSize;
      const cols = Math.floor(offCanvas.width / step);
      const rows = Math.floor(offCanvas.height / step);

      const centerX = offCanvas.width / 2;
      const centerY = offCanvas.height / 2;
      const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

      // 1. Sample logo shape pixels
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const imgX = c * step;
          const imgY = r * step;

          // Sample pixel color/alpha
          const pixelIndex = (imgY * offCanvas.width + imgX) * 4;
          const red = data[pixelIndex];
          const green = data[pixelIndex + 1];
          const blue = data[pixelIndex + 2];
          const alpha = data[pixelIndex + 3];

          const brightness = (red + green + blue) / 3;

          // Detect silhouette mask (non-transparent or bright parts of logo)
          if (alpha > 25 || brightness > 25) {
            const worldX = logoOffsetX + imgX;
            const worldY = logoOffsetY + imgY;

            // Distance from logo centroid for radial edge fade
            const dx = imgX - centerX;
            const dy = imgY - centerY;
            const distFromCenter = Math.sqrt(dx * dx + dy * dy);
            const edgeFactor = Math.max(0.15, 1 - Math.pow(distFromCenter / maxRadius, 1.8));

            // Subtle color & brightness variations
            const randVal = Math.random();
            let colorPrefix = "rgba(150, 155, 175, "; // Cool slate dark gray
            if (randVal > 0.85) {
              colorPrefix = "rgba(197, 168, 128, "; // Muted gold accent
            } else if (randVal > 0.60) {
              colorPrefix = "rgba(190, 195, 215, "; // Soft silver highlight
            } else if (randVal < 0.25) {
              colorPrefix = "rgba(75, 80, 100, "; // Deep dim gray
            }

            const baseOp = (0.06 + Math.random() * 0.22) * edgeFactor;

            pixels.push({
              origX: worldX,
              origY: worldY,
              x: worldX,
              y: worldY,
              size: step - 1,
              baseOpacity: baseOp,
              currentOpacity: baseOp * Math.random(),
              targetOpacity: baseOp,
              speed: 0.003 + Math.random() * 0.008,
              colorPrefix,
              isLogo: true
            });
          }
        }
      }

      // 2. Ambient matrix pixel field across background
      const ambientCols = Math.floor(width / (step * 3));
      const ambientRows = Math.floor(height / (step * 3));
      const totalAmbient = Math.floor((ambientCols * ambientRows) * 0.14);

      for (let i = 0; i < totalAmbient; i++) {
        const ax = Math.floor(Math.random() * ambientCols) * (step * 3);
        const ay = Math.floor(Math.random() * ambientRows) * (step * 3);

        const baseOp = 0.015 + Math.random() * 0.06;
        const colorPrefix = Math.random() > 0.3 ? "rgba(90, 95, 115, " : "rgba(197, 168, 128, ";

        pixels.push({
          origX: ax,
          origY: ay,
          x: ax,
          y: ay,
          size: step - 1,
          baseOpacity: baseOp,
          currentOpacity: baseOp * Math.random(),
          targetOpacity: baseOp,
          speed: 0.002 + Math.random() * 0.005,
          colorPrefix,
          isLogo: false
        });
      }
    };

    img.crossOrigin = "anonymous";
    img.src = logoSrc;
    img.onload = () => {
      imgLoaded = true;
      initPixels();
    };

    const handleResize = () => {
      initPixels();
    };

    let isVisible = false;

    // Animation & rendering loop
    const render = () => {
      if (!ctx || !isVisible) return;
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid structure
      ctx.strokeStyle = "rgba(255, 255, 255, 0.012)";
      ctx.lineWidth = 0.5;
      const gridSpacing = pixelSize * 4;
      for (let gx = 0; gx < width; gx += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      const mouseRadius = 120;
      const mouseRadiusSq = mouseRadius * mouseRadius;

      pixels.forEach((p) => {
        // Organic flicker / opacity drift
        if (Math.abs(p.currentOpacity - p.targetOpacity) < 0.004) {
          if (Math.random() < 0.04) {
            p.targetOpacity = p.baseOpacity * (0.3 + Math.random() * 1.5);
          }
        } else if (p.currentOpacity < p.targetOpacity) {
          p.currentOpacity += p.speed;
        } else {
          p.currentOpacity -= p.speed;
        }

        // Cursor proximity influence
        let targetX = p.origX;
        let targetY = p.origY;
        let hoverBoost = 0;

        if (mouseX > 0 && mouseY > 0) {
          const dx = p.origX - mouseX;
          const dy = p.origY - mouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq) {
            const factor = 1 - distSq / mouseRadiusSq;
            hoverBoost = factor * 0.32; // Subtle highlight near cursor
            
            // Soft magnetic push
            const angle = Math.atan2(dy, dx);
            const pushDist = factor * 7;
            targetX = p.origX + Math.cos(angle) * pushDist;
            targetY = p.origY + Math.sin(angle) * pushDist;
          }
        }

        // Smooth position spring
        p.x += (targetX - p.x) * 0.12;
        p.y += (targetY - p.y) * 0.12;

        const finalAlpha = Math.max(0, Math.min(0.55, p.currentOpacity + hoverBoost));

        ctx.fillStyle = `${p.colorPrefix}${finalAlpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // IntersectionObserver to start/stop loop when footer is in/out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            cancelAnimationFrame(animationFrameId);
            render();
          }
        } else {
          isVisible = false;
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", updateRect);
      cancelAnimationFrame(animationFrameId);
    };
  }, [logoSrc, pixelSize]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
