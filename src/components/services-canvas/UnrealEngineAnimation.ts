import { CanvasRenderContext } from "./types";

export function renderUnrealEngineAnimation({ ctx, width, height, time }: CanvasRenderContext) {
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
}
