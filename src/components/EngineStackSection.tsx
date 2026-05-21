"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal, Compass } from "lucide-react";

interface Tool {
  name: string;
  description: string;
  version: string;
  engineSpec: string;
}

interface EngineStackCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  tools: Tool[];
}

export default function EngineStackSection() {
  const [activeTab, setActiveTab] = useState("vfx");

  const categories: EngineStackCategory[] = [
    {
      id: "vfx",
      label: "DESIGN & VFX",
      icon: <Compass className="w-4 h-4" />,
      tools: [
        {
          name: "HOUDINI FX",
          description: "Volumetric systems, smoke, particles, and physics solver mapping.",
          version: "v20.5 Pro",
          engineSpec: "OpenCL Solver Grid"
        },
        {
          name: "NUKE STUDIO",
          description: "Deep node-based digital compositing and lens distortion profiling.",
          version: "v15.2v3",
          engineSpec: "Deep EXR Compositor"
        },
        {
          name: "AUTODESK MAYA",
          description: "Sub-micron geometric mesh creation and skeletal animations.",
          version: "2026.1",
          engineSpec: "USD Geometry Pipeline"
        },
        {
          name: "SUBSTANCE PAINTER",
          description: "Physically accurate micro-texture mapping and material designs.",
          version: "2026 Pro",
          engineSpec: "PBR Material Maps"
        }
      ]
    },
    {
      id: "code",
      label: "CODE & SPATIAL",
      icon: <Terminal className="w-4 h-4" />,
      tools: [
        {
          name: "THREE.JS / WebGL",
          description: "Custom GLSL vertex shader assembly and GPU-driven rendering.",
          version: "r162",
          engineSpec: "Custom WebGL2.0 Core"
        },
        {
          name: "REACT / NEXT.JS",
          description: "Strict TypeScript architectures, Vercel Edge, and cache pipelines.",
          version: "v15.2",
          engineSpec: "React 19 / App Router"
        },
        {
          name: "SWIFT / VISIONOS",
          description: "Bespoke spatial UI layouts and immersive computed workspaces.",
          version: "SDK v2",
          engineSpec: "Volumetric Immersive Spaces"
        },
        {
          name: "SUPABASE / POSTGRES",
          description: "Real-time data synchronization and edge telemetry storage.",
          version: "PostgreSQL v16",
          engineSpec: "Row-Level Security Sync"
        }
      ]
    },
    {
      id: "ai",
      label: "AI & GAME ENGINES",
      icon: <Cpu className="w-4 h-4" />,
      tools: [
        {
          name: "UNREAL ENGINE 5.5",
          description: "Path Tracing, Nanite geometry, Lumen lighting virtual sets.",
          version: "v5.5.1",
          engineSpec: "Nanite / Lumen Virtualized"
        },
        {
          name: "COMFYUI NODES",
          description: "Latent diffusion pipelines, IP-Adapter, and ControlNet consistency.",
          version: "v0.2",
          engineSpec: "Latent Node Architecture"
        },
        {
          name: "UNITY 3D",
          description: "Cross-platform WebXR assemblies and immersive Quest runtime.",
          version: "2025.2 LTS",
          engineSpec: "URP / OpenXR Pipeline"
        },
        {
          name: "MIDJOURNEY AI",
          description: "Initial stylistic ideation and high-fidelity texture base seeds.",
          version: "v6 Alpha",
          engineSpec: "Latent Image Prompting"
        }
      ]
    }
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section 
      id="engine-stack" 
      className="snap-section flex flex-col justify-center bg-[#050507] py-20 px-6 md:px-12 lg:px-24"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[8%] bottom-[15%] w-[45vw] h-[45vw] bg-[#c5a880]/2 opacity-[0.025] blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Title and Tabs List */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
              [ ENGINE STACK ]
            </span>
            <h2 className="font-display text-3xl font-bold tracking-[0.1em] text-white uppercase">
              THE REGISTRY
            </h2>
          </div>

          {/* Interactive tabs */}
          <div className="flex flex-row lg:flex-col flex-wrap gap-3 mt-2">
            {categories.map((cat) => {
              const active = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-3 font-outfit text-[11px] tracking-[0.18em] font-semibold py-3 px-4 rounded-sm border cursor-pointer transition-all duration-300 w-full sm:w-auto lg:w-full ${
                    active
                      ? "bg-[#c5a880]/10 border-[#c5a880] text-[#c5a880] shadow-[0_0_15px_rgba(197,168,128,0.1)]"
                      : "bg-[#0b0b0e] border-white/5 text-[#555566] hover:text-white hover:border-white/15"
                  } interactive-tab`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tool Cards Grid */}
        <div className="lg:col-span-8">
          <div className="min-h-[420px] md:min-h-[360px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {currentCategory.tools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-md p-6 border border-white/5 flex flex-col justify-between min-h-[170px] hover:border-[#c5a880]/30 transition-all duration-300 relative group"
                  >
                    <div>
                      {/* Tool Name and Version */}
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-outfit text-sm font-bold tracking-[0.15em] text-white group-hover:text-[#c5a880] transition-colors duration-300">
                          {tool.name}
                        </h3>
                        <span className="font-mono text-[9px] text-[#555566] tracking-wider">
                          {tool.version}
                        </span>
                      </div>

                      {/* Tool Description */}
                      <p className="font-sans text-xs text-[#9999aa] leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    {/* Tool spec specifications */}
                    <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center text-[9px] font-mono text-[#555566] tracking-wider uppercase">
                      <span>SPEC ENGINE</span>
                      <span className="text-[#c5a880]/80">{tool.engineSpec}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
