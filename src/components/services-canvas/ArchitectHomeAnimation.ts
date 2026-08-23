import { CanvasRenderContext } from "./types";

export function renderArchitectHomeAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
  const bpW = width * 0.72;
  const bpH = height * 0.68;
  const bpX = (width - bpW) / 2;
  const bpY = (height - bpH) / 2 + 5;

  // 1. CAD Blueprint Grid Pattern Background
  ctx.strokeStyle = "rgba(197, 168, 128, 0.08)";
  ctx.lineWidth = 1;
  const gridSize = 20;
  for (let x = bpX; x <= bpX + bpW; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, bpY); ctx.lineTo(x, bpY + bpH); ctx.stroke();
  }
  for (let y = bpY; y <= bpY + bpH; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(bpX, y); ctx.lineTo(bpX + bpW, y); ctx.stroke();
  }

  // 2. Progressive Drafting Pen Animation
  const draftCycle = (time * 0.35) % 1.0;
  const outerWallProgress = Math.min(1.0, draftCycle * 1.5);

  // 3. Outer Structural Perimeter Double Walls
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 2.8;

  const p1 = { x: bpX, y: bpY };
  const p2 = { x: bpX + bpW, y: bpY };
  const p3 = { x: bpX + bpW, y: bpY + bpH };
  const p4 = { x: bpX, y: bpY + bpH };

  // Draw perimeter outer walls
  ctx.strokeRect(bpX, bpY, bpW, bpH);
  ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
  ctx.lineWidth = 1;
  ctx.strokeRect(bpX - 4, bpY - 4, bpW + 8, bpH + 8);

  // 4. Internal Room Partition Walls
  const divX = bpX + bpW * 0.46; // Vertical main divider
  const divY1 = bpY + bpH * 0.55; // Horizontal left divider
  const divY2 = bpY + bpH * 0.60; // Horizontal right divider

  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  // Vertical spine wall
  ctx.moveTo(divX, bpY); ctx.lineTo(divX, bpY + bpH);
  // Left room divider
  ctx.moveTo(bpX, divY1); ctx.lineTo(divX, divY1);
  // Right room divider
  ctx.moveTo(divX, divY2); ctx.lineTo(bpX + bpW, divY2);
  ctx.stroke();

  // 5. ARCHITECTURAL ROOM FURNITURE & FIXTURE LAYOUTS

  // --- ROOM 1: LIVING ROOM (Top-Left) ---
  const livingX = bpX + 15;
  const livingY = bpY + 15;
  // Sofa
  ctx.strokeStyle = "rgba(197, 168, 128, 0.6)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(livingX + 10, livingY + 10, 60, 24);
  // Coffee Table
  ctx.strokeRect(livingX + 25, livingY + 42, 30, 16);
  // TV Media Console
  ctx.strokeRect(livingX + 10, divY1 - 22, 60, 10);

  // --- ROOM 2: GOURMET KITCHEN (Bottom-Left) ---
  const kitchX = bpX + 15;
  const kitchY = divY1 + 15;
  // L-Shaped Countertop
  ctx.beginPath();
  ctx.moveTo(kitchX, kitchY);
  ctx.lineTo(kitchX + 75, kitchY);
  ctx.lineTo(kitchX + 75, kitchY + 20);
  ctx.lineTo(kitchX + 20, kitchY + 20);
  ctx.lineTo(kitchX + 20, bpY + bpH - 15);
  ctx.lineTo(kitchX, bpY + bpH - 15);
  ctx.closePath();
  ctx.stroke();
  // Island Bar Stools
  ctx.strokeRect(kitchX + 35, kitchY + 32, 35, 18);

  // --- ROOM 3: MASTER SUITE BEDROOM (Top-Right) ---
  const bedX = divX + 25;
  const bedY = bpY + 20;
  // King Size Bed
  ctx.strokeRect(bedX + 20, bedY, 48, 54);
  // Pillows
  ctx.strokeRect(bedX + 24, bedY + 4, 18, 12);
  ctx.strokeRect(bedX + 46, bedY + 4, 18, 12);
  // Nightstands
  ctx.strokeRect(bedX + 6, bedY + 4, 10, 10);
  ctx.strokeRect(bedX + 72, bedY + 4, 10, 10);

  // --- ROOM 4: ENSUITE BATHROOM (Bottom-Right) ---
  const bathX = divX + 20;
  const bathY = divY2 + 15;
  // Bathtub contour
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(bathX + 45, bathY, 40, 22, 6);
  } else {
    ctx.rect(bathX + 45, bathY, 40, 22);
  }
  ctx.stroke();
  // Twin Vanity Sink Circles
  ctx.beginPath();
  ctx.arc(bathX + 12, bathY + 12, 6, 0, Math.PI * 2);
  ctx.arc(bathX + 28, bathY + 12, 6, 0, Math.PI * 2);
  ctx.stroke();

  // 6. ANIMATED DOOR SWING ARCS
  const doorSwing = Math.sin(time * 2.2) * 0.4 + 0.5; // Swing angle

  // Door 1: Living Room Entry
  const d1X = divX;
  const d1Y = bpY + 40;
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(d1X, d1Y, 22, -Math.PI / 2, -Math.PI / 2 + doorSwing * (Math.PI / 2));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(d1X, d1Y); ctx.lineTo(d1X + Math.cos(-Math.PI / 2 + doorSwing * (Math.PI / 2)) * 22, d1Y + Math.sin(-Math.PI / 2 + doorSwing * (Math.PI / 2)) * 22);
  ctx.stroke();

  // Door 2: Master Suite Entry
  const d2X = divX;
  const d2Y = divY2 - 30;
  ctx.beginPath();
  ctx.arc(d2X, d2Y, 22, 0, doorSwing * (Math.PI / 2));
  ctx.stroke();

  // 7. ROOM TITLE LABELS & SQUARE METRIC BADGES
  ctx.fillStyle = "rgba(197, 168, 128, 0.9)";
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "left";

  ctx.fillText("LIVING ROOM [38.5m²]", bpX + 15, bpY + 22);
  ctx.fillText("MASTER SUITE [28.2m²]", divX + 20, bpY + 18);
  ctx.fillText("KITCHEN [18.4m²]", bpX + 15, divY1 + 18);
  ctx.fillText("ENSUITE BATH [12.6m²]", divX + 20, divY2 + 18);

  // 8. LASER DIMENSION ARROWS WITH UPDATING READINGS
  const dimTopY = bpY - 14;
  const dimLeftX = bpX - 14;

  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.2;

  // Top Dimension Arrow (Width)
  ctx.beginPath();
  ctx.moveTo(bpX, dimTopY); ctx.lineTo(bpX + bpW, dimTopY);
  ctx.moveTo(bpX, dimTopY - 4); ctx.lineTo(bpX, dimTopY + 4);
  ctx.moveTo(bpX + bpW, dimTopY - 4); ctx.lineTo(bpX + bpW, dimTopY + 4);
  ctx.stroke();

  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 8.5px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`WIDTH: 18.50m`, bpX + bpW / 2, dimTopY - 5);

  // Left Dimension Arrow (Depth)
  ctx.beginPath();
  ctx.moveTo(dimLeftX, bpY); ctx.lineTo(dimLeftX, bpY + bpH);
  ctx.moveTo(dimLeftX - 4, bpY); ctx.lineTo(dimLeftX + 4, bpY);
  ctx.moveTo(dimLeftX - 4, bpY + bpH); ctx.lineTo(dimLeftX + 4, bpY + bpH);
  ctx.stroke();

  // 9. NORTH COMPASS ROSE DIAL
  const compX = bpX + bpW - 25;
  const compY = bpY + 25;
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(compX, compY, 14, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.moveTo(compX, compY - 14);
  ctx.lineTo(compX - 4, compY + 2);
  ctx.lineTo(compX + 4, compY + 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.fillText("N", compX, compY - 16);

  // 10. CAD / BIM TELEMETRY FOOTER
  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.font = "8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`BIM ENGINE: REVIT 2026 | MODEL: RESIDENTIAL_V4 | SCALE: 1:50 A1 | UNITS: METRIC`, 15, height - 15);
}
