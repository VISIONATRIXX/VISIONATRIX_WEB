"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";
import { Film, Sparkles, Box, Layers, Cpu, Smartphone, ScanFace, Eye, Code, Bot, Camera, PenTool, Home, MousePointerClick, Activity } from "lucide-react";
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
    
    // AI & Neural Network particle nodes
    const aiNodes: { x: number; y: number; vx: number; vy: number; radius: number; layer: number }[] = [];
    const aiNodeCount = 28;
    for (let i = 0; i < aiNodeCount; i++) {
      aiNodes.push({
        x: Math.random() * (width || 400),
        y: Math.random() * (height || 300),
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2 + 1.5,
        layer: Math.floor(Math.random() * 3)
      });
    }

    // Code matrix streams for Web Dev
    const codeChars = "</>{}[]=const;import;async;await;01;return;";
    const codeStreams: { x: number; y: number; speed: number; char: string }[] = [];
    for (let i = 0; i < 20; i++) {
      codeStreams.push({
        x: Math.random() * (width || 400),
        y: Math.random() * (height || 300),
        speed: Math.random() * 1.5 + 0.8,
        char: codeChars[Math.floor(Math.random() * codeChars.length)]
      });
    }

    // XR Volumetric Splats
    const splats: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 35; i++) {
      splats.push({
        x: Math.random() * (width || 400),
        y: Math.random() * (height || 300),
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 3.5 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
    
    const render = () => {
      time += 0.014;
      
      // Trail effect for AI field, clear for others
      if (type === "ai") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
      
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;
      
      // -----------------------------------------------------------------
      // FIELD 1: WEB DEVELOPMENT (canvasType: "webdev")
      // Cyber Code Terminal, Responsive Wireframe Layout & Matrix Streams
      // -----------------------------------------------------------------
      if (type === "webdev" || type === "app" || type === "webgl") {
        ctx.fillStyle = "rgba(197, 168, 128, 0.22)";
        ctx.font = "9px monospace";
        codeStreams.forEach((st) => {
          st.y += st.speed;
          if (st.y > height) st.y = -10;
          ctx.fillText(st.char, st.x, st.y);
        });

        // Responsive Viewport Frame Box
        const frameW = width * 0.58;
        const frameH = height * 0.62;
        const frameX = (width - frameW) / 2;
        const frameY = (height - frameH) / 2;

        ctx.strokeStyle = "rgba(197, 168, 128, 0.45)";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(frameX, frameY, frameW, frameH);

        // Header Bar & Close dots
        ctx.fillStyle = "rgba(197, 168, 128, 0.15)";
        ctx.fillRect(frameX, frameY, frameW, 18);
        ctx.fillStyle = "rgba(197, 168, 128, 0.7)";
        ctx.beginPath();
        ctx.arc(frameX + 10, frameY + 9, 2.5, 0, Math.PI * 2);
        ctx.arc(frameX + 18, frameY + 9, 2.5, 0, Math.PI * 2);
        ctx.arc(frameX + 26, frameY + 9, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Responsive Column Grid inside frame
        const colW = (frameW - 20) / 3;
        for (let i = 0; i < 3; i++) {
          const cx = frameX + 8 + i * (colW + 2);
          const cy = frameY + 24;
          const ch = frameH - 32;
          ctx.strokeStyle = "rgba(197, 168, 128, 0.25)";
          ctx.strokeRect(cx, cy, colW, ch);

          // Simulated layout blocks
          const animH = (Math.sin(time * 2 + i) * 0.2 + 0.5) * (ch - 15);
          ctx.fillStyle = "rgba(197, 168, 128, 0.12)";
          ctx.fillRect(cx + 3, cy + 3, colW - 6, animH);
        }

        // Hover ripple ring
        if (isHovered) {
          ctx.strokeStyle = "rgba(197, 168, 128, 0.6)";
          ctx.beginPath();
          ctx.arc(mx, my, (time * 40) % 60, 0, Math.PI * 2);
          ctx.stroke();
        }

      // -----------------------------------------------------------------
      // FIELD 2: AI AUTOMATION (canvasType: "ai")
      // n8n-Style Workflow Graph Execution Flow & Bezier Data Streams
      // -----------------------------------------------------------------
      } else if (type === "ai") {
        // Define n8n workflow nodes with responsive coordinates
        const mainY = height * 0.28;
        const toolY = height * 0.74;
        const nodeW = 104;
        const nodeH = 34;

        const mainNodes = [
          { id: "trigger", label: "Webhook (POST)", icon: "⚡", x: width * 0.10, y: mainY },
          { id: "extract", label: "Extract Msg", icon: "{}", x: width * 0.32, y: mainY },
          { id: "db", label: "Supabase DB", icon: "🌐", x: width * 0.54, y: mainY },
          { id: "agent", label: "AI Agent Core", icon: "🤖", x: width * 0.78, y: mainY }
        ];

        const toolNodes = [
          { id: "openai", label: "OpenAI GPT-4o", icon: "🧠", x: width * 0.56, y: toolY },
          { id: "gemini", label: "Gemini Pro", icon: "✨", x: width * 0.72, y: toolY },
          { id: "voice", label: "Voice Agent", icon: "🎙️", x: width * 0.88, y: toolY }
        ];

        // Overall execution cycle clock (0 -> 5)
        const totalDuration = 5.5; // 5.5 seconds per full workflow run
        const progress = (time % totalDuration) / totalDuration;
        const currentStep = Math.floor(progress * 5); // 5 execution phases

        // Helper to draw a Bezier connection spline with animated flowing data packets
        const drawBezierWire = (
          x1: number, y1: number, 
          x2: number, y2: number, 
          isActive: boolean, 
          flowProgress: number
        ) => {
          const dx = (x2 - x1) * 0.5;
          const cp1x = x1 + dx;
          const cp1y = y1;
          const cp2x = x2 - dx;
          const cp2y = y2;

          // Wire line
          ctx.strokeStyle = isActive ? "rgba(197, 168, 128, 0.75)" : "rgba(197, 168, 128, 0.18)";
          ctx.lineWidth = isActive ? 1.8 : 1.0;
          if (!isActive) ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Glowing Data Packet traveling along Bezier curve when wire is active
          if (isActive && flowProgress >= 0 && flowProgress <= 1) {
            const t = flowProgress;
            // Cubic Bezier interpolation formula
            const cx = Math.pow(1 - t, 3) * x1 +
                       3 * Math.pow(1 - t, 2) * t * cp1x +
                       3 * (1 - t) * Math.pow(t, 2) * cp2x +
                       Math.pow(t, 3) * x2;
            const cy = Math.pow(1 - t, 3) * y1 +
                       3 * Math.pow(1 - t, 2) * t * cp1y +
                       3 * (1 - t) * Math.pow(t, 2) * cp2y +
                       Math.pow(t, 3) * y2;

            // Packet glow aura
            ctx.fillStyle = "#10b981";
            ctx.beginPath();
            ctx.arc(cx, cy, 3.8, 0, Math.PI * 2);
            ctx.fill();
          }
        };

        // Draw main pipeline Bezier wires
        for (let i = 0; i < mainNodes.length - 1; i++) {
          const n1 = mainNodes[i];
          const n2 = mainNodes[i + 1];
          const isActive = currentStep >= i;
          const stepProgress = (progress * 5) - i;
          drawBezierWire(n1.x + nodeW / 2, n1.y, n2.x - nodeW / 2, n2.y, isActive, stepProgress);
        }

        // Draw AI Agent fan-out wires to sub-tools
        const agentNode = mainNodes[3];
        toolNodes.forEach((tn) => {
          const isActive = currentStep >= 3;
          const stepProgress = (progress * 5) - 3;
          drawBezierWire(agentNode.x, agentNode.y + nodeH / 2, tn.x, tn.y - 18, isActive, stepProgress);
        });

        // Render main n8n workflow node cards
        mainNodes.forEach((n, i) => {
          const isNodeActive = currentStep === i;
          const isNodeCompleted = currentStep > i;

          // Card Background
          ctx.fillStyle = "#0c0d12";
          ctx.strokeStyle = isNodeActive ? "#10b981" : (isNodeCompleted ? "#c5a880" : "rgba(197, 168, 128, 0.2)");
          ctx.lineWidth = isNodeActive ? 1.8 : 1.0;

          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(n.x - nodeW / 2, n.y - nodeH / 2, nodeW, nodeH, 6);
          } else {
            ctx.rect(n.x - nodeW / 2, n.y - nodeH / 2, nodeW, nodeH);
          }
          ctx.fill();
          ctx.stroke();

          // Input/Output Ports
          ctx.fillStyle = isNodeActive ? "#10b981" : "#c5a880";
          ctx.beginPath();
          ctx.arc(n.x - nodeW / 2, n.y, 3, 0, Math.PI * 2);
          ctx.arc(n.x + nodeW / 2, n.y, 3, 0, Math.PI * 2);
          ctx.fill();

          // Icon & Label Text
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.font = "bold 8.5px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${n.icon} ${n.label}`, n.x, n.y);

          // Status Badge above active/completed node
          if (isNodeActive) {
            ctx.fillStyle = "#10b981";
            ctx.font = "bold 7px monospace";
            ctx.fillText("[ EXECUTING ]", n.x, n.y - nodeH / 2 - 7);
          } else if (isNodeCompleted) {
            ctx.fillStyle = "#c5a880";
            ctx.font = "7px monospace";
            ctx.fillText("✓ 200 OK", n.x, n.y - nodeH / 2 - 7);
          }
        });

        // Render tool sub-nodes (circles)
        toolNodes.forEach((tn) => {
          const isToolActive = currentStep === 4;

          ctx.fillStyle = "#090a0f";
          ctx.strokeStyle = isToolActive ? "#10b981" : "rgba(197, 168, 128, 0.25)";
          ctx.lineWidth = isToolActive ? 1.5 : 1.0;

          ctx.beginPath();
          ctx.arc(tn.x, tn.y, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Icon
          ctx.fillStyle = "#ffffff";
          ctx.font = "11px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(tn.icon, tn.x, tn.y);

          // Label
          ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
          ctx.font = "8px monospace";
          ctx.fillText(tn.label, tn.x, tn.y + 24);
        });

        // Telemetry Footer
        ctx.fillStyle = "rgba(197, 168, 128, 0.6)";
        ctx.font = "8.5px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`WORKFLOW: n8n_AI_AGENT_PIPELINE | STATUS: RUNNING`, 15, height - 15);

      // -----------------------------------------------------------------
      // FIELD 3: VIDEO EDITING (canvasType: "video")
      // Multitrack Timeline Channels & Audio Waveform FFT Analyzer
      // -----------------------------------------------------------------
      } else if (type === "video") {
        ctx.strokeStyle = "rgba(197, 168, 128, 0.12)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 24) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Waveform Spectrum Bars
        const barW = 4;
        const gap = 3;
        const count = Math.floor(width / (barW + gap));
        const startX = (width - count * (barW + gap)) / 2;

        ctx.fillStyle = "rgba(197, 168, 128, 0.45)";
        for (let i = 0; i < count; i++) {
          const x = startX + i * (barW + gap);
          const distToCenter = Math.abs(x - width / 2) / (width / 2);
          const baseH = Math.sin(i * 0.18 + time * 4) * 45 + 55;
          const finalH = baseH * (1 - distToCenter * 0.4);
          ctx.fillRect(x, height * 0.5 - finalH / 2, barW, finalH);
        }

        // Gold Playhead Line
        const phX = (time * 90) % width;
        ctx.strokeStyle = "#c5a880";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(phX, height * 0.12);
        ctx.lineTo(phX, height * 0.88);
        ctx.stroke();

        // Playhead Top Dial
        ctx.fillStyle = "#c5a880";
        ctx.beginPath();
        ctx.moveTo(phX, height * 0.12 - 5);
        ctx.lineTo(phX - 5, height * 0.12);
        ctx.lineTo(phX, height * 0.12 + 5);
        ctx.lineTo(phX + 5, height * 0.12);
        ctx.closePath();
        ctx.fill();

      // -----------------------------------------------------------------
      // FIELD 4: BRAND SHOOT (canvasType: "brand")
      // Camera Lens Aperture Iris, Focal Reticle & Golden Ratio Grid
      // -----------------------------------------------------------------
      } else if (type === "brand") {
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = 65;
        const irisOpen = Math.sin(time * 1.8) * 15 + baseRadius;

        // Rule of thirds camera grid
        ctx.strokeStyle = "rgba(197, 168, 128, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 3, 0); ctx.lineTo(width / 3, height);
        ctx.moveTo((width * 2) / 3, 0); ctx.lineTo((width * 2) / 3, height);
        ctx.moveTo(0, height / 3); ctx.lineTo(width, height / 3);
        ctx.moveTo(0, (height * 2) / 3); ctx.lineTo(width, (height * 2) / 3);
        ctx.stroke();

        // Outer Lens Housing Ring
        ctx.strokeStyle = "rgba(197, 168, 128, 0.5)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius + 22, 0, Math.PI * 2);
        ctx.stroke();

        // 8-blade Aperture Iris
        const bladeCount = 8;
        ctx.strokeStyle = "rgba(197, 168, 128, 0.75)";
        ctx.lineWidth = 1.2;
        for (let i = 0; i < bladeCount; i++) {
          const angle = (i / bladeCount) * Math.PI * 2 + time * 0.3;
          const bx = cx + Math.cos(angle) * irisOpen;
          const by = cy + Math.sin(angle) * irisOpen;
          const tangentAngle = angle + Math.PI / 2.5;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(tangentAngle) * 35, by + Math.sin(tangentAngle) * 35);
          ctx.stroke();
        }

        // Camera Focus Lock Reticle at Mouse or Center
        const tx = isHovered ? mx : cx;
        const ty = isHovered ? my : cy;
        ctx.strokeStyle = "#c5a880";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tx - 14, ty - 14, 28, 28);
        ctx.fillStyle = "#c5a880";
        ctx.beginPath();
        ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
        ctx.fill();

      // -----------------------------------------------------------------
      // FIELD 5: LOGO & BRAND DESIGN (canvasType: "logo")
      // Vector Geometry Grid, Bezier Handles & Emblem Construction
      // -----------------------------------------------------------------
      } else if (type === "logo" || type === "cgi") {
        const cx = width / 2;
        const cy = height / 2;

        // Golden ratio concentric circles
        const radii = [30, 50, 80, 130];
        radii.forEach((r, idx) => {
          ctx.strokeStyle = `rgba(197, 168, 128, ${0.15 + idx * 0.08})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Morphing Bezier Curve Vector Path
        const p1 = { x: cx - 110, y: cy + Math.sin(time * 2) * 30 };
        const cp1 = { x: cx - 40, y: cy - 70 + Math.cos(time * 2) * 40 };
        const cp2 = { x: cx + 40, y: cy + 70 - Math.cos(time * 2) * 40 };
        const p2 = { x: cx + 110, y: cy - Math.sin(time * 2) * 30 };

        // Main curve line
        ctx.strokeStyle = "#c5a880";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);
        ctx.stroke();

        // Control Handle Tangent Lines
        ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y); ctx.lineTo(cp1.x, cp1.y);
        ctx.moveTo(p2.x, p2.y); ctx.lineTo(cp2.x, cp2.y);
        ctx.stroke();

        // Anchor & Control Point Handles
        [p1, cp1, cp2, p2].forEach((pt, i) => {
          ctx.fillStyle = i % 3 === 0 ? "#c5a880" : "#ffffff";
          ctx.fillRect(pt.x - 3.5, pt.y - 3.5, 7, 7);
        });

      // -----------------------------------------------------------------
      // FIELD 6: UNREAL ENGINE DEV (canvasType: "unreal")
      // Nanite Point-Cloud Grid, Lumen Ray Tracing Bounces & Shader HUD
      // -----------------------------------------------------------------
      } else if (type === "unreal" || type === "env") {
        const cx = width / 2;
        const cy = height / 2;

        // 3D Perspective Terrain Grid Lines
        ctx.strokeStyle = "rgba(197, 168, 128, 0.28)";
        ctx.lineWidth = 1;
        const gridRows = 12;
        for (let j = 0; j < gridRows; j++) {
          const y = cy + (j / gridRows) * (height / 2 - 10);
          const rowScale = j / gridRows;
          const w = width * (0.2 + rowScale * 0.8);
          ctx.beginPath();
          ctx.moveTo(cx - w / 2, y);
          ctx.lineTo(cx + w / 2, y);
          ctx.stroke();
        }

        // Vanishing Perspective Radial Lines
        const radials = 10;
        for (let i = 0; i <= radials; i++) {
          const rx = (i / radials) * width;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 30);
          ctx.lineTo(rx, height);
          ctx.stroke();
        }

        // Lumen Ray Tracing Bounces
        const rayX = cx + Math.cos(time * 2) * 120;
        const rayY = cy + Math.sin(time * 1.5) * 40;
        ctx.strokeStyle = "#c5a880";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 30);
        ctx.lineTo(rayX, rayY);
        ctx.lineTo(rayX + 50, rayY + 30);
        ctx.stroke();

        ctx.fillStyle = "#c5a880";
        ctx.beginPath();
        ctx.arc(rayX, rayY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(197, 168, 128, 0.7)";
        ctx.font = "8.5px monospace";
        ctx.fillText(`LUMEN: PATH_TRACED | NANITE: 2.4M POLYS`, 15, height - 15);

      // -----------------------------------------------------------------
      // FIELD 7: ARCHITECT DESIGN HOME (canvasType: "architect")
      // Architectural Floorplan Blueprint, Dimension Measurements & BIM Lines
      // -----------------------------------------------------------------
      } else if (type === "architect") {
        const bpW = width * 0.65;
        const bpH = height * 0.65;
        const bpX = (width - bpW) / 2;
        const bpY = (height - bpH) / 2;

        // Outer Structural Wall Boundaries
        ctx.strokeStyle = "rgba(197, 168, 128, 0.75)";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(bpX, bpY, bpW, bpH);

        // Internal Room Dividers
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Vertical wall
        ctx.moveTo(bpX + bpW * 0.45, bpY);
        ctx.lineTo(bpX + bpW * 0.45, bpY + bpH);
        // Horizontal wall
        ctx.moveTo(bpX, bpY + bpH * 0.55);
        ctx.lineTo(bpX + bpW * 0.45, bpY + bpH * 0.55);
        ctx.stroke();

        // Architectural Door Arc Swings
        ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bpX + bpW * 0.45, bpY + bpH * 0.55, 24, 0, Math.PI / 2);
        ctx.stroke();

        // Laser Dimension Measurement Arrows
        const dimY = bpY - 12;
        ctx.strokeStyle = "#c5a880";
        ctx.beginPath();
        ctx.moveTo(bpX, dimY); ctx.lineTo(bpX + bpW, dimY);
        ctx.moveTo(bpX, dimY - 4); ctx.lineTo(bpX, dimY + 4);
        ctx.moveTo(bpX + bpW, dimY - 4); ctx.lineTo(bpX + bpW, dimY + 4);
        ctx.stroke();

        ctx.fillStyle = "#c5a880";
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`DIM: 14.85m`, bpX + bpW / 2, dimY - 5);

      // -----------------------------------------------------------------
      // FIELD 8: 3D ARCHITECTURE RENDERS (canvasType: "render3d")
      // Progressive Raytracing Bucket Grid Scanner & Photoreal Caustics
      // -----------------------------------------------------------------
      } else if (type === "render3d") {
        const bucketSize = 40;
        const cols = Math.ceil(width / bucketSize);
        const rows = Math.ceil(height / bucketSize);
        const totalBuckets = cols * rows;
        const currentBucket = Math.floor((time * 8) % totalBuckets);

        ctx.strokeStyle = "rgba(197, 168, 128, 0.15)";
        ctx.lineWidth = 0.8;
        for (let r = 0; r <= rows; r++) {
          ctx.beginPath();
          ctx.moveTo(0, r * bucketSize);
          ctx.lineTo(width, r * bucketSize);
          ctx.stroke();
        }
        for (let c = 0; c <= cols; c++) {
          ctx.beginPath();
          ctx.moveTo(c * bucketSize, 0);
          ctx.lineTo(c * bucketSize, height);
          ctx.stroke();
        }

        // Active Rendering Bucket Box
        const activeCol = currentBucket % cols;
        const activeRow = Math.floor(currentBucket / cols);
        const bx = activeCol * bucketSize;
        const by = activeRow * bucketSize;

        ctx.strokeStyle = "#c5a880";
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bucketSize, bucketSize);

        // Render Bucket Scanning Corner Crosses
        ctx.fillStyle = "#c5a880";
        ctx.fillRect(bx - 2, by - 2, 4, 4);
        ctx.fillRect(bx + bucketSize - 2, by - 2, 4, 4);

        ctx.font = "8.5px monospace";
        ctx.fillText(`PASS: 1024/1024 | BUCKET: [${activeCol}, ${activeRow}]`, 15, 20);

      // -----------------------------------------------------------------
      // FIELD 9: INTERACTIVE ARCHITECTURE (canvasType: "interactive_arch")
      // 360 Spatial Camera Frustum, Material Hotspots & Radar Minimap
      // -----------------------------------------------------------------
      } else if (type === "interactive_arch") {
        const cx = width / 2;
        const cy = height / 2;

        // 360 Camera View Frustum Cone
        const angle = time * 0.8;
        const coneLength = 110;
        const spread = 0.5;

        ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle - spread) * coneLength, cy + Math.sin(angle - spread) * coneLength);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle + spread) * coneLength, cy + Math.sin(angle + spread) * coneLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, coneLength, angle - spread, angle + spread);
        ctx.stroke();

        // Material Swap Hotspot Targets
        const hotspots = [
          { x: cx - 70, y: cy - 40 },
          { x: cx + 80, y: cy - 20 },
          { x: cx, y: cy + 60 }
        ];

        hotspots.forEach((hs, i) => {
          const pulse = Math.sin(time * 3 + i) * 4 + 7;
          ctx.strokeStyle = "#c5a880";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(hs.x, hs.y, pulse, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#c5a880";
          ctx.beginPath();
          ctx.arc(hs.x, hs.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Minimap Corner Radar
        const mmSize = 50;
        const mmX = width - mmSize - 15;
        const mmY = height - mmSize - 15;
        ctx.strokeStyle = "rgba(197, 168, 128, 0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(mmX, mmY, mmSize, mmSize);
        ctx.fillStyle = "#c5a880";
        ctx.beginPath();
        ctx.arc(mmX + mmSize / 2, mmY + mmSize / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

      // -----------------------------------------------------------------
      // FIELD 10: AR / VR SOLUTIONS (canvasType: "xr")
      // 6DoF Spatial Hand Tracking, Gaussian Splatting & Volumetric Reticle
      // -----------------------------------------------------------------
      } else if (type === "xr") {
        // Volumetric Gaussian Splats Floating Cloud
        splats.forEach((sp) => {
          sp.x += sp.vx;
          sp.y += sp.vy;
          if (sp.x < 0 || sp.x > width) sp.vx *= -1;
          if (sp.y < 0 || sp.y > height) sp.vy *= -1;

          ctx.fillStyle = `rgba(197, 168, 128, ${sp.alpha})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // 6DoF Hand-Tracking Skeletal Joints
        const tx = isHovered ? mx : width / 2;
        const ty = isHovered ? my : height / 2;

        const joints = [
          { x: tx, y: ty },
          { x: tx - 25, y: ty - 35 },
          { x: tx - 10, y: ty - 50 },
          { x: tx + 10, y: ty - 45 },
          { x: tx + 28, y: ty - 30 }
        ];

        // Bone connecting lines
        ctx.strokeStyle = "rgba(197, 168, 128, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        joints.forEach((j, idx) => {
          if (idx === 0) ctx.moveTo(j.x, j.y);
          else ctx.lineTo(j.x, j.y);
        });
        ctx.stroke();

        // Joint Node Spheres
        joints.forEach((j) => {
          ctx.fillStyle = "#c5a880";
          ctx.beginPath();
          ctx.arc(j.x, j.y, 3.2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Holographic Spatial Optics Circle
        ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(tx, ty, 65, time * 0.5, time * 0.5 + Math.PI * 1.5);
        ctx.stroke();
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
    Code: <Code className="w-5 h-5 text-[#c5a880]" />,
    Bot: <Bot className="w-5 h-5 text-[#c5a880]" />,
    Film: <Film className="w-5 h-5 text-[#c5a880]" />,
    Camera: <Camera className="w-5 h-5 text-[#c5a880]" />,
    PenTool: <PenTool className="w-5 h-5 text-[#c5a880]" />,
    Layers: <Layers className="w-5 h-5 text-[#c5a880]" />,
    Home: <Home className="w-5 h-5 text-[#c5a880]" />,
    Box: <Box className="w-5 h-5 text-[#c5a880]" />,
    MousePointerClick: <MousePointerClick className="w-5 h-5 text-[#c5a880]" />,
    Eye: <Eye className="w-5 h-5 text-[#c5a880]" />,
    Sparkles: <Sparkles className="w-5 h-5 text-[#c5a880]" />,
    Cpu: <Cpu className="w-5 h-5 text-[#c5a880]" />,
    Smartphone: <Smartphone className="w-5 h-5 text-[#c5a880]" />,
    ScanFace: <ScanFace className="w-5 h-5 text-[#c5a880]" />
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
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.45em] text-[#6b7280] uppercase">
                CAPABILITIES HUD
              </span>
              <div className="w-8 h-[1px] bg-[#c5a880]/20" />
              <span className="font-mono text-[9px] text-[#c5a880] animate-pulse">
                [ ONLINE ]
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl tracking-[0.1em] text-white mt-2 uppercase">
              CREATIVE TECHNOLOGY STACK
            </h2>
            <p className="font-mono text-xs text-[#c5a880]/70 tracking-widest mt-1 uppercase">
              WE BUILD. AUTOMATE. ELEVATE. — End-to-End Digital Solutions
            </p>
          </div>
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
