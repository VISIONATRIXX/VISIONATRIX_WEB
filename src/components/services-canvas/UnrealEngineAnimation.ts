import { CanvasRenderContext } from "./types";

// Floating Cyber Ambient Particles
const cyberParticles: { x: number; y: number; speedY: number; size: number; alpha: number }[] = [];
for (let i = 0; i < 30; i++) {
  cyberParticles.push({
    x: Math.random() * 500,
    y: Math.random() * 300,
    speedY: Math.random() * 0.8 + 0.3,
    size: Math.random() * 2 + 1,
    alpha: Math.random() * 0.6 + 0.2
  });
}

export function renderUnrealEngineAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
  const cx = width / 2;
  const horizonY = height * 0.36;
  const groundY = height * 0.86;

  // 1. Cyberpunk Skyline Wireframe Background (UE5 Sci-Fi City)
  ctx.strokeStyle = "rgba(197, 168, 128, 0.12)";
  ctx.lineWidth = 1;
  const bldgs = [
    { x: width * 0.05, w: 45, h: 90 },
    { x: width * 0.18, w: 60, h: 130 },
    { x: width * 0.35, w: 50, h: 100 },
    { x: width * 0.65, w: 55, h: 140 },
    { x: width * 0.80, w: 40, h: 85 }
  ];
  bldgs.forEach((b) => {
    ctx.strokeRect(b.x, horizonY - b.h, b.w, b.h);
    // Window grid
    for (let wy = horizonY - b.h + 10; wy < horizonY - 10; wy += 14) {
      ctx.beginPath();
      ctx.moveTo(b.x + 5, wy); ctx.lineTo(b.x + b.w - 5, wy);
      ctx.stroke();
    }
  });

  // 2. 3D Streaming Nanite Voxel Floor Grid
  const gridRows = 18;
  const moveOffset = (time * 80) % (height / gridRows);

  ctx.strokeStyle = "rgba(197, 168, 128, 0.25)";
  ctx.lineWidth = 1;

  for (let j = 0; j < gridRows; j++) {
    const rawY = horizonY + Math.pow(j / gridRows, 2.0) * (groundY - horizonY) + moveOffset * (j / gridRows);
    if (rawY <= groundY && rawY >= horizonY) {
      const scale = (rawY - horizonY) / (groundY - horizonY);
      const w = width * (0.1 + scale * 0.9);
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, rawY);
      ctx.lineTo(cx + w / 2, rawY);
      ctx.stroke();
    }
  }

  // Radial Perspective Grid Rays
  for (let i = 0; i <= 14; i++) {
    const rx = (i / 14) * width;
    ctx.beginPath();
    ctx.moveTo(cx, horizonY);
    ctx.lineTo(rx, height);
    ctx.stroke();
  }

  // Floating Ambient Particles
  cyberParticles.forEach((p) => {
    p.y -= p.speedY;
    if (p.y < horizonY - 40) p.y = height;
    ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x % width, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. REALISTIC 3D METAHUMAN CHARACTER WALKING ACROSS THE CANVAS
  const walkSpeed = 6.8;
  const walkPhase = time * walkSpeed;

  // Character moves horizontally forward across stage, then wraps around
  const stageRange = width * 0.65;
  const rawX = (width * 0.18 + (time * 48) % stageRange);
  const charX = isHovered ? rawX + (mx - cx) * 0.08 : rawX;

  // Vertical body bobbing physics
  const bodyBob = Math.abs(Math.sin(walkPhase * 2)) * 6;
  const charY = groundY - 14 - bodyBob;

  // Floor Shadow beneath character
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.beginPath();
  ctx.ellipse(charX, groundY - 4, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Joint Kinematic Calculations
  const hipY = charY - 60;
  const chestY = charY - 100;
  const neckY = charY - 130;
  const headY = charY - 150;

  // 4. DRAWING METAHUMAN SKELETON & CYBER-ARMOR BODY

  // --- LEGS & CYBER BOOTS ---
  const legLen = 34;
  const shinLen = 32;

  // Left Leg (Behind / Infront)
  const lAngle = Math.sin(walkPhase) * 0.62;
  const lHipX = charX - 10;
  const lKneeX = lHipX + Math.sin(lAngle) * legLen;
  const lKneeY = hipY + Math.cos(lAngle) * legLen;
  const lFootX = lKneeX + Math.sin(lAngle + 0.35) * shinLen;
  const lFootY = Math.min(groundY - 6, lKneeY + Math.cos(lAngle + 0.35) * shinLen);

  // Right Leg
  const rAngle = -Math.sin(walkPhase) * 0.62;
  const rHipX = charX + 10;
  const rKneeX = rHipX + Math.sin(rAngle) * legLen;
  const rKneeY = hipY + Math.cos(rAngle) * legLen;
  const rFootX = rKneeX + Math.sin(rAngle + 0.35) * shinLen;
  const rFootY = Math.min(groundY - 6, rKneeY + Math.cos(rAngle + 0.35) * shinLen);

  // Render Leg Armor Segments
  const drawLegSegment = (hX: number, hY: number, kX: number, kY: number, fX: number, fY: number) => {
    // Thigh armor
    ctx.strokeStyle = "#c5a880";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(hX, hY); ctx.lineTo(kX, kY);
    ctx.stroke();

    // Shin armor
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(kX, kY); ctx.lineTo(fX, fY);
    ctx.stroke();

    // Boot Tread
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(fX - 4, fY - 2, 14, 5);

    // Knee cap joint node
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(kX, kY, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  drawLegSegment(lHipX, hipY, lKneeX, lKneeY, lFootX, lFootY);
  drawLegSegment(rHipX, hipY, rKneeX, rKneeY, rFootX, rFootY);

  // Footstep Shockwave Impact Event
  const isImpact = Math.abs(Math.sin(walkPhase)) > 0.94;
  if (isImpact) {
    const shockR = ((time * 90) % 40) + 6;
    ctx.strokeStyle = "rgba(16, 185, 129, 0.85)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(rFootX, groundY - 4, shockR, shockR * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // --- TORSO / CHEST ARMOR & RECTOR HEART ---
  ctx.fillStyle = "rgba(15, 18, 26, 0.95)";
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 2.2;

  // Chest Armor Plate Contour
  ctx.beginPath();
  ctx.moveTo(charX - 18, neckY);
  ctx.lineTo(charX + 18, neckY);
  ctx.lineTo(charX + 12, hipY);
  ctx.lineTo(charX - 12, hipY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Carbon Fiber Rib Lines on Torso
  ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(charX - 15, neckY + 12); ctx.lineTo(charX + 15, neckY + 12);
  ctx.moveTo(charX - 13, neckY + 24); ctx.lineTo(charX + 13, neckY + 24);
  ctx.stroke();

  // Core Arc Reactor Heart Pulsing Unit
  const reactorGlow = Math.sin(time * 6) * 3 + 6;
  ctx.fillStyle = "#10b981";
  ctx.shadowColor = "#10b981";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(charX, chestY + 10, reactorGlow, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // --- ARMS & HANDS (Counter-Swinging) ---
  const armLen = 26;
  const forearmLen = 24;
  const lArmA = -Math.sin(walkPhase) * 0.52;
  const rArmA = Math.sin(walkPhase) * 0.52;

  // Left Arm
  const lShX = charX - 18;
  const lElbX = lShX + Math.sin(lArmA) * armLen;
  const lElbY = neckY + Math.cos(lArmA) * armLen;
  const lHandX = lElbX + Math.sin(lArmA + 0.3) * forearmLen;
  const lHandY = lElbY + Math.cos(lArmA + 0.3) * forearmLen;

  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(lShX, neckY); ctx.lineTo(lElbX, lElbY); ctx.lineTo(lHandX, lHandY);
  ctx.stroke();

  // Right Arm
  const rShX = charX + 18;
  const rElbX = rShX + Math.sin(rArmA) * armLen;
  const rElbY = neckY + Math.cos(rArmA) * armLen;
  const rHandX = rElbX + Math.sin(rArmA + 0.3) * forearmLen;
  const rHandY = rElbY + Math.cos(rArmA + 0.3) * forearmLen;

  ctx.beginPath();
  ctx.moveTo(rShX, neckY); ctx.lineTo(rElbX, rElbY); ctx.lineTo(rHandX, rHandY);
  ctx.stroke();

  // Shoulder Pauldron Armor Pads
  ctx.fillStyle = "#c5a880";
  ctx.fillRect(lShX - 5, neckY - 4, 10, 8);
  ctx.fillRect(rShX - 5, neckY - 4, 10, 8);

  // --- HEAD & OPTIC VISOR ---
  ctx.fillStyle = "rgba(10, 12, 18, 0.95)";
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(charX, headY, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing Optic Visor Laser Bar
  const visorX = charX - 10;
  const visorY = headY - 4;
  ctx.fillStyle = "#10b981";
  ctx.fillRect(visorX, visorY, 20, 5);

  // Active Visor Scanning Laser Dot
  const scanDotX = visorX + ((time * 30) % 20);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(scanDotX, visorY, 3, 5);

  // 5. LUMEN REALTIME RAY-TRACING LIGHT BEAMS
  ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(charX, chestY + 10);
  ctx.lineTo(rFootX, rFootY);
  ctx.lineTo(rFootX + 40, rFootY + 10);
  ctx.stroke();

  // 6. AAA UNREAL ENGINE 5 HUD TELEMETRY
  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "right";
  ctx.fillText("[ UNREAL ENGINE 5.4 | METAHUMAN CORE V5 ]", width - 15, 25);

  ctx.fillStyle = "rgba(197, 168, 128, 0.9)";
  ctx.font = "8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`CHARACTER: METAHUMAN_V5 | NANITE MESH: 4,820,104 TRIS | LUMEN GI: HARDWARE RAY TRACING`, 15, height - 15);
}
