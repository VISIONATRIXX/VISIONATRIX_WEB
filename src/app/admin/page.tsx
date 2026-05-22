"use client";

import { useState, useEffect, useRef } from "react";
import { useAdmin, Project, ServiceItem, Testimonial, Proposal } from "@/context/AdminContext";
import { 
  Lock, 
  Unlock, 
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
  Eye,
  EyeOff,
  Star,
  ChevronRight,
  Clock,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "services" | "testimonials" | "crm">("overview");

  // System logs state for HUD overview
  const [hudLogs, setHudLogs] = useState<LogMessage[]>([]);

  // CRUD MODALS & EDITORS STATE
  const [projectModal, setProjectModal] = useState<{ isOpen: boolean; mode: "add" | "edit"; data?: Project }>({ isOpen: false, mode: "add" });
  const [testimonialModal, setTestimonialModal] = useState<{ isOpen: boolean; mode: "add" | "edit"; data?: Testimonial }>({ isOpen: false, mode: "add" });
  const [serviceEditor, setServiceEditor] = useState<ServiceItem | null>(null);

  const budgetTiers = ["$5K - $15K", "$15K - $40K", "$40K - $100K", "$100K+"];

  // Helper log generator
  const addHudLog = (text: string, type: LogMessage["type"] = "info") => {
    const time = new Date().toTimeString().split(" ")[0];
    const newLog: LogMessage = { id: Date.now().toString(), text, type, time };
    setHudLogs(prev => [newLog, ...prev.slice(0, 24)]);
  };

  // Run on mount to check credentials session & seed default logs
  useEffect(() => {
    // Check local session
    if (typeof window !== "undefined") {
      const activeSession = sessionStorage.getItem("visionatrix_admin_session");
      if (activeSession === "authorized_141104") {
        setIsAuthenticated(true);
      }
    }

    setHudLogs([
      { id: "1", text: "Secure CRM & CMS state layer initialized.", type: "success", time: new Date().toTimeString().split(" ")[0] },
      { id: "2", text: "Dynamic sync with localStorage completed.", type: "success", time: new Date().toTimeString().split(" ")[0] },
      { id: "3", text: "Welcome to Visionatrix Studio Admin Portal.", type: "info", time: new Date().toTimeString().split(" ")[0] }
    ]);
  }, []);

  // Time tracker for visual header
  const [systemTime, setSystemTime] = useState("");
  useEffect(() => {
    const tick = () => {
      setSystemTime(new Date().toTimeString().split(" ")[0]);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Passcode verification
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsVerifying(true);

    // Simulate clean visual fade delay
    setTimeout(() => {
      if (passcode === "141104") {
        setIsAuthenticated(true);
        sessionStorage.setItem("visionatrix_admin_session", "authorized_141104");
        addHudLog("Administrator authenticated successfully.", "success");
      } else {
        setAuthError("INCORRECT SECURITY PASSCODE");
        addHudLog("Unauthorized access attempt rejected.", "error");
      }
      setIsVerifying(false);
    }, 450);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode("");
    sessionStorage.removeItem("visionatrix_admin_session");
    addHudLog("Administrator session terminated safely.", "info");
  };

  // PROJECT CRUD MODAL HANDLING
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
    details: { client: "", timeline: "", role: "", engine: "" },
    metrics: [{ label: "", value: "" }, { label: "", value: "" }, { label: "", value: "" }]
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
        details: { client: "", timeline: "", role: "", engine: "" },
        metrics: [
          { label: "RESOLUTION", value: "8K Projections" },
          { label: "RENDER ENGINE", value: "Octane / WebGL" },
          { label: "DYNAMICS", value: "Realtime Physics" }
        ]
      });
    }
    setProjectModal({ isOpen: true, mode, data });
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.title || !projForm.category) {
      alert("Please fill in the required fields: Title & Category");
      return;
    }

    const payload: Omit<Project, "id"> = {
      title: projForm.title.toUpperCase(),
      category: projForm.category,
      categories: projForm.categories || ["CGI"],
      tagline: projForm.tagline || "",
      description: projForm.description || "",
      image: projForm.image || "/work_aura_configurator.png",
      subtitle: projForm.subtitle || `${projForm.title} Spec`,
      year: projForm.year || "2026",
      bgGradient: projForm.bgGradient || "from-slate-900 via-sky-950 to-[#050507]",
      details: {
        client: projForm.details?.client || "Spec Project",
        timeline: projForm.details?.timeline || "Q1 2026",
        role: projForm.details?.role || "Digital Studio",
        engine: projForm.details?.engine || "Octane Render"
      },
      metrics: projForm.metrics || []
    };

    if (projectModal.mode === "edit" && projectModal.data) {
      updateProject(projectModal.data.id, { ...payload, id: projectModal.data.id });
      addHudLog(`Project portfolio updated: "${payload.title}"`, "success");
    } else {
      addProject(payload);
      addHudLog(`New portfolio item created: "${payload.title}"`, "success");
    }
    setProjectModal({ isOpen: false, mode: "add" });
  };

  // TESTIMONIAL CRUD MODAL HANDLING
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
      alert("Please provide the Testimonial Quote and Author signature.");
      return;
    }

    const payload: Omit<Testimonial, "id"> = {
      quote: testiForm.quote,
      author: testiForm.author.toUpperCase(),
      role: testiForm.role || "Executive Director",
      company: testiForm.company || "Studio Client",
      rating: testiForm.rating || 5,
      isActive: testiForm.isActive !== undefined ? testiForm.isActive : true
    };

    if (testimonialModal.mode === "edit" && testimonialModal.data) {
      updateTestimonial(testimonialModal.data.id, { ...payload, id: testimonialModal.data.id });
      addHudLog(`Client testimonial updated for ${payload.author}`, "success");
    } else {
      addTestimonial(payload);
      addHudLog(`New testimonial registered from ${payload.author}`, "success");
    }
    setTestimonialModal({ isOpen: false, mode: "add" });
  };

  // RENDER: PASSWORD ACCESS GATE (Professional & Clean Card layout)
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#070709] flex flex-col items-center justify-center font-sans relative px-4 select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.04),transparent_75%)] pointer-events-none z-0" />
        
        <div className="w-full max-w-md z-10 flex flex-col gap-6">
          {/* Dashboard Header */}
          <div className="flex flex-col items-center text-center gap-1.5 pb-2">
            <div className="w-12 h-12 rounded-full border border-[#c5a880]/30 bg-[#c5a880]/5 flex items-center justify-center relative mb-2 shadow-[0_0_20px_rgba(197,168,128,0.05)]">
              <Lock className="w-5 h-5 text-[#c5a880]" />
            </div>
            <h1 className="font-display text-xl tracking-[0.2em] text-white font-light uppercase">
              VISIONATRIX
            </h1>
            <span className="text-[10px] tracking-[0.3em] text-[#c5a880] font-mono uppercase">
              [ SECURE STUDIO PORTAL ]
            </span>
          </div>

          {/* Login Card */}
          <form 
            onSubmit={handleLoginSubmit}
            className="bg-[#0e0e13] border border-white/5 rounded-lg p-7 flex flex-col gap-5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Ambient top gold line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c5a880]/40 to-transparent" />

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono tracking-widest text-white/50 uppercase">
                ENTER ACCESS PASSCODE
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError("");
                  }}
                  placeholder="••••••"
                  className="w-full bg-black/45 border border-white/10 rounded-md py-3 pl-4 pr-12 text-white font-mono text-center tracking-[0.3em] focus:border-[#c5a880]/40 focus:ring-1 focus:ring-[#c5a880]/20 outline-none text-sm transition-all"
                  required
                  autoFocus
                  disabled={isVerifying}
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-4 text-white/40 hover:text-[#c5a880] transition-colors p-1 cursor-pointer"
                  title={showPasscode ? "Hide Passcode" : "Show Passcode"}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <span className="text-[9px] font-mono text-red-500 font-medium text-center tracking-wider animate-pulse uppercase">
                {authError}
              </span>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#c5a880]/10 border border-[#c5a880]/30 hover:bg-[#c5a880]/25 hover:border-[#c5a880]/60 text-[#c5a880] hover:text-white rounded-md py-2.5 font-sans font-medium text-xs tracking-widest uppercase transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.2)] disabled:opacity-50"
            >
              {isVerifying ? "VERIFYING KEY..." : "ACCESS DASHBOARD"}
            </button>
          </form>

          {/* Professional prompt hint */}
          <div className="text-center font-mono text-[9px] text-white/20 tracking-wider">
            SYSTEM ADVICE: Enter security key to decrypt state cache.
          </div>
        </div>
      </main>
    );
  }

  // RENDER: COMPLETED PROFESSIONAL DASHBOARD SHELL
  return (
    <main className="min-h-screen bg-[#07070a] text-white/90 font-sans flex flex-col justify-between overflow-hidden">
      
      {/* HEADER BAR */}
      <header className="border-b border-white/5 bg-[#0b0b0f] px-6 py-4 flex items-center justify-between z-30 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#c5a880]/5 border border-[#c5a880]/25 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-[#c5a880]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xs tracking-[0.2em] font-semibold text-white uppercase">
                VISIONATRIX ADMIN PANEL
              </h1>
              <span className="text-[8px] tracking-wider border border-[#c5a880]/20 px-1.5 py-0.5 rounded text-[#c5a880] bg-[#c5a880]/5 font-mono hidden sm:inline">
                CORE VERSION 1.1.0
              </span>
            </div>
            <p className="text-[9px] tracking-wide text-white/35 font-mono uppercase mt-0.5">
              Secure Central State Controller & CRM
            </p>
          </div>
        </div>

        {/* Diagnostic details */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-[9px] text-white/40 tracking-wider">
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-[#c5a880]/70" />
            <span>STORAGE LAYER: <span className="text-[#c5a880] font-semibold">LOCAL_SYNC</span></span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>RENDER SPEED: <span className="text-emerald-400 font-semibold">120 FPS LOCK</span></span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span className="text-white/60 font-medium">{systemTime} UTC</span>
          </div>
        </div>

        {/* Log out action */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-sans text-[10px] tracking-wider text-white/60 hover:text-red-400 border border-white/5 hover:border-red-500/20 px-3 py-1.5 rounded transition-all hover:bg-red-950/10 active:scale-95 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>LOGOUT</span>
        </button>
      </header>

      {/* MATRIX LAYOUT */}
      <div className="flex-1 w-full grid grid-cols-12 items-stretch overflow-hidden relative min-h-0">
        
        {/* SIDEBAR NAVIGATION (2 cols) */}
        <aside className="col-span-12 md:col-span-2 border-r border-white/5 bg-[#09090d] flex flex-col p-4 shrink-0 font-sans text-xs gap-1.5 z-20">
          <span className="font-mono font-bold text-[#c5a880]/40 tracking-widest mb-2 uppercase pl-2 text-[8px]">
            PORTAL SERVICES
          </span>

          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left py-2.5 px-3 border transition-all duration-200 rounded flex items-center gap-3 cursor-pointer relative ${
              activeTab === "overview" 
                ? "bg-[#c5a880]/5 border-[#c5a880]/20 text-[#c5a880] font-medium" 
                : "border-transparent text-white/55 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            {activeTab === "overview" && <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#c5a880]" />}
            <Activity className="w-4 h-4 shrink-0" />
            <span className="tracking-wide">Dashboard HUD</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full text-left py-2.5 px-3 border transition-all duration-200 rounded flex items-center gap-3 cursor-pointer relative ${
              activeTab === "projects" 
                ? "bg-[#c5a880]/5 border-[#c5a880]/20 text-[#c5a880] font-medium" 
                : "border-transparent text-white/55 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            {activeTab === "projects" && <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#c5a880]" />}
            <Briefcase className="w-4 h-4 shrink-0" />
            <span className="tracking-wide">Portfolio Works</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`w-full text-left py-2.5 px-3 border transition-all duration-200 rounded flex items-center gap-3 cursor-pointer relative ${
              activeTab === "services" 
                ? "bg-[#c5a880]/5 border-[#c5a880]/20 text-[#c5a880] font-medium" 
                : "border-transparent text-white/55 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            {activeTab === "services" && <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#c5a880]" />}
            <Sliders className="w-4 h-4 shrink-0" />
            <span className="tracking-wide">Capabilities</span>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`w-full text-left py-2.5 px-3 border transition-all duration-200 rounded flex items-center gap-3 cursor-pointer relative ${
              activeTab === "testimonials" 
                ? "bg-[#c5a880]/5 border-[#c5a880]/20 text-[#c5a880] font-medium" 
                : "border-transparent text-white/55 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            {activeTab === "testimonials" && <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#c5a880]" />}
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="tracking-wide">Client Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab("crm")}
            className={`w-full text-left py-2.5 px-3 border transition-all duration-200 rounded flex items-center gap-3 cursor-pointer relative ${
              activeTab === "crm" 
                ? "bg-[#c5a880]/5 border-[#c5a880]/20 text-[#c5a880] font-medium" 
                : "border-transparent text-white/55 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            {activeTab === "crm" && <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#c5a880]" />}
            <FileText className="w-4 h-4 shrink-0" />
            <span className="tracking-wide">Inquiries Inbox</span>
            {proposals.filter(p => p.status === "Pending").length > 0 && (
              <span className="bg-[#c5a880] text-black text-[9px] px-1.5 py-0.5 rounded-full font-bold font-mono ml-auto tracking-normal">
                {proposals.filter(p => p.status === "Pending").length}
              </span>
            )}
          </button>
        </aside>

        {/* WORK CONSOLE VIEWPORT (10 cols) */}
        <section className="col-span-12 md:col-span-10 p-6 sm:p-8 overflow-y-auto z-10 flex flex-col justify-start relative scrollbar-thin">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW PANEL TAB */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-col gap-6 w-full"
              >
                {/* Visual Header */}
                <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                  <span className="text-[#c5a880] text-[9px] font-mono tracking-widest uppercase">SYSTEM STATISTICS HUD</span>
                  <h2 className="font-display text-xl font-light text-white tracking-wider uppercase">DASHBOARD INSTRUMENTS</h2>
                </div>

                {/* Dashboard Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border border-white/5 bg-[#0f0f14] p-5 rounded-lg flex flex-col justify-between h-28 relative group hover:border-[#c5a880]/20 transition-all duration-300">
                    <div className="absolute top-4 right-4 text-white/5 group-hover:text-[#c5a880]/15 transition-colors">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <span className="text-white/40 text-[9px] font-mono tracking-widest uppercase">PORTFOLIO ITEMS</span>
                    <span className="text-3xl font-light text-white tracking-wide mt-1">
                      {projects.length.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[9px] text-white/20 font-mono">TOTAL ACTIVE WORKS</span>
                  </div>

                  <div className="border border-white/5 bg-[#0f0f14] p-5 rounded-lg flex flex-col justify-between h-28 relative group hover:border-[#c5a880]/20 transition-all duration-300">
                    <div className="absolute top-4 right-4 text-white/5 group-hover:text-[#c5a880]/15 transition-colors">
                      <FileText className="w-8 h-8" />
                    </div>
                    <span className="text-white/40 text-[9px] font-mono tracking-widest uppercase">CRM INBOX LEADS</span>
                    <span className="text-3xl font-light text-white tracking-wide mt-1">
                      {proposals.length.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[9px] text-[#c5a880] font-mono">
                      {proposals.filter(p => p.status === "Pending").length} PENDING INQUIRIES
                    </span>
                  </div>

                  <div className="border border-white/5 bg-[#0f0f14] p-5 rounded-lg flex flex-col justify-between h-28 relative group hover:border-[#c5a880]/20 transition-all duration-300">
                    <div className="absolute top-4 right-4 text-white/5 group-hover:text-[#c5a880]/15 transition-colors">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <span className="text-white/40 text-[9px] font-mono tracking-widest uppercase">CLIENT REVIEWS</span>
                    <span className="text-3xl font-light text-white tracking-wide mt-1">
                      {testimonials.length.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[9px] text-[#10b981] font-mono">
                      {testimonials.filter(t => t.isActive).length} VISIBLE ON PORTFOLIO
                    </span>
                  </div>

                  <div className="border border-white/5 bg-[#0f0f14] p-5 rounded-lg flex flex-col justify-between h-28 relative group hover:border-[#c5a880]/20 transition-all duration-300">
                    <div className="absolute top-4 right-4 text-[#c5a880]/10 group-hover:text-[#c5a880]/20 transition-colors">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <span className="text-white/40 text-[9px] font-mono tracking-widest uppercase">CONVERSION RATIO</span>
                    <span className="text-3xl font-light text-[#c5a880] tracking-wide mt-1">
                      {proposals.length > 0 
                        ? `${((proposals.filter(p => p.status === "Approved").length / proposals.length) * 100).toFixed(0)}%`
                        : "0%"
                      }
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono uppercase tracking-wide">STUDIO RATINGS HIGH</span>
                  </div>
                </div>

                {/* Dashboard Secondary Layout Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
                  {/* Latest CRM Submissions Table (7 cols) */}
                  <div className="lg:col-span-7 border border-white/5 bg-[#0b0b0f] rounded-lg p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#c5a880]" />
                        <span className="text-xs font-semibold text-white tracking-wide">LATEST CRM SUBMISSIONS</span>
                      </div>
                      <button 
                        onClick={() => setActiveTab("crm")} 
                        className="text-[9px] font-mono tracking-widest text-[#c5a880] hover:text-white uppercase transition-colors"
                      >
                        VIEW INBOX IN FULL &rarr;
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {proposals.length === 0 ? (
                        <div className="py-12 text-center text-white/20 font-mono text-[10px]">
                          NO SUBMISSIONS INDEXED YET
                        </div>
                      ) : (
                        proposals.slice(0, 4).map(p => (
                          <div 
                            key={p.id}
                            className="bg-[#121217] border border-white/5 rounded-md p-3.5 flex items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="font-semibold text-white">{p.fullName}</div>
                              <div className="text-[9px] text-white/40 mt-0.5 uppercase tracking-wide">
                                {p.service} &bull; {p.budget}
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase ${
                              p.status === "Pending" ? "bg-amber-950/40 text-amber-400 border border-amber-900/30" :
                              p.status === "In-Review" ? "bg-sky-950/40 text-sky-400 border border-sky-900/30" :
                              p.status === "Approved" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" :
                              "bg-white/5 text-white/40 border border-white/10"
                            }`}>
                              {p.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Core Logs & Action controls (5 cols) */}
                  <div className="lg:col-span-5 border border-white/5 bg-[#0b0b0f] rounded-lg p-5 flex flex-col justify-between gap-5">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <Activity className="w-4 h-4 text-[#c5a880]" />
                        <span className="text-xs font-semibold text-white tracking-wide">SYSTEM ACTIVITY LOGS</span>
                      </div>

                      <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1 select-text scrollbar-thin">
                        {hudLogs.map(l => (
                          <div key={l.id} className="flex gap-2 items-start leading-relaxed text-[9px] font-mono border-b border-white/[0.02] pb-1.5">
                            <span className="text-white/20 font-bold shrink-0">[{l.time}]</span>
                            <span className={`shrink-0 text-[8px] font-bold ${
                              l.type === "success" ? "text-emerald-400" :
                              l.type === "warning" ? "text-amber-500" :
                              l.type === "error" ? "text-red-500" : "text-[#c5a880]"
                            }`}>
                              [{l.type.toUpperCase()}]
                            </span>
                            <span className="text-white/55 truncate max-w-[200px] select-text">{l.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4">
                      <button 
                        onClick={() => {
                          if (confirm("Reset cache state to factory defaults? All manual changes will be purged.")) {
                            localStorage.clear();
                            addHudLog("Cache Database fully purged.", "warning");
                            window.location.reload();
                          }
                        }}
                        className="w-full text-center py-2 border border-red-500/10 hover:border-red-500/30 bg-red-950/5 hover:bg-red-950/15 text-red-400 hover:text-red-300 font-mono tracking-widest text-[8px] font-bold uppercase rounded transition-all cursor-pointer active:scale-95"
                      >
                        RESET LOCAL DATABASE
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PORTFOLIO CMS TAB */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-4 gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#c5a880] text-[9px] font-mono tracking-widest uppercase">PORTFOLIO DATA INDEX</span>
                    <h2 className="font-display text-xl font-light text-white tracking-wider uppercase">WORKS MANAGER</h2>
                  </div>
                  <button
                    onClick={() => openProjectModal("add")}
                    className="flex items-center gap-2 font-sans text-xs tracking-wider text-black font-semibold bg-[#c5a880] hover:bg-white px-4 py-2 rounded transition-all duration-300 active:scale-95 cursor-pointer shadow-[0_2px_8px_rgba(197,168,128,0.2)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD PROJECT</span>
                  </button>
                </div>

                {/* Portfolio Lists Table */}
                <div className="border border-white/5 bg-[#0b0b0f] rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between bg-[#121217] px-5 py-3 border-b border-white/5 text-[9px] font-mono tracking-widest text-white/40 uppercase">
                    <div className="flex-1 max-w-[80px]">ID</div>
                    <div className="flex-1 max-w-[280px]">PROJECT TITLE</div>
                    <div className="flex-1 max-w-[180px]">CATEGORY</div>
                    <div className="flex-1 max-w-[100px]">YEAR</div>
                    <div className="w-[100px] text-right">ACTIONS</div>
                  </div>

                  <div className="flex flex-col">
                    {projects.map(p => (
                      <div 
                        key={p.id}
                        className="flex items-center justify-between px-5 py-4 border-b border-white/[0.03] text-xs hover:bg-white/[0.01] transition-colors"
                      >
                        <div className="flex-1 max-w-[80px] font-mono text-white/30 font-bold">{p.id}</div>
                        <div className="flex-1 max-w-[280px] font-semibold text-white uppercase tracking-wider">{p.title}</div>
                        <div className="flex-1 max-w-[180px] text-white/60">{p.category}</div>
                        <div className="flex-1 max-w-[100px] font-mono text-white/50">{p.year}</div>
                        <div className="w-[100px] flex items-center justify-end gap-2">
                          <button
                            onClick={() => openProjectModal("edit", p)}
                            className="p-1.5 border border-white/5 hover:border-[#c5a880]/30 rounded text-white/50 hover:text-[#c5a880] hover:bg-[#c5a880]/5 transition-all cursor-pointer"
                            title="Edit specs"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove project [${p.title}] permanently?`)) {
                                deleteProject(p.id);
                                addHudLog(`Purged project: "${p.title}"`, "warning");
                              }
                            }}
                            className="p-1.5 border border-white/5 hover:border-red-500/35 rounded text-white/50 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer"
                            title="Delete project"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SERVICES INLINE CMS TAB */}
            {activeTab === "services" && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                  <span className="text-[#c5a880] text-[9px] font-mono tracking-widest uppercase">CAPABILITY SCHEMATIC INTERACTIVE</span>
                  <h2 className="font-display text-xl font-light text-white tracking-wider uppercase">SERVICES CONFIG</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {services.map(s => (
                    <div 
                      key={s.id}
                      className="border border-white/5 bg-[#0b0b0f] p-5 rounded-lg hover:border-[#c5a880]/15 transition-all flex flex-col justify-between gap-5 group relative overflow-hidden"
                    >
                      {/* Sub gold corner bar */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#c5a880]/5 group-hover:bg-[#c5a880]/30 transition-all duration-300" />
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                          <span className="text-[#c5a880] text-[10px] font-mono font-bold">{s.id}</span>
                          <h3 className="text-xs font-semibold text-white tracking-wider uppercase group-hover:text-[#c5a880] transition-colors">
                            {s.title}
                          </h3>
                        </div>
                        <p className="text-xs leading-relaxed text-white/50 h-12 overflow-hidden text-ellipsis line-clamp-2">
                          {s.description}
                        </p>
                      </div>

                      <button
                        onClick={() => setServiceEditor(s)}
                        className="w-full text-center py-2 border border-white/5 hover:border-[#c5a880]/30 text-[#c5a880] hover:text-white bg-[#c5a880]/5 hover:bg-[#c5a880]/15 transition-all rounded text-[10px] font-semibold tracking-wider cursor-pointer uppercase active:scale-[0.98]"
                      >
                        EDIT CAPABILITY SCHEMATIC
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FEEDBACK CMS TAB */}
            {activeTab === "testimonials" && (
              <motion.div
                key="testimonials"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-4 gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#c5a880] text-[9px] font-mono tracking-widest uppercase">CLIENT ADVOCATES REVIEWS</span>
                    <h2 className="font-display text-xl font-light text-white tracking-wider uppercase">FEEDBACK CMS</h2>
                  </div>
                  <button
                    onClick={() => openTestimonialModal("add")}
                    className="flex items-center gap-2 font-sans text-xs tracking-wider text-black font-semibold bg-[#c5a880] hover:bg-white px-4 py-2 rounded transition-all duration-300 active:scale-95 cursor-pointer shadow-[0_2px_8px_rgba(197,168,128,0.2)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD REVIEW</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {testimonials.map(t => (
                    <div 
                      key={t.id}
                      className="border border-white/5 bg-[#0b0b0f] p-5 rounded-lg flex items-start justify-between gap-5 relative overflow-hidden"
                    >
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`text-[7px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border ${
                            t.isActive 
                              ? "bg-emerald-950/20 border-emerald-800/30 text-emerald-400" 
                              : "bg-white/5 border-white/10 text-white/30"
                          }`}>
                            {t.isActive ? "ACTIVE RESONANCE" : "MUTED"}
                          </span>
                          <span className="text-xs font-semibold text-white tracking-wider">{t.author}</span>
                          <span className="text-[10px] text-white/40 font-mono">({t.role} &bull; {t.company})</span>
                        </div>

                        {/* Rendering Rating score */}
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < t.rating ? "text-[#c5a880] fill-[#c5a880]" : "text-white/10"}`} 
                            />
                          ))}
                        </div>

                        <p className="text-xs italic leading-relaxed text-white/70 max-w-2xl font-light">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => {
                            const updated = { ...t, isActive: !t.isActive };
                            updateTestimonial(t.id, updated);
                            addHudLog(`Toggled testimonial state for ${t.author}`, "info");
                          }}
                          className={`py-1.5 px-3 border rounded font-mono text-[8px] font-bold tracking-widest transition-all cursor-pointer ${
                            t.isActive 
                              ? "border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/20" 
                              : "border-white/10 text-white/40 hover:bg-white/5"
                          }`}
                        >
                          {t.isActive ? "MUTE" : "ACTIVATE"}
                        </button>
                        
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => openTestimonialModal("edit", t)}
                            className="p-1.5 border border-white/5 hover:border-[#c5a880]/30 rounded text-white/50 hover:text-[#c5a880] hover:bg-[#c5a880]/5 transition-all cursor-pointer"
                            title="Edit Review"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove review by [${t.author}] permanently?`)) {
                                deleteTestimonial(t.id);
                                addHudLog(`Purged testimonial: ${t.author}`, "warning");
                              }
                            }}
                            className="p-1.5 border border-white/5 hover:border-red-500/35 rounded text-white/50 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CRM INQUIRIES INBOX TAB */}
            {activeTab === "crm" && (
              <motion.div
                key="crm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex flex-col gap-6 w-full"
              >
                <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                  <span className="text-[#c5a880] text-[9px] font-mono tracking-widest uppercase">CRM INBOX LEDGER SUBMISSIONS</span>
                  <h2 className="font-display text-xl font-light text-white tracking-wider uppercase">CLIENT PROPOSALS</h2>
                </div>

                <div className="flex flex-col gap-4">
                  {proposals.length === 0 ? (
                    <div className="border border-dashed border-white/10 p-12 text-center text-white/30 rounded-lg font-mono text-xs">
                      CRM INBOX CURRENTLY EMPTY &bull; NO SUBMISSIONS RECEIVED
                    </div>
                  ) : (
                    proposals.map(p => (
                      <div 
                        key={p.id}
                        className="border border-white/5 bg-[#0b0b0f] p-5 rounded-lg flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 transition-all duration-300"
                      >
                        {/* Title block */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-white tracking-wider group-hover:text-[#c5a880] transition-colors">
                              {p.fullName}
                            </span>
                            {p.organization && (
                              <span className="font-mono text-[9px] text-[#8c8c9e] uppercase">
                                ({p.organization})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 font-mono text-[9px]">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest uppercase border ${
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

                        {/* Summary specifications */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans text-xs border-b border-white/5 pb-4">
                          <div className="flex flex-col gap-2 font-mono text-[10px]">
                            <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                              <span className="text-white/30 uppercase">REQUESTED SERVICE:</span>
                              <span className="text-white font-semibold uppercase">{p.service}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                              <span className="text-white/30 uppercase">ESTIMATED BUDGET:</span>
                              <span className="text-[#c5a880] font-bold">{p.budget}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                              <span className="text-white/30 uppercase">CONTACT EMAIL:</span>
                              <a href={`mailto:${p.email}`} className="text-[#c5a880] underline hover:text-white transition-colors truncate max-w-[170px]">
                                {p.email}
                              </a>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">PROJECT CONCEPT DETAILS:</span>
                            <p className="text-white/70 leading-relaxed text-xs bg-black/20 p-2.5 border border-white/5 rounded select-text max-h-24 overflow-y-auto scrollbar-thin font-light">
                              {p.details}
                            </p>
                          </div>
                        </div>

                        {/* CRM Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-1.5">
                            {p.fileName && (
                              <span className="text-[#c5a880] flex items-center gap-1.5 bg-[#c5a880]/5 px-2.5 py-1 rounded border border-[#c5a880]/15 text-[9px] font-mono uppercase tracking-wide">
                                <FileText className="w-3.5 h-3.5" />
                                <span>BRIEF ATTACHED: {p.fileName}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 font-mono text-[9px]">
                            {["In-Review", "Approved", "Archived"].map((st) => (
                              <button
                                key={st}
                                onClick={() => {
                                  updateProposalStatus(p.id, st as Proposal["status"]);
                                  addHudLog(`Proposal status transitioned to ${st} for ${p.fullName}`, "success");
                                }}
                                className={`px-2 py-1 border hover:border-white/20 transition-all rounded font-bold tracking-wider text-[8px] cursor-pointer ${
                                  p.status === st 
                                    ? "bg-white/10 border-white/30 text-white font-bold" 
                                    : "border-white/5 text-white/40 hover:bg-white/5"
                                }`}
                              >
                                {st.toUpperCase()}
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                if (confirm(`Remove inquiry proposal from [${p.fullName}] permanently?`)) {
                                  deleteProposal(p.id);
                                  addHudLog(`Deleted CRM proposal from ${p.fullName}`, "warning");
                                }
                              }}
                              className="p-1 border border-white/5 hover:border-red-500/35 rounded text-white/50 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer"
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
      </div>

      {/* ---------------------------------------------------------------------
          MODALS & FLYOUT EDITORS
          --------------------------------------------------------------------- */}
      
      {/* 1. PORTFOLIO WORKS ADD/EDIT MODAL */}
      <AnimatePresence>
        {projectModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none font-sans">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-[#0b0b0f] border border-white/10 rounded-lg w-full max-w-2xl relative shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden"
            >
              <div className="bg-[#121217] px-6 py-4 flex items-center justify-between border-b border-white/5 select-none">
                <span className="font-semibold text-xs tracking-wider text-white uppercase">
                  {projectModal.mode === "edit" ? "UPDATE PROJECT SPECS" : "LOG NEW WORK ENTRY"}
                </span>
                <button 
                  onClick={() => setProjectModal({ isOpen: false, mode: "add" })}
                  className="p-1 border border-white/5 hover:border-white/20 text-white/50 hover:text-white rounded transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleProjectSubmit} className="p-6 flex flex-col gap-4.5 max-h-[500px] overflow-y-auto scrollbar-thin">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Project Title</label>
                    <input 
                      type="text" 
                      value={projForm.title || ""} 
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white uppercase tracking-wider"
                      placeholder="e.g. AURA CONFIGURATOR"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Primary Category Label</label>
                    <input 
                      type="text" 
                      value={projForm.category || ""} 
                      onChange={(e) => setProjForm({ ...projForm, category: e.target.value })} 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                      placeholder="e.g. CGI & Cinematic Visuals"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Promotional Tagline teaser</label>
                  <input 
                    type="text" 
                    value={projForm.tagline || ""} 
                    onChange={(e) => setProjForm({ ...projForm, tagline: e.target.value })} 
                    className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                    placeholder="e.g. Relentless physics CGI automotive showcase brief."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Cinematic Detailed Description</label>
                  <textarea 
                    value={projForm.description || ""} 
                    onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} 
                    rows={3}
                    className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white/80 leading-relaxed font-sans font-light"
                    placeholder="Detailed paragraph explaining creative methodologies..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Tailwind BG Gradient classes</label>
                    <input 
                      type="text" 
                      value={projForm.bgGradient || ""} 
                      onChange={(e) => setProjForm({ ...projForm, bgGradient: e.target.value })} 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                      placeholder="from-slate-900 via-sky-950 to-[#050507]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Project Year / Timeline</label>
                    <input 
                      type="text" 
                      value={projForm.year || "2026"} 
                      onChange={(e) => setProjForm({ ...projForm, year: e.target.value })} 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                      placeholder="2026"
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Spec sheets */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase mb-1">PROJECT CREDENTIALS</span>
                    
                    <input 
                      type="text" 
                      value={projForm.details?.client || ""} 
                      onChange={(e) => setProjForm({ ...projForm, details: { ...projForm.details!, client: e.target.value } })}
                      placeholder="Client (e.g. Leica Camera)" 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                    />
                    <input 
                      type="text" 
                      value={projForm.details?.timeline || ""} 
                      onChange={(e) => setProjForm({ ...projForm, details: { ...projForm.details!, timeline: e.target.value } })}
                      placeholder="Timeline (e.g. Q1 2026)" 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                    />
                    <input 
                      type="text" 
                      value={projForm.details?.role || ""} 
                      onChange={(e) => setProjForm({ ...projForm, details: { ...projForm.details!, role: e.target.value } })}
                      placeholder="Role (e.g. Creative Direction)" 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                    />
                    <input 
                      type="text" 
                      value={projForm.details?.engine || ""} 
                      onChange={(e) => setProjForm({ ...projForm, details: { ...projForm.details!, engine: e.target.value } })}
                      placeholder="Graphics Engine (e.g. GLSL / Unity)" 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                    />
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase mb-1">SPECIFICATION METRICS</span>
                    
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
                          className="bg-black/45 border border-white/10 rounded-md py-1.5 px-2.5 focus:border-[#c5a880]/50 outline-none text-[10px] text-white"
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
                          className="bg-black/45 border border-white/10 rounded-md py-1.5 px-2.5 focus:border-[#c5a880]/50 outline-none text-[10px] text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex gap-3 justify-end select-none">
                  <button
                    type="button"
                    onClick={() => setProjectModal({ isOpen: false, mode: "add" })}
                    className="py-2 px-4 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded text-xs font-semibold uppercase transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-[#c5a880] hover:bg-white text-black font-semibold rounded text-xs uppercase transition-colors cursor-pointer"
                  >
                    SAVE PROJECT STATE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. FEEDBACK / TESTIMONIAL REVIEW MODAL */}
      <AnimatePresence>
        {testimonialModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none font-sans">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-[#0b0b0f] border border-white/10 rounded-lg w-full max-w-md relative shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden"
            >
              <div className="bg-[#121217] px-6 py-4 flex items-center justify-between border-b border-white/5">
                <span className="font-semibold text-xs tracking-wider text-white uppercase">
                  {testimonialModal.mode === "edit" ? "UPDATE ADVOCATE TESTIMONY" : "LOG NEW CLIENT TESTIMONY"}
                </span>
                <button 
                  onClick={() => setTestimonialModal({ isOpen: false, mode: "add" })}
                  className="p-1 border border-white/5 hover:border-white/20 text-white/50 hover:text-white rounded transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleTestimonialSubmit} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Author / Signature</label>
                  <input 
                    type="text" 
                    value={testiForm.author || ""} 
                    onChange={(e) => setTestiForm({ ...testiForm, author: e.target.value })} 
                    className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white uppercase tracking-wider"
                    placeholder="e.g. MARCUS VANE"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Role Signature</label>
                    <input 
                      type="text" 
                      value={testiForm.role || ""} 
                      onChange={(e) => setTestiForm({ ...testiForm, role: e.target.value })} 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                      placeholder="e.g. VP OF BRAND DEVELOPMENT"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Company Signature</label>
                    <input 
                      type="text" 
                      value={testiForm.company || ""} 
                      onChange={(e) => setTestiForm({ ...testiForm, company: e.target.value })} 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                      placeholder="e.g. LEICA CAMERA DESIGN"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Advocate Review Quote</label>
                  <textarea 
                    value={testiForm.quote || ""} 
                    onChange={(e) => setTestiForm({ ...testiForm, quote: e.target.value })} 
                    rows={4}
                    className="bg-black/45 border border-white/10 rounded-md py-2.5 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white/80 leading-relaxed font-sans font-light"
                    placeholder="Write client testimonial quote copy here..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Advocate rating score (1-5)</label>
                    <input 
                      type="number" 
                      min={1}
                      max={5}
                      value={testiForm.rating || 5} 
                      onChange={(e) => setTestiForm({ ...testiForm, rating: parseInt(e.target.value) || 5 })} 
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 justify-center">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase mb-1">Visibility Resonance</label>
                    <label className="flex items-center gap-2.5 text-xs text-white/60 select-none cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={testiForm.isActive !== undefined ? testiForm.isActive : true}
                        onChange={(e) => setTestiForm({ ...testiForm, isActive: e.target.checked })}
                        className="w-4 h-4 bg-black border border-white/10 rounded text-[#c5a880] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span>Active on Website</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex gap-3 justify-end select-none">
                  <button
                    type="button"
                    onClick={() => setTestimonialModal({ isOpen: false, mode: "add" })}
                    className="py-2 px-4 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded text-xs font-semibold uppercase transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-[#c5a880] hover:bg-white text-black font-semibold rounded text-xs uppercase transition-colors cursor-pointer"
                  >
                    SAVE FEEDBACK STATE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CAPABILITY / SERVICE EDIT FLYOUT PANEL (Drawer) */}
      <AnimatePresence>
        {serviceEditor && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm select-none font-sans">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="bg-[#0b0b0f] border-l border-white/10 h-full w-full max-w-md relative shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col justify-between"
            >
              <div className="bg-[#121217] px-6 py-4 flex items-center justify-between border-b border-white/5 select-none">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-white/30">{serviceEditor.id}</span>
                  <span className="font-semibold text-xs tracking-wider text-white uppercase">
                    EDIT SERVICE: {serviceEditor.title}
                  </span>
                </div>
                <button 
                  onClick={() => setServiceEditor(null)}
                  className="p-1 border border-white/5 hover:border-white/20 text-white/50 hover:text-white rounded transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer scrollable content */}
              <div className="flex-1 p-6 flex flex-col gap-4.5 overflow-y-auto scrollbar-thin select-none">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Capabilities Title</label>
                  <input 
                    type="text" 
                    value={serviceEditor.title || ""} 
                    onChange={(e) => setServiceEditor({ ...serviceEditor, title: e.target.value })} 
                    className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white uppercase tracking-wider font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Interactive Description</label>
                  <textarea 
                    value={serviceEditor.description || ""} 
                    onChange={(e) => setServiceEditor({ ...serviceEditor, description: e.target.value })} 
                    rows={4}
                    className="bg-black/45 border border-white/10 rounded-md py-2.5 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white/80 leading-relaxed font-sans font-light"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Visual Subtitle Header</label>
                  <input 
                    type="text" 
                    value={serviceEditor.hudTitle || ""} 
                    onChange={(e) => setServiceEditor({ ...serviceEditor, hudTitle: e.target.value })} 
                    className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white uppercase tracking-wide"
                  />
                </div>

                {/* Specs specs listing */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase mb-1">HUD GRID SPEC DETAILS (4 items)</span>
                  
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
                        className="bg-black/45 border border-white/10 rounded-md py-1.5 px-2.5 focus:border-[#c5a880]/50 outline-none text-[10px] text-white"
                      />
                      <input 
                        type="text" 
                        value={item.value || ""} 
                        onChange={(e) => {
                          const newItems = [...serviceEditor.hudItems];
                          newItems[idx] = { ...newItems[idx], value: e.target.value };
                          setServiceEditor({ ...serviceEditor, hudItems: newItems });
                        }}
                        className="bg-black/45 border border-white/10 rounded-md py-1.5 px-2.5 focus:border-[#c5a880]/50 outline-none text-[10px] text-white"
                      />
                    </div>
                  ))}
                </div>

                {/* Bullets lists */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase mb-1">Canvas bullets detail tags (3 items)</span>
                  
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
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 focus:border-[#c5a880]/50 focus:ring-1 focus:ring-[#c5a880]/15 outline-none text-xs text-white"
                      placeholder={`Bullet description ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Submit footer */}
              <div className="bg-[#121217] p-5 border-t border-white/5 flex gap-3 select-none">
                <button
                  onClick={() => setServiceEditor(null)}
                  className="flex-1 text-center py-2.5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded text-xs font-semibold uppercase transition-colors cursor-pointer"
                >
                  DISMISS
                </button>
                <button
                  onClick={() => {
                    updateService(serviceEditor.id, serviceEditor);
                    addHudLog(`Service capability updated: "${serviceEditor.title}"`, "success");
                    setServiceEditor(null);
                  }}
                  className="flex-1 text-center py-2.5 bg-[#c5a880] hover:bg-white text-black font-semibold rounded text-xs uppercase transition-colors cursor-pointer"
                >
                  SAVE CAPABILITY
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
