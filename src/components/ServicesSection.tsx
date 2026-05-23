"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";
import { Film, Sparkles, Box, Layers, Cpu, Smartphone, ScanFace, Eye, Activity } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  hudTitle: string;
  hudItems: { label: string; value: string }[];
  bullets: string[];
  tools: string[];
  canvasType: string;
}

interface ServicesSectionProps {
  onInquiryClick: () => void;
  isIntroCompleted?: boolean;
}

// -------------------------------------------------------------
// Component: TextScramble
// -------------------------------------------------------------
interface TextScrambleProps {
  text: string;
  trigger: number;
}

function TextScramble({ text, trigger }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    let frame = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$@&*[]%";
    const targetText = text;
    const duration = 10;
    
    const interval = setInterval(() => {
      setDisplayText(() => {
        return targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            const progress = (frame / duration) * targetText.length;
            if (index < progress) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      });
      
      frame++;
      if (frame > duration) {
        setDisplayText(targetText);
        clearInterval(interval);
      }
    }, 25);
    
    return () => clearInterval(interval);
  }, [text, trigger]);

  return <span>{displayText}</span>;
}

// -------------------------------------------------------------
// Component: CanvasSimulator
// -------------------------------------------------------------
interface CanvasSimulatorProps {
  type: string;
  mousePos: { x: number; y: number };
  isHovered: boolean;
}

