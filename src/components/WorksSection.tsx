"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3 } from "lucide-react";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAdmin, Project } from "@/context/AdminContext";

const restingRotations = [
  { rotateX: 4, rotateY: -6, rotateZ: 1.5 },
  { rotateX: -3, rotateY: 5, rotateZ: -1 },
  { rotateX: 5, rotateY: 3, rotateZ: 2 },
  { rotateX: -4, rotateY: -4, rotateZ: -1.5 },
  { rotateX: 3, rotateY: -5, rotateZ: 1 },
  { rotateX: -5, rotateY: 4, rotateZ: -2 },
  { rotateX: 4, rotateY: 6, rotateZ: 1.5 },
  { rotateX: -4, rotateY: -5, rotateZ: -1 },
];

const parallaxSpeeds = [-60, 40, -30, 80, -45, 60, -20, 50];

function ProjectCard({ 
  project, 
  index, 
  onOpenDetails 
}: { 
  project: Project; 
  index: number; 
  onOpenDetails: (p: Project) => void 
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const resting = restingRotations[index % restingRotations.length];

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      gsap.set(card, {
        rotateX: resting.rotateX,
        rotateY: resting.rotateY,
        rotateZ: resting.rotateZ,
        scale: 1,
        transformPerspective: 1200,
      });
    }
  }, [resting]);

  const handleMouseEnter = () => {
    const card = cardRef.current;
    const img = imgRef.current;
    const sheen = sheenRef.current;

    if (card) {
      gsap.to(card, {
        scale: 1.03,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        borderColor: "rgba(197, 168, 128, 0.35)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 35px rgba(197, 168, 128, 0.12)",
        transformPerspective: 1200,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    if (img) {
      gsap.to(img, {
        scale: 1.06,
        opacity: 0.9,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    if (sheen) {
      gsap.to(sheen, { opacity: 1, duration: 0.4, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const img = imgRef.current;
    const sheen = sheenRef.current;

    if (card) {
      gsap.to(card, {
        rotateX: resting.rotateX,
        rotateY: resting.rotateY,
        rotateZ: resting.rotateZ,
        scale: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3), 0 0 0px rgba(0,0,0,0)",
        duration: 0.5,
        ease: "power2.out",
      });
    }
    if (img) {
      gsap.to(img, {
        scale: 1.0,
        opacity: 0.75,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    if (sheen) {
      gsap.to(sheen, { opacity: 0, duration: 0.5, ease: "power2.out" });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenDetails(project)}
      className="flex flex-col gap-5 w-full rounded-2xl overflow-hidden cursor-pointer bg-[#09090d]/80 border border-white/5 shadow-2xl p-4 md:p-6 select-none group project-card-container"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Interactive Card Image Container */}
      <div
        className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#050507]"
        style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}
      >
        {/* Iridescent / Sheen Overlay */}
        <div
          ref={sheenRef}
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-0 z-20 transition-opacity duration-300"
          style={{ 
            transform: "translateZ(10px)",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.04) 100%)"
          }}
        />

        {/* Hover Background overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-tr ${project.bgGradient} opacity-0 group-hover:opacity-[0.25] transition-opacity duration-700 pointer-events-none z-10`} 
          style={{ transform: "translateZ(5px)" }}
        />

        {/* Project Image Container with translateZ */}
        <div 
          className="absolute inset-0 w-[112%] h-[112%] -left-[6%] -top-[6%] overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-opacity duration-700 scale-100"
          />
        </div>

        {/* Category Pill Tag (top-left) - translates higher */}
        <div 
          className="absolute top-4 left-4 z-30 bg-[#07070a]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg"
          style={{ transform: "translateZ(55px)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880] shadow-[0_0_8px_#c5a880]" />
          <span className="font-mono text-[9px] text-white font-bold tracking-[0.2em] uppercase">
            {project.category}
          </span>
        </div>
      </div>

      {/* Description / Metadata Labels (below image) - Floats in 3D */}
      <div 
        className="flex flex-col gap-2 px-1"
        style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }}
      >
        {/* Top meta details line */}
        <div className="flex justify-between items-center text-[#666677] font-mono text-[9px] tracking-[0.25em] uppercase">
          <span>{project.subtitle}</span>
          <span>{project.year}</span>
        </div>

        {/* Big Bold Title */}
        <h3 
          className="font-outfit text-xl sm:text-2xl font-bold tracking-[0.08em] text-white uppercase group-hover:text-[#c5a880] transition-colors duration-300 cursor-pointer w-fit"
        >
          {project.title}
        </h3>
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

function ProjectCardSkeleton({ className }: { className: string }) {
  return (
    <div className={`flex flex-col gap-5 w-full rounded-2xl bg-[#09090d]/60 border border-white/5 p-4 md:p-6 animate-pulse select-none ${className}`}>
      <div className="relative aspect-[16/10] w-full rounded-xl bg-white/[0.02] border border-white/5" />
      <div className="flex flex-col gap-3 px-1">
        <div className="flex justify-between items-center">
          <div className="h-2 w-24 bg-white/10 rounded-full" />
          <div className="h-2 w-8 bg-white/10 rounded-full" />
        </div>
        <div className="h-4.5 w-40 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

export default function WorksSection() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);

  const { projects, isLoaded } = useAdmin();

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

  const handleCategoryChange = (cat: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).lenis;
    const section = sectionRef.current;
    if (section) {
      const rect = section.getBoundingClientRect();
      const targetScroll = window.scrollY + rect.top - 60; // offset for sticky header
      
      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: 0.8,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            setActiveCategory(cat);
          }
        });
      } else {
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
        setTimeout(() => {
          setActiveCategory(cat);
        }, 500);
      }
    } else {
      setActiveCategory(cat);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in trigger on mount/filter
    const cards = gsap.utils.toArray(".project-card-container") as HTMLElement[];
    cards.forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60, rotateX: -6 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          }
        }
      );
    });

    // Parallax scroll speed logic
    const parallaxWrappers = gsap.utils.toArray(".parallax-wrapper") as HTMLElement[];
    parallaxWrappers.forEach((wrapper) => {
      const speed = parseFloat(wrapper.getAttribute("data-speed") || "0");
      if (speed === 0) return;

      gsap.fromTo(wrapper,
        { y: -speed },
        {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeCategory, filteredProjects.length]);

  // Card layouts configuration to match the staggered asymmetrical grid
  const cardLayoutClasses = [
    "lg:col-span-7 lg:justify-self-start",             // 01 Aura Configurator
    "lg:col-span-5 lg:mt-28 lg:justify-self-end",      // 02 Omnis Interactive
    "lg:col-span-5 lg:mt-[-40px] lg:justify-self-start", // 03 Neo-City Digital Twin
    "lg:col-span-7 lg:mt-12 lg:justify-self-end",      // 04 Ether Editorial
    "lg:col-span-7 lg:mt-[-30px] lg:justify-self-start", // 05 Chronos VR
    "lg:col-span-5 lg:mt-24 lg:justify-self-end",      // 06 Synapse AI Studio
    "lg:col-span-5 lg:mt-[-50px] lg:justify-self-start", // 07 Vortex Fluidics
    "lg:col-span-7 lg:mt-8 lg:justify-self-end",       // 08 Custom Software System
  ];

  return (
    <section 
      ref={sectionRef}
      id="works" 
      className="relative w-full bg-[#0b0b0f] overflow-hidden py-24 md:py-32 px-6 md:px-12 lg:px-24"
    >
      {/* Background ambient lighting decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[5%] top-[10%] w-[35vw] h-[35vw] bg-[#c5a880]/[0.012] blur-[150px] rounded-full" />
        <div className="absolute left-[5%] bottom-[15%] w-[40vw] h-[40vw] bg-[#c5a880]/[0.008] blur-[180px] rounded-full" />
      </div>

      <ScrollAnimatedWrapper enableY={false} enableScale={false} className="h-full flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column - Sticky Info panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit flex flex-col gap-8 self-start z-20">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-[#c5a880] uppercase font-bold">
                SELECTED WORKS
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.08em] text-white uppercase">
                CASE STUDIES
              </h2>
              <p className="text-xs text-[#9999aa] leading-relaxed mt-2 font-sans">
                Explore our selected works displaying interactive, real-time creations. Hover to inspect depth and dynamics, and click to view detailed case briefs.
              </p>
            </div>

            {/* Structured Guide / Specs Box */}
            <div className="border border-white/5 bg-[#09090d]/60 backdrop-blur-md rounded-xl p-5 md:p-6 flex flex-col gap-5">
              {/* Section 1 */}
              <div className="flex flex-col gap-2">
                <h4 className="font-mono text-[9px] tracking-[0.2em] text-[#c5a880] uppercase font-bold">
                  REQUIREMENTS
                </h4>
                <ul className="flex flex-col gap-1.5 font-mono text-[10px] text-white/75">
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>Cards tilt & rotate towards cursor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>Smooth natural movement & spring easing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>3D perspective field layout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>Subtle scale & interactive sheen response</span>
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                <h4 className="font-mono text-[9px] tracking-[0.2em] text-[#c5a880] uppercase font-bold">
                  TECH & STYLE
                </h4>
                <ul className="flex flex-col gap-1.5 font-mono text-[10px] text-white/75">
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>High-performance GSAP engine logic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>3D perspective transformations (1200px)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>Optimized hardware acceleration (GPU transforms)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>Curated minimal dark-theme aesthetic</span>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                <h4 className="font-mono text-[9px] tracking-[0.2em] text-[#c5a880] uppercase font-bold">
                  BEHAVIOR
                </h4>
                <ul className="flex flex-col gap-1.5 font-mono text-[10px] text-white/75">
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>X/Y rotation adjusts dynamically on move</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>Staggered Scroll Parallax translates Y-axis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#c5a880] mt-0.5 font-bold">•</span>
                    <span>Resting angles restore floating state on leave</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Suggested Tech Stack pill badges */}
            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-[9px] tracking-[0.2em] text-[#c5a880] uppercase font-bold">
                SUGGESTED TECH STACK
              </h4>
              <div className="flex flex-wrap gap-2.5 font-mono text-[9px] tracking-[0.15em] font-bold text-white">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c5a880]/30 bg-[#c5a880]/5 hover:bg-[#c5a880]/10 hover:border-[#c5a880]/50 transition-all duration-300 shadow-[0_0_10px_rgba(197,168,128,0.05)] cursor-default select-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880] shadow-[0_0_6px_#c5a880]" />
                  <span>GSAP</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-default select-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#9999aa]" />
                  <span>LENIS</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-default select-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#9999aa]" />
                  <span>VANILLA JS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive 3D playground */}
          <div className="lg:col-span-8 flex flex-col gap-10 relative">
            {/* Category Filter Buttons - Floats at the top */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-[9px] md:text-[10px] tracking-[0.2em] font-medium text-white/40 pb-4 border-b border-white/5 w-full">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`relative py-1.5 cursor-pointer transition-colors duration-300 ${
                      isActive ? "text-[#c5a880] font-semibold" : "hover:text-white"
                    }`}
                  >
                    <span>{cat}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a880]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Asymmetrical Staggered Cards Field */}
            <div 
              className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-y-24 md:gap-x-12 py-4"
              style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
            >
              {!isLoaded ? (
                Array.from({ length: 4 }).map((_, index) => {
                  const layoutClass = cardLayoutClasses[index % cardLayoutClasses.length];
                  const speed = parallaxSpeeds[index % parallaxSpeeds.length];
                  return (
                    <div 
                      key={`skeleton-${index}`} 
                      className={`w-full max-w-[580px] ${layoutClass} parallax-wrapper`}
                      data-speed={speed}
                    >
                      <ProjectCardSkeleton className="w-full" />
                    </div>
                  );
                })
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => {
                    const layoutClass = cardLayoutClasses[index % cardLayoutClasses.length];
                    const speed = parallaxSpeeds[index % parallaxSpeeds.length];
                    return (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className={`w-full max-w-[580px] ${layoutClass}`}
                      >
                        <div className="parallax-wrapper w-full" data-speed={speed}>
                          <ProjectCard 
                            project={project} 
                            index={index}
                            onOpenDetails={(p) => {
                              setSelectedProject(p);
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              (window as any).lenis?.stop();
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>

        </div>
      </ScrollAnimatedWrapper>

      {/* Case Study Details Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/98 p-4 md:p-6"
            style={{ willChange: "opacity" }}
          >
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="w-full max-w-4xl bg-[#0b0b0f] border border-white/10 rounded-2xl relative shadow-[0_0_80px_rgba(0,0,0,0.8),_0_0_50px_rgba(197,168,128,0.06)] flex flex-col md:grid md:grid-cols-12 gap-0 overflow-hidden h-[85vh] max-h-[85vh] md:h-[600px] lg:h-[700px] xl:h-[750px]"
              style={{ willChange: "transform, opacity" }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedProject(null);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (window as any).lenis?.start();
                }}
                className="absolute top-6 right-6 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center cursor-pointer z-50 shadow-lg backdrop-blur-md animate-pulse"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Side: Visual Section */}
              <div className="relative col-span-5 w-full aspect-video md:aspect-auto md:h-full overflow-hidden bg-zinc-950 border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center">
                {/* Background ambient light */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${selectedProject.bgGradient} opacity-30 z-0`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10" />

                {/* Dynamic Project Media Player (Video or fallback Image) */}
                {selectedProject.details?.videoUrl ? (
                  <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-black">
                    {selectedProject.details.videoUrl.includes("vimeo.com") || selectedProject.details.videoUrl.includes("youtube.com") || selectedProject.details.videoUrl.includes("youtu.be") ? (
                      <iframe
                        src={getVideoEmbedUrl(selectedProject.details.videoUrl)}
                        className="w-full h-full border-0 aspect-[9/16] md:aspect-[10/16] pointer-events-none scale-[1.02]"
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
                        className="w-full h-full object-cover opacity-90"
                      />
                    )}
                  </div>
                ) : (
                  /* Animated project fallback image */
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover opacity-80 scale-105 animate-[pulse_10s_infinite_alternate]"
                    style={{ animationDuration: "12s" }}
                  />
                )}

                {/* Floating overlay text on visual side */}
                <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col gap-2">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[#c5a880] uppercase">
                    CASE STUDY DETAILS
                  </span>
                  <h4 className="font-outfit text-2xl font-bold tracking-[0.05em] text-white uppercase leading-tight">
                    {selectedProject.title}
                  </h4>
                  <div className="w-12 h-1 bg-[#c5a880] rounded-full mt-2" />
                </div>
              </div>

              {/* Right Side: Editorial Content Section */}
              <div 
                data-lenis-prevent
                className="col-span-7 p-6 md:p-10 lg:p-12 overflow-y-auto flex-1 min-h-0 modal-scrollbar flex flex-col justify-between gap-8"
              >
                {/* Title and Tagline */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#c5a880] uppercase">
                    {selectedProject.category}
                  </span>
                  <h3 className="font-outfit text-3xl md:text-4xl font-extrabold tracking-[0.05em] text-white uppercase leading-none">
                    {selectedProject.title}
                  </h3>
                  <p className="font-mono text-[10px] sm:text-xs text-white/70 italic leading-relaxed border-l-2 border-[#c5a880] pl-3 py-1">
                    &ldquo;{selectedProject.tagline}&rdquo;
                  </p>
                </div>

                {/* Editorial Metadata Grid */}
                <div className="grid grid-cols-2 gap-y-5 gap-x-8 border-y border-white/5 py-6 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[#555566] font-mono text-[9px] tracking-[0.2em] uppercase">CLIENT</span>
                    <span className="text-white/95 font-outfit text-sm font-medium tracking-wide">{selectedProject.details.client}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[#555566] font-mono text-[9px] tracking-[0.2em] uppercase">TIMELINE</span>
                    <span className="text-white/95 font-outfit text-sm font-medium tracking-wide">{selectedProject.details.timeline}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[#555566] font-mono text-[9px] tracking-[0.2em] uppercase">ROLE</span>
                    <span className="text-white/95 font-outfit text-sm font-medium tracking-wide">{selectedProject.details.role}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[#555566] font-mono text-[9px] tracking-[0.2em] uppercase">ENGINE & DEV</span>
                    <span className="text-[#c5a880] font-outfit text-sm font-bold tracking-wide">{selectedProject.details.engine}</span>
                  </div>
                </div>

                {/* Narrative Overview */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#555566] uppercase">PROJECT OVERVIEW</span>
                  <p className="font-sans text-xs sm:text-sm text-[#9999aa] leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Animated Quantitative Metrics */}
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#555566] uppercase flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>PERFORMANCE METRICS</span>
                  </span>
                  
                  <div className="flex flex-col gap-3">
                    {selectedProject.metrics.map((metric, index) => {
                      const percentages = ["92%", "85%", "78%"];
                      const percentage = percentages[index % percentages.length];
                      return (
                        <div key={index} className="bg-white/[0.01] border border-white/5 rounded-xl p-4 flex flex-col gap-2.5 shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[9px] tracking-wider text-[#9999aa] uppercase">{metric.label}</span>
                            <span className="font-mono text-xs text-[#c5a880] font-bold">{metric.value}</span>
                          </div>
                          {/* Animated gradient progress bar */}
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: percentage }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.15 }}
                              className="h-full bg-gradient-to-r from-[#c5a880] to-[#e4ceaf] rounded-full shadow-[0_0_8px_rgba(197,168,128,0.3)]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Close Button / Bottom CTA */}
                <div className="flex justify-end mt-4 pt-6 border-t border-white/5">
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (window as any).lenis?.start();
                    }}
                    className="px-8 py-3 bg-[#c5a880] hover:bg-[#b0926a] text-black font-outfit text-xs font-bold tracking-[0.2em] rounded-sm transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg hover:shadow-[#c5a880]/10"
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
