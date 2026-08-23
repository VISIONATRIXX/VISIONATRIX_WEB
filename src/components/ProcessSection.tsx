"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TimelineStep {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
}

const steps: TimelineStep[] = [
  {
    id: "01",
    category: "DISCOVERY & BLUEPRINT",
    title: "Requirements & Technical Architecture",
    description: "Auditing client requirements, defining technology stack parameters (AI, Web, 3D, Video), mapping database architecture, and locking project milestones before production.",
    tags: ["Project Scope SRS", "Tech Stack Specs", "Milestone Roadmap"]
  },
  {
    id: "02",
    category: "DESIGN & PROTOTYPING",
    title: "Visual Specs & Rapid Prototyping",
    description: "Designing high-fidelity UI wireframes, CGI moodboards, 3D styleframes, and interactive motion prototypes to align creative direction prior to full build.",
    tags: ["Figma UI/UX Spec", "3D Styleframes", "Interactive Pre-vis"]
  },
  {
    id: "03",
    category: "ENGINEERING & PRODUCTION",
    title: "High-Performance Build & Rendering",
    description: "Writing production-grade code, rendering 3D environments, compositing 8K video timelines, training AI workflows (n8n/ComfyUI), or deploying responsive web apps.",
    tags: ["Clean Codebase", "AI Pipelines", "8K Render & Compositing"]
  },
  {
    id: "04",
    category: "TESTING & OPTIMIZATION",
    title: "QA & Performance Telemetry",
    description: "Executing cross-device responsiveness checks, frame rate performance audits (60/120fps), security vulnerability scans, and GPU asset compression for instant loading.",
    tags: ["Cross-Platform QA", "60fps GPU Tuning", "Fidelity Audit"]
  },
  {
    id: "05",
    category: "DEPLOYMENT & HANDOVER",
    title: "Global Launch & SLA Support",
    description: "Deploying to high-availability global edge servers, delivering master 8K render exports, configuring automated CI/CD pipelines, and providing ongoing support.",
    tags: ["Global Edge Launch", "Master Renders", "Post-Launch Support"]
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
      // 1. Vertical Progress Beam Extension Scrub
      if (activeLineRef.current && containerRef.current) {
        gsap.fromTo(
          activeLineRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.5,
            }
          }
        );
      }

      // 2. Real-Time Scroll Scrubbed Animations for Every Pipeline Step (Works Scroll Down & Scroll Up!)
      steps.forEach((_, idx) => {
        const row = rowRefs.current[idx];
        const card = cardRefs.current[idx];
        const node = nodeRefs.current[idx];
        if (!row || !card || !node) return;

        const isLeft = idx % 2 === 0;
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        // Base node scale
        gsap.set(node, {
          scale: 0.385,
          transformOrigin: "center center"
        });

        // 100% Real-Time Scrub Timeline (Synchronized with scroll position up and down)
        const stepTl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: isDesktop ? "top 85%" : "top 88%",
            end: isDesktop ? "top 45%" : "top 50%",
            scrub: 0.6,
          }
        });

        // Card Entry & Fade-In Scrub
        stepTl.fromTo(
          card,
          {
            opacity: 0,
            x: isDesktop ? (isLeft ? -50 : 50) : 0,
            y: isDesktop ? 0 : 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            ease: "power2.out",
          },
          0
        );

        // Node Glow & Scale Expansion Scrub
        stepTl.to(
          node,
          {
            scale: isDesktop ? 1.0 : 0.85,
            borderColor: "#c5a880",
            boxShadow: "0 0 24px rgba(197, 168, 128, 0.6), inset 0 0 10px rgba(197, 168, 128, 0.3)",
            ease: "back.out(1.4)",
          },
          0
        );

        // Number Tag & Dot Fade-In/Out
        const num = node.querySelector(".node-number");
        const dot = node.querySelector(".node-dot");

        if (num) stepTl.to(num, { opacity: 1 }, 0.1);
        if (dot) stepTl.to(dot, { opacity: 0 }, 0.1);
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
      {/* Background radial ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-[#c5a880]/[0.015] opacity-50 blur-[200px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto w-full z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="w-full flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase mb-2">
            [ WORKFLOW BLUEPRINT ]
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
                {/* Left Column */}
                <div className={`w-full flex md:justify-end pl-14 pr-4 md:pl-0 md:pr-16 lg:pr-24 ${isLeft ? "block" : "hidden md:block"}`}>
                  {isLeft && (
                    <div 
                      ref={el => { if (el) cardRefs.current[idx] = el; }}
                      className="w-full max-w-lg bg-[#121217]/85 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-2xl hover:border-[#c5a880]/30 transition-all duration-300 flex flex-col text-left md:text-right items-start md:items-end group relative"
                    >
                      <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase mb-2 font-bold">
                        {step.category}
                      </span>
                      <h3 className="font-outfit text-xl md:text-2xl font-bold tracking-[0.05em] text-white uppercase mb-3 group-hover:text-[#c5a880] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="font-sans text-xs md:text-sm text-[#8e8e9f] leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
                        {step.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="font-mono text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] uppercase">
                            {tag}
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
                      className="w-full max-w-lg bg-[#121217]/85 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-2xl hover:border-[#c5a880]/30 transition-all duration-300 flex flex-col text-left items-start group relative"
                    >
                      <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase mb-2 font-bold">
                        {step.category}
                      </span>
                      <h3 className="font-outfit text-xl md:text-2xl font-bold tracking-[0.05em] text-white uppercase mb-3 group-hover:text-[#c5a880] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="font-sans text-xs md:text-sm text-[#8e8e9f] leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 justify-start">
                        {step.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="font-mono text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Centered Circular Node */}
                <div 
                  ref={el => { if (el) nodeRefs.current[idx] = el; }}
                  className="absolute left-6 md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[52px] h-[52px] rounded-full border border-[#c5a880]/35 bg-[#0b0b0f] z-20 flex items-center justify-center cursor-default shadow-[0_0_8px_rgba(197,168,128,0.15)] overflow-hidden will-change-transform"
                >
                  <span className="node-number opacity-0 font-display text-[10px] md:text-[11px] font-bold text-[#c5a880] transition-opacity duration-300 select-none">
                    {step.id}
                  </span>
                  <div className="node-dot w-1.5 h-1.5 rounded-full bg-[#c5a880] transition-opacity duration-300 absolute" />
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
