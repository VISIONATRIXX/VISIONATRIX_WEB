import { CanvasRenderContext } from "./types";

export function renderBrandShootAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
  const cx = width / 2;
  const cy = height / 2;

  // 1. Camera Angle & Photography Shot Cycle (4 Angles: Front 0°, Side Macro 45°, Top Down -30°, Hero Low 30°)
  const shotAngles = [
    { label: "FRONT EYE-LEVEL (0°)", panX: 0, scaleY: 1.0, lightBias: 0 },
    { label: "SIDE MACRO PERSPECTIVE (45°)", panX: 35, scaleY: 0.9, lightBias: 0.4 },
    { label: "HIGH ANGLE TOP DOWN (-30°)", panX: -20, scaleY: 0.7, lightBias: -0.3 },
    { label: "HERO LOW ANGLE (+30°)", panX: 15, scaleY: 1.15, lightBias: 0.2 }
  ];

  const cycleDuration = 2.4; // 2.4s per shot angle
  const shotIndex = Math.floor((time / cycleDuration) % shotAngles.length);
  const currentAngle = shotAngles[shotIndex];

  // Smooth camera orbit pan
  const camOrbitPan = Math.sin(time * 1.5) * 18;
  const bX = cx + currentAngle.panX + (isHovered ? (mx - cx) * 0.12 : camOrbitPan);
  const stageY = cy + 45;

  // 2. Studio Stage Podium Table with 3D Bevel & Floor Reflection
  ctx.fillStyle = "rgba(197, 168, 128, 0.07)";
  ctx.strokeStyle = "rgba(197, 168, 128, 0.35)";
  ctx.lineWidth = 1.4;

  // Elliptical Table Top
  ctx.beginPath();
  ctx.ellipse(cx, stageY, 115, 32 * currentAngle.scaleY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Table Bevel Pedestal Base
  ctx.beginPath();
  ctx.moveTo(cx - 90, stageY);
  ctx.lineTo(cx - 70, stageY + 38);
  ctx.lineTo(cx + 70, stageY + 38);
  ctx.lineTo(cx + 90, stageY);
  ctx.stroke();

  // Floor Reflection Ellipse of Product Bottle
  ctx.fillStyle = "rgba(197, 168, 128, 0.2)";
  ctx.beginPath();
  ctx.ellipse(bX, stageY + 6, 26, 8 * currentAngle.scaleY, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Studio Softbox Lights (Left & Right) with Dynamic Beam Angles
  const leftLightX = cx - 145;
  const leftLightY = cy - 75;
  const rightLightX = cx + 145;
  const rightLightY = cy - 75;

  // Left Softbox Beam
  const beamOpacity = 0.06 + Math.sin(time * 2 + currentAngle.lightBias) * 0.02;
  ctx.fillStyle = `rgba(197, 168, 128, ${beamOpacity})`;
  ctx.beginPath();
  ctx.moveTo(leftLightX, leftLightY);
  ctx.lineTo(bX - 40, stageY - 40);
  ctx.lineTo(bX + 10, stageY + 10);
  ctx.closePath();
  ctx.fill();

  // Right Softbox Beam
  ctx.beginPath();
  ctx.moveTo(rightLightX, rightLightY);
  ctx.lineTo(bX - 10, stageY + 10);
  ctx.lineTo(bX + 40, stageY - 40);
  ctx.closePath();
  ctx.fill();

  // Softbox Light Heads
  ctx.fillStyle = "#c5a880";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.fillRect(leftLightX - 14, leftLightY - 14, 28, 28);
  ctx.strokeRect(leftLightX - 14, leftLightY - 14, 28, 28);
  ctx.fillRect(rightLightX - 14, rightLightY - 14, 28, 28);
  ctx.strokeRect(rightLightX - 14, rightLightY - 14, 28, 28);

  // Softbox Grid Lines
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  ctx.beginPath();
  ctx.moveTo(leftLightX, leftLightY - 14); ctx.lineTo(leftLightX, leftLightY + 14);
  ctx.moveTo(rightLightX, rightLightY - 14); ctx.lineTo(rightLightX, rightLightY + 14);
  ctx.stroke();

  // 4. DETAILED REALISTIC GLASS PERFUME BOTTLE ON THE TABLE
  const bottleW = 44;
  const bottleH = 68 * currentAngle.scaleY;
  const bottleY = stageY - bottleH / 2 - 12;

  // Glass Outer Body Outline
  ctx.fillStyle = "rgba(12, 14, 20, 0.85)";
  ctx.strokeStyle = "rgba(197, 168, 128, 0.9)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(bX - bottleW / 2, bottleY - bottleH / 2, bottleW, bottleH, 8);
  } else {
    ctx.rect(bX - bottleW / 2, bottleY - bottleH / 2, bottleW, bottleH);
  }
  ctx.fill();
  ctx.stroke();

  // Thick Crystal Glass Base Layer
  ctx.fillStyle = "rgba(197, 168, 128, 0.35)";
  ctx.fillRect(bX - bottleW / 2 + 2, bottleY + bottleH / 2 - 12, bottleW - 4, 10);

  // Liquid Fill inside Bottle
  const liquidH = (bottleH - 20) * 0.72;
  const liquidY = bottleY + bottleH / 2 - liquidH - 4;
  ctx.fillStyle = "rgba(197, 168, 128, 0.4)";
  ctx.fillRect(bX - bottleW / 2 + 4, liquidY, bottleW - 8, liquidH);

  // Animated Liquid Surface Wave
  const waveOffset = Math.sin(time * 3.5) * 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.beginPath();
  ctx.ellipse(bX, liquidY, (bottleW - 8) / 2, 3 + waveOffset * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glass Specular Vertical Light Reflection Sheen
  const sheenX = bX - bottleW / 2 + 8 + Math.sin(time * 2) * 4;
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fillRect(sheenX, bottleY - bottleH / 2 + 6, 4, bottleH - 20);

  // Metallic Gold Spray Nozzle Neck
  ctx.fillStyle = "#c5a880";
  ctx.fillRect(bX - 8, bottleY - bottleH / 2 - 8, 16, 8);

  // Glass Cap / Bottle Topper
  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.fillRect(bX - 12, bottleY - bottleH / 2 - 24, 24, 16);
  ctx.strokeRect(bX - 12, bottleY - bottleH / 2 - 24, 24, 16);

  // Luxury Brand Label on Bottle Front
  ctx.fillStyle = "#0c0d12";
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1;
  ctx.fillRect(bX - 15, bottleY - 10, 30, 20);
  ctx.strokeRect(bX - 15, bottleY - 10, 30, 20);

  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 5.5px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("VISIONATRIX", bX, bottleY - 3);
  ctx.font = "4.5px monospace";
  ctx.fillText("PARFUM", bX, bottleY + 5);

  // 5. Rule of Thirds Viewfinder Grid
  ctx.strokeStyle = "rgba(197, 168, 128, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 3, 0); ctx.lineTo(width / 3, height);
  ctx.moveTo((width * 2) / 3, 0); ctx.lineTo((width * 2) / 3, height);
  ctx.moveTo(0, height / 3); ctx.lineTo(width, height / 3);
  ctx.moveTo(0, (height * 2) / 3); ctx.lineTo(width, (height * 2) / 3);
  ctx.stroke();

  // 6. Camera Focus Reticle Tracking Target
  const targetX = isHovered ? mx : bX;
  const targetY = isHovered ? my : bottleY;

  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(targetX - 26, targetY - 26, 52, 52);

  // Corner Reticle Brackets
  ctx.beginPath();
  ctx.moveTo(targetX - 32, targetY); ctx.lineTo(targetX - 20, targetY);
  ctx.moveTo(targetX + 20, targetY); ctx.lineTo(targetX + 32, targetY);
  ctx.moveTo(targetX, targetY - 32); ctx.lineTo(targetX, targetY - 20);
  ctx.moveTo(targetX, targetY + 20); ctx.lineTo(targetX, targetY + 32);
  ctx.stroke();

  // 7. HIGH-FREQUENCY CAMERA STROBE FLASH BURST WITH ANGLE CHANGING EFFECT
  const shotProgress = (time % cycleDuration) / cycleDuration;
  const isFlashing = shotProgress > 0.88; // Flash burst near end of each shot cycle
  const flashIntensity = isFlashing ? (shotProgress - 0.88) / 0.12 : 0;

  if (isFlashing) {
    // White Screen Strobe Burst
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + flashIntensity * 0.45})`;
    ctx.fillRect(0, 0, width, height);

    // Radial Lens Flare Burst
    const flareRadius = (flashIntensity * 140) + 20;
    ctx.strokeStyle = "rgba(197, 168, 128, 0.95)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bX, bottleY, flareRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Shutter Capture Text Badge
    ctx.fillStyle = "#000000";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`[ ⚡ CAPTURING SHOT #${shotIndex + 1}: ${currentAngle.label} ]`, cx, cy - 90);
  }

  // Camera Telemetry HUD
  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.font = "8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`ANGLE: ${currentAngle.label} | 85mm f/1.2 | ISO: 100 | RAW 60MP`, 15, height - 15);
}
