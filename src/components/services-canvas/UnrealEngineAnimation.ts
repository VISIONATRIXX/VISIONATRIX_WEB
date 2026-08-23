import { CanvasRenderContext } from "./types";

export function renderUnrealEngineAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
  const cx = width / 2;
  const horizonY = height * 0.38;
  const groundY = height * 0.88;

  // 1. Moving 3D Perspective Nanite Terrain Grid
  const gridRows = 16;
  const moveOffset = (time * 65) % (height / gridRows);

  ctx.strokeStyle = "rgba(197, 168, 128, 0.22)";
  ctx.lineWidth = 1;

  // Horizontal Grid Lines moving forward
  for (let j = 0; j < gridRows; j++) {
    const rawY = horizonY + Math.pow(j / gridRows, 1.8) * (groundY - horizonY) + moveOffset * (j / gridRows);
    if (rawY <= groundY && rawY >= horizonY) {
      const scale = (rawY - horizonY) / (groundY - horizonY);
      const w = width * (0.15 + scale * 0.85);
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, rawY);
      ctx.lineTo(cx + w / 2, rawY);
      ctx.stroke();
    }
  }

  // Vanishing Perspective Radial Lines
  const radials = 12;
  for (let i = 0; i <= radials; i++) {
    const rx = (i / radials) * width;
    ctx.beginPath();
    ctx.moveTo(cx, horizonY);
    ctx.lineTo(rx, height);
    ctx.stroke();
  }

  // 2. METAHUMAN 3D CHARACTER SKELETAL WALK CYCLE ANIMATION
  const walkSpeed = 6.5;
  const walkPhase = time * walkSpeed;

  // Vertical torso bounce during walk
  const bobY = Math.abs(Math.sin(walkPhase * 2)) * 5;
  const charX = cx + (isHovered ? (mx - cx) * 0.1 : Math.sin(time * 1.2) * 12);
  const charBaseY = height * 0.72 - bobY;

  // Joint Angles (Kinematic Walk Rig)
  const leftLegAngle = Math.sin(walkPhase) * 0.55;
  const rightLegAngle = -Math.sin(walkPhase) * 0.55;
  const leftArmAngle = -Math.sin(walkPhase) * 0.45;
  const rightArmAngle = Math.sin(walkPhase) * 0.45;

  // Torso / Head positions
  const headY = charBaseY - 88;
  const neckY = charBaseY - 72;
  const pelvisY = charBaseY - 24;

  // Ground Footstep Ripple Ring on Contact
  const isFootContact = Math.abs(Math.sin(walkPhase)) > 0.92;
  if (isFootContact) {
    const rippleR = ((time * 80) % 35) + 5;
    ctx.strokeStyle = "rgba(16, 185, 129, 0.75)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(charX, groundY - 12, rippleR, rippleR * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw Legs & Feet
  const legLen = 30;
  const shinLen = 28;

  // Left Leg (Behind/Infront)
  const hipLX = charX - 8;
  const kneeLX = hipLX + Math.sin(leftLegAngle) * legLen;
  const kneeLY = pelvisY + Math.cos(leftLegAngle) * legLen;
  const footLX = kneeLX + Math.sin(leftLegAngle + 0.3) * shinLen;
  const footLY = Math.min(groundY - 10, kneeLY + Math.cos(leftLegAngle + 0.3) * shinLen);

  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(hipLX, pelvisY);
  ctx.lineTo(kneeLX, kneeLY);
  ctx.lineTo(footLX, footLY);
  ctx.lineTo(footLX + 8, footLY); // Foot sole
  ctx.stroke();

  // Right Leg
  const hipRX = charX + 8;
  const kneeRX = hipRX + Math.sin(rightLegAngle) * legLen;
  const kneeRY = pelvisY + Math.cos(rightLegAngle) * legLen;
  const footRX = kneeRX + Math.sin(rightLegAngle + 0.3) * shinLen;
  const footRY = Math.min(groundY - 10, kneeRY + Math.cos(rightLegAngle + 0.3) * shinLen);

  ctx.beginPath();
  ctx.moveTo(hipRX, pelvisY);
  ctx.lineTo(kneeRX, kneeRY);
  ctx.lineTo(footRX, footRY);
  ctx.lineTo(footRX + 8, footRY);
  ctx.stroke();

  // Draw Spine & Torso Chest Armor
  ctx.fillStyle = "rgba(12, 14, 20, 0.9)";
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(charX - 16, neckY);
  ctx.lineTo(charX + 16, neckY);
  ctx.lineTo(charX + 10, pelvisY);
  ctx.lineTo(charX - 10, pelvisY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Core Glowing Reactor Heart Badge
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(charX, neckY + 20, 4, 0, Math.PI * 2);
  ctx.fill();

  // Draw Arms
  const armLen = 22;
  const forearmLen = 20;

  // Left Arm
  const shoulderLX = charX - 16;
  const elbowLX = shoulderLX + Math.sin(leftArmAngle) * armLen;
  const elbowLY = neckY + Math.cos(leftArmAngle) * armLen;
  const handLX = elbowLX + Math.sin(leftArmAngle + 0.4) * forearmLen;
  const handLY = elbowLY + Math.cos(leftArmAngle + 0.4) * forearmLen;

  ctx.strokeStyle = "rgba(197, 168, 128, 0.85)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(shoulderLX, neckY);
  ctx.lineTo(elbowLX, elbowLY);
  ctx.lineTo(handLX, handLY);
  ctx.stroke();

  // Right Arm
  const shoulderRX = charX + 16;
  const elbowRX = shoulderRX + Math.sin(rightArmAngle) * armLen;
  const elbowRY = neckY + Math.cos(rightArmAngle) * armLen;
  const handRX = elbowRX + Math.sin(rightArmAngle + 0.4) * forearmLen;
  const handRY = elbowRY + Math.cos(rightArmAngle + 0.4) * forearmLen;

  ctx.beginPath();
  ctx.moveTo(shoulderRX, neckY);
  ctx.lineTo(elbowRX, elbowRY);
  ctx.lineTo(handRX, handRY);
  ctx.stroke();

  // Head & Optic Helmet Visor
  ctx.fillStyle = "rgba(12, 14, 20, 0.95)";
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(charX, headY, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Optic Glowing Visor Beam Line
  ctx.fillStyle = "#10b981";
  ctx.fillRect(charX - 8, headY - 3, 16, 4);

  // Joint Spheres (Nanite Skeleton Joints)
  [
    { x: shoulderLX, y: neckY }, { x: shoulderRX, y: neckY },
    { x: elbowLX, y: elbowLY }, { x: elbowRX, y: elbowRY },
    { x: kneeLX, y: kneeLY }, { x: kneeRX, y: kneeRY }
  ].forEach((j) => {
    ctx.fillStyle = "#c5a880";
    ctx.beginPath();
    ctx.arc(j.x, j.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Lumen Path-Tracing Ray Bounces
  const rayTargetX = charX + Math.sin(time * 2) * 50;
  ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(charX, neckY + 20);
  ctx.lineTo(rayTargetX, groundY - 10);
  ctx.lineTo(rayTargetX + 30, groundY - 40);
  ctx.stroke();

  // 4. Unreal Engine HUD Overlay Badges
  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "right";
  ctx.fillText("[ UNREAL ENGINE 5.4 ]", width - 15, 25);

  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.font = "8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`METAHUMAN: RIG_WALK_CYCLE | NANITE: 3.4M POLYS | LUMEN GI: 60FPS`, 15, height - 15);
}
