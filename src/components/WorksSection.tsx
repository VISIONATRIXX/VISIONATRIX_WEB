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

export default function WorksSection() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const categories = [
    "ALL",
    "VIDEO PRODUCTION",
    "VFX SIMULATIONS",
    "CGI ADVERTISING",
    "ENVIRONMENT CREATION",
    "WEBGL WEB CODE",
    "APP ARCHITECTURES",
    "AI PRODUCTION",
    "SPATIAL XR",
  ];

  const projects: Project[] = [
    {
      id: "01",
      title: "MERCEDES BENZ // VISION EQXX",
      category: "CGI / VFX / AUTOMOTIVE",
      categories: ["CGI ADVERTISING", "VFX SIMULATIONS"],
      tagline: "Cinematic luxury visualizer showcasing active aerodynamic surfaces and physical lighting mapping.",
      description: "A high-fidelity commercial spec project visualizing the aerodynamic features and futuristic aesthetics of the Mercedes-Benz Vision EQXX. The focus was to capture physically accurate light reflections on the vehicle chassis and map active aerodynamic body extensions in real time.",
      bgGradient: "from-slate-900 via-sky-950 to-[#050507]",
      details: {
        client: "Mercedes Benz Spec",
        timeline: "Q1 2026",
        role: "CGI Production & VFX Simulations",
        engine: "Octane Render / Houdini"
      },
      metrics: [
        { label: "RESOLUTION", value: "8K Projections" },
        { label: "RENDER TIME", value: "1,420 Node Hours" },
        { label: "FPS TARGET", value: "24fps Cinematic" },
        { label: "POLY COUNT", value: "18.4 Million" }
      ]
    },
    {
      id: "02",
      title: "LEICA CHRONO // SMARTWATCH CONCEPT",
      category: "CGI / RENDER / PRODUCT",
      categories: ["CGI ADVERTISING"],
      tagline: "Bespoke CGI product commercial mapping luxury mechanics, physical glass reflection, and tactile movement.",
      description: "A mechanical visualization of a hypothetical Leica smartwatch. Built with sub-micron modeling tolerances to expose the internal mechanical escapements, gear rotations, and dynamic glass diffraction parameters. Highlighting Leica's iconic design language.",
      bgGradient: "from-zinc-900 via-[#1c1212] to-[#050507]",
      details: {
        client: "Leica Concept Spec",
        timeline: "Q2 2026",
        role: "Industrial Design & 3D Shading",
        engine: "Redshift / Cinema 4D"
      },
      metrics: [
        { label: "RESOLUTION", value: "4K Master Delivery" },
        { label: "SUB-PIXEL SAMPLING", value: "1024 Min Samples" },
        { label: "GLASS SHADERS", value: "Physically Accurate Refraction" },
        { label: "RENDER TIME", value: "320 Node Hours" }
      ]
    },
    {
      id: "03",
      title: "SAINT LAURENT // SPATIAL SHOWROOM",
      category: "SPATIAL XR / VR / COMMERCE",
      categories: ["SPATIAL XR", "ENVIRONMENT CREATION"],
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
        { label: "FRAME RATE", value: "90 FPS Native Locked" },
        { label: "GAUSSIAN CLOUD", value: "8.5 Million Splats" },
        { label: "LATENCY", value: "<12ms Motion-to-Photon" }
      ]
    },
    {
      id: "04",
      title: "APEX RACING // TELEMETRY GLSL HUD",
      category: "WEBGL / SHADERS / CODE",
      categories: ["WEBGL WEB CODE"],
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
        { label: "FPS LOCKED", value: "60 FPS Desktop/Mobile" },
        { label: "SHADER CODE", value: "Custom GLSL Vertex & Fragment" },
        { label: "API PULLS", value: "10ms Refresh Loop" }
      ]
    },
    {
      id: "05",
      title: "LUMINANCE // SENSORY CAMPAIGN",
      category: "VIDEO / AI PRODUCTION / CINEMA",
      categories: ["VIDEO PRODUCTION", "AI PRODUCTION"],
      tagline: "High-impact commercial blending ComfyUI latent nodes with raw 35mm film shots.",
      description: "A luxury skincare commercial blending cinematic 35mm camera shoots with generative AI latent model expansions. Utilized custom ControlNet architectures to preserve actor consistency across surreal transitions, producing a seamless dreamlike aesthetic.",
      bgGradient: "from-[#1b1712] via-neutral-900 to-[#050507]",
      details: {
        client: "Luminance Cosmetics",
        timeline: "Q1 2026",
        role: "Co-Direction & AI Generation Nodes",
        engine: "ComfyUI / Stable Diffusion XL / Premiere"
      },
      metrics: [
        { label: "LATENT STEPS", value: "Flux Dev / SDXL Refiner" },
        { label: "UPSCALING", value: "4K Magnific AI Enhancement" },
        { label: "COLOR GRADING", value: "Bespoke LUTs (DaVinci)" },
        { label: "TEMPORAL FLICKER", value: "<1.5% Stabilized" }
      ]
    },
    {
      id: "06",
      title: "NEURAL NETWORK // MEDICAL TELEMETRY",
      category: "APP / STATE / ARCHITECTURE",
      categories: ["APP ARCHITECTURES"],
      tagline: "High-performance Next.js dashboard featuring real-time WebSocket streams and edge query caching.",
      description: "An enterprise medical telemetry dashboard built to monitor biosensor data in real time. Features secure server-sent events, a high-frequency canvas grapher, and cloud-edge caches that drop API responses down to single digit millisecond latencies.",
      bgGradient: "from-[#0d161d] via-slate-900 to-[#050507]",
      details: {
        client: "Neural Network Co.",
        timeline: "Q2 2026",
        role: "Full Stack Engineering & Systems Arch",
        engine: "Next.js / Zustand / Supabase / Vercel"
      },
      metrics: [
        { label: "DATABASE TIME", value: "<8ms Response" },
        { label: "WEB SOCKETS", value: "10,000+ Concurrent Streams" },
        { label: "CACHE HIT RATE", value: "99.2% Edge Cache Hit" },
        { label: "LINTING SCORE", value: "100% Strict Type Checked" }
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

    // Delay initialization slightly to let DOM sizes settle
    const timer = setTimeout(() => {
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
    }, 150);

    return () => {
      clearTimeout(timer);
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
      className="relative w-full h-screen bg-[#050507] overflow-hidden flex items-center"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[5%] top-[10%] w-[35vw] h-[35vw] bg-[#c5a880]/2 opacity-[0.01] blur-[120px] rounded-full" />
      </div>

      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-12 items-center justify-between">
          
          {/* Left column: Categories Sidebar */}
          <div className="w-full lg:w-[25%] flex flex-col gap-6 shrink-0 z-20 py-4">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
                [ CASE STUDIES ]
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[0.1em] text-white uppercase">
                WORKS
              </h2>
            </div>

            {/* Categories list */}
            <div className="flex flex-wrap lg:flex-col items-start gap-2.5 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    if (trackRef.current) {
                      gsap.set(trackRef.current, { x: 0 });
                    }
                  }}
                  className={`font-mono text-[10px] tracking-[0.2em] font-medium transition-all duration-300 py-1 cursor-pointer text-left ${
                    activeCategory === cat
                      ? "text-[#c5a880] border-l-2 border-[#c5a880] pl-3"
                      : "text-[#555566] hover:text-white pl-0"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right horizontal scrolling reel track */}
          <div className="w-full lg:w-[70%] overflow-hidden relative py-8">
            <div 
              ref={trackRef}
              className="flex gap-8 w-max pr-[25vw] items-center"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.4 }}
                    className="glass-card rounded-md p-6 flex flex-col justify-between w-[320px] sm:w-[380px] h-[300px] relative overflow-hidden group border border-white/5 shrink-0"
                  >
                    {/* Accent Background Gradient Glow on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${project.bgGradient} opacity-0 group-hover:opacity-[0.14] transition-opacity duration-500 pointer-events-none`} />

                    {/* Top header details */}
                    <div className="flex justify-between items-start z-10">
                      <span className="font-mono text-[9px] tracking-[0.2em] text-[#c5a880] uppercase">
                        {project.category}
                      </span>
                      <span className="font-mono text-sm font-bold text-white/20">
                        {project.id}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <div className="z-10 flex flex-col gap-2 my-auto">
                      <h3 className="font-outfit text-base font-bold tracking-[0.1em] text-white group-hover:text-[#c5a880] transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="font-sans text-xs text-[#9999aa] leading-relaxed line-clamp-3">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Footer and trigger button */}
                    <div className="z-10 border-t border-white/5 pt-4 flex items-center justify-between">
                      <span className="font-mono text-[8px] text-[#555566] tracking-wider uppercase">
                        {project.details.engine.split(" / ")[0]}
                      </span>
                      
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          (window as any).lenis?.stop();
                        }}
                        className="font-outfit text-[10px] font-semibold tracking-[0.2em] text-white/70 hover:text-white transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>METRICS</span>
                        <span className="text-[#c5a880] group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
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
            className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-6"
          >
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full max-w-2xl bg-[#0b0b0e] border border-[#c5a880]/30 rounded-md p-6 md:p-8 relative shadow-[0_0_50px_rgba(197,168,128,0.15)] flex flex-col gap-6"
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
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
                  {selectedProject.category}
                </span>
                <h3 className="font-outfit text-xl font-bold tracking-[0.1em] text-white">
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
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#555566] uppercase">PROJECT OVERVIEW</span>
                <p className="font-sans text-sm text-[#9999aa] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Metrics Grid Section */}
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#555566] uppercase flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>QUANTITATIVE METRICS</span>
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProject.metrics.map((metric, index) => (
                    <div key={index} className="bg-white/[0.02] border border-white/5 rounded p-3 flex justify-between items-center">
                      <span className="font-mono text-[10px] tracking-wider text-[#9999aa] uppercase">{metric.label}</span>
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
