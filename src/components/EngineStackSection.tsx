"use client";

import { useState, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Film, Code, Gamepad2, Compass } from "lucide-react";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";

interface Tool {
  id: string;
  name: string;
  description: string;
  iconBg: string;
}

interface EngineStackCategory {
  id: string;
  label: string;
  categoryIcon: JSX.Element;
  tools: Tool[];
}

export default function EngineStackSection() {
  const [activeTab, setActiveTab] = useState("ai_automation");

  const categories: EngineStackCategory[] = [
    {
      id: "ai_automation",
      label: "AI AUTOMATION & AGENTS",
      categoryIcon: <Bot className="w-4 h-4" />,
      tools: [
        {
          id: "n8n",
          name: "n8n WORKFLOW AUTOMATION",
          description: "Autonomous agentic node pipelines, webhooks & API orchestration",
          iconBg: "bg-[#ff6d5a]/10 border-[#ff6d5a]/40 text-[#ff6d5a] shadow-[0_0_15px_rgba(255,109,90,0.25)]"
        },
        {
          id: "langchain",
          name: "LANGCHAIN & AUTOGEN",
          description: "Multi-agent autonomous framework & vector memory index",
          iconBg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        },
        {
          id: "openai",
          name: "OPENAI GPT-4o & GEMINI",
          description: "Generative multi-modal LLM APIs & real-time audio models",
          iconBg: "bg-purple-500/10 border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        },
        {
          id: "comfyui",
          name: "COMFYUI DIFFUSION NODES",
          description: "Custom node-based Stable Diffusion & Flux.1 generation",
          iconBg: "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        },
        {
          id: "supabase",
          name: "SUPABASE VECTOR DB",
          description: "pgvector embeddings, edge functions & real-time sync state",
          iconBg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        },
        {
          id: "flux",
          name: "FLUX.1 & MAGNIFIC AI",
          description: "Neural 8K upscaling & hyper-realistic texturing engines",
          iconBg: "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
        }
      ]
    },
    {
      id: "video_editing",
      label: "VIDEO EDITING & POST-PROD",
      categoryIcon: <Film className="w-4 h-4" />,
      tools: [
        {
          id: "ae",
          name: "ADOBE AFTER EFFECTS",
          description: "Temporal motion graphics, 3D compositing & kinetic typography",
          iconBg: "bg-[#9999ff]/10 border-[#9999ff]/40 text-[#9999ff] shadow-[0_0_15px_rgba(153,153,255,0.25)]"
        },
        {
          id: "davinci",
          name: "DAVINCI RESOLVE STUDIO",
          description: "Cinematic 8K Fairlight audio, HDR color grading & Fusion VFX",
          iconBg: "bg-[#e11d48]/10 border-[#e11d48]/40 text-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.25)]"
        },
        {
          id: "pr",
          name: "ADOBE PREMIERE PRO",
          description: "Non-linear timeline editing, multi-cam assembly & audio sync",
          iconBg: "bg-[#9999ff]/10 border-[#9999ff]/40 text-[#00005b] shadow-[0_0_15px_rgba(0,0,91,0.25)]"
        },
        {
          id: "nuke",
          name: "NUKE BY FOUNDRY",
          description: "Node-based digital compositing, rotoscoping & deep compositing",
          iconBg: "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        },
        {
          id: "topaz",
          name: "TOPAZ VIDEO AI",
          description: "Neural 60fps frame interpolation, motion de-blur & 8K upscaling",
          iconBg: "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        },
        {
          id: "sapphire",
          name: "BORIS FX SAPPHIRE",
          description: "Pro VFX suite plugins, anamorphic lens flares & transitions",
          iconBg: "bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
        }
      ]
    },
    {
      id: "web_spatial",
      label: "WEB & SPATIAL CORE",
      categoryIcon: <Code className="w-4 h-4" />,
      tools: [
        {
          id: "next",
          name: "NEXT.JS 15 & REACT",
          description: "Server components, App router & edge runtime deployment",
          iconBg: "bg-white/10 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        },
        {
          id: "three",
          name: "THREE.JS & WEBGL",
          description: "Custom GLSL shaders, 60fps GPU matrices & 3D canvas",
          iconBg: "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        },
        {
          id: "visionos",
          name: "APPLE VISIONOS & OPENXR",
          description: "Spatial computing canvas layouts & 6DoF hand tracking",
          iconBg: "bg-pink-500/10 border-pink-500/40 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
        },
        {
          id: "tailwind",
          name: "TAILWIND CSS ENGINE",
          description: "Utility-first design tokens & silky glassmorphism styling",
          iconBg: "bg-sky-500/10 border-sky-500/40 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
        },
        {
          id: "vercel",
          name: "VERCEL EDGE NETWORK",
          description: "Global sub-10ms CDN distribution & serverless function streaming",
          iconBg: "bg-zinc-500/10 border-zinc-500/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        },
        {
          id: "gsap",
          name: "GSAP & FRAMER MOTION",
          description: "Physics-based spring dynamics & 60fps scroll animations",
          iconBg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        }
      ]
    },
    {
      id: "unreal_graphics",
      label: "UNREAL & 3D GRAPHICS",
      categoryIcon: <Gamepad2 className="w-4 h-4" />,
      tools: [
        {
          id: "unreal",
          name: "UNREAL ENGINE 5.4",
          description: "Nanite geometry virtualization & Lumen GI path-tracing",
          iconBg: "bg-white/10 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        },
        {
          id: "houdini",
          name: "HOUDINI FX",
          description: "Procedural fluid dynamics, destruction & particle simulations",
          iconBg: "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        },
        {
          id: "blender",
          name: "BLENDER 3D SUITE",
          description: "High-poly mesh modeling, rigging & Cycles raytracing",
          iconBg: "bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
        },
        {
          id: "maya",
          name: "AUTODESK MAYA",
          description: "Hard-surface CAD geometry, UV unwrapping & character rigging",
          iconBg: "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        },
        {
          id: "c4d",
          name: "CINEMA 4D",
          description: "Volumetric lighting, MoGraph animations & luxury product renders",
          iconBg: "bg-sky-500/10 border-sky-500/40 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
        },
        {
          id: "substance",
          name: "SUBSTANCE PAINTER",
          description: "PBR texture painting, smart materials & normal map baking",
          iconBg: "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
        }
      ]
    },
    {
      id: "architect_bim",
      label: "ARCHITECT & BIM",
      categoryIcon: <Compass className="w-4 h-4" />,
      tools: [
        {
          id: "revit",
          name: "AUTODESK REVIT",
          description: "Building Information Modeling (BIM), floorplans & 3D structural specs",
          iconBg: "bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
        },
        {
          id: "rhino",
          name: "RHINO 3D & GRASSHOPPER",
          description: "Parametric architectural modeling & complex freeform surfaces",
          iconBg: "bg-purple-500/10 border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        },
        {
          id: "vray",
          name: "V-RAY & CORONA RENDER",
          description: "Photorealistic caustics, physical sun/sky & material shaders",
          iconBg: "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        },
        {
          id: "archviz",
          name: "UNREAL ARCHVIZ",
          description: "Real-time interactive architectural walkthroughs & material swappers",
          iconBg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        },
        {
          id: "lumion",
          name: "LUMION 3D",
          description: "Atmospheric landscape rendering, interior lighting & cinematic flythroughs",
          iconBg: "bg-sky-500/10 border-sky-500/40 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
        },
        {
          id: "sketchup",
          name: "SKETCHUP PRO",
          description: "Rapid 3D schematic floorplan drafting & interior space planning",
          iconBg: "bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        }
      ]
    }
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  // Render Official Brand Vector Logos
  const renderOfficialLogo = (toolId: string) => {
    switch (toolId) {
      case "n8n":
        return (
          <svg className="w-7 h-7" viewBox="0 121.3 512.1 269.6">
            <path
              d="M458.1 229.1c-25.1 0-46.2-17.2-52.2-40.4h-61.8c-13.2 0-24.4 9.5-26.6 22.5l-2.2 13.3c-2 12.2-8.2 23.4-17.5 31.6 9.3 8.2 15.5 19.3 17.5 31.6l2.2 13.3c2.2 13 13.4 22.5 26.6 22.5h7.9c6-23.2 27.1-40.4 52.2-40.4 29.8 0 53.9 24.1 53.9 53.9s-24.1 53.9-53.9 53.9c-25.1 0-46.2-17.2-52.2-40.4h-7.9c-26.3 0-48.8-19-53.2-45l-2.2-13.3c-2.2-13-13.4-22.5-26.6-22.5h-21.4c-6 23.2-27.1 40.4-52.2 40.4s-46.2-17.2-52.2-40.4H106c-6 23.2-27.1 40.4-52.2 40.4C24.1 309.9 0 285.8 0 256s24.1-53.9 53.9-53.9c25.1 0 46.2 17.2 52.2 40.4h30.3c6-23.2 27.1-40.4 52.2-40.4s46.2 17.2 52.2 40.4h21.4c13.2 0 24.4-9.5 26.6-22.5l2.2-13.3c4.3-26 26.8-45 53.2-45H406c6-23.2 27.1-40.4 52.2-40.4 29.8 0 53.9 24.1 53.9 53.9s-24.2 53.9-54 53.9m0-27c14.9 0 26.9-12.1 26.9-26.9s-12.1-26.9-26.9-26.9-26.9 12.1-26.9 26.9 12 26.9 26.9 26.9M53.9 282.9c14.9 0 26.9-12.1 26.9-26.9s-12.1-26.9-26.9-26.9-27 12-27 26.9 12.1 26.9 27 26.9M215.6 256c0 14.9-12.1 26.9-26.9 26.9s-26.9-12.1-26.9-26.9 12.1-26.9 26.9-26.9 26.9 12 26.9 26.9m215.6 80.8c0 14.9-12.1 26.9-26.9 26.9-14.9 0-26.9-12.1-26.9-26.9s12.1-26.9 26.9-26.9 26.9 12.1 26.9 26.9"
              fill="#ea4b71"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        );
      case "ae":
        return (
          <div className="w-7 h-7 bg-[#00005b] rounded-lg border border-[#9999ff] flex items-center justify-center font-outfit text-xs font-black text-[#9999ff] tracking-tighter">
            Ae
          </div>
        );
      case "pr":
        return (
          <div className="w-7 h-7 bg-[#00005b] rounded-lg border border-[#ea77ff] flex items-center justify-center font-outfit text-xs font-black text-[#ea77ff] tracking-tighter">
            Pr
          </div>
        );
      case "davinci":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4.5" fill="#E11D48" opacity="0.85" />
            <circle cx="8.5" cy="15" r="4.5" fill="#10B981" opacity="0.85" />
            <circle cx="15.5" cy="15" r="4.5" fill="#3B82F6" opacity="0.85" />
          </svg>
        );
      case "nuke":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="#F59E0B" />
            <text x="12" y="15" textAnchor="middle" fill="#000" fontSize="10" fontWeight="900" fontFamily="sans-serif">N</text>
          </svg>
        );
      case "topaz":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#06B6D4" />
          </svg>
        );
      case "sapphire":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 20,9 12,22 4,9" fill="#3B82F6" stroke="#93C5FD" strokeWidth="1" />
          </svg>
        );
      case "unreal":
      case "archviz":
        return (
          <div className="w-7 h-7 rounded-full border border-white/60 bg-black flex items-center justify-center font-outfit text-xs font-extrabold text-white">
            U
          </div>
        );
      case "blender":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="13" r="5" fill="#EA580C" />
            <circle cx="12" cy="13" r="2.5" fill="#3B82F6" />
            <path d="M5 6L10 10M19 6L14 10" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case "houdini":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#f59e0b] bg-[#18181b] flex items-center justify-center font-outfit text-xs font-black text-[#f59e0b]">
            H
          </div>
        );
      case "maya":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#06b6d4] bg-[#090d16] flex items-center justify-center font-outfit text-xs font-black text-[#06b6d4]">
            M
          </div>
        );
      case "c4d":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#0ea5e9] bg-[#090d16] flex items-center justify-center font-outfit text-[9px] font-black text-[#0ea5e9]">
            C4D
          </div>
        );
      case "substance":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#f43f5e] bg-[#18090c] flex items-center justify-center font-outfit text-xs font-black text-[#f43f5e]">
            S
          </div>
        );
      case "next":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#000" stroke="#fff" strokeWidth="1.5" />
            <path d="M7.5 7.5V16.5M16.5 7.5V16.5M7.5 7.5L16.5 16.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case "three":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <polygon points="12,3 21,19 3,19" stroke="#06B6D4" strokeWidth="1.8" fill="none" />
            <line x1="12" y1="3" x2="12" y2="19" stroke="#06B6D4" strokeWidth="1.2" />
          </svg>
        );
      case "visionos":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="7" width="18" height="10" rx="5" stroke="#EC4899" strokeWidth="1.8" fill="none" />
            <circle cx="8.5" cy="12" r="2.5" stroke="#EC4899" strokeWidth="1.2" />
            <circle cx="15.5" cy="12" r="2.5" stroke="#EC4899" strokeWidth="1.2" />
          </svg>
        );
      case "tailwind":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 6C9 6 7.5 7.5 7.5 10.5C7.5 12 8.5 12.5 9 13.5C9.5 14.5 9.5 15.5 8 18C11 18 12.5 16.5 12.5 13.5C12.5 12 11.5 11.5 11 10.5C10.5 9.5 10.5 8.5 12 6Z" fill="#0EA5E9" />
            <path d="M18 10C15 10 13.5 11.5 13.5 14.5C13.5 16 14.5 16.5 15 17.5C15.5 18.5 15.5 19.5 14 22C17 22 18.5 20.5 18.5 17.5C18.5 16 17.5 15.5 17 14.5C16.5 13.5 16.5 12.5 18 10Z" fill="#0EA5E9" />
          </svg>
        );
      case "vercel":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <polygon points="12,4 22,20 2,20" fill="#FFFFFF" />
          </svg>
        );
      case "gsap":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#10b981] bg-[#051810] flex items-center justify-center font-outfit text-[9px] font-black text-[#10b981]">
            GSAP
          </div>
        );
      case "revit":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#3b82f6] bg-[#07101e] flex items-center justify-center font-outfit text-xs font-black text-[#3b82f6]">
            R
          </div>
        );
      case "rhino":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#a855f7] bg-[#12071e] flex items-center justify-center font-outfit text-[9px] font-black text-[#a855f7]">
            RHINO
          </div>
        );
      case "vray":
        return (
          <div className="w-7 h-7 rounded-full border border-[#f59e0b] bg-[#1e1507] flex items-center justify-center font-outfit text-[9px] font-black text-[#f59e0b]">
            V-RAY
          </div>
        );
      case "lumion":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#0ea5e9] bg-[#07161e] flex items-center justify-center font-outfit text-[8px] font-black text-[#0ea5e9]">
            LUMION
          </div>
        );
      case "sketchup":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#ef4444] bg-[#1e0707] flex items-center justify-center font-outfit text-[9px] font-black text-[#ef4444]">
            SKP
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg border border-[#c5a880] bg-[#12100b] flex items-center justify-center font-outfit text-xs font-bold text-[#c5a880]">
            FX
          </div>
        );
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
            We harness official industry-standard software suites (n8n, After Effects, DaVinci Resolve, Unreal Engine 5, Houdini), spatial frameworks, and modern web architectures.
          </p>
        </div>

        {/* Centered Tab Selector with Lucide Icons */}
        <div className="flex justify-center mb-12 md:mb-16 shrink-0 z-20 w-full overflow-x-auto modal-scrollbar pb-2">
          <div className="inline-flex p-1.5 bg-[#0b0b0e] border border-white/10 rounded-full gap-1.5 shrink-0">
            {categories.map((cat) => {
              const isActive = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-outfit text-[9.5px] sm:text-xs tracking-[0.15em] font-bold transition-all duration-300 cursor-pointer shrink-0 flex items-center gap-2 ${
                    isActive ? "text-[#c5a880]" : "text-white/40 hover:text-white"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {cat.categoryIcon}
                    <span>{cat.label}</span>
                  </span>
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

                  {/* Official Brand Software Icon */}
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${tool.iconBg}`}>
                    {renderOfficialLogo(tool.id)}
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
