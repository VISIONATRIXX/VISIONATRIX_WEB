import { CanvasRenderContext } from "./types";

export function renderXrSolutionsAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
  const cx = width / 2;
  const cy = height / 2;

  // 1. Meta Quest Guardian Safety Boundary Grid (Floor Grid Lines)
  ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
  ctx.lineWidth = 1;
  const gY = height * 0.75;
  for (let x = 0; x < width; x += 25) {
    ctx.beginPath();
    ctx.moveTo(x, gY);
    ctx.lineTo(x + (x - cx) * 0.4, height);
    ctx.stroke();
  }
  for (let y = gY; y < height; y += 14) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Guardian Grid Boundary Wall Pillars
  ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
  ctx.beginPath();
  ctx.strokeRect(width * 0.08, height * 0.15, width * 0.84, height * 0.65);

  // 2. Meta Horizon OS Floating Spatial App Dock
  const dockW = width * 0.74;
  const dockH = height * 0.48;
  const dockX = (width - dockW) / 2;
  const dockY = height * 0.18;

  ctx.fillStyle = "rgba(12, 14, 22, 0.88)";
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.4;

  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(dockX, dockY, dockW, dockH, 14);
  } else {
    ctx.rect(dockX, dockY, dockW, dockH);
  }
  ctx.fill();
  ctx.stroke();

  // Meta Horizon OS Top Bar
  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText("[ META HORIZON OS v65 — SPATIAL VR DASHBOARD ]", dockX + 16, dockY + 20);

  // Floating VR App Cards inside Horizon OS
  const cardW = (dockW - 48) / 3;
  const cards = [
    { title: "BEAT SABER VR", badge: "GAME", color: "#e11d48" },
    { title: "WORKROOMS", badge: "DESK", color: "#3b82f6" },
    { title: "SPATIAL 3D VR", badge: "3D", color: "#10b981" }
  ];

  cards.forEach((c, idx) => {
    const cX = dockX + 16 + idx * (cardW + 8);
    const cY = dockY + 34;
    const cH = dockH - 48;
    const isCardSelected = isHovered ? idx === 1 : idx === 0;

    ctx.fillStyle = isCardSelected ? "rgba(16, 185, 129, 0.18)" : "rgba(197, 168, 128, 0.08)";
    ctx.strokeStyle = isCardSelected ? "#10b981" : "rgba(197, 168, 128, 0.3)";
    ctx.lineWidth = isCardSelected ? 1.8 : 1.0;

    ctx.fillRect(cX, cY, cardW, cH);
    ctx.strokeRect(cX, cY, cardW, cH);

    // Vector Graphics Icon Badge
    const iconX = cX + cardW / 2;
    const iconY = cY + 30;
    ctx.strokeStyle = isCardSelected ? "#10b981" : "#c5a880";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(iconX, iconY, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isCardSelected ? "#10b981" : "#c5a880";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.fillText(c.badge, iconX, iconY + 3);

    // App Title
    ctx.fillStyle = isCardSelected ? "#ffffff" : "#c5a880";
    ctx.font = "bold 7.5px monospace";
    ctx.fillText(c.title, cX + cardW / 2, cY + cH - 12);
  });

  // 3. META QUEST TOUCH PLUS VR CONTROLLER (Right Controller)
  const ctrlX = isHovered ? mx : cx + 80 + Math.sin(time * 1.5) * 20;
  const ctrlY = isHovered ? my : height * 0.68 + Math.cos(time * 1.2) * 12;

  // Controller Grip Handle
  ctx.fillStyle = "rgba(18, 20, 28, 0.95)";
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.8;

  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(ctrlX - 12, ctrlY, 24, 48, 8);
  } else {
    ctx.rect(ctrlX - 12, ctrlY, 24, 48);
  }
  ctx.fill();
  ctx.stroke();

  // Controller Top Faceplate & Tracking Sensor Ring
  ctx.fillStyle = "rgba(197, 168, 128, 0.3)";
  ctx.beginPath();
  ctx.ellipse(ctrlX, ctrlY - 4, 18, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Analog Thumbstick & Buttons (A / B)
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(ctrlX - 5, ctrlY - 4, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(ctrlX + 6, ctrlY - 7, 2, 0, Math.PI * 2);
  ctx.arc(ctrlX + 6, ctrlY - 1, 2, 0, Math.PI * 2);
  ctx.fill();

  // 4. CONTROLLER LASER POINTER RAY BEAM
  const targetX = dockX + 16 + (isHovered ? cardW + 8 + cardW / 2 : cardW / 2);
  const targetY = dockY + 34 + (dockH - 48) / 2;

  ctx.strokeStyle = "rgba(16, 185, 129, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(ctrlX, ctrlY - 12);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Laser Pointer Impact Target Ring
  const pulseR = ((time * 60) % 22) + 4;
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(targetX, targetY, pulseR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.fillText("[ TRIGGER CLICK ]", ctrlX, ctrlY + 62);

  // 5. META QUEST VR SYSTEM TELEMETRY HUD
  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "right";
  ctx.fillText("[ META QUEST 3 | 6DoF 120Hz ]", width - 15, 25);

  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.font = "8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`CONTROLLERS: TOUCH PLUS | GUARDIAN BOUNDARY: ACTIVE | PASSTHROUGH: COLOR 4K`, 15, height - 15);
}
