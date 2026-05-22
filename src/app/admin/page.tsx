"use client";

import { useState, useEffect, useRef } from "react";
import { useAdmin, Project, ServiceItem, Testimonial, Proposal } from "@/context/AdminContext";
import { 
  Fingerprint, 
  Lock, 
  Unlock, 
  Terminal, 
  Cpu, 
  Layers, 
  Briefcase, 
  MessageSquare, 
  Activity, 
  FileText, 
  Check, 
  Trash, 
  Plus, 
  Edit, 
  X, 
  ExternalLink, 
  RefreshCw, 
  LogOut, 
  Database,
  ArrowRight,
  TrendingUp,
  Sliders,
  Sparkles,
  ShieldCheck,
  Search,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------
// SCI-FI SOUND & GLITCH FX HELPERS (Visual Clues)
// ---------------------------------------------------------------------
interface LogMessage {
  id: string;
  text: string;
  type: "info" | "success" | "warning" | "error";
  time: string;
}

export default function AdminPage() {
  const { 
    projects, 
    services, 
    testimonials, 
    proposals,
    addProject,
    updateProject,
    deleteProject,
    updateService,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateProposalStatus,
    deleteProposal
  } = useAdmin();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanningComplete, setScanningComplete] = useState(false);

  // Active Dashboard Section
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "services" | "testimonials" | "crm">("overview");

  // CLI / Terminal Console State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "VISIONATRIX OS v1.0.8 [SECURE KERNEL LOADED]",
    "CRITICAL PROTOCOLS LOCK: ACTIVE",
    "Enter command or type 'help' for directory operations.",
    ""
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // General Status Logs for the HUD log sidebar
  const [hudLogs, setHudLogs] = useState<LogMessage[]>([
    { id: "1", text: "Secure CLI Interface loaded.", type: "info", time: "21:15:12" },
    { id: "2", text: "Database connection initialized in client state cache.", type: "success", time: "21:15:13" },
    { id: "3", text: "Decryption keys parsed successfully.", type: "success", time: "21:15:14" }
  ]);

  // CRUD MODALS & EDITORS
  const [projectModal, setProjectModal] = useState<{ isOpen: boolean; mode: "add" | "edit"; data?: Project }>({ isOpen: false, mode: "add" });
  const [testimonialModal, setTestimonialModal] = useState<{ isOpen: boolean; mode: "add" | "edit"; data?: Testimonial }>({ isOpen: false, mode: "add" });
  const [serviceEditor, setServiceEditor] = useState<ServiceItem | null>(null);

  // Budget option list
  const budgetTiers = ["$5K - $15K", "$15K - $40K", "$40K - $100K", "$100K+"];

  // ---------------------------------------------------------------------
  // LOGGERS
  // ---------------------------------------------------------------------
  const addHudLog = (text: string, type: LogMessage["type"] = "info") => {
    const time = new Date().toTimeString().split(" ")[0];
    const newLog: LogMessage = { id: Date.now().toString(), text, type, time };
    setHudLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  // Scroll Terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Ticking time for security HUD headers
  const [systemTime, setSystemTime] = useState("");
  useEffect(() => {
    const tick = () => {
      setSystemTime(new Date().toTimeString().split(" ")[0]);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------------------
  // HANDLERS: AUTHENTICATION
  // ---------------------------------------------------------------------
  const handleKeypadPress = (val: string) => {
    setAuthError("");
    if (val === "CLEAR") {
      setPasscode("");
    } else if (val === "ENTER") {
      submitPasscode(passcode);
    } else {
      if (passcode.length < 12) {
        setPasscode(prev => prev + val);
      }
    }
  };

  const submitPasscode = (code: string) => {
    if (code === "141104") {
      addHudLog("Passcode verify successful. Triggering biometric staging.", "success");
      triggerBiometricScan();
    } else {
      setAuthError("// ACCESS DENIED: KEY DECRYPTION FAILED");
      setPasscode("");
      addHudLog("Failed keypad authorization attempt. Threat index incremented.", "error");
    }
  };

  const triggerBiometricScan = () => {
    setBiometricScanning(true);
    setScanProgress(0);
    setScanningComplete(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setScanningComplete(true);
        setTimeout(() => {
          setIsAuthenticated(true);
          setBiometricScanning(false);
          addHudLog("Full bio-metric handshake confirmed. Access granted.", "success");
        }, 1200);
      }
      setScanProgress(progress);
    }, 100);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode("");
    setScanningComplete(false);
    setScanProgress(0);
    addHudLog("User logged out. Credentials purged.", "warning");
  };

  // ---------------------------------------------------------------------
  // HANDLERS: CLI SHELL OPERATIONAL ENGINE
  // ---------------------------------------------------------------------
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = terminalInput.trim().toLowerCase();
    if (!input) return;

    const newLogs = [...terminalLogs, `visionatrix@core:~$ ${terminalInput}`];
    setTerminalInput("");

    const parts = input.split(" ");
    const cmd = parts[0];
    const arg = parts.slice(1).join(" ");

    switch (cmd) {
      case "help":
        newLogs.push(
          "Available System Commands:",
          "  help                  Displays command registry",
          "  list works            Renders structural details of projects",
          "  list crm              Logs active inbox project proposals",
          "  status                Polls system core load coordinates",
          "  stats                 Queries conversion statistics metrics",
          "  logs                  Displays low-level cache runtime logs",
          "  clear                 Flushes the terminal history console"
        );
        break;
      case "clear":
        setTerminalLogs([]);
        return;
      case "status":
        newLogs.push(
          `OS STATUS: STABLE`,
          `SECURE PROTOCOL: AES-256`,
          `CLIENT LAYER SEED: Hydrated from localStorage`,
          `SYSTEM TIME: ${systemTime}`,
          `MEMORY LOAD: (Virtual Cache) ${Math.floor(Math.random() * 25) + 12}MB`,
          `FPS TARGET RENDER: 120 FPS Locked`
        );
        addHudLog("Polled system metrics from terminal command.", "info");
        break;
      case "stats":
        const approvedCount = proposals.filter(p => p.status === "Approved").length;
        const totalProposals = proposals.length;
        const rate = totalProposals > 0 ? ((approvedCount / totalProposals) * 100).toFixed(1) : "0.0";
        newLogs.push(
          "--- METRICS DIRECTORY ---",
          `  Total Projects:   ${projects.length}`,
          `  Total Capabilities: ${services.length}`,
          `  Total Inquiries:  ${totalProposals}`,
          `  Approved Deals:   ${approvedCount}`,
          `  Conversion Rate:  ${rate}%`
        );
        addHudLog("Fetched conversion statistics from terminal.", "info");
        break;
      case "list":
        if (arg === "works") {
          newLogs.push("--- PROJECT LEDGER INDEX ---");
          projects.forEach(p => {
            newLogs.push(`  ID: ${p.id} | TITLE: ${p.title} | ENGINE: ${p.details.engine}`);
          });
        } else if (arg === "crm") {
          newLogs.push("--- LEAD LEDGER INDEX ---");
          proposals.forEach(p => {
            newLogs.push(`  STATUS: [${p.status}] | CLIENT: ${p.fullName} | SERVICE: ${p.service}`);
          });
        } else {
          newLogs.push("Error: 'list' requires targets: 'works' or 'crm'.");
        }
        break;
      case "logs":
        newLogs.push("--- SYSTEM KERNEL DUMP ---");
        hudLogs.forEach(l => {
          newLogs.push(`  [${l.time}] [${l.type.toUpperCase()}] ${l.text}`);
        });
        break;
      default:
        newLogs.push(`Command not recognized: '${cmd}'. Type 'help' for options.`);
    }

    newLogs.push("");
    setTerminalLogs(newLogs);
  };

  // ---------------------------------------------------------------------
  // PROJECT CRUD MODAL HANDLING
  // ---------------------------------------------------------------------
  const [projForm, setProjForm] = useState<Partial<Project>>({
    title: "",
    category: "",
    categories: [],
    tagline: "",
    description: "",
    image: "/work_aura_configurator.png",
    subtitle: "",
    year: "2026",
    bgGradient: "from-slate-900 via-sky-950 to-[#050507]",
    details: {
      client: "",
      timeline: "",
      role: "",
      engine: ""
    },
    metrics: [
      { label: "", value: "" },
      { label: "", value: "" },
      { label: "", value: "" }
    ]
  });

  const openProjectModal = (mode: "add" | "edit", data?: Project) => {
    if (mode === "edit" && data) {
      setProjForm({ ...data });
    } else {
      setProjForm({
        title: "",
        category: "",
        categories: ["CGI"],
        tagline: "",
        description: "",
        image: "/work_aura_configurator.png",
        subtitle: "",
        year: "2026",
        bgGradient: "from-slate-900 via-sky-950 to-[#050507]",
        details: {
          client: "",
          timeline: "",
          role: "",
          engine: ""
        },
        metrics: [
          { label: "RESOLUTION", value: "8K Projections" },
          { label: "RENDER TIME", value: "1,200 Node Hours" },
          { label: "POLY COUNT", value: "15 Million" }
        ]
      });
    }
    setProjectModal({ isOpen: true, mode, data });
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.title || !projForm.category) {
      alert("Required: Project Title & Category fields");
      return;
    }

    const payload: Omit<Project, "id"> = {
      title: projForm.title,
      category: projForm.category,
      categories: projForm.categories || ["CGI"],
      tagline: projForm.tagline || "",
      description: projForm.description || "",
      image: projForm.image || "/work_aura_configurator.png",
      subtitle: projForm.subtitle || `${projForm.title} Spec`,
      year: projForm.year || "2026",
      bgGradient: projForm.bgGradient || "from-slate-900 via-sky-950 to-[#050507]",
      details: {
        client: projForm.details?.client || "Spec Concept",
        timeline: projForm.details?.timeline || "Q1 2026",
        role: projForm.details?.role || "Digital Artist",
        engine: projForm.details?.engine || "Octane Render / GLSL"
      },
      metrics: projForm.metrics || []
    };

    if (projectModal.mode === "edit" && projectModal.data) {
      updateProject(projectModal.data.id, { ...payload, id: projectModal.data.id });
      addHudLog(`Project updated: ${payload.title}`, "success");
    } else {
      addProject(payload);
      addHudLog(`Project added: ${payload.title}`, "success");
    }
    setProjectModal({ isOpen: false, mode: "add" });
  };

  // ---------------------------------------------------------------------
  // TESTIMONIAL CRUD MODAL HANDLING
  // ---------------------------------------------------------------------
  const [testiForm, setTestiForm] = useState<Partial<Testimonial>>({
    quote: "",
    author: "",
    role: "",
    company: "",
    rating: 5,
    isActive: true
  });

  const openTestimonialModal = (mode: "add" | "edit", data?: Testimonial) => {
    if (mode === "edit" && data) {
      setTestiForm({ ...data });
    } else {
      setTestiForm({
        quote: "",
        author: "",
        role: "",
        company: "",
        rating: 5,
        isActive: true
      });
    }
    setTestimonialModal({ isOpen: true, mode, data });
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testiForm.quote || !testiForm.author) {
      alert("Required: Quote text & Author signature fields.");
      return;
    }

    const payload: Omit<Testimonial, "id"> = {
      quote: testiForm.quote,
      author: testiForm.author,
      role: testiForm.role || "Executive",
      company: testiForm.company || "Global Inc",
      rating: testiForm.rating || 5,
      isActive: testiForm.isActive !== undefined ? testiForm.isActive : true
    };

    if (testimonialModal.mode === "edit" && testimonialModal.data) {
      updateTestimonial(testimonialModal.data.id, { ...payload, id: testimonialModal.data.id });
      addHudLog(`Review updated: ${payload.author}`, "success");
    } else {
      addTestimonial(payload);
      addHudLog(`Review registered: ${payload.author}`, "success");
    }
    setTestimonialModal({ isOpen: false, mode: "add" });
  };

  // ---------------------------------------------------------------------
  // COMPONENT RENDER: GATE OR HOVER PANEL
  // ---------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#070709] flex flex-col items-center justify-center font-mono relative overflow-hidden px-4 select-none">
        {/* Neon Backdrop grids */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.06),transparent_70%)] pointer-events-none z-0" />
        
        {/* Subtle horizontal scan lines */}
        <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-20 z-10" />

        <div className="w-full max-w-md z-20 flex flex-col gap-6">
          {/* Hologram Section Header */}
          <div className="flex flex-col items-center text-center gap-2 border-b border-[#c5a880]/15 pb-5">
            <div className="w-14 h-14 rounded-full border border-[#c5a880]/30 bg-[#c5a880]/5 flex items-center justify-center relative mb-1 shadow-[0_0_15px_rgba(197,168,128,0.1)]">
              {biometricScanning ? (
                <Fingerprint className="w-7 h-7 text-[#c5a880] animate-pulse" />
              ) : (
                <Lock className="w-6 h-6 text-[#c5a880] animate-pulse" />
              )}
              {/* Outer scanning rings */}
              <div className="absolute -inset-1 border border-dashed border-[#c5a880]/15 rounded-full animate-spin-slow" />
            </div>

            <h1 className="font-display text-lg tracking-[0.3em] text-white uppercase">
              VISIONATRIX OS
            </h1>
            <span className="text-[9px] tracking-widest text-[#c5a880] uppercase">
              [ DIRECTORY KERNEL GATEWAY ]
            </span>
          </div>

          {/* Keypad entry screen / Biometric scan track */}
          <div className="bg-[#0f0f14]/85 border border-[#c5a880]/15 rounded-sm p-6 flex flex-col gap-6 relative shadow-[0_0_40px_rgba(0,0,0,0.85)]">
            
            {/* Corner brackets decors */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#c5a880]/40" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#c5a880]/40" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#c5a880]/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#c5a880]/40" />

            <AnimatePresence mode="wait">
              {biometricScanning ? (
                <motion.div 
                  key="bio"
                  className="flex flex-col items-center justify-center py-6 gap-6 relative overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-24 h-24 border border-[#c5a880]/30 bg-[#c5a880]/5 rounded-sm flex items-center justify-center relative cursor-wait">
                    {/* Glowing Scan lines sweeping */}
                    <div 
                      className="absolute left-0 w-full h-[2px] bg-[#c5a880] shadow-[0_0_8px_#c5a880] pointer-events-none"
                      style={{
                        top: `${(Math.sin(scanProgress * 0.1) * 50) + 50}%`,
                        transition: "top 0.1s linear"
                      }}
                    />
                    <Fingerprint className="w-14 h-14 text-[#c5a880] drop-shadow-[0_0_10px_#c5a880]" />
                  </div>

                  <div className="w-full flex flex-col items-center gap-1.5 font-mono">
                    <span className="text-[10px] text-[#c5a880] tracking-widest uppercase">
                      {scanningComplete ? "HANDSHAKE READY" : "SCANNING VOLUMETRIC GRID..."}
                    </span>
                    <div className="w-full bg-white/5 border border-white/10 h-2 p-0.5 rounded-sm overflow-hidden">
                      <div 
                        className="bg-[#c5a880] h-full shadow-[0_0_6px_#c5a880] transition-all duration-100 ease-out"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <span className="text-[8.5px] text-white/40 tracking-wider">
                      DECIPHERING: {scanProgress}% STATUS: STAGED
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="keypad"
                  className="flex flex-col gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Pin field display */}
                  <div className="flex flex-col gap-1 text-center font-mono">
                    <span className="text-[7.5px] tracking-[0.2em] text-white/30 uppercase">
                      ENTER DECRYPTION PASSCODE
                    </span>
                    <div className="bg-[#08080b] border border-white/5 py-3.5 px-3 rounded-sm flex items-center justify-center h-12 text-[#c5a880] text-sm tracking-[0.4em] font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative">
                      {passcode ? passcode.replace(/./g, "*") : <span className="text-white/15 tracking-normal text-xs font-normal">[ STANDBY_CODE ]</span>}
                    </div>
                    {authError && (
                      <span className="text-[8px] text-red-500 font-bold mt-1 tracking-wider animate-pulse">
                        {authError}
                      </span>
                    )}
                  </div>

                  {/* Operational Keypad grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <button
                        key={num}
                        onClick={() => handleKeypadPress(num.toString())}
                        className="py-3 bg-white/[0.02] border border-white/5 hover:bg-[#c5a880]/10 hover:border-[#c5a880]/30 transition-all text-white/80 active:scale-95 rounded-sm font-semibold cursor-pointer text-xs"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => handleKeypadPress("CLEAR")}
                      className="py-3 bg-red-950/20 border border-red-900/10 hover:bg-red-950/40 hover:border-red-900/30 transition-all text-red-400 font-semibold active:scale-95 rounded-sm cursor-pointer text-[9px] tracking-wider"
                    >
                      CLEAR
                    </button>
                    <button
                      onClick={() => handleKeypadPress("0")}
                      className="py-3 bg-white/[0.02] border border-white/5 hover:bg-[#c5a880]/10 hover:border-[#c5a880]/30 transition-all text-white/80 active:scale-95 rounded-sm font-semibold cursor-pointer text-xs"
                    >
                      0
                    </button>
                    <button
                      onClick={() => handleKeypadPress("ENTER")}
                      className="py-3 bg-[#c5a880]/10 border border-[#c5a880]/30 hover:bg-[#c5a880]/20 hover:border-[#c5a880]/50 transition-all text-[#c5a880] font-bold active:scale-95 rounded-sm cursor-pointer text-[9px] tracking-wider"
                    >
                      ENTER
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hint footer */}
          <div className="text-center font-mono text-[8px] text-white/20 tracking-wider flex justify-center items-center gap-1.5 mt-2">
            <span>[ SYSTEM ADVICE: CODE IS 141104 ]</span>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------
  // AUTHENTICATED HUD VIEW
  // ---------------------------------------------------------------------
  return (
    <main className="min-h-screen bg-[#07070a] text-white/90 font-mono relative select-none flex flex-col justify-between">
      {/* Decorative Scanlines */}
      <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-[0.12] z-40" />

      {/* ---------------------------------------------------------------------
          HUD CONTAINER HEADER
          --------------------------------------------------------------------- */}
      <header className="border-b border-[#c5a880]/15 bg-[#0b0b0f] px-6 py-4 flex items-center justify-between z-30 shrink-0 select-none relative">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-sm border border-[#c5a880]/35 bg-[#c5a880]/5 flex items-center justify-center shadow-[0_0_10px_rgba(197,168,128,0.15)] animate-pulse">
            <Cpu className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-sm tracking-[0.18em] font-semibold text-white uppercase">
                VISIONATRIX ADMIN CONTROL
              </h1>
              <span className="text-[7.5px] border border-[#c5a880]/30 px-1 py-0.5 rounded-sm text-[#c5a880]/85 bg-[#c5a880]/5 hidden sm:inline animate-pulse">
                v1.0.8 CORE
              </span>
            </div>
            <p className="text-[8px] tracking-widest text-white/40 uppercase mt-0.5">
              Secure Cloud state layer directory console
            </p>
          </div>
        </div>

        {/* Central status widgets */}
        <div className="hidden lg:flex items-center gap-6 border-l border-white/5 pl-6 font-mono text-[8px] text-white/50 tracking-wider">
          <div className="flex flex-col gap-0.5">
            <span className="text-white/30">CACHE_PERSIST:</span>
            <span className="text-[#c5a880] flex items-center gap-1">
              <Database className="w-2.5 h-2.5 text-[#c5a880]" /> LOCAL_STORAGE
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-white/30">SECTOR_LATENCY:</span>
            <span className="text-[#10b981] font-bold">LOCKED_60FPS</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-white/30">TIME_LOCK:</span>
            <span className="text-white font-medium">{systemTime} IST</span>
          </div>
        </div>

        {/* Action Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-red-400 hover:text-white border border-red-500/10 hover:border-red-500/30 px-3.5 py-1.5 rounded-sm transition-all hover:bg-red-950/20 active:scale-95 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">PURGE GATE</span>
        </button>
      </header>

      {/* ---------------------------------------------------------------------
          HUD CENTRAL MATRIX BODY (Sidebar and Main Area)
          --------------------------------------------------------------------- */}
      <div className="flex-1 w-full grid grid-cols-12 items-stretch overflow-hidden relative min-h-0">
        
        {/* LEFT TAB NAVIGATION PANEL (2 cols) */}
        <aside className="col-span-12 md:col-span-2 border-r border-[#c5a880]/10 bg-[#09090d] flex flex-col p-4 shrink-0 font-mono text-[9px] gap-2.5 z-20">
          <span className="font-bold text-[#c5a880]/50 tracking-[0.2em] mb-1.5 uppercase pl-2 text-[7.5px]">
            DIRECTORY OPERATIONS
          </span>

          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left py-3 px-3 border transition-all duration-300 rounded-sm flex items-center gap-3.5 cursor-pointer relative ${
              activeTab === "overview" 
                ? "bg-[#c5a880]/10 border-[#c5a880]/40 text-[#c5a880] font-bold shadow-[inset_0_0_8px_rgba(197,168,128,0.08)]" 
                : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            {activeTab === "overview" && <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#c5a880]" />}
            <Activity className="w-4 h-4 shrink-0" />
            <span className="tracking-[0.12em] uppercase">HUD OVERVIEW</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full text-left py-3 px-3 border transition-all duration-300 rounded-sm flex items-center gap-3.5 cursor-pointer relative ${
              activeTab === "projects" 
                ? "bg-[#c5a880]/10 border-[#c5a880]/40 text-[#c5a880] font-bold shadow-[inset_0_0_8px_rgba(197,168,128,0.08)]" 
                : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            {activeTab === "projects" && <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#c5a880]" />}
            <Briefcase className="w-4 h-4 shrink-0" />
            <span className="tracking-[0.12em] uppercase">PORTFOLIO CMS</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`w-full text-left py-3 px-3 border transition-all duration-300 rounded-sm flex items-center gap-3.5 cursor-pointer relative ${
              activeTab === "services" 
                ? "bg-[#c5a880]/10 border-[#c5a880]/40 text-[#c5a880] font-bold shadow-[inset_0_0_8px_rgba(197,168,128,0.08)]" 
                : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            {activeTab === "services" && <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#c5a880]" />}
            <Sliders className="w-4 h-4 shrink-0" />
            <span className="tracking-[0.12em] uppercase">CAPABILITIES</span>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`w-full text-left py-3 px-3 border transition-all duration-300 rounded-sm flex items-center gap-3.5 cursor-pointer relative ${
              activeTab === "testimonials" 
                ? "bg-[#c5a880]/10 border-[#c5a880]/40 text-[#c5a880] font-bold shadow-[inset_0_0_8px_rgba(197,168,128,0.08)]" 
                : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            {activeTab === "testimonials" && <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#c5a880]" />}
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="tracking-[0.12em] uppercase">FEEDBACK CMS</span>
          </button>

          <button
            onClick={() => setActiveTab("crm")}
            className={`w-full text-left py-3 px-3 border transition-all duration-300 rounded-sm flex items-center gap-3.5 cursor-pointer relative ${
              activeTab === "crm" 
                ? "bg-[#c5a880]/10 border-[#c5a880]/40 text-[#c5a880] font-bold shadow-[inset_0_0_8px_rgba(197,168,128,0.08)]" 
                : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            {activeTab === "crm" && <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#c5a880]" />}
            <FileText className="w-4 h-4 shrink-0" />
            <span className="tracking-[0.12em] uppercase">INBOX CRM</span>
            {proposals.filter(p => p.status === "Pending").length > 0 && (
              <span className="bg-[#c5a880] text-black text-[7.5px] px-1 py-0.5 rounded-full font-bold ml-auto animate-pulse">
                {proposals.filter(p => p.status === "Pending").length}
              </span>
            )}
          </button>
        </aside>

        {/* MAIN PANEL CONTENT WINDOW (7 cols) */}
        <section className="col-span-12 md:col-span-7 border-r border-[#c5a880]/10 p-6 overflow-y-auto z-10 min-h-0 flex flex-col justify-start relative scrollbar-thin">
          <AnimatePresence mode="wait">
            {/* OVERVIEW HUD VIEW */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-8 w-full"
              >
                {/* Visual Header */}
                <div className="flex flex-col gap-1 border-b border-[#c5a880]/15 pb-4">
                  <span className="text-[#c5a880] text-[9px] tracking-[0.2em] font-semibold uppercase">SYSTEM STAGES STATUS //</span>
                  <h2 className="font-display text-xl font-bold text-white tracking-widest uppercase">HUD INSTRUMENTS DECK</h2>
                </div>

                {/* Cyber Dashboard Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-white/5 bg-[#101015]/80 p-5 rounded-sm flex flex-col justify-between h-32 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-[#c5a880]/10 transition-colors">
                      <Briefcase className="w-12 h-12" />
                    </div>
                    <span className="text-[#c5a880] text-[8px] tracking-wider uppercase font-mono">PORTFOLIO PROJECTS</span>
                    <span className="font-display text-4xl font-extrabold text-white tracking-wide mt-1">
                      {projects.length.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[7.5px] text-white/35 font-mono">// TOTAL WORKS INDEXED</span>
                  </div>

                  <div className="border border-white/5 bg-[#101015]/80 p-5 rounded-sm flex flex-col justify-between h-32 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-[#c5a880]/10 transition-colors">
                      <FileText className="w-12 h-12" />
                    </div>
                    <span className="text-[#c5a880] text-[8px] tracking-wider uppercase font-mono">PROPOSALS INBOX</span>
                    <span className="font-display text-4xl font-extrabold text-white tracking-wide mt-1">
                      {proposals.length.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[7.5px] text-white/35 font-mono">
                      // {proposals.filter(p => p.status === "Pending").length} PENDING INBOX
                    </span>
                  </div>

                  <div className="border border-[#c5a880]/15 bg-[#101015]/80 p-5 rounded-sm flex flex-col justify-between h-32 relative group overflow-hidden shadow-[0_0_15px_rgba(197,168,128,0.03)]">
                    <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-[#c5a880]/10 transition-colors">
                      <TrendingUp className="w-12 h-12 text-[#c5a880]" />
                    </div>
                    <span className="text-[#c5a880] text-[8px] tracking-wider uppercase font-mono">CONVERSION RATIO</span>
                    <span className="font-display text-4xl font-extrabold text-[#c5a880] tracking-wide mt-1">
                      {proposals.length > 0 
                        ? `${((proposals.filter(p => p.status === "Approved").length / proposals.length) * 100).toFixed(0)}%`
                        : "0%"
                      }
                    </span>
                    <span className="text-[7.5px] text-[#10b981] font-mono uppercase tracking-wider">// SYSTEM OPTIMIZED</span>
                  </div>
                </div>

                {/* Cyber interactive Terminal shell panel */}
                <div className="border border-white/5 bg-[#09090e] rounded-sm flex flex-col relative overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)] mt-2">
                  {/* Top bar header decor */}
                  <div className="bg-[#121217] px-4 py-2 flex items-center justify-between border-b border-white/5 select-none font-mono text-[8px] tracking-wider">
                    <div className="flex items-center gap-2 text-white/40">
                      <Terminal className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>TERMINAL CONSOLE SH // ACTIVE SESSION</span>
                    </div>
                    <span className="text-[#c5a880]/60">[ SSL: ON ]</span>
                  </div>

                  {/* Log console logs container */}
                  <div className="p-4 h-64 overflow-y-auto flex flex-col font-mono text-[10.5px] text-[#c5a880]/90 gap-1.5 scrollbar-thin select-text">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                        {log}
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>

                  {/* CLI inputs form bar */}
                  <form onSubmit={handleTerminalSubmit} className="flex border-t border-white/5">
                    <span className="py-2.5 pl-4 text-white/35 font-mono text-xs select-none">
                      visionatrix@core:~$
                    </span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Type 'help' for operational commands ledger..."
                      className="flex-1 bg-transparent py-2.5 px-3 focus:outline-none text-[#c5a880] font-mono text-xs border-none"
                    />
                  </form>
                </div>
              </motion.div>
            )}

            {/* PORTFOLIO WORKS CRUD INDEX */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex items-center justify-between border-b border-[#c5a880]/15 pb-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#c5a880] text-[9px] tracking-[0.2em] font-semibold uppercase">PORTFOLIO INDEX LEDGER //</span>
                    <h2 className="font-display text-xl font-bold text-white tracking-widest uppercase">WORKS MANAGEMENT</h2>
                  </div>
                  <button
                    onClick={() => openProjectModal("add")}
                    className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-[#c5a880] hover:text-white border border-[#c5a880]/30 hover:border-[#c5a880] px-3.5 py-1.5 rounded-sm bg-[#c5a880]/5 hover:bg-[#c5a880]/10 transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD PROJECT</span>
                  </button>
                </div>

                {/* Projects lists grid */}
                <div className="flex flex-col gap-3">
                  {projects.map(p => (
                    <div 
                      key={p.id}
                      className="border border-white/5 bg-[#101015]/75 p-4 flex items-center justify-between gap-4 rounded-sm hover:border-[#c5a880]/20 transition-all group relative overflow-hidden"
                    >
                      {/* Ambient corner highlights */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#c5a880]/10 group-hover:bg-[#c5a880]/40 transition-all" />

                      <div className="flex items-center gap-4">
                        <span className="text-white/20 text-xs font-bold font-mono">
                          {p.id}
                        </span>
                        <div>
                          <h3 className="font-display text-xs font-bold tracking-widest text-white uppercase group-hover:text-[#c5a880] transition-all">
                            {p.title}
                          </h3>
                          <span className="font-mono text-[9px] text-white/40 tracking-wider uppercase">
                            {p.category} {"//"} {p.year}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openProjectModal("edit", p)}
                          className="p-2 border border-white/5 hover:border-[#c5a880]/30 rounded-sm hover:text-[#c5a880] bg-white/[0.01] hover:bg-[#c5a880]/5 transition-all cursor-pointer active:scale-90"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Purge project [${p.title}]?`)) {
                              deleteProject(p.id);
                              addHudLog(`Purged project: ${p.title}`, "warning");
                            }
                          }}
                          className="p-2 border border-white/5 hover:border-red-500/35 rounded-sm hover:text-red-400 bg-white/[0.01] hover:bg-red-950/10 transition-all cursor-pointer active:scale-90"
                          title="Delete"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SERVICES EDITOR CRUD PANEL */}
            {activeTab === "services" && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex flex-col gap-1 border-b border-[#c5a880]/15 pb-4">
                  <span className="text-[#c5a880] text-[9px] tracking-[0.2em] font-semibold uppercase">CAPABILITY STACKS CORE //</span>
                  <h2 className="font-display text-xl font-bold text-white tracking-widest uppercase">EDIT SERVICES CONFIG</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(s => (
                    <div 
                      key={s.id}
                      className="border border-white/5 bg-[#101015]/80 p-5 rounded-sm hover:border-[#c5a880]/20 transition-all flex flex-col justify-between gap-4 group relative overflow-hidden"
                    >
                      <div>
                        <div className="flex items-center gap-3.5 border-b border-white/5 pb-2.5">
                          <span className="text-[#c5a880] text-xs font-bold font-mono">
                            {s.id}
                          </span>
                          <h3 className="font-display text-xs font-bold tracking-widest text-white uppercase group-hover:text-[#c5a880] transition-colors">
                            {s.title}
                          </h3>
                        </div>
                        <p className="font-mono text-[9px] leading-relaxed text-white/50 mt-3 h-12 overflow-hidden text-ellipsis">
                          {s.description}
                        </p>
                      </div>

                      <button
                        onClick={() => setServiceEditor(s)}
                        className="w-full text-center py-2 border border-white/5 hover:border-[#c5a880]/30 text-[#c5a880]/90 hover:text-white bg-[#c5a880]/5 hover:bg-[#c5a880]/10 transition-all rounded-sm text-[9px] font-bold tracking-widest cursor-pointer uppercase active:scale-95"
                      >
                        EDIT INLINE CONFIG
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TESTIMONIALS FEEDBACK CRUD INDEX */}
            {activeTab === "testimonials" && (
              <motion.div
                key="testimonials"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex items-center justify-between border-b border-[#c5a880]/15 pb-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#c5a880] text-[9px] tracking-[0.2em] font-semibold uppercase">CLIENT SATISFACTION INDEX //</span>
                    <h2 className="font-display text-xl font-bold text-white tracking-widest uppercase">FEEDBACK MANAGEMENT</h2>
                  </div>
                  <button
                    onClick={() => openTestimonialModal("add")}
                    className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-[#c5a880] hover:text-white border border-[#c5a880]/30 hover:border-[#c5a880] px-3.5 py-1.5 rounded-sm bg-[#c5a880]/5 hover:bg-[#c5a880]/10 transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD REVIEW</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {testimonials.map(t => (
                    <div 
                      key={t.id}
                      className="border border-white/5 bg-[#101015]/80 p-4 rounded-sm flex items-start justify-between gap-4 relative overflow-hidden"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3.5 mb-2.5">
                          <span className={`text-[7px] font-mono tracking-widest px-2 py-0.5 rounded-sm border ${
                            t.isActive 
                              ? "bg-[#10b981]/5 border-[#10b981]/25 text-[#10b981]" 
                              : "bg-white/5 border-white/10 text-white/30"
                          }`}>
                            {t.isActive ? "ACTIVE RESONANCE" : "MUTED"}
                          </span>
                          <span className="text-[10px] text-white/50 font-mono">
                            {t.author} {"//"} {t.company}
                          </span>
                        </div>
                        <p className="font-sans italic text-xs leading-relaxed text-white/70">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        {/* Toggle active button */}
                        <button
                          onClick={() => {
                            const updated = { ...t, isActive: !t.isActive };
                            updateTestimonial(t.id, updated);
                            addHudLog(`Toggled testimonial state for ${t.author}`, "info");
                          }}
                          className={`p-2 border rounded-sm transition-all cursor-pointer text-[8px] font-bold tracking-widest ${
                            t.isActive 
                              ? "border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/5" 
                              : "border-white/10 text-white/40 hover:bg-white/5"
                          }`}
                          title={t.isActive ? "Mute Review" : "Activate Review"}
                        >
                          {t.isActive ? "MUTE" : "ACTIVATE"}
                        </button>
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => openTestimonialModal("edit", t)}
                            className="p-2 border border-white/5 hover:border-[#c5a880]/30 rounded-sm hover:text-[#c5a880] bg-white/[0.01] hover:bg-[#c5a880]/5 transition-all cursor-pointer active:scale-90"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete testimonial review by [${t.author}]?`)) {
                                deleteTestimonial(t.id);
                                addHudLog(`Deleted review: ${t.author}`, "warning");
                              }
                            }}
                            className="p-2 border border-white/5 hover:border-red-500/35 rounded-sm hover:text-red-400 bg-white/[0.01] hover:bg-red-950/10 transition-all cursor-pointer active:scale-90"
                            title="Delete"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CRM INQUIRIES INBOX */}
            {activeTab === "crm" && (
              <motion.div
                key="crm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex flex-col gap-1 border-b border-[#c5a880]/15 pb-4">
                  <span className="text-[#c5a880] text-[9px] tracking-[0.2em] font-semibold uppercase">DOSSIER REGISTRY LEDGER //</span>
                  <h2 className="font-display text-xl font-bold text-white tracking-widest uppercase">CRM INBOX</h2>
                </div>

                <div className="flex flex-col gap-4">
                  {proposals.length === 0 ? (
                    <div className="border border-dashed border-white/10 p-12 text-center text-white/30 rounded-sm font-mono text-[10px]">
                      // INBOX LEDGER EMPTY // NO SUBMISSIONS INDEXED
                    </div>
                  ) : (
                    proposals.map(p => (
                      <div 
                        key={p.id}
                        className="border border-white/5 bg-[#101015]/85 p-5 rounded-sm flex flex-col gap-4 relative overflow-hidden group hover:border-[#c5a880]/15 transition-all"
                      >
                        {/* Status bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-outfit text-xs font-bold text-white uppercase group-hover:text-[#c5a880] transition-colors">
                              {p.fullName}
                            </span>
                            <span className="font-mono text-[8px] text-[#6b7280]">
                              {p.organization ? `(${p.organization})` : ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 font-mono text-[8.5px]">
                            {/* Simple Status tag */}
                            <span className={`px-2 py-0.5 rounded-sm border uppercase font-bold tracking-widest ${
                              p.status === "Pending" ? "bg-amber-950/20 border-amber-800/30 text-amber-400" :
                              p.status === "In-Review" ? "bg-sky-950/20 border-sky-800/30 text-sky-400" :
                              p.status === "Approved" ? "bg-emerald-950/20 border-emerald-800/30 text-emerald-400" :
                              "bg-white/5 border-white/10 text-white/40"
                            }`}>
                              STATUS: {p.status}
                            </span>
                            <span className="text-white/30">
                              {new Date(p.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Proposal data details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[9.5px] border-b border-white/5 pb-3.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between border-b border-white/[0.02] pb-1">
                              <span className="text-white/35">SERVICE:</span>
                              <span className="text-white/80 font-medium uppercase">{p.service}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/[0.02] pb-1">
                              <span className="text-white/35">BUDGET:</span>
                              <span className="text-[#c5a880] font-bold">{p.budget}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/[0.02] pb-1">
                              <span className="text-white/35">EMAIL:</span>
                              <a href={`mailto:${p.email}`} className="text-[#c5a880] underline truncate max-w-[160px]">{p.email}</a>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <span className="text-white/35 uppercase">CONCEPT BRIEF DETAILS:</span>
                            <p className="text-white/70 leading-relaxed max-h-20 overflow-y-auto text-[9px] bg-black/10 p-2 border border-white/5 rounded-sm scrollbar-thin select-text">
                              {p.details}
                            </p>
                          </div>
                        </div>

                        {/* Proposal Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[9px]">
                          <div className="flex items-center gap-1.5">
                            {p.fileName && (
                              <span className="text-[#c5a880] flex items-center gap-1 bg-[#c5a880]/5 px-2 py-1 rounded-sm border border-[#c5a880]/10 text-[8.5px]">
                                <FileText className="w-3.5 h-3.5" />
                                <span>BRIEF: {p.fileName}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Update Status dropdown actions */}
                            {["In-Review", "Approved", "Archived"].map((st) => (
                              <button
                                key={st}
                                onClick={() => {
                                  updateProposalStatus(p.id, st as Proposal["status"]);
                                  addHudLog(`Proposal status transitioned to ${st} for ${p.fullName}`, "success");
                                }}
                                className={`px-2 py-1 border hover:border-white/20 transition-all rounded-sm font-bold tracking-wider text-[8px] cursor-pointer ${
                                  p.status === st 
                                    ? "bg-white/10 border-white/30 text-white" 
                                    : "border-white/5 text-white/50 hover:bg-white/[0.02]"
                                }`}
                              >
                                {st.toUpperCase()}
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                if (confirm(`Archive & delete proposal from [${p.fullName}]?`)) {
                                  deleteProposal(p.id);
                                  addHudLog(`Deleted proposal by ${p.fullName}`, "warning");
                                }
                              }}
                              className="p-1 border border-white/5 hover:border-red-500/35 rounded-sm hover:text-red-400 bg-white/[0.01] hover:bg-red-950/10 transition-all cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* RIGHT SYSTEM UTILITY HUD PANEL (3 cols) */}
        <aside className="col-span-12 md:col-span-3 border-l border-[#c5a880]/10 bg-[#09090d] p-5 flex flex-col justify-between shrink-0 font-mono text-[9px] gap-6 z-20 overflow-y-auto">
          {/* Top block logs console */}
          <div className="flex flex-col gap-4">
            <span className="font-bold text-[#c5a880]/50 tracking-[0.2em] uppercase pl-1 text-[7.5px]">
              SYSTEM EVENT LOGS
            </span>

            <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin select-text">
              {hudLogs.map(l => (
                <div key={l.id} className="flex gap-2.5 items-start leading-relaxed text-[9px] border-b border-white/[0.02] pb-2 font-mono">
                  <span className="text-white/20 font-bold shrink-0">[{l.time}]</span>
                  <span className={`shrink-0 text-[8px] font-bold ${
                    l.type === "success" ? "text-[#10b981]" :
                    l.type === "warning" ? "text-amber-500" :
                    l.type === "error" ? "text-red-500" : "text-[#c5a880]"
                  }`}>
                    [{l.type.toUpperCase()}]
                  </span>
                  <span className="text-white/60 select-text leading-tight">{l.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quick control systems block */}
          <div className="flex flex-col gap-3.5 border-t border-white/5 pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span className="font-bold text-white/80 uppercase">SECURITY STATE</span>
            </div>
            
            <div className="flex flex-col gap-2 p-3 bg-white/[0.01] border border-white/5 rounded-sm">
              <div className="flex justify-between items-center text-[8.5px]">
                <span className="text-white/40">USER PRIVILEGE:</span>
                <span className="text-[#10b981] font-bold uppercase tracking-wider">ROOT_ADMIN</span>
              </div>
              <div className="flex justify-between items-center text-[8.5px]">
                <span className="text-white/40">CLI CONSOLE KEY:</span>
                <span className="text-[#c5a880] uppercase tracking-wider font-bold">AES_256_ACTIVE</span>
              </div>
              <div className="flex justify-between items-center text-[8.5px]">
                <span className="text-white/40">REDUX STATE:</span>
                <span className="text-[#10b981] font-bold uppercase tracking-wider">HYDRATED</span>
              </div>
            </div>

            <button 
              onClick={() => {
                localStorage.clear();
                alert("Purged local cache. Reloading...");
                window.location.reload();
              }}
              className="w-full text-center py-2.5 border border-red-500/10 hover:border-red-500/30 bg-red-950/5 hover:bg-red-950/15 text-red-400 hover:text-red-300 font-mono tracking-widest text-[8px] font-bold uppercase rounded-sm transition-all cursor-pointer active:scale-95"
            >
              PURGE LOCAL DATABASE
            </button>
          </div>

        </aside>

      </div>

      {/* ---------------------------------------------------------------------
          MODALS & FLYOUT EDITORS
          --------------------------------------------------------------------- */}
      
      {/* 1. PROJECT CRUD ADD/EDIT MODAL */}
      <AnimatePresence>
        {projectModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-mono">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b0f] border border-[#c5a880]/30 rounded-sm w-full max-w-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Corner markings */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#c5a880]" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#c5a880]" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#c5a880]" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#c5a880]" />

              <div className="bg-[#121217] px-6 py-4 flex items-center justify-between border-b border-white/5">
                <span className="font-bold text-xs tracking-widest text-white uppercase">
                  {projectModal.mode === "edit" ? "// UPDATE PROJECT SPECS" : "// INITIALIZE PROJECT STAGE"}
                </span>
                <button 
                  onClick={() => setProjectModal({ isOpen: false, mode: "add" })}
                  className="p-1 border border-white/5 hover:border-[#c5a880]/35 text-white/50 hover:text-white rounded-sm transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleProjectSubmit} className="p-6 flex flex-col gap-5 max-h-[500px] overflow-y-auto scrollbar-thin">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Project Title</label>
                    <input 
                      type="text" 
                      value={projForm.title || ""} 
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value.toUpperCase() })} 
                      className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                      placeholder="AURA CONFIGURATOR"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Primary Category</label>
                    <input 
                      type="text" 
                      value={projForm.category || ""} 
                      onChange={(e) => setProjForm({ ...projForm, category: e.target.value })} 
                      className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                      placeholder="CGI & Volumetric Design"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Tagline Summary</label>
                  <input 
                    type="text" 
                    value={projForm.tagline || ""} 
                    onChange={(e) => setProjForm({ ...projForm, tagline: e.target.value })} 
                    className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                    placeholder="Short 1-line promotional teaser description."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">In-Depth Description</label>
                  <textarea 
                    value={projForm.description || ""} 
                    onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} 
                    rows={3}
                    className="bg-black border border-white/10 rounded-sm py-2.5 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white/80 leading-relaxed font-sans"
                    placeholder="Full copy cinematic overview about the mechanical process..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Card Background Gradient</label>
                    <input 
                      type="text" 
                      value={projForm.bgGradient || ""} 
                      onChange={(e) => setProjForm({ ...projForm, bgGradient: e.target.value })} 
                      className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                      placeholder="from-slate-900 via-sky-950 to-[#050507]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Card Subtitle / Client label</label>
                    <input 
                      type="text" 
                      value={projForm.subtitle || ""} 
                      onChange={(e) => setProjForm({ ...projForm, subtitle: e.target.value })} 
                      className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                      placeholder="01 / MERCEDES-BENZ CONCEPT"
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <span className="text-[8px] text-[#c5a880] tracking-widest uppercase">SPEC DETAILS</span>
                    
                    <div className="flex flex-col gap-1.5">
                      <input 
                        type="text" 
                        value={projForm.details?.client || ""} 
                        onChange={(e) => setProjForm({ ...projForm, details: { ...projForm.details!, client: e.target.value } })}
                        placeholder="Client name" 
                        className="bg-black border border-white/10 rounded-sm py-1.5 px-3 focus:border-[#c5a880]/30 outline-none text-[10px]"
                      />
                      <input 
                        type="text" 
                        value={projForm.details?.timeline || ""} 
                        onChange={(e) => setProjForm({ ...projForm, details: { ...projForm.details!, timeline: e.target.value } })}
                        placeholder="Timeline (e.g. Q1 2026)" 
                        className="bg-black border border-white/10 rounded-sm py-1.5 px-3 focus:border-[#c5a880]/30 outline-none text-[10px]"
                      />
                      <input 
                        type="text" 
                        value={projForm.details?.role || ""} 
                        onChange={(e) => setProjForm({ ...projForm, details: { ...projForm.details!, role: e.target.value } })}
                        placeholder="Role / Responsibility" 
                        className="bg-black border border-white/10 rounded-sm py-1.5 px-3 focus:border-[#c5a880]/30 outline-none text-[10px]"
                      />
                      <input 
                        type="text" 
                        value={projForm.details?.engine || ""} 
                        onChange={(e) => setProjForm({ ...projForm, details: { ...projForm.details!, engine: e.target.value } })}
                        placeholder="Graphics engine stack" 
                        className="bg-black border border-white/10 rounded-sm py-1.5 px-3 focus:border-[#c5a880]/30 outline-none text-[10px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-[8px] text-[#c5a880] tracking-widest uppercase">HUD METRIC WIDGETS</span>
                    
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          value={projForm.metrics?.[idx]?.label || ""} 
                          onChange={(e) => {
                            const newMetrics = [...(projForm.metrics || [])];
                            newMetrics[idx] = { ...newMetrics[idx], label: e.target.value.toUpperCase() };
                            setProjForm({ ...projForm, metrics: newMetrics });
                          }}
                          placeholder={`Metric label ${idx + 1}`} 
                          className="bg-black border border-white/10 rounded-sm py-1.5 px-3 focus:border-[#c5a880]/30 outline-none text-[10px]"
                        />
                        <input 
                          type="text" 
                          value={projForm.metrics?.[idx]?.value || ""} 
                          onChange={(e) => {
                            const newMetrics = [...(projForm.metrics || [])];
                            newMetrics[idx] = { ...newMetrics[idx], value: e.target.value };
                            setProjForm({ ...projForm, metrics: newMetrics });
                          }}
                          placeholder={`Metric value ${idx + 1}`} 
                          className="bg-black border border-white/10 rounded-sm py-1.5 px-3 focus:border-[#c5a880]/30 outline-none text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setProjectModal({ isOpen: false, mode: "add" })}
                    className="py-2.5 px-5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded-sm text-[10px] tracking-widest font-bold uppercase transition-all cursor-pointer"
                  >
                    DISMISS
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#c5a880]/15 border border-[#c5a880]/30 hover:bg-[#c5a880]/20 hover:border-[#c5a880]/50 text-[#c5a880] rounded-sm text-[10px] tracking-widest font-bold uppercase transition-all cursor-pointer"
                  >
                    Ingest System State
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. TESTIMONIAL REVIEW ADD/EDIT MODAL */}
      <AnimatePresence>
        {testimonialModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-mono">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b0f] border border-[#c5a880]/30 rounded-sm w-full max-w-md relative shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#c5a880]" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#c5a880]" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#c5a880]" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#c5a880]" />

              <div className="bg-[#121217] px-6 py-4 flex items-center justify-between border-b border-white/5">
                <span className="font-bold text-xs tracking-widest text-white uppercase">
                  {testimonialModal.mode === "edit" ? "// UPDATE CLIENT REVIEW" : "// LOG NEW CLIENT TESTIMONY"}
                </span>
                <button 
                  onClick={() => setTestimonialModal({ isOpen: false, mode: "add" })}
                  className="p-1 border border-white/5 hover:border-[#c5a880]/35 text-white/50 hover:text-white rounded-sm transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleTestimonialSubmit} className="p-6 flex flex-col gap-4 font-mono">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Client Author Signature</label>
                  <input 
                    type="text" 
                    value={testiForm.author || ""} 
                    onChange={(e) => setTestiForm({ ...testiForm, author: e.target.value.toUpperCase() })} 
                    className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                    placeholder="MARCUS VANE"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Role Signature</label>
                    <input 
                      type="text" 
                      value={testiForm.role || ""} 
                      onChange={(e) => setTestiForm({ ...testiForm, role: e.target.value.toUpperCase() })} 
                      className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                      placeholder="HEAD OF DIGITAL DESIGN"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Company Signature</label>
                    <input 
                      type="text" 
                      value={testiForm.company || ""} 
                      onChange={(e) => setTestiForm({ ...testiForm, company: e.target.value.toUpperCase() })} 
                      className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                      placeholder="LEICA CAMERA spec"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Testimonial Quote</label>
                  <textarea 
                    value={testiForm.quote || ""} 
                    onChange={(e) => setTestiForm({ ...testiForm, quote: e.target.value })} 
                    rows={4}
                    className="bg-black border border-white/10 rounded-sm py-2.5 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white/80 leading-relaxed font-sans"
                    placeholder="Provide full review quote from brand rep..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Rating score (1-5)</label>
                    <input 
                      type="number" 
                      min={1}
                      max={5}
                      value={testiForm.rating || 5} 
                      onChange={(e) => setTestiForm({ ...testiForm, rating: parseInt(e.target.value) || 5 })} 
                      className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 justify-center">
                    <label className="text-[8px] text-[#c5a880] tracking-widest uppercase mb-1">State visibility</label>
                    <label className="flex items-center gap-2.5 text-xs text-white/60 select-none cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={testiForm.isActive !== undefined ? testiForm.isActive : true}
                        onChange={(e) => setTestiForm({ ...testiForm, isActive: e.target.checked })}
                        className="w-3.5 h-3.5 bg-black border border-white/15 rounded-sm"
                      />
                      <span>Active Resonance</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setTestimonialModal({ isOpen: false, mode: "add" })}
                    className="py-2.5 px-5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded-sm text-[10px] tracking-widest font-bold uppercase transition-all cursor-pointer"
                  >
                    DISMISS
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#c5a880]/15 border border-[#c5a880]/30 hover:bg-[#c5a880]/20 hover:border-[#c5a880]/50 text-[#c5a880] rounded-sm text-[10px] tracking-widest font-bold uppercase transition-all cursor-pointer"
                  >
                    Ingest system review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CAPABILITY / SERVICE EDIT FLYOUT PANEL */}
      <AnimatePresence>
        {serviceEditor && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm select-none font-mono">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="bg-[#0b0b0f] border-l border-[#c5a880]/30 h-full w-full max-w-md relative shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between"
            >
              <div className="bg-[#121217] px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white/40">{serviceEditor.id}</span>
                  <span className="font-bold text-xs tracking-widest text-white uppercase">
                    EDIT SERVICE: {serviceEditor.title}
                  </span>
                </div>
                <button 
                  onClick={() => setServiceEditor(null)}
                  className="p-1 border border-white/5 hover:border-[#c5a880]/35 text-white/50 hover:text-white rounded-sm transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Flyout panel body scrollable details */}
              <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto scrollbar-thin select-none">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Capabilities Title</label>
                  <input 
                    type="text" 
                    value={serviceEditor.title || ""} 
                    onChange={(e) => setServiceEditor({ ...serviceEditor, title: e.target.value.toUpperCase() })} 
                    className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">Decrypted Description</label>
                  <textarea 
                    value={serviceEditor.description || ""} 
                    onChange={(e) => setServiceEditor({ ...serviceEditor, description: e.target.value })} 
                    rows={4}
                    className="bg-black border border-white/10 rounded-sm py-2.5 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white/80 leading-relaxed font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] text-[#c5a880] tracking-widest uppercase">HUD Sector Header Label</label>
                  <input 
                    type="text" 
                    value={serviceEditor.hudTitle || ""} 
                    onChange={(e) => setServiceEditor({ ...serviceEditor, hudTitle: e.target.value.toUpperCase() })} 
                    className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[8px] text-[#c5a880] tracking-widest uppercase">HUD SPEC ITEMS (4 items)</span>
                  
                  {serviceEditor.hudItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        value={item.label || ""} 
                        onChange={(e) => {
                          const newItems = [...serviceEditor.hudItems];
                          newItems[idx] = { ...newItems[idx], label: e.target.value.toUpperCase() };
                          setServiceEditor({ ...serviceEditor, hudItems: newItems });
                        }}
                        className="bg-black border border-white/10 rounded-sm py-1.5 px-3 focus:border-[#c5a880]/30 outline-none text-[10px]"
                      />
                      <input 
                        type="text" 
                        value={item.value || ""} 
                        onChange={(e) => {
                          const newItems = [...serviceEditor.hudItems];
                          newItems[idx] = { ...newItems[idx], value: e.target.value };
                          setServiceEditor({ ...serviceEditor, hudItems: newItems });
                        }}
                        className="bg-black border border-white/10 rounded-sm py-1.5 px-3 focus:border-[#c5a880]/30 outline-none text-[10px]"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[8px] text-[#c5a880] tracking-widest uppercase">TELEMETRY LINES BULLETS (3 items)</span>
                  
                  {serviceEditor.bullets.map((b, idx) => (
                    <input 
                      key={idx}
                      type="text" 
                      value={b || ""} 
                      onChange={(e) => {
                        const newBullets = [...serviceEditor.bullets];
                        newBullets[idx] = e.target.value;
                        setServiceEditor({ ...serviceEditor, bullets: newBullets });
                      }}
                      className="bg-black border border-white/10 rounded-sm py-2 px-3 focus:border-[#c5a880]/30 outline-none text-xs text-white"
                      placeholder={`Bullet line ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Flyout panel submit footer */}
              <div className="bg-[#121217] p-5 border-t border-white/5 flex gap-3 select-none">
                <button
                  onClick={() => setServiceEditor(null)}
                  className="flex-1 text-center py-2.5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded-sm text-[10px] tracking-widest font-bold uppercase transition-all cursor-pointer"
                >
                  DISMISS
                </button>
                <button
                  onClick={() => {
                    updateService(serviceEditor.id, serviceEditor);
                    addHudLog(`Service updated: ${serviceEditor.title}`, "success");
                    setServiceEditor(null);
                  }}
                  className="flex-1 text-center py-2.5 bg-[#c5a880]/15 border border-[#c5a880]/30 hover:bg-[#c5a880]/20 hover:border-[#c5a880]/50 text-[#c5a880] rounded-sm text-[10px] tracking-widest font-bold uppercase transition-all cursor-pointer"
                >
                  SAVE CHANGES
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
