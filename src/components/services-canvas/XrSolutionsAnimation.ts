import { CanvasRenderContext } from "./types";

// LiDAR Spatial Point-Cloud Surface Mapping Dots
const surfaceDots: { x: number; y: number; alpha: number }[] = [];
for (let i = 0; i < 40; i++) {
  surfaceDots.push({
    x: Math.random() * 500,
    y: Math.random() * 300,
    alpha: Math.random() * 0.5 + 0.25
  });
}

export function renderXrSolutionsAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
  const cx = width / 2;
  const cy = height / 2;

  // 1. LiDAR Spatial Room Surface Mapping Dots
  surfaceDots.forEach((pt) => {
    ctx.fillStyle = `rgba(16, 185, 129, ${pt.alpha * (Math.sin(time * 2 + pt.x) * 0.3 + 0.7)})`;
    ctx.beginPath();
    ctx.arc(pt.x % width, pt.y % height, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. Apple Vision Pro / Spatial OS Glass Window Frame
  const winW = width * 0.76;
  const winH = height * 0.72;
  const winX = (width - winW) / 2;
  const winY = (height - winH) / 2;

  // Frosted Translucent Glass Card Background
  ctx.fillStyle = "rgba(10, 12, 18, 0.86)";
  ctx.strokeStyle = "rgba(197, 168, 128, 0.45)";
  ctx.lineWidth = 1.4;

  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(winX, winY, winW, winH, 12);
  } else {
    ctx.rect(winX, winY, winW, winH);
  }
  ctx.fill();
  ctx.stroke();

  // Glass Window Header Bar
  ctx.fillStyle = "rgba(197, 168, 128, 0.12)";
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(winX, winY, winW, 26, [12, 12, 0, 0]);
  } else {
    ctx.rect(winX, winY, winW, 26);
  }
  ctx.fill();

  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText("🥽 SPATIAL OS 4.0 — ENTERPRISE 3D CAD ENGINE INSPECTION", winX + 12, winY + 16);

  // 3. REALISTIC 3D METALLIC ENGINE TURBINE / ROTOR IN SPATIAL AR SPACE
  const modelX = cx - 35;
  const modelY = cy + 5;
  const rot = time * 1.2;

  // Outer Engine Turbine Housing Ring
  const outerR = 52;
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(modelX, modelY, outerR, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Shaft Core
  ctx.fillStyle = "rgba(197, 168, 128, 0.4)";
  ctx.beginPath();
  ctx.arc(modelX, modelY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Rotating Turbine Blades (12 Articulated Metallic Blades)
  const blades = 12;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 1.6;
  for (let i = 0; i < blades; i++) {
    const angle = (i / blades) * Math.PI * 2 + rot;
    const bX1 = modelX + Math.cos(angle) * 18;
    const bY1 = modelY + Math.sin(angle) * 18;
    const bX2 = modelX + Math.cos(angle + 0.2) * outerR;
    const bY2 = modelY + Math.sin(angle + 0.2) * outerR;

    ctx.beginPath();
    ctx.moveTo(bX1, bY1);
    ctx.lineTo(bX2, bY2);
    ctx.stroke();
  }

  // Metallic Specular Reflection Ring
  ctx.strokeStyle = "rgba(16, 185, 129, 0.8)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(modelX, modelY, outerR + 6, rot, rot + Math.PI * 1.2);
  ctx.stroke();

  // 4. CAD COMPONENT LEADER CALLOUT LINES
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);

  // Callout 1: Turbine Core
  ctx.beginPath();
  ctx.moveTo(modelX + 25, modelY - 25);
  ctx.lineTo(modelX + 85, modelY - 45);
  ctx.lineTo(modelX + 130, modelY - 45);
  ctx.stroke();

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 7.5px monospace";
  ctx.fillText("TURBINE CORE [14,200 RPM]", modelX + 88, modelY - 50);

  // Callout 2: Thermal Sensor
  ctx.beginPath();
  ctx.moveTo(modelX - 35, modelY + 25);
  ctx.lineTo(modelX - 95, modelY + 45);
  ctx.lineTo(modelX - 135, modelY + 45);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#c5a880";
  ctx.fillText("THERMAL SENSOR [850°C OK]", modelX - 135, modelY + 40);

  // 5. SPATIAL TOOLBAR NAVIGATION BUTTONS
  const navY = winY + winH - 34;
  const buttons = [
    { label: "🔍 ROTATE 3D", x: winX + 15 },
    { label: "💥 EXPLODE", x: winX + 105 },
    { label: "📏 MEASURE", x: winX + 185 },
    { label: "🔊 AUDIO", x: winX + 265 }
  ];

  buttons.forEach((btn, idx) => {
    const isBtnActive = idx === 0 || (isHovered && idx === 1);
    ctx.fillStyle = isBtnActive ? "rgba(16, 185, 129, 0.25)" : "rgba(197, 168, 128, 0.08)";
    ctx.strokeStyle = isBtnActive ? "#10b981" : "rgba(197, 168, 128, 0.3)";
    ctx.lineWidth = 1;

    ctx.fillRect(btn.x, navY, 72, 22);
    ctx.strokeRect(btn.x, navY, 72, 22);

    ctx.fillStyle = isBtnActive ? "#ffffff" : "#c5a880";
    ctx.font = "7px monospace";
    ctx.textAlign = "center";
    ctx.fillText(btn.label, btn.x + 36, navY + 14);
  });

  // 6. REALISTIC HAND CONTOUR SILHOUETTE & PINCH RETICLE
  const handX = isHovered ? mx : cx + 80 + Math.sin(time * 1.5) * 20;
  const handY = isHovered ? my : cy + 40 + Math.cos(time * 1.2) * 15;

  // Index Fingertip Pinch Reticle Lock
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(handX, handY, 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(handX, handY, 3, 0, Math.PI * 2);
  ctx.fill();

  // Pinch Target Lock Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.fillText(isHovered ? "PINCH LOCK 100%" : "SPATIAL ANCHOR", handX, handY - 18);

  // Translucent Hand Contour Path
  ctx.strokeStyle = "rgba(197, 168, 128, 0.5)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(handX, handY + 12);
  ctx.lineTo(handX + 15, handY + 30);
  ctx.lineTo(handX + 25, handY + 60);
  ctx.lineTo(handX - 15, handY + 60);
  ctx.lineTo(handX - 5, handY + 30);
  ctx.closePath();
  ctx.stroke();

  // 7. TELEMETRY STATUS FOOTER
  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.font = "8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`AR ENGINE: VISION_KIT_3D | HAND GESTURES: ACTIVE | SPATIAL ANCHOR: LOCKED | LATENCY: 12ms`, 15, height - 15);
}
