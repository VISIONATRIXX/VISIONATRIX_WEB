"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Grid, ArrowRight, Layers } from "lucide-react";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAdmin, Project } from "@/context/AdminContext";
import MarqueeProjectCard from "./works/MarqueeProjectCard";
import AllProjectsDrawer from "./works/AllProjectsDrawer";
import SafariSandboxModal from "./works/SafariSandboxModal";

const WorksSection = memo(function WorksSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllDrawer, setShowAllDrawer] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [liveMode, setLiveMode] = useState(false);
  const [sandboxDevice, setSandboxDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [isSafariExpanded, setIsSafariExpanded] = useState(false);
  const [isSafariMinimized, setIsSafariMinimized] = useState(false);

  const { projects } = useAdmin();

  const handleOpenProject = (p: Project) => {
    setSelectedProject(p);
    if (p.details?.liveUrl) {
      setLiveMode(true);
      setIsSafariExpanded(true);
    } else {
      setLiveMode(false);
      setIsSafariExpanded(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).lenis?.stop();
  };

  // Global Keyboard Shortcuts Listener (Esc to exit modal, Arrow Left/Right to navigate projects)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keypress if user is typing in an input or textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === "Escape" || e.key === "Esc") {
        if (selectedProject) {
          setSelectedProject(null);
          if (!showAllDrawer) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).lenis?.start();
          }
        } else if (showAllDrawer) {
          setShowAllDrawer(false);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).lenis?.start();
        }
      }

      if (selectedProject) {
        const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
        
        if (e.key === "ArrowRight") {
          const nextIndex = (currentIndex + 1) % projects.length;
          handleOpenProject(projects[nextIndex]);
        } else if (e.key === "ArrowLeft") {
          const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
          handleOpenProject(projects[prevIndex]);
        } else if (e.key === "r" || e.key === "R") {
          setIframeKey(k => k + 1);
        } else if (e.key === "f" || e.key === "F") {
          setIsSafariExpanded(prev => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, showAllDrawer, projects]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  // Divide projects into 3 distinct marquee rows:
  // Row 1: Web & SaaS Platforms
  // Row 2: Video Editing, Reels & UGC Showcase
  // Row 3: Unreal Engine & 3D Automation
  const row1Projects = projects.filter(p => 
    Boolean(p.details?.liveUrl) || 
    p.categories.some(c => ["WEB", "SAAS", "POS", "APP", "DEV", "FULLSTACK"].some(k => c.toUpperCase().includes(k))) ||
    p.category.toUpperCase().includes("WEB") || p.category.toUpperCase().includes("SAAS")
  );

  const row2Projects = projects.filter(p => 
    p.categories.some(c => ["VIDEO", "FILM", "UGC", "REEL", "COMMERCIAL", "MEDIA", "STUDIO", "AD"].some(k => c.toUpperCase().includes(k))) ||
    p.category.toUpperCase().includes("VIDEO") || p.category.toUpperCase().includes("FILM") || p.category.toUpperCase().includes("UGC") || p.category.toUpperCase().includes("REEL")
  );

  const row3Projects = projects.filter(p => 
    p.categories.some(c => ["UNREAL", "CGI", "3D", "VFX", "AUTOMATION", "SPATIAL", "VR", "CONFIGURATOR"].some(k => c.toUpperCase().includes(k))) ||
    p.category.toUpperCase().includes("CGI") || p.category.toUpperCase().includes("VFX") || p.category.toUpperCase().includes("3D") || p.category.toUpperCase().includes("UNREAL") || p.category.toUpperCase().includes("AUTOMATION")
  );

  // Fallbacks if list is small to ensure endless infinite marquee loop
  const list1 = row1Projects.length > 0 ? row1Projects : projects;
  const list2 = row2Projects.length > 0 ? row2Projects : projects;
  const list3 = row3Projects.length > 0 ? row3Projects : projects;

  const dupRow1 = [...list1, ...list1, ...list1];
  const dupRow2 = [...list2, ...list2, ...list2];
  const dupRow3 = [...list3, ...list3, ...list3];

  const categories = [
    "ALL",
    ...Array.from(new Set(
      projects
        .flatMap(p => p.categories || [])
        .map(cat => cat.toUpperCase().trim())
        .filter(Boolean)
    ))
  ];

  const filteredProjects = activeCategory === "ALL" 
    ? projects 
    : projects.filter(p => p.categories.includes(activeCategory));

  // Smooth GSAP Scroll Velocity Controller — pauses when section is off-screen
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    let isVisible = false;
    let targetVelocity = 0;
    let currentVelocity = 0;

    let x1 = 0;
    let x2 = -1200;
    let x3 = 0;

    // IntersectionObserver to pause ticker when section is off-screen
    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { rootMargin: "200px" }
    );
    io.observe(section);

    // Measure page scroll velocity
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        targetVelocity = self.getVelocity() * 0.025;
      }
    });

    // GPU Ticker — only processes when visible
    const updateTicker = (_time: number, deltaTime: number) => {
      if (!isVisible) return;

      currentVelocity += (targetVelocity - currentVelocity) * 0.06;
      targetVelocity *= 0.94;

      const delta = (deltaTime / 16) * 0.7;
      const move = (0.6 + Math.abs(currentVelocity)) * delta;
      const dir = currentVelocity < 0 ? -1 : 1;

      x1 -= move * (dir > 0 ? 1 : 0.7);
      x2 += move * 0.85 * (dir > 0 ? 1 : 0.7);
      x3 -= move * 1.1 * (dir > 0 ? 1 : 0.7);

      const wrapX = 2200;
      if (Math.abs(x1) >= wrapX) x1 = 0;
      if (x2 >= 0) x2 = -wrapX;
      if (Math.abs(x3) >= wrapX) x3 = 0;

      if (row1Ref.current) gsap.set(row1Ref.current, { x: x1, force3D: true });
      if (row2Ref.current) gsap.set(row2Ref.current, { x: x2, force3D: true });
      if (row3Ref.current) gsap.set(row3Ref.current, { x: x3, force3D: true });
    };

    gsap.ticker.add(updateTicker);

    return () => {
      io.disconnect();
      st.kill();
      gsap.ticker.remove(updateTicker);
    };
  }, [projects.length]);

  return (
    <section 
      ref={sectionRef}
      id="works" 
      className="relative w-full bg-[#0b0b0f] overflow-hidden py-24 md:py-32"
    >
      {/* Background Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[10%] top-[15%] w-[40vw] h-[40vw] bg-[#c5a880]/[0.015] blur-[170px] rounded-full" />
        <div className="absolute left-[5%] bottom-[15%] w-[45vw] h-[45vw] bg-[#c5a880]/[0.01] blur-[200px] rounded-full" />
      </div>

      <ScrollAnimatedWrapper enableY={false} enableScale={false} className="w-full flex flex-col gap-12">
        
        {/* Clean Header Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-[#c5a880] uppercase font-bold">
              SELECTED WORKS // CREATIVE SHOWCASE
            </span>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.06em] text-white uppercase leading-none">
              FEATURED PROJECTS
            </h2>
            <p className="text-xs md:text-sm text-[#9999aa] leading-relaxed mt-1 font-sans">
              Explore our organized portfolio featuring 3 dedicated showcases: Live Web & SaaS Apps, Video Editing & UGC Ads, and Unreal Engine 5 Automation.
            </p>
          </div>

          {/* Action Trigger Button: VIEW ALL PROJECTS */}
          <button
            onClick={() => {
              setShowAllDrawer(true);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).lenis?.stop();
            }}
            className="group flex items-center gap-3 px-6 py-3.5 bg-[#c5a880] hover:bg-[#b0926a] text-black rounded-xl font-outfit text-xs font-bold tracking-[0.18em] transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(197,168,128,0.3)] shrink-0 cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            <span>VIEW ALL PROJECTS ({projects.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3 CATEGORIZED SHOWCASE ROWS */}
        {/* ------------------------------------------------------------- */}
        <div className="w-full flex flex-col gap-12 overflow-hidden py-6 z-10">
          
          {/* ROW 1: 🌐 WEB & SAAS PLATFORMS */}
          <div className="w-full flex flex-col gap-6">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                <span className="font-outfit text-xs md:text-sm tracking-[0.2em] text-white font-extrabold uppercase">
                  01 <span className="text-emerald-400 font-mono font-normal">/</span> WEB & SAAS PLATFORMS
                </span>
                <span className="hidden sm:inline-flex bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono text-[9px] text-emerald-300 font-bold uppercase tracking-wider">
                  INTERACTIVE LIVE DEPLOYMENTS
                </span>
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/30 via-white/10 to-transparent" />
            </div>

            <div className="w-full overflow-hidden flex items-center py-4 md:py-6">
              <div ref={row1Ref} className="flex gap-4 md:gap-6 w-max">
                {dupRow1.map((project, idx) => (
                  <MarqueeProjectCard
                    key={`r1-${project.id}-${idx}`}
                    project={project}
                    onOpenDetails={handleOpenProject}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ROW 2: 🎬 CINEMATIC & UGC MEDIA PRODUCTION */}
          <div className="w-full flex flex-col gap-6">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#c5a880] shadow-[0_0_10px_#c5a880]" />
                <span className="font-outfit text-xs md:text-sm tracking-[0.2em] text-white font-extrabold uppercase">
                  02 <span className="text-[#c5a880] font-mono font-normal">/</span> CINEMATIC & UGC MEDIA PRODUCTION
                </span>
                <span className="hidden sm:inline-flex bg-[#c5a880]/15 border border-[#c5a880]/40 px-2.5 py-0.5 rounded-full font-mono text-[9px] text-[#c5a880] font-bold uppercase tracking-wider">
                  COMMERCIAL & UGC ADS
                </span>
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#c5a880]/30 via-white/10 to-transparent" />
            </div>

            <div className="w-full overflow-hidden flex items-center py-4 md:py-6">
              <div ref={row2Ref} className="flex gap-4 md:gap-6 w-max">
                {dupRow2.map((project, idx) => (
                  <MarqueeProjectCard
                    key={`r2-${project.id}-${idx}`}
                    project={project}
                    onOpenDetails={handleOpenProject}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3: ⚡ UNREAL ENGINE & 3D AUTOMATION */}
          <div className="w-full flex flex-col gap-6">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]" />
                <span className="font-outfit text-xs md:text-sm tracking-[0.2em] text-white font-extrabold uppercase">
                  03 <span className="text-cyan-400 font-mono font-normal">/</span> UNREAL ENGINE & 3D AUTOMATION
                </span>
                <span className="hidden sm:inline-flex bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono text-[9px] text-cyan-300 font-bold uppercase tracking-wider">
                  REAL-TIME 3D AUTOMATION
                </span>
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/30 via-white/10 to-transparent" />
            </div>

            <div className="w-full overflow-hidden flex items-center py-4 md:py-6">
              <div ref={row3Ref} className="flex gap-4 md:gap-6 w-max">
                {dupRow3.map((project, idx) => (
                  <MarqueeProjectCard
                    key={`r3-${project.id}-${idx}`}
                    project={project}
                    onOpenDetails={handleOpenProject}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA to Open View All Projects Grid */}
        <div className="flex justify-center items-center z-10 pt-4">
          <button
            onClick={() => {
              setShowAllDrawer(true);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).lenis?.stop();
            }}
            className="font-mono text-xs text-[#c5a880] hover:text-white tracking-[0.2em] uppercase flex items-center gap-2.5 transition-colors duration-300 border-b border-[#c5a880]/40 hover:border-white pb-1 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>EXPLORE ALL {projects.length} PROJECTS BY CATEGORY</span>
            <span>→</span>
          </button>
        </div>

      </ScrollAnimatedWrapper>

      {/* Expanded "View All Projects" Drawer Modal */}
      <AllProjectsDrawer
        isOpen={showAllDrawer}
        onClose={() => setShowAllDrawer(false)}
        filteredProjects={filteredProjects}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onSelectProject={handleOpenProject}
      />

      {/* Fullscreen Apple macOS Safari Browser Window Sandbox Modal */}
      <SafariSandboxModal
        selectedProject={selectedProject}
        projects={projects}
        liveMode={liveMode}
        setLiveMode={setLiveMode}
        sandboxDevice={sandboxDevice}
        setSandboxDevice={setSandboxDevice}
        iframeKey={iframeKey}
        setIframeKey={setIframeKey}
        isSafariExpanded={isSafariExpanded}
        setIsSafariExpanded={setIsSafariExpanded}
        isSafariMinimized={isSafariMinimized}
        setIsSafariMinimized={setIsSafariMinimized}
        onClose={() => setSelectedProject(null)}
        onSelectProject={handleOpenProject}
        showAllDrawer={showAllDrawer}
      />
    </section>
  );
});

export default WorksSection;
