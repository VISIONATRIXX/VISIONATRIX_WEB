"use client";

import { useState, useEffect, useRef, memo } from "react";
import { ArrowRight, Layers, Sparkles } from "lucide-react";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAdmin, Project } from "@/context/AdminContext";
import MarqueeProjectCard from "./works/MarqueeProjectCard";
import AllProjectsDrawer from "./works/AllProjectsDrawer";
import SafariSandboxModal from "./works/SafariSandboxModal";

// Row configuration with unique visual identity
const ROW_CONFIG = [
  {
    num: "01",
    title: "WEB & SAAS PLATFORMS",
    subtitle: "INTERACTIVE LIVE DEPLOYMENTS",
    accent: "#34d399", // emerald
    accentBg: "rgba(52,211,153,0.06)",
    accentBorder: "rgba(52,211,153,0.2)",
    keywords: ["WEB", "SAAS", "POS", "APP", "DEV", "FULLSTACK"],
  },
  {
    num: "02",
    title: "CINEMATIC & UGC PRODUCTION",
    subtitle: "COMMERCIAL & UGC ADS",
    accent: "#c5a880", // gold
    accentBg: "rgba(197,168,128,0.06)",
    accentBorder: "rgba(197,168,128,0.2)",
    keywords: ["VIDEO", "FILM", "UGC", "REEL", "COMMERCIAL", "MEDIA", "STUDIO", "AD"],
  },
  {
    num: "03",
    title: "UNREAL ENGINE & 3D",
    subtitle: "REAL-TIME 3D AUTOMATION",
    accent: "#22d3ee", // cyan
    accentBg: "rgba(34,211,238,0.06)",
    accentBorder: "rgba(34,211,238,0.2)",
    keywords: ["UNREAL", "CGI", "3D", "VFX", "AUTOMATION", "SPATIAL", "VR", "CONFIGURATOR"],
  },
];

