"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Play, Square, RefreshCw, X, AlertTriangle, CheckCircle, Zap } from "lucide-react";

interface PerformanceSample {
  fps: number;
  delta: number;
  timestamp: number;
  section: string;
}

interface PerformanceReport {
  durationSeconds: number;
  totalFrames: number;
  avgFps: number;
  minFps: number;
  maxFps: number;
  dropsBelow30: number;
  dropsBelow60: number;
  sectionBreakdown: Record<string, { samples: number; avgFps: number; minFps: number }>;
  healthScore: number;
  bottleneckSummary: string[];
}

interface FPSProfilerProps {
  activeSection: string;
  enabled?: boolean;
}

export default function FPSProfiler({ activeSection, enabled = false }: FPSProfilerProps) {
  const [fps, setFps] = useState<number>(60);
  const [frameTime, setFrameTime] = useState<number>(16.6);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const samplesRef = useRef<PerformanceSample[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const activeSectionRef = useRef<string>(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // Real-Time FPS Loop — only runs if enabled is true
  useEffect(() => {
    if (!enabled) return;

    let animationFrameId: number;
    let lastFpsUpdate = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Ignore background tab pauses (document.hidden) or window resize/tab-switch spikes (delta > 200ms)
      if (delta > 0 && !document.hidden && delta < 200) {
        const instantFps = Math.min(144, Math.max(1, Math.round(1000 / delta)));
        frameCountRef.current++;

        if (isRecording) {
          samplesRef.current.push({
            fps: instantFps,
            delta: parseFloat(delta.toFixed(2)),
            timestamp: now,
            section: activeSectionRef.current || "global"
          });
        }

        // Update displayed FPS every 250ms for smooth display
        if (now - lastFpsUpdate >= 250) {
          const currentFrameTime = parseFloat(delta.toFixed(1));
          setFps(instantFps);
          setFrameTime(currentFrameTime);
          lastFpsUpdate = now;
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRecording]);

  // Reset telemetry stats
  const handleReset = () => {
    samplesRef.current = [];
    frameCountRef.current = 0;
    setReport(null);
    setShowReportModal(false);
    setIsRecording(true);
  };

  // Generate Performance Report on Stop
  const handleStopAndReport = () => {
    setIsRecording(false);
    const samples = samplesRef.current;

    if (samples.length === 0) {
      alert("No telemetry samples recorded yet. Keep scrolling to capture performance data.");
      return;
    }

    const totalFrames = samples.length;
    const durationSeconds = parseFloat(((samples[samples.length - 1].timestamp - samples[0].timestamp) / 1000).toFixed(1));

    let sumFps = 0;
    let minFps = Infinity;
    let maxFps = 0;
    let dropsBelow30 = 0;
    let dropsBelow60 = 0;

    const sectionMap: Record<string, { totalFps: number; minFps: number; count: number }> = {};

    for (const sample of samples) {
      sumFps += sample.fps;
      if (sample.fps < minFps) minFps = sample.fps;
      if (sample.fps > maxFps) maxFps = sample.fps;
      if (sample.fps < 30) dropsBelow30++;
      if (sample.fps < 60) dropsBelow60++;

      const sec = sample.section || "global";
      if (!sectionMap[sec]) {
        sectionMap[sec] = { totalFps: 0, minFps: Infinity, count: 0 };
      }
      sectionMap[sec].totalFps += sample.fps;
      if (sample.fps < sectionMap[sec].minFps) sectionMap[sec].minFps = sample.fps;
      sectionMap[sec].count++;
    }

    const avgFps = Math.round(sumFps / totalFrames);
    if (minFps === Infinity) minFps = 0;

    const sectionBreakdown: Record<string, { samples: number; avgFps: number; minFps: number }> = {};
    Object.keys(sectionMap).forEach((secKey) => {
      const data = sectionMap[secKey];
      sectionBreakdown[secKey] = {
        samples: data.count,
        avgFps: Math.round(data.totalFps / data.count),
        minFps: data.minFps === Infinity ? 0 : data.minFps
      };
    });

    // Calculate overall Health Score out of 100
    let healthScore = 100;
    if (avgFps < 60) healthScore -= (60 - avgFps) * 1.2;
    if (dropsBelow30 > 0) healthScore -= Math.min(30, dropsBelow30 * 2);
    healthScore = Math.max(10, Math.min(100, Math.round(healthScore)));

    // Generate diagnostic bottleneck summary notes
    const bottlenecks: string[] = [];
    if (avgFps >= 55) {
      bottlenecks.push("🟢 EXCELLENT: System maintaining ultra-smooth 60-120 FPS render target.");
    } else if (avgFps >= 35) {
      bottlenecks.push("🟡 MODERATE: Slight frame jitter detected during fast velocity scroll.");
    } else {
      bottlenecks.push("🔴 CRITICAL: Frame rate dropped below 30 FPS. Potential main-thread block.");
    }

    if (dropsBelow30 > 0) {
      bottlenecks.push(`⚠️ Detect ${dropsBelow30} frame spike(s) dropping below 30 FPS.`);
    }

    // Section specific analysis
    Object.entries(sectionBreakdown).forEach(([secName, secData]) => {
      if (secData.avgFps < 45) {
        bottlenecks.push(`🔍 Bottleneck in section [#${secName.toUpperCase()}]: Avg ${secData.avgFps} FPS (Min ${secData.minFps} FPS).`);
      }
    });

    const generatedReport: PerformanceReport = {
      durationSeconds: Math.max(0.1, durationSeconds),
      totalFrames,
      avgFps,
      minFps,
      maxFps,
      dropsBelow30,
      dropsBelow60,
      sectionBreakdown,
      healthScore,
      bottleneckSummary: bottlenecks
    };

    setReport(generatedReport);
    setShowReportModal(true);
  };

  // FPS Status Color
  const getFpsColor = (val: number) => {
    if (val >= 55) return "text-emerald-400 border-emerald-500/40 bg-emerald-950/40";
    if (val >= 30) return "text-amber-400 border-amber-500/40 bg-amber-950/40";
    return "text-rose-400 border-rose-500/40 bg-rose-950/40";
  };

  if (!enabled) return null;

  return (
    <>
      {/* Floating Real-Time FPS HUD Badge (Fixed Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-[99999] select-none font-mono">
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            data-cursor="expand fps"
            className="flex items-center gap-2 bg-[#0c0c14]/90 backdrop-blur-md border border-[#c5a880]/40 px-3 py-2 rounded-lg text-white text-xs shadow-2xl hover:border-[#c5a880] transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4 text-[#c5a880] animate-pulse" />
            <span className="font-extrabold text-[#c5a880]">{fps} FPS</span>
          </button>
        ) : (
          <div className="bg-[#0b0b10]/95 backdrop-blur-xl border border-white/15 rounded-xl p-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col gap-3 w-[260px] text-white">
            {/* Header Title Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#c5a880] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#c5a880] uppercase">
                  PERF TELEMETRY
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  data-cursor="minimize"
                  className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer text-xs"
                  title="Minimize HUD"
                >
                  −
                </button>
              </div>
            </div>

            {/* Live Readouts */}
            <div className="grid grid-cols-2 gap-2">
              {/* FPS Box */}
              <div className={`flex flex-col p-2 rounded-lg border ${getFpsColor(fps)}`}>
                <span className="text-[9px] text-white/60 uppercase tracking-wider font-semibold">
                  LIVE FPS
                </span>
                <span className="text-xl font-extrabold tracking-tight">
                  {fps} <span className="text-[10px] font-normal text-white/60">FPS</span>
                </span>
              </div>

              {/* Frame Time Box */}
              <div className="flex flex-col p-2 rounded-lg border border-white/10 bg-white/5 text-white/90">
                <span className="text-[9px] text-white/60 uppercase tracking-wider font-semibold">
                  FRAME TIME
                </span>
                <span className="text-xl font-extrabold tracking-tight">
                  {frameTime} <span className="text-[10px] font-normal text-white/60">ms</span>
                </span>
              </div>
            </div>

            {/* Status & Active Section */}
            <div className="flex items-center justify-between text-[9px] text-white/60 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">
              <span className="truncate">SEC: <strong className="text-white uppercase">{activeSection || "HOME"}</strong></span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? "bg-emerald-400 animate-ping" : "bg-rose-400"}`} />
                {isRecording ? "REC" : "PAUSED"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              {isRecording ? (
                <button
                  onClick={handleStopAndReport}
                  data-cursor="stop report"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 py-1.5 px-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>STOP & REPORT</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsRecording(true)}
                  data-cursor="resume rec"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 py-1.5 px-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>RESUME</span>
                </button>
              )}

              <button
                onClick={handleReset}
                data-cursor="reset stats"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer shrink-0"
                title="Reset Counters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Performance Diagnostic Report Modal Overlay */}
      {showReportModal && report && (
        <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 font-mono select-none overflow-y-auto">
          <div className="bg-[#0e0e14] border border-[#c5a880]/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-[0_0_80px_rgba(0,0,0,0.9)] relative flex flex-col gap-6 my-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowReportModal(false)}
              data-cursor="close report"
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#c5a880]" />
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#c5a880] uppercase">
                  VISIONATRIX // DIAGNOSTIC AUDIT
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold tracking-wide uppercase text-white">
                PERFORMANCE REPORT
              </h3>
              <p className="text-xs text-white/60 font-sans">
                Captured {report.totalFrames} telemetry frame samples across {report.durationSeconds}s runtime session.
              </p>
            </div>

            {/* Health Score Metric Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Overall Score */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold">HEALTH SCORE</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className={`text-3xl font-extrabold ${report.healthScore >= 80 ? "text-emerald-400" : report.healthScore >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                    {report.healthScore}
                  </span>
                  <span className="text-xs text-white/40">/ 100</span>
                </div>
              </div>

              {/* Avg FPS */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold">AVERAGE FPS</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-white">{report.avgFps}</span>
                  <span className="text-xs text-white/50">FPS</span>
                </div>
              </div>

              {/* Min / Max Range */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold">MIN / MAX RANGE</span>
                <div className="flex items-baseline gap-2 mt-2 text-sm font-bold">
                  <span className="text-rose-400">MIN: {report.minFps} FPS</span>
                  <span className="text-white/20">|</span>
                  <span className="text-emerald-400">MAX: {report.maxFps} FPS</span>
                </div>
              </div>
            </div>

            {/* Bottleneck Diagnostic Findings */}
            <div className="flex flex-col gap-2 bg-black/40 border border-white/10 p-4 rounded-xl">
              <span className="text-[10px] font-bold tracking-widest text-[#c5a880] uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                BOTTLENECK FINDINGS & ANALYSIS
              </span>
              <ul className="flex flex-col gap-2 mt-1 text-xs font-sans text-white/90">
                {report.bottleneckSummary.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white/5 p-2.5 rounded border border-white/5">
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section by Section Breakdown Table */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">
                SECTION PERFORMANCE BREAKDOWN
              </span>
              <div className="border border-white/10 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-4 bg-white/10 p-2.5 font-bold text-white/80 text-[10px] tracking-wider uppercase">
                  <span>SECTION</span>
                  <span>SAMPLES</span>
                  <span>AVG FPS</span>
                  <span>MIN FPS</span>
                </div>
                <div className="divide-y divide-white/5 bg-black/20">
                  {Object.entries(report.sectionBreakdown).map(([secName, data]) => (
                    <div key={secName} className="grid grid-cols-4 p-2.5 font-mono text-[11px] items-center">
                      <span className="font-bold text-[#c5a880] uppercase">#{secName}</span>
                      <span className="text-white/70">{data.samples}</span>
                      <span className={`font-bold ${data.avgFps >= 55 ? "text-emerald-400" : data.avgFps >= 35 ? "text-amber-400" : "text-rose-400"}`}>
                        {data.avgFps} FPS
                      </span>
                      <span className="text-white/60">{data.minFps} FPS</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Control */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                data-cursor="reset & resume"
                className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#b0926a] text-black font-bold rounded-lg text-xs tracking-wider uppercase transition-all cursor-pointer"
              >
                RESET TELEMETRY & RESUME
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
