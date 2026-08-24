"use client";

import { useState, JSX, memo } from "react";
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

const EngineStackSection = memo(function EngineStackSection() {
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
          id: "ps",
          name: "ADOBE PHOTOSHOP",
          description: "Matte painting, raster texture editing & keyframe asset design",
          iconBg: "bg-[#001e36]/40 border-[#31a8ff]/40 text-[#31a8ff] shadow-[0_0_15px_rgba(49,168,255,0.25)]"
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
          description: "Node-based deep compositing, camera tracking & rotoscoping",
          iconBg: "bg-[#f97316]/10 border-[#f97316]/40 text-amber-500 shadow-[0_0_15px_rgba(249,115,22,0.25)]"
        },
        {
          id: "topaz",
          name: "TOPAZ VIDEO AI",
          description: "Neural frame interpolation, motion de-blur & 60 FPS upscaling",
          iconBg: "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
        }
      ]
    },
    {
      id: "unreal_3d",
      label: "3D & REALTIME UNREAL 5",
      categoryIcon: <Gamepad2 className="w-4 h-4" />,
      tools: [
        {
          id: "ue5",
          name: "UNREAL ENGINE 5.5",
          description: "Lumen real-time GI, Nanite virtualized geometry & Metahumans",
          iconBg: "bg-white/10 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.25)]"
        },
        {
          id: "blender",
          name: "BLENDER 4.3 HARD-SURFACE",
          description: "Cycles raytracing, Geometry Nodes procedural generation",
          iconBg: "bg-[#ea580c]/10 border-[#ea580c]/40 text-orange-400 shadow-[0_0_15px_rgba(234,88,12,0.25)]"
        },
        {
          id: "c4d",
          name: "CINEMA 4D & REDSHIFT",
          description: "MoGraph procedurals, GPU cluster rendering & cloth dynamics",
          iconBg: "bg-[#0284c7]/10 border-[#0284c7]/40 text-sky-400 shadow-[0_0_15px_rgba(2,132,199,0.25)]"
        },
        {
          id: "octane",
          name: "OCTANE RENDER ENGINE",
          description: "Spectrally correct GPU unbiased photorealism & volumes",
          iconBg: "bg-[#f59e0b]/10 border-[#f59e0b]/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
        },
        {
          id: "houdini",
          name: "SIDEFX HOUDINI FX",
          description: "Procedural pyro, Vellum cloth, FLIP fluid & VEX scripting",
          iconBg: "bg-[#ef4444]/10 border-[#ef4444]/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
        },
        {
          id: "substance",
          name: "SUBSTANCE 3D PAINTER",
          description: "8K PBR procedural texturing, smart materials & UV baking",
          iconBg: "bg-[#eab308]/10 border-[#eab308]/40 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.25)]"
        }
      ]
    },
    {
      id: "webgl_dev",
      label: "WEBGL & INTERACTIVE WEB",
      categoryIcon: <Code className="w-4 h-4" />,
      tools: [
        {
          id: "three",
          name: "THREE.JS & R3F",
          description: "Custom WebGL shaders, GLTF/GLB optimization & particle systems",
          iconBg: "bg-white/10 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        },
        {
          id: "nextjs",
          name: "NEXT.JS 14 / 15",
          description: "React Server Components, App Router & SSR edge rendering",
          iconBg: "bg-white/10 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        },
        {
          id: "gsap",
          name: "GSAP & SCROLLTRIGGER",
          description: "Hardware-accelerated timeline motion, FLIP & scroll velocity",
          iconBg: "bg-[#84cc16]/10 border-[#84cc16]/40 text-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.25)]"
        },
        {
          id: "tailwind",
          name: "TAILWIND CSS v4",
          description: "Utility-first responsive layouts, CSS container queries",
          iconBg: "bg-[#38bdf8]/10 border-[#38bdf8]/40 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
        },
        {
          id: "framer",
          name: "FRAMER MOTION",
          description: "Physics spring animations, layout morphing & shared layout ID",
          iconBg: "bg-[#a855f7]/10 border-[#a855f7]/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
        },
        {
          id: "typescript",
          name: "TYPESCRIPT STRICT",
          description: "Type-safe interfaces, full end-to-end telemetry schemas",
          iconBg: "bg-[#2563eb]/10 border-[#2563eb]/40 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.25)]"
        }
      ]
    },
    {
      id: "spatial_arch",
      label: "SPATIAL ARCH & XR",
      categoryIcon: <Compass className="w-4 h-4" />,
      tools: [
        {
          id: "visionpro",
          name: "APPLE VISION PRO & visionOS",
          description: "Volumetric spatial computing portals, USDZ & RealityKit",
          iconBg: "bg-white/10 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        },
        {
          id: "revit",
          name: "AUTODESK REVIT BIM",
          description: "Building Information Modeling, parametric architectural schemas",
          iconBg: "bg-[#0284c7]/10 border-[#0284c7]/40 text-sky-400 shadow-[0_0_15px_rgba(2,132,199,0.25)]"
        },
        {
          id: "rhino",
          name: "RHINO 8 & GRASSHOPPER",
          description: "NURBS mathematical surface modeling & algorithmic Grasshopper",
          iconBg: "bg-[#a855f7]/10 border-[#a855f7]/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
        },
        {
          id: "vray",
          name: "CHAOS V-RAY 6",
          description: "Physically accurate camera exposure, sun/sky light simulation",
          iconBg: "bg-[#f59e0b]/10 border-[#f59e0b]/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
        },
        {
          id: "lumion",
          name: "LUMION 2024 PRO",
          description: "Real-time architectural raytracing, volumetric cloud & atmosphere",
          iconBg: "bg-[#0ea5e9]/10 border-[#0ea5e9]/40 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.25)]"
        },
        {
          id: "sketchup",
          name: "SKETCHUP PRO & ENSCAPE",
          description: "Rapid architectural volume blockout & instant VR walkthroughs",
          iconBg: "bg-[#ef4444]/10 border-[#ef4444]/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
        }
      ]
    }
  ];

  const currentCategory = categories.find(c => c.id === activeTab) || categories[0];

  const renderOfficialLogo = (toolId: string) => {
    switch (toolId) {
      case "n8n":
        return (
          <div className="font-mono text-xs font-black tracking-tighter text-[#ff6d5a]">
            n8n
          </div>
        );
      case "langchain":
        return (
          <div className="font-mono text-[10px] font-black tracking-tighter text-emerald-400">
            🦜🔗
          </div>
        );
      case "openai":
        return (
          <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0813 4.7792-2.7582a.7938.7938 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4954 4.4953zM3.6047 18.3329a4.466 4.466 0 0 1-.5358-3.0137l.142.0859 4.7839 2.7582a.7796.7796 0 0 0 .7855 0l5.8343-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1353-1.6173zM2.3423 8.5756a4.466 4.466 0 0 1 2.3454-1.9727V12.15a.7796.7796 0 0 0 .3927.6813l5.8296 3.3638-2.0152 1.1638a.0804.0804 0 0 1-.0711.0095L4.015 14.6247a4.4945 4.4945 0 0 1-1.6727-6.0491zm16.597 3.2727L13.11 8.4845l2.0152-1.1638a.0804.0804 0 0 1 .0711-.0095l4.8077 2.7487a4.4945 4.4945 0 0 1 1.6727 6.0491 4.466 4.466 0 0 1-2.3454 1.9727v-5.547a.789.789 0 0 0-.3927-.6813zm1.4507-3.7937l-.142-.0859-4.7792-2.7582a.7796.7796 0 0 0-.7855 0L8.854 8.579V6.2466a.0804.0804 0 0 1 .0332-.0615l4.8416-2.7914a4.4992 4.4992 0 0 1 6.1353 1.6173 4.466 4.466 0 0 1 .5358 3.0137zM10.74 13.5654l-2.527-1.4602 2.527-1.4602 2.527 1.4602-2.527 1.4602z"/>
          </svg>
        );
      case "comfyui":
        return (
          <div className="font-mono text-xs font-black text-amber-400">
            COMFY
          </div>
        );
      case "supabase":
        return (
          <div className="font-mono text-xs font-black text-emerald-400">
            ⚡ SUPA
          </div>
        );
      case "flux":
        return (
          <div className="font-mono text-xs font-black text-rose-400">
            FLUX
          </div>
        );
      case "ae":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#9999ff] bg-[#00005b] flex items-center justify-center font-outfit text-xs font-black text-[#9999ff]">
            Ae
          </div>
        );
      case "ps":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#31a8ff] bg-[#001e36] flex items-center justify-center font-outfit text-xs font-black text-[#31a8ff]">
            Ps
          </div>
        );
      case "davinci":
        return (
          <div className="w-7 h-7 rounded-full border border-rose-500 bg-[#1e070c] flex items-center justify-center font-outfit text-[9px] font-black text-rose-400">
            DVR
          </div>
        );
      case "pr":
        return (
          <div className="w-7 h-7 rounded-lg border border-[#9999ff] bg-[#00005b] flex items-center justify-center font-outfit text-xs font-black text-[#9999ff]">
            Pr
          </div>
        );
      case "nuke":
        return (
          <div className="w-7 h-7 rounded-full border border-orange-500 bg-[#1e0e07] flex items-center justify-center font-outfit text-[9px] font-black text-amber-500">
            NK
          </div>
        );
      case "topaz":
        return (
          <div className="w-7 h-7 rounded-lg border border-cyan-400 bg-[#07191e] flex items-center justify-center font-outfit text-[8px] font-black text-cyan-400">
            AI
          </div>
        );
      case "ue5":
        return (
          <div className="w-7 h-7 rounded-full border border-white bg-black flex items-center justify-center font-outfit text-xs font-black text-white">
            U
          </div>
        );
      case "blender":
        return (
          <div className="w-7 h-7 rounded-full border border-orange-500 bg-[#1e0e07] flex items-center justify-center font-outfit text-[9px] font-black text-orange-400">
            B3D
          </div>
        );
      case "c4d":
        return (
          <div className="w-7 h-7 rounded-lg border border-sky-400 bg-[#07161e] flex items-center justify-center font-outfit text-[9px] font-black text-sky-400">
            C4D
          </div>
        );
      case "octane":
        return (
          <div className="w-7 h-7 rounded-full border border-amber-400 bg-[#1e1607] flex items-center justify-center font-outfit text-[9px] font-black text-amber-400">
            OCT
          </div>
        );
      case "houdini":
        return (
          <div className="w-7 h-7 rounded-lg border border-red-500 bg-[#1e0707] flex items-center justify-center font-outfit text-[9px] font-black text-red-400">
            H
          </div>
        );
      case "substance":
        return (
          <div className="w-7 h-7 rounded-lg border border-yellow-400 bg-[#1e1a07] flex items-center justify-center font-outfit text-[9px] font-black text-yellow-400">
            Sb
          </div>
        );
      case "three":
        return (
          <div className="w-7 h-7 rounded-lg border border-white/60 bg-black flex items-center justify-center font-outfit text-[9px] font-black text-white">
            r3f
          </div>
        );
      case "nextjs":
        return (
          <div className="w-7 h-7 rounded-full border border-white/60 bg-black flex items-center justify-center font-outfit text-xs font-black text-white">
            N
          </div>
        );
      case "gsap":
        return (
          <div className="w-7 h-7 rounded-full border border-lime-400 bg-[#121e07] flex items-center justify-center font-outfit text-[8px] font-black text-lime-400">
            GSAP
          </div>
        );
      case "tailwind":
        return (
          <div className="w-7 h-7 rounded-lg border border-sky-400 bg-[#07161e] flex items-center justify-center font-outfit text-[8px] font-black text-sky-400">
            TW
          </div>
        );
      case "framer":
        return (
          <div className="w-7 h-7 rounded-lg border border-purple-400 bg-[#14071e] flex items-center justify-center font-outfit text-xs font-black text-purple-400">
            F
          </div>
        );
      case "typescript":
        return (
          <div className="w-7 h-7 rounded-lg border border-blue-500 bg-[#07101e] flex items-center justify-center font-outfit text-xs font-black text-blue-400">
            TS
          </div>
        );
      case "visionpro":
        return (
          <div className="w-7 h-7 rounded-full border border-white/60 bg-black flex items-center justify-center font-outfit text-[8px] font-black text-white">
            🥽
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
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 1.5L2.5 7V17L12 22.5L21.5 17V7L12 1.5Z"
              fill="#E1251B"
            />
            <path
              d="M12 1.5L21.5 7V17L12 22.5V1.5Z"
              fill="#B81416"
            />
            <path
              d="M6.5 9.5L12 6.5L17.5 9.5L12 12.5L6.5 9.5Z"
              fill="#FFFFFF"
            />
            <path
              d="M6.5 13.5L12 16.5V20.5L6.5 17.5V13.5Z"
              fill="#FFFFFF"
            />
          </svg>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg border border-[#c5a880] bg-[#12100b] flex items-center justify-center font-outfit text-xs font-bold text-[#c5a880]">
            FX
          </div>
        );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const }
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

        {/* Tab Selector — mobile scrollable without cut-off */}
        <div className="flex justify-start md:justify-center mb-12 md:mb-16 shrink-0 z-20 w-full overflow-x-auto no-scrollbar pb-2 px-2 md:px-0">
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

        {/* 3-Column Tool Cards Grid with Staggered Motion Reveal */}
        <div className="w-full relative min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full"
            >
              {currentCategory.tools.map((tool, idx) => (
                <motion.div
                  key={tool.id || idx}
                  variants={cardItemVariants}
                  className="glass-card rounded-2xl p-6 border border-white/6 flex flex-col gap-4 min-h-[160px] bg-[#09090d]/90 hover:border-[#c5a880]/40 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),_0_0_20px_rgba(197,168,128,0.08)] transition-all duration-500 relative group overflow-hidden"
                >
                  {/* Glowing dot indicator — visible on touch & desktop */}
                  <div className="absolute top-4 right-4 w-4 h-4 flex items-center justify-center opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
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
                    <p className="font-mono text-[9.5px] md:text-[10px] text-white/60 tracking-wider leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </ScrollAnimatedWrapper>
  </section>
  );
});

export default EngineStackSection;
