"use client";

import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";
import { Film, Sparkles, Box, Layers, Cpu, Smartphone, ScanFace, Eye, Code, Bot, Camera, PenTool, Home, MousePointerClick, Activity } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { renderServicesCanvasAnimation } from "./services-canvas";

// -------------------------------------------------------------
// Component: CanvasSimulator (High-Performance 2D Canvas Overlay)
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
    let lastRenderTime = 0;
    
    let width = canvas.width = canvas.clientWidth || 300;
    let height = canvas.height = canvas.clientHeight || 200;
    
    const resizeObserver = new ResizeObserver((entries) => {
      if (!canvas || !entries[0]) return;
      const { width: w, height: h } = entries[0].contentRect;
      if (w > 0 && h > 0) {
        width = canvas.width = w;
        height = canvas.height = h;
      }
    });
    resizeObserver.observe(canvas);
    
    let time = 0;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    const frameInterval = isMobile ? 33 : 16; // 30 FPS on mobile for GPU optimization, 60 FPS on desktop

    const render = (now: number) => {
      if (now - lastRenderTime >= frameInterval) {
        lastRenderTime = now;
        time += 0.016;
        
        // Provide synthetic center coords on mobile/unhovered state for autonomous ambient animation
        const mx = mousePosRef.current.x > 0 ? mousePosRef.current.x : width / 2;
        const my = mousePosRef.current.y > 0 ? mousePosRef.current.y : height / 2;

        renderServicesCanvasAnimation({
          ctx,
          type,
          width,
          height,
          time,
          mx,
          my,
          isHovered: isHovered || isMobile // Keep active rendering mode on mobile touch screens
        });
      }

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
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen select-none transition-opacity duration-500 z-20 opacity-70 md:opacity-[0.35] md:group-hover:opacity-[0.70]"
    />
  );
}