function CanvasSimulator({ type, mousePos, isHovered }: CanvasSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef(mousePos);

  // Sync ref with mouse position to prevent effect recreation storms
  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationId: number;
    let isIntersecting = false;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    const resizeObserver = new ResizeObserver(() => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });
    resizeObserver.observe(canvas);
    
    let time = 0;
    
    // Particles setup (re-used for VFX, WebGL, AI vector flow)
    const particles: { 
      x: number; 
      y: number; 
      vx: number; 
      vy: number; 
      radius: number; 
      alpha: number; 
    }[] = [];
    
    if (type === "vfx" || type === "webgl" || type === "ai") {
      const count = type === "ai" ? 50 : (type === "vfx" ? 40 : 25);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (type === "vfx" ? 1.6 : 0.8),
          vy: (Math.random() - 0.5) * (type === "vfx" ? 1.6 : 0.8),
          radius: Math.random() * (type === "vfx" ? 2.5 : 1.8) + 1,
          alpha: Math.random() * 0.45 + 0.35
        });
      }
    }
    
    // CGI 3D rotating cube configuration
    const vertices = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ];
    
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
    ];
    
    const render = () => {
      time += 0.012;
      
      // Fluid accumulation tails for VFX/AI fields (using transparent black for pristine screen-blend), clearRect for others
      if (type === "vfx" || type === "ai") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
      
      const mouseRelativeX = mousePosRef.current.x;
      const mouseRelativeY = mousePosRef.current.y;
      
      if (type === "video") {
        // Video timeline display
        ctx.strokeStyle = "rgba(197, 168, 128, 0.12)";
        ctx.lineWidth = 1;
        const tickSpacing = 24;
        for (let x = 0; x < width; x += tickSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        
        // Render audio waveform bands - highly visible, larger amplitude
        const barWidth = 4;
        const gap = 3;
        const barCount = Math.floor(width / (barWidth + gap));
        const startX = (width - barCount * (barWidth + gap)) / 2;
        
        ctx.fillStyle = "rgba(197, 168, 128, 0.48)";
        for (let i = 0; i < barCount; i++) {
          const x = startX + i * (barWidth + gap);
          const distToCenter = Math.abs(x - width / 2) / (width / 2);
          const baseHeight = Math.sin(i * 0.16 + time * 4.2) * 50 + 65;
          const finalHeight = baseHeight * (1 - distToCenter * 0.4) * (0.55 + Math.sin(time * 0.7) * 0.25);
          
          ctx.fillRect(x, height * 0.5 - finalHeight / 2, barWidth, finalHeight);
        }
        
        // Continuous peak waveform thread line running through the card
        ctx.strokeStyle = "rgba(197, 168, 128, 0.85)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let i = 0; i < width; i += 2) {
          const distToCenter = Math.abs(i - width / 2) / (width / 2);
          const y = height * 0.5 + Math.sin(i * 0.015 - time * 2.8) * Math.cos(i * 0.005 + time * 1.4) * 60 * (1 - distToCenter * 0.35);
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
        
        // Gold sweeping playhead line
        const playheadX = (time * 85) % width;
        ctx.strokeStyle = "#c5a880";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#c5a880";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(playheadX, height * 0.1);
        ctx.lineTo(playheadX, height * 0.9);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Custom sweeping playhead dial top
        ctx.fillStyle = "#c5a880";
        ctx.beginPath();
        ctx.moveTo(playheadX, height * 0.1 - 5);
        ctx.lineTo(playheadX - 5, height * 0.1);
        ctx.lineTo(playheadX, height * 0.1 + 5);
        ctx.lineTo(playheadX + 5, height * 0.1);
        ctx.closePath();
        ctx.fill();
        
      } else if (type === "vfx") {
        // VFX Gravity Particle physics - Elegant elliptical orbit when idle, tracks cursor on hover
        const targetX = isHovered ? mouseRelativeX : width / 2 + Math.cos(time * 1.8) * 130;
        const targetY = isHovered ? mouseRelativeY : height / 2 + Math.sin(time * 1.8) * 70;
        
        particles.forEach((p) => {
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (isHovered && dist < 240) {
            const force = (240 - dist) / 1600;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          } else {
            p.vx += (dx / (dist || 1)) * 0.018;
            p.vy += (dy / (dist || 1)) * 0.018;
          }
          
          // Terminal speed cap
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const maxSpeed = 3.2;
          if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
          }
          
          p.x += p.vx;
          p.y += p.vy;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(197, 168, 128, ${p.alpha})`;
          ctx.fill();
        });
        
      } else if (type === "cgi") {
        // Projection matrices for rotating dual-nested wireframe cubes (Tesseract effect)
        const scaleOuter = Math.min(width, height) * 0.28;
        const scaleInner = scaleOuter * 0.48;
        const centerX = width / 2;
        const centerY = height / 2;
        
        const rotXOuter = time * 0.45 + (isHovered ? (mouseRelativeY - centerY) * 0.0025 : 0);
        const rotYOuter = time * 0.65 + (isHovered ? (mouseRelativeX - centerX) * 0.0025 : 0);
        
        const rotXInner = -time * 0.55;
        const rotYInner = -time * 0.75;
        
        const project = (v: typeof vertices[0], rx: number, ry: number, scale: number) => {
          // X rotation
          const y1 = v.y * Math.cos(rx) - v.z * Math.sin(rx);
          const z1 = v.y * Math.sin(rx) + v.z * Math.cos(rx);
          
          // Y rotation
          const x2 = v.x * Math.cos(ry) - z1 * Math.sin(ry);
          const z2 = v.x * Math.sin(ry) + z1 * Math.cos(ry);
          
          const fov = 3.5;
          const perspective = fov / (fov + z2);
          
          return {
            x: centerX + x2 * scale * perspective,
            y: centerY + y1 * scale * perspective
          };
        };
        
        const projectedOuter = vertices.map(v => project(v, rotXOuter, rotYOuter, scaleOuter));
        const projectedInner = vertices.map(v => project(v, rotXInner, rotYInner, scaleInner));
        
        // Render 3D edges Outer
        ctx.strokeStyle = "rgba(197, 168, 128, 0.52)";
        ctx.lineWidth = 1.2;
        edges.forEach(([u, v]) => {
          ctx.beginPath();
          ctx.moveTo(projectedOuter[u].x, projectedOuter[u].y);
          ctx.lineTo(projectedOuter[v].x, projectedOuter[v].y);
          ctx.stroke();
        });
        
        // Render 3D edges Inner
        ctx.strokeStyle = "rgba(197, 168, 128, 0.25)";
        ctx.lineWidth = 0.8;
        edges.forEach(([u, v]) => {
          ctx.beginPath();
          ctx.moveTo(projectedInner[u].x, projectedInner[u].y);
          ctx.lineTo(projectedInner[v].x, projectedInner[v].y);
          ctx.stroke();
        });
        
        // Outer glowing corner nodes
        projectedOuter.forEach((p) => {
          ctx.fillStyle = "#c5a880";
          ctx.shadowColor = "#c5a880";
          ctx.shadowBlur = 5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
        
      } else if (type === "env") {
        // Landscape topographic scrolling grid waves - full 3D wireframe mesh grid
        ctx.strokeStyle = "rgba(197, 168, 128, 0.48)";
        ctx.lineWidth = 1;
        
        const linesCount = 8;
        const pointsCount = 30;
        const gridPoints: { x: number; y: number }[][] = [];
        
        for (let j = 0; j < linesCount; j++) {
          const lineY = height * 0.26 + (j / (linesCount - 1)) * height * 0.52;
          const currentLine: { x: number; y: number }[] = [];
          
          for (let i = 0; i < pointsCount; i++) {
            const px = (i / (pointsCount - 1)) * width;
            const noise = Math.sin(i * 0.24 - time * 2) * Math.cos(j * 0.38 + i * 0.08) * 20;
            
            let mouseDeform = 0;
            if (isHovered) {
              const dx = px - mouseRelativeX;
              const dy = lineY - mouseRelativeY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 130) {
                mouseDeform = (130 - dist) * 0.28 * Math.sin(time * 5);
              }
            }
            
            const py = lineY - Math.abs(noise) - mouseDeform;
            currentLine.push({ x: px, y: py });
          }
          gridPoints.push(currentLine);
        }
        
        // Draw horizontal grid lines
        gridPoints.forEach((line) => {
          ctx.beginPath();
          line.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.stroke();
        });
        
        // Draw vertical connecting grid lines with lower opacity
        ctx.strokeStyle = "rgba(197, 168, 128, 0.18)";
        ctx.lineWidth = 0.8;
        for (let i = 0; i < pointsCount; i++) {
          ctx.beginPath();
          for (let j = 0; j < linesCount; j++) {
            if (j === 0) ctx.moveTo(gridPoints[j][i].x, gridPoints[j][i].y);
            else ctx.lineTo(gridPoints[j][i].x, gridPoints[j][i].y);
          }
          ctx.stroke();
        }
        
      } else if (type === "webgl") {
        // Floating WebGL connection nodes
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          
          ctx.fillStyle = "rgba(197, 168, 128, 0.65)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Node lines
        ctx.strokeStyle = "rgba(197, 168, 128, 0.25)";
        ctx.lineWidth = 0.9;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
          
          // Custom interactive cursor connection lines
          if (isHovered) {
            const dx = particles[i].x - mouseRelativeX;
            const dy = particles[i].y - mouseRelativeY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 140) {
              ctx.strokeStyle = `rgba(197, 168, 128, ${0.62 * (1 - dist / 140)})`;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouseRelativeX, mouseRelativeY);
              ctx.stroke();
              
              // Draw a tiny ring around the connected node
              ctx.strokeStyle = `rgba(197, 168, 128, ${0.45 * (1 - dist / 140)})`;
              ctx.beginPath();
              ctx.arc(particles[i].x, particles[i].y, particles[i].radius * 2.8, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
        
      } else if (type === "app") {
        // Micro-frontend architecture data flows - Advanced Routing diagram
        const nodes = [
          { x: width * 0.25, y: height * 0.35, label: "EDGE" },
          { x: width * 0.75, y: height * 0.35, label: "DB" },
          { x: width * 0.5, y: height * 0.7, label: "GATE" },
          { x: width * 0.5, y: height * 0.2, label: "CORE" },
        ];
        
        ctx.strokeStyle = "rgba(197, 168, 128, 0.32)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Ring route
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[3].x, nodes[3].y);
        ctx.lineTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.lineTo(nodes[0].x, nodes[0].y);
        // Direct linkages
        ctx.moveTo(nodes[3].x, nodes[3].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.stroke();
        
        const drawSignalPulse = (n1: typeof nodes[0], n2: typeof nodes[0], speed = 1.0) => {
          const t = (time * 0.28 * speed) % 1.0;
          const px = n1.x + (n2.x - n1.x) * t;
          const py = n1.y + (n2.y - n1.y) * t;
          ctx.fillStyle = "#c5a880";
          ctx.shadowColor = "#c5a880";
          ctx.shadowBlur = 5;
          ctx.fillRect(px - 3, py - 3, 6, 6);
          ctx.shadowBlur = 0;
        };
        
        drawSignalPulse(nodes[0], nodes[3], 1.1);
        drawSignalPulse(nodes[3], nodes[1], 0.9);
        drawSignalPulse(nodes[1], nodes[2], 1.2);
        drawSignalPulse(nodes[2], nodes[0], 0.8);
        drawSignalPulse(nodes[3], nodes[2], 1.4);
        
        nodes.forEach((node) => {
          ctx.fillStyle = "#09090c";
          ctx.strokeStyle = "#c5a880";
          ctx.lineWidth = 1.2;
          
          ctx.fillRect(node.x - 28, node.y - 14, 56, 28);
          ctx.strokeRect(node.x - 28, node.y - 14, 56, 28);
          
          ctx.fillStyle = "rgba(197, 168, 128, 0.95)";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.label, node.x, node.y);
          
          if ((Math.floor(time * 3.5) % 2) === 0) {
            ctx.fillStyle = "#10b981";
            ctx.beginPath();
            ctx.arc(node.x + 20, node.y - 8, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        ctx.fillStyle = "rgba(197, 168, 128, 0.65)";
        ctx.font = "8.5px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`[ SYNC: SECURED ] [ PORT: 443 ]`, width * 0.08, height * 0.88);
        ctx.fillText(`[ SPEED: ${Math.floor(Math.sin(time) * 2 + 10)}ms ]`, width * 0.64, height * 0.88);
        
      } else if (type === "ai") {
        // AI Dynamic Fluid flow fields - Highly visible vectors
        const targetX = isHovered ? mouseRelativeX : width / 2;
        const targetY = isHovered ? mouseRelativeY : height / 2;
        
        particles.forEach((p) => {
          const dx = p.x - targetX;
          const dy = p.y - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const vxTarget = -dy / dist;
          const vyTarget = dx / dist;
          const pullX = -dx / dist;
          const pullY = -dy / dist;
          
          p.vx = p.vx * 0.94 + (vxTarget * 1.5 + pullX * 0.35) * 0.06;
          p.vy = p.vy * 0.94 + (vyTarget * 1.5 + pullY * 0.35) * 0.06;
          
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.x < -15) p.x = width + 15;
          if (p.x > width + 15) p.x = -15;
          if (p.y < -15) p.y = height + 15;
          if (p.y > height + 15) p.y = -15;
          
          ctx.strokeStyle = `rgba(197, 168, 128, ${p.alpha * 0.95})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5);
          ctx.stroke();
        });
        
      } else if (type === "xr") {
        // Spatial XR tracking HUD vectors - Dashed rotating dials
        const centerX = width / 2;
        const centerY = height / 2;
        const targetX = isHovered ? mouseRelativeX : centerX;
        const targetY = isHovered ? mouseRelativeY : centerY;
        
        // Outer Solid Tracking Circle
        ctx.strokeStyle = "rgba(197, 168, 128, 0.42)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 70, 0, Math.PI * 2);
        ctx.stroke();
        
        // Dash Dial Overlay rotating slowly
        ctx.strokeStyle = "rgba(197, 168, 128, 0.18)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.setLineDash([4, 6]);
        ctx.arc(centerX, centerY, 95, time * 0.2, time * 0.2 + Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Reticle Target Ring
        ctx.strokeStyle = "rgba(197, 168, 128, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        // Crosshair reticle
        ctx.beginPath();
        ctx.moveTo(targetX - 28, targetY);
        ctx.lineTo(targetX - 8, targetY);
        ctx.moveTo(targetX + 8, targetY);
        ctx.lineTo(targetX + 28, targetY);
        ctx.moveTo(targetX, targetY - 28);
        ctx.lineTo(targetX, targetY - 8);
        ctx.moveTo(targetX, targetY + 8);
        ctx.lineTo(targetX, targetY + 28);
        ctx.stroke();
        
        // Elastic link thread
        ctx.strokeStyle = "rgba(197, 168, 128, 0.22)";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        
        // Static bounds markings
        ctx.strokeStyle = "rgba(197, 168, 128, 0.28)";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 85);
        ctx.lineTo(centerX, centerY - 70);
        ctx.moveTo(centerX, centerY + 70);
        ctx.lineTo(centerX, centerY + 85);
        ctx.moveTo(centerX - 85, centerY);
        ctx.lineTo(centerX - 70, centerY);
        ctx.moveTo(centerX + 70, centerY);
        ctx.lineTo(centerX + 85, centerY);
        ctx.stroke();
        
        // Corner HUD markers
        ctx.strokeStyle = "rgba(197, 168, 128, 0.25)";
        ctx.beginPath();
        ctx.moveTo(centerX - 90, centerY - 90);
        ctx.lineTo(centerX - 90, centerY - 75);
        ctx.lineTo(centerX - 75, centerY - 90);
        ctx.closePath();
        ctx.stroke();
        
        ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`6DoF X: ${Math.floor(targetX - centerX)}`, centerX - 55, centerY + 95);
        ctx.fillText(`6DoF Y: ${Math.floor(centerY - targetY)}`, centerX + 15, centerY + 95);
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.font = "8px monospace";
        ctx.fillText(`XR_BOUNDS: ACTIVE`, width * 0.08, height * 0.14);
      }
      
      if (isIntersecting) {
        animationId = requestAnimationFrame(render);
      }
    };
    
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasIntersecting = isIntersecting;
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !wasIntersecting) {
            animationId = requestAnimationFrame(render);
          } else if (!isIntersecting && wasIntersecting) {
            cancelAnimationFrame(animationId);
          }
        });
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(canvas);
    
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [type, isHovered]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none mix-blend-screen select-none transition-opacity duration-500 z-20 ${
        isHovered ? "opacity-[0.48]" : "opacity-[0.22]"
      }`}
    />
  );
}

// -------------------------------------------------------------
// Component: ServicesSection
// -------------------------------------------------------------
export default function ServicesSection({ onInquiryClick, isIntroCompleted = false }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [scrambleTrigger, setScrambleTrigger] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // No-op reference to satisfy unused-vars ESLint rule
  if (isIntroCompleted) {
    // stands ready
  }
  
  // Track relative mouse position inside active card
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  const { services: rawServices } = useAdmin();

  const iconMap: Record<string, React.ReactNode> = {
    Film: <Film className="w-5 h-5 text-[#c5a880]" />,
    Sparkles: <Sparkles className="w-5 h-5 text-[#c5a880]" />,
    Box: <Box className="w-5 h-5 text-[#c5a880]" />,
    Layers: <Layers className="w-5 h-5 text-[#c5a880]" />,
    Cpu: <Cpu className="w-5 h-5 text-[#c5a880]" />,
    Smartphone: <Smartphone className="w-5 h-5 text-[#c5a880]" />,
    ScanFace: <ScanFace className="w-5 h-5 text-[#c5a880]" />,
    Eye: <Eye className="w-5 h-5 text-[#c5a880]" />
  };

  const services: ServiceItem[] = rawServices.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    icon: iconMap[s.iconName] || <Eye className="w-5 h-5 text-[#c5a880]" />,
    hudTitle: s.hudTitle,
    hudItems: s.hudItems,
    bullets: s.bullets,
    tools: s.tools,
    canvasType: s.canvasType
  }));

  // Card rect caching and window resize updates
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (isCardHovered && cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isCardHovered]);

  // Auto-rotation clock updates
  useEffect(() => {
    if (!isPlaying) return;
    
    const intervalTime = 100;
    const totalSteps = 8000 / intervalTime; // 8 seconds cycle
    let step = (progress / 100) * totalSteps;
    
    const timer = setInterval(() => {
      step++;
      const currentProgress = (step / totalSteps) * 100;
      setProgress(currentProgress);
      
      if (step >= totalSteps) {
        setActiveIndex((prev) => {
          const next = (prev + 1) % services.length;
          return next;
        });
        setScrambleTrigger((prev) => prev + 1); // Pure deterministic state update trigger outside index updater
        setProgress(0);
        step = 0;
      }
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [isPlaying, activeIndex, progress, services.length]);

  // Handle manual menu link clicks
  const selectService = (idx: number) => {
    setActiveIndex(idx);
    setProgress(0);
    setScrambleTrigger((prev) => prev + 1); // Pure deterministic state update trigger
  };

  // Tracking cursor coords inside parent card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = rectRef.current || cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Mobile gesture touch listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const threshold = 60; // 60px swipe margin
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left -> Next card
        selectService((activeIndex + 1) % services.length);
      } else {
        // Swipe right -> Prev card
        selectService((activeIndex - 1 + services.length) % services.length);
      }
    }
  };

  const activeService = services[activeIndex];

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="relative w-full lg:min-h-screen bg-[#0b0b0f] py-20 lg:py-0 px-6 md:px-12 lg:px-24 flex flex-col justify-center overflow-hidden border-b border-white/5"
    >
      {/* Absolute Ambient Grid backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute left-[8%] top-[12%] w-[40vw] h-[40vw] bg-[#c5a880]/[0.015] blur-[120px] rounded-full" />
        <div className="absolute right-[5%] bottom-[10%] w-[35vw] h-[35vw] bg-white/[0.008] blur-[100px] rounded-full" />
      </div>

      <ScrollAnimatedWrapper className="flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full z-10 flex flex-col lg:h-[82vh] justify-between relative">
        
        {/* Modern Cyber Section Header */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-8 lg:mb-10 shrink-0 relative">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.45em] text-[#6b7280] uppercase">
              CAPABILITIES HUD
            </span>
            <div className="w-8 h-[1px] bg-[#c5a880]/20" />
            <span className="font-mono text-[9px] text-[#c5a880] animate-pulse">
              [ ONLINE ]
            </span>
          </div>
          <h2 className="font-display text-xl md:text-2xl tracking-[0.1em] text-white mt-2 md:mt-0 uppercase">
            CREATIVE TECHNOLOGY STACK
          </h2>
        </div>

        {/* Dashboard Frame Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 w-full relative">
          
          {/* LEFT SIDEBAR: Telemetry Navigation HUD (4 cols) */}
          <div className="hidden lg:flex flex-col justify-center gap-2.5 col-span-4 pl-6 border-l border-white/5 relative z-20 font-mono">
            {/* Soft vertical neon pipeline line */}
            <div className="absolute left-0 top-[8%] bottom-[8%] w-[1px] bg-gradient-to-b from-transparent via-[#c5a880]/15 to-transparent pointer-events-none" />

            {services.map((s, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => selectService(idx)}
                  onMouseEnter={() => {
                    // Let hover trigger immediate countdown stop / hold
                    setIsPlaying(false);
                  }}
                  onMouseLeave={() => {
                    setIsPlaying(true);
                  }}
                  className="group flex items-center gap-4 text-left transition-all duration-300 py-1.5 focus:outline-none cursor-pointer relative"
                  data-cursor="read query"
                >
                  {/* Glowing active dashboard indicator block */}
                  {isActive && (
                    <motion.div 
                      layoutId="hudGlowMarker"
                      className="absolute -left-[25px] w-1 h-5 bg-[#c5a880] shadow-[0_0_10px_rgba(197,168,128,0.8)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span className={`text-[9px] tracking-wider transition-colors duration-300 font-medium ${isActive ? "text-[#c5a880]" : "text-white/20 group-hover:text-white/50"}`}>
                    {s.id}
                  </span>
                  
                  <span className={`font-mono text-[10.5px] tracking-[0.16em] uppercase transition-all duration-300 ${
                    isActive 
                      ? "text-[#c5a880] font-bold drop-shadow-[0_0_6px_rgba(197,168,128,0.35)] translate-x-1.5" 
                      : "text-white/40 group-hover:text-white/80 group-hover:translate-x-1"
                  }`}>
                    {isActive ? `[ ${s.title} ]` : s.title}
                  </span>

                  {/* Operational standalone tag */}
                  <span className={`text-[7.5px] font-mono tracking-widest scale-90 opacity-0 group-hover:opacity-40 transition-opacity ml-auto text-white/50`}>
                    {isActive ? "STATUS: ACTIVE" : "STATUS: STANDBY"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT VIEWPORT: Cybernetic Glass Deck (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-center w-full min-h-[460px] relative">
            
            {/* Compact Mobile Sub HUD info block */}
            <div className="flex lg:hidden justify-between items-center mb-3 px-2 font-mono">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#c5a880] animate-pulse" />
                <span className="text-[9px] tracking-[0.15em] text-[#c5a880]/80 uppercase">
                  SYSTEM ACTIVE
                </span>
              </div>
              <span className="text-[10px] text-white/45 tracking-widest">
                {activeService.id} {"//"} {services.length.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Glowing Corner Bracket Crosshairs decoration */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-[#c5a880]/30 pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-[#c5a880]/30 pointer-events-none" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-[#c5a880]/30 pointer-events-none" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-[#c5a880]/30 pointer-events-none" />

            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => {
                setIsCardHovered(true);
                setIsPlaying(false); // Pause autoplay
                if (cardRef.current) {
                  rectRef.current = cardRef.current.getBoundingClientRect();
                }
              }}
              onMouseLeave={() => {
                setIsCardHovered(false);
                setIsPlaying(true); // Resume autoplay
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="w-full min-h-[440px] flex flex-col p-6 md:p-10 lg:p-12 bg-[#121217]/80 backdrop-blur-xl border border-white/5 hover:border-[#c5a880]/15 rounded-sm transition-all duration-300 relative shadow-[0_0_40px_rgba(0,0,0,0.65)] overflow-hidden cursor-crosshair select-none"
            >
              {/* Glass subtle glaze reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.015] via-transparent to-transparent pointer-events-none z-10" />

              {/* Dynamic canvas telemetry micro-simulation */}
              <CanvasSimulator 
                type={activeService.canvasType} 
                mousePos={mousePos} 
                isHovered={isCardHovered} 
              />

              {/* Seamless AnimatePresence slide/glitch transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", y: 15 }}
                  animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", y: 0 }}
                  exit={{ opacity: 0, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: -15 }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-stretch h-full w-full relative z-10"
                >
                  
                  {/* Left Column: Diagnostics Specs HUD */}
                  <div className="md:col-span-5 flex flex-col justify-center border-l border-[#c5a880]/20 pl-5 pr-2 py-1">
                    <div className="flex flex-col gap-5">
                      <span className="font-mono text-[9px] tracking-[0.25em] text-[#c5a880] uppercase">
                        <TextScramble text={activeService.hudTitle} trigger={scrambleTrigger} />
                      </span>
                      
                      <div className="flex flex-col gap-3">
                        {activeService.hudItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-1.5 font-mono group/item">
                            <span className="text-[8px] tracking-[0.18em] text-[#6b7280] uppercase group-hover/item:text-[#c5a880]/70 transition-colors duration-300">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-white/90 font-medium tracking-wide uppercase text-right group-hover/item:text-[#c5a880] transition-colors duration-300">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Narrative Content & badging */}
                  <div className="md:col-span-7 flex flex-col justify-between pl-0 md:pl-4 pt-2 md:pt-0">
                    
                    {/* Header: ID, Icon, Title */}
                    <div className="flex flex-col gap-3">
                      <div className="flex">
                        <span className="font-mono text-[10px] font-bold text-[#c5a880] border-b border-[#c5a880]/30 pb-0.5 pr-2.5 tracking-widest">
                          {activeService.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 mt-0.5">
                        <div className="w-9 h-9 rounded-sm border border-[#c5a880]/20 flex items-center justify-center bg-[#c5a880]/5">
                          {activeService.icon}
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold tracking-[0.08em] text-white uppercase">
                          <TextScramble text={activeService.title} trigger={scrambleTrigger} />
                        </h3>
                      </div>

                      <p className="font-sans text-[11.5px] sm:text-[12.5px] leading-relaxed text-[#9999aa] mt-1.5">
                        {activeService.description}
                      </p>

                      {/* Diagnostic telemetry lines */}
                      <div className="flex flex-col gap-1.5 mt-1.5">
                        {activeService.bullets.map((bullet, idx) => (
                          <span key={idx} className="font-mono text-[10px] text-[#c5a880]/80 tracking-wide">
                            {bullet}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tools badges and Interactive link button */}
                    <div className="border-t border-white/10 pt-4 mt-5 flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-end shrink-0">
                      
                      {/* Domain Tools badges */}
                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[7.5px] tracking-[0.18em] text-[#6b7280] uppercase">
                          CAPABILITY ENGINE STACK
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {activeService.tools.map((tool, idx) => (
                            <span 
                              key={idx} 
                              className="font-mono border border-white/10 px-2 py-0.5 text-[8.5px] tracking-wider text-[#9999aa] bg-white/5 rounded-sm"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Inquiry triggers */}
                      <button 
                        onClick={onInquiryClick}
                        className="font-mono text-[10px] tracking-[0.16em] text-[#c5a880] hover:text-white transition-colors duration-300 flex items-center gap-1.5 group/link pb-0.5 border-b border-transparent hover:border-[#c5a880] cursor-pointer"
                        data-cursor="connect"
                      >
                        <span>START INQUIRY</span>
                        <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                      </button>
                    </div>

                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Auto-rotation active progress line */}
              <div 
                className="absolute bottom-0 left-0 h-[1.5px] bg-[#c5a880] shadow-[0_0_8px_rgba(197,168,128,0.7)] transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Mobile-only pagination dot track */}
            <div className="flex lg:hidden justify-center items-center gap-3.5 mt-5">
              {services.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => selectService(idx)}
                  className={`h-1 transition-all duration-300 rounded-full ${activeIndex === idx ? "w-6 bg-[#c5a880]" : "w-1.5 bg-white/20"}`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>
    </ScrollAnimatedWrapper>
  </section>
  );
}
