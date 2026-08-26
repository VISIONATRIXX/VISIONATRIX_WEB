"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Globe, 
  Monitor, 
  Smartphone, 
  RefreshCw, 
  Lock, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Tablet, 
  Minus 
} from "lucide-react";
import { Project } from "@/context/AdminContext";
import { getProjectVideoUrl, getVideoEmbedUrl } from "@/utils/media";

interface SafariSandboxModalProps {
  selectedProject: Project | null;
  projects: Project[];
  liveMode: boolean;
  setLiveMode: (val: boolean) => void;
  sandboxDevice: "desktop" | "tablet" | "mobile";
  setSandboxDevice: (val: "desktop" | "tablet" | "mobile") => void;
  iframeKey: number;
  setIframeKey: React.Dispatch<React.SetStateAction<number>>;
  isSafariExpanded: boolean;
  setIsSafariExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isSafariMinimized: boolean;
  setIsSafariMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  showAllDrawer: boolean;
}

export default function SafariSandboxModal({
  selectedProject,
  projects,
  liveMode,
  setLiveMode,
  sandboxDevice,
  setSandboxDevice,
  iframeKey,
  setIframeKey,
  isSafariExpanded,
  setIsSafariExpanded,
  isSafariMinimized,
  setIsSafariMinimized,
  onClose,
  onSelectProject,
  showAllDrawer
}: SafariSandboxModalProps) {
  const [isMetadataVertical, setIsMetadataVertical] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setIsMetadataVertical(false);
  }, [selectedProject?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;

      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        activeEl.getAttribute("contenteditable") === "true"
      );

      if (isInput) return;

      if (e.code === "Space" || e.key === " ") {
        // Prevent default spacebar scrolling
        e.preventDefault();

        const video = videoRef.current;
        if (video) {
          if (video.paused) {
            video.play().catch(err => console.log("Play failed:", err));
          } else {
            video.pause();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  const isVerticalCategory = selectedProject?.category?.toUpperCase() === "AI SHOOTS" || 
    (selectedProject?.categories || []).some(c => ["AI SHOOTS", "UGC", "VERTICAL", "MOBILE"].includes(c.toUpperCase()));
  const isVertical = isVerticalCategory || isMetadataVertical;

  return (
    <>
      {/* CASE STUDY BRIEFCASE MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/98 p-4 md:p-6"
            style={{ willChange: "opacity" }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="w-[95vw] max-w-[1550px] h-[92vh] max-h-[92vh] bg-[#07070b] border border-[#c5a880]/30 rounded-2xl relative shadow-[0_30px_100px_rgba(0,0,0,0.98)] flex flex-col overflow-hidden font-sans"
            >
              {/* Apple macOS Safari Header Bar (Full Width Top) */}
              {(() => {
                const hasLiveSite = Boolean(selectedProject.details?.liveUrl);

                return (
                  <div className="bg-[#121219] border-b border-white/10 px-5 py-3 flex items-center justify-between gap-4 shrink-0 shadow-2xl z-30 select-none">
                    {/* Left: Traffic Lights & Mode Toggle */}
                    <div className="flex items-center gap-4 shrink-0">
                      {/* Apple Window Traffic Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            if (!showAllDrawer) {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              (window as any).lenis?.start();
                            }
                          }}
                          className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] hover:bg-[#ff3b30] flex items-center justify-center text-black font-bold transition-all cursor-pointer shadow-[0_0_8px_rgba(255,95,86,0.5)]"
                          title="Close Window"
                        >
                          <X className="w-2.5 h-2.5 opacity-0 hover:opacity-100" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSafariMinimized(!isSafariMinimized)}
                          className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] hover:bg-[#ffcc00] flex items-center justify-center text-black font-bold transition-all cursor-pointer shadow-[0_0_8px_rgba(255,189,46,0.5)]"
                          title="Minimize Window"
                        >
                          <Minus className="w-2.5 h-2.5 opacity-0 hover:opacity-100" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSafariExpanded(true)}
                          className="w-3.5 h-3.5 rounded-full bg-[#27C93F] hover:bg-[#34c759] flex items-center justify-center text-black font-bold transition-all cursor-pointer shadow-[0_0_8px_rgba(39,201,63,0.5)]"
                          title="Fullscreen Sandbox"
                        >
                          <Maximize2 className="w-2 h-2 opacity-0 hover:opacity-100" />
                        </button>
                      </div>

                      {/* Nav Controls & Keyboard Shortcuts */}
                      <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
                              const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
                              onSelectProject(projects[prevIndex]);
                            }}
                            className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
                            title="Previous Project (← Arrow)"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
                              const nextIndex = (currentIndex + 1) % projects.length;
                              onSelectProject(projects[nextIndex]);
                            }}
                            className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
                            title="Next Project (→ Arrow)"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setIframeKey(k => k + 1)}
                            className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                            title="Reload Page (R)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Apple Keyboard Shortcut Badge */}
                        <div className="hidden xl:flex items-center gap-1.5 bg-black/60 border border-white/15 px-2.5 py-1 rounded-md text-[8.5px] font-mono text-white/60">
                          <span className="bg-white/10 px-1 py-0.2 rounded text-white font-bold">ESC</span>
                          <span>EXIT</span>
                          <span className="text-white/20">•</span>
                          <span className="bg-white/10 px-1 py-0.2 rounded text-white font-bold">← / →</span>
                          <span>NAV</span>
                        </div>
                      </div>

                      {/* Showcase Mode Switcher */}
                      {hasLiveSite && (
                        <div className="flex bg-black/60 p-0.5 rounded-lg border border-white/10 ml-2">
                          <button
                            type="button"
                            onClick={() => setLiveMode(false)}
                            className={`px-3 py-1 rounded text-[9px] font-mono tracking-wider font-bold transition-all uppercase cursor-pointer ${
                              !liveMode ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                            }`}
                          >
                            MEDIA BRIEF
                          </button>
                          <button
                            type="button"
                            onClick={() => setLiveMode(true)}
                            className={`px-3 py-1 rounded text-[9px] font-mono tracking-wider font-bold transition-all uppercase flex items-center gap-1.5 cursor-pointer ${
                              liveMode ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>LIVE SANDBOX</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Center: Apple Safari Address Bar */}
                    <div className="flex-1 max-w-xl mx-2 bg-[#0a0a10] border border-white/15 hover:border-[#c5a880]/60 rounded-xl py-1.5 px-4 flex items-center justify-between gap-3 shadow-inner transition-colors">
                      <div className="flex items-center gap-2.5 text-white/90 font-mono text-[10.5px] truncate">
                        <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-[#c5a880] font-bold">https://</span>
                        <span className="truncate text-white font-bold tracking-wide">
                          {selectedProject.details?.liveUrl ? selectedProject.details.liveUrl.replace(/^https?:\/\//, '') : `${selectedProject.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.visionatrix.online`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-flex text-[8px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                          256-BIT SSL 🟢
                        </span>
                        <button
                          type="button"
                          onClick={() => setIframeKey(k => k + 1)}
                          className="text-white/50 hover:text-white transition-colors p-1"
                          title="Refresh Sandbox Page"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Right: Device Selector & Close Button */}
                    <div className="flex items-center gap-3 shrink-0">
                      {hasLiveSite && liveMode && (
                        <div className="hidden sm:flex bg-black/60 p-0.5 rounded-lg border border-white/10">
                          <button
                            type="button"
                            onClick={() => setSandboxDevice("desktop")}
                            className={`p-1.5 rounded transition-all cursor-pointer ${
                              sandboxDevice === "desktop" ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                            }`}
                            title="MacBook Desktop View"
                          >
                            <Monitor className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSandboxDevice("tablet")}
                            className={`p-1.5 rounded transition-all cursor-pointer ${
                              sandboxDevice === "tablet" ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                            }`}
                            title="iPad Pro View"
                          >
                            <Tablet className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSandboxDevice("mobile")}
                            className={`p-1.5 rounded transition-all cursor-pointer ${
                              sandboxDevice === "mobile" ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                            }`}
                            title="iPhone 16 Pro View"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {hasLiveSite && (
                        <a
                          href={selectedProject.details?.liveUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hidden md:flex items-center gap-1.5 text-[#c5a880] hover:text-white transition-colors bg-[#c5a880]/15 px-3 py-1.5 rounded-lg border border-[#c5a880]/30 font-bold text-[9.5px] font-mono uppercase"
                        >
                          <span>LAUNCH TAB</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        onClick={() => {
                          onClose();
                          if (!showAllDrawer) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (window as any).lenis?.start();
                          }
                        }}
                        className="text-white/40 hover:text-white transition-colors p-1"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Main Body Split Panel (Left Canvas + Right Details Sidebar) */}
              <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative">
                
                {/* LEFT MAIN CANVAS: Entire Interactive Sandbox or Media Carousel */}
                <div className="flex-1 h-full relative bg-[#040407] flex items-center justify-center overflow-hidden">
                  {liveMode && selectedProject.details?.liveUrl ? (
                    /* Interactive Apple macOS Safari Sandbox Container */
                    <div className="w-full h-full relative flex items-center justify-center p-2 sm:p-4 sandbox-iframe-container">
                      <div 
                        className={`h-full transition-all duration-500 ease-out relative flex flex-col items-center justify-center ${
                          sandboxDevice === "desktop"
                            ? "w-full rounded-none"
                            : sandboxDevice === "tablet"
                            ? "w-[840px] max-w-full rounded-2xl border-[6px] border-[#1e1e28] shadow-[0_0_80px_rgba(0,0,0,0.95)]"
                            : "w-[360px] max-w-full rounded-[40px] border-[6px] border-[#1a1a24] shadow-[0_0_70px_rgba(197,168,128,0.25)]"
                        }`}
                      >
                        {sandboxDevice === "mobile" && (
                          <div className="w-full bg-[#1a1a24] py-1 flex justify-center shrink-0 rounded-t-[34px]">
                            <div className="w-24 h-3.5 bg-black rounded-full flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-zinc-800" />
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
                            </div>
                          </div>
                        )}

                        {(() => {
                          const rawLiveUrl = selectedProject.details?.liveUrl?.trim();
                          const targetLiveUrl = rawLiveUrl ? (rawLiveUrl.startsWith("http") ? rawLiveUrl : `https://${rawLiveUrl}`) : "";

                          if (!targetLiveUrl) {
                            return (
                              <div className="w-full flex-1 bg-[#09090d] flex flex-col items-center justify-center p-6 text-center rounded-b-[30px] border border-white/5">
                                <div className="w-12 h-12 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 flex items-center justify-center mb-3">
                                  <Globe className="w-6 h-6 text-[#c5a880]" />
                                </div>
                                <h4 className="font-outfit text-sm font-bold text-white uppercase tracking-wider mb-1">
                                  NO LIVE DEPLOYMENT URL CONFIGURED
                                </h4>
                                <p className="font-sans text-xs text-white/50 max-w-xs mb-4">
                                  Add a Live Website Deployment URL in the Admin Panel to enable interactive Safari Sandbox preview.
                                </p>
                              </div>
                            );
                          }

                          return (
                            <iframe
                              key={`split-sandbox-iframe-${iframeKey}-${sandboxDevice}`}
                              src={targetLiveUrl}
                              title={`${selectedProject.title} Apple Safari Sandbox`}
                              className="w-full flex-1 border-0 bg-black rounded-b-[30px]"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          );
                        })()}

                        {sandboxDevice === "mobile" && (
                          <div className="w-full bg-[#1a1a24] py-1.5 flex justify-center shrink-0 rounded-b-[34px]">
                            <div className="w-28 h-1 bg-white/40 rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Standard Media Carousel Showcase */
                    <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
                      <div className={`absolute inset-0 bg-gradient-to-tr ${selectedProject.bgGradient} opacity-30 z-0`} />
                      
                      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center overflow-hidden">
                        {(() => {
                          const videoUrl = getProjectVideoUrl(selectedProject);
                          if (videoUrl) {
                            const isEmbed = videoUrl.includes("vimeo.com") || videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

                            if (isVertical) {
                              return (
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                  {/* Ambient blurred glow background */}
                                  {isEmbed ? (
                                    <iframe
                                      src={getVideoEmbedUrl(videoUrl)}
                                      className="absolute inset-0 w-full h-full border-0 object-cover scale-[1.4] blur-3xl opacity-25 select-none pointer-events-none"
                                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                      title={`${selectedProject.title} Blur Background`}
                                    />
                                  ) : (
                                    <video
                                      src={videoUrl}
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-125 select-none pointer-events-none"
                                    />
                                  )}

                                  {/* Center Luxury Frame holding the vertical video */}
                                  <div className="relative aspect-[9/16] h-[82vh] max-h-[690px] max-w-[90%] md:max-w-[390px] border border-[#c5a880]/30 rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.95)] bg-black z-10">
                                    {isEmbed ? (
                                      <iframe
                                        src={getVideoEmbedUrl(videoUrl)}
                                        className="w-full h-full border-0 scale-[1.01]"
                                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                        allowFullScreen
                                        title={selectedProject.title}
                                      />
                                    ) : (
                                      <video
                                        ref={videoRef}
                                        src={videoUrl}
                                        autoPlay
                                        loop
                                        playsInline
                                        controls
                                        onLoadedMetadata={(e) => {
                                          const video = e.currentTarget;
                                          if (video.videoWidth < video.videoHeight) {
                                            setIsMetadataVertical(true);
                                          }
                                        }}
                                        className="w-full h-full object-cover relative z-10"
                                      />
                                    )}
                                  </div>
                                </div>
                              );
                            }

                            // Standard landscape video view with ambient glow background & perfect aspect fit
                            return (
                              <div className="relative w-full h-full flex items-center justify-center p-4">
                                {/* Ambient blurred glow background */}
                                {isEmbed ? (
                                  <iframe
                                    src={getVideoEmbedUrl(videoUrl)}
                                    className="absolute inset-0 w-full h-full border-0 object-cover scale-[1.4] blur-3xl opacity-25 select-none pointer-events-none"
                                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                    title={`${selectedProject.title} Landscape Blur`}
                                  />
                                ) : (
                                  <video
                                    src={videoUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-125 select-none pointer-events-none"
                                  />
                                )}

                                {/* Centered perfectly fitting landscape frame */}
                                <div className="relative aspect-video w-full max-w-[95%] md:max-w-[1000px] max-h-[80vh] border border-[#c5a880]/30 rounded-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] bg-black z-10">
                                  {isEmbed ? (
                                    <iframe
                                      src={getVideoEmbedUrl(videoUrl)}
                                      className="w-full h-full border-0 scale-[1.01]"
                                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                      allowFullScreen
                                      title={selectedProject.title}
                                    />
                                  ) : (
                                    <video
                                      ref={videoRef}
                                      src={videoUrl}
                                      autoPlay
                                      loop
                                      playsInline
                                      controls
                                      onLoadedMetadata={(e) => {
                                        const video = e.currentTarget;
                                        if (video.videoWidth < video.videoHeight) {
                                          setIsMetadataVertical(true);
                                        }
                                      }}
                                      className="w-full h-full object-contain relative z-10"
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={selectedProject.image}
                              alt={selectedProject.title}
                              className="w-full h-full object-cover opacity-85 transition-all duration-300"
                            />
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT SIDEBAR: Project Specs & Editorial Details Drawer */}
                <div 
                  data-lenis-prevent
                  className="w-full lg:w-[400px] xl:w-[440px] bg-[#0c0c12] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between p-6 lg:p-8 overflow-y-auto scrollbar-thin shrink-0 select-text"
                >
                  <div className="flex flex-col gap-6">
                    {/* Header Badge & Title */}
                    <div className="flex flex-col gap-2.5 border-b border-white/10 pb-5">
                      <span className="font-mono text-[9px] tracking-[0.25em] text-[#c5a880] uppercase font-bold">
                        {selectedProject.category}
                      </span>
                      <h3 className="font-outfit text-2xl lg:text-3xl font-extrabold tracking-[0.04em] text-white uppercase leading-tight">
                        {selectedProject.title}
                      </h3>
                      <p className="font-mono text-[10px] text-white/70 italic leading-relaxed border-l-2 border-[#c5a880] pl-3 py-1 mt-1">
                        &ldquo;{selectedProject.tagline}&rdquo;
                      </p>
                    </div>

                    {/* Credentials Matrix Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-b border-white/10 pb-6 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <span className="text-[#666677] text-[8.5px] tracking-widest uppercase font-bold">CLIENT</span>
                        <span className="text-white font-outfit text-xs font-semibold">{selectedProject.details?.client || "Visionatrix Client"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[#666677] text-[8.5px] tracking-widest uppercase font-bold">TIMELINE</span>
                        <span className="text-white font-outfit text-xs font-semibold">{selectedProject.details?.timeline || "Production 2026"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[#666677] text-[8.5px] tracking-widest uppercase font-bold">ROLE</span>
                        <span className="text-white font-outfit text-xs font-semibold">{selectedProject.details?.role || "Full-Stack Dev"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[#666677] text-[8.5px] tracking-widest uppercase font-bold">ENGINE & STACK</span>
                        <span className="text-[#c5a880] font-outfit text-xs font-bold">{selectedProject.details?.engine || "Next.js / WebGL"}</span>
                      </div>
                    </div>

                    {/* Project Overview Paragraph */}
                    <div className="flex flex-col gap-2.5">
                      <span className="font-mono text-[9px] tracking-[0.2em] text-[#666677] uppercase font-bold">PROJECT OVERVIEW</span>
                      <p className="font-sans text-xs text-[#a0a0b0] leading-relaxed font-light">
                        {selectedProject.description}
                      </p>
                    </div>

                    </div>

                  {/* Sidebar Footer Action Buttons */}
                  <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-white/10">
                    {selectedProject.details?.liveUrl && (
                      <a
                        href={selectedProject.details.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-[#c5a880] hover:bg-white text-black font-outfit text-xs font-bold tracking-[0.18em] uppercase rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(197,168,128,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <Globe className="w-4 h-4" />
                        <span>LAUNCH LIVE WEBSITE</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                    )}

                    <div className="flex items-center gap-2">
                      <a
                        href="#contact"
                        onClick={() => {
                          onClose();
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (window as any).lenis?.start();
                        }}
                        className="flex-1 text-center py-2.5 border border-white/10 hover:border-white/30 text-[#c5a880] hover:text-white font-mono text-[9.5px] tracking-wider uppercase rounded-xl transition-colors"
                      >
                        START PROJECT
                      </a>
                      <button
                        onClick={() => {
                          onClose();
                          if (!showAllDrawer) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (window as any).lenis?.start();
                          }
                        }}
                        className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-[9.5px] tracking-wider uppercase rounded-xl border border-white/5 transition-colors cursor-pointer"
                      >
                        CLOSE BRIEF
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Apple macOS Safari Browser Window Sandbox Modal */}
      <AnimatePresence>
        {isSafariExpanded && selectedProject?.details?.liveUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col p-2 sm:p-6 overflow-hidden select-none font-sans"
          >
            <div className="w-full h-full bg-[#0c0c12] border border-[#c5a880]/30 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden relative">
              
              {/* Apple macOS Safari Header */}
              <div className="bg-[#181822] border-b border-white/10 px-5 py-3 flex flex-col gap-2.5 shrink-0 shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  {/* Traffic Lights */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsSafariExpanded(false)}
                      className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] hover:bg-[#ff3b30] flex items-center justify-center text-black/80 font-bold transition-all cursor-pointer shadow-[0_0_8px_rgba(255,95,86,0.5)]"
                      title="Exit Fullscreen"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSafariExpanded(false)}
                      className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] hover:bg-[#ffcc00] flex items-center justify-center text-black/80 font-bold transition-all cursor-pointer shadow-[0_0_8px_rgba(255,189,46,0.5)]"
                      title="Minimize"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSafariExpanded(false)}
                      className="w-3.5 h-3.5 rounded-full bg-[#27C93F] hover:bg-[#34c759] flex items-center justify-center text-black/80 font-bold transition-all cursor-pointer shadow-[0_0_8px_rgba(39,201,63,0.5)]"
                      title="Exit Fullscreen"
                    >
                      <Minimize2 className="w-2.5 h-2.5" />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 ml-3 text-white/40">
                      <button
                        type="button"
                        onClick={() => {
                          const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
                          const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
                          onSelectProject(projects[prevIndex]);
                        }}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Previous Project (← Arrow)"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
                          const nextIndex = (currentIndex + 1) % projects.length;
                          onSelectProject(projects[nextIndex]);
                        }}
                        className="p-1 hover:text-white transition-colors cursor-pointer"
                        title="Next Project (→ Arrow)"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIframeKey(k => k + 1)}
                        className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer ml-1"
                        title="Reload Page (R)"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Safari URL Bar */}
                  <div className="flex-1 max-w-2xl bg-black/80 border border-white/10 hover:border-[#c5a880]/50 rounded-xl py-1.5 px-4 flex items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-2 text-xs font-mono truncate">
                      <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[#c5a880] font-bold">https://</span>
                      <span className="truncate text-white font-medium">{selectedProject.details.liveUrl.replace(/^https?:\/\//, '')}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIframeKey(k => k + 1)}
                        className="text-white/40 hover:text-white transition-colors p-1"
                        title="Reload"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Device Selector & Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex bg-black/60 p-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setSandboxDevice("desktop")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider font-bold transition-all flex items-center gap-1.5 uppercase cursor-pointer ${
                          sandboxDevice === "desktop" ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">MacBook</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSandboxDevice("tablet")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider font-bold transition-all flex items-center gap-1.5 uppercase cursor-pointer ${
                          sandboxDevice === "tablet" ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                        }`}
                      >
                        <Tablet className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">iPad</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSandboxDevice("mobile")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider font-bold transition-all flex items-center gap-1.5 uppercase cursor-pointer ${
                          sandboxDevice === "mobile" ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">iPhone</span>
                      </button>
                    </div>

                    <a
                      href={selectedProject.details.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#c5a880] hover:text-white bg-[#c5a880]/15 px-3 py-1.5 rounded-xl border border-[#c5a880]/30 font-bold text-xs font-mono uppercase transition-colors"
                    >
                      <span>LAUNCH TAB</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Tab Bar */}
                <div className="flex items-center gap-2 pt-1 border-t border-white/5 font-mono text-xs">
                  <div className="bg-[#2a2a38] text-white px-4 py-1 rounded-t-xl border-t border-x border-[#c5a880]/40 flex items-center gap-2 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold tracking-wide uppercase truncate max-w-[280px]">
                      {selectedProject.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fullscreen Sandbox Device Viewport Frame */}
              <div className="flex-1 w-full h-full relative bg-[#040407] flex items-center justify-center p-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out relative flex flex-col items-center justify-center ${
                    sandboxDevice === "desktop"
                      ? "w-full rounded-none"
                      : sandboxDevice === "tablet"
                      ? "w-[920px] max-w-full rounded-2xl border-[6px] border-[#1e1e28] shadow-[0_0_80px_rgba(0,0,0,0.95)]"
                      : "w-[400px] max-w-full rounded-[44px] border-[8px] border-[#1a1a24] shadow-[0_0_80px_rgba(197,168,128,0.3)]"
                  }`}
                >
                  {sandboxDevice === "mobile" && (
                    <div className="w-full bg-[#1a1a24] py-1.5 flex justify-center shrink-0 rounded-t-[36px]">
                      <div className="w-28 h-4 bg-black rounded-full flex items-center justify-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <div className="w-2 h-2 rounded-full bg-blue-950" />
                      </div>
                    </div>
                  )}

                  <iframe
                    key={`fullscreen-sandbox-${iframeKey}-${sandboxDevice}`}
                    src={selectedProject.details.liveUrl}
                    title={`${selectedProject.title} Fullscreen Safari Sandbox`}
                    className="w-full flex-1 border-0 bg-black rounded-b-[32px]"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />

                  {sandboxDevice === "mobile" && (
                    <div className="w-full bg-[#1a1a24] py-2 flex justify-center shrink-0 rounded-b-[36px]">
                      <div className="w-32 h-1 bg-white/40 rounded-full" />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