// -------------------------------------------------------------
// Component: ServicesSection
// -------------------------------------------------------------
const ServicesSection = memo(function ServicesSection({ onInquiryClick, isIntroCompleted = false }: { onInquiryClick: () => void; isIntroCompleted?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [scrambleTrigger, setScrambleTrigger] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    Sparkles: <Sparkles className="w-5 h-5 text-[#c5a880]" />,
    Cpu: <Cpu className="w-5 h-5 text-[#c5a880]" />,
    Smartphone: <Smartphone className="w-5 h-5 text-[#c5a880]" />,
    ScanFace: <ScanFace className="w-5 h-5 text-[#c5a880]" />,
    Eye: <Eye className="w-5 h-5 text-[#c5a880]" />,
  };

  const services = rawServices.map((s) => ({
    ...s,
    icon: iconMap[s.iconName] || <Sparkles className="w-5 h-5 text-[#c5a880]" />,
  }));

  const activeService = services[activeIndex] || services[0];

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
        setProgress(0);
        step = 0;
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, progress, services.length]);

  // Trigger scramble on active index change
  useEffect(() => {
    setScrambleTrigger((prev) => prev + 1);
    setProgress(0);
  }, [activeIndex]);

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

    if (diff > threshold) {
      // Swiped Left -> Next
      setActiveIndex((prev) => (prev + 1) % services.length);
    } else if (diff < -threshold) {
      // Swiped Right -> Prev
      setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
    }
  };

  if (!activeService) return null;

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="relative w-full min-h-screen bg-[#050507] py-24 md:py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[10%] top-[20%] w-[50vw] h-[50vw] bg-[#c5a880]/[0.015] blur-[150px] rounded-full" />
      </div>

      <ScrollAnimatedWrapper>
        <div className="max-w-7xl mx-auto w-full z-10 flex flex-col gap-12">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-[#c5a880] uppercase font-bold">
                [ CAPABILITY ARCHITECTURE ]
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-[0.06em] text-white uppercase">
                STUDIO SERVICES
              </h2>
            </div>

            {/* Mobile Controls & Step Indicator */}
            <div className="flex items-center gap-4 self-start md:self-auto">
              <span className="font-mono text-xs text-[#c5a880] tracking-widest uppercase">
                {String(activeIndex + 1).padStart(2, "0")} // {String(services.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                data-cursor="toggle rotation"
                className="p-2 border border-white/10 hover:border-[#c5a880]/40 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
                title={isPlaying ? "Pause rotation" : "Play rotation"}
              >
                <Activity className={`w-4 h-4 ${isPlaying ? "text-[#c5a880]" : "text-white/40"}`} />
              </button>
            </div>
          </div>

          {/* Main Interactive Service Display Card */}
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => {
              setIsCardHovered(true);
              if (cardRef.current) {
                rectRef.current = cardRef.current.getBoundingClientRect();
              }
            }}
            onMouseLeave={() => setIsCardHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="glass-card rounded-2xl border border-white/10 p-6 md:p-12 relative overflow-hidden min-h-[480px] flex flex-col justify-between group shadow-2xl transition-all duration-500"
          >
            {/* 2D Canvas Dynamic Interactive Simulation Overlay — Vibrant on Mobile & Desktop */}
            <CanvasSimulator 
              type={activeService.canvasType || "mesh"} 
              mousePos={mousePos}
              isHovered={isCardHovered}
            />

            {/* Top HUD Metadata Row */}
            <div className="flex justify-between items-start z-30 relative border-b border-white/10 pb-6">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#c5a880] uppercase">
                  [ {activeService.hudTitle || "OPTICAL STUDIO"} ]
                </span>
              </div>
              
              <div className="hidden sm:flex flex-wrap gap-4 text-right">
                {activeService.hudItems?.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <span className="font-mono text-[8px] tracking-[0.15em] text-white/40 uppercase">
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.1em] text-white font-semibold uppercase">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Main Content */}
            <div className="flex flex-col gap-6 z-30 relative my-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl border border-[#c5a880]/30 bg-[#c5a880]/10 text-[#c5a880] shadow-[0_0_20px_rgba(197,168,128,0.15)]">
                  {activeService.icon}
                </div>
                <h3 className="font-display text-2xl md:text-4xl font-bold tracking-[0.05em] text-white uppercase">
                  {activeService.title}
                </h3>
              </div>

              <p className="font-sans text-xs md:text-sm text-[#9999aa] leading-relaxed max-w-2xl">
                {activeService.description}
              </p>

              {/* Bullet points */}
              <div className="flex flex-col gap-2 mt-2">
                {activeService.bullets?.map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-[#c5a880]">
                    <span>//</span>
                    <span className="text-white/80">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 z-30 relative border-t border-white/10 pt-6">
              {/* Software Tools badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[9px] tracking-wider text-white/40 uppercase mr-1">
                  ENGINE STACK:
                </span>
                {activeService.tools?.map((tool, idx) => (
                  <span 
                    key={idx} 
                    className="font-mono text-[9px] px-2.5 py-1 rounded border border-white/10 bg-white/5 text-white/80 uppercase"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <button
                onClick={onInquiryClick}
                data-cursor="start inquiry"
                className="px-8 py-3 bg-[#c5a880] hover:bg-[#b0926a] text-black font-outfit text-xs font-bold tracking-[0.18em] rounded-lg transition-all duration-300 shadow-lg cursor-pointer shrink-0 uppercase self-start sm:self-auto"
              >
                START INQUIRY →
              </button>
            </div>

            {/* Auto-rotation Progress Bar at Card Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-30">
              <div 
                className="h-full bg-[#c5a880] transition-all duration-100 ease-linear shadow-[0_0_10px_#c5a880]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom Pagination Dots */}
          <div className="flex justify-center items-center gap-2 z-10">
            {services.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setProgress(0);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === idx 
                    ? "w-8 h-2 bg-[#c5a880] shadow-[0_0_10px_rgba(197,168,128,0.5)]" 
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

        </div>
      </ScrollAnimatedWrapper>
    </section>
  );
});

export default ServicesSection;
