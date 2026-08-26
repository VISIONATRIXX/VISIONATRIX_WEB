"use client";

import { useRef, useCallback, memo } from "react";
import { Eye, Globe, Play } from "lucide-react";
import { Project } from "@/context/AdminContext";
import { getProjectVideoUrl, getVideoEmbedUrl, getProjectThumbnailUrl } from "@/utils/media";

interface MarqueeProjectCardProps {
  project: Project;
  onOpenDetails: (p: Project) => void;
}

// Use direct DOM manipulation for tilt instead of React state to avoid re-renders
const MarqueeProjectCard = memo(function MarqueeProjectCard({
  project,
  onOpenDetails
}: MarqueeProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const videoUrl = getProjectVideoUrl(project);
  const displayImage = !videoUrl ? getProjectThumbnailUrl(project) : null;

  const categoryTags = project.categories && project.categories.length > 0 
    ? project.categories.slice(0, 3)
    : [project.category];

  // Direct DOM manipulation — zero re-renders on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = "";
    }
  }, []);

  const handleClick = useCallback(() => {
    onOpenDetails(project);
  }, [onOpenDetails, project]);

  const isEmbedVideo = videoUrl && (videoUrl.includes("vimeo.com") || videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex-shrink-0 w-[280px] sm:w-[380px] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer bg-[#0e0e14] border border-white/10 p-2 hover:border-[#c5a880]/50 select-none transform-gpu"
      style={{ transition: "transform 0.2s ease-out, border-color 0.3s" }}
    >
      <div className="w-full h-full relative rounded-xl overflow-hidden bg-[#07070b]">
        {/* Background Image / Video Media */}
        {videoUrl ? (
          isEmbedVideo ? (
            <iframe
              src={getVideoEmbedUrl(videoUrl)}
              className="w-full h-full border-0 object-cover pointer-events-none scale-[1.05]"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              title={project.title}
            />
          ) : (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-[opacity,transform] duration-500 ease-out"
            />
          )
        ) : (
          <>
            {displayImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={displayImage}
                alt={project.title}
                className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-[opacity,transform] duration-500 ease-out relative z-0"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <div className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient || "from-slate-900 via-zinc-950 to-[#050507]"} flex flex-col justify-between overflow-hidden z-0`} />
          </>
        )}

        {/* Top Left Number Pill Badge */}
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-black/50 px-3 py-0.5 rounded-full border border-white/15">
            <span className="font-mono text-[10px] font-bold text-white/85 tracking-wider">
              {project.id}
            </span>
          </div>
        </div>

        {/* Bottom Dark Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none" />

        {/* Bottom Title & Tags */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          <h4 className="font-outfit text-base sm:text-lg font-bold tracking-tight text-white uppercase truncate">
            {project.title} <span className="text-[#c5a880] font-normal text-xs sm:text-sm">— {project.category}</span>
          </h4>
          <div className="flex flex-wrap items-center gap-1">
            {categoryTags.map((tag, idx) => (
              <span 
                key={idx}
                className="bg-black/50 px-2 py-0.5 rounded border border-white/15 font-mono text-[8px] text-white/80 font-medium tracking-wide uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Overlay — NO backdrop-blur on mobile */}
        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-black/40">
          <div className="bg-[#0c0c14]/90 border border-[#c5a880]/60 px-4 py-2.5 rounded-full flex items-center gap-2 text-white">
            {project.details?.liveUrl ? (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-outfit text-[10px] sm:text-xs tracking-[0.14em] font-bold uppercase text-white">
                  INTERACTIVE LIVE DEMO
                </span>
              </>
            ) : videoUrl ? (
              <>
                <Play className="w-3.5 h-3.5 text-[#c5a880] fill-[#c5a880]" />
                <span className="font-outfit text-[10px] sm:text-xs tracking-[0.14em] font-bold uppercase text-[#c5a880]">
                  WATCH SHOWCASE VIDEO
                </span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#c5a880]" />
                <span className="font-outfit text-[10px] sm:text-xs tracking-[0.14em] font-bold uppercase text-[#c5a880]">
                  EXPLORE CASE BRIEF
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default MarqueeProjectCard;
