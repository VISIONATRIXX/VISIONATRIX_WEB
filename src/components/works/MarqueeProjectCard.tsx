"use client";

import { useState, useRef } from "react";
import { Eye, Globe } from "lucide-react";
import { Project } from "@/context/AdminContext";

interface MarqueeProjectCardProps {
  project: Project;
  onOpenDetails: (p: Project) => void;
}

export default function MarqueeProjectCard({
  project,
  onOpenDetails
}: MarqueeProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const livePreviewUrl = project.details?.liveUrl 
    ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(project.details.liveUrl)}?w=1280&h=800`
    : null;
  const displayImage = project.image || livePreviewUrl;

  const categoryTags = project.categories && project.categories.length > 0 
    ? project.categories 
    : [project.category];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -6; // 6deg tilt
    const rotateY = ((x - centerX) / centerX) * 6;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setSpotlightPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onOpenDetails(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, transition: "transform 0.15s ease-out" }}
      className="group relative flex-shrink-0 w-[320px] sm:w-[420px] aspect-[16/10] rounded-[24px] overflow-hidden cursor-pointer bg-[#0e0e14] border border-white/10 shadow-2xl p-2.5 hover:border-[#c5a880]/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] select-none will-change-transform transform-gpu"
    >
      {/* Dynamic Cursor Spotlight Highlight */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px] z-30"
        style={{
          background: `radial-gradient(400px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(197, 168, 128, 0.15), transparent 80%)`
        }}
      />

      <div className="w-full h-full relative rounded-[18px] overflow-hidden bg-[#07070b]">
        {/* Real Live Website Page Snapshot / Background Image / Ambient Canvas */}
        {displayImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={displayImage}
            alt={project.title}
            className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={`w-full h-full rounded-[18px] bg-gradient-to-br ${project.bgGradient || "from-slate-900 via-zinc-950 to-[#050507]"} p-6 flex flex-col justify-between relative overflow-hidden border border-white/5`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c5a880]/10 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Top Left Number Pill Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-black/45 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-white/90 tracking-wider">
              {project.id}
            </span>
          </div>
        </div>

        {/* Bottom Dark Gradient Shadow */}
        <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10 pointer-events-none" />

        {/* Bottom Title & Subtitle Info */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-2 pointer-events-none">
          <h4 className="font-outfit text-lg sm:text-xl font-extrabold tracking-tight text-white uppercase drop-shadow-md truncate">
            {project.title} <span className="text-[#c5a880] font-normal text-sm sm:text-base">— {project.category}</span>
          </h4>

          {/* Category Tag Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categoryTags.map((tag, idx) => (
              <span 
                key={idx}
                className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/20 font-mono text-[9px] text-white/90 font-medium tracking-wide uppercase shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Professional Apple macOS Glassmorphic Hover Indicator Overlay */}
        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/40 backdrop-blur-[3px]">
          <div className="bg-[#0c0c14]/90 backdrop-blur-xl border border-[#c5a880]/70 px-5 py-3 rounded-full flex items-center gap-2.5 text-white shadow-[0_15px_40px_rgba(0,0,0,0.8)] transform group-hover:scale-105 transition-all duration-300">
            {project.details?.liveUrl ? (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="font-outfit text-[10px] sm:text-xs tracking-[0.16em] font-extrabold uppercase text-white">
                  INTERACTIVE LIVE DEMO
                </span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-[#c5a880]" />
                <span className="font-outfit text-[10px] sm:text-xs tracking-[0.16em] font-extrabold uppercase text-[#c5a880]">
                  EXPLORE CASE BRIEF
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
