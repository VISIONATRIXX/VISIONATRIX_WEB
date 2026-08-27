"use client";

import { useRef, useCallback, memo, useState, useEffect } from "react";
import { ArrowUpRight, Globe, Play, Eye } from "lucide-react";
import { Project } from "@/context/AdminContext";
import { getProjectVideoUrl, getVideoEmbedUrl, getProjectThumbnailUrl } from "@/utils/media";

interface MarqueeProjectCardProps {
  project: Project;
  onOpenDetails: (p: Project) => void;
}

const MarqueeProjectCard = memo(function MarqueeProjectCard({
  project,
  onOpenDetails
}: MarqueeProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const videoUrl = getProjectVideoUrl(project);
  const displayImage = getProjectThumbnailUrl(project);

  const isEmbedVideo = videoUrl && (videoUrl.includes("vimeo.com") || videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));
  const isDirectVideo = videoUrl && !isEmbedVideo;

  const hasLive = Boolean(project.details?.liveUrl);

  // Intersection Observer — lazy load media
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    io.observe(card);
    return () => io.disconnect();
  }, []);

  // Play/pause video on hover
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isDirectVideo) return;
    if (isHovered && isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isHovered, isVisible, isDirectVideo]);

  // 3D tilt via direct DOM — zero re-renders
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    const card = cardRef.current;
    if (card) card.style.transform = "";
  }, []);

  const handleClick = useCallback(() => {
    onOpenDetails(project);
  }, [onOpenDetails, project]);

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex-shrink-0 w-[300px] sm:w-[420px] aspect-[16/10] rounded-[20px] overflow-hidden cursor-pointer select-none transform-gpu"
      style={{ transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {/* Card body */}
      <div className="absolute inset-0 rounded-[20px] overflow-hidden bg-[#0a0a10] border border-white/[0.08] group-hover:border-[#c5a880]/40 transition-[border-color] duration-500 z-[1]">
        
        {/* === MEDIA LAYER === */}
        <div className="absolute inset-0 z-0">
          {isDirectVideo ? (
            <>
              {displayImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={displayImage}
                  alt={project.title}
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${videoReady ? "opacity-0" : "opacity-80"}`}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              )}
              {isVisible && (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onLoadedData={() => setVideoReady(true)}
                  className={`w-full h-full object-cover transition-all duration-700 ease-out ${isHovered ? "scale-[1.06] opacity-100" : "opacity-75"}`}
                />
              )}
            </>
          ) : isEmbedVideo ? (
            <>
              {displayImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={displayImage}
                  alt={project.title}
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 ${isHovered ? "opacity-0 scale-105" : "opacity-80"}`}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              )}
              {isHovered && isVisible && (
                <iframe
                  src={getVideoEmbedUrl(videoUrl)}
                  className="w-full h-full border-0 pointer-events-none scale-[1.08]"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  title={project.title}
                />
              )}
            </>
          ) : (
            displayImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={displayImage}
                alt={project.title}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${isHovered ? "scale-[1.06] opacity-100" : "opacity-75"}`}
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            )
          )}
        </div>

        {/* === OVERLAY GRADIENTS (static, no transitions) === */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] z-[3] pointer-events-none bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-[20%] z-[3] pointer-events-none bg-gradient-to-b from-black/30 to-transparent" />

        {/* === TOP BAR: Status Indicators === */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-[10] flex items-center justify-between pointer-events-none">
          {/* Project number */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-white/50 tracking-[0.15em]">
              {project.id}
            </span>
            <div className="w-4 h-[1px] bg-white/20" />
            <span className="font-mono text-[8px] text-white/40 tracking-wider uppercase">
              {project.year}
            </span>
          </div>

          {/* Live / Video / Static indicator */}
          {hasLive ? (
            <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[7px] text-emerald-300 font-bold tracking-[0.15em] uppercase">
                LIVE
              </span>
            </div>
          ) : videoUrl ? (
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              <Play className="w-2.5 h-2.5 text-[#c5a880] fill-[#c5a880]" />
              <span className="font-mono text-[7px] text-[#c5a880]/80 font-bold tracking-[0.12em] uppercase">
                VIDEO
              </span>
            </div>
          ) : null}
        </div>

        {/* === BOTTOM CONTENT === */}
        <div className="absolute bottom-0 left-0 right-0 z-[10] p-4 sm:p-5 flex flex-col gap-2.5 pointer-events-none">
          {/* Animated gold accent line */}
          <div className="w-8 h-[2px] bg-[#c5a880] rounded-full transition-all duration-500 group-hover:w-16 group-hover:shadow-[0_0_12px_rgba(197,168,128,0.6)]" />
          
          {/* Title */}
          <h4 className="font-outfit text-[15px] sm:text-lg font-bold tracking-[0.04em] text-white uppercase leading-tight">
            {project.title}
          </h4>

          {/* Category + tagline */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] sm:text-[9px] text-[#c5a880] font-bold tracking-[0.2em] uppercase">
              {project.category}
            </span>
            {project.tagline && (
              <>
                <div className="w-[3px] h-[3px] rounded-full bg-white/20" />
                <span className="font-sans text-[9px] text-white/40 truncate max-w-[160px]">
                  {project.tagline}
                </span>
              </>
            )}
          </div>
        </div>

        {/* === HOVER CTA OVERLAY === */}
        <div className="absolute inset-0 z-[20] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center gap-2.5 bg-black/80 border border-[#c5a880]/50 px-5 py-2.5 rounded-full">
            {hasLive ? (
              <>
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-outfit text-[10px] sm:text-xs tracking-[0.14em] font-bold uppercase text-white">
                  OPEN LIVE DEMO
                </span>
              </>
            ) : videoUrl ? (
              <>
                <Play className="w-3.5 h-3.5 text-[#c5a880] fill-[#c5a880]" />
                <span className="font-outfit text-[10px] sm:text-xs tracking-[0.14em] font-bold uppercase text-[#c5a880]">
                  PLAY SHOWCASE
                </span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#c5a880]" />
                <span className="font-outfit text-[10px] sm:text-xs tracking-[0.14em] font-bold uppercase text-[#c5a880]">
                  VIEW PROJECT
                </span>
              </>
            )}
            <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default MarqueeProjectCard;
