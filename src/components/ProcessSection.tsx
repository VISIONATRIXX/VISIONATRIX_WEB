"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  details: string[];
}

export default function ProcessSection() {
  const steps: TimelineStep[] = [
    {
      id: "01",
      title: "Tactile Metrics Mapping",
      description: "We initiate each engagement by mapping spatial coordinates, user tracking nodes, and rendering constraints to ensure absolute structural feasibility.",
      details: ["// Spatial Node Mapping", "// Core Feasibility Report", "// Volumetric Target Scopes"]
    },
    {
      id: "02",
      title: "Mathematical Speculation",
      description: "Developing procedural generation systems, material algorithms, and custom vertex shaders using math matrices to simulate physically accurate material environments.",
      details: ["// GLSL Custom Shaders", "// Material Shader Matrices", "// Procedural Noise Generation"]
    },
    {
      id: "03",
      title: "Volumetric Assembly",
      description: "Assembling scene nodes, lighting rigs, volumetric simulations, and compositing layers within our studio render farms to generate master frame targets.",
      details: ["// Octane Render Farms", "// Fluid Simulation Compositing", "// 3D Gaussian Splat Injection"]
    },
    {
      id: "04",
      title: "Telemetric Validation",
      description: "Executing frame rate stress tests, asset optimization cycles, loading latency checks, and strict visual fidelity audits before final delivery.",
      details: ["// 60FPS Refresh Auditing", "// Load-latency Compression", "// Deep Quality Inspections"]
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const verticalPathRef = useRef<SVGPathElement>(null);
  const horizontalPathRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<HTMLDivElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const vPath = verticalPathRef.current;
    const hPath = horizontalPathRef.current;

    // Set initial lengths for dash offsets
    let vLength = 0;
    let hLength = 0;

    if (vPath) {
      vLength = vPath.getTotalLength();
      vPath.style.strokeDasharray = `${vLength}`;
      vPath.style.strokeDashoffset = `${vLength}`;
    }
    if (hPath) {
      hLength = hPath.getTotalLength();
      hPath.style.strokeDasharray = `${hLength}`;
      hPath.style.strokeDashoffset = `${hLength}`;
    }

    // Set initial states for cards (card 0 is active, 1-3 are hidden)
    gsap.set(cardRefs.current.slice(1), { opacity: 0, y: 40, pointerEvents: "none" });
    gsap.set(cardRefs.current[0], { opacity: 1, y: 0, pointerEvents: "auto" });

    // Node 0 starts highlighted
    gsap.set(nodeRefs.current[0], {
      borderColor: "#c5a880",
      backgroundColor: "#c5a880",
      color: "#050507",
      boxShadow: "0 0 15px rgba(197, 168, 128, 0.6)",
    });

    // Create the master timeline linked to ScrollTrigger pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
      }
    });

    // Animate the line paths drawing
    if (vPath) {
      tl.to(vPath, { strokeDashoffset: 0, ease: "none" }, 0);
    }
    if (hPath) {
      tl.to(hPath, { strokeDashoffset: 0, ease: "none" }, 0);
    }

    // Timeline Animations (total duration normalized to 1.0)
    
    // Card 1 -> 2
    tl.to(cardRefs.current[0], { opacity: 0, y: -40, pointerEvents: "none", duration: 0.1 }, 0.22)
      .to(nodeRefs.current[0], {
        borderColor: "rgba(197, 168, 128, 0.4)",
        backgroundColor: "#050507",
        color: "rgba(197, 168, 128, 0.8)",
        boxShadow: "0 0 0px rgba(197, 168, 128, 0)",
        duration: 0.05
      }, 0.22)
      .to(cardRefs.current[1], { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.1 }, 0.3)
      .to(nodeRefs.current[1], {
        borderColor: "#c5a880",
        backgroundColor: "#c5a880",
        color: "#050507",
        boxShadow: "0 0 15px rgba(197, 168, 128, 0.6)",
        duration: 0.05
      }, 0.3);

    // Card 2 -> 3
    tl.to(cardRefs.current[1], { opacity: 0, y: -40, pointerEvents: "none", duration: 0.1 }, 0.55)
      .to(nodeRefs.current[1], {
        borderColor: "rgba(197, 168, 128, 0.4)",
        backgroundColor: "#050507",
        color: "rgba(197, 168, 128, 0.8)",
        boxShadow: "0 0 0px rgba(197, 168, 128, 0)",
        duration: 0.05
      }, 0.55)
      .to(cardRefs.current[2], { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.1 }, 0.63)
      .to(nodeRefs.current[2], {
        borderColor: "#c5a880",
        backgroundColor: "#c5a880",
        color: "#050507",
        boxShadow: "0 0 15px rgba(197, 168, 128, 0.6)",
        duration: 0.05
      }, 0.63);

    // Card 3 -> 4
    tl.to(cardRefs.current[2], { opacity: 0, y: -40, pointerEvents: "none", duration: 0.1 }, 0.85)
      .to(nodeRefs.current[2], {
        borderColor: "rgba(197, 168, 128, 0.4)",
        backgroundColor: "#050507",
        color: "rgba(197, 168, 128, 0.8)",
        boxShadow: "0 0 0px rgba(197, 168, 128, 0)",
        duration: 0.05
      }, 0.85)
      .to(cardRefs.current[3], { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.1 }, 0.93)
      .to(nodeRefs.current[3], {
        borderColor: "#c5a880",
        backgroundColor: "#c5a880",
        color: "#050507",
        boxShadow: "0 0 15px rgba(197, 168, 128, 0.6)",
        duration: 0.05
      }, 0.93);

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="process" 
      className="relative w-full h-screen bg-[#050507] flex flex-col justify-center overflow-hidden px-6 md:px-12 lg:px-24"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[10%] top-[25%] w-[35vw] h-[35vw] bg-[#c5a880]/2 opacity-[0.02] blur-[150px] rounded-full" />
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto w-full z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="w-full flex flex-col items-center text-center mb-10 md:mb-16">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase mb-2">
            [ PIPELINE SCHEMES ]
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold tracking-[0.1em] text-white uppercase">
            EXECUTION PIPELINE
          </h2>
        </div>

        {/* Timeline Layout */}
        <div className="relative w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 px-4">
          
          {/* Left Side: Circuit Node Track */}
          <div className="relative w-[300px] h-[60px] md:w-[80px] md:h-[400px] shrink-0 flex items-center justify-center">
            
            {/* SVG Background Path & Active Animated Path */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Vertical path for desktop */}
              <svg width="80" height="400" viewBox="0 0 80 400" fill="none" className="hidden md:block w-full h-full">
                <path 
                  d="M40 0 V100 H20 V200 H60 V300 H40 V400" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  ref={verticalPathRef}
                  d="M40 0 V100 H20 V200 H60 V300 H40 V400" 
                  stroke="#c5a880" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>

              {/* Horizontal path for mobile */}
              <svg width="300" height="60" viewBox="0 0 300 60" fill="none" className="block md:hidden w-full h-full">
                <path 
                  d="M0 30 H75 V15 H150 V45 H225 V30 H300" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  ref={horizontalPathRef}
                  d="M0 30 H75 V15 H150 V45 H225 V30 H300" 
                  stroke="#c5a880" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Step Nodes (01-04) aligned perfectly to the paths */}
            {/* Node 01 */}
            <div 
              ref={(el) => { if (el) nodeRefs.current[0] = el; }}
              className="w-9 h-9 rounded-full border border-white/10 bg-[#050507] text-[#c5a880] z-20 flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 absolute left-[12.5%] top-[30px] md:left-[50%] md:top-[50px] -translate-x-1/2 -translate-y-1/2"
            >
              01
            </div>

            {/* Node 02 */}
            <div 
              ref={(el) => { if (el) nodeRefs.current[1] = el; }}
              className="w-9 h-9 rounded-full border border-white/10 bg-[#050507] text-[#c5a880]/60 z-20 flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 absolute left-[37.5%] top-[15px] md:left-[25%] md:top-[150px] -translate-x-1/2 -translate-y-1/2"
            >
              02
            </div>

            {/* Node 03 */}
            <div 
              ref={(el) => { if (el) nodeRefs.current[2] = el; }}
              className="w-9 h-9 rounded-full border border-white/10 bg-[#050507] text-[#c5a880]/60 z-20 flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 absolute left-[62.5%] top-[45px] md:left-[75%] md:top-[250px] -translate-x-1/2 -translate-y-1/2"
            >
              03
            </div>

            {/* Node 04 */}
            <div 
              ref={(el) => { if (el) nodeRefs.current[3] = el; }}
              className="w-9 h-9 rounded-full border border-white/10 bg-[#050507] text-[#c5a880]/60 z-20 flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 absolute left-[87.5%] top-[30px] md:left-[50%] md:top-[350px] -translate-x-1/2 -translate-y-1/2"
            >
              04
            </div>
          </div>

          {/* Right Side: Stacked Card display */}
          <div className="w-full md:w-2/3 relative h-[280px] md:h-[360px] flex items-center justify-center">
            {steps.map((step, idx) => (
              <div 
                key={step.id}
                ref={(el) => { if (el) cardRefs.current[idx] = el; }}
                className="absolute w-full max-w-lg glass-card rounded p-6 md:p-8 border border-white/5 shadow-2xl flex flex-col justify-between h-full"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold text-[#c5a880] tracking-widest">
                      STEP {step.id} // PIPELINE
                    </span>
                    <div className="h-[1px] flex-grow mx-4 bg-[#c5a880]/10" />
                  </div>

                  {/* Title */}
                  <h3 className="font-outfit text-lg md:text-xl font-bold tracking-[0.08em] text-white mb-2 md:mb-3 uppercase">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-xs md:text-sm text-[#9999aa] leading-relaxed mb-4 md:mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Subdetails bullets */}
                <div className="flex flex-col gap-1 border-t border-white/5 pt-3 md:pt-4">
                  {step.details.map((det, dIdx) => (
                    <span key={dIdx} className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-wider">
                      {det}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
