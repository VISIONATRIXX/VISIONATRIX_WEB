"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Film, Sparkles, Box, Layers, Cpu, Smartphone, ScanFace, Eye, X } from "lucide-react";

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

function ServiceCard({ service, onClick, index }: { service: ServiceItem; onClick: () => void; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Position mapping (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dampened spring transformations for physical tilt response
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  // Floating glare tracking
  const glareOpacity = useSpring(useTransform(y, [-0.5, 0.5], [0.25, 0]), { stiffness: 150, damping: 20 });
  const glareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, scale: 0.88, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        delay: (index % 4) * 0.08, 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="glass-card w-full h-full rounded-md p-6 flex flex-col justify-between relative cursor-pointer group hover:border-[#c5a880]/30 transition-all duration-300 select-none overflow-hidden"
    >
      {/* Dynamic Glare Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#c5a880]/10 to-transparent pointer-events-none"
        style={{
          opacity: glareOpacity,
          left: glareX,
          top: glareY,
          filter: "blur(20px)",
        }}
      />

      <div style={{ transform: "translateZ(30px)" }} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-sm border border-[#c5a880]/20 flex items-center justify-center bg-[#c5a880]/5 group-hover:bg-[#c5a880]/15 transition-colors duration-300">
            {service.icon}
          </div>
          <span className="font-mono text-xs font-bold text-[#c5a880]/50 group-hover:text-[#c5a880] transition-colors duration-300">
            {service.id}
          </span>
        </div>

        <h3 className="font-outfit text-base sm:text-lg font-bold tracking-[0.1em] text-white group-hover:text-[#c5a880] transition-colors duration-300">
          {service.title}
        </h3>

        <p className="font-sans text-[11px] leading-relaxed text-[#9999aa] line-clamp-3">
          {service.description}
        </p>
      </div>

      <div style={{ transform: "translateZ(15px)" }} className="mt-6 flex justify-between items-end border-t border-white/5 pt-4">
        <span className="font-mono text-[8px] tracking-[0.15em] text-[#555566]">
          {service.hudTitle}
        </span>
        <span className="font-outfit text-[10px] tracking-[0.18em] text-[#c5a880] group-hover:text-white transition-colors duration-300 flex items-center gap-1">
          OBSERVE <span className="translate-y-[0.5px]">→</span>
        </span>
      </div>
    </motion.div>
  );
}

export default function ServicesSection({ onInquiryClick }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const services: ServiceItem[] = [
    {
      id: "01",
      title: "VIDEO EDITING",
      description: "We structure cinematic narratives, high-impact brand commercials, and director's cut releases utilizing tailored framing rhythms that command digital presence.",
      icon: <Film className="w-5 h-5 text-[#c5a880]" />,
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
      icon: <Sparkles className="w-5 h-5 text-[#c5a880]" />,
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
      icon: <Box className="w-5 h-5 text-[#c5a880]" />,
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
      icon: <Layers className="w-5 h-5 text-[#c5a880]" />,
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
      icon: <Cpu className="w-5 h-5 text-[#c5a880]" />,
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
      icon: <Smartphone className="w-5 h-5 text-[#c5a880]" />,
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
      icon: <ScanFace className="w-5 h-5 text-[#c5a880]" />,
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
      icon: <Eye className="w-5 h-5 text-[#c5a880]" />,
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

  return (
    <section 
      id="services" 
      className="relative min-h-screen flex items-center bg-[#050507] py-24 px-6 md:px-12 lg:px-24"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[5%] top-[10%] w-[45vw] h-[45vw] bg-[#c5a880]/2 opacity-[0.02] blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.4em] text-[#6b7280] uppercase">
              CAPABILITIES
            </span>
            <div className="w-8 h-[1px] bg-[#c5a880]/30" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl tracking-[0.08em] text-white mt-2 md:mt-0 uppercase">
            CREATIVE STACK
          </h2>
        </div>

        {/* 3D Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
              onClick={() => {
                setSelectedService(service);
                // Temporarily disable Lenis scroll
                (window as any).lenis?.stop();
              }}
            />
          ))}
        </div>
      </div>

      {/* Progressive Overlay Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            {/* Modal Card Frame */}
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="glass-card rounded-md max-w-3xl w-full p-6 md:p-10 relative max-h-[90vh] overflow-y-auto modal-scrollbar"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setSelectedService(null);
                  // Restore Lenis scroll
                  (window as any).lenis?.start();
                }}
                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer z-[11005]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                {/* HUD Telemetry (Left inside modal) */}
                <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8">
                  <div className="flex flex-col gap-6">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
                      {selectedService.hudTitle}
                    </span>
                    
                    <div className="flex flex-col gap-5">
                      {selectedService.hudItems.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <span className="font-mono text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                            {item.label}:
                          </span>
                          <span className="font-mono text-xs text-white/90 font-medium tracking-wide uppercase">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content Area (Right inside modal) */}
                <div className="md:col-span-7 flex flex-col justify-between pl-0 md:pl-4 pt-4 md:pt-0">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-sm border border-[#c5a880]/30 flex items-center justify-center bg-[#c5a880]/5">
                        {selectedService.icon}
                      </div>
                      <h3 className="font-outfit text-xl sm:text-2xl font-bold tracking-[0.12em] text-white">
                        {selectedService.title}
                      </h3>
                    </div>

                    <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#9999aa]">
                      {selectedService.description}
                    </p>

                    {/* Bullet Highlights */}
                    <div className="flex flex-col gap-2 mt-2">
                      {selectedService.bullets.map((bullet, idx) => (
                        <span key={idx} className="font-mono text-xs text-[#c5a880] tracking-wide">
                          {bullet}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools Stack & CTA Footer */}
                  <div className="border-t border-white/10 pt-6 mt-8 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end">
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                        DOMAIN TOOLS STACK
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.tools.map((tool, idx) => (
                          <span 
                            key={idx} 
                            className="font-mono border border-white/15 px-2.5 py-1 text-[10px] tracking-wider text-[#9999aa] bg-white/5 rounded-sm"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedService(null);
                        (window as any).lenis?.start();
                        onInquiryClick();
                      }}
                      className="font-outfit text-xs font-semibold tracking-[0.18em] text-[#c5a880] hover:text-white transition-colors duration-300 flex items-center gap-1.5 group/link pb-1 border-b border-transparent hover:border-[#c5a880] cursor-pointer"
                    >
                      <span>START INQUIRY</span>
                      <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
