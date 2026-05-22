"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3 } from "lucide-react";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAdmin, Project } from "@/context/AdminContext";

function ProjectCard({ project, onOpenDetails }: { project: Project; onOpenDetails: (p: Project) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    const img = imgRef.current;
    const sheen = sheenRef.current;
    const cursor = cursorRef.current;
    if (!card) return;

    const rect = rectRef.current || card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Move custom cursor with zero delay
    if (cursor) {
      gsap.to(cursor, {
        x: x,
        y: y,
        duration: 0,
      });
    }

    // Sheen reflection calculation
    if (sheen) {
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;
      gsap.to(sheen, {
        background: `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.03) 40%, transparent 70%)`,
        duration: 0.1,
        ease: "power2.out",
      });
    }

    // 3D Tilt calculation on the ENTIRE card
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 10; // Max 10 degrees tilt
    const rotateY = ((x - centerX) / centerX) * -10; // Inverted for natural look

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1200,
      scale: 1.025,
      borderColor: "rgba(197, 168, 128, 0.3)",
      boxShadow: "0 35px 70px -15px rgba(0,0,0,0.85), 0 0 45px rgba(197, 168, 128, 0.12)",
      duration: 0.25,
      ease: "power2.out",
    });

    // Sub-parallax element shift inside the card
    if (img) {
      const px = ((x - centerX) / centerX) * -12;
      const py = ((y - centerY) / centerY) * -12;
      gsap.to(img, {
        x: px,
        y: py,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    const cursor = cursorRef.current;
    const sheen = sheenRef.current;
    if (cursor) {
      gsap.to(cursor, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }
    if (sheen) {
      gsap.to(sheen, {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const img = imgRef.current;
    const cursor = cursorRef.current;
    const sheen = sheenRef.current;

    // Reset 3D Tilt
    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3), 0 0 0px rgba(0,0,0,0)",
        duration: 0.6,
        ease: "power2.out",
      });
    }

    // Reset Parallax
    if (img) {
      gsap.to(img, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    // Hide follow cursor
    if (cursor) {
      gsap.to(cursor, {
        opacity: 0,
        scale: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }

    // Hide sheen
    if (sheen) {
      gsap.to(sheen, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenDetails(project)}
      className="flex flex-col gap-5 w-full rounded-2xl overflow-hidden cursor-none bg-[#09090d]/80 border border-white/5 shadow-2xl p-4 md:p-6 transition-all duration-500 transform-gpu select-none group project-card-container"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* 3D Interactive Card Image Container */}
      <div
        className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#050507]"
        style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}
      >
        {/* Iridescent / Sheen Overlay */}
        <div
          ref={sheenRef}
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-0 z-20 transition-opacity duration-300"
          style={{ transform: "translateZ(10px)" }}
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

        {/* Custom Follow Cursor */}
        <div
          ref={cursorRef}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-[#c5a880]/50 bg-black/40 backdrop-blur-[3px] z-40 flex items-center justify-center pointer-events-none opacity-0 scale-0 transition-transform duration-300"
          style={{ transform: "translateZ(60px)" }}
        >
          <span className="font-outfit text-[8px] font-bold tracking-[0.2em] text-[#c5a880] uppercase">VIEW</span>
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

export default function WorksSection() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);

  const categories = [
    "ALL",
    "VIDEO",
    "VFX",
    "CGI",
    "WEB DEV",
    "APPS",
    "AI SHOOTS",
    "VR",
  ];

  const { projects } = useAdmin();

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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeCategory, filteredProjects.length]);

  // Card layouts configuration to match the staggered asymmetrical grid in screenshot
  const cardLayoutClasses = [
    "md:col-span-7 md:justify-self-start",             // 01 Aura Configurator
    "md:col-span-5 md:mt-28 md:justify-self-end",      // 02 Omnis Interactive
    "md:col-span-5 md:-mt-16 md:justify-self-start",   // 03 Neo-City Digital Twin
    "md:col-span-7 md:mt-12 md:justify-self-end",      // 04 Ether Editorial
    "md:col-span-7 md:mt-[-40px] md:justify-self-start", // 05 Chronos VR
    "md:col-span-5 md:mt-24 md:justify-self-end",      // 06 Synapse AI Studio
    "md:col-span-5 md:-mt-20 md:justify-self-start",   // 07 Vortex Fluidics
    "md:col-span-7 md:mt-8 md:justify-self-end",       // 08 Custom Software System
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
        <div className="max-w-7xl mx-auto w-full z-10 flex flex-col h-full justify-between">
        
        {/* Header Row: Title & Category Navigation */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 mb-12 md:mb-16 shrink-0">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-[#c5a880] uppercase">
              SELECTED WORKS
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.08em] text-white uppercase">
              CASE STUDIES
            </h2>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 md:mt-0 font-mono text-[9px] md:text-[10px] tracking-[0.2em] font-medium text-white/40">
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
        </div>

        {/* Asymmetrical Staggered Grid Container */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-y-32 md:gap-x-16 py-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const layoutClass = cardLayoutClasses[index % cardLayoutClasses.length];
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
                  <ProjectCard 
                    project={project} 
                    onOpenDetails={(p) => {
                      setSelectedProject(p);
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (window as any).lenis?.stop();
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
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
            className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-6"
          >
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="w-full max-w-4xl bg-[#0b0b0f]/90 border border-white/10 rounded-2xl relative shadow-[0_0_80px_rgba(0,0,0,0.8),_0_0_50px_rgba(197,168,128,0.06)] flex flex-col md:grid md:grid-cols-12 gap-0 overflow-hidden max-h-[90vh]"
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
              <div className="relative col-span-5 min-h-[200px] md:min-h-[500px] h-full overflow-hidden bg-zinc-950 border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center">
                {/* Background ambient light */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${selectedProject.bgGradient} opacity-30 z-0`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

                {/* Animated project image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover opacity-80 scale-105 animate-[pulse_10s_infinite_alternate]"
                  style={{ animationDuration: "12s" }}
                />

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
              <div className="col-span-7 p-6 md:p-10 lg:p-12 overflow-y-auto max-h-[65vh] md:max-h-[90vh] modal-scrollbar flex flex-col justify-between gap-8">
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
