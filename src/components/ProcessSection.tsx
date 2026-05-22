"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";

interface TimelineStep {
  id: string;
  category: string;
  title: string;
  description: string;
}

const steps: TimelineStep[] = [
  {
    id: "01",
    category: "DISCOVERY & SCOPING",
    title: "Tactile Metrics Mapping",
    description: "Collaborating closely with luxury design teams to isolate physical textiles parameters, atmospheric indices, and creative requirements.",
  },
  {
    id: "02",
    category: "CONCEPT ARCHITECTURE",
    title: "Mathematical Speculation",
    description: "Formulating conceptual digital layouts, fluid vector current flow diagrams, and abstract lighting trajectories prior to drafting code sheets.",
  },
  {
    id: "03",
    category: "DEVELOPMENT & PRODUCTION",
    title: "Glassmorphic Sculpting",
    description: "Constructing dark, volumetric user interfaces, tailored typography hierarchies, and highly responsive micro-bezel elements.",
  },
  {
    id: "04",
    category: "TELEMETRIC INTEGRATION",
    title: "System Integration",
    description: "Executing frame rate stress tests, asset optimization cycles, loading latency checks, and strict visual fidelity audits before final delivery.",
  }
];

export default function ProcessSection() {

  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<HTMLDivElement[]>([]);
  const nodeRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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

        // Card Animation (slide in and fade in)
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isLeft ? -50 : 50,
            scale: 0.96,
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
              toggleActions: "play reverse play reverse",
            }
          }
        );

        // Node Expansion and Glow Transitions helpers
        const activateNode = () => {
          gsap.to(node, {
            width: window.innerWidth >= 768 ? 52 : 44,
            height: window.innerWidth >= 768 ? 52 : 44,
            borderColor: "#c5a880",
            boxShadow: "0 0 22px rgba(197, 168, 128, 0.55), inset 0 0 10px rgba(197, 168, 128, 0.25)",
            duration: 0.45,
            ease: "back.out(1.5)",
          });
          
          const num = node.querySelector(".node-number");
          if (num) gsap.to(num, { opacity: 1, duration: 0.25 });
          
          const dot = node.querySelector(".node-dot");
          if (dot) gsap.to(dot, { opacity: 0, duration: 0.25 });
        };

        const deactivateNode = () => {
          gsap.to(node, {
            width: 20,
            height: 20,
            borderColor: "rgba(197, 168, 128, 0.35)",
            boxShadow: "0 0 8px rgba(197, 168, 128, 0.15)",
            duration: 0.45,
            ease: "power2.out",
          });
          
          const num = node.querySelector(".node-number");
          if (num) gsap.to(num, { opacity: 0, duration: 0.2 });
          
          const dot = node.querySelector(".node-dot");
          if (dot) gsap.to(dot, { opacity: 1, duration: 0.2 });
        };

        ScrollTrigger.create({
          trigger: row,
          start: "top 60%", // enters active range
          end: "bottom 60%", // leaves active range
          onEnter: activateNode,
          onLeave: deactivateNode,
          onEnterBack: activateNode,
          onLeaveBack: deactivateNode,
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="process" 
      className="relative w-full bg-[#0b0b0f] py-24 md:py-40 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-[#c5a880]/[0.015] opacity-50 blur-[200px] rounded-full" />
      </div>

      <ScrollAnimatedWrapper enableY={false} enableScale={false}>
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
              className="w-full bg-[#c5a880] shadow-[0_0_8px_rgba(197,168,128,0.5)] origin-top"
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
                      className="w-full max-w-lg bg-[#121217]/75 backdrop-blur-md border border-white/[0.04] rounded-2xl p-6 md:p-8 shadow-2xl hover:border-[#c5a880]/20 transition-all duration-500 flex flex-col text-left md:text-right items-start md:items-end group relative"
                    >
                      {/* Category */}
                      <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase mb-2">
                        {step.category}
                      </span>

                      {/* Title */}
                      <h3 className="font-outfit text-xl md:text-2xl font-bold tracking-[0.05em] text-white uppercase mb-3 group-hover:text-[#c5a880] transition-colors duration-300">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-xs md:text-sm text-[#8e8e9f] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className={`w-full flex md:justify-start pl-14 pr-4 md:pl-16 lg:pl-24 ${!isLeft ? "block" : "hidden md:block"}`}>
                  {!isLeft && (
                    <div 
                      ref={el => { if (el) cardRefs.current[idx] = el; }}
                      className="w-full max-w-lg bg-[#121217]/75 backdrop-blur-md border border-white/[0.04] rounded-2xl p-6 md:p-8 shadow-2xl hover:border-[#c5a880]/20 transition-all duration-500 flex flex-col text-left items-start group relative"
                    >
                      {/* Category */}
                      <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase mb-2">
                        {step.category}
                      </span>

                      {/* Title */}
                      <h3 className="font-outfit text-xl md:text-2xl font-bold tracking-[0.05em] text-white uppercase mb-3 group-hover:text-[#c5a880] transition-colors duration-300">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-xs md:text-sm text-[#8e8e9f] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Centered Circular Node */}
                <div 
                  ref={el => { if (el) nodeRefs.current[idx] = el; }}
                  className="absolute left-6 md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-[#c5a880]/35 bg-[#0b0b0f] z-20 flex items-center justify-center transition-all duration-500 cursor-default shadow-[0_0_8px_rgba(197,168,128,0.15)] overflow-hidden"
                >
                  {/* Number Tag (hidden by default) */}
                  <span className="node-number opacity-0 font-display text-[10px] md:text-[11px] font-bold text-[#c5a880] transition-opacity duration-300 select-none">
                    {step.id}
                  </span>
                  
                  {/* Center Dot (visible by default) */}
                  <div className="node-dot w-1.5 h-1.5 rounded-full bg-[#c5a880] transition-opacity duration-300 absolute" />
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </ScrollAnimatedWrapper>
  </section>
  );
}
