"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, ChevronLeft, ChevronRight, ExternalLink, Grid, ArrowRight, Eye, Layers } from "lucide-react";
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

      {/* Top Category Badge */}
      <div className="absolute top-5 left-5 z-20 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5 shadow-md">
        <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880] shadow-[0_0_6px_#c5a880]" />
        <span className="font-mono text-[8.5px] text-white font-bold tracking-[0.2em] uppercase">
          {project.category}
        </span>
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
        <div className="bg-black/85 backdrop-blur-md border border-[#c5a880] px-4 py-2 rounded-full flex items-center gap-2 text-[#c5a880] shadow-2xl">
          <Eye className="w-3.5 h-3.5" />
          <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase">INSPECT CASE BRIEF</span>
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
                  onOpenDetails={(p) => {
                    setSelectedProject(p);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (window as any).lenis?.stop();
                  }}
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
                  onOpenDetails={(p) => {
                    setSelectedProject(p);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (window as any).lenis?.stop();
                  }}
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
                  onOpenDetails={(p) => {
                    setSelectedProject(p);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (window as any).lenis?.stop();
                  }}
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
                  onClick={() => {
                    setSelectedProject(project);
                  }}
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

              {/* Visual Media Carousel */}
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

                return (
                  <div className="relative w-full aspect-video md:h-[350px] lg:h-[400px] overflow-hidden bg-zinc-950 border-b border-white/10 flex items-center justify-center shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${selectedProject.bgGradient} opacity-30 z-0`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10 pointer-events-none" />

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

                    <div className="absolute bottom-6 left-8 right-8 z-20 flex flex-col gap-2 pointer-events-none">
                      <span className="font-mono text-[9px] tracking-[0.3em] text-[#c5a880] uppercase">
                        CASE STUDY BRIEF
                      </span>
                      <h4 className="font-outfit text-2xl font-bold tracking-[0.05em] text-white uppercase leading-tight">
                        {selectedProject.title}
                      </h4>
                    </div>
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
                  <a
                    href="#contact"
                    onClick={() => {
                      setSelectedProject(null);
                      setShowAllDrawer(false);
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (window as any).lenis?.start();
                    }}
                    className="w-full sm:w-auto font-mono text-[10px] tracking-[0.16em] text-[#c5a880] hover:text-white flex items-center justify-center gap-1.5 transition-colors duration-300"
                  >
                    <span>START SIMILAR PROJECT</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      if (!showAllDrawer) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).lenis?.start();
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-3 bg-[#c5a880] hover:bg-[#b0926a] text-black font-outfit text-xs font-bold tracking-[0.2em] rounded-xl transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg hover:shadow-[#c5a880]/10"
                  >
                    CLOSE BRIEFCASE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
