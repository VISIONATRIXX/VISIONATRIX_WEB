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

    // Set initial states for cards in a stacked 3D deck format
    cardRefs.current.forEach((card, idx) => {
      if (idx === 0) {
        gsap.set(card, {
          opacity: 1,
          y: 0,
          z: 0,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          pointerEvents: "auto",
          transformOrigin: "50% 50%"
        });
      } else {
        const factor = idx; // 1, 2, 3
        gsap.set(card, {
          opacity: Math.max(0, 0.45 - factor * 0.15), // index 1: 0.3, index 2: 0.15, index 3: 0
          y: factor * 16, // index 1: 16, index 2: 32, index 3: 48
          z: -factor * 40, // index 1: -40, index 2: -80, index 3: -120
          rotateX: -factor * 4, // index 1: -4, index 2: -8, index 3: -12
          scale: 1 - factor * 0.05, // index 1: 0.95, index 2: 0.90, index 3: 0.85
          filter: `blur(${factor * 2}px)`,
          pointerEvents: "none",
          transformOrigin: "50% 50%"
        });
      }
    });

    // Node 0 starts highlighted
    gsap.set(nodeRefs.current[0], {
      borderColor: "#c5a880",
      backgroundColor: "#c5a880",
      color: "#050507",
      boxShadow: "0 0 15px rgba(197, 168, 128, 0.6)",
    });

    // Create the master timeline linked to ScrollTrigger pinning
    // We use end: "+=500%" to give the user plenty of scroll room
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=500%",
        pin: true,
        scrub: 1, // Smooth out scrub lag
        snap: {
          // Snap progress points corresponding to timeline times: 0, 0.4, 0.8, 1.2, 1.5
          // (0/1.5 = 0, 0.4/1.5 = 0.2667, 0.8/1.5 = 0.5333, 0.8, 1.0)
          snapTo: [0, 0.2667, 0.5333, 0.8, 1.0],
          delay: 0.05,
          duration: { min: 0.2, max: 0.6 },
          ease: "power2.out"
        },
        invalidateOnRefresh: true,
      }
    });

    // Animate the line paths drawing up to 1.2 duration (corresponds to step 4)
    if (vPath) {
      tl.to(vPath, { strokeDashoffset: 0, ease: "none", duration: 1.2 }, 0);
    }
    if (hPath) {
      tl.to(hPath, { strokeDashoffset: 0, ease: "none", duration: 1.2 }, 0);
    }

    // Timeline Animations (total duration is 1.5, allowing holding on Step 4)
    
    // Card 1 -> 2
    tl.to(cardRefs.current[0], { 
      opacity: 0, 
      y: -120, 
      z: 80,
      rotateX: 12, 
      scale: 0.9, 
      filter: "blur(6px)", 
      pointerEvents: "none", 
      duration: 0.2 
    }, 0.1)
      .to(nodeRefs.current[0], {
        borderColor: "rgba(197, 168, 128, 0.3)",
        backgroundColor: "#050507",
        color: "rgba(197, 168, 128, 0.6)",
        boxShadow: "0 0 0px rgba(197, 168, 128, 0)",
        duration: 0.2
      }, 0.1)
      .to(cardRefs.current[1], { 
        opacity: 1, 
        y: 0, 
        z: 0,
        rotateX: 0, 
        scale: 1, 
        filter: "blur(0px)", 
        pointerEvents: "auto", 
        duration: 0.2 
      }, 0.2)
      .to(nodeRefs.current[1], {
        borderColor: "#c5a880",
        backgroundColor: "#c5a880",
        color: "#050507",
        boxShadow: "0 0 15px rgba(197, 168, 128, 0.6)",
        duration: 0.2
      }, 0.2)
      // Shift remaining deck up by 1 level
      .to(cardRefs.current[2], {
        opacity: 0.3,
        y: 16,
        z: -40,
        rotateX: -4,
        scale: 0.95,
        filter: "blur(2px)",
        duration: 0.2
      }, 0.2)
      .to(cardRefs.current[3], {
        opacity: 0.15,
        y: 32,
        z: -80,
        rotateX: -8,
        scale: 0.90,
        filter: "blur(4px)",
        duration: 0.2
      }, 0.2);

    // Card 2 -> 3
    tl.to(cardRefs.current[1], { 
      opacity: 0, 
      y: -120, 
      z: 80,
      rotateX: 12, 
      scale: 0.9, 
      filter: "blur(6px)", 
      pointerEvents: "none", 
      duration: 0.2 
    }, 0.5)
      .to(nodeRefs.current[1], {
        borderColor: "rgba(197, 168, 128, 0.3)",
        backgroundColor: "#050507",
        color: "rgba(197, 168, 128, 0.6)",
        boxShadow: "0 0 0px rgba(197, 168, 128, 0)",
        duration: 0.2
      }, 0.5)
      .to(cardRefs.current[2], { 
        opacity: 1, 
        y: 0, 
        z: 0,
        rotateX: 0, 
        scale: 1, 
        filter: "blur(0px)", 
        pointerEvents: "auto", 
        duration: 0.2 
      }, 0.6)
      .to(nodeRefs.current[2], {
        borderColor: "#c5a880",
        backgroundColor: "#c5a880",
        color: "#050507",
        boxShadow: "0 0 15px rgba(197, 168, 128, 0.6)",
        duration: 0.2
      }, 0.6)
      // Shift card 3 up to active background level
      .to(cardRefs.current[3], {
        opacity: 0.3,
        y: 16,
        z: -40,
        rotateX: -4,
        scale: 0.95,
        filter: "blur(2px)",
        duration: 0.2
      }, 0.6);

    // Card 3 -> 4
    tl.to(cardRefs.current[2], { 
      opacity: 0, 
      y: -120, 
      z: 80,
      rotateX: 12, 
      scale: 0.9, 
      filter: "blur(6px)", 
      pointerEvents: "none", 
      duration: 0.2 
    }, 0.9)
      .to(nodeRefs.current[2], {
        borderColor: "rgba(197, 168, 128, 0.3)",
        backgroundColor: "#050507",
        color: "rgba(197, 168, 128, 0.6)",
        boxShadow: "0 0 0px rgba(197, 168, 128, 0)",
        duration: 0.2
      }, 0.9)
      .to(cardRefs.current[3], { 
        opacity: 1, 
        y: 0, 
        z: 0,
        rotateX: 0, 
        scale: 1, 
        filter: "blur(0px)", 
        pointerEvents: "auto", 
        duration: 0.2 
      }, 1.0)
      .to(nodeRefs.current[3], {
        borderColor: "#c5a880",
        backgroundColor: "#c5a880",
        color: "#050507",
        boxShadow: "0 0 15px rgba(197, 168, 128, 0.6)",
        duration: 0.2
      }, 1.0);

    // Hold step 4 active up to 1.5 to provide adequate hold space
    tl.to({}, { duration: 0.3 }, 1.2);

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
          <div className="w-full md:w-2/3 relative h-[280px] md:h-[360px] flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d]">
            {steps.map((step, idx) => (
              <div 
                key={step.id}
                ref={(el) => { if (el) cardRefs.current[idx] = el; }}
                className="absolute w-full max-w-lg glass-card rounded p-6 md:p-8 border border-white/5 shadow-2xl flex flex-col justify-between h-full [backface-visibility:hidden] hover:border-[#c5a880]/30 transition-all duration-300 select-none"
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
