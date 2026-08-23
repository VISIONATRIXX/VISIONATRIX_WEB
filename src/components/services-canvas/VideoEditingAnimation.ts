import { CanvasRenderContext } from "./types";

export function renderVideoEditingAnimation({ ctx, width, height, time }: CanvasRenderContext) {
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
}
