import { CanvasRenderContext } from "./types";

export function renderArchitectHomeAnimation({ ctx, width, height }: CanvasRenderContext) {
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
}
