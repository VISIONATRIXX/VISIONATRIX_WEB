"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TimelineStep {
  id: string;
  category: string;
  title: string;
  description: string;
  details: string[];
}

export default function ProcessSection() {
  const steps: TimelineStep[] = [
    {
      id: "01",
      category: "SPATIAL COORDINATION",
      title: "Tactile Metrics Mapping",
      description: "Mapping spatial coordinates, user tracking nodes, and rendering constraints to ensure absolute structural feasibility.",
      details: ["// Spatial Node Mapping", "// Core Feasibility Report", "// Volumetric Target Scopes"]
    },
    {
      id: "02",
      category: "CONCEPT ARCHITECTURE",
      title: "Mathematical Speculation",
      description: "Formulating conceptual digital layouts, fluid vector current flow diagrams, and abstract lighting trajectories prior to drafting code sheets.",
      details: ["// GLSL Custom Shaders", "// Material Shader Matrices", "// Procedural Noise Generation"]
    },
    {
      id: "03",
      category: "SYSTEMS LAYOUT DESIGN",
      title: "Glassmorphic Sculpting",
      description: "Constructing dark, volumetric user interfaces, tailored typography hierarchies, and highly responsive micro-bezel elements.",
      details: ["// Octane Render Farms", "// Fluid Simulation Compositing", "// 3D Gaussian Splat Injection"]
    },
    {
      id: "04",
      category: "TELEMETRIC VALIDATION",
      title: "System Integration",
      description: "Executing frame rate stress tests, asset optimization cycles, loading latency checks, and strict visual fidelity audits before final delivery.",
      details: ["// 60FPS Refresh Auditing", "// Load-latency Compression", "// Deep Quality Inspections"]
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<HTMLDivElement[]>([]);
  const nodeRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. Line Growth Animation
    if (activeLineRef.current && containerRef.current) {
      gsap.fromTo(
        activeLineRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 60%",
            scrub: true,
          }
        }
      );
    }

    // 2. Loop through steps to apply ScrollTrigger animations
    steps.forEach((_, idx) => {
      const row = rowRefs.current[idx];
      const card = cardRefs.current[idx];
      const node = nodeRefs.current[idx];
      if (!row || !card || !node) return;

      const isLeft = idx % 2 === 0;

      // Card Animation (slide in and fade in, remain visible once revealed)
      gsap.fromTo(
        card,
        {
          opacity: 0,
          x: isLeft ? -60 : 60,
          scale: 0.95,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 75%",
            toggleActions: "play none none none",
          }
        }
      );

      // Node State Transitions (Unreached -> Active/Focus -> Completed)
      ScrollTrigger.create({
        trigger: row,
        start: "top 60%", // enters active range
        end: "bottom 40%", // leaves active range
        onEnter: () => {
          gsap.to(node, {
            borderColor: "#00f2fe", // cyan border
            color: "#ffffff",
            boxShadow: "0 0 25px rgba(0, 242, 254, 0.6), inset 0 0 10px rgba(0, 242, 254, 0.3)", // cyan glow ring
            scale: 1.15,
            duration: 0.4,
          });
        },
        onLeave: () => {
          gsap.to(node, {
            borderColor: "#c5a880", // gold border
            color: "#c5a880",
            boxShadow: "0 0 15px rgba(197, 168, 128, 0.4)", // gold glow
            scale: 1.0,
            duration: 0.4,
          });
        },
        onEnterBack: () => {
          gsap.to(node, {
            borderColor: "#00f2fe",
            color: "#ffffff",
            boxShadow: "0 0 25px rgba(0, 242, 254, 0.6), inset 0 0 10px rgba(0, 242, 254, 0.3)",
            scale: 1.15,
            duration: 0.4,
          });
        },
        onLeaveBack: () => {
          gsap.to(node, {
            borderColor: "rgba(197, 168, 128, 0.2)", // dim gold border
            color: "rgba(197, 168, 128, 0.5)",
            boxShadow: "0 0 0px rgba(0, 0, 0, 0)",
            scale: 1.0,
            duration: 0.4,
          });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="process" 
      className="relative w-full bg-[#050507] py-24 md:py-40 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-[#c5a880]/[0.015] opacity-50 blur-[200px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto w-full z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="w-full flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase mb-2">
            [ PIPELINE SCHEMES ]
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold tracking-[0.1em] text-white uppercase">
            EXECUTION PIPELINE
          </h2>
        </div>

        {/* Timeline Layout */}
        <div ref={containerRef} className="relative w-full mt-8 md:mt-16">
          
          {/* Vertical Line track */}
          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-10 bottom-10 w-[2px] bg-white/5 pointer-events-none" />
          
          {/* Active progress line */}
          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-10 bottom-10 w-[2px] pointer-events-none">
            <div 
              ref={activeLineRef}
              className="w-full bg-gradient-to-b from-[#c5a880] to-[#00f2fe] origin-top"
              style={{ height: "0%" }}
            />
          </div>

          {/* Timeline Steps */}
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div 
                key={step.id} 
                ref={el => { if (el) rowRefs.current[idx] = el; }}
                className="relative grid grid-cols-1 md:grid-cols-2 items-center py-12 md:py-20 w-full"
              >
                {/* Left Column (Desktop only, or left content) */}
                <div className={`w-full flex md:justify-end pl-14 pr-4 md:pl-0 md:pr-16 lg:pr-24 ${isLeft ? "block" : "hidden md:block"}`}>
                  {isLeft && (
                    <div 
                      ref={el => { if (el) cardRefs.current[idx] = el; }}
                      className="w-full max-w-lg bg-[#0b0b0e]/80 backdrop-blur-md border border-white/5 rounded-xl p-6 md:p-8 shadow-2xl hover:border-[#c5a880]/30 transition-all duration-500 group relative"
                    >
                      {/* Decorative Gold Dot and Category */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#c5a880]" />
                          <div className="absolute inset-0 rounded-full border border-[#c5a880]/40 animate-pulse scale-150" />
                        </div>
                        <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
                          {step.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-outfit text-xl md:text-2xl font-bold tracking-[0.05em] text-white uppercase mb-3 md:mb-4 group-hover:text-[#c5a880] transition-colors duration-300">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-xs md:text-sm text-[#9999aa] leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Subdetails bullets */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        {step.details.map((det, dIdx) => (
                          <span 
                            key={dIdx} 
                            className="font-mono text-[9px] text-white/30 bg-white/[0.02] px-2 py-1 rounded border border-white/[0.05]"
                          >
                            {det}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className={`w-full flex md:justify-start pl-14 pr-4 md:pl-16 lg:pl-24 ${!isLeft ? "block" : "hidden md:block"}`}>
                  {!isLeft && (
                    <div 
                      ref={el => { if (el) cardRefs.current[idx] = el; }}
                      className="w-full max-w-lg bg-[#0b0b0e]/80 backdrop-blur-md border border-white/5 rounded-xl p-6 md:p-8 shadow-2xl hover:border-[#c5a880]/30 transition-all duration-500 group relative"
                    >
                      {/* Decorative Gold Dot and Category */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#c5a880]" />
                          <div className="absolute inset-0 rounded-full border border-[#c5a880]/40 animate-pulse scale-150" />
                        </div>
                        <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
                          {step.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-outfit text-xl md:text-2xl font-bold tracking-[0.05em] text-white uppercase mb-3 md:mb-4 group-hover:text-[#c5a880] transition-colors duration-300">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-xs md:text-sm text-[#9999aa] leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Subdetails bullets */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        {step.details.map((det, dIdx) => (
                          <span 
                            key={dIdx} 
                            className="font-mono text-[9px] text-white/30 bg-white/[0.02] px-2 py-1 rounded border border-white/[0.05]"
                          >
                            {det}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Centered Circular Node */}
                <div 
                  ref={el => { if (el) nodeRefs.current[idx] = el; }}
                  className="absolute left-6 md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 rounded-full border border-[#c5a880]/20 bg-[#050507] text-[#c5a880]/50 z-20 flex items-center justify-center font-mono text-[11px] md:text-xs font-bold transition-all duration-300 cursor-default shadow-sm"
                >
                  {step.id}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
