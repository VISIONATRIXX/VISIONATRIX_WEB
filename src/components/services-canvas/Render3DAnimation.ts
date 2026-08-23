import { CanvasRenderContext } from "./types";

export function render3DRenderAnimation({ ctx, width, height, time }: CanvasRenderContext) {
  const bucketSize = 40;
  const cols = Math.ceil(width / bucketSize);
  const rows = Math.ceil(height / bucketSize);
  const totalBuckets = cols * rows;
  const currentBucket = Math.floor((time * 8) % totalBuckets);

  ctx.strokeStyle = "rgba(197, 168, 128, 0.15)";
  ctx.lineWidth = 0.8;
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * bucketSize);
    ctx.lineTo(width, r * bucketSize);
    ctx.stroke();
  }
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * bucketSize, 0);
    ctx.lineTo(c * bucketSize, height);
    ctx.stroke();
  }

  // Active Rendering Bucket Box
  const activeCol = currentBucket % cols;
  const activeRow = Math.floor(currentBucket / cols);
  const bx = activeCol * bucketSize;
  const by = activeRow * bucketSize;

  ctx.strokeStyle = "#c5a880";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bucketSize, bucketSize);

  // Render Bucket Scanning Corner Crosses
  ctx.fillStyle = "#c5a880";
  ctx.fillRect(bx - 2, by - 2, 4, 4);
  ctx.fillRect(bx + bucketSize - 2, by - 2, 4, 4);

  ctx.font = "8.5px monospace";
  ctx.fillText(`PASS: 1024/1024 | BUCKET: [${activeCol}, ${activeRow}]`, 15, 20);
}
