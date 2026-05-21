"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Film, Sparkles, Box, Layers, Cpu, Smartphone, ScanFace, Eye } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  isIntroCompleted?: boolean;
}

export default function ServicesSection({ onInquiryClick, isIntroCompleted = false }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgCarRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    if (!isIntroCompleted) return; // Wait until intro is finished and Lenis coordinates stabilize
    if (typeof window === "undefined") return;
    
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    let mm = gsap.matchMedia();
    let scrollTween: gsap.core.Tween | null = null;

    const timer = setTimeout(() => {
      mm.add("(min-width: 1024px)", () => {
        // Direct individual card selection to prevent array hole issues
        const cards = services.map((_, idx) => cardRefs.current[idx]);
        const allPresent = cards.every((c) => c !== null);
        if (!allPresent) return;

        // Initial setup for cards positioning (centered stack layout)
        cards.forEach((card, idx) => {
          if (!card) return;
          if (idx === 0) {
            gsap.set(card, {
              xPercent: -50,
              yPercent: -50,
              y: 0,
              rotateX: 0,
              scale: 1,
              opacity: 1,
              pointerEvents: "auto",
              transformOrigin: "center center",
            });
          } else {
            gsap.set(card, {
              xPercent: -50,
              yPercent: -50,
              y: "110vh", // Position fully offscreen at bottom
              rotateX: -20,
              scale: 0.85,
              opacity: 0,
              pointerEvents: "none",
              transformOrigin: "center center",
            });
          }
        });

        // Initialize background car image scale
        if (bgCarRef.current) {
          gsap.set(bgCarRef.current, { scale: 1.0, yPercent: 0 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top top",
            end: () => `+=${window.innerHeight * 5}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const t = self.progress * tl.duration();
              let active = 0;
              if (t < 0.5) {
                active = 0;
              } else {
                active = Math.round((t - 0.25) / 1.5);
                active = Math.max(0, Math.min(services.length - 1, active));
              }
              setActiveIndex(active);
            }
          }
        });

        // Background car image parallax subtle shift
        if (bgCarRef.current) {
          tl.to(bgCarRef.current, {
            scale: 1.12,
            yPercent: -8,
            ease: "none",
            duration: (services.length - 1) * 1.5 + 0.5
          }, 0);
        }

        for (let i = 0; i < services.length - 1; i++) {
          const currentCard = cardRefs.current[i];
          const nextCard = cardRefs.current[i + 1];
          if (!currentCard || !nextCard) continue;

          // Hold active card static for reading
          tl.to({}, { duration: 0.5 });

          // Transition out current card (slide up and fade)
          tl.to(currentCard, {
            xPercent: -50,
            yPercent: -50,
            y: "-110vh", // Slide fully offscreen to top
            rotateX: 20,
            scale: 0.85,
            opacity: 0,
            pointerEvents: "none",
            ease: "power2.inOut",
            duration: 1
          }, `transition-${i}`);

          // Transition in next card (slide in from bottom)
          tl.fromTo(nextCard, {
            xPercent: -50,
            yPercent: -50,
            y: "110vh",
            rotateX: -20,
            scale: 0.85,
            opacity: 0,
            pointerEvents: "none"
          }, {
            xPercent: -50,
            yPercent: -50,
            y: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            pointerEvents: "auto",
            ease: "power2.inOut",
            duration: 1
          }, `transition-${i}`);
        }

        // Final hold for the last card
        tl.to({}, { duration: 0.5 });

        scrollTween = tl as any;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      mm.revert();
      if (scrollTween && (scrollTween as any).scrollTrigger) {
        (scrollTween as any).scrollTrigger.kill();
        scrollTween.kill();
      }
    };
  }, [isIntroCompleted]);

  const handlePaginationClick = (idx: number) => {
    const lenis = (window as any).lenis;
    const section = sectionRef.current;
    if (lenis && section) {
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const totalScrollDistance = window.innerHeight * 5;
      const D = (services.length - 1) * 1.5 + 0.5;
      const targetTime = idx * 1.5;
      const progress = targetTime / D;
      const targetScroll = sectionTop + progress * totalScrollDistance;

      lenis.scrollTo(targetScroll, {
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="relative w-full lg:h-screen bg-[#050507] py-16 lg:py-0 px-6 md:px-12 lg:px-24 flex flex-col justify-center overflow-hidden"
    >
      {/* Background soft lighting backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[5%] top-[10%] w-[45vw] h-[45vw] bg-[#c5a880]/[0.012] blur-[140px] rounded-full" />
      </div>

      {/* 3D Parallax Car Background Showcase */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden select-none z-0">
        <div 
          ref={bgCarRef}
          className="relative w-full max-w-5xl aspect-[16/9] opacity-[0.06] mix-blend-screen scale-110 filter blur-[0.5px] transition-all duration-300"
          style={{
            backgroundImage: "url('/services_bg_car.png')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 flex flex-col h-full lg:justify-between justify-center lg:py-16">
        
        {/* Section Header */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-8 lg:mb-12 shrink-0">
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

        {/* Space-Age Console Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch lg:flex-1 w-full relative">
          
          {/* Left Column: Cybernetic HUD Menu Sidebar (4 cols) */}
          <div className="hidden lg:flex flex-col justify-center gap-3.5 col-span-4 pl-6 border-l border-white/5 relative z-20 font-mono">
            {/* Ambient indicator bar */}
            <div className="absolute left-0 top-[10%] bottom-[10%] w-[1px] bg-gradient-to-b from-transparent via-[#c5a880]/15 to-transparent pointer-events-none" />

            {services.map((s, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => handlePaginationClick(idx)}
                  className="group flex items-center gap-4 text-left transition-all duration-300 py-1.5 focus:outline-none cursor-pointer relative"
                >
                  {/* Glowing active block line marker */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeHUDMarker"
                      className="absolute -left-[25px] w-1.5 h-6 bg-[#c5a880] shadow-[0_0_12px_rgba(197,168,128,0.7)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <span className={`text-[10px] tracking-wider transition-colors duration-300 font-medium ${isActive ? "text-[#c5a880]" : "text-white/20 group-hover:text-white/50"}`}>
                    {s.id}
                  </span>
                  
                  <span className={`font-mono text-[11px] tracking-[0.18em] uppercase transition-all duration-300 ${
                    isActive 
                      ? "text-[#c5a880] font-bold drop-shadow-[0_0_8px_rgba(197,168,128,0.4)] translate-x-2" 
                      : "text-white/40 group-hover:text-white/80 group-hover:translate-x-1"
                  }`}>
                    {isActive ? `[ ${s.title} ]` : s.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Elevator Deck (8 cols) */}
          <div className="lg:col-span-8 lg:relative lg:w-full lg:max-w-4xl lg:flex lg:items-center lg:justify-center lg:perspective-[2000px] lg:transform-style-3d flex flex-col gap-8 w-full min-h-[460px]">
            {services.map((service, index) => (
              <div
                key={service.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-4xl lg:h-[460px] lg:opacity-0 lg:pointer-events-none w-full h-auto flex flex-col p-6 md:p-10 lg:p-12 bg-[#09090c]/85 backdrop-blur-xl border border-white/5 hover:border-[#c5a880]/15 rounded-sm transition-colors duration-300 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Glass Glare Highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch h-full w-full">
                  
                  {/* Left Column: Specs HUD */}
                  <div className="lg:col-span-5 flex flex-col justify-center border-l border-[#c5a880]/20 pl-6 lg:pr-8 py-2">
                    <div className="flex flex-col gap-6">
                      <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
                        {service.hudTitle}
                      </span>
                      
                      <div className="flex flex-col gap-4">
                        {service.hudItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 font-mono group/item">
                            <span className="text-[9px] tracking-[0.2em] text-[#6b7280] uppercase group-hover/item:text-[#c5a880]/70 transition-colors duration-300">
                              {item.label}
                            </span>
                            <span className="text-xs text-white/95 font-medium tracking-wide uppercase text-right group-hover/item:text-[#c5a880] transition-colors duration-300">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Content */}
                  <div className="lg:col-span-7 flex flex-col justify-between pl-0 lg:pl-4 pt-4 lg:pt-0">
                    
                    {/* Service ID, Title & Icon */}
                    <div className="flex flex-col gap-4">
                      <div className="flex">
                        <span className="font-mono text-xs font-bold text-[#c5a880] border-b border-[#c5a880]/30 pb-0.5 pr-3 tracking-widest">
                          {service.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-1">
                        <div className="w-11 h-11 rounded-sm border border-[#c5a880]/30 flex items-center justify-center bg-[#c5a880]/5">
                          {service.icon}
                        </div>
                        <h3 className="font-outfit text-xl sm:text-2xl font-black tracking-[0.1em] text-white uppercase">
                          {service.title}
                        </h3>
                      </div>

                      <p className="font-sans text-[12px] sm:text-[13px] leading-relaxed text-[#9999aa] mt-2">
                        {service.description}
                      </p>

                      {/* Highlights Bullet Lines */}
                      <div className="flex flex-col gap-2 mt-2">
                        {service.bullets.map((bullet, idx) => (
                          <span key={idx} className="font-mono text-[11px] text-[#c5a880]/80 tracking-wide font-medium">
                            {bullet}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Domain Tools & CTA Footer */}
                    <div className="border-t border-white/10 pt-4 lg:pt-6 mt-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end shrink-0">
                      
                      {/* Domain Tools badges */}
                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[8px] tracking-[0.2em] text-[#6b7280] uppercase">
                          DOMAIN TOOLS STACK
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {service.tools.map((tool, idx) => (
                            <span 
                              key={idx} 
                              className="font-mono border border-white/10 px-2 py-0.5 text-[9px] tracking-wider text-[#9999aa] bg-white/5 rounded-sm"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Inquiry Button */}
                      <button 
                        onClick={onInquiryClick}
                        className="font-outfit text-xs font-semibold tracking-[0.18em] text-[#c5a880] hover:text-white transition-colors duration-300 flex items-center gap-1.5 group/link pb-1 border-b border-transparent hover:border-[#c5a880] cursor-pointer"
                      >
                        <span>START INQUIRY</span>
                        <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
