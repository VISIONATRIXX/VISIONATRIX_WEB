"use client";

import { motion } from "framer-motion";

interface TimelineStep {
  id: string;
  title: string;
  side: "left" | "right";
  description: string;
  details: string[];
}

export default function ProcessSection() {
  const steps: TimelineStep[] = [
    {
      id: "01",
      title: "Tactile Metrics Mapping",
      side: "left",
      description: "We initiate each engagement by mapping spatial coordinates, user tracking nodes, and rendering constraints to ensure absolute structural feasibility.",
      details: ["// Spatial Node Mapping", "// Core Feasibility Report", "// Volumetric Target Scopes"]
    },
    {
      id: "02",
      title: "Mathematical Speculation",
      side: "right",
      description: "Developing procedural generation systems, material algorithms, and custom vertex shaders using math matrices to simulate physically accurate material environments.",
      details: ["// GLSL Custom Shaders", "// Material Shader Matrices", "// Procedural Noise Generation"]
    },
    {
      id: "03",
      title: "Volumetric Assembly",
      side: "left",
      description: "Assembling scene nodes, lighting rigs, volumetric simulations, and compositing layers within our studio render farms to generate master frame targets.",
      details: ["// Octane Render Farms", "// Fluid Simulation Compositing", "// 3D Gaussian Splat Injection"]
    },
    {
      id: "04",
      title: "Telemetric Validation",
      side: "right",
      description: "Executing frame rate stress tests, asset optimization cycles, loading latency checks, and strict visual fidelity audits before final delivery.",
      details: ["// 60FPS Refresh Auditing", "// Load-latency Compression", "// Deep Quality Inspections"]
    }
  ];

  return (
    <section 
      id="process" 
      className="snap-section flex flex-col justify-center bg-[#050507] py-20 px-6 md:px-12 lg:px-24"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[5%] top-[20%] w-[40vw] h-[40vw] bg-[#c5a880]/2 opacity-[0.02] blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="w-full flex flex-col items-center text-center mb-12">
          <span className="font-sans text-[10px] tracking-[0.25em] text-[#c5a880] uppercase mb-2">
            [ PIPELINE SCHEMES ]
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[0.1em] text-white uppercase">
            EXECUTION PIPELINE
          </h2>
        </div>

        {/* Timeline container */}
        <div className="relative w-full max-w-4xl mt-4 px-4 h-[55vh] overflow-y-auto pr-2 no-scrollbar">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2 hidden md:block" />
          
          <div className="flex flex-col gap-10 md:gap-12 relative pb-8">
            {steps.map((step, idx) => {
              const isLeft = step.side === "left";
              return (
                <div 
                  key={step.id} 
                  className={`flex flex-col md:flex-row items-center w-full relative ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Central Node Indicator */}
                  <motion.div 
                    className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-[#c5a880] bg-[#050507] z-20 hidden md:flex items-center justify-center font-display text-[10px] font-bold text-[#c5a880] shadow-[0_0_10px_rgba(197,168,128,0.2)]"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                  >
                    {step.id}
                  </motion.div>

                  {/* Step Card Content */}
                  <motion.div 
                    className={`w-full md:w-[45%] glass-card rounded-md p-6 border border-white/5 relative hover:border-[#c5a880]/30 transition-all duration-300`}
                    initial={{ 
                      x: isLeft ? -50 : 50, 
                      opacity: 0 
                    }}
                    whileInView={{ 
                      x: 0, 
                      opacity: 1 
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
                  >
                    {/* Index header for mobile */}
                    <div className="flex items-center justify-between mb-3 md:hidden">
                      <span className="font-display text-xs font-bold text-[#c5a880]">
                        STEP {step.id}
                      </span>
                      <div className="w-12 h-[1px] bg-[#c5a880]/30" />
                    </div>

                    {/* Step Title */}
                    <h3 className="font-display text-base md:text-lg font-bold tracking-[0.1em] text-white mb-2 uppercase">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="font-sans text-xs sm:text-sm text-[#9999aa] leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Subdetails bullets */}
                    <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
                      {step.details.map((det, dIdx) => (
                        <span key={dIdx} className="font-mono text-[9px] sm:text-[10px] text-white/40 tracking-wider">
                          {det}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
