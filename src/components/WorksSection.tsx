"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, ChevronLeft, ChevronRight, ExternalLink, Grid, ArrowRight, Eye, Layers, Globe, Monitor, Smartphone, RefreshCw, Lock, Maximize2, Minimize2, Share2, RotateCcw, Compass, Tablet, Minus } from "lucide-react";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAdmin, Project } from "@/context/AdminContext";

// Minimal Compact Card for Marquee Rows
function MarqueeProjectCard({ 
  project, 
  onOpenDetails 
}: { 
  project: Project; 
  onOpenDetails: (p: Project) => void 
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const livePreviewUrl = project.details?.liveUrl 
    ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(project.details.liveUrl)}?w=1280&h=800`
    : null;
  const displayImage = project.image || livePreviewUrl;

  const categoryTags = project.categories && project.categories.length > 0 
    ? project.categories 
    : [project.category];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -6; // 6deg tilt
    const rotateY = ((x - centerX) / centerX) * 6;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setSpotlightPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onOpenDetails(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, transition: "transform 0.15s ease-out" }}
      className="group relative flex-shrink-0 w-[320px] sm:w-[420px] aspect-[16/10] rounded-[24px] overflow-hidden cursor-pointer bg-[#0e0e14] border border-white/10 shadow-2xl p-2.5 hover:border-[#c5a880]/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] select-none will-change-transform transform-gpu"
    >
      {/* Dynamic Cursor Spotlight Highlight */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px] z-30"
        style={{
          background: `radial-gradient(400px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(197, 168, 128, 0.15), transparent 80%)`
        }}
      />

      <div className="w-full h-full relative rounded-[18px] overflow-hidden bg-[#07070b]">
        {/* Real Live Website Page Snapshot / Background Image / Ambient Canvas */}
        {displayImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={displayImage}
            alt={project.title}
            className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={`w-full h-full rounded-[18px] bg-gradient-to-br ${project.bgGradient || "from-slate-900 via-zinc-950 to-[#050507]"} p-6 flex flex-col justify-between relative overflow-hidden border border-white/5`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c5a880]/10 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Top Left Number Pill Badge (Matching Screenshot) */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-black/45 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-white/90 tracking-wider">
              {project.id}
            </span>
          </div>
        </div>

        {/* Bottom Dark Gradient Shadow (Only Bottom 45%) */}
        <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10 pointer-events-none" />

        {/* Bottom Title & Subtitle Info (Matching Screenshot Layout) */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-2 pointer-events-none">
          <h4 className="font-outfit text-lg sm:text-xl font-extrabold tracking-tight text-white uppercase drop-shadow-md truncate">
            {project.title} <span className="text-[#c5a880] font-normal text-sm sm:text-base">— {project.category}</span>
          </h4>

          {/* Category Tag Pills (Matching Screenshot) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categoryTags.map((tag, idx) => (
              <span 
                key={idx}
                className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/20 font-mono text-[9px] text-white/90 font-medium tracking-wide uppercase shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Quick View Hover Indicator Overlay */}
        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/30 backdrop-blur-[2px]">
          <div className="bg-black/90 backdrop-blur-md border border-[#c5a880] px-4 py-2.5 rounded-full flex items-center gap-2 text-[#c5a880] shadow-2xl">
            {project.details?.liveUrl ? (
              <>
                <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-mono text-[9.5px] tracking-widest font-bold uppercase text-white">OPEN SAFARI SANDBOX</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="font-mono text-[9px] tracking-widest font-bold uppercase">VIEW CASE BRIEF</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const getVideoEmbedUrl = (url: string) => {
  if (url.includes("vimeo.com")) {
    const reg = /video\/(\d+)/;
    const match = url.match(reg);
    const id = match ? match[1] : url.split("/").pop()?.split("?")[0];
    return `https://player.vimeo.com/video/${id}?autoplay=1&loop=1&muted=1&background=1&autopause=0`;
  }
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let id = "";
    if (url.includes("youtu.be")) {
      id = url.split("/").pop()?.split("?")[0] || "";
    } else if (url.includes("embed/")) {
      id = url.split("embed/")[1].split("?")[0];
    } else {
      const match = url.match(/[?&]v=([^&#]+)/);
      id = match ? match[1] : "";
    }
    return `https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`;
  }
  return url;
};

export default function WorksSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllDrawer, setShowAllDrawer] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeSlide, setActiveSlide] = useState(0);
  const [liveMode, setLiveMode] = useState(false);
  const [sandboxDevice, setSandboxDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [isSafariExpanded, setIsSafariExpanded] = useState(false);
  const [isSafariMinimized, setIsSafariMinimized] = useState(false);

  const handleOpenProject = (p: Project) => {
    setSelectedProject(p);
    if (p.details?.liveUrl) {
      setLiveMode(true);
      setIsSafariExpanded(true);
    } else {
      setLiveMode(false);
      setIsSafariExpanded(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).lenis?.stop();
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  const { projects, isLoaded } = useAdmin();

  // Divide projects into 3 distinct marquee rows:
  // Row 1: Web & SaaS Platforms
  // Row 2: Video Editing, Reels & UGC Showcase
  // Row 3: Unreal Engine & 3D Automation
  const row1Projects = projects.filter(p => 
    Boolean(p.details?.liveUrl) || 
    p.categories.some(c => ["WEB", "SAAS", "POS", "APP", "DEV", "FULLSTACK"].some(k => c.toUpperCase().includes(k))) ||
    p.category.toUpperCase().includes("WEB") || p.category.toUpperCase().includes("SAAS")
  );

  const row2Projects = projects.filter(p => 
    p.categories.some(c => ["VIDEO", "FILM", "UGC", "REEL", "COMMERCIAL", "MEDIA", "STUDIO", "AD"].some(k => c.toUpperCase().includes(k))) ||
    p.category.toUpperCase().includes("VIDEO") || p.category.toUpperCase().includes("FILM") || p.category.toUpperCase().includes("UGC") || p.category.toUpperCase().includes("REEL")
  );

  const row3Projects = projects.filter(p => 
    p.categories.some(c => ["UNREAL", "CGI", "3D", "VFX", "AUTOMATION", "SPATIAL", "VR", "CONFIGURATOR"].some(k => c.toUpperCase().includes(k))) ||
    p.category.toUpperCase().includes("CGI") || p.category.toUpperCase().includes("VFX") || p.category.toUpperCase().includes("3D") || p.category.toUpperCase().includes("UNREAL") || p.category.toUpperCase().includes("AUTOMATION")
  );

  // Fallbacks if list is small to ensure endless infinite marquee loop
  const list1 = row1Projects.length > 0 ? row1Projects : projects;
  const list2 = row2Projects.length > 0 ? row2Projects : projects;
  const list3 = row3Projects.length > 0 ? row3Projects : projects;

  const dupRow1 = [...list1, ...list1, ...list1, ...list1];
  const dupRow2 = [...list2, ...list2, ...list2, ...list2];
  const dupRow3 = [...list3, ...list3, ...list3, ...list3];

  const categories = [
    "ALL",
    ...Array.from(new Set(
      projects
        .flatMap(p => p.categories || [])
        .map(cat => cat.toUpperCase().trim())
        .filter(Boolean)
    ))
  ];

  const filteredProjects = activeCategory === "ALL" 
    ? projects 
    : projects.filter(p => p.categories.includes(activeCategory));

  // Ultra-Smooth 120FPS Hardware-Accelerated GSAP Scroll Velocity Controller
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    let targetVelocity = 0;
    let currentVelocity = 0;

    let x1 = 0;
    let x2 = -1200;
    let x3 = 0;

    // Measure page scroll velocity seamlessly
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        targetVelocity = self.getVelocity() * 0.035;
      }
    });

    // Hardware GPU Ticker running on requestAnimationFrame (60-120FPS)
    const updateTicker = (_time: number, deltaTime: number) => {
      // Smooth lerp velocity dampening
      currentVelocity += (targetVelocity - currentVelocity) * 0.08;
      targetVelocity *= 0.92;

      const delta = (deltaTime / 16) * 0.85;
      const move = (0.8 + Math.abs(currentVelocity)) * delta;
      const dir = currentVelocity < 0 ? -1 : 1;

      // Update marquee positions
      x1 -= move * (dir > 0 ? 1 : 0.7);
      x2 += move * 0.85 * (dir > 0 ? 1 : 0.7);
      x3 -= move * 1.1 * (dir > 0 ? 1 : 0.7);

      // Infinite loop wrap threshold
      const wrapX = 2200;
      if (Math.abs(x1) >= wrapX) x1 = 0;
      if (x2 >= 0) x2 = -wrapX;
      if (Math.abs(x3) >= wrapX) x3 = 0;

      if (row1Ref.current) gsap.set(row1Ref.current, { x: x1, force3D: true });
      if (row2Ref.current) gsap.set(row2Ref.current, { x: x2, force3D: true });
      if (row3Ref.current) gsap.set(row3Ref.current, { x: x3, force3D: true });
    };

    gsap.ticker.add(updateTicker);

    return () => {
      st.kill();
      gsap.ticker.remove(updateTicker);
    };
  }, [projects.length]);

  return (
    <section 
      ref={sectionRef}
      id="works" 
      className="relative w-full bg-[#0b0b0f] overflow-hidden py-24 md:py-32"
    >
      {/* Background Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[10%] top-[15%] w-[40vw] h-[40vw] bg-[#c5a880]/[0.015] blur-[170px] rounded-full" />
        <div className="absolute left-[5%] bottom-[15%] w-[45vw] h-[45vw] bg-[#c5a880]/[0.01] blur-[200px] rounded-full" />
      </div>

      <ScrollAnimatedWrapper enableY={false} enableScale={false} className="w-full flex flex-col gap-12">
        
        {/* Clean Header Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-[#c5a880] uppercase font-bold">
              SELECTED WORKS // CREATIVE SHOWCASE
            </span>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.06em] text-white uppercase leading-none">
              FEATURED PROJECTS
            </h2>
            <p className="text-xs md:text-sm text-[#9999aa] leading-relaxed mt-1 font-sans">
              Explore our organized portfolio featuring 3 dedicated showcases: Live Web & SaaS Apps, Video Editing & UGC Ads, and Unreal Engine 5 Automation.
            </p>
          </div>

          {/* Action Trigger Button: VIEW ALL PROJECTS */}
          <button
            onClick={() => {
              setShowAllDrawer(true);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).lenis?.stop();
            }}
            className="group flex items-center gap-3 px-6 py-3.5 bg-[#c5a880] hover:bg-[#b0926a] text-black rounded-xl font-outfit text-xs font-bold tracking-[0.18em] transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(197,168,128,0.3)] shrink-0 cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            <span>VIEW ALL PROJECTS ({projects.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3 CATEGORIZED SHOWCASE ROWS */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full flex flex-col gap-10 overflow-hidden py-4 z-10">
          
          {/* ROW 1: 🌐 WEB & SAAS PLATFORMS */}
          <div className="w-full flex flex-col gap-4">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-emerald-400 uppercase font-bold">
                ROW 01 // 🌐 WEB & SAAS PLATFORMS (SAFARI SANDBOX READY)
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
            </div>

            <div className="w-full overflow-hidden flex items-center">
              <div ref={row1Ref} className="flex gap-6 md:gap-8 w-max will-change-transform">
                {dupRow1.map((project, idx) => (
                  <MarqueeProjectCard
                    key={`r1-${project.id}-${idx}`}
                    project={project}
                    onOpenDetails={handleOpenProject}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ROW 2: 🎬 VIDEO EDITING, REELS & UGC SHOWCASE */}
          <div className="w-full flex flex-col gap-4">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#c5a880] shadow-[0_0_8px_#c5a880]" />
              <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-[#c5a880] uppercase font-bold">
                ROW 02 // 🎬 VIDEO EDITING, REELS & UGC SHOWCASE
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#c5a880]/30 to-transparent" />
            </div>

            <div className="w-full overflow-hidden flex items-center">
              <div ref={row2Ref} className="flex gap-6 md:gap-8 w-max will-change-transform">
                {dupRow2.map((project, idx) => (
                  <MarqueeProjectCard
                    key={`r2-${project.id}-${idx}`}
                    project={project}
                    onOpenDetails={handleOpenProject}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3: ⚡ UNREAL ENGINE & 3D AUTOMATION */}
          <div className="w-full flex flex-col gap-4">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-bold">
                ROW 03 // ⚡ UNREAL ENGINE & 3D AUTOMATION
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
            </div>

            <div className="w-full overflow-hidden flex items-center">
              <div ref={row3Ref} className="flex gap-6 md:gap-8 w-max will-change-transform">
                {dupRow3.map((project, idx) => (
                  <MarqueeProjectCard
                    key={`r3-${project.id}-${idx}`}
                    project={project}
                    onOpenDetails={handleOpenProject}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA to Open View All Projects Grid */}
        <div className="flex justify-center items-center z-10 pt-4">
          <button
            onClick={() => {
              setShowAllDrawer(true);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).lenis?.stop();
            }}
            className="font-mono text-xs text-[#c5a880] hover:text-white tracking-[0.2em] uppercase flex items-center gap-2.5 transition-colors duration-300 border-b border-[#c5a880]/40 hover:border-white pb-1 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>EXPLORE ALL {projects.length} PROJECTS BY CATEGORY</span>
            <span>→</span>
          </button>
        </div>

      </ScrollAnimatedWrapper>

      {/* ------------------------------------------------------------- */}
      {/* EXPANDED "VIEW ALL PROJECTS" DRAWER MODAL */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {showAllDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[11000] bg-black/95 backdrop-blur-2xl overflow-y-auto p-6 md:p-12 lg:p-16 flex flex-col gap-10"
          >
            {/* Header Controls */}
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#c5a880] uppercase font-bold">
                  PROJECT DIRECTORY
                </span>
                <h3 className="font-display text-2xl md:text-4xl font-bold tracking-[0.06em] text-white uppercase">
                  ALL PROJECTS ARCHIVE ({filteredProjects.length})
                </h3>
              </div>

              <button
                onClick={() => {
                  setShowAllDrawer(false);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (window as any).lenis?.start();
                }}
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                aria-label="Close directory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="max-w-7xl mx-auto w-full flex flex-wrap gap-3 font-mono text-[9px] md:text-[10px] tracking-[0.2em] font-medium text-white/50">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full border cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? "bg-[#c5a880] text-black border-[#c5a880] font-bold shadow-md" 
                        : "bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Grid of Filtered Projects */}
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => {
                const livePreviewUrl = project.details?.liveUrl 
                  ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(project.details.liveUrl)}?w=1280&h=800`
                  : null;
                const displayImage = project.image || livePreviewUrl;

                return (
                  <div
                    key={`all-${project.id}`}
                    onClick={() => handleOpenProject(project)}
                    className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer bg-[#09090d] border border-white/10 shadow-2xl p-3 transition-all duration-500 hover:border-[#c5a880]/60 hover:shadow-[0_0_30px_rgba(197,168,128,0.2)]"
                  >
                    {displayImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={displayImage}
                        alt={project.title}
                        className="w-full h-full object-cover object-top rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`w-full h-full rounded-xl bg-gradient-to-br ${project.bgGradient || "from-slate-900 via-zinc-950 to-[#050507]"} p-6 flex flex-col justify-between relative overflow-hidden border border-white/5 group-hover:border-[#c5a880]/30 transition-all`}>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c5a880]/10 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                      </div>
                    )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent rounded-2xl pointer-events-none" />

                  <div className="absolute top-5 left-5 z-20 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                    <span className="font-mono text-[8.5px] text-white font-bold tracking-[0.2em] uppercase">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-1 pointer-events-none">
                    <span className="font-mono text-[8.5px] tracking-[0.25em] text-[#c5a880] uppercase font-bold">
                      {project.subtitle} • {project.year}
                    </span>
                    <h4 className="font-outfit text-lg font-bold tracking-[0.05em] text-white uppercase group-hover:text-[#c5a880] transition-colors duration-300">
                      {project.title}
                    </h4>
                  </div>
                </div>
              );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* CASE STUDY BRIEFCASE MODAL OVERLAY */}
      {/* ------------------------------------------------------------- */}
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
                            setSelectedProject(null);
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

                      {/* Nav Controls */}
                      <div className="hidden sm:flex items-center gap-1.5 text-white/30 border-l border-white/10 pl-3">
                        <ChevronLeft className="w-4 h-4 cursor-not-allowed" />
                        <ChevronRight className="w-4 h-4 cursor-not-allowed" />
                        <button
                          type="button"
                          onClick={() => setIframeKey(k => k + 1)}
                          className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer ml-1"
                          title="Reload Page"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Showcase Mode Switcher (Media vs Live Site) */}
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
                    <div className="flex-1 max-w-lg mx-2 bg-black/80 border border-white/10 hover:border-[#c5a880]/50 rounded-xl py-1.5 px-3.5 flex items-center justify-between gap-2 shadow-inner transition-colors">
                      <div className="flex items-center gap-2 text-white/80 font-mono text-[10px] truncate">
                        <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-[#c5a880] font-bold">https://</span>
                        <span className="truncate text-white/90 font-medium">
                          {selectedProject.details?.liveUrl ? selectedProject.details.liveUrl.replace(/^https?:\/\//, '') : `${selectedProject.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.visionatrix.com`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIframeKey(k => k + 1)}
                        className="text-white/40 hover:text-white transition-colors"
                        title="Reload"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
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
                          href={selectedProject.details.liveUrl!}
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
                          setSelectedProject(null);
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
                    <div className="w-full h-full relative flex items-center justify-center p-2 sm:p-4">
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

                        <iframe
                          key={`split-sandbox-iframe-${iframeKey}-${sandboxDevice}`}
                          src={selectedProject.details.liveUrl}
                          title={`${selectedProject.title} Apple Safari Sandbox`}
                          className="w-full flex-1 border-0 bg-black rounded-b-[30px]"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        />

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
                      
                      <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
                        {selectedProject.details?.videoUrl ? (
                          selectedProject.details.videoUrl.includes("vimeo.com") || selectedProject.details.videoUrl.includes("youtube.com") || selectedProject.details.videoUrl.includes("youtu.be") ? (
                            <iframe
                              src={getVideoEmbedUrl(selectedProject.details.videoUrl)}
                              className="w-full h-full border-0 aspect-video pointer-events-none scale-[1.02]"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                              title={selectedProject.title}
                            />
                          ) : (
                            <video
                              src={selectedProject.details.videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
                            />
                          )
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={selectedProject.image}
                            alt={selectedProject.title}
                            className="w-full h-full object-cover opacity-85 transition-all duration-300"
                          />
                        )}
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

                    {/* Specification Metrics */}
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[9px] tracking-[0.2em] text-[#666677] uppercase font-bold flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>PERFORMANCE SPECS</span>
                      </span>
                      
                      <div className="flex flex-col gap-2">
                        {selectedProject.metrics.map((metric, index) => (
                          <div key={index} className="bg-white/[0.02] border border-white/5 rounded-lg p-3 flex justify-between items-center">
                            <span className="font-mono text-[8.5px] tracking-wider text-[#9999aa] uppercase">{metric.label}</span>
                            <span className="font-mono text-xs text-[#c5a880] font-bold">{metric.value}</span>
                          </div>
                        ))}
                      </div>
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
                          setSelectedProject(null);
                          setShowAllDrawer(false);
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (window as any).lenis?.start();
                        }}
                        className="flex-1 text-center py-2.5 border border-white/10 hover:border-white/30 text-[#c5a880] hover:text-white font-mono text-[9.5px] tracking-wider uppercase rounded-xl transition-colors"
                      >
                        START PROJECT
                      </a>
                      <button
                        onClick={() => {
                          setSelectedProject(null);
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
                      <ChevronLeft className="w-4 h-4 cursor-not-allowed" />
                      <ChevronRight className="w-4 h-4 cursor-not-allowed" />
                      <button
                        type="button"
                        onClick={() => setIframeKey(k => k + 1)}
                        className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer ml-1"
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
    </section>
  );
}
