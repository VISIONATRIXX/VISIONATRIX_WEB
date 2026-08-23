"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Workflow, 
  Bot, 
  Sparkles, 
  Cpu, 
  Database, 
  Zap, 
  Code, 
  Box, 
  Radio, 
  Layers, 
  Activity, 
  Flame, 
  Wrench, 
  Sliders, 
  Compass, 
  TerminalSquare, 
  Eye, 
  Gauge 
} from "lucide-react";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";

interface Tool {
  name: string;
  iconName: string;
  description: string;
  iconBg: string;
}

interface EngineStackCategory {
  id: string;
  label: string;
  tools: Tool[];
}

export default function EngineStackSection() {
  const [activeTab, setActiveTab] = useState("ai_automation");

  const categories: EngineStackCategory[] = [
    {
      id: "ai_automation",
      label: "🤖 AI AUTOMATION & AGENTS",
      tools: [
        {
          name: "n8n WORKFLOW AUTOMATION",
          iconName: "Workflow",
          description: "Autonomous agentic node pipelines, webhooks & API orchestration",
          iconBg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        },
        {
          name: "LANGCHAIN & AUTOGEN",
          iconName: "Bot",
          description: "Multi-agent autonomous framework & vector memory index",
          iconBg: "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        },
        {
          name: "OPENAI GPT-4o & GEMINI",
          iconName: "Sparkles",
          description: "Generative multi-modal LLM APIs & real-time audio models",
          iconBg: "bg-purple-500/10 border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        },
        {
          name: "COMFYUI DIFFUSION NODES",
          iconName: "Cpu",
          description: "Custom node-based Stable Diffusion & Flux.1 generation",
          iconBg: "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        },
        {
          name: "SUPABASE VECTOR DB",
          iconName: "Database",
          description: "pgvector embeddings, edge functions & real-time sync state",
          iconBg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        },
        {
          name: "FLUX.1 & MAGNIFIC AI",
          iconName: "Zap",
          description: "Neural 8K upscaling & hyper-realistic texturing engines",
          iconBg: "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
        }
      ]
    },
    {
      id: "web_spatial",
      label: "💻 WEB & SPATIAL CORE",
      tools: [
        {
          name: "NEXT.JS 15 & REACT",
          iconName: "Code",
          description: "Server components, App router & edge runtime deployment",
          iconBg: "bg-zinc-500/10 border-zinc-500/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        },
        {
          name: "THREE.JS & WEBGL",
          iconName: "Box",
          description: "Custom GLSL shaders, 60fps GPU matrices & 3D canvas",
          iconBg: "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        },
        {
          name: "APPLE VISIONOS & OPENXR",
          iconName: "Radio",
          description: "Spatial computing canvas layouts & 6DoF hand tracking",
          iconBg: "bg-pink-500/10 border-pink-500/40 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
        },
        {
          name: "TAILWIND CSS ENGINE",
          iconName: "Layers",
          description: "Utility-first design tokens & silky glassmorphism styling",
          iconBg: "bg-sky-500/10 border-sky-500/40 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
        },
        {
          name: "VERCEL EDGE NETWORK",
          iconName: "Activity",
          description: "Global sub-10ms CDN distribution & serverless function streaming",
          iconBg: "bg-zinc-500/10 border-zinc-500/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        },
        {
          name: "GSAP & FRAMER MOTION",
          iconName: "Flame",
          description: "Physics-based spring dynamics & 60fps scroll animations",
          iconBg: "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        }
      ]
    },
    {
      id: "unreal_graphics",
      label: "🎮 UNREAL & 3D GRAPHICS",
      tools: [
        {
          name: "UNREAL ENGINE 5.4",
          iconName: "Cpu",
          description: "Nanite geometry virtualization & Lumen GI path-tracing",
          iconBg: "bg-zinc-500/10 border-zinc-500/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        },
        {
          name: "HOUDINI FX",
          iconName: "Sparkles",
          description: "Procedural fluid dynamics, destruction & particle simulations",
          iconBg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        },
        {
          name: "BLENDER 3D SUITE",
          iconName: "Box",
          description: "High-poly mesh modeling, rigging & Cycles raytracing",
          iconBg: "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        },
        {
          name: "AUTODESK MAYA",
          iconName: "Wrench",
          description: "Hard-surface CAD geometry, UV unwrapping & character rigging",
          iconBg: "bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
        },
        {
          name: "CINEMA 4D",
          iconName: "Layers",
          description: "Volumetric lighting, MoGraph animations & luxury product renders",
          iconBg: "bg-sky-500/10 border-sky-500/40 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
        },
        {
          name: "DAVINCI RESOLVE",
          iconName: "Sliders",
          description: "Cinematic 8K color grading, HDR calibration & audio mastering",
          iconBg: "bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
        }
      ]
    },
    {
      id: "architect_bim",
      label: "🏠 ARCHITECT & BIM",
      tools: [
        {
          name: "AUTODESK REVIT",
          iconName: "Compass",
          description: "Building Information Modeling (BIM), floorplans & 3D structural specs",
          iconBg: "bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
        },
        {
          name: "RHINO 3D & GRASSHOPPER",
          iconName: "TerminalSquare",
          description: "Parametric architectural modeling & complex freeform surfaces",
          iconBg: "bg-purple-500/10 border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        },
        {
          name: "V-RAY & CORONA RENDER",
          iconName: "Eye",
          description: "Photorealistic caustics, physical sun/sky & material shaders",
          iconBg: "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        },
        {
          name: "UNREAL ARCHVIZ",
          iconName: "Box",
          description: "Real-time interactive architectural walkthroughs & material swappers",
          iconBg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        },
        {
          name: "LUMION 3D",
          iconName: "Flame",
          description: "Atmospheric landscape rendering, interior lighting & cinematic flythroughs",
          iconBg: "bg-sky-500/10 border-sky-500/40 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
        },
        {
          name: "SKETCHUP PRO",
          iconName: "Gauge",
          description: "Rapid 3D schematic floorplan drafting & interior space planning",
          iconBg: "bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        }
      ]
    }
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Workflow": return <Workflow className="w-5 h-5" />;
      case "Bot": return <Bot className="w-5 h-5" />;
      case "Sparkles": return <Sparkles className="w-5 h-5" />;
      case "Cpu": return <Cpu className="w-5 h-5" />;
      case "Database": return <Database className="w-5 h-5" />;
      case "Zap": return <Zap className="w-5 h-5" />;
      case "Code": return <Code className="w-5 h-5" />;
      case "Box": return <Box className="w-5 h-5" />;
      case "Radio": return <Radio className="w-5 h-5" />;
      case "Layers": return <Layers className="w-5 h-5" />;
      case "Activity": return <Activity className="w-5 h-5" />;
      case "Flame": return <Flame className="w-5 h-5" />;
      case "Wrench": return <Wrench className="w-5 h-5" />;
      case "Sliders": return <Sliders className="w-5 h-5" />;
      case "Compass": return <Compass className="w-5 h-5" />;
      case "TerminalSquare": return <TerminalSquare className="w-5 h-5" />;
      case "Eye": return <Eye className="w-5 h-5" />;
      case "Gauge": return <Gauge className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section 
      id="engine-stack" 
      className="relative w-full min-h-screen bg-[#050507] py-24 md:py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#c5a880]/[0.015] opacity-60 blur-[160px] rounded-full" />
      </div>

      <ScrollAnimatedWrapper>
        <div className="max-w-7xl mx-auto w-full z-10 flex flex-col items-center">
        
        {/* Centered Section Header */}
        <div className="w-full flex flex-col items-center text-center mb-12">
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-[#c5a880] uppercase mb-3 font-bold">
            [ COMPUTATIONAL ARCHITECTURE ]
          </span>
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold tracking-[0.1em] text-white uppercase mb-6">
            CAPABILITY ENGINE STACK
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#9999aa] leading-relaxed max-w-2xl mx-auto">
            We harness industry-standard autonomous AI pipelines (n8n, LangChain), 3D render engines (UE5, Houdini), spatial frameworks, and modern web architectures.
          </p>
        </div>

        {/* Centered Tab Selector */}
        <div className="flex justify-center mb-12 md:mb-16 shrink-0 z-20 w-full overflow-x-auto modal-scrollbar pb-2">
          <div className="inline-flex p-1.5 bg-[#0b0b0e] border border-white/10 rounded-full gap-1.5 shrink-0">
            {categories.map((cat) => {
              const isActive = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-outfit text-[9.5px] sm:text-xs tracking-[0.15em] font-bold transition-all duration-300 cursor-pointer shrink-0 ${
                    isActive ? "text-[#c5a880]" : "text-white/40 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{cat.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeEngineTab"
                      className="absolute inset-0 bg-white/[0.06] border border-[#c5a880]/30 rounded-full shadow-[0_0_15px_rgba(197,168,128,0.1)]"
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
                  className="glass-card rounded-2xl p-6 border border-white/6 flex flex-col gap-4 min-h-[160px] bg-[#09090d]/80 hover:border-[#c5a880]/40 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),_0_0_20px_rgba(197,168,128,0.08)] transition-all duration-500 relative group overflow-hidden"
                >
                  {/* Decorative glowing dot on hover */}
                  <div className="absolute top-4 right-4 w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                    <div className="absolute inset-0 rounded-full border border-[#c5a880]/40 animate-ping" />
                  </div>

                  {/* Lucide Tool Icon Badge */}
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${tool.iconBg}`}>
                    {renderIcon(tool.iconName)}
                  </div>

                  {/* Tool metadata details */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <h3 className="font-outfit text-sm md:text-base font-bold tracking-[0.05em] text-white uppercase group-hover:text-[#c5a880] transition-colors duration-300">
                      {tool.name}
                    </h3>
                    <p className="font-mono text-[9.5px] md:text-[10px] text-white/50 tracking-wider leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </ScrollAnimatedWrapper>
  </section>
  );
}
