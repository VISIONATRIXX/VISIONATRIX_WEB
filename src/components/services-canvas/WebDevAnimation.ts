import { CanvasRenderContext } from "./types";

const codeChars = "</>{}[]=const;import;async;await;01;return;";
const codeStreams: { x: number; y: number; speed: number; char: string }[] = [];

for (let i = 0; i < 20; i++) {
  codeStreams.push({
    x: Math.random() * 400,
    y: Math.random() * 300,
    speed: Math.random() * 1.5 + 0.8,
    char: codeChars[Math.floor(Math.random() * codeChars.length)]
  });
}

export function renderWebDevAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
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
}
