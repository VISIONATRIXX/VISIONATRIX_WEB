"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Project {
  id: string;
  title: string;
  category: string;
  categories: string[];
  tagline: string;
  description: string;
  image: string;
  subtitle: string;
  year: string;
  bgGradient: string;
  details: {
    client: string;
    timeline: string;
    role: string;
    engine: string;
  };
  metrics: {
    label: string;
    value: string;
  }[];
}

function ProjectCard({ project, onOpenDetails }: { project: Project; onOpenDetails: (p: Project) => void }) {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = imageContainerRef.current;
    const img = imgRef.current;
    const cursor = cursorRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
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

    // 3D Tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 10; // Max 10 degrees tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      scale: 1.025,
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(197, 168, 128, 0.1)",
      duration: 0.2,
      ease: "power2.out",
    });

    // Sub-parallax element shift inside the card
    if (img) {
      const px = ((x - centerX) / centerX) * -10;
      const py = ((y - centerY) / centerY) * -10;
      gsap.to(img, {
        x: px,
        y: py,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleMouseEnter = () => {
    const cursor = cursorRef.current;
    if (cursor) {
      gsap.to(cursor, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    const card = imageContainerRef.current;
    const img = imgRef.current;
    const cursor = cursorRef.current;

    // Reset 3D Tilt
    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3), 0 0 0px rgba(0,0,0,0)",
        duration: 0.5,
        ease: "power2.out",
      });
    }

    // Reset Parallax
    if (img) {
      gsap.to(img, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    // Hide follow cursor
    if (cursor) {
      gsap.to(cursor, {
        opacity: 0,
        scale: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-[280px] sm:w-[350px] md:w-[480px] shrink-0 snap-center select-none">
      {/* 3D Interactive Card Image Container */}
      <div
        ref={imageContainerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onOpenDetails(project)}
        className="relative aspect-[16/10] w-full rounded-xl overflow-hidden cursor-none bg-zinc-950 border border-white/5 shadow-2xl transition-all duration-300 transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Hover Background overlay */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${project.bgGradient} opacity-0 hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none z-10`} />

        {/* Project Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%] object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
        />

        {/* Category Pill Tag (top-left) */}
        <div className="absolute top-4 left-4 z-20 bg-[#050507]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse" />
          <span className="font-mono text-[9px] text-[#c5a880] font-bold tracking-wider uppercase">
            {project.category}
          </span>
        </div>

        {/* Custom Follow Cursor */}
        <div
          ref={cursorRef}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/40 bg-black/10 backdrop-blur-[2px] z-30 flex items-center justify-center pointer-events-none opacity-0 scale-0 transform-gpu"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white shadow-lg" />
        </div>
      </div>

      {/* Description / Metadata Labels (below image) */}
      <div className="flex flex-col gap-2 px-1">
        {/* Top meta details line */}
        <div className="flex justify-between items-center text-[#555566] font-mono text-[9px] tracking-wider uppercase">
          <span>{project.subtitle}</span>
          <span>{project.year}</span>
        </div>

        {/* Big Bold Title */}
        <h3 
          onClick={() => onOpenDetails(project)}
          className="font-outfit text-lg sm:text-xl font-bold tracking-[0.05em] text-white uppercase hover:text-[#c5a880] transition-colors duration-300 cursor-pointer"
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
  const trackRef = useRef<HTMLDivElement>(null);

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

  const projects: Project[] = [
    {
      id: "01",
      title: "AURA CONFIGURATOR",
      category: "CGI & Volumetric Design",
      categories: ["CGI", "VR"],
      subtitle: "01 / MERCEDES-BENZ CONCEPT",
      year: "2026",
      image: "/work_aura_configurator.png",
      tagline: "Formulating custom high-fidelity configuration environments with real-time path-traced material shaders.",
      description: "An immersive digital showroom designed for Mercedes-Benz concept vehicles. Built with path-traced shaders to simulate realistic carbon fiber weave patterns, active aerodynamic mechanics, and high-frequency light reflections in real time.",
      bgGradient: "from-slate-900 via-sky-950 to-[#050507]",
      details: {
        client: "Mercedes Benz Spec",
        timeline: "Q1 2026",
        role: "CGI Lead & Interactive Dev",
        engine: "Octane Render / GLSL Shaders"
      },
      metrics: [
        { label: "RESOLUTION", value: "8K Projections" },
        { label: "RENDER TIME", value: "1,420 Node Hours" },
        { label: "POLY COUNT", value: "18.4 Million" }
      ]
    },
    {
      id: "02",
      title: "OMNIS INTERACTIVE",
      category: "Holographic UI & Code",
      categories: ["VR", "WEB DEV", "APPS"],
      subtitle: "02 / LEICA OPTICS",
      year: "2025",
      image: "/work_omnis_interactive.png",
      tagline: "Crafting sub-pixel accurate smartwatch interfaces, glass refraction shaders, and micro-bezel mechanics.",
      description: "A luxury smartwatch design explorer mapping physical light refraction, mechanical gear rotations, and high-performance WebGL state management for customized watch faces.",
      bgGradient: "from-zinc-900 via-[#1c1212] to-[#050507]",
      details: {
        client: "Leica Concept Spec",
        timeline: "Q2 2025",
        role: "UI Design & Shader Engineer",
        engine: "Three.js / React Fiber"
      },
      metrics: [
        { label: "SUB-PIXEL SAMPLING", value: "1024 Samples" },
        { label: "FPS TARGET", value: "60 FPS Locked" },
        { label: "GLASS SHADERS", value: "Physically Accurate" }
      ]
    },
    {
      id: "03",
      title: "SAINT LAURENT // SPATIAL SHOWROOM",
      category: "Spatial Commerce & VFX",
      categories: ["VFX", "VR"],
      subtitle: "03 / ATELIER VIRTUAL",
      year: "2025",
      image: "/work_omnis_interactive.png",
      tagline: "Volumetric spatial commerce portal featuring clothing simulation and 3D Gaussian Splatting.",
      description: "An immersive virtual showroom designed for spatial headsets. Using 3D Gaussian Splatting and high-density volumetric captures, users can observe the microscopic weave patterns of Saint Laurent luxury fabrics, walking through a digital twin of their flagship atelier.",
      bgGradient: "from-stone-900 via-neutral-950 to-[#050507]",
      details: {
        client: "Saint Laurent Spec",
        timeline: "Q4 2025",
        role: "Volumetric Captures & Spatial UI/UX",
        engine: "Unity / OpenXR / SplatTool"
      },
      metrics: [
        { label: "TARGET HW", value: "Vision Pro / Quest 3" },
        { label: "GAUSSIAN CLOUD", value: "8.5 Million Splats" }
      ]
    },
    {
      id: "04",
      title: "APEX RACING TELEMETRY",
      category: "WebGL Shaders & Dashboard",
      categories: ["WEB DEV", "VFX"],
      subtitle: "04 / APEX SYSTEMS",
      year: "2025",
      image: "/work_aura_configurator.png",
      tagline: "Interactive WebGL racing interface tracking engine metrics in real time with custom vertex shaders.",
      description: "A fast-loading interactive web portal implementing WebGL vertex shaders to visualize real-time physics parameters and engine telemetry. Fusing physics equations directly with GPU shaders to produce fluid, responsive sound and visual spikes.",
      bgGradient: "from-emerald-950 via-slate-950 to-[#050507]",
      details: {
        client: "Apex Racing Team",
        timeline: "Q3 2025",
        role: "WebGL Dev & GLSL Shader Design",
        engine: "Three.js / React Three Fiber"
      },
      metrics: [
        { label: "LOAD TIME", value: "1.2 Seconds" },
        { label: "SHADER CODE", value: "Custom GLSL" }
      ]
    },
    {
      id: "05",
      title: "LUMINANCE CAMPAIGN",
      category: "Video Production & AI Shoots",
      categories: ["VIDEO", "AI SHOOTS"],
      subtitle: "05 / LUMINANCE COSMETICS",
      year: "2026",
      image: "/work_aura_configurator.png",
      tagline: "High-impact commercial blending ComfyUI latent nodes with raw 35mm film shoots.",
      description: "A luxury skincare commercial blending cinematic 35mm camera shoots with generative AI latent model expansions. Utilized custom ControlNet architectures to preserve actor consistency across surreal transitions.",
      bgGradient: "from-[#1b1712] via-neutral-900 to-[#050507]",
      details: {
        client: "Luminance Cosmetics",
        timeline: "Q1 2026",
        role: "Co-Direction & AI Generation Nodes",
        engine: "ComfyUI / SDXL"
      },
      metrics: [
        { label: "LATENT STEPS", value: "Flux Dev" },
        { label: "UPSCALING", value: "4K Magnific AI" }
      ]
    }
  ];

  const filteredProjects = activeCategory === "ALL" 
    ? projects 
    : projects.filter(p => p.categories.includes(activeCategory));

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    // Recalculate dimensions on category filter update
    const getScrollWidth = () => {
      return track.scrollWidth - track.clientWidth;
    };

    let scrollTween: gsap.core.Tween;
    let mm = gsap.matchMedia();

    // Delay initialization slightly to let DOM sizes settle
    const timer = setTimeout(() => {
      mm.add("(min-width: 768px)", () => {
        const scrollWidth = getScrollWidth();
        if (scrollWidth <= 0) return;

        scrollTween = gsap.to(track, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top top",
            end: () => `+=${scrollWidth * 1.1}`,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      mm.revert();
      if (scrollTween) {
        scrollTween.scrollTrigger?.kill();
        scrollTween.kill();
      }
    };
  }, [activeCategory, filteredProjects.length]);

  return (
    <section 
      ref={sectionRef}
      id="works" 
      className="relative w-full h-screen bg-[#050507] overflow-hidden flex flex-col justify-center py-12 md:py-24 px-6 md:px-12 lg:px-24"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[5%] top-[10%] w-[35vw] h-[35vw] bg-[#c5a880]/[0.015] blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 flex flex-col h-full justify-between">
        
        {/* Header Row: Title & Category Navigation */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 mb-4 md:mb-8 shrink-0">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
              SELECTED WORKS
            </span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.1em] text-white uppercase">
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
                  onClick={() => {
                    setActiveCategory(cat);
                    if (trackRef.current) {
                      gsap.set(trackRef.current, { x: 0 });
                    }
                  }}
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

        {/* Project Cards Scrolling Track */}
        <div className="w-full overflow-hidden relative flex-grow flex items-center py-4 md:py-8">
          <div 
            ref={trackRef}
            className="flex gap-8 md:gap-14 w-full md:w-max items-center overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory md:snap-none px-2 md:px-0 md:pr-[20vw]"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="shrink-0"
                >
                  <ProjectCard 
                    project={project} 
                    onOpenDetails={(p) => {
                      setSelectedProject(p);
                      (window as any).lenis?.stop();
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Case Study Details Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-6"
          >
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="w-full max-w-2xl bg-[#0b0b0e] border border-[#c5a880]/20 rounded-xl p-6 md:p-8 relative shadow-[0_0_60px_rgba(197,168,128,0.12)] flex flex-col gap-6"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedProject(null);
                  (window as any).lenis?.start();
                }}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors duration-300 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-1 pr-12">
                <span className="font-mono text-[9px] tracking-[0.25em] text-[#c5a880] uppercase">
                  {selectedProject.category}
                </span>
                <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-[0.05em] text-white">
                  {selectedProject.title}
                </h3>
              </div>

              {/* Brief Information Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-white/5 py-4 my-2 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#555566] font-mono text-[9px] tracking-wider uppercase">CLIENT</span>
                  <span className="text-white/90 font-mono font-medium">{selectedProject.details.client}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#555566] font-mono text-[9px] tracking-wider uppercase">TIMELINE</span>
                  <span className="text-white/90 font-mono font-medium">{selectedProject.details.timeline}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#555566] font-mono text-[9px] tracking-wider uppercase">ROLE</span>
                  <span className="text-white/90 font-mono font-medium">{selectedProject.details.role}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#555566] font-mono text-[9px] tracking-wider uppercase">ENGINE</span>
                  <span className="text-white/90 font-mono font-medium">{selectedProject.details.engine}</span>
                </div>
              </div>

              {/* Full Description */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#555566] uppercase">PROJECT OVERVIEW</span>
                <p className="font-sans text-xs sm:text-sm text-[#9999aa] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Metrics Grid Section */}
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#555566] uppercase flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#c5a880]" />
                  <span>QUANTITATIVE METRICS</span>
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProject.metrics.map((metric, index) => (
                    <div key={index} className="bg-white/[0.02] border border-white/5 rounded p-3 flex justify-between items-center">
                      <span className="font-mono text-[9px] tracking-wider text-[#9999aa] uppercase">{metric.label}</span>
                      <span className="font-mono text-xs text-[#c5a880] font-semibold">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Button */}
              <div className="flex justify-end mt-4 border-t border-white/5 pt-4">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    (window as any).lenis?.start();
                  }}
                  className="px-6 py-2.5 border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#050507] bg-transparent text-white font-outfit text-xs tracking-[0.15em] rounded-sm transition-all duration-300 cursor-pointer"
                >
                  CLOSE METRICS
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
