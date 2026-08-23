import { CanvasRenderContext } from "./types";

export function renderInteractiveArchAnimation({ ctx, width, height, time }: CanvasRenderContext) {
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
}
