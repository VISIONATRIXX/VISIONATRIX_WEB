"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Sparkles, Layers, Box, Cpu, Smartphone, ScanFace, Eye } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  hudTitle: string;
  hudItems: { label: string; value: string }[];
  bullets: string[];
  tools: string[];
}

interface ServicesSectionProps {
  onInquiryClick: () => void;
}

export default function ServicesSection({ onInquiryClick }: ServicesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services: ServiceItem[] = [
    {
      id: "01",
      title: "VIDEO EDITING",
      description: "We structure cinematic narratives, high-impact brand commercials, and director's cut releases utilizing tailored framing rhythms that command digital presence.",
      icon: <Film className="w-6 h-6 text-gold" />,
      hudTitle: "[ PRODUCTION HUD ]",
      hudItems: [
        { label: "FOCUS", value: "Cinematic Narrative" },
        { label: "OUTPUT", value: "4K / 8K Master Deliveries" },
        { label: "COLOR", value: "Bespoke Color Gradients" },
        { label: "TECH", value: "DaVinci Resolve / Premiere" }
      ],
      bullets: [
        "// Soundscapes Synthesis",
        "// Rhythmic Staccato Edits",
        "// Haute Couture Commercials"
      ],
      tools: ["DaVinci Resolve", "Premiere Pro", "After Effects", "Avid Link"]
    },
    {
      id: "02",
      title: "VFX SIMULATIONS",
      description: "We simulate and composite hyper-realistic environmental phenomena, particle streams, and digital cosmetics tailored for cinema and high-fashion advertising campaigns.",
      icon: <Sparkles className="w-6 h-6 text-gold" />,
      hudTitle: "[ COMPOSITING HUD ]",
      hudItems: [
        { label: "FOCUS", value: "Photoreal FX" },
        { label: "OUTPUT", value: "DeepEXR Sequences" },
        { label: "GRAIN", value: "Camera-matched Noise" },
        { label: "TECH", value: "Nuke / Houdini" }
      ],
      bullets: [
        "// Fluid Dynamics Simulations",
        "// Photorealistic Compositing",
        "// Deep Compositing Workflows"
      ],
      tools: ["Nuke", "Houdini", "PFTrack", "Syntheyes"]
    },
    {
      id: "03",
      title: "CGI ADVERTISING",
      description: "We construct cinematic luxury product renders, automotive concept visualizations, and bespoke promotional sequences engineered to bridge commercial luxury with futuristic aesthetics.",
      icon: <Box className="w-6 h-6 text-gold" />,
      hudTitle: "[ RENDER SPECS ]",
      hudItems: [
        { label: "PIPELINE", value: "Sub-pixel Raytracing" },
        { label: "MATERIALS", value: "Physically Based Shading" },
        { label: "RESOLUTIONS", value: "8K Master Projections" },
        { label: "AUDIENCE", value: "Luxury B2B Focus" }
      ],
      bullets: [
        "// 3D Raytraced Metamorphs",
        "// Physically Accurate Textures",
        "// Luxury Architectural Shaders"
      ],
      tools: ["Blender 3D", "Cinema 4D", "Redshift", "Octane Render"]
    },
    {
      id: "04",
      title: "ENVIRONMENT CREATION",
      description: "We build sprawling virtual landscapes, digital twin showrooms, and interactive sensory environments rendered in real-time utilizing state-of-the-art geometry pipelines.",
      icon: <Layers className="w-6 h-6 text-gold" />,
      hudTitle: "[ SPATIAL DIAGNOSTICS ]",
      hudItems: [
        { label: "GEOMETRY", value: "Bespoke Megascans" },
        { label: "LIGHTING", value: "Lumen / Path Tracer" },
        { label: "DETAIL", value: "Sub-millimeter Micro-mesh" },
        { label: "TECH", value: "Unreal Engine 5.5" }
      ],
      bullets: [
        "// Realtime Virtual Sets",
        "// Procedural Terrain Generation",
        "// High-fidelity Digital Twins"
      ],
      tools: ["Unreal Engine 5", "SpeedTree", "Quixel Bridge", "Substance Painter"]
    },
    {
      id: "05",
      title: "WEBGL WEB CODE",
      description: "We write bespoke WebGL shaders, fluid simulation portals, and 3D websites that load in milliseconds and deliver silky-smooth interactions on any device.",
      icon: <Cpu className="w-6 h-6 text-gold" />,
      hudTitle: "[ RENDER CORE ]",
      hudItems: [
        { label: "ENGINE", value: "Three.js / WebGL" },
        { label: "PERFORMANCE", value: "60 FPS Locked" },
        { label: "SHADERS", value: "Custom GLSL Noise" },
        { label: "TECH", value: "React Three Fiber" }
      ],
      bullets: [
        "// Custom GLSL Shader Art",
        "// Interactive Physics Systems",
        "// Headless WebGL Engines"
      ],
      tools: ["Three.js", "GLSL", "React Three Fiber", "Vite"]
    },
    {
      id: "06",
      title: "APP ARCHITECTURES",
      description: "We design enterprise-grade mobile interfaces and robust cloud platforms optimized for extreme speed, security, and complex spatial UI interactions.",
      icon: <Smartphone className="w-6 h-6 text-gold" />,
      hudTitle: "[ SYSTEMS METRICS ]",
      hudItems: [
        { label: "FRAMEWORK", value: "Next.js / React Native" },
        { label: "STATE", value: "Zustand / Redux" },
        { label: "DATABASE", value: "Supabase / PostgreSQL" },
        { label: "TECH", value: "Vercel Edge API" }
      ],
      bullets: [
        "// Edge API Handlers",
        "// Micro-frontend Schemes",
        "// Realtime Database Sync"
      ],
      tools: ["Next.js", "React Native", "Supabase", "Tailwind CSS"]
    },
    {
      id: "07",
      title: "AI PRODUCTION SHOOTS",
      description: "We direct AI-driven commercial productions and campaign photography, combining traditional cinematography guidelines with state-of-the-art latent models.",
      icon: <ScanFace className="w-6 h-6 text-gold" />,
      hudTitle: "[ LATENT HUD ]",
      hudItems: [
        { label: "SAMPLING", value: "Flux / SDXL" },
        { label: "UPSCALE", value: "4K Magnific AI" },
        { label: "CONSISTENCY", value: "IP-Adapter / ControlNet" },
        { label: "TECH", value: "ComfyUI Nodes" }
      ],
      bullets: [
        "// Latent Temporal Consistency",
        "// Hyper-premium Character Design",
        "// ControlNet Directed Framing"
      ],
      tools: ["ComfyUI", "Stable Diffusion", "Midjourney", "Photoshop AI"]
    },
    {
      id: "08",
      title: "VR & SPATIAL XR",
      description: "We code fully immersive volumetric environments, spatial computed applications, and hand-tracked simulations pushing the boundaries of human presence.",
      icon: <Eye className="w-6 h-6 text-gold" />,
      hudTitle: "[ OPTICAL TELEMETRY ]",
      hudItems: [
        { label: "TARGET", value: "Vision Pro / Quest" },
        { label: "TRACKING", value: "6DoF Hand Tracking" },
        { label: "VOLUMETRIC", value: "Gaussian Splatting" },
        { label: "TECH", value: "Unity / WebXR" }
      ],
      bullets: [
        "// Spatial UI/UX Architecture",
        "// 3D Gaussian Splat Ingestion",
        "// Low Latency Spatial Feeds"
      ],
      tools: ["Unity 3D", "WebXR", "OpenXR", "Swift / VisionOS"]
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" }
    })
  };

  return (
    <section 
      id="services" 
      className="snap-section flex items-center bg-[#050507] py-20 px-6 md:px-12 lg:px-24"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[5%] top-[10%] w-[45vw] h-[45vw] bg-[#c5a880]/2 opacity-[0.02] blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        
        {/* Left Side: Rotated Capabilities text */}
        <div className="lg:col-span-1 flex lg:flex-col items-center gap-4 lg:gap-8 border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-8 lg:h-96 justify-center">
          <span className="font-sans text-xs tracking-[0.4em] text-[#6b7280] uppercase lg:rotate-270 whitespace-nowrap">
            CAPABILITIES
          </span>
          <div className="w-12 lg:w-[1px] h-[1px] lg:h-32 bg-[#c5a880]/30" />
        </div>

        {/* Main Content: Slider Container */}
        <div className="lg:col-span-11 relative flex flex-col items-center">
          
          {/* Card Frame */}
          <div className="w-full min-h-[500px] md:min-h-[440px] relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentIndex}
                className="w-full glass-card rounded-md p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch relative"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                
                {/* 1. HUD Panel (Left inside card) */}
                <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-8">
                  <div className="flex flex-col gap-5">
                    <span className="font-sans text-[10px] tracking-[0.25em] text-[#6b7280]">
                      {services[currentIndex].hudTitle}
                    </span>
                    
                    <div className="flex flex-col gap-4">
                      {services[currentIndex].hudItems.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-0.5">
                          <span className="font-sans text-[9px] tracking-[0.2em] text-[#555566] uppercase">
                            {item.label}
                          </span>
                          <span className="font-sans text-xs text-white/90 font-medium">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Main Description (Right inside card) */}
                <div className="md:col-span-8 flex flex-col justify-between pl-0 md:pl-4">
                  {/* Top Header details inside card */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-sm border border-[#c5a880]/30 flex items-center justify-center bg-[#c5a880]/5">
                        {services[currentIndex].icon}
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-[0.15em] text-white">
                        {services[currentIndex].title}
                      </h3>
                    </div>
                    
                    {/* Floating index identifier */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-display text-sm font-bold text-[#c5a880]">
                        {services[currentIndex].id}
                      </span>
                      <div className="w-6 h-[1px] bg-[#c5a880]" />
                    </div>
                  </div>

                  {/* Description Paragraph */}
                  <p className="font-sans text-xs sm:text-sm md:text-base leading-relaxed text-[#9999aa] mb-6">
                    {services[currentIndex].description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="flex flex-col gap-2 mb-6">
                    {services[currentIndex].bullets.map((bullet, idx) => (
                      <span key={idx} className="font-mono text-xs text-white/50 tracking-wide">
                        {bullet}
                      </span>
                    ))}
                  </div>

                  {/* Tools Stack & Call to action */}
                  <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end">
                    <div className="flex flex-col gap-2.5">
                      <span className="font-sans text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                        DOMAIN TOOLS STACK
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {services[currentIndex].tools.map((tool, idx) => (
                          <span 
                            key={idx} 
                            className="border border-white/10 px-2.5 py-1 text-[10px] tracking-wider text-[#9999aa] bg-white/2 rounded-sm"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={onInquiryClick}
                      className="font-sans text-xs font-semibold tracking-[0.18em] text-[#c5a880] hover:text-white transition-colors duration-300 flex items-center gap-1.5 group/link pb-1 border-b border-transparent hover:border-[#c5a880] cursor-pointer"
                    >
                      <span>START INQUIRY</span>
                      <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                    </button>
                  </div>

                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full mt-8 px-4 z-20">
            {/* Slide Count */}
            <div className="font-mono text-xs text-[#555566] tracking-[0.2em]">
              [ <span className="text-[#c5a880]">{services[currentIndex].id}</span> / {services.length.toString().padStart(2, '0')} ]
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-2">
              {services.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? "bg-[#c5a880] w-6" 
                      : "bg-white/15 hover:bg-[#c5a880]/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Nav Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#9999aa] hover:text-[#c5a880] hover:border-[#c5a880]/30 transition-all duration-300 cursor-pointer"
                aria-label="Previous slide"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#9999aa] hover:text-[#c5a880] hover:border-[#c5a880]/30 transition-all duration-300 cursor-pointer"
                aria-label="Next slide"
              >
                →
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
