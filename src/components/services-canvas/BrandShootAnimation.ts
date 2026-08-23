import { CanvasRenderContext } from "./types";

export function renderBrandShootAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
  const cx = width / 2;
  const cy = height / 2;

  // 1. Photography Shot Angles (Object stays centered, Camera angle & viewfinder shift around it!)
  const shotAngles = [
    { name: "FRONT EYE-LEVEL (0°)", camOffsetX: 0, camOffsetY: 0, zoom: 1.0, tiltDeg: 0, focalSize: 54 },
    { name: "TOP-RIGHT MACRO (45°)", camOffsetX: 38, camOffsetY: -22, zoom: 1.35, tiltDeg: 15, focalSize: 42 },
    { name: "LOW-ANGLE HERO (-25°)", camOffsetX: -15, camOffsetY: 28, zoom: 1.15, tiltDeg: -20, focalSize: 48 },
    { name: "TOP-DOWN FLATLAY (-60°)", camOffsetX: 0, camOffsetY: -35, zoom: 0.85, tiltDeg: 45, focalSize: 60 },
    { name: "SIDE PROFILE CLOSEUP (60°)", camOffsetX: -42, camOffsetY: 10, zoom: 1.25, tiltDeg: 30, focalSize: 44 }
  ];

  const cycleTime = 2.2; // 2.2 seconds per camera angle
  const shotIdx = Math.floor((time / cycleTime) % shotAngles.length);
  const curAngle = shotAngles[shotIdx];

  // Camera Viewfinder Position (shifts relative to center based on camera angle + mouse hover)
  const viewCenterX = cx + curAngle.camOffsetX + (isHovered ? (mx - cx) * 0.15 : Math.sin(time * 2) * 8);
  const viewCenterY = cy + curAngle.camOffsetY + (isHovered ? (my - cy) * 0.15 : Math.cos(time * 1.5) * 5);

  // 2. Studio Stage Podium Table (Centered at cx, cy + 45)
  const stageY = cy + 45;
  ctx.fillStyle = "rgba(197, 168, 128, 0.07)";
  ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
  ctx.lineWidth = 1.4;

  // Table Top Oval
  ctx.beginPath();
  ctx.ellipse(cx, stageY, 110, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Table Pedestal Base
  ctx.beginPath();
  ctx.moveTo(cx - 85, stageY);
  ctx.lineTo(cx - 65, stageY + 38);
  ctx.lineTo(cx + 65, stageY + 38);
  ctx.lineTo(cx + 85, stageY);
  ctx.stroke();

  // Floor Shadow Reflection below centered object
  ctx.fillStyle = "rgba(197, 168, 128, 0.22)";
  ctx.beginPath();
  ctx.ellipse(cx, stageY + 6, 26, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Studio Softbox Spotlights (Aiming at Centered Object)
  const leftLightX = cx - 145;
  const leftLightY = cy - 75;
  const rightLightX = cx + 145;
  const rightLightY = cy - 75;

  ctx.fillStyle = "rgba(197, 168, 128, 0.06)";
  ctx.beginPath();
  ctx.moveTo(leftLightX, leftLightY);
  ctx.lineTo(cx - 25, stageY - 20);
  ctx.lineTo(cx + 25, stageY + 10);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(rightLightX, rightLightY);
  ctx.lineTo(cx - 25, stageY + 10);
  ctx.lineTo(cx + 25, stageY - 20);
  ctx.closePath();
  ctx.fill();

  // Softbox Lamps
  ctx.fillStyle = "#c5a880";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.fillRect(leftLightX - 12, leftLightY - 12, 24, 24);
  ctx.strokeRect(leftLightX - 12, leftLightY - 12, 24, 24);
  ctx.fillRect(rightLightX - 12, rightLightY - 12, 24, 24);
  ctx.strokeRect(rightLightX - 12, rightLightY - 12, 24, 24);

  // 4. CENTERED OBJECT: LUXURY GLASS PERFUME BOTTLE (Locked at cx, cy)
  const bottleW = 44;
  const bottleH = 68;
  const bottleY = stageY - bottleH / 2 - 12;

  // Glass Outer Body
  ctx.fillStyle = "rgba(10, 12, 18, 0.88)";
  ctx.strokeStyle = "rgba(197, 168, 128, 0.9)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(cx - bottleW / 2, bottleY - bottleH / 2, bottleW, bottleH, 8);
  } else {
    ctx.rect(cx - bottleW / 2, bottleY - bottleH / 2, bottleW, bottleH);
  }
  ctx.fill();
  ctx.stroke();

  // Crystal Base
  ctx.fillStyle = "rgba(197, 168, 128, 0.35)";
  ctx.fillRect(cx - bottleW / 2 + 2, bottleY + bottleH / 2 - 12, bottleW - 4, 10);

  // Gold Liquid Fill
  const liquidH = (bottleH - 20) * 0.72;
  const liquidY = bottleY + bottleH / 2 - liquidH - 4;
  ctx.fillStyle = "rgba(197, 168, 128, 0.42)";
  ctx.fillRect(cx - bottleW / 2 + 4, liquidY, bottleW - 8, liquidH);

  // Surface Wave
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.beginPath();
  ctx.ellipse(cx, liquidY, (bottleW - 8) / 2, 3 + Math.sin(time * 3) * 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Vertical Specular Sheen Reflection
  const sheenX = cx - bottleW / 2 + 8 + Math.sin(time * 2) * 3;
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fillRect(sheenX, bottleY - bottleH / 2 + 6, 4, bottleH - 20);

  // Spray Nozzle Neck
  ctx.fillStyle = "#c5a880";
  ctx.fillRect(cx - 8, bottleY - bottleH / 2 - 8, 16, 8);

  // Crystal Cap
  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.fillRect(cx - 12, bottleY - bottleH / 2 - 24, 24, 16);
  ctx.strokeRect(cx - 12, bottleY - bottleH / 2 - 24, 24, 16);

  // Luxury Brand Emblem Label
  ctx.fillStyle = "#0c0d12";
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1;
  ctx.fillRect(cx - 15, bottleY - 10, 30, 20);
  ctx.strokeRect(cx - 15, bottleY - 10, 30, 20);

  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 5.5px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("VISIONATRIX", cx, bottleY - 3);
  ctx.font = "4.5px monospace";
  ctx.fillText("PARFUM", cx, bottleY + 5);

  // 5. DYNAMIC CAMERA VIEWFINDER FRAME SHIFTING WITH ANGLE TILT
  ctx.save();
  ctx.translate(viewCenterX, viewCenterY);
  ctx.rotate((curAngle.tiltDeg * Math.PI) / 180);

  const reticleSize = curAngle.focalSize * curAngle.zoom;
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.6;
  ctx.strokeRect(-reticleSize / 2, -reticleSize / 2, reticleSize, reticleSize);

  // Corner Camera Target Brackets
  const bLen = 10;
  ctx.beginPath();
  // Top-Left
  ctx.moveTo(-reticleSize / 2 - 6, -reticleSize / 2); ctx.lineTo(-reticleSize / 2 + bLen, -reticleSize / 2);
  ctx.moveTo(-reticleSize / 2, -reticleSize / 2 - 6); ctx.lineTo(-reticleSize / 2, -reticleSize / 2 + bLen);
  // Top-Right
  ctx.moveTo(reticleSize / 2 + 6, -reticleSize / 2); ctx.lineTo(reticleSize / 2 - bLen, -reticleSize / 2);
  ctx.moveTo(reticleSize / 2, -reticleSize / 2 - 6); ctx.lineTo(reticleSize / 2, -reticleSize / 2 + bLen);
  // Bottom-Left
  ctx.moveTo(-reticleSize / 2 - 6, reticleSize / 2); ctx.lineTo(-reticleSize / 2 + bLen, reticleSize / 2);
  ctx.moveTo(-reticleSize / 2, reticleSize / 2 + 6); ctx.lineTo(-reticleSize / 2, reticleSize / 2 - bLen);
  // Bottom-Right
  ctx.moveTo(reticleSize / 2 + 6, reticleSize / 2); ctx.lineTo(reticleSize / 2 - bLen, reticleSize / 2);
  ctx.moveTo(reticleSize / 2, reticleSize / 2 + 6); ctx.lineTo(reticleSize / 2, reticleSize / 2 - bLen);
  ctx.stroke();

  // Viewfinder Angle Label
  ctx.fillStyle = "#c5a880";
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`CAM: ${curAngle.name}`, 0, -reticleSize / 2 - 10);

  ctx.restore();

  // Rule of Thirds Viewfinder Lines
  ctx.strokeStyle = "rgba(197, 168, 128, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 3, 0); ctx.lineTo(width / 3, height);
  ctx.moveTo((width * 2) / 3, 0); ctx.lineTo((width * 2) / 3, height);
  ctx.moveTo(0, height / 3); ctx.lineTo(width, height / 3);
  ctx.moveTo(0, (height * 2) / 3); ctx.lineTo(width, (height * 2) / 3);
  ctx.stroke();

  // 6. SYNCHRONIZED STROBE CAMERA FLASH BURST AT ANGLE CHANGE
  const shotProgress = (time % cycleTime) / cycleTime;
  const isFlashing = shotProgress > 0.86; // Flash near end of cycle before angle switches
  const flashIntensity = isFlashing ? (shotProgress - 0.86) / 0.14 : 0;

  if (isFlashing) {
    // Screen Flash Strobe Burst Overlay
    ctx.fillStyle = `rgba(255, 255, 255, ${0.55 + flashIntensity * 0.4})`;
    ctx.fillRect(0, 0, width, height);

    // Radial Flare Expansion Ring
    const flareRadius = (flashIntensity * 160) + 20;
    ctx.strokeStyle = "rgba(197, 168, 128, 0.95)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, bottleY, flareRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Shutter Flash Telemetry Text
    ctx.fillStyle = "#000000";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`[ ⚡ SHUTTER CAPTURE: ${curAngle.name} | RAW 60MP ]`, cx, cy - 95);
  }

  // Camera Telemetry HUD
  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.font = "8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`CAMERA: ${curAngle.name} | 85mm f/1.2 | ISO: 100 | AF-LOCK: 100%`, 15, height - 15);
}
