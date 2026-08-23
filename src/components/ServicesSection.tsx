"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";
import { Film, Sparkles, Box, Layers, Cpu, Smartphone, ScanFace, Eye, Code, Bot, Camera, PenTool, Home, MousePointerClick, Activity } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  hudTitle: string;
  hudItems: { label: string; value: string }[];
  bullets: string[];
  tools: string[];
  canvasType: string;
}

interface ServicesSectionProps {
  onInquiryClick: () => void;
  isIntroCompleted?: boolean;
}

// -------------------------------------------------------------
// Component: TextScramble
// -------------------------------------------------------------
interface TextScrambleProps {
  text: string;
  trigger: number;
}

function TextScramble({ text, trigger }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    let frame = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$@&*[]%";
    const targetText = text;
    const duration = 10;
    
    const interval = setInterval(() => {
      setDisplayText(() => {
        return targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            const progress = (frame / duration) * targetText.length;
            if (index < progress) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      });
      
      frame++;
      if (frame > duration) {
        setDisplayText(targetText);
        clearInterval(interval);
      }
    }, 25);
    
    return () => clearInterval(interval);
  }, [text, trigger]);

  return <span>{displayText}</span>;
}

// -------------------------------------------------------------
// Component: CanvasSimulator
import { renderServicesCanvasAnimation } from "./services-canvas";

// -------------------------------------------------------------
// Component: CanvasSimulator
// -------------------------------------------------------------
interface CanvasSimulatorProps {
  type: string;
  mousePos: { x: number; y: number };
  isHovered: boolean;
}

