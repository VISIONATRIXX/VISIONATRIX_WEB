import { CanvasRenderContext } from "./types";

const splats: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
for (let i = 0; i < 35; i++) {
  splats.push({
    x: Math.random() * 400,
    y: Math.random() * 300,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 1.2,
    size: Math.random() * 3.5 + 1,
    alpha: Math.random() * 0.5 + 0.2
  });
}

export function renderXrSolutionsAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
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