const WorksSection = memo(function WorksSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllDrawer, setShowAllDrawer] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [liveMode, setLiveMode] = useState(false);
  const [sandboxDevice, setSandboxDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [isSafariExpanded, setIsSafariExpanded] = useState(false);
  const [isSafariMinimized, setIsSafariMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { projects } = useAdmin();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;

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
          handleOpenProject(projects[(currentIndex + 1) % projects.length]);
        } else if (e.key === "ArrowLeft") {
          handleOpenProject(projects[(currentIndex - 1 + projects.length) % projects.length]);
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
  const rowRefs = [row1Ref, row2Ref, row3Ref];

  // Exclusive project-to-row assignment
  const matchesRow = (p: Project, keywords: string[]) => {
    const cats = (p.categories || []).map(c => c.toUpperCase());
    const mainCat = p.category.toUpperCase();
    return cats.some(c => keywords.some(k => c.includes(k))) || keywords.some(k => mainCat.includes(k));
  };

  const assigned = new Set<string>();
  const rowProjects: Project[][] = [[], [], []];

  // Priority: Row1 → Row2 → Row3
  for (const p of projects) {
    if (Boolean(p.details?.liveUrl) || matchesRow(p, ROW_CONFIG[0].keywords)) {
      rowProjects[0].push(p);
      assigned.add(p.id);
    }
  }
  for (const p of projects) {
    if (!assigned.has(p.id) && matchesRow(p, ROW_CONFIG[1].keywords)) {
      rowProjects[1].push(p);
      assigned.add(p.id);
    }
  }
  for (const p of projects) {
    if (!assigned.has(p.id) && matchesRow(p, ROW_CONFIG[2].keywords)) {
      rowProjects[2].push(p);
      assigned.add(p.id);
    }
  }

  // Distribute unassigned
  const unassigned = projects.filter(p => !assigned.has(p.id));
  unassigned.forEach((p, i) => rowProjects[i % 3].push(p));

  // Smart duplication for seamless marquee
  const smartDuplicate = (list: Project[]) => {
    if (list.length === 0) return [];
    const minCards = isMobile ? 6 : 10;
    const repeats = Math.max(2, Math.ceil(minCards / list.length));
    const result: Project[] = [];
    for (let i = 0; i < repeats; i++) result.push(...list);
    return result;
  };

  const dupRows = rowProjects.map(smartDuplicate);

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

  // Desktop GSAP marquee
  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    let isVisible = false;
    let targetVelocity = 0;
    let currentVelocity = 0;
    let x1 = 0, x2 = -1200, x3 = 0;

    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { rootMargin: "200px" }
    );
    io.observe(section);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => { 
        // Clamp velocity to prevent extreme frame-drop spikes on fast scroll
        const rawVel = self.getVelocity() * 0.012;
        targetVelocity = Math.max(-8, Math.min(8, rawVel));
      }
    });

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
  }, [projects.length, isMobile]);

  return (
    <section 
      ref={sectionRef}
      id="works" 
      className="relative w-full bg-[#07070a] overflow-hidden py-28 md:py-40"
    >
      {/* === BACKGROUND ATMOSPHERE === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[-5%] top-[10%] w-[50vw] h-[50vw] bg-[#c5a880]/[0.012] blur-[200px] rounded-full" />
        <div className="absolute left-[-10%] bottom-[5%] w-[60vw] h-[60vw] bg-[#c5a880]/[0.008] blur-[250px] rounded-full" />
      </div>

      <ScrollAnimatedWrapper enableY={false} enableScale={false} enableOpacity={false} className="w-full flex flex-col gap-16 md:gap-20">
        
        {/* === SECTION HEADER === */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col gap-5 max-w-2xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#c5a880] shadow-[0_0_8px_rgba(197,168,128,0.5)]" />
                <div className="w-12 h-[1px] bg-gradient-to-r from-[#c5a880] to-transparent" />
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.35em] text-[#c5a880] uppercase font-bold">
                  SELECTED WORKS
                </span>
              </div>
              
              {/* Title */}
              <h2 className="font-display text-3xl md:text-5xl lg:text-[3.5rem] font-bold tracking-[0.04em] text-white uppercase leading-[1.05]">
                FEATURED
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a880] via-[#e2cbb0] to-[#c5a880]">
                  PROJECTS
                </span>
              </h2>

              {/* Description */}
              <p className="text-[13px] md:text-sm text-white/40 leading-relaxed font-sans max-w-lg">
                Curated portfolio across three creative disciplines — each piece crafted to push the boundaries of digital experience design.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setShowAllDrawer(true);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).lenis?.stop();
              }}
              className="group flex items-center gap-3 px-7 py-4 bg-gradient-to-r from-[#c5a880] to-[#b09470] hover:from-[#d4b890] hover:to-[#c5a880] text-black rounded-2xl font-outfit text-xs font-bold tracking-[0.18em] transition-all duration-500 shadow-[0_4px_20px_rgba(197,168,128,0.25)] hover:shadow-[0_8px_32px_rgba(197,168,128,0.4)] shrink-0 cursor-pointer uppercase"
            >
              <Sparkles className="w-4 h-4" />
              <span>VIEW ALL {projects.length} PROJECTS</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Divider line */}
          <div className="mt-10 h-[1px] bg-gradient-to-r from-[#c5a880]/30 via-white/5 to-transparent" />
        </div>

        {/* === 3 SHOWCASE ROWS === */}
        <div className="w-full flex flex-col gap-14 md:gap-16 overflow-hidden z-10">
          {ROW_CONFIG.map((row, rowIdx) => (
            <div key={row.num} className="w-full flex flex-col gap-5">
              {/* Row Header */}
              <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full flex items-center gap-4">
                <div className="flex items-center gap-3.5 shrink-0">
                  {/* Number */}
                  <span 
                    className="font-mono text-[11px] font-bold tracking-[0.2em]"
                    style={{ color: row.accent }}
                  >
                    {row.num}
                  </span>
                  
                  {/* Accent dot */}
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: row.accent, boxShadow: `0 0 6px ${row.accent}` }}
                  />
                  
                  {/* Title */}
                  <span className="font-outfit text-[11px] md:text-[13px] tracking-[0.18em] text-white/90 font-bold uppercase">
                    {row.title}
                  </span>

                  {/* Badge */}
                  <span 
                    className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full font-mono text-[8px] font-bold uppercase tracking-[0.15em]"
                    style={{ 
                      backgroundColor: row.accentBg, 
                      borderWidth: 1, 
                      borderColor: row.accentBorder, 
                      color: row.accent 
                    }}
                  >
                    {row.subtitle}
                  </span>
                </div>

                {/* Separator line */}
                <div 
                  className="flex-1 h-[1px]"
                  style={{ background: `linear-gradient(to right, ${row.accentBorder}, rgba(255,255,255,0.03), transparent)` }}
                />

                {/* Count */}
                <span className="font-mono text-[10px] text-white/25 tracking-wider shrink-0">
                  {rowProjects[rowIdx].length} {rowProjects[rowIdx].length === 1 ? "PROJECT" : "PROJECTS"}
                </span>
              </div>

              {/* Cards Row */}
              <div className={`w-full py-3 md:py-5 ${isMobile ? "overflow-x-auto snap-x no-scrollbar px-6" : "overflow-hidden flex items-center"}`}>
                <div ref={rowRefs[rowIdx]} className="flex gap-5 md:gap-7 w-max transform-gpu will-change-transform">
                  {dupRows[rowIdx].map((project, idx) => (
                    <div key={`r${rowIdx}-${project.id}-${idx}`} className={isMobile ? "snap-center" : ""}>
                      <MarqueeProjectCard
                        project={project}
                        onOpenDetails={handleOpenProject}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === BOTTOM CTA === */}
        <div className="flex justify-center items-center z-10 pt-2">
          <button
            onClick={() => {
              setShowAllDrawer(true);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).lenis?.stop();
            }}
            className="group font-mono text-[10px] text-white/40 hover:text-[#c5a880] tracking-[0.25em] uppercase flex items-center gap-3 transition-all duration-500 cursor-pointer py-3 px-6 rounded-full border border-white/5 hover:border-[#c5a880]/30 hover:bg-[#c5a880]/5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>EXPLORE FULL ARCHIVE — {projects.length} PROJECTS</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </ScrollAnimatedWrapper>

      <AllProjectsDrawer
        isOpen={showAllDrawer}
        onClose={() => setShowAllDrawer(false)}
        filteredProjects={filteredProjects}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onSelectProject={handleOpenProject}
      />

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
