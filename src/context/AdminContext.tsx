"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

// -------------------------------------------------------------
// Interfaces
// -------------------------------------------------------------
export interface Project {
  id: string;
  title: string;
  category: string;
  categories: string[];
  tagline: string;
  description: string;
  image: string;
  subtitle: string;
  year: string;
  bgGradient: string;
  details: {
    client: string;
    timeline: string;
    role: string;
    engine: string;
    videoUrl?: string | null;
    images?: string[] | null;
    liveUrl?: string | null;
  };
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // e.g. "Film", "Sparkles", "Box", "Layers", "Cpu", "Smartphone", "ScanFace", "Eye"
  hudTitle: string;
  hudItems: { label: string; value: string }[];
  bullets: string[];
  tools: string[];
  canvasType: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  isActive: boolean;
}

export interface Proposal {
  id: string;
  fullName: string;
  email: string;
  organization: string;
  service: string;
  details: string;
  budget: string;
  fileName?: string | null;
  timestamp: string;
  status: "Pending" | "In-Review" | "Approved" | "Archived";
}

interface AdminContextType {
  projects: Project[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  proposals: Proposal[];
  isLoaded: boolean;
  
  // Projects CRUD
  addProject: (p: Omit<Project, "id">) => void;
  updateProject: (id: string, p: Project) => void;
  deleteProject: (id: string) => void;
  
  // Services CRUD
  updateService: (id: string, s: ServiceItem) => void;
  
  // Testimonials CRUD
  addTestimonial: (t: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: string, t: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  
  // Proposals CRM CRUD
  addProposal: (p: Omit<Proposal, "id" | "timestamp" | "status"> & { fileName?: string | null }) => void;
  updateProposalStatus: (id: string, status: Proposal["status"]) => void;
  deleteProposal: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// -------------------------------------------------------------
// Pre-loaded Datasets
// -------------------------------------------------------------
const initialProjects: Project[] = [
  {
    id: "01",
    title: "AETHERIA INTERACTIVE",
    category: "WebGL & Creative Tech",
    categories: ["WEB DEV", "VFX", "CGI"],
    subtitle: "01 / AETHERIA METAVERSE",
    year: "2026",
    image: "/work_aura_configurator.webp",
    tagline: "Engineering physically accurate WebGL simulations and fluid dynamics rendering at 90 FPS.",
    description: "An interactive real-time spatial portal built for Aetheria. Simulates gravity fields, aerodynamic drag, and complex raytraced light-refractions directly in standard browser environments.",
    bgGradient: "from-slate-900 via-sky-950 to-[#050507]",
    details: {
      role: "Creative Developer",
      client: "Aetheria Studio",
      engine: "Three.js / WebGL / React Fiber",
      timeline: "Q1 2026",
      videoUrl: null
    },
    metrics: [
      { label: "FPS METRICS", value: "90 FPS Locked" },
      { label: "LIGHT SAMPLES", value: "2048 Samples" },
      { label: "INTERACTION LATENCY", value: "< 8ms" }
    ]
  },
  {
    id: "02",
    title: "LUMINA CINEMATIC",
    category: "VFX & Automotive CGI",
    categories: ["CGI", "VIDEO", "VFX"],
    subtitle: "02 / LUMINA ELECTRIC GT",
    year: "2026",
    image: "/work_omnis_interactive.webp",
    tagline: "Crafting photo-realistic carbon fiber weaves, micro-bezel lighting, and fluid dynamics.",
    description: "A hyper-detailed digital showroom and promotional film showcasing the aerodynamic profiles of Lumina's new electric vehicle. Rendered with custom lighting rigs and simulated dust particles.",
    bgGradient: "from-zinc-900 via-[#1c1212] to-[#050507]",
    details: {
      role: "CGI Director & Simulation Lead",
      client: "Lumina Motors",
      engine: "Octane Render / Houdini / Resolve",
      timeline: "Q2 2026",
      videoUrl: null
    },
    metrics: [
      { label: "RENDER QUALITY", value: "8K Projections" },
      { label: "SIMULATION PARTICLES", value: "3.5 Million" },
      { label: "GRID COMPILATION", value: "120 FPS Capture" }
    ]
  },
  {
    id: "03",
    title: "KINETIC GRID",
    category: "Procedural Spatial Digital Twin",
    categories: ["VR", "CGI", "WEB DEV"],
    subtitle: "03 / TOKYO URBAN PLAN",
    year: "2025",
    image: "/work_aura_configurator.webp",
    tagline: "Procedural mapping interfaces connecting municipal energy signals with real-time WebGL layout grids.",
    description: "A high-frequency digital twin mapping regional power grids and municipal traffic networks. Integrates real-time API telemetry to dynamically color-code traffic loads and grid efficiency.",
    bgGradient: "from-blue-950 via-slate-900 to-[#050507]",
    details: {
      role: "Spatial Systems Architect",
      client: "Tokyo Smart Urban Systems",
      engine: "Unreal Engine 5 / WebGL Maps",
      timeline: "Q4 2025",
      videoUrl: null
    },
    metrics: [
      { label: "MAPPED NODES", value: "45,000 Realtime" },
      { label: "LATENCY TARGET", value: "<12ms Stream" },
      { label: "GEOMETRY COUNT", value: "15 Million Polys" }
    ]
  },
  {
    id: "04",
    title: "HOROLOGIST VR",
    category: "Spatial XR Horology",
    categories: ["VR", "VFX", "APPS"],
    subtitle: "04 / AP HOROLOGY VOLUMETRIC",
    year: "2026",
    image: "/work_omnis_interactive.webp",
    tagline: "Bespoke mechanical timepiece disassembly and interaction simulator built for spatial headsets.",
    description: "An immersive Horology simulation platform that allows watch enthusiasts to inspect and disassemble complex luxury watch movements in high-fidelity volumetric environments.",
    bgGradient: "from-stone-900 via-zinc-950 to-[#050507]",
    details: {
      role: "Lead XR Developer",
      client: "Audemars Piguet Spec",
      engine: "Unity / OpenXR / HDRP",
      timeline: "Q1 2026",
      videoUrl: null
    },
    metrics: [
      { label: "TRACKING ACCURACY", value: "0.1mm Precision" },
      { label: "RENDER RESOLUTION", value: "4K Per Eye" },
      { label: "INTERACTIVE PARTS", value: "180 Components" }
    ]
  },
  {
    id: "05",
    title: "SYNAPSE CREATIVE LAB",
    category: "AI Production & Storyboarding",
    categories: ["AI SHOOTS", "VIDEO"],
    subtitle: "05 / SYNAPSE STORYBOARD",
    year: "2026",
    image: "/work_aura_configurator.webp",
    tagline: "AI-assisted commercial storyboard rendering and neural prompt-engineering workflows.",
    description: "An automated design-delivery studio mapping agency concepts into high-resolution cinematic storyboards without human facial drift or temporal inconsistencies.",
    bgGradient: "from-[#1b1712] via-neutral-900 to-[#050507]",
    details: {
      role: "Prompt Engineer & Workflow Dev",
      client: "Synapse Creative Group",
      engine: "ComfyUI / Stable Diffusion / Flux",
      timeline: "Q2 2026",
      videoUrl: null
    },
    metrics: [
      { label: "GENERATION SPEED", value: "8s / Frame" },
      { label: "UPSCALER NODES", value: "Magnific 4K Custom" },
      { label: "TEMPORAL STABILIZATION", value: "IP-Adapter Lora" }
    ]
  },
  {
    id: "06",
    title: "VORTEX SOUND LAB",
    category: "Acoustic VFX Fluid Simulator",
    categories: ["VFX", "WEB DEV"],
    subtitle: "06 / NYX ACOUSTIC PORTAL",
    year: "2025",
    image: "/work_omnis_interactive.webp",
    tagline: "Generating interactive, sound-responsive WebGL liquid streams representing audio frequencies.",
    description: "An audiovisual exploration portal mapping client audio signals directly into custom GLSL Navier-Stokes fluid equations. Tracks 256 acoustic frequencies for realtime animation.",
    bgGradient: "from-emerald-950 via-slate-950 to-[#050507]",
    details: {
      role: "Fluid Shader Engineer",
      client: "NYX Sound Lab",
      engine: "GLSL / React Three Fiber",
      timeline: "Q3 2025",
      videoUrl: null
    },
    metrics: [
      { label: "AURAL BINS", value: "256 Frequencies" },
      { label: "SIMULATION RESOLUTION", value: "512x512 Grid" },
      { label: "GLSL SAMPLERS", value: "Dynamic Noise" }
    ]
  }
];

const initialServices: ServiceItem[] = [
  {
    id: "01",
    title: "WEB DEVELOPMENT",
    description: "We code modern, responsive, and ultra high-performance websites and digital portals engineered for maximum speed, security, and brand conversion.",
    iconName: "Code",
    hudTitle: "[ FRONTEND CORE ]",
    hudItems: [
      { label: "FRAMEWORK", value: "Next.js / React" },
      { label: "PERFORMANCE", value: "100 Lighthouse" },
      { label: "ANIMATION", value: "GSAP / Framer" },
      { label: "DEPLOY", value: "Vercel Edge" }
    ],
    bullets: [
      "// High-Performance Responsive Web",
      "// Headless CMS Integration",
      "// Silky 60fps Micro-Interactions"
    ],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    canvasType: "webdev"
  },
  {
    id: "02",
    title: "AI AUTOMATION",
    description: "We deploy smart generative AI automation pipelines and custom agentic workflows to eliminate manual bottlenecks and scale your operations.",
    iconName: "Bot",
    hudTitle: "[ AUTOMATION ENGINE ]",
    hudItems: [
      { label: "PIPELINE", value: "Custom AI Agents" },
      { label: "MODELS", value: "LLM / Flux / SDXL" },
      { label: "SPEED", value: "Realtime API" },
      { label: "LATENCY", value: "<100ms Ingestion" }
    ],
    bullets: [
      "// Automated Content Pipelines",
      "// Custom Neural Model Tuning",
      "// Autonomous Agentic Workflows"
    ],
    tools: ["ComfyUI", "LangChain", "Python", "OpenAI / Claude"],
    canvasType: "ai"
  },
  {
    id: "03",
    title: "VIDEO EDITING",
    description: "We structure cinematic narratives, high-impact brand commercials, and director's cut releases utilizing tailored framing rhythms that command digital presence.",
    iconName: "Film",
    hudTitle: "[ PRODUCTION HUD ]",
    hudItems: [
      { label: "FOCUS", value: "Cinematic Narrative" },
      { label: "OUTPUT", value: "4K / 8K Master Deliveries" },
      { label: "COLOR", value: "Bespoke Color Gradients" },
      { label: "TECH", value: "DaVinci / Premiere" }
    ],
    bullets: [
      "// Soundscapes Synthesis",
      "// Rhythmic Staccato Edits",
      "// Haute Couture Commercials"
    ],
    tools: ["DaVinci Resolve", "Premiere Pro", "After Effects", "Avid Link"],
    canvasType: "video"
  },
  {
    id: "04",
    title: "BRAND SHOOT",
    description: "We direct professional commercial photography, editorial campaign shoots, and visual brand assets that elevate product positioning.",
    iconName: "Camera",
    hudTitle: "[ OPTICAL STUDIO ]",
    hudItems: [
      { label: "SENSOR", value: "Full-Frame Cine" },
      { label: "LIGHTING", value: "Bespoke Studio Rig" },
      { label: "RESOLUTION", value: "60MP Raw Masters" },
      { label: "POST", value: "Haute Couture Retouch" }
    ],
    bullets: [
      "// Executive & Product Branding",
      "// High-Fashion Commercial Shoots",
      "// Color Graded Raw Masters"
    ],
    tools: ["Sony Cine", "Capture One", "Lightroom", "Photoshop AI"],
    canvasType: "brand"
  },
  {
    id: "05",
    title: "LOGO & BRAND DESIGN",
    description: "We craft unique, memorable visual identities, minimalist emblems, and complete vector design systems tailored to define premium luxury brands.",
    iconName: "PenTool",
    hudTitle: "[ VECTOR BRANDING ]",
    hudItems: [
      { label: "GEOMETRY", value: "Golden Ratio Grid" },
      { label: "PALETTE", value: "Curated HSL Tokens" },
      { label: "FORMATS", value: "SVG / Vector / Motion" },
      { label: "SYSTEM", value: "Full Brand Guidelines" }
    ],
    bullets: [
      "// Bespoke Emblem Construction",
      "// Minimalist Vector Geometry",
      "// Dynamic Motion Branding"
    ],
    tools: ["Figma", "Adobe Illustrator", "Photoshop", "After Effects"],
    canvasType: "logo"
  },
  {
    id: "06",
    title: "UNREAL ENGINE DEV",
    description: "We engineer high-end interactive 3D experiences, real-time virtual production sets, and immersive spatial applications running at maximum framerates.",
    iconName: "Layers",
    hudTitle: "[ REALTIME ENGINE ]",
    hudItems: [
      { label: "ENGINE", value: "Unreal Engine 5.5" },
      { label: "LIGHTING", value: "Lumen Path Tracer" },
      { label: "GEOMETRY", value: "Nanite Sub-pixel" },
      { label: "TARGET", value: "60 FPS Locked" }
    ],
    bullets: [
      "// Virtual Production Sets",
      "// Real-time Photoreal Renders",
      "// Blueprint & C++ Logic"
    ],
    tools: ["Unreal Engine 5", "Substance Painter", "Quixel Bridge", "C++"],
    canvasType: "unreal"
  },
  {
    id: "07",
    title: "ARCHITECT DESIGN HOME",
    description: "We formulate functional, high-aesthetic architectural blueprints and modern structural concepts tailored to luxury residential and commercial developments.",
    iconName: "Home",
    hudTitle: "[ SPATIAL ARCHITECTURE ]",
    hudItems: [
      { label: "DRAFTING", value: "Sub-millimeter BIM" },
      { label: "MODELING", value: "Parametric Structures" },
      { label: "COMPLIANCE", value: "Structural Standards" },
      { label: "STYLE", value: "Futuristic Minimal" }
    ],
    bullets: [
      "// Parametric Home Drafting",
      "// Spatial Layout Planning",
      "// Luxury Residential Design"
    ],
    tools: ["AutoCAD", "Revit", "SketchUp", "Rhino 3D"],
    canvasType: "architect"
  },
  {
    id: "08",
    title: "3D ARCHITECTURE RENDERS",
    description: "We produce photorealistic 3D architectural renders, volumetric lighting simulations, and interior material visualizations that bring spatial blueprints to life.",
    iconName: "Box",
    hudTitle: "[ PHOTOREAL RENDER ]",
    hudItems: [
      { label: "RAYTRACING", value: "Sub-pixel Path Tracing" },
      { label: "MATERIALS", value: "PBR Texture Shaders" },
      { label: "OUTPUT", value: "8K Still & Flythrough" },
      { label: "ATMOSPHERE", value: "Volumetric Sun/Sky" }
    ],
    bullets: [
      "// Exterior & Interior 8K Stills",
      "// Physically Based Materials",
      "// Volumetric Lighting Renders"
    ],
    tools: ["Blender 3D", "3ds Max", "V-Ray", "Corona Render"],
    canvasType: "render3d"
  },
  {
    id: "09",
    title: "INTERACTIVE ARCHITECTURE",
    description: "We build engaging 3D walkthroughs, web-based digital twin models, and real-time interactive property configurators accessible in any browser.",
    iconName: "MousePointerClick",
    hudTitle: "[ DIGITAL TWIN HUD ]",
    hudItems: [
      { label: "PLATFORM", value: "WebGL / Pixel Stream" },
      { label: "INTERACTION", value: "Realtime Material Swaps" },
      { label: "WALKTHROUGH", value: "First-Person Camera" },
      { label: "SPEED", value: "Instant Browser Load" }
    ],
    bullets: [
      "// Web-Based 3D Walkthroughs",
      "// Realtime Material Customization",
      "// Spatial Digital Twins"
    ],
    tools: ["Three.js", "Pixel Streaming", "WebGL", "React Three Fiber"],
    canvasType: "interactive_arch"
  },
  {
    id: "10",
    title: "AR / VR SOLUTIONS",
    description: "We code fully immersive augmented and virtual reality spatial applications, hand-tracked headset simulations, and spatial commerce portals.",
    iconName: "Eye",
    hudTitle: "[ SPATIAL TELEMETRY ]",
    hudItems: [
      { label: "TARGET", value: "Vision Pro / Quest 3" },
      { label: "TRACKING", value: "6DoF Hand Tracking" },
      { label: "VOLUMETRIC", value: "Gaussian Splatting" },
      { label: "TECH", value: "Unity / OpenXR" }
    ],
    bullets: [
      "// Spatial UI/UX Architecture",
      "// 3D Gaussian Splatting",
      "// Vision Pro & Quest Portals"
    ],
    tools: ["Unity 3D", "WebXR", "OpenXR", "Swift / VisionOS"],
    canvasType: "xr"
  }
];

const initialTestimonials: Testimonial[] = [
  {
    id: "01",
    quote: "The interactive fluid simulation portal designed by Visionatrix redefined how buyers explore our soundscapes. Absolute peak of creative engineering.",
    author: "MARCUS VANE",
    role: "HEAD OF DIGITAL EXPERIENCE",
    company: "NYX MUSIC INC.",
    rating: 5,
    isActive: true
  },
  {
    id: "02",
    quote: "Their mathematical approach to shader physics and dynamic materials resulted in an automotive spec that blew our design team away.",
    author: "ELENA ROSTOVA",
    role: "VP OF CREATIVE STRATEGY",
    company: "LUMINA MOTORS CO.",
    rating: 5,
    isActive: true
  },
  {
    id: "03",
    quote: "Bespoke software architecture from start to finish. They built an immersive 3D digital twin of our municipal grid that runs locked at 60fps.",
    author: "DR. ARIS THORNE",
    role: "CHIEF INFRASTRUCTURE ARCHITECT",
    company: "TOKYO URBAN GRID SYSTEMS",
    rating: 5,
    isActive: true
  }
];

// Initial preloaded mock CRM inbox requests
const initialProposals: Proposal[] = [
  {
    id: "prop-01",
    fullName: "Charlotte Laurent",
    email: "c.laurent@aetheria-meta.com",
    organization: "Aetheria Metaverse Portal",
    service: "WEBGL WEB CODE",
    details: "Staging a high-performance WebGL browser portal with real-time particle refraction shaders. Need cross-platform locking at 60 FPS.",
    budget: "$40K - $100K",
    timestamp: "2026-05-22T12:30:00.000Z",
    status: "Pending"
  },
  {
    id: "prop-02",
    fullName: "Sarah Jenkins",
    email: "s.jenkins@ap-watches.de",
    organization: "AP Horology Spec",
    service: "VR & SPATIAL XR",
    details: "Designing a spatial watch movement assembly simulation featuring 6DoF finger-tracking and photoreal volumetric light maps.",
    budget: "$100K+",
    timestamp: "2026-05-21T18:15:00.000Z",
    status: "In-Review"
  }
];

// Helper to safely format error objects into strings for clean console output
const formatErrorMsg = (err: any): string => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  return err.message || err.details || JSON.stringify(err);
};

// -------------------------------------------------------------
// Database Mappers
// -------------------------------------------------------------
const mapProjectFromDb = (dbProj: any): Project => ({
  id: dbProj.id,
  title: dbProj.title,
  category: dbProj.category,
  categories: dbProj.categories || [],
  subtitle: dbProj.subtitle || "",
  year: dbProj.year || "2026",
  image: dbProj.image || "/work_aura_configurator.webp",
  tagline: dbProj.tagline || "",
  description: dbProj.description || "",
  bgGradient: dbProj.bg_gradient || "from-slate-900 via-sky-950 to-[#050507]",
  details: {
    client: dbProj.details?.client || "",
    timeline: dbProj.details?.timeline || "",
    role: dbProj.details?.role || "",
    engine: dbProj.details?.engine || "",
    videoUrl: dbProj.details?.videoUrl || null,
    images: dbProj.details?.images || []
  },
  metrics: dbProj.metrics || []
});

const mapProjectToDb = (proj: any) => ({
  title: proj.title,
  category: proj.category,
  categories: proj.categories || [],
  subtitle: proj.subtitle,
  year: proj.year,
  image: proj.image,
  tagline: proj.tagline,
  description: proj.description,
  bg_gradient: proj.bgGradient,
  details: proj.details,
  metrics: proj.metrics
});

const mapServiceFromDb = (dbService: any): ServiceItem => ({
  id: dbService.id,
  title: dbService.title,
  description: dbService.description,
  iconName: dbService.icon_name,
  hudTitle: dbService.hud_title,
  hudItems: dbService.hud_items || [],
  bullets: dbService.bullets || [],
  tools: dbService.tools || [],
  canvasType: dbService.canvas_type
});

const mapServiceToDb = (service: ServiceItem) => ({
  title: service.title,
  description: service.description,
  icon_name: service.iconName,
  hud_title: service.hudTitle,
  hud_items: service.hudItems,
  bullets: service.bullets || [],
  tools: service.tools || [],
  canvas_type: service.canvasType
});

const mapTestimonialFromDb = (dbTest: any): Testimonial => ({
  id: dbTest.id,
  quote: dbTest.quote,
  author: dbTest.author,
  role: dbTest.role,
  company: dbTest.company,
  rating: dbTest.rating,
  isActive: dbTest.is_active
});

const mapTestimonialToDb = (test: any) => ({
  quote: test.quote,
  author: test.author,
  role: test.role,
  company: test.company,
  rating: test.rating,
  is_active: test.isActive
});

const mapProposalFromDb = (dbProp: any): Proposal => ({
  id: dbProp.id,
  fullName: dbProp.full_name,
  email: dbProp.email,
  organization: dbProp.organization || "",
  service: dbProp.service,
  details: dbProp.details || "",
  budget: dbProp.budget,
  fileName: dbProp.file_name,
  timestamp: dbProp.timestamp,
  status: dbProp.status
});

const mapProposalToDb = (prop: any) => ({
  full_name: prop.fullName,
  email: prop.email,
  organization: prop.organization || null,
  service: prop.service,
  details: prop.details || null,
  budget: prop.budget,
  file_name: prop.fileName || null,
  status: prop.status || 'Pending'
});

// -------------------------------------------------------------
// Provider
// -------------------------------------------------------------
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate states from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, servRes, testRes, propRes] = await Promise.all([
          supabase.from("projects").select("*").order("id", { ascending: true }),
          supabase.from("services").select("*").order("id", { ascending: true }),
          supabase.from("testimonials").select("*").order("id", { ascending: true }),
          supabase.from("proposals").select("*").order("timestamp", { ascending: false })
        ]);

