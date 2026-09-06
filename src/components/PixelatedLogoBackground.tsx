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

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

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

      // 1. Sample logo shape pixels with architectural density variation & gaps
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Skip ~36% of logo grid cells to create organic circuit gaps instead of a solid fill
          if (Math.random() < 0.36) continue;

          const imgX = c * step;
          const imgY = r * step;

          // Sample pixel color/alpha
          const pixelIndex = (imgY * offCanvas.width + imgX) * 4;
          const red = data[pixelIndex];
          const green = data[pixelIndex + 1];
          const blue = data[pixelIndex + 2];
          const alpha = data[pixelIndex + 3];

          const brightness = (red + green + blue) / 3;

          // Detect silhouette mask
          if (alpha > 25 || brightness > 25) {
            const worldX = logoOffsetX + imgX;
            const worldY = logoOffsetY + imgY;

            // Soft radial boundary fade
            const dx = imgX - centerX;
            const dy = imgY - centerY;
            const distFromCenter = Math.sqrt(dx * dx + dy * dy);
            const edgeFactor = Math.pow(Math.max(0, 1 - distFromCenter / (maxRadius * 0.95)), 1.5);

            if (edgeFactor <= 0.02) continue;

            // Density clustering: 80% very dim (10-15% brightness display effect), 15% dim ghost, 5% soft cluster
            const clusterVal = Math.random();
            let baseOp = 0.02;
            let colorPrefix = "rgba(110, 115, 135, "; // Cool slate dark gray

            if (clusterVal > 0.95) {
              // 5% slightly brighter accent cluster (capped at 0.22 alpha max)
              baseOp = (0.12 + Math.random() * 0.08) * edgeFactor;
              colorPrefix = Math.random() > 0.5 ? "rgba(197, 168, 128, " : "rgba(180, 185, 205, ";
            } else if (clusterVal > 0.78) {
              // 17% low ghost pixels
              baseOp = (0.05 + Math.random() * 0.05) * edgeFactor;
              colorPrefix = "rgba(130, 135, 155, ";
            } else {
              // 78% extremely subtle dark background matrix pixels (3-8% brightness)
              baseOp = (0.015 + Math.random() * 0.03) * edgeFactor;
              colorPrefix = "rgba(70, 75, 95, ";
            }

            pixels.push({
              origX: worldX,
              origY: worldY,
              x: worldX,
              y: worldY,
              size: step - 1,
              baseOpacity: baseOp,
              currentOpacity: baseOp * (0.4 + Math.random() * 0.6),
              targetOpacity: baseOp,
              speed: 0.001 + Math.random() * 0.004, // Very slow, sophisticated pulse
              colorPrefix,
              isLogo: true
            });
          }
        }
      }

      // 2. Ultra-sparse ambient matrix field in background space
      const ambientCols = Math.floor(width / (step * 4));
      const ambientRows = Math.floor(height / (step * 4));
      const totalAmbient = Math.floor((ambientCols * ambientRows) * 0.08);

      for (let i = 0; i < totalAmbient; i++) {
        const ax = Math.floor(Math.random() * ambientCols) * (step * 4);
        const ay = Math.floor(Math.random() * ambientRows) * (step * 4);

        const baseOp = 0.01 + Math.random() * 0.03;
        const colorPrefix = Math.random() > 0.2 ? "rgba(60, 65, 80, " : "rgba(197, 168, 128, ";

        pixels.push({
          origX: ax,
          origY: ay,
          x: ax,
          y: ay,
          size: step - 1,
          baseOpacity: baseOp,
          currentOpacity: baseOp * Math.random(),
          targetOpacity: baseOp,
          speed: 0.001 + Math.random() * 0.003,
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

    window.addEventListener("resize", handleResize);

    // Slow cinematic rendering loop
    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Very fine grid structure
      ctx.strokeStyle = "rgba(255, 255, 255, 0.008)";
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

      const mouseRadius = 110;
      const mouseRadiusSq = mouseRadius * mouseRadius;

      pixels.forEach((p) => {
        // Slow organic flicker / opacity drift
        if (Math.abs(p.currentOpacity - p.targetOpacity) < 0.002) {
          if (Math.random() < 0.02) {
            p.targetOpacity = p.baseOpacity * (0.4 + Math.random() * 1.2);
          }
        } else if (p.currentOpacity < p.targetOpacity) {
          p.currentOpacity += p.speed;
        } else {
          p.currentOpacity -= p.speed;
        }

        // Extremely subtle cursor proximity influence (restrained highlight)
        let targetX = p.origX;
        let targetY = p.origY;
        let hoverBoost = 0;

        if (mouseX > 0 && mouseY > 0) {
          const dx = p.origX - mouseX;
          const dy = p.origY - mouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq) {
            const factor = 1 - distSq / mouseRadiusSq;
            hoverBoost = factor * 0.12; // Very gentle brightening near cursor
            
            const angle = Math.atan2(dy, dx);
            const pushDist = factor * 4;
            targetX = p.origX + Math.cos(angle) * pushDist;
            targetY = p.origY + Math.sin(angle) * pushDist;
          }
        }

        // Smooth position spring
        p.x += (targetX - p.x) * 0.1;
        p.y += (targetY - p.y) * 0.1;

        // Cap maximum brightness at ~0.24 opacity so logo stays hidden in darkness
        const finalAlpha = Math.max(0, Math.min(0.24, p.currentOpacity + hoverBoost));

        ctx.fillStyle = `${p.colorPrefix}${finalAlpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [logoSrc, pixelSize]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
