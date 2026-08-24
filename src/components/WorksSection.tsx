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
  return (
    <div
      onClick={() => onOpenDetails(project)}
      className="group relative flex-shrink-0 w-[300px] sm:w-[380px] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer bg-[#09090d] border border-white/10 shadow-2xl p-3 transition-all duration-500 hover:border-[#c5a880]/60 hover:shadow-[0_0_30px_rgba(197,168,128,0.2)] select-none"
    >
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover rounded-xl opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 ease-out"
      />

      {/* Gradient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent rounded-2xl pointer-events-none" />

      {/* Top Category Badges */}
      <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5 shadow-md">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880] shadow-[0_0_6px_#c5a880]" />
          <span className="font-mono text-[8.5px] text-white font-bold tracking-[0.2em] uppercase">
            {project.category}
          </span>
        </div>

        {project.details?.liveUrl && (
          <div className="bg-[#c5a880]/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#c5a880]/50 flex items-center gap-1 shadow-[0_0_12px_rgba(197,168,128,0.3)]">
            <Globe className="w-3 h-3 text-[#c5a880]" />
            <span className="font-mono text-[8px] text-[#c5a880] font-bold tracking-widest uppercase">LIVE SITE</span>
          </div>
        )}
      </div>

      {/* Bottom Title & Subtitle Info */}
      <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-1 pointer-events-none">
        <span className="font-mono text-[8.5px] tracking-[0.25em] text-[#c5a880] uppercase font-bold">
          {project.subtitle} • {project.year}
        </span>
        <h4 className="font-outfit text-lg sm:text-xl font-bold tracking-[0.05em] text-white uppercase group-hover:text-[#c5a880] transition-colors duration-300">
          {project.title}
        </h4>
      </div>

      {/* Quick View Hover Indicator */}
      <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-black/85 backdrop-blur-md border border-[#c5a880] px-4 py-2.5 rounded-full flex items-center gap-2 text-[#c5a880] shadow-2xl">
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

  // Divide projects into 3 groups for the 3 marquee rows
  const row1Projects = projects.slice(0, Math.ceil(projects.length / 3));
  const row2Projects = projects.slice(Math.ceil(projects.length / 3), Math.ceil((projects.length * 2) / 3));
  const row3Projects = projects.slice(Math.ceil((projects.length * 2) / 3));

  // If list is small, duplicate for infinite seamless marquee loop
  const dupRow1 = [...row1Projects, ...row1Projects, ...row1Projects, ...row1Projects];
  const dupRow2 = [...row2Projects, ...row2Projects, ...row2Projects, ...row2Projects];
  const dupRow3 = [...row3Projects, ...row3Projects, ...row3Projects, ...row3Projects];

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

  // GSAP ScrollTrigger Scroll-Driven Animation for 3 Rows: Line 1 LEFT, Line 2 RIGHT, Line 3 LEFT
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // Line 1: Scroll Left
    if (row1Ref.current) {
      gsap.to(row1Ref.current, {
        xPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        }
      });
    }

    // Line 2: Scroll Right
    if (row2Ref.current) {
      gsap.fromTo(row2Ref.current,
        { xPercent: -30 },
        {
          xPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          }
        }
      );
    }

    // Line 3: Scroll Left
    if (row3Ref.current) {
      gsap.to(row3Ref.current, {
        xPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
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

      <ScrollAnimatedWrapper enableY={false} enableScale={false} className="w-full flex flex-col gap-16">
        
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
              Explore our interactive portfolio spanning Web GL, AI Automation, Unreal Engine 5, Architectural BIM, and Spatial AR/VR. Hover any project to inspect, or click to view full case details.
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
        {/* 3-ROW INTERACTIVE SCROLL MARQUEE SHOWCASE */}
        {/* Line 1: LEFT | Line 2: RIGHT | Line 3: LEFT */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full flex flex-col gap-6 md:gap-8 overflow-hidden py-4 z-10">
          
          {/* ROW 1: Moves Left ← */}
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

          {/* ROW 2: Moves Right → */}
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

          {/* ROW 3: Moves Left ← */}
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
              {filteredProjects.map((project) => (
                <div
                  key={`all-${project.id}`}
                  onClick={() => handleOpenProject(project)}
                  className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer bg-[#09090d] border border-white/10 shadow-2xl p-3 transition-all duration-500 hover:border-[#c5a880]/60 hover:shadow-[0_0_30px_rgba(197,168,128,0.2)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-xl opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
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
              ))}
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
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="w-full max-w-3xl bg-[#0b0b0f] border border-white/10 rounded-2xl relative shadow-[0_0_80px_rgba(0,0,0,0.8),_0_0_50px_rgba(197,168,128,0.06)] flex flex-col gap-0 overflow-hidden h-[85vh] max-h-[85vh] md:h-[680px] lg:h-[780px]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedProject(null);
                  if (!showAllDrawer) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (window as any).lenis?.start();
                  }
                }}
                className="absolute top-6 right-6 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center cursor-pointer z-50 shadow-lg backdrop-blur-md animate-pulse"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Visual Media Carousel / Interactive Live Site Viewer */}
              {(() => {
                const mediaItems: { type: "video" | "image"; url: string }[] = [];
                if (selectedProject.details?.videoUrl) {
                  mediaItems.push({ type: "video", url: selectedProject.details.videoUrl });
                }
                mediaItems.push({ type: "image", url: selectedProject.image });
                if (selectedProject.details?.images && selectedProject.details.images.length > 0) {
                  selectedProject.details.images.forEach((imgUrl: string) => {
                    if (imgUrl) mediaItems.push({ type: "image", url: imgUrl });
                  });
                }

                const currentMedia = mediaItems[activeSlide] || mediaItems[0];
                const hasLiveSite = Boolean(selectedProject.details?.liveUrl);

                return (
                  <div className="relative w-full aspect-video md:h-[380px] lg:h-[420px] overflow-hidden bg-zinc-950 border-b border-white/10 flex items-center justify-center shrink-0 group">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${selectedProject.bgGradient} opacity-30 z-0`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10 pointer-events-none" />

                    {/* Mode Toggle Pills Header */}
                    {hasLiveSite && (
                      <div className="absolute top-4 left-6 z-30 flex items-center gap-2 bg-black/80 backdrop-blur-md p-1 rounded-full border border-white/15 shadow-xl">
                        <button
                          type="button"
                          onClick={() => setLiveMode(false)}
                          className={`px-3 py-1 rounded-full font-mono text-[9px] tracking-wider font-bold transition-all uppercase cursor-pointer ${
                            !liveMode ? "bg-[#c5a880] text-black shadow-md" : "text-white/50 hover:text-white"
                          }`}
                        >
                          MEDIA SHOWCASE
                        </button>
                        <button
                          type="button"
                          onClick={() => setLiveMode(true)}
                          className={`px-3 py-1 rounded-full font-mono text-[9px] tracking-wider font-bold transition-all uppercase flex items-center gap-1.5 cursor-pointer ${
                            liveMode ? "bg-[#c5a880] text-black shadow-md" : "text-white/50 hover:text-white"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>LIVE WEBSITE PREVIEW</span>
                        </button>
                      </div>
                    )}

                    {/* Live Website Interactive View vs Media View */}
                    {liveMode && hasLiveSite ? (
                      <div className="absolute inset-0 z-20 flex flex-col bg-[#08080c] select-none">
                        {/* Authentic Apple macOS Safari Window Bar Header */}
                        <div className="bg-[#16161d] border-b border-white/10 px-4 py-2.5 flex flex-col gap-2 shrink-0 shadow-2xl">
                          {/* Row 1: Traffic Lights + URL Bar + Viewport Controls + Fullscreen Button */}
                          <div className="flex items-center justify-between gap-3">
                            
                            {/* Apple Window Controls (Red, Yellow, Green Traffic Lights) */}
                            <div className="flex items-center gap-2 shrink-0">
                              {/* Red Close Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setLiveMode(false);
                                  setIsSafariExpanded(false);
                                }}
                                className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] hover:bg-[#ff3b30] flex items-center justify-center text-black/80 transition-all cursor-pointer group shadow-[0_0_8px_rgba(255,95,86,0.4)]"
                                title="Close Safari Sandbox"
                              >
                                <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 font-bold" />
                              </button>

                              {/* Yellow Minimize Button */}
                              <button
                                type="button"
                                onClick={() => setIsSafariMinimized(!isSafariMinimized)}
                                className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] hover:bg-[#ffcc00] flex items-center justify-center text-black/80 transition-all cursor-pointer group shadow-[0_0_8px_rgba(255,189,46,0.4)]"
                                title="Minimize Window"
                              >
                                <Minus className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 font-bold" />
                              </button>

                              {/* Green Expand / Fullscreen Button */}
                              <button
                                type="button"
                                onClick={() => setIsSafariExpanded(!isSafariExpanded)}
                                className="w-3.5 h-3.5 rounded-full bg-[#27C93F] hover:bg-[#34c759] flex items-center justify-center text-black/80 transition-all cursor-pointer group shadow-[0_0_8px_rgba(39,201,63,0.4)]"
                                title={isSafariExpanded ? "Exit Fullscreen" : "Fullscreen Safari Sandbox"}
                              >
                                <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100 font-bold" />
                              </button>

                              {/* Nav Arrows */}
                              <div className="hidden sm:flex items-center gap-1 ml-2 text-white/30">
                                <ChevronLeft className="w-4 h-4 cursor-not-allowed" />
                                <ChevronRight className="w-4 h-4 cursor-not-allowed" />
                                <button
                                  type="button"
                                  onClick={() => setIframeKey(k => k + 1)}
                                  className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer ml-1"
                                  title="Reload Page"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Apple Safari URL Bar */}
                            <div className="flex-1 max-w-xl mx-2 bg-black/75 border border-white/10 hover:border-[#c5a880]/50 rounded-lg py-1.5 px-3 flex items-center justify-between gap-2 shadow-inner transition-colors">
                              <div className="flex items-center gap-2 text-white/80 font-mono text-[10px] truncate">
                                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span className="text-[#c5a880] font-bold">https://</span>
                                <span className="truncate text-white/90">{selectedProject.details.liveUrl?.replace(/^https?:\/\//, '')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-white/40 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setIframeKey(k => k + 1)}
                                  className="hover:text-white transition-colors"
                                  title="Refresh Page"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Apple Device Frame Switcher */}
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex bg-black/60 p-1 rounded-lg border border-white/10">
                                <button
                                  type="button"
                                  onClick={() => setSandboxDevice("desktop")}
                                  className={`px-2 py-1 rounded text-[9px] font-mono tracking-wider font-bold transition-all flex items-center gap-1 uppercase cursor-pointer ${
                                    sandboxDevice === "desktop" ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                                  }`}
                                  title="MacBook Desktop Viewport"
                                >
                                  <Monitor className="w-3.5 h-3.5" />
                                  <span className="hidden md:inline">MacBook</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSandboxDevice("tablet")}
                                  className={`px-2 py-1 rounded text-[9px] font-mono tracking-wider font-bold transition-all flex items-center gap-1 uppercase cursor-pointer ${
                                    sandboxDevice === "tablet" ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                                  }`}
                                  title="iPad Pro Viewport"
                                >
                                  <Tablet className="w-3.5 h-3.5" />
                                  <span className="hidden md:inline">iPad</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSandboxDevice("mobile")}
                                  className={`px-2 py-1 rounded text-[9px] font-mono tracking-wider font-bold transition-all flex items-center gap-1 uppercase cursor-pointer ${
                                    sandboxDevice === "mobile" ? "bg-[#c5a880] text-black shadow-md" : "text-white/40 hover:text-white"
                                  }`}
                                  title="iPhone 16 Pro Viewport"
                                >
                                  <Smartphone className="w-3.5 h-3.5" />
                                  <span className="hidden md:inline">iPhone</span>
                                </button>
                              </div>

                              <a
                                href={selectedProject.details.liveUrl!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden lg:flex items-center gap-1 text-[#c5a880] hover:text-white transition-colors bg-[#c5a880]/15 px-2.5 py-1.5 rounded-lg border border-[#c5a880]/30 font-bold text-[9.5px] font-mono uppercase"
                              >
                                <span>LAUNCH TAB</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          {/* Row 2: Apple Safari Glass Tab Bar */}
                          <div className="flex items-center gap-2 pt-1.5 border-t border-white/5 font-mono text-[9.5px]">
                            <div className="bg-[#242430] text-white px-3 py-1 rounded-t-lg border-t border-x border-[#c5a880]/40 flex items-center gap-2 shadow-md">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="font-bold tracking-wide uppercase truncate max-w-[180px] sm:max-w-[250px]">
                                {selectedProject.title}
                              </span>
                              <X 
                                onClick={() => setLiveMode(false)}
                                className="w-3 h-3 text-white/40 hover:text-white cursor-pointer ml-1" 
                              />
                            </div>
                            <div className="text-white/30 hover:text-white p-1 cursor-pointer transition-colors text-xs font-bold">
                              +
                            </div>
                          </div>
                        </div>

                        {/* Interactive Sandbox Container Frame */}
                        <div className="flex-1 w-full h-full relative bg-[#040406] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ease-out relative flex flex-col items-center justify-center ${
                              sandboxDevice === "desktop"
                                ? "w-full rounded-none"
                                : sandboxDevice === "tablet"
                                ? "w-[820px] max-w-full rounded-2xl border-[5px] border-[#1e1e28] shadow-[0_0_60px_rgba(0,0,0,0.95)]"
                                : "w-[360px] max-w-full rounded-[38px] border-[6px] border-[#1a1a24] shadow-[0_0_60px_rgba(197,168,128,0.25)]"
                            }`}
                          >
                            {/* Mobile Smartphone Notch */}
                            {sandboxDevice === "mobile" && (
                              <div className="w-full bg-[#1a1a24] py-1 flex justify-center shrink-0 rounded-t-[32px]">
                                <div className="w-24 h-3.5 bg-black rounded-full flex items-center justify-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
                                </div>
                              </div>
                            )}

                            <iframe
                              key={`sandbox-iframe-${iframeKey}-${sandboxDevice}`}
                              src={selectedProject.details.liveUrl!}
                              title={`${selectedProject.title} Apple Safari Sandbox`}
                              className="w-full flex-1 border-0 bg-black rounded-b-[28px]"
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                            />

                            {/* Mobile Home Bar */}
                            {sandboxDevice === "mobile" && (
                              <div className="w-full bg-[#1a1a24] py-1.5 flex justify-center shrink-0 rounded-b-[32px]">
                                <div className="w-28 h-1 bg-white/40 rounded-full" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-black">
                          {currentMedia?.type === "video" ? (
                            currentMedia.url.includes("vimeo.com") || currentMedia.url.includes("youtube.com") || currentMedia.url.includes("youtu.be") ? (
                              <iframe
                                src={getVideoEmbedUrl(currentMedia.url)}
                                className="w-full h-full border-0 aspect-video pointer-events-none scale-[1.02]"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                title={selectedProject.title}
                              />
                            ) : (
                              <video
                                src={currentMedia.url}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
                                key={`modal-video-${activeSlide}`}
                              />
                            )
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={currentMedia?.url}
                              alt={selectedProject.title}
                              className="w-full h-full object-cover opacity-80 transition-all duration-300 scale-100"
                              key={`modal-image-${activeSlide}`}
                            />
                          )}
                        </div>

                        {mediaItems.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlide(prev => (prev === 0 ? mediaItems.length - 1 : prev - 1));
                              }}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/10 bg-black/60 text-white/50 hover:text-white hover:bg-black/90 flex items-center justify-center cursor-pointer transition-all z-20 shadow-lg backdrop-blur-md"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSlide(prev => (prev === mediaItems.length - 1 ? 0 : prev + 1));
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/10 bg-black/60 text-white/50 hover:text-white hover:bg-black/90 flex items-center justify-center cursor-pointer transition-all z-20 shadow-lg backdrop-blur-md"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </>
                    )}

                    {!liveMode && (
                      <div className="absolute bottom-6 left-8 right-8 z-20 flex flex-col gap-2 pointer-events-none">
                        <span className="font-mono text-[9px] tracking-[0.3em] text-[#c5a880] uppercase">
                          CASE STUDY BRIEF
                        </span>
                        <h4 className="font-outfit text-2xl font-bold tracking-[0.05em] text-white uppercase leading-tight">
                          {selectedProject.title}
                        </h4>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Right Side: Editorial Content Section */}
              <div 
                data-lenis-prevent
                className="p-6 md:p-10 lg:p-12 overflow-y-auto flex-1 min-h-0 modal-scrollbar flex flex-col gap-8"
              >
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#c5a880] uppercase font-bold">
                    {selectedProject.category}
                  </span>
                  <h3 className="font-outfit text-3xl md:text-4xl font-extrabold tracking-[0.05em] text-white uppercase leading-none">
                    {selectedProject.title}
                  </h3>
                  <p className="font-mono text-[10px] sm:text-xs text-white/70 italic leading-relaxed border-l-2 border-[#c5a880] pl-3 py-1">
                    &ldquo;{selectedProject.tagline}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-y-5 gap-x-8 border-y border-white/5 py-6 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[#555566] font-mono text-[9px] tracking-[0.2em] uppercase font-bold">CLIENT</span>
                    <span className="text-white/95 font-outfit text-sm font-medium tracking-wide">{selectedProject.details.client}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[#555566] font-mono text-[9px] tracking-[0.2em] uppercase font-bold">TIMELINE</span>
                    <span className="text-white/95 font-outfit text-sm font-medium tracking-wide">{selectedProject.details.timeline}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[#555566] font-mono text-[9px] tracking-[0.2em] uppercase font-bold">ROLE</span>
                    <span className="text-white/95 font-outfit text-sm font-medium tracking-wide">{selectedProject.details.role}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[#555566] font-mono text-[9px] tracking-[0.2em] uppercase font-bold">ENGINE & DEV</span>
                    <span className="text-[#c5a880] font-outfit text-sm font-bold tracking-wide">{selectedProject.details.engine}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#555566] uppercase font-bold">PROJECT OVERVIEW</span>
                  <p className="font-sans text-xs sm:text-sm text-[#9999aa] leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#555566] uppercase font-bold flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>PERFORMANCE METRICS</span>
                  </span>
                  
                  <div className="flex flex-col gap-3">
                    {selectedProject.metrics.map((metric, index) => (
                      <div key={index} className="bg-white/[0.01] border border-white/5 rounded-xl p-4 flex justify-between items-center">
                        <span className="font-mono text-[9px] tracking-wider text-[#9999aa] uppercase">{metric.label}</span>
                        <span className="font-mono text-xs text-[#c5a880] font-bold">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-6 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                    {selectedProject.details?.liveUrl && (
                      <a
                        href={selectedProject.details.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-5 py-3 bg-[#c5a880] hover:bg-white text-black font-outfit text-xs font-bold tracking-[0.18em] uppercase rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(197,168,128,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Globe className="w-4 h-4" />
                        <span>LAUNCH LIVE WEBSITE</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                    )}

                    <a
                      href="#contact"
                      onClick={() => {
                        setSelectedProject(null);
                        setShowAllDrawer(false);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).lenis?.start();
                      }}
                      className="w-full sm:w-auto font-mono text-[10px] tracking-[0.16em] text-[#c5a880] hover:text-white flex items-center justify-center gap-1.5 transition-colors duration-300 py-2"
                    >
                      <span>START SIMILAR PROJECT</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      if (!showAllDrawer) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).lenis?.start();
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3 border border-white/10 hover:border-white/30 bg-black/40 text-white/70 hover:text-white font-outfit text-xs font-bold tracking-[0.2em] rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    CLOSE BRIEFCASE
                  </button>
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
