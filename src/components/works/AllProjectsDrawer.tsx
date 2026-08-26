"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Project } from "@/context/AdminContext";
import { getProjectVideoUrl, getVideoEmbedUrl, getProjectThumbnailUrl } from "@/utils/media";

interface AllProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filteredProjects: Project[];
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectProject: (p: Project) => void;
}

export default function AllProjectsDrawer({
  isOpen,
  onClose,
  filteredProjects,
  categories,
  activeCategory,
  onSelectCategory,
  onSelectProject
}: AllProjectsDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[11000] bg-black/95 backdrop-blur-sm overflow-y-auto p-6 md:p-12 lg:p-16 flex flex-col gap-10"
        >
          {/* Header Controls */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#c5a880] uppercase font-bold">
                PROJECT DIRECTORY
              </span>
              <h3 className="font-display text-2xl md:text-4xl font-bold tracking-[0.06em] text-white uppercase">
                ALL PROJECTS ARCHIVE ({filteredProjects.length})
              </h3>
            </div>

            <button
              onClick={() => {
                onClose();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).lenis?.start();
              }}
              className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
              aria-label="Close directory"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="max-w-7xl mx-auto w-full flex flex-wrap gap-3 font-mono text-[9px] md:text-[10px] tracking-[0.2em] font-medium text-white/50">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-2 rounded-full border cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? "bg-[#c5a880] text-black border-[#c5a880] font-bold shadow-md" 
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Grid of Filtered Projects */}
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const videoUrl = getProjectVideoUrl(project);
              const displayImage = !videoUrl ? getProjectThumbnailUrl(project) : null;
              const isEmbedVideo = videoUrl && (videoUrl.includes("vimeo.com") || videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));

              return (
                <div
                  key={`all-${project.id}`}
                  onClick={() => onSelectProject(project)}
                  className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer bg-[#09090d] border border-white/10 shadow-2xl p-3 transition-all duration-500 hover:border-[#c5a880]/60 hover:shadow-[0_0_30px_rgba(197,168,128,0.2)]"
                >
                  {videoUrl ? (
                    isEmbedVideo ? (
                      <iframe
                        src={getVideoEmbedUrl(videoUrl)}
                        className="w-full h-full border-0 object-cover pointer-events-none rounded-xl scale-[1.05]"
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
                        className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    )
                  ) : (
                    <div className="w-full h-full relative rounded-xl overflow-hidden">
                      {displayImage && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={displayImage}
                          alt={project.title}
                          className="w-full h-full object-cover object-top rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out relative z-10"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${project.bgGradient || "from-slate-900 via-zinc-950 to-[#050507]"} p-6 flex flex-col justify-between overflow-hidden border border-white/5 group-hover:border-[#c5a880]/30 transition-all z-0`}>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c5a880]/10 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent rounded-2xl pointer-events-none" />

                  <div className="absolute top-5 left-5 z-20 bg-black/70 px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                    <span className="font-mono text-[8.5px] text-white font-bold tracking-[0.2em] uppercase">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-1 pointer-events-none">
                    <span className="font-mono text-[8.5px] tracking-[0.25em] text-[#c5a880] uppercase font-bold">
                      {project.subtitle} • {project.year}
                    </span>
                    <h4 className="font-outfit text-lg font-bold tracking-[0.05em] text-white uppercase group-hover:text-[#c5a880] transition-colors duration-300">
                      {project.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
