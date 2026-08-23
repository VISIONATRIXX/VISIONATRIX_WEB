import { CanvasRenderContext } from "./types";

export function renderBrandShootAnimation({ ctx, width, height, time, mx, my, isHovered }: CanvasRenderContext) {
  const cx = width / 2;
  const cy = height / 2;
  const stageY = cy + 40;

  // 1. Studio Stage / Product Podium Table
  ctx.fillStyle = "rgba(197, 168, 128, 0.08)";
  ctx.strokeStyle = "rgba(197, 168, 128, 0.4)";
  ctx.lineWidth = 1.5;

  // Oval Podium Top
  ctx.beginPath();
  ctx.ellipse(cx, stageY, 110, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Stage Base Pedestal
  ctx.beginPath();
  ctx.moveTo(cx - 85, stageY);
  ctx.lineTo(cx - 65, stageY + 35);
  ctx.lineTo(cx + 65, stageY + 35);
  ctx.lineTo(cx + 85, stageY);
  ctx.stroke();

  // Product Silhouette (Perfume / Luxury Product Box on Table)
  const prodX = cx;
  const prodY = stageY - 35;
  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.2;
  ctx.fillRect(prodX - 18, prodY - 28, 36, 56);
  ctx.strokeRect(prodX - 18, prodY - 28, 36, 56);

  // Product Cap
  ctx.fillRect(prodX - 8, prodY - 38, 16, 10);
  ctx.strokeRect(prodX - 8, prodY - 38, 16, 10);

  // Product Floor Reflection Shadow
  ctx.fillStyle = "rgba(197, 168, 128, 0.25)";
  ctx.beginPath();
  ctx.ellipse(cx, stageY + 5, 28, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Studio Softbox Spotlight Beams (Left & Right)
  const leftLightX = cx - 140;
  const leftLightY = cy - 70;
  const rightLightX = cx + 140;
  const rightLightY = cy - 70;

  // Left Spotlight Cone
  ctx.fillStyle = "rgba(197, 168, 128, 0.07)";
  ctx.beginPath();
  ctx.moveTo(leftLightX, leftLightY);
  ctx.lineTo(cx - 30, stageY + 10);
  ctx.lineTo(cx + 30, stageY + 10);
  ctx.closePath();
  ctx.fill();

  // Right Spotlight Cone
  ctx.beginPath();
  ctx.moveTo(rightLightX, rightLightY);
  ctx.lineTo(cx - 30, stageY + 10);
  ctx.lineTo(cx + 30, stageY + 10);
  ctx.closePath();
  ctx.fill();

  // Softbox Lamp Heads
  ctx.fillStyle = "rgba(197, 168, 128, 0.9)";
  ctx.fillRect(leftLightX - 12, leftLightY - 12, 24, 24);
  ctx.strokeRect(leftLightX - 12, leftLightY - 12, 24, 24);
  ctx.fillRect(rightLightX - 12, rightLightY - 12, 24, 24);
  ctx.strokeRect(rightLightX - 12, rightLightY - 12, 24, 24);

  // 3. Rule of Thirds Viewfinder Grid
  ctx.strokeStyle = "rgba(197, 168, 128, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 3, 0); ctx.lineTo(width / 3, height);
  ctx.moveTo((width * 2) / 3, 0); ctx.lineTo((width * 2) / 3, height);
  ctx.moveTo(0, height / 3); ctx.lineTo(width, height / 3);
  ctx.moveTo(0, (height * 2) / 3); ctx.lineTo(width, (height * 2) / 3);
  ctx.stroke();

  // 4. Camera Focus Reticle Tracking Target
  const targetX = isHovered ? mx : cx;
  const targetY = isHovered ? my : prodY - 5;

  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(targetX - 22, targetY - 22, 44, 44);

  // Corner Crosshair ticks
  ctx.beginPath();
  ctx.moveTo(targetX - 28, targetY); ctx.lineTo(targetX - 18, targetY);
  ctx.moveTo(targetX + 18, targetY); ctx.lineTo(targetX + 28, targetY);
  ctx.moveTo(targetX, targetY - 28); ctx.lineTo(targetX, targetY - 18);
  ctx.moveTo(targetX, targetY + 18); ctx.lineTo(targetX, targetY + 28);
  ctx.stroke();

  // 5. FLASH STROBE CAMERA BURST ANIMATION
  const flashCycle = (time * 1.3) % 2.8;
  const isFlashing = flashCycle > 2.55;
  const flashIntensity = isFlashing ? (flashCycle - 2.55) / 0.25 : 0;

  if (isFlashing) {
    // Screen Flash Burst Overlay
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + flashIntensity * 0.4})`;
    ctx.fillRect(0, 0, width, height);

    // Radial Lens Flare Ring
    const flareRadius = (flashIntensity * 120) + 15;
    ctx.strokeStyle = "rgba(197, 168, 128, 0.9)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, prodY, flareRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Flash Text
    ctx.fillStyle = "#000000";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("[ ⚡ SHUTTER FLASH: RAW 60MP ]", cx, cy - 80);
  }

  // Telemetry Text
  ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
  ctx.font = "8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`ISO: 100 | f/1.8 | 1/250s | AF-LOCK: 100% | MODE: STUDIO`, 15, height - 15);
}
