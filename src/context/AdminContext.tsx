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
    image: "/work_aura_configurator.png",
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
    image: "/work_omnis_interactive.png",
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
    image: "/work_aura_configurator.png",
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
    image: "/work_omnis_interactive.png",
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
    image: "/work_aura_configurator.png",
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
    image: "/work_omnis_interactive.png",
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
    title: "VIDEO EDITING",
    description: "We structure cinematic narratives, high-impact brand commercials, and director's cut releases utilizing tailored framing rhythms that command digital presence.",
    iconName: "Film",
    hudTitle: "[ PRODUCTION HUD ]",
    hudItems: [
      { label: "FOCUS", value: "Cinematic Narrative" },
      { label: "OUTPUT", value: "4K / 8K Master Deliveries" },
      { label: "COLOR", value: "Bespoke Color Gradients" },
      { label: "TECH", value: "DaVinci Resolve / Premiere" }
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
    id: "02",
    title: "VFX SIMULATIONS",
    description: "We simulate and composite hyper-realistic environmental phenomena, particle streams, and digital cosmetics tailored for cinema and high-fashion advertising campaigns.",
    iconName: "Sparkles",
    hudTitle: "[ COMPOSITING HUD ]",
    hudItems: [
      { label: "FOCUS", value: "Photoreal FX" },
      { label: "OUTPUT", value: "DeepEXR Sequences" },
      { label: "GRAIN", value: "Camera-matched Noise" },
      { label: "TECH", value: "Nuke / Houdini" }
    ],
    bullets: [
      "// Fluid Dynamics Simulations",
      "// Photorealistic Compositing",
      "// Deep Compositing Workflows"
    ],
    tools: ["Nuke", "Houdini", "PFTrack", "Syntheyes"],
    canvasType: "vfx"
  },
  {
    id: "03",
    title: "CGI ADVERTISING",
    description: "We construct cinematic luxury product renders, automotive concept visualizations, and bespoke promotional sequences engineered to bridge commercial luxury with futuristic aesthetics.",
    iconName: "Box",
    hudTitle: "[ RENDER SPECS ]",
    hudItems: [
      { label: "PIPELINE", value: "Sub-pixel Raytracing" },
      { label: "MATERIALS", value: "Physically Based Shading" },
      { label: "RESOLUTIONS", value: "8K Master Projections" },
      { label: "AUDIENCE", value: "Luxury B2B Focus" }
    ],
    bullets: [
      "// 3D Raytraced Metamorphs",
      "// Physically Accurate Textures",
      "// Luxury Architectural Shaders"
    ],
    tools: ["Blender 3D", "Cinema 4D", "Redshift", "Octane Render"],
    canvasType: "cgi"
  },
  {
    id: "04",
    title: "ENVIRONMENT CREATION",
    description: "We build sprawling virtual landscapes, digital twin showrooms, and interactive sensory environments rendered in real-time utilizing state-of-the-art geometry pipelines.",
    iconName: "Layers",
    hudTitle: "[ SPATIAL DIAGNOSTICS ]",
    hudItems: [
      { label: "GEOMETRY", value: "Bespoke Megascans" },
      { label: "LIGHTING", value: "Lumen / Path Tracer" },
      { label: "DETAIL", value: "Sub-millimeter Micro-mesh" },
      { label: "TECH", value: "Unreal Engine 5.5" }
    ],
    bullets: [
      "// Realtime Virtual Sets",
      "// Procedural Terrain Generation",
      "// High-fidelity Digital Twins"
    ],
    tools: ["Unreal Engine 5", "SpeedTree", "Quixel Bridge", "Substance Painter"],
    canvasType: "env"
  },
  {
    id: "05",
    title: "WEBGL WEB CODE",
    description: "We write bespoke WebGL shaders, fluid simulation portals, and 3D websites that load in milliseconds and deliver silky-smooth interactions on any device.",
    iconName: "Cpu",
    hudTitle: "[ RENDER CORE ]",
    hudItems: [
      { label: "ENGINE", value: "Three.js / WebGL" },
      { label: "PERFORMANCE", value: "60 FPS Locked" },
      { label: "SHADERS", value: "Custom GLSL Noise" },
      { label: "TECH", value: "React Three Fiber" }
    ],
    bullets: [
      "// Custom GLSL Shader Art",
      "// Interactive Physics Systems",
      "// Headless WebGL Engines"
    ],
    tools: ["Three.js", "GLSL", "React Three Fiber", "Vite"],
    canvasType: "webgl"
  },
  {
    id: "06",
    title: "APP ARCHITECTURES",
    description: "We design enterprise-grade mobile interfaces and robust cloud platforms optimized for extreme speed, security, and complex spatial UI interactions.",
    iconName: "Smartphone",
    hudTitle: "[ SYSTEMS METRICS ]",
    hudItems: [
      { label: "FRAMEWORK", value: "Next.js / React Native" },
      { label: "STATE", value: "Zustand / Redux" },
      { label: "DATABASE", value: "Supabase / PostgreSQL" },
      { label: "TECH", value: "Vercel Edge API" }
    ],
    bullets: [
      "// Edge API Handlers",
      "// Micro-frontend Schemes",
      "// Realtime Database Sync"
    ],
    tools: ["Next.js", "React Native", "Supabase", "Tailwind CSS"],
    canvasType: "app"
  },
  {
    id: "07",
    title: "AI PRODUCTION SHOOTS",
    description: "We direct AI-driven commercial productions and campaign photography, combining traditional cinematography guidelines with state-of-the-art latent models.",
    iconName: "ScanFace",
    hudTitle: "[ LATENT HUD ]",
    hudItems: [
      { label: "SAMPLING", value: "Flux / SDXL" },
      { label: "UPSCALE", value: "4K Magnific AI" },
      { label: "CONSISTENCY", value: "IP-Adapter / ControlNet" },
      { label: "TECH", value: "ComfyUI Nodes" }
    ],
    bullets: [
      "// Latent Temporal Consistency",
      "// Hyper-premium Character Design",
      "// ControlNet Directed Framing"
    ],
    tools: ["ComfyUI", "Stable Diffusion", "Midjourney", "Photoshop AI"],
    canvasType: "ai"
  },
  {
    id: "08",
    title: "VR & SPATIAL XR",
    description: "We code fully immersive volumetric environments, spatial computed applications, and hand-tracked simulations pushing the boundaries of human presence.",
    iconName: "Eye",
    hudTitle: "[ OPTICAL TELEMETRY ]",
    hudItems: [
      { label: "TARGET", value: "Vision Pro / Quest" },
      { label: "TRACKING", value: "6DoF Hand Tracking" },
      { label: "VOLUMETRIC", value: "Gaussian Splatting" },
      { label: "TECH", value: "Unity / WebXR" }
    ],
    bullets: [
      "// Spatial UI/UX Architecture",
      "// 3D Gaussian Splat Ingestion",
      "// Low Latency Spatial Feeds"
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

// -------------------------------------------------------------
// Provider
// -------------------------------------------------------------
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
  image: dbProj.image || "/work_aura_configurator.png",
  tagline: dbProj.tagline || "",
  description: dbProj.description || "",
  bgGradient: dbProj.bg_gradient || "from-slate-900 via-sky-950 to-[#050507]",
  details: {
    client: dbProj.details?.client || "",
    timeline: dbProj.details?.timeline || "",
    role: dbProj.details?.role || "",
    engine: dbProj.details?.engine || "",
    videoUrl: dbProj.details?.videoUrl || null
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

        if (projRes.error) throw projRes.error;
        if (servRes.error) throw servRes.error;
        if (testRes.error) throw testRes.error;
        if (propRes.error) throw propRes.error;

        setProjects((projRes.data || []).map(mapProjectFromDb));
        setServices((servRes.data || []).map(mapServiceFromDb));
        setTestimonials((testRes.data || []).map(mapTestimonialFromDb));
        setProposals((propRes.data || []).map(mapProposalFromDb));
      } catch (error) {
        console.error("Error hydrating data from Supabase:", error);
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
        (payload) => {
          if (payload.eventType === "INSERT") {
            const mapped = mapProjectFromDb(payload.new);
            setProjects(prev => {
              if (prev.some(p => p.id === mapped.id)) return prev;
              return [...prev, mapped];
            });
          } else if (payload.eventType === "UPDATE") {
            const mapped = mapProjectFromDb(payload.new);
            setProjects(prev => prev.map(p => (p.id === mapped.id ? mapped : p)));
          } else if (payload.eventType === "DELETE") {
            const oldId = payload.old.id;
            setProjects(prev => prev.filter(p => p.id !== oldId));
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
      const dbProj = mapProjectToDb(p);
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
      console.error("Failed to add project to Supabase:", error);
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
      console.error("Failed to update project in Supabase:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setProjects(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete project from Supabase:", error);
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
      console.error("Failed to update service in Supabase:", error);
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
      console.error("Failed to add testimonial to Supabase:", error);
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
      console.error("Failed to update testimonial in Supabase:", error);
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
      console.error("Failed to delete testimonial from Supabase:", error);
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
      console.error("Failed to add proposal to Supabase:", error);
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
      console.error("Failed to update proposal status in Supabase:", error);
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
      console.error("Failed to delete proposal from Supabase:", error);
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
