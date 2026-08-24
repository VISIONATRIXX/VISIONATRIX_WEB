"use client";

import { useState, useEffect, useRef } from "react";
import { useAdmin, Project, ServiceItem, Testimonial, Proposal } from "@/context/AdminContext";
import { supabase } from "@/utils/supabase";
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
  Globe,
  Star,
  ChevronRight,
  Clock,
  UserCheck,
  Upload
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
  const [projectActiveTab, setProjectActiveTab] = useState<"general" | "media" | "specs">("general");
  const [projectFormMode, setProjectFormMode] = useState<"basic" | "advanced">("basic");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [testimonialModal, setTestimonialModal] = useState<{ isOpen: boolean; mode: "add" | "edit"; data?: Testimonial }>({ isOpen: false, mode: "add" });
  const [serviceEditor, setServiceEditor] = useState<ServiceItem | null>(null);

  const [customTagInput, setCustomTagInput] = useState("");
  const [localTags, setLocalTags] = useState<string[]>([]);

  // Quick Upload Streamlined Workflow State
  const [quickUploadOpen, setQuickUploadOpen] = useState(false);
  const [quickContentType, setQuickContentType] = useState<"project" | "review">("project");
  const [quickTitle, setQuickTitle] = useState("");
  const [quickCategory, setQuickCategory] = useState("");
  const [quickDescription, setQuickDescription] = useState("");
  const [quickMediaUrl, setQuickMediaUrl] = useState("");
  const [isQuickUploadingMedia, setIsQuickUploadingMedia] = useState(false);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState("");

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
    details: { client: "", timeline: "", role: "", engine: "", videoUrl: "" },
    metrics: [{ label: "", value: "" }, { label: "", value: "" }, { label: "", value: "" }]
  });

  const openProjectModal = (mode: "add" | "edit", data?: Project) => {
    setProjectActiveTab("general");
    setProjectFormMode("basic");
    setLocalTags([]);
    setCustomTagInput("");
    setUploadError("");
    
    const existingCats = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
    if (mode === "edit" && data) {
      const isCustom = !existingCats.includes(data.category);
      setIsCustomCategory(isCustom);
      setProjForm({ 
        ...data,
        details: {
          client: data.details?.client || "",
          timeline: data.details?.timeline || "",
          role: data.details?.role || "",
          engine: data.details?.engine || "",
          videoUrl: data.details?.videoUrl || "",
          images: data.details?.images || []
        }
      });
    } else {
      setIsCustomCategory(false);
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
        details: { client: "", timeline: "", role: "", engine: "", videoUrl: "", images: [] },
        metrics: [
          { label: "RESOLUTION", value: "8K Projections" },
          { label: "RENDER ENGINE", value: "Octane / WebGL" },
          { label: "DYNAMICS", value: "Realtime Physics" }
        ]
      });
    }
    setProjectModal({ isOpen: true, mode, data });
  };

  const handleAddCustomTag = () => {
    const formattedTag = customTagInput.trim().toUpperCase();
    if (formattedTag) {
      if (!localTags.includes(formattedTag)) {
        setLocalTags(prev => [...prev, formattedTag]);
      }
      const current = projForm.categories || [];
      if (!current.includes(formattedTag)) {
        setProjForm(prev => ({ ...prev, categories: [...(prev.categories || []), formattedTag] }));
      }
      setCustomTagInput("");
      addHudLog(`Registered custom section tag: "${formattedTag}"`, "info");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    if (type === "image") {
      setIsUploadingImage(true);
    } else {
      setIsUploadingVideo(true);
    }

    try {
      const fileExt = file.name.split(".").pop();
      const baseName = file.name.substring(0, file.name.lastIndexOf(".")).replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `${Date.now()}_${baseName}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      
      if (!data?.publicUrl) {
        throw new Error("Failed to retrieve public URL from storage.");
      }

      if (type === "image") {
        setProjForm(prev => ({ ...prev, image: data.publicUrl }));
        addHudLog(`Uploaded project image: "${file.name}"`, "success");
      } else {
        setProjForm(prev => ({
          ...prev,
          details: {
            client: prev.details?.client || "",
            timeline: prev.details?.timeline || "",
            role: prev.details?.role || "",
            engine: prev.details?.engine || "",
            videoUrl: data.publicUrl
          }
        }));
        addHudLog(`Uploaded project video: "${file.name}"`, "success");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      const errMsg = err.message || "Upload process failed.";
      setUploadError(errMsg);
      addHudLog(`File upload failed: ${errMsg}`, "error");
    } finally {
      if (type === "image") {
        setIsUploadingImage(false);
      } else {
        setIsUploadingVideo(false);
      }
      // Reset input element value so same file can be re-selected if needed
      e.target.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError("");
    setIsUploadingGallery(true);
    addHudLog(`Uploading ${files.length} gallery image(s)...`, "info");

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const baseName = file.name.substring(0, file.name.lastIndexOf(".")).replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `${Date.now()}_gallery_${i}_${baseName}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }

      setProjForm(prev => {
        const prevImages = prev.details?.images || [];
        return {
          ...prev,
          details: {
            client: prev.details?.client || "",
            timeline: prev.details?.timeline || "",
            role: prev.details?.role || "",
            engine: prev.details?.engine || "",
            videoUrl: prev.details?.videoUrl || null,
            images: [...prevImages, ...uploadedUrls]
          }
        };
      });

      addHudLog(`Uploaded ${uploadedUrls.length} gallery image(s) successfully!`, "success");
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      const errMsg = err.message || "Upload process failed.";
      setUploadError(errMsg);
      addHudLog(`Gallery upload failed: ${errMsg}`, "error");
    } finally {
      setIsUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleQuickUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle) {
      alert("Please provide a title or name for your content.");
      return;
    }

    if (quickContentType === "project") {
      addProject({
        title: quickTitle.toUpperCase(),
        category: quickCategory || "CGI & WEB",
        categories: [quickCategory || "CGI"],
        tagline: quickDescription || quickTitle,
        description: quickDescription || quickTitle,
        image: quickMediaUrl || "/work_aura_configurator.png",
        subtitle: `${quickTitle.toUpperCase()} Spec`,
        year: "2026",
        bgGradient: "from-slate-900 via-sky-950 to-[#050507]",
        details: {
          client: "Visionatrix Studio",
          timeline: "2026",
          role: "Digital Production",
          engine: "Realtime Engine / WebGL",
          videoUrl: quickMediaUrl.endsWith(".mp4") || quickMediaUrl.includes("video") ? quickMediaUrl : null
        },
        metrics: [
          { label: "RESOLUTION", value: "8K Projections" },
          { label: "ENGINE", value: "Realtime WebGL" },
          { label: "STATUS", value: "Published" }
        ]
      });
      addHudLog(`Quick Published Project: "${quickTitle.toUpperCase()}"`, "success");
    } else if (quickContentType === "review") {
      addTestimonial({
        quote: quickDescription || "Outstanding visual quality and execution.",
        author: quickTitle.toUpperCase(),
        role: quickCategory || "Executive Director",
        company: "Studio Client",
        rating: 5,
        isActive: true
      });
      addHudLog(`Quick Registered Review from ${quickTitle.toUpperCase()}`, "success");
    }

    // Reset state & close modal
    setQuickTitle("");
    setQuickCategory("");
    setQuickDescription("");
    setQuickMediaUrl("");
    setQuickUploadOpen(false);
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setProjForm(prev => {
      const prevImages = prev.details?.images || [];
      const updated = prevImages.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        details: {
          client: prev.details?.client || "",
          timeline: prev.details?.timeline || "",
          role: prev.details?.role || "",
          engine: prev.details?.engine || "",
          videoUrl: prev.details?.videoUrl || null,
          images: updated
        }
      };
    });
    addHudLog("Removed gallery image preview", "info");
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.title || !projForm.category) {
      alert("Please fill in the required fields: Title & Category");
      return;
    }

    const defaultMetrics = [
      { label: "FPS METRICS", value: "90 FPS Locked" },
      { label: "RENDER ENGINE", value: "WebGL / Octane" },
      { label: "DYNAMICS", value: "Realtime Physics" }
    ];

    const finalMetrics = projForm.metrics && projForm.metrics.length > 0 && projForm.metrics.some(m => m.label || m.value)
      ? projForm.metrics.map(m => ({
          label: (m.label || "SPEC").toUpperCase(),
          value: m.value || "Dynamic"
        }))
      : defaultMetrics;

    const payload: Omit<Project, "id"> = {
      title: projForm.title.toUpperCase(),
      category: projForm.category,
      categories: projForm.categories || ["CGI"],
      tagline: projForm.tagline || "",
      description: projForm.description || projForm.tagline || "",
      image: projForm.image || "/work_aura_configurator.png",
      subtitle: projForm.subtitle || `${projForm.title.toUpperCase()} Spec`,
      year: projForm.year || "2026",
      bgGradient: projForm.bgGradient || "from-slate-900 via-sky-950 to-[#050507]",
      details: {
        client: projForm.details?.client || "Visionatrix Studio",
        timeline: projForm.details?.timeline || projForm.year || "2026",
        role: projForm.details?.role || "Digital Production",
        engine: projForm.details?.engine || "Realtime WebGL / Octane",
        videoUrl: projForm.details?.videoUrl || null,
        images: projForm.details?.images || []
      },
      metrics: finalMetrics
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

        {/* Quick Upload Content Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuickUploadOpen(true)}
            className="flex items-center gap-2 font-sans text-xs tracking-wider text-black font-semibold bg-[#c5a880] hover:bg-white px-3.5 py-1.5 rounded transition-all duration-300 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(197,168,128,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">QUICK UPLOAD CONTENT</span>
            <span className="sm:hidden">UPLOAD</span>
          </button>

          {/* Log out action */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-sans text-[10px] tracking-wider text-white/60 hover:text-red-400 border border-white/5 hover:border-red-500/20 px-3 py-1.5 rounded transition-all hover:bg-red-950/10 active:scale-95 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
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
                    {projects.map((p, index) => (
                      <div 
                        key={`admin-proj-${p.id || index}-${index}`}
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
          ---------------------------------------------------------------------      {/* 1. PORTFOLIO WORKS ADD/EDIT MODAL */}
      <AnimatePresence>
        {projectModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none font-sans">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-[#0b0b0f] border border-[#c5a880]/30 rounded-xl w-full max-w-2xl relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-[#121217] px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-[#c5a880]" />
                  <span className="font-semibold text-xs tracking-wider text-white uppercase">
                    {projectModal.mode === "edit" ? "EDIT PROJECT SPECS" : "ADD NEW SHOWCASE PROJECT"}
                  </span>
                </div>
                <button 
                  onClick={() => setProjectModal({ isOpen: false, mode: "add" })}
                  className="p-1 border border-white/5 hover:border-white/20 text-white/50 hover:text-white rounded transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleProjectSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto scrollbar-thin flex-1">
                
                {/* Live Website Project Notice & Mode Toggle */}
                <div className="bg-[#12121a] border border-[#c5a880]/40 p-4 rounded-xl flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#c5a880] tracking-widest uppercase font-bold flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
                      LIVE HOSTED WEBSITE SHOWCASE
                    </span>
                    <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-full font-bold">
                      SAFARI SANDBOX READY
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/70 tracking-wider uppercase font-bold">
                      LIVE WEBSITE URL * (e.g. https://www.billingos.online/ or https://aravallinews.com)
                    </label>
                    <input 
                      type="url" 
                      value={projForm.details?.liveUrl || ""} 
                      onChange={(e) => setProjForm({ ...projForm, details: { ...projForm.details!, liveUrl: e.target.value } })} 
                      className="bg-black/80 border border-[#c5a880]/50 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880] rounded-lg py-2.5 px-3.5 outline-none text-xs text-white font-mono font-bold"
                      placeholder="https://www.billingos.online/"
                    />
                  </div>

                  <p className="text-[10px] text-white/50 leading-relaxed font-sans italic">
                    💡 Entering a live URL automatically renders a real-time website homepage screenshot card on your agency portfolio, and launches the Apple macOS Safari Sandbox Studio when clicked!
                  </p>
                </div>

                {/* 1. Title, Year & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-[#c5a880] tracking-wider uppercase font-bold">
                      PROJECT TITLE *
                    </label>
                    <input 
                      type="text" 
                      value={projForm.title || ""} 
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} 
                      className="bg-black/50 border border-white/10 rounded-lg py-2.5 px-3.5 focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 outline-none text-xs text-white uppercase tracking-wider font-semibold"
                      placeholder="e.g. BILLING-OS"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
                      YEAR
                    </label>
                    <input 
                      type="text" 
                      value={projForm.year || "2026"} 
                      onChange={(e) => setProjForm({ ...projForm, year: e.target.value })} 
                      className="bg-black/50 border border-white/10 rounded-lg py-2.5 px-3.5 focus:border-[#c5a880] outline-none text-xs text-white"
                      placeholder="2026"
                      required
                    />
                  </div>
                </div>

                {/* Primary Category Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-[#c5a880] tracking-wider uppercase font-bold">
                    PRIMARY CATEGORY *
                  </label>
                  {isCustomCategory ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={projForm.category || ""} 
                        onChange={(e) => setProjForm({ ...projForm, category: e.target.value })} 
                        className="flex-1 bg-black/50 border border-white/10 rounded-lg py-2.5 px-3.5 focus:border-[#c5a880] outline-none text-xs text-white"
                        placeholder="e.g. Restaurant POS / SaaS"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomCategory(false)}
                        className="px-3.5 py-2 border border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-lg text-xs font-mono transition-all uppercase cursor-pointer shrink-0"
                      >
                        SELECT LIST
                      </button>
                    </div>
                  ) : (
                    <select
                      value={projForm.category || ""}
                      onChange={(e) => {
                        if (e.target.value === "CREATE_NEW_CATEGORY") {
                          setIsCustomCategory(true);
                          setProjForm(prev => ({ ...prev, category: "" }));
                        } else {
                          setProjForm(prev => ({ ...prev, category: e.target.value }));
                        }
                      }}
                      className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-3.5 focus:border-[#c5a880] outline-none text-xs text-white cursor-pointer"
                      required
                    >
                      <option value="" disabled className="text-white/30">SELECT CATEGORY</option>
                      {Array.from(new Set(["WEB DEV", "SAAS", "POS SYSTEM", "CGI", "VFX", "AI SHOOTS", "VR", ...projects.map(p => p.category).filter(Boolean)])).map(cat => (
                        <option key={cat} value={cat} className="bg-[#0b0b0f] text-white">{cat}</option>
                      ))}
                      <option value="CREATE_NEW_CATEGORY" className="bg-[#0b0b0f] text-[#c5a880] font-semibold">+ CREATE NEW CATEGORY...</option>
                    </select>
                  )}
                </div>

                {/* Category Tag Pills (e.g. SaaS, POS System, Fullstack) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/50 tracking-wider uppercase font-bold">
                    CARD CATEGORY TAG PILLS (COMMA SEPARATED, e.g. SaaS, POS System, Fullstack)
                  </label>
                  <input 
                    type="text" 
                    value={(projForm.categories || []).join(", ")} 
                    onChange={(e) => {
                      const tags = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                      setProjForm({ ...projForm, categories: tags });
                    }} 
                    className="bg-black/50 border border-white/10 rounded-lg py-2.5 px-3.5 focus:border-[#c5a880] outline-none text-xs text-white font-mono"
                    placeholder="SaaS, POS System, Fullstack"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
                    PROJECT OVERVIEW / DESCRIPTION *
                  </label>
                  <textarea 
                    value={projForm.tagline || ""} 
                    onChange={(e) => setProjForm({ ...projForm, tagline: e.target.value, description: e.target.value })} 
                    rows={3}
                    className="bg-black/50 border border-white/10 rounded-lg p-3.5 focus:border-[#c5a880] outline-none text-xs text-white/80 leading-relaxed font-sans font-light resize-none"
                    placeholder="Brief description explaining client goals, visual execution, and technology stack used..."
                    required
                  />
                </div>

                {/* 2. Unified Cover Media Asset Uploader */}
                <div className="bg-[#121217] border border-white/10 p-4.5 rounded-xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-[#c5a880] tracking-widest uppercase font-bold flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                      COVER MEDIA ASSET (IMAGE / VIDEO)
                    </label>
                    {projForm.image && (
                      <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40">
                        <Check className="w-2.5 h-2.5" /> ASSET READY
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Image / Video File Upload Button */}
                    <label className="flex items-center justify-center gap-2 py-3 px-4 bg-[#c5a880]/15 border border-[#c5a880]/30 hover:bg-[#c5a880]/25 hover:border-[#c5a880]/60 text-[#c5a880] hover:text-white rounded-lg text-xs font-mono font-bold transition-all duration-200 cursor-pointer active:scale-95">
                      {isUploadingImage ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{isUploadingImage ? "UPLOADING FILE..." : "CHOOSE IMAGE FILE"}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, "image")}
                        disabled={isUploadingImage}
                      />
                    </label>

                    {/* Video File Upload Button */}
                    <label className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-lg text-xs font-mono font-bold transition-all duration-200 cursor-pointer active:scale-95">
                      {isUploadingVideo ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#c5a880]" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{isUploadingVideo ? "UPLOADING VIDEO..." : "CHOOSE MP4 VIDEO"}</span>
                      <input 
                        type="file" 
                        accept="video/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, "video")}
                        disabled={isUploadingVideo}
                      />
                    </label>
                  </div>

                  {/* Direct Media Link Input */}
                  <input 
                    type="text" 
                    value={projForm.image || ""} 
                    onChange={(e) => setProjForm({ ...projForm, image: e.target.value })} 
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 focus:border-[#c5a880] outline-none text-xs text-white/70 font-mono"
                    placeholder="Or paste media URL (e.g. /work_aura_configurator.png or https://...)"
                    required
                  />

                  {/* Instant Media Live Preview */}
                  <div className="border border-white/10 bg-black rounded-lg h-36 flex items-center justify-center overflow-hidden relative">
                    {projForm.details?.videoUrl ? (
                      <video 
                        src={projForm.details.videoUrl} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                      />
                    ) : projForm.image ? (
                      <img 
                        src={projForm.image} 
                        alt="Cover Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop";
                        }}
                      />
                    ) : (
                      <span className="text-[10px] font-mono text-white/20">NO MEDIA SELECTED YET</span>
                    )}
                  </div>
                </div>

                {/* 3. Filter Tags Selector */}
                <div className="bg-[#121217] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                  <label className="text-[9px] font-mono text-white/40 tracking-widest uppercase">
                    SHOWCASE FILTER TAGS (CLICK TO TOGGLE)
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1 select-none">
                    {Array.from(new Set([
                      "VIDEO", "VFX", "CGI", "WEB DEV", "APPS", "AI SHOOTS", "VR",
                      ...projects.flatMap(p => p.categories || []).map(t => t.toUpperCase()),
                      ...localTags
                    ])).map((tag) => {
                      const selected = (projForm.categories || []).includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const current = projForm.categories || [];
                            const updated = current.includes(tag)
                              ? current.filter(t => t !== tag)
                              : [...current, tag];
                            setProjForm({ ...projForm, categories: updated });
                          }}
                          className={`px-3 py-1 rounded-full border text-[9px] font-mono tracking-wider font-bold transition-all duration-200 active:scale-95 cursor-pointer uppercase ${
                            selected 
                              ? "bg-[#c5a880]/20 border-[#c5a880] text-white shadow-[0_0_12px_rgba(197,168,128,0.2)]" 
                              : "border-white/10 bg-black/40 text-white/35 hover:text-white/70 hover:border-white/20"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="border-t border-white/10 pt-4 flex gap-3 justify-end select-none shrink-0 mt-2">
                  <button
                    type="button"
                    onClick={() => setProjectModal({ isOpen: false, mode: "add" })}
                    className="py-2.5 px-5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#c5a880] hover:bg-white text-black font-bold rounded-lg text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(197,168,128,0.3)]"
                  >
                    {projectModal.mode === "edit" ? "UPDATE PROJECT" : "SAVE & PUBLISH PROJECT"}
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

      {/* 4. QUICK CONTENT UPLOAD STREAMLINED MODAL */}
      <AnimatePresence>
        {quickUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b0f] border border-[#c5a880]/30 rounded-xl w-full max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden relative"
            >
              {/* Header */}
              <div className="bg-[#121217] px-6 py-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#c5a880]" />
                  <span className="font-semibold text-xs tracking-wider text-white uppercase">
                    QUICK CONTENT UPLOADER
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickUploadOpen(false)}
                  className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleQuickUploadSubmit} className="p-6 flex flex-col gap-4">
                
                {/* Content Type Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-[#c5a880] tracking-wider uppercase font-bold">
                    1. SELECT CONTENT TYPE
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickContentType("project")}
                      className={`p-3 border rounded-lg flex items-center gap-2.5 text-xs font-semibold uppercase transition-all cursor-pointer ${
                        quickContentType === "project"
                          ? "bg-[#c5a880]/15 border-[#c5a880] text-[#c5a880]"
                          : "bg-black/30 border-white/10 text-white/50 hover:border-white/20"
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Portfolio Project</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickContentType("review")}
                      className={`p-3 border rounded-lg flex items-center gap-2.5 text-xs font-semibold uppercase transition-all cursor-pointer ${
                        quickContentType === "review"
                          ? "bg-[#c5a880]/15 border-[#c5a880] text-[#c5a880]"
                          : "bg-black/30 border-white/10 text-white/50 hover:border-white/20"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Client Review</span>
                    </button>
                  </div>
                </div>

                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
                      {quickContentType === "project" ? "Project Title *" : "Author / Client Name *"}
                    </label>
                    <input
                      type="text"
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      placeholder={quickContentType === "project" ? "e.g. AURA CONFIGURATOR" : "e.g. MARCUS VANCE"}
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 text-xs text-white uppercase focus:border-[#c5a880]/50 outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
                      {quickContentType === "project" ? "Category" : "Role & Company"}
                    </label>
                    <input
                      type="text"
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value)}
                      placeholder={quickContentType === "project" ? "e.g. CGI & WebGL" : "e.g. Design Lead // Leica"}
                      className="bg-black/45 border border-white/10 rounded-md py-2 px-3 text-xs text-white focus:border-[#c5a880]/50 outline-none"
                    />
                  </div>
                </div>

                {/* Direct File Upload or Image/Video URL */}
                {quickContentType === "project" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
                      Media Asset (Upload File or Paste URL)
                    </label>
                    
                    <div className="flex items-center gap-2">
                      <label className="flex-1 bg-black/45 border border-dashed border-[#c5a880]/30 hover:border-[#c5a880] rounded-md py-3 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-[#c5a880]" />
                        <span className="text-xs text-[#c5a880] font-mono">
                          {isQuickUploadingMedia ? "Uploading Media..." : "Choose Image/Video File"}
                        </span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setIsQuickUploadingMedia(true);
                            try {
                              const fileExt = file.name.split(".").pop();
                              const fileName = `${Date.now()}_quick_${file.name.replace(/[^a-zA-Z0-9]/g, "_")}.${fileExt}`;
                              const filePath = `uploads/${fileName}`;
                              const { error: upErr } = await supabase.storage.from("portfolio").upload(filePath, file);
                              if (upErr) throw upErr;
                              const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
                              if (data?.publicUrl) {
                                setQuickMediaUrl(data.publicUrl);
                                addHudLog(`Quick uploaded media: ${file.name}`, "success");
                              }
                            } catch (err: any) {
                              alert("Upload failed: " + err.message);
                            } finally {
                              setIsQuickUploadingMedia(false);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <input
                      type="text"
                      value={quickMediaUrl}
                      onChange={(e) => setQuickMediaUrl(e.target.value)}
                      placeholder="Or paste media URL (https://...)"
                      className="bg-black/30 border border-white/5 rounded-md py-1.5 px-3 text-[10px] text-white/60 font-mono outline-none"
                    />

                    {quickMediaUrl && (
                      <div className="mt-1 relative w-full h-24 rounded-md overflow-hidden border border-[#c5a880]/30 bg-black flex items-center justify-center">
                        {quickMediaUrl.endsWith(".mp4") || quickMediaUrl.includes("video") ? (
                          <video src={quickMediaUrl} className="w-full h-full object-cover" autoPlay loop muted />
                        ) : (
                          <img src={quickMediaUrl} alt="Preview" className="w-full h-full object-cover" />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Description or Quote */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
                    {quickContentType === "project" ? "Description / Summary" : "Review Quote *"}
                  </label>
                  <textarea
                    rows={3}
                    value={quickDescription}
                    onChange={(e) => setQuickDescription(e.target.value)}
                    placeholder={quickContentType === "project" ? "Short overview of the project..." : "Enter client testimonial quote..."}
                    className="bg-black/45 border border-white/10 rounded-md p-3 text-xs text-white outline-none focus:border-[#c5a880]/50"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isQuickUploadingMedia}
                  className="w-full mt-2 bg-[#c5a880] hover:bg-white text-black font-bold py-3 rounded-md text-xs uppercase tracking-widest transition-all duration-300 active:scale-98 cursor-pointer shadow-[0_0_15px_rgba(197,168,128,0.3)] disabled:opacity-50"
                >
                  {isQuickUploadingMedia ? "UPLOADING ASSETS..." : "PUBLISH CONTENT NOW"}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
