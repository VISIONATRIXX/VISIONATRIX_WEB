import { CanvasRenderContext } from "./types";

// Volumetric Gaussian Splats Particle Cloud
const splats: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }[] = [];
for (let i = 0; i < 45; i++) {
  splats.push({
    x: Math.random() * 500,
    y: Math.random() * 300,
    vx: (Math.random() - 0.5) * 1.4,
    vy: (Math.random() - 0.5) * 1.4,
    size: Math.random() * 3.5 + 1.2,
    alpha: Math.random() * 0.6 + 0.25,
    hue: Math.random() > 0.5 ? 160 : 38 // Emerald or Gold
  });
}

export function renderXrSolutionsAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
  const cx = width / 2;
  const cy = height / 2;

  // 1. Volumetric Gaussian Splat Cloud (LiDAR Point Cloud)
  splats.forEach((sp) => {
    sp.x += sp.vx;
    sp.y += sp.vy;
    if (sp.x < 0 || sp.x > width) sp.vx *= -1;
    if (sp.y < 0 || sp.y > height) sp.vy *= -1;

    ctx.fillStyle = sp.hue === 160 ? `rgba(16, 185, 129, ${sp.alpha})` : `rgba(197, 168, 128, ${sp.alpha})`;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. VR Headset Spatial Optics Viewport Contours (Curved Glass Lens Frame)
  ctx.strokeStyle = "rgba(197, 168, 128, 0.25)";
  ctx.lineWidth = 1.5;

  // Left Eye Lens Oval
  ctx.beginPath();
  ctx.ellipse(width * 0.32, cy, width * 0.26, height * 0.42, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Right Eye Lens Oval
  ctx.beginPath();
  ctx.ellipse(width * 0.68, cy, width * 0.26, height * 0.42, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Floating 3D Spatial Holographic UI Cards

  // Card 1: 3D Spatial Model Preview (Left)
  const card1X = width * 0.16;
  const card1Y = height * 0.32;
  ctx.fillStyle = "rgba(10, 12, 18, 0.82)";
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(card1X, card1Y, 110, 65);
  ctx.fillRect(card1X, card1Y, 110, 65);

  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 7px monospace";
  ctx.fillText("3D SPATIAL MODEL", card1X + 8, card1Y + 12);

  // Rotating Wireframe 3D Cube inside Card 1
  const cubeX = card1X + 55;
  const cubeY = card1Y + 40;
  const cubeSize = 14;
  const rotA = time * 1.4;

  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.strokeRect(cubeX - cubeSize / 2 + Math.cos(rotA) * 4, cubeY - cubeSize / 2 + Math.sin(rotA) * 4, cubeSize, cubeSize);
  ctx.strokeRect(cubeX - cubeSize / 2 - Math.cos(rotA) * 4, cubeY - cubeSize / 2 - Math.sin(rotA) * 4, cubeSize, cubeSize);

  // Card 2: Interactive Target Spatial Button (Right)
  const card2X = width * 0.68;
  const card2Y = height * 0.35;
  const buttonHover = isHovered;

  ctx.fillStyle = buttonHover ? "rgba(16, 185, 129, 0.25)" : "rgba(10, 12, 18, 0.82)";
  ctx.strokeStyle = buttonHover ? "#10b981" : "#c5a880";
  ctx.lineWidth = buttonHover ? 1.8 : 1.2;
  ctx.strokeRect(card2X, card2Y, 115, 60);
  ctx.fillRect(card2X, card2Y, 115, 60);

  ctx.fillStyle = buttonHover ? "#ffffff" : "#c5a880";
  ctx.font = "bold 7.5px monospace";
  ctx.fillText(buttonHover ? "[ ⚡ PINCH SELECT ]" : "[ SPATIAL GESTURE ]", card2X + 10, card2Y + 20);

  ctx.fillStyle = "rgba(197, 168, 128, 0.8)";
  ctx.font = "6.5px monospace";
  ctx.fillText("PINCH: INDEX + THUMB", card2X + 10, card2Y + 40);

  // 4. 21-POINT 6DOF ARTICULATED HAND TRACKING RIG
  const hX = isHovered ? mx : cx + Math.sin(time * 1.5) * 45;
  const hY = isHovered ? my : cy + 30 + Math.cos(time * 1.2) * 20;

  // Wrist Root & Palm Center
  const wrist = { x: hX, y: hY + 55 };
  const palm = { x: hX, y: hY + 20 };

  // 5 Finger Joint Chains (3 joints per finger)
  const pinch = Math.abs(Math.sin(time * 3)) * 8;

  const fingers = [
    // Thumb
    [{ x: hX - 16, y: hY + 25 }, { x: hX - 28, y: hY + 10 }, { x: hX - 20 - pinch, y: hY - 5 + pinch }],
    // Index Finger (Pinching towards thumb)
    [{ x: hX - 10, y: hY }, { x: hX - 12, y: hY - 20 }, { x: hX - 14 - pinch, y: hY - 35 + pinch }],
    // Middle Finger
    [{ x: hX, y: hY - 5 }, { x: hX, y: hY - 28 }, { x: hX, y: hY - 45 }],
    // Ring Finger
    [{ x: hX + 10, y: hY }, { x: hX + 12, y: hY - 22 }, { x: hX + 14, y: hY - 38 }],
    // Pinky Finger
    [{ x: hX + 18, y: hY + 10 }, { x: hX + 24, y: hY - 10 }, { x: hX + 28, y: hY - 25 }]
  ];

  // Draw Hand Bones (Skeletal Structure)
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.6;

  // Palm connections
  fingers.forEach((f) => {
    ctx.beginPath();
    ctx.moveTo(wrist.x, wrist.y);
    ctx.lineTo(palm.x, palm.y);
    ctx.lineTo(f[0].x, f[0].y);
    ctx.lineTo(f[1].x, f[1].y);
    ctx.lineTo(f[2].x, f[2].y);
    ctx.stroke();
  });

  // Draw 21 Hand Joint Spheres
  const allJoints = [wrist, palm];
  fingers.forEach((f) => allJoints.push(...f));

  allJoints.forEach((j, idx) => {
    ctx.fillStyle = idx === 4 ? "#10b981" : "#ffffff"; // Highlight index fingertip
    ctx.beginPath();
    ctx.arc(j.x, j.y, idx === 4 ? 3.8 : 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. INDEX FINGERTIP LASER RAY POINTER PROJECTING TO SPATIAL UI
  const indexTip = fingers[1][2]; // Index Tip
  ctx.strokeStyle = "rgba(16, 185, 129, 0.75)";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(indexTip.x, indexTip.y);
  ctx.lineTo(card2X + 20, card2Y + 30);
  ctx.stroke();
  ctx.setLineDash([]);

  // Laser Target Impact Ripple Ring
  const ringR = ((time * 50) % 25) + 3;
  ctx.strokeStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(card2X + 20, card2Y + 30, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // 6. SPATIAL AUDIO EXPANDING SOUNDWAVE CONCENTRIC RINGS
  const waveR = ((time * 60) % 70) + 10;
  ctx.strokeStyle = "rgba(197, 168, 128, 0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(hX, hY, waveR, 0, Math.PI * 2);
  ctx.stroke();

  // 7. SPATIAL COMPUTING OS TELEMETRY HUD
  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "right";
  ctx.fillText("[ VISION SPATIAL OS 4.0 ]", width - 15, 25);

  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.font = "8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`HAND TRACKING: 6DoF 120FPS | GAUSSIAN SPLATS: 1.4M | PASSTHROUGH: REALTIME 4K`, 15, height - 15);
}
