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
      case "comfyui":
        return (
          <svg className="w-7 h-7 rounded-md overflow-hidden" viewBox="0 0 84 84" fill="none">
            <rect width="84" height="84" fill="#172DD7" />
            <path
              d="M28.5899 69.2727C27.3242 69.2727 26.303 68.8023 25.637 67.9128C24.9524 66.9989 24.774 65.723 25.1471 64.4133L26.6455 59.1518C26.765 58.7329 26.6818 58.2821 26.4212 57.9336C26.1606 57.5858 25.7529 57.381 25.3198 57.381H21.0116C19.7453 57.381 18.724 56.9112 18.0583 56.0218C17.3738 55.1072 17.1953 53.8314 17.5687 52.5216L22.7163 34.5286L23.2847 32.5517C24.0487 29.869 26.8349 27.6888 29.4966 27.6888H34.6517C35.2668 27.6888 35.8079 27.2787 35.9773 26.6835L37.6821 20.6987C38.4453 18.0187 41.2316 15.8385 43.8933 15.8385L54.9181 15.8189L62.9891 15.8182C64.2551 15.8182 65.2763 16.288 65.942 17.1774C66.6265 18.0913 66.805 19.3672 66.4319 20.6769L64.124 28.7803C63.3611 31.4595 60.5748 33.6391 57.9131 33.6391L46.8637 33.6601H41.7104C41.0959 33.6601 40.5555 34.0695 40.3851 34.6641L36.0883 49.6722C35.9681 50.0919 36.0513 50.5441 36.3126 50.8925C36.5732 51.2403 36.9809 51.445 37.4136 51.445L44.7152 51.4308H52.7622C54.0282 51.4308 55.0494 51.9006 55.7151 52.7901C56.3996 53.7046 56.5781 54.9805 56.2047 56.2902L53.8969 64.3923C53.1339 67.0722 50.3476 69.2517 47.686 69.2517L36.6369 69.2727H28.5899Z"
              fill="#F0FF41"
            />
          </svg>
        );
      case "langchain":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path
              d="M13.796 0a6.93 6.93 0 0 0-4.91 2.019L5.451 5.455l3.273 3.27 3.432-3.432a2.284 2.284 0 0 1 3.277 0 2.28 2.28 0 0 1 0 3.275L12 12.001l3.273 3.273 3.433-3.435c2.692-2.692 2.692-7.127 0-9.82A6.92 6.92 0 0 0 13.796 0m-5.07 8.728-3.433 3.434c-2.692 2.693-2.692 7.126 0 9.819A6.92 6.92 0 0 0 10.203 24a6.93 6.93 0 0 0 4.911-2.02l3.432-3.432-3.271-3.272-3.433 3.433a2.284 2.284 0 0 1-3.277 0 2.28 2.28 0 0 1 0-3.276L12 12z"
              fill="#7FC8FF"
            />
          </svg>
        );
      case "supabase":
        return (
          <svg className="w-6 h-6" viewBox="0 0 512 512">
            <defs>
              <linearGradient id="supa-a" x1="237.109" x2="419.106" y1="223.219" y2="146.89" gradientTransform="matrix(1 0 0 -1 0 513)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#249361" />
                <stop offset="1" stopColor="#3ecf8e" />
              </linearGradient>
              <linearGradient id="supa-b" x1="245.829" x2="328.829" y1="411.681" y2="255.438" gradientTransform="matrix(1 0 0 -1 0 513)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#000" />
                <stop offset="1" stopColor="#000" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M297.6 501c-12.9 16.3-39.2 7.4-39.5-13.4L253.6 183h204.8c37.1 0 57.8 42.8 34.7 71.9z" fill="url(#supa-a)" />
            <path d="M297.6 501c-12.9 16.3-39.2 7.4-39.5-13.4L253.6 183h204.8c37.1 0 57.8 42.8 34.7 71.9z" fill="url(#supa-b)" fillOpacity="0.2" />
            <path d="M214.4 11c12.9-16.3 39.2-7.4 39.5 13.4l2 304.5H53.7c-37.1 0-57.8-42.8-34.7-71.9z" fill="#3ecf8e" />
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
          <svg className="w-7 h-7" viewBox="0 0 512 512">
            <path d="M90.7 6.4h330.7c50.1 0 90.7 40.5 90.7 90.7V415c0 50.1-40.5 90.7-90.7 90.7H90.7C40.5 505.6 0 465.1 0 414.9V97.1C0 46.9 40.5 6.4 90.7 6.4" fill="#00005b" />
            <path d="M121.6 356.3V136.5c0-1.5.6-2.3 2.1-2.3 3.6 0 7 0 11.9-.2 5.1-.2 10.5-.2 16.2-.4 5.8-.2 11.9-.2 18.6-.4 6.6-.2 13-.2 19.4-.2 17.5 0 32 2.1 43.9 6.6 10.7 3.6 20.5 9.6 28.6 17.5 6.8 6.8 12.2 15.1 15.6 24.3 3.2 9 4.9 18.1 4.9 27.7 0 18.3-4.3 33.5-12.8 45.4s-20.5 20.9-34.3 26c-14.5 5.3-30.5 7.3-48 7.3-5.1 0-8.5 0-10.7-.2s-5.1-.2-9.2-.2v68.5c.2 1.5-.9 2.8-2.3 3h-41.4c-1.7 0-2.6-.9-2.6-2.8zm46.5-180.7v71.7c3 .2 5.8.4 8.3.4h11.3c8.3 0 16.6-1.3 24.5-3.8 6.8-1.9 12.8-6 17.5-11.3 4.5-5.3 6.6-12.6 6.6-22 .2-6.6-1.5-13.2-4.9-19-3.6-5.5-8.7-9.8-14.9-12.2-7.9-3.2-16.4-4.5-25.2-4.3-5.5 0-10.5 0-14.5.2-4.2-.2-7.2.1-8.7.3m145.5 12.6h37.3c2.1 0 3.8 1.5 4.5 3.4.6 1.7 1.1 3.4 1.3 5.3.4 2.1.9 4.5 1.1 6.6.2 2.3.4 4.9.4 7.7 6.4-7.5 14.1-13.7 22.8-18.3 9.8-5.5 21.1-8.3 32.4-8.3 1.5-.2 2.8.9 3 2.3v42.5c0 1.7-1.1 2.3-3.4 2.3-7.7-.2-15.6.4-23 2.1-6.2 1.3-12.2 3.2-17.9 5.8-4.1 1.9-7.9 4.5-10.9 7.9v108.8c0 2.1-.9 3-2.8 3h-42c-1.7.2-3.2-.9-3.4-2.6v-119c0-5.1 0-10.5-.2-16s-.2-11.1-.4-16.6c0-4.9-.4-9.6-.9-14.5-.2-1.1.4-2.1 1.5-2.3 0-.4.4-.4.6-.1" fill="#9999ff" />
          </svg>
        );
      case "ps":
        return (
          <svg className="w-7 h-7" viewBox="0 0 512 512">
            <path d="M90.7 6.4h330.7c50.1 0 90.7 40.5 90.7 90.7V415c0 50.1-40.5 90.7-90.7 90.7H90.7C40.5 505.6 0 465.1 0 414.9V97.1C0 46.9 40.5 6.4 90.7 6.4" fill="#001e36" />
            <path d="M115.2 356.5V137c0-1.5.6-2.3 2.1-2.3 3.6 0 7 0 11.9-.2 5.1-.2 10.5-.2 16.2-.4s11.9-.2 18.6-.4c6.6-.2 13-.2 19.4-.2 17.5 0 32 2.1 43.9 6.6 10.7 3.6 20.5 9.6 28.6 17.5 6.8 6.8 12.2 15.1 15.6 24.3 3.2 9 4.9 18.1 4.9 27.7 0 18.3-4.3 33.5-12.8 45.4s-20.5 20.9-34.3 26c-14.5 5.3-30.5 7.3-48 7.3-5.1 0-8.5 0-10.7-.2-2.1-.2-5.1-.2-9.2-.2v68.5c.2 1.5-.9 2.8-2.3 3h-41.4c-1.6-.1-2.5-1-2.5-2.9m46.5-180.7v71.7c3 .2 5.8.4 8.3.4h11.3c8.3 0 16.6-1.3 24.5-3.8 6.8-1.9 12.8-6 17.5-11.3 4.5-5.3 6.6-12.6 6.6-22 .2-6.6-1.5-13.2-4.9-19-3.6-5.5-8.7-9.8-14.9-12.2-7.9-3.2-16.4-4.5-25.2-4.3-5.5 0-10.5 0-14.5.2-4.2-.1-7.2.1-8.7.3m247.9 58.7c-6.4-3.4-13.2-5.8-20.5-7.3-7.9-1.7-15.8-2.8-23.9-2.8-4.3-.2-8.7.4-12.8 1.5-2.8.6-5.1 2.1-6.6 4.3-1.1 1.7-1.7 3.8-1.7 5.8 0 1.9.9 3.8 2.1 5.5 1.9 2.3 4.5 4.3 7.3 5.8 4.9 2.6 10 4.9 15.1 7 11.5 3.8 22.6 9.2 32.9 15.6 7 4.5 12.8 10.5 16.9 17.7 3.4 6.8 5.1 14.3 4.9 22 .2 10-2.8 20.1-8.3 28.4-6 8.5-14.3 15.1-23.9 19-10.5 4.5-23.3 6.8-38.6 6.8-9.8 0-19.4-.9-29-2.8-7.5-1.3-14.9-3.6-21.8-6.8-1.5-.9-2.6-2.3-2.3-4.1V313c0-.6.2-1.5.9-1.9s1.3-.2 1.9.2c8.3 4.9 17.1 8.3 26.5 10.5 8.1 2.1 16.6 3.2 25.2 3.2 8.1 0 13.9-1.1 17.7-3 3.4-1.5 5.8-5.1 5.8-9 0-3-1.7-5.8-5.1-8.5s-10.5-6-20.9-10c-10.9-3.8-20.9-9-30.3-15.4-6.6-4.7-12.2-10.9-16.2-18.1-3.4-6.8-5.1-14.3-4.9-21.8 0-9.2 2.6-17.9 7.3-25.8 5.3-8.5 13.2-15.4 22.4-19.6 10-5.1 22.6-7.5 37.8-7.5 8.7 0 17.7.6 26.5 1.9 6.4.9 12.6 2.6 18.3 4.9.9.2 1.7 1.1 2.1 1.9.2.9.4 1.7.4 2.6v34.8c0 .9-.4 1.7-1.1 2.1-2.2.4-3.2.4-4.1 0" fill="#31a8ff" />
          </svg>
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
          <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="7" fill="#0A0E1A" stroke="#00C2FF" strokeWidth="1" />
            <path
              d="M16 4L20.5 11.5L28 16L20.5 20.5L16 28L11.5 20.5L4 16L11.5 11.5L16 4Z"
              fill="#00C2FF"
            />
            <circle cx="16" cy="16" r="3" fill="#FFFFFF" />
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
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0a12 12 0 1012 12A12 12 0 0012 0zm0 23.52A11.52 11.52 0 1123.52 12 11.52 11.52 0 0112 23.52zm7.13-9.791c-.206.997-1.126 3.557-4.06 4.942l-1.179-1.325-1.988 2a7.338 7.338 0 01-5.804-2.978 2.859 2.859 0 00.65.123c.326.006.678-.114.678-.66v-5.394a.89.89 0 00-1.116-.89c-.92.212-1.656 2.509-1.656 2.509a7.304 7.304 0 012.528-5.597 7.408 7.408 0 013.73-1.721c-1.006.573-1.57 1.507-1.57 2.29 0 1.262.76 1.109.984.923v7.28a1.157 1.157 0 00.148.256 1.075 1.075 0 00.88.445c.76 0 1.747-.868 1.747-.868V9.172c0-.6-.452-1.324-.905-1.572 0 0 .838-.149 1.484.346a5.537 5.537 0 01.387-.425c1.508-1.48 2.929-1.902 4.112-2.112 0 0-2.151 1.69-2.151 3.96 0 1.687.043 5.801.043 5.801.799.771 1.986-.342 3.059-1.441Z"
              fill="#FFFFFF"
            />
          </svg>
        );
      case "blender":
        return (
          <svg className="w-7 h-7" viewBox="2.07 1.3 176.87 143.65">
            <g transform="matrix(.281 0 0 .281 -41.8 -43.7)">
              <g transform="matrix(21.6 0 0 21.6 -4857 7665)">
                <path d="m243-334c0.106-1.89 1.03-3.56 2.43-4.74 1.37-1.16 3.21-1.87 5.23-1.87 2.01 0 3.85 0.709 5.22 1.87 1.4 1.18 2.32 2.85 2.43 4.74 0.106 1.94-0.675 3.75-2.04 5.09-1.4 1.36-3.38 2.22-5.61 2.22s-4.22-0.854-5.61-2.22c-1.37-1.34-2.15-3.14-2.04-5.08z" fill="#fff" fillRule="nonzero" />
              </g>
              <g transform="matrix(11.1 0 0 11.1 -2215 4153)">
                <path d="m243-334c0.106-1.89 1.03-3.56 2.43-4.74 1.37-1.16 3.21-1.87 5.23-1.87 2.01 0 3.85 0.709 5.22 1.87 1.4 1.18 2.32 2.85 2.43 4.74 0.106 1.94-0.675 3.75-2.04 5.09-1.4 1.36-3.38 2.22-5.61 2.22s-4.22-0.854-5.61-2.22c-1.37-1.34-2.15-3.14-2.04-5.08z" fill="#265787" fillRule="nonzero" />
                <path d="m231-330c0.013 0.74 0.249 2.18 0.603 3.3 0.744 2.38 2.01 4.58 3.76 6.51 1.8 1.99 4.02 3.59 6.58 4.73 2.69 1.19 5.61 1.8 8.64 1.8 3.03-4e-3 5.95-0.624 8.64-1.83 2.56-1.15 4.78-2.75 6.58-4.75 1.76-1.95 3.02-4.15 3.76-6.53 0.375-1.2 0.612-2.42 0.707-3.64 0.093-1.2 0.054-2.41-0.117-3.62-0.334-2.35-1.15-4.56-2.4-6.56-1.14-1.85-2.62-3.46-4.38-4.82l4e-3 -3e-3 -17.7-13.6c-0.016-0.012-0.029-0.025-0.046-0.036-1.16-0.892-3.12-0.889-4.39 5e-3 -1.29 0.904-1.44 2.4-0.29 3.34l-5e-3 5e-3 7.39 6.01-22.5 0.024h-0.03c-1.86 2e-3 -3.65 1.22-4 2.77-0.364 1.57 0.9 2.88 2.84 2.88l-3e-3 7e-3 11.4-0.022-20.4 15.6c-0.026 0.019-0.054 0.039-0.078 0.058-1.92 1.47-2.54 3.92-1.33 5.46 1.23 1.57 3.84 1.58 5.78 9e-3l11.1-9.1s-0.162 1.23-0.149 1.96zm28.6 4.11c-2.29 2.33-5.5 3.66-8.96 3.66-3.47 6e-3 -6.68-1.3-8.97-3.63-1.12-1.14-1.94-2.44-2.45-3.83-0.497-1.37-0.69-2.82-0.562-4.28 0.121-1.43 0.547-2.8 1.23-4.03 0.668-1.21 1.59-2.31 2.72-3.24 2.23-1.81 5.06-2.8 8.02-2.8 2.97-4e-3 5.8 0.969 8.03 2.78 1.13 0.924 2.05 2.02 2.72 3.23 0.683 1.23 1.11 2.59 1.23 4.03 0.126 1.46-0.067 2.91-0.564 4.28-0.508 1.4-1.33 2.7-2.45 3.84z" fill="#ea7600" fillRule="nonzero" />
              </g>
            </g>
          </svg>
        );
      case "houdini":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path
              d="M0 19.635V24h3.824A8.662 8.662 0 0 1 0 19.635zm16.042-4.555c0-4.037-3.253-7.92-8.111-8.089C4.483 6.873 1.801 8.136 0 10.005v4.209c1.224-3.549 4.595-5.158 7.419-5.128 3.531.041 6.251 2.703 6.275 5.72 0 2.878-1.183 4.992-4.436 5.516-1.774.296-4.548-.754-4.436-3.434.065-1.381 1.138-2.162 2.366-2.106-1.207 1.618.39 2.801 1.52 2.561a2.51 2.51 0 0 0 1.966-2.502c0-1.017-.958-2.662-3.333-2.6-2.936.068-4.785 2.183-4.85 4.797-.071 3.28 3.007 5.457 6.174 5.483 4.633.059 7.395-2.984 7.377-7.441zM0 0v6.906a12.855 12.855 0 0 1 7.931-2.609c6.801 0 11.134 4.762 11.131 10.765 0 4.17-1.946 7.308-4.995 8.938H24V0H0z"
              fill="#FF4713"
            />
          </svg>
        );
      case "maya":
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path
              d="M4.348 0 .69 2.203v16.875l3.657-2.203h17.297V1.219c0-.67-.551-1.219-1.22-1.219H4.349zm18.297 3.75v14.125H4.627l-1.943 1.17v3.736c0 .67.55 1.219 1.218 1.219H23.31V3.75h-.664zm-14.471.025h2.937l1.885 7.508 1.977-7.48-.012-.028h2.857v9.354h-2.216v-6.04l-1.565 6.026v.014h-2.203l-1.656-6.28v6.28H8.174V3.775zm1.33 14.762h1.18l1.068 3.543h-.902l-.217-.773H9.568l-.197.773h-.88l1.013-3.543zm1.918 0h.932l.648 1.494.643-1.494h.894l-1.113 2.133v1.41h-.887v-1.406l-1.117-2.137zm3.826 0h1.18l1.068 3.543h-.9l-.217-.773h-1.065l-.197.773h-.88l1.011-3.543zm-5.156.582-.362 1.53h.73l-.368-1.53zm5.744 0-.36 1.53h.73l-.37-1.53z"
              fill="#37A5CC"
            />
          </svg>
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
