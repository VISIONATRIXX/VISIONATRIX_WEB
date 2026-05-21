"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tool {
  name: string;
  shortName: string;
  description: string;
  iconBg: string;
}

interface EngineStackCategory {
  id: string;
  label: string;
  tools: Tool[];
}

export default function EngineStackSection() {
  const [activeTab, setActiveTab] = useState("vfx");

  const categories: EngineStackCategory[] = [
    {
      id: "vfx",
      label: "DESIGN & VFX",
      tools: [
        {
          name: "HOUDINI FX",
          shortName: "H",
          description: "Procedural physics dynamic systems",
          iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
        },
        {
          name: "AUTODESK MAYA",
          shortName: "M",
          description: "Hard-surface mesh organic geometry",
          iconBg: "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
        },
        {
          name: "CINEMA 4D",
          shortName: "C4D",
          description: "Volumetric lighting & luxury packaging",
          iconBg: "bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]"
        },
        {
          name: "BLENDER 3D",
          shortName: "Bl",
          description: "Open-source polygonal design modeling",
          iconBg: "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
        },
        {
          name: "AFTER EFFECTS",
          shortName: "Ae",
          description: "Motion graphics & temporal compositing",
          iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
        },
        {
          name: "DAVINCI RESOLVE",
          shortName: "Da",
          description: "Color calibration & cinematic grading",
          iconBg: "bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
        }
      ]
    },
    {
      id: "code",
      label: "CODE & SPATIAL",
      tools: [
        {
          name: "THREE.JS / WebGL",
          shortName: "T3",
          description: "Custom GLSL shaders & matrix math projection",
          iconBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
        },
        {
          name: "NEXT.JS ENGINE",
          shortName: "N",
          description: "React server components & serverless edge",
          iconBg: "bg-zinc-500/10 border-zinc-500/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.05)]"
        },
        {
          name: "APPLE VISIONOS",
          shortName: "V",
          description: "Spatial canvas layout & volumetric spaces",
          iconBg: "bg-pink-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.15)]"
        },
        {
          name: "SWIFT / OPENXR",
          shortName: "Sw",
          description: "Tactile spatial engineering & UI runtimes",
          iconBg: "bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
        },
        {
          name: "SUPABASE SUITE",
          shortName: "S",
          description: "Postgres databases & real-time sync states",
          iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
        },
        {
          name: "TAILWIND CSS",
          shortName: "Tw",
          description: "Atomic layout engine & utility styling",
          iconBg: "bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]"
        }
      ]
    },
    {
      id: "ai",
      label: "AI & GAME ENGINES",
      tools: [
        {
          name: "UNREAL ENGINE 5",
          shortName: "U",
          description: "Nanite virtualization & Lumen path tracing",
          iconBg: "bg-zinc-500/10 border-zinc-500/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.05)]"
        },
        {
          name: "COMFYUI NODES",
          shortName: "Co",
          description: "Custom node pipelines & Diffusion models",
          iconBg: "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
        },
        {
          name: "UNITY 3D ENGINE",
          shortName: "U3",
          description: "Cross-platform WebXR builds & runtime packages",
          iconBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.15)]"
        },
        {
          name: "MIDJOURNEY AI",
          shortName: "Mj",
          description: "Stylistic mood boarding & texturing bases",
          iconBg: "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
        },
        {
          name: "RUN DIFFUSION",
          shortName: "Rd",
          description: "Cloud-hosted GPU instances & model training",
          iconBg: "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
        },
        {
          name: "MAGNIFIC AI",
          shortName: "Mg",
          description: "Neural upscaling & fine details generator",
          iconBg: "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.15)]"
        }
      ]
    }
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section 
      id="engine-stack" 
      className="relative w-full min-h-screen bg-[#050507] py-24 md:py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#c5a880]/[0.012] opacity-60 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 flex flex-col items-center">
        
        {/* Centered Section Header */}
        <div className="w-full flex flex-col items-center text-center mb-12">
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-[#c5a880] uppercase mb-3">
            [ DIGITAL TELEMETRY ]
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold tracking-[0.1em] text-white uppercase mb-6">
            ENGINE STACK
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#9999aa] leading-relaxed max-w-2xl mx-auto">
            We employ state-of-the-art computational algorithms, rendering modules, and dynamic network protocols to achieve high-performance results.
          </p>
        </div>

        {/* Centered Tab Selector */}
        <div className="flex justify-center mb-12 md:mb-16 shrink-0 z-20">
          <div className="inline-flex p-1 bg-[#0b0b0e] border border-white/5 rounded-full gap-1">
            {categories.map((cat) => {
              const isActive = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative px-5 py-2 sm:px-7 sm:py-2.5 rounded-full font-outfit text-[9px] sm:text-xs tracking-[0.15em] font-semibold transition-colors duration-300 cursor-pointer ${
                    isActive ? "text-[#c5a880]" : "text-white/40 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{cat.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeEngineTab"
                      className="absolute inset-0 bg-white/[0.04] border border-white/5 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Tool Cards Grid */}
        <div className="w-full relative min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full"
            >
              {currentCategory.tools.map((tool, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-xl p-6 border border-white/5 flex flex-col gap-4 min-h-[160px] hover:border-[#c5a880]/30 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),_0_0_20px_rgba(197,168,128,0.05)] transition-all duration-500 relative group overflow-hidden"
                >
                  {/* Decorative glowing dot on hover */}
                  <div className="absolute top-4 right-4 w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                    <div className="absolute inset-0 rounded-full border border-[#c5a880]/40 animate-ping" />
                  </div>

                  {/* Rounded square tool icon */}
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-outfit text-xs md:text-sm font-bold transition-all duration-500 group-hover:scale-105 ${tool.iconBg}`}>
                    {tool.shortName}
                  </div>

                  {/* Tool metadata details */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <h3 className="font-outfit text-sm md:text-base font-bold tracking-[0.05em] text-white uppercase group-hover:text-[#c5a880] transition-colors duration-300">
                      {tool.name}
                    </h3>
                    <p className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-wider leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