        const errors: string[] = [];
        if (projRes.error) errors.push(`projects: ${formatErrorMsg(projRes.error)}`);
        if (servRes.error) errors.push(`services: ${formatErrorMsg(servRes.error)}`);
        if (testRes.error) errors.push(`testimonials: ${formatErrorMsg(testRes.error)}`);
        if (propRes.error) errors.push(`proposals: ${formatErrorMsg(propRes.error)}`);

        if (errors.length > 0) {
          console.warn("Supabase hydration notice (using fallback local data):", errors.join(" | "));
        }

        if (projRes.data && projRes.data.length > 0) {
          setProjects(projRes.data.map(mapProjectFromDb));
        }
        if (servRes.data && servRes.data.length > 0) {
          setServices(servRes.data.map(mapServiceFromDb));
        }
        if (testRes.data && testRes.data.length > 0) {
          setTestimonials(testRes.data.map(mapTestimonialFromDb));
        }
        if (propRes.data && propRes.data.length > 0) {
          setProposals(propRes.data.map(mapProposalFromDb));
        }
      } catch (error) {
        console.warn("Error hydrating data from Supabase (using fallback local data):", formatErrorMsg(error));
      } finally {
        setIsLoaded(true);
      }
    }
    fetchData();
  }, []);

  // Supabase Realtime subscriptions for live synchronization across all browser tabs and clients
  useEffect(() => {
    const channel = supabase
      .channel("db-realtime-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        async () => {
          try {
            const { data, error } = await supabase
              .from("projects")
              .select("*")
              .order("id", { ascending: true });
            if (error) throw error;
            setProjects((data || []).map(mapProjectFromDb));
          } catch (err) {
            console.error("Realtime projects refresh failed:", formatErrorMsg(err));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const mapped = mapServiceFromDb(payload.new);
            setServices(prev => {
              if (prev.some(s => s.id === mapped.id)) return prev;
              return [...prev, mapped];
            });
          } else if (payload.eventType === "UPDATE") {
            const mapped = mapServiceFromDb(payload.new);
            setServices(prev => prev.map(s => (s.id === mapped.id ? mapped : s)));
          } else if (payload.eventType === "DELETE") {
            const oldId = payload.old.id;
            setServices(prev => prev.filter(s => s.id !== oldId));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "testimonials" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const mapped = mapTestimonialFromDb(payload.new);
            setTestimonials(prev => {
              if (prev.some(t => t.id === mapped.id)) return prev;
              return [...prev, mapped];
            });
          } else if (payload.eventType === "UPDATE") {
            const mapped = mapTestimonialFromDb(payload.new);
            setTestimonials(prev => prev.map(t => (t.id === mapped.id ? mapped : t)));
          } else if (payload.eventType === "DELETE") {
            const oldId = payload.old.id;
            setTestimonials(prev => prev.filter(t => t.id !== oldId));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "proposals" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const mapped = mapProposalFromDb(payload.new);
            setProposals(prev => {
              if (prev.some(p => p.id === mapped.id)) return prev;
              return [mapped, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const mapped = mapProposalFromDb(payload.new);
            setProposals(prev => prev.map(p => (p.id === mapped.id ? mapped : p)));
          } else if (payload.eventType === "DELETE") {
            const oldId = payload.old.id;
            setProposals(prev => prev.filter(p => p.id !== oldId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // -------------------------------------------------------------
  // Projects CRUD
  // -------------------------------------------------------------
  const addProject = async (p: Omit<Project, "id">) => {
    try {
      // Calculate the next sequential numeric ID based on the highest integer ID in state
      let nextIdNum = 1;
      if (projects.length > 0) {
        const ids = projects
          .map(proj => parseInt(proj.id, 10))
          .filter(num => !isNaN(num));
        if (ids.length > 0) {
          nextIdNum = Math.max(...ids) + 1;
        }
      }
      const nextId = String(nextIdNum).padStart(2, "0");

      // Auto-assign the perfect formatted index to the subtitle if not specified!
      let pWithSeqSubtitle = { ...p };
      if (!p.subtitle || p.subtitle === `${p.title} Spec` || p.subtitle === `${p.title.toUpperCase()} Spec`) {
        pWithSeqSubtitle.subtitle = `${nextId} / ${p.title}`;
      }

      const dbProj = {
        ...mapProjectToDb(pWithSeqSubtitle),
        id: nextId
      };

      const { data, error } = await supabase
        .from("projects")
        .insert([dbProj])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        const newProj = mapProjectFromDb(data[0]);
        setProjects(prev => [...prev, newProj]);
      }
    } catch (error) {
      console.error("Failed to add project to Supabase:", formatErrorMsg(error));
    }
  };

  const updateProject = async (id: string, p: Project) => {
    try {
      const dbProj = mapProjectToDb(p);
      const { error } = await supabase
        .from("projects")
        .update(dbProj)
        .eq("id", id);

      if (error) throw error;
      setProjects(prev => prev.map(item => (item.id === id ? p : item)));
    } catch (error) {
      console.error("Failed to update project in Supabase:", formatErrorMsg(error));
    }
  };

  const deleteProject = async (id: string) => {
    try {
      // 1. Delete the targeted project row
      const { error: deleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // 2. Fetch all remaining projects to re-sequence them
      const { data: remaining, error: fetchError } = await supabase
        .from("projects")
        .select("*");

      if (fetchError) throw fetchError;

      if (remaining && remaining.length > 0) {
        // Sort remaining projects by their current ID translated to numeric values
        const sorted = [...remaining].sort((a, b) => {
          const numA = parseInt(a.id, 10);
          const numB = parseInt(b.id, 10);
          if (isNaN(numA) && isNaN(numB)) return a.title.localeCompare(b.title);
          if (isNaN(numA)) return 1;
          if (isNaN(numB)) return -1;
          return numA - numB;
        });

        // 3. Sequential update of keys and subtitle indexes in Supabase
        const updatePromises = sorted.map(async (dbProj, idx) => {
          const newId = String(idx + 1).padStart(2, "0");
          let updatedSubtitle = dbProj.subtitle || "";
          
          // Re-index subtitle if it matches "XX / Title" format
          const match = updatedSubtitle.match(/^(\d+)\s*\/\s*(.*)$/);
          if (match) {
            updatedSubtitle = `${newId} / ${match[2]}`;
          }

          if (dbProj.id !== newId || dbProj.subtitle !== updatedSubtitle) {
            await supabase
              .from("projects")
              .update({ id: newId, subtitle: updatedSubtitle })
              .eq("id", dbProj.id);
          }
        });

        await Promise.all(updatePromises);
      }

      // 4. Re-fetch all sorted fresh entries to completely hydrate UI state
      const { data: freshProjects, error: freshError } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: true });

      if (freshError) throw freshError;
      setProjects((freshProjects || []).map(mapProjectFromDb));
    } catch (error) {
      console.error("Failed to delete and re-sequence projects in Supabase:", formatErrorMsg(error));
    }
  };

  // -------------------------------------------------------------
  // Services CRUD
  // -------------------------------------------------------------
  const updateService = async (id: string, s: ServiceItem) => {
    try {
      const dbService = mapServiceToDb(s);
      const { error } = await supabase
        .from("services")
        .update(dbService)
        .eq("id", id);

      if (error) throw error;
      setServices(prev => prev.map(item => (item.id === id ? s : item)));
    } catch (error) {
      console.error("Failed to update service in Supabase:", formatErrorMsg(error));
    }
  };

  // -------------------------------------------------------------
  // Testimonials CRUD
  // -------------------------------------------------------------
  const addTestimonial = async (t: Omit<Testimonial, "id">) => {
    try {
      const dbTest = mapTestimonialToDb(t);
      const { data, error } = await supabase
        .from("testimonials")
        .insert([dbTest])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        const newTest = mapTestimonialFromDb(data[0]);
        setTestimonials(prev => [...prev, newTest]);
      }
    } catch (error) {
      console.error("Failed to add testimonial to Supabase:", formatErrorMsg(error));
    }
  };

  const updateTestimonial = async (id: string, t: Testimonial) => {
    try {
      const dbTest = mapTestimonialToDb(t);
      const { error } = await supabase
        .from("testimonials")
        .update(dbTest)
        .eq("id", id);

      if (error) throw error;
      setTestimonials(prev => prev.map(item => (item.id === id ? t : item)));
    } catch (error) {
      console.error("Failed to update testimonial in Supabase:", formatErrorMsg(error));
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setTestimonials(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete testimonial from Supabase:", formatErrorMsg(error));
    }
  };

  // -------------------------------------------------------------
  // Proposals CRM CRUD
  // -------------------------------------------------------------
  const addProposal = async (p: Omit<Proposal, "id" | "timestamp" | "status"> & { fileName?: string | null }) => {
    try {
      const dbProp = mapProposalToDb({
        ...p,
        status: "Pending"
      });
      const { data, error } = await supabase
        .from("proposals")
        .insert([dbProp])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        const newProp = mapProposalFromDb(data[0]);
        setProposals(prev => [newProp, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add proposal to Supabase:", formatErrorMsg(error));
    }
  };

  const updateProposalStatus = async (id: string, status: Proposal["status"]) => {
    try {
      const { error } = await supabase
        .from("proposals")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      setProposals(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));
    } catch (error) {
      console.error("Failed to update proposal status in Supabase:", formatErrorMsg(error));
    }
  };

  const deleteProposal = async (id: string) => {
    try {
      const { error } = await supabase
        .from("proposals")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setProposals(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete proposal from Supabase:", formatErrorMsg(error));
    }
  };



  return (
    <AdminContext.Provider
      value={{
        projects,
        services,
        testimonials,
        proposals,
        isLoaded,
        addProject,
        updateProject,
        deleteProject,
        updateService,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addProposal,
        updateProposalStatus,
        deleteProposal
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
