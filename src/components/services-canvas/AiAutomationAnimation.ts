import { CanvasRenderContext } from "./types";

export function renderAiAutomationAnimation({ ctx, width, height, time }: CanvasRenderContext) {
  const topY = height * 0.22;
  const midY = height * 0.50;
  const botY = height * 0.78;
  const nodeW = 96;
  const nodeH = 32;

  // 1. Pipeline Primary Sequence (Row 1)
  const primaryNodes = [
    { id: "inbound", label: "WhatsApp Inbound", icon: "⚡", x: width * 0.08, y: topY },
    { id: "switch", label: "Has Message?", icon: "🔀", x: width * 0.23, y: topY },
    { id: "extract", label: "Extract Msg", icon: "{}", x: width * 0.39, y: topY },
    { id: "supabase", label: "Supabase DB", icon: "🌐", x: width * 0.54, y: topY },
    { id: "filter", label: "Filter Intent", icon: "🔍", x: width * 0.69, y: topY },
    { id: "agent", label: "AI Patient Agent", icon: "🤖", x: width * 0.86, y: topY }
  ];

  // 2. Branching Secondary Node (Row 2 - False Branch)
  const fallbackNode = { id: "ack", label: "Ack Event (200)", icon: "✓", x: width * 0.23, y: midY };

  // 3. Sub-Tool Fan-Out Nodes (Row 3 - AI Agent Sub-nodes)
  const toolNodes = [
    { id: "openai", label: "OpenAI GPT-4o", icon: "🧠", x: width * 0.22, y: botY },
    { id: "gemini", label: "Gemini 1.5 Pro", icon: "✨", x: width * 0.35, y: botY },
    { id: "memory", label: "Vector Memory", icon: "💾", x: width * 0.48, y: botY },
    { id: "schedule", label: "Check Doctor", icon: "📅", x: width * 0.61, y: botY },
    { id: "book", label: "Book Appt", icon: "📝", x: width * 0.74, y: botY },
    { id: "voice", label: "AI Voice Call", icon: "🎙️", x: width * 0.87, y: botY }
  ];

  // Overall 7-phase execution cycle clock
  const totalDuration = 7.0;
  const progress = (time % totalDuration) / totalDuration;
  const currentStep = Math.floor(progress * 6);

  // Helper to draw a Bezier connection wire with data packet animation
  const drawBezierWire = (
    x1: number, y1: number, 
    x2: number, y2: number, 
    isActive: boolean, 
    flowProgress: number,
    isDashed = false
  ) => {
    const dx = (x2 - x1) * 0.5;
    const cp1x = x1 + dx;
    const cp1y = y1;
    const cp2x = x2 - dx;
    const cp2y = y2;

    ctx.strokeStyle = isActive ? "rgba(16, 185, 129, 0.7)" : "rgba(197, 168, 128, 0.2)";
    ctx.lineWidth = isActive ? 1.6 : 1.0;
    if (isDashed || !isActive) ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Animated Glowing Data Packet
    if (isActive && flowProgress >= 0 && flowProgress <= 1) {
      const t = flowProgress;
      const cx = Math.pow(1 - t, 3) * x1 +
                 3 * Math.pow(1 - t, 2) * t * cp1x +
                 3 * (1 - t) * Math.pow(t, 2) * cp2x +
                 Math.pow(t, 3) * x2;
      const cy = Math.pow(1 - t, 3) * y1 +
                 3 * Math.pow(1 - t, 2) * t * cp1y +
                 3 * (1 - t) * Math.pow(t, 2) * cp2y +
                 Math.pow(t, 3) * y2;

      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 1. Draw Primary Row Wires
  for (let i = 0; i < primaryNodes.length - 1; i++) {
    const n1 = primaryNodes[i];
    const n2 = primaryNodes[i + 1];
    const isActive = currentStep >= i;
    const stepProgress = (progress * 6) - i;
    drawBezierWire(n1.x + nodeW / 2, n1.y, n2.x - nodeW / 2, n2.y, isActive, stepProgress);
  }

  // 2. Draw Branching Wire (`Has Message?` -> `Ack Event` downward)
  const switchNode = primaryNodes[1];
  const isBranchActive = currentStep >= 1;
  const branchProgress = (progress * 6) - 1;
  drawBezierWire(switchNode.x, switchNode.y + nodeH / 2, fallbackNode.x, fallbackNode.y - nodeH / 2, isBranchActive, branchProgress, true);

  // 3. Draw Sub-Tool Fan-Out Wires from AI Agent
  const agentNode = primaryNodes[5];
  toolNodes.forEach((tn) => {
    const isActive = currentStep >= 5;
    const stepProgress = (progress * 6) - 5;
    drawBezierWire(agentNode.x, agentNode.y + nodeH / 2, tn.x, tn.y - 16, isActive, stepProgress, true);
  });

  // 4. Render Primary Row n8n Cards
  primaryNodes.forEach((n, i) => {
    const isNodeActive = currentStep === i;
    const isNodeDone = currentStep > i;

    ctx.fillStyle = "#0b0c10";
    ctx.strokeStyle = isNodeActive ? "#10b981" : (isNodeDone ? "#c5a880" : "rgba(197, 168, 128, 0.2)");
    ctx.lineWidth = isNodeActive ? 1.8 : 1.0;

    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(n.x - nodeW / 2, n.y - nodeH / 2, nodeW, nodeH, 5);
    } else {
      ctx.rect(n.x - nodeW / 2, n.y - nodeH / 2, nodeW, nodeH);
    }
    ctx.fill();
    ctx.stroke();

    // Left/Right Port Dots
    ctx.fillStyle = isNodeActive ? "#10b981" : "#c5a880";
    ctx.beginPath();
    ctx.arc(n.x - nodeW / 2, n.y, 2.5, 0, Math.PI * 2);
    ctx.arc(n.x + nodeW / 2, n.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Icon & Label
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${n.icon} ${n.label}`, n.x, n.y);

    // Status Badge
    if (isNodeActive) {
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 6.5px monospace";
      ctx.fillText("[ EXECUTING ]", n.x, n.y - nodeH / 2 - 6);
    } else if (isNodeDone) {
      ctx.fillStyle = "#c5a880";
      ctx.font = "6.5px monospace";
      ctx.fillText("✓ 200 OK", n.x, n.y - nodeH / 2 - 6);
    }
  });

  // 5. Render Fallback Node Card (`Ack Event`)
  const isFallbackActive = currentStep === 1;
  ctx.fillStyle = "#0b0c10";
  ctx.strokeStyle = isFallbackActive ? "#10b981" : "rgba(197, 168, 128, 0.2)";
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(fallbackNode.x - nodeW / 2, fallbackNode.y - nodeH / 2, nodeW, nodeH, 5);
  } else {
    ctx.rect(fallbackNode.x - nodeW / 2, fallbackNode.y - nodeH / 2, nodeW, nodeH);
  }
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = "8px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${fallbackNode.icon} ${fallbackNode.label}`, fallbackNode.x, fallbackNode.y);

  // 6. Render Sub-Tool Circle Nodes
  toolNodes.forEach((tn) => {
    const isToolActive = currentStep === 5;

    ctx.fillStyle = "#08090d";
    ctx.strokeStyle = isToolActive ? "#10b981" : "rgba(197, 168, 128, 0.25)";
    ctx.lineWidth = isToolActive ? 1.5 : 1.0;

    ctx.beginPath();
    ctx.arc(tn.x, tn.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tool Icon
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tn.icon, tn.x, tn.y);

    // Tool Label
    ctx.fillStyle = "rgba(197, 168, 128, 0.85)";
    ctx.font = "7.5px monospace";
    ctx.fillText(tn.label, tn.x, tn.y + 22);
  });

  // Telemetry Footer
  ctx.fillStyle = "rgba(197, 168, 128, 0.6)";
  ctx.font = "8.5px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`WORKFLOW: n8n_PATIENT_WHATSAPP_AI | ACTIVE NODES: 13 | LATENCY: 42ms`, 15, height - 15);
}