function CanvasSimulator({ type, mousePos, isHovered }: CanvasSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef(mousePos);

  // Sync ref with mouse position to prevent effect recreation storms
  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationId: number;
    let isIntersecting = false;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    const resizeObserver = new ResizeObserver(() => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });
    resizeObserver.observe(canvas);
    
    let time = 0;
    
    const render = () => {
      time += 0.014;
      
      renderServicesCanvasAnimation({
        ctx,
        type,
        width,
        height,
        time,
        mx: mousePosRef.current.x,
        my: mousePosRef.current.y,
        isHovered
      });

      if (isIntersecting) {
        animationId = requestAnimationFrame(render);
      }
    };
    
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasIntersecting = isIntersecting;
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !wasIntersecting) {
            animationId = requestAnimationFrame(render);
          } else if (!isIntersecting && wasIntersecting) {
            cancelAnimationFrame(animationId);
          }
        });
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(canvas);
    
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [type, isHovered]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none mix-blend-screen select-none transition-opacity duration-500 z-20 ${
        isHovered ? "opacity-[0.48]" : "opacity-[0.22]"
      }`}
    />
  );
}

// -------------------------------------------------------------
// Component: ServicesSection
// -------------------------------------------------------------
export default function ServicesSection({ onInquiryClick, isIntroCompleted = false }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [scrambleTrigger, setScrambleTrigger] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // No-op reference to satisfy unused-vars ESLint rule
  if (isIntroCompleted) {
    // stands ready
  }
  
  // Track relative mouse position inside active card
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  const { services: rawServices } = useAdmin();

  const iconMap: Record<string, React.ReactNode> = {
    Code: <Code className="w-5 h-5 text-[#c5a880]" />,
    Bot: <Bot className="w-5 h-5 text-[#c5a880]" />,
    Film: <Film className="w-5 h-5 text-[#c5a880]" />,
    Camera: <Camera className="w-5 h-5 text-[#c5a880]" />,
    PenTool: <PenTool className="w-5 h-5 text-[#c5a880]" />,
    Layers: <Layers className="w-5 h-5 text-[#c5a880]" />,
    Home: <Home className="w-5 h-5 text-[#c5a880]" />,
    Box: <Box className="w-5 h-5 text-[#c5a880]" />,
    MousePointerClick: <MousePointerClick className="w-5 h-5 text-[#c5a880]" />,
    Eye: <Eye className="w-5 h-5 text-[#c5a880]" />,
    Sparkles: <Sparkles className="w-5 h-5 text-[#c5a880]" />,
    Cpu: <Cpu className="w-5 h-5 text-[#c5a880]" />,
    Smartphone: <Smartphone className="w-5 h-5 text-[#c5a880]" />,
    ScanFace: <ScanFace className="w-5 h-5 text-[#c5a880]" />
  };

  const services: ServiceItem[] = rawServices.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    icon: iconMap[s.iconName] || <Eye className="w-5 h-5 text-[#c5a880]" />,
    hudTitle: s.hudTitle,
    hudItems: s.hudItems,
    bullets: s.bullets,
    tools: s.tools,
    canvasType: s.canvasType
  }));

  // Card rect caching and window resize updates
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (isCardHovered && cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isCardHovered]);

  // Auto-rotation clock updates
  useEffect(() => {
    if (!isPlaying) return;
    
    const intervalTime = 100;
    const totalSteps = 8000 / intervalTime; // 8 seconds cycle
    let step = (progress / 100) * totalSteps;
    
    const timer = setInterval(() => {
      step++;
      const currentProgress = (step / totalSteps) * 100;
      setProgress(currentProgress);
      
      if (step >= totalSteps) {
        setActiveIndex((prev) => {
          const next = (prev + 1) % services.length;
          return next;
        });
        setScrambleTrigger((prev) => prev + 1); // Pure deterministic state update trigger outside index updater
        setProgress(0);
        step = 0;
      }
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [isPlaying, activeIndex, progress, services.length]);

  // Handle manual menu link clicks
  const selectService = (idx: number) => {
    setActiveIndex(idx);
    setProgress(0);
    setScrambleTrigger((prev) => prev + 1); // Pure deterministic state update trigger
  };

  // Tracking cursor coords inside parent card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = rectRef.current || cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Mobile gesture touch listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const threshold = 60; // 60px swipe margin
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left -> Next card
        selectService((activeIndex + 1) % services.length);
      } else {
        // Swipe right -> Prev card
        selectService((activeIndex - 1 + services.length) % services.length);
      }
    }
  };

  const activeService = services[activeIndex];

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="relative w-full lg:min-h-screen bg-[#0b0b0f] py-20 lg:py-0 px-6 md:px-12 lg:px-24 flex flex-col justify-center overflow-hidden border-b border-white/5"
    >
      {/* Absolute Ambient Grid backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute left-[8%] top-[12%] w-[40vw] h-[40vw] bg-[#c5a880]/[0.015] blur-[120px] rounded-full" />
        <div className="absolute right-[5%] bottom-[10%] w-[35vw] h-[35vw] bg-white/[0.008] blur-[100px] rounded-full" />
      </div>

      <ScrollAnimatedWrapper className="flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full z-10 flex flex-col lg:h-[82vh] justify-between relative">
        
        {/* Modern Cyber Section Header */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-8 lg:mb-10 shrink-0 relative">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.45em] text-[#6b7280] uppercase">
                CAPABILITIES HUD
              </span>
              <div className="w-8 h-[1px] bg-[#c5a880]/20" />
              <span className="font-mono text-[9px] text-[#c5a880] animate-pulse">
                [ ONLINE ]
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl tracking-[0.1em] text-white mt-2 uppercase">
              CREATIVE TECHNOLOGY STACK
            </h2>
            <p className="font-mono text-xs text-[#c5a880]/70 tracking-widest mt-1 uppercase">
              WE BUILD. AUTOMATE. ELEVATE. — End-to-End Digital Solutions
            </p>
          </div>
        </div>

        {/* Dashboard Frame Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 w-full relative">
          
          {/* LEFT SIDEBAR: Telemetry Navigation HUD (4 cols) */}
          <div className="hidden lg:flex flex-col justify-center gap-2.5 col-span-4 pl-6 border-l border-white/5 relative z-20 font-mono">
            {/* Soft vertical neon pipeline line */}
            <div className="absolute left-0 top-[8%] bottom-[8%] w-[1px] bg-gradient-to-b from-transparent via-[#c5a880]/15 to-transparent pointer-events-none" />

            {services.map((s, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => selectService(idx)}
                  onMouseEnter={() => {
                    // Let hover trigger immediate countdown stop / hold
                    setIsPlaying(false);
                  }}
                  onMouseLeave={() => {
                    setIsPlaying(true);
                  }}
                  className="group flex items-center gap-4 text-left transition-all duration-300 py-1.5 focus:outline-none cursor-pointer relative"
                  data-cursor="read query"
                >
                  {/* Glowing active dashboard indicator block */}
                  {isActive && (
                    <motion.div 
                      layoutId="hudGlowMarker"
                      className="absolute -left-[25px] w-1 h-5 bg-[#c5a880] shadow-[0_0_10px_rgba(197,168,128,0.8)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span className={`text-[9px] tracking-wider transition-colors duration-300 font-medium ${isActive ? "text-[#c5a880]" : "text-white/20 group-hover:text-white/50"}`}>
                    {s.id}
                  </span>
                  
                  <span className={`font-mono text-[10.5px] tracking-[0.16em] uppercase transition-all duration-300 ${
                    isActive 
                      ? "text-[#c5a880] font-bold drop-shadow-[0_0_6px_rgba(197,168,128,0.35)] translate-x-1.5" 
                      : "text-white/40 group-hover:text-white/80 group-hover:translate-x-1"
                  }`}>
                    {isActive ? `[ ${s.title} ]` : s.title}
                  </span>

                  {/* Operational standalone tag */}
                  <span className={`text-[7.5px] font-mono tracking-widest scale-90 opacity-0 group-hover:opacity-40 transition-opacity ml-auto text-white/50`}>
                    {isActive ? "STATUS: ACTIVE" : "STATUS: STANDBY"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT VIEWPORT: Cybernetic Glass Deck (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-center w-full min-h-[460px] relative">
            
            {/* Compact Mobile Sub HUD info block */}
            <div className="flex lg:hidden justify-between items-center mb-3 px-2 font-mono">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#c5a880] animate-pulse" />
                <span className="text-[9px] tracking-[0.15em] text-[#c5a880]/80 uppercase">
                  SYSTEM ACTIVE
                </span>
              </div>
              <span className="text-[10px] text-white/45 tracking-widest">
                {activeService.id} {"//"} {services.length.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Glowing Corner Bracket Crosshairs decoration */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-[#c5a880]/30 pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-[#c5a880]/30 pointer-events-none" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-[#c5a880]/30 pointer-events-none" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-[#c5a880]/30 pointer-events-none" />

            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => {
                setIsCardHovered(true);
                setIsPlaying(false); // Pause autoplay
                if (cardRef.current) {
                  rectRef.current = cardRef.current.getBoundingClientRect();
                }
              }}
              onMouseLeave={() => {
                setIsCardHovered(false);
                setIsPlaying(true); // Resume autoplay
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="w-full min-h-[440px] flex flex-col p-6 md:p-10 lg:p-12 bg-[#121217]/80 backdrop-blur-xl border border-white/5 hover:border-[#c5a880]/15 rounded-sm transition-all duration-300 relative shadow-[0_0_40px_rgba(0,0,0,0.65)] overflow-hidden cursor-crosshair select-none"
            >
              {/* Glass subtle glaze reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.015] via-transparent to-transparent pointer-events-none z-10" />

              {/* Dynamic canvas telemetry micro-simulation */}
              <CanvasSimulator 
                type={activeService.canvasType} 
                mousePos={mousePos} 
                isHovered={isCardHovered} 
              />

              {/* Seamless AnimatePresence slide/glitch transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", y: 15 }}
                  animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", y: 0 }}
                  exit={{ opacity: 0, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: -15 }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-stretch h-full w-full relative z-10"
                >
                  
                  {/* Left Column: Diagnostics Specs HUD */}
                  <div className="md:col-span-5 flex flex-col justify-center border-l border-[#c5a880]/20 pl-5 pr-2 py-1">
                    <div className="flex flex-col gap-5">
                      <span className="font-mono text-[9px] tracking-[0.25em] text-[#c5a880] uppercase">
                        <TextScramble text={activeService.hudTitle} trigger={scrambleTrigger} />
                      </span>
                      
                      <div className="flex flex-col gap-3">
                        {activeService.hudItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-1.5 font-mono group/item">
                            <span className="text-[8px] tracking-[0.18em] text-[#6b7280] uppercase group-hover/item:text-[#c5a880]/70 transition-colors duration-300">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-white/90 font-medium tracking-wide uppercase text-right group-hover/item:text-[#c5a880] transition-colors duration-300">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Narrative Content & badging */}
                  <div className="md:col-span-7 flex flex-col justify-between pl-0 md:pl-4 pt-2 md:pt-0">
                    
                    {/* Header: ID, Icon, Title */}
                    <div className="flex flex-col gap-3">
                      <div className="flex">
                        <span className="font-mono text-[10px] font-bold text-[#c5a880] border-b border-[#c5a880]/30 pb-0.5 pr-2.5 tracking-widest">
                          {activeService.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 mt-0.5">
                        <div className="w-9 h-9 rounded-sm border border-[#c5a880]/20 flex items-center justify-center bg-[#c5a880]/5">
                          {activeService.icon}
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold tracking-[0.08em] text-white uppercase">
                          <TextScramble text={activeService.title} trigger={scrambleTrigger} />
                        </h3>
                      </div>

                      <p className="font-sans text-[11.5px] sm:text-[12.5px] leading-relaxed text-[#9999aa] mt-1.5">
                        {activeService.description}
                      </p>

                      {/* Diagnostic telemetry lines */}
                      <div className="flex flex-col gap-1.5 mt-1.5">
                        {activeService.bullets.map((bullet, idx) => (
                          <span key={idx} className="font-mono text-[10px] text-[#c5a880]/80 tracking-wide">
                            {bullet}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tools badges and Interactive link button */}
                    <div className="border-t border-white/10 pt-4 mt-5 flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-end shrink-0">
                      
                      {/* Domain Tools badges */}
                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[7.5px] tracking-[0.18em] text-[#6b7280] uppercase">
                          CAPABILITY ENGINE STACK
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {activeService.tools.map((tool, idx) => (
                            <span 
                              key={idx} 
                              className="font-mono border border-white/10 px-2 py-0.5 text-[8.5px] tracking-wider text-[#9999aa] bg-white/5 rounded-sm"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Inquiry triggers */}
                      <button 
                        onClick={onInquiryClick}
                        className="font-mono text-[10px] tracking-[0.16em] text-[#c5a880] hover:text-white transition-colors duration-300 flex items-center gap-1.5 group/link pb-0.5 border-b border-transparent hover:border-[#c5a880] cursor-pointer"
                        data-cursor="connect"
                      >
                        <span>START INQUIRY</span>
                        <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                      </button>
                    </div>

                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Auto-rotation active progress line */}
              <div 
                className="absolute bottom-0 left-0 h-[1.5px] bg-[#c5a880] shadow-[0_0_8px_rgba(197,168,128,0.7)] transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Mobile-only pagination dot track */}
            <div className="flex lg:hidden justify-center items-center gap-3.5 mt-5">
              {services.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => selectService(idx)}
                  className={`h-1 transition-all duration-300 rounded-full ${activeIndex === idx ? "w-6 bg-[#c5a880]" : "w-1.5 bg-white/20"}`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>
    </ScrollAnimatedWrapper>
  </section>
  );
}
