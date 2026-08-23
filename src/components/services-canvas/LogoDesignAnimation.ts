import { CanvasRenderContext } from "./types";

export function renderLogoDesignAnimation({ ctx, width, height, time }: CanvasRenderContext) {
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
}
