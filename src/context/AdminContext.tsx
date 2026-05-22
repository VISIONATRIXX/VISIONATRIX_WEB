"use client";

import { createContext, useContext, useState, useEffect } from "react";

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
    title: "AURA CONFIGURATOR",
    category: "CGI & Volumetric Design",
    categories: ["CGI", "VR"],
    subtitle: "01 / MERCEDES-BENZ CONCEPT",
    year: "2026",
    image: "/work_aura_configurator.png",
    tagline: "Formulating custom high-fidelity configuration environments with real-time path-traced material shaders.",
    description: "An immersive digital showroom designed for Mercedes-Benz concept vehicles. Built with path-traced shaders to simulate realistic carbon fiber weave patterns, active aerodynamic mechanics, and high-frequency light reflections in real time.",
    bgGradient: "from-slate-900 via-sky-950 to-[#050507]",
    details: {
      client: "Mercedes Benz Spec",
      timeline: "Q1 2026",
      role: "CGI Lead & Interactive Dev",
      engine: "Octane Render / GLSL Shaders"
    },
    metrics: [
      { label: "RESOLUTION", value: "8K Projections" },
      { label: "RENDER TIME", value: "1,420 Node Hours" },
      { label: "POLY COUNT", value: "18.4 Million" }
    ]
  },
  {
    id: "02",
    title: "OMNIS INTERACTIVE",
    category: "Holographic UI & Code",
    categories: ["VR", "WEB DEV", "APPS"],
    subtitle: "02 / LEICA OPTICS",
    year: "2025",
    image: "/work_omnis_interactive.png",
    tagline: "Crafting sub-pixel accurate smartwatch interfaces, glass refraction shaders, and micro-bezel mechanics.",
    description: "A luxury smartwatch design explorer mapping physical light refraction, mechanical gear rotations, and high-performance WebGL state management for customized watch faces.",
    bgGradient: "from-zinc-900 via-[#1c1212] to-[#050507]",
    details: {
      client: "Leica Concept Spec",
      timeline: "Q2 2025",
      role: "UI Design & Shader Engineer",
      engine: "Three.js / React Fiber"
    },
    metrics: [
      { label: "SUB-PIXEL SAMPLING", value: "1024 Samples" },
      { label: "FPS TARGET", value: "60 FPS Locked" },
      { label: "GLASS SHADERS", value: "Physically Accurate" }
    ]
  },
  {
    id: "03",
    title: "NEO-CITY DIGITAL TWIN",
    category: "Spatial & VR Mapping",
    categories: ["VR", "CGI"],
    subtitle: "03 / TOKYO SMART GRID",
    year: "2026",
    image: "/work_aura_configurator.png",
    tagline: "Creating real-time geospatial digital twins utilizing procedural layout math and dynamic lighting.",
    description: "A dense procedural mapping interface reproducing Tokyo's skyscraper networks. Merges live municipal API signals with custom geometry shaders to reflect active traffic volumes and power loads visually.",
    bgGradient: "from-blue-950 via-slate-900 to-[#050507]",
    details: {
      client: "Tokyo Municipal Spec",
      timeline: "Q1 2026",
      role: "Spatial Architect & Developer",
      engine: "Unreal Engine / WebGL Map"
    },
    metrics: [
      { label: "CITY TILES", value: "128 Custom Nodes" },
      { label: "GEOMETRY COUNT", value: "45 Million Polys" },
      { label: "LIVE FEED DELAY", value: "45 Milliseconds" }
    ]
  },
  {
    id: "04",
    title: "ETHER EDITORIAL",
    category: "Cinema & VFX Production",
    categories: ["VIDEO", "VFX"],
    subtitle: "04 / SAINT LAURENT PARIS",
    year: "2025",
    image: "/work_omnis_interactive.png",
    tagline: "High-fashion commercial editorial demonstrating interactive fabric simulations and raytraced dust.",
    description: "A luxury editorial speculative promotion featuring active dynamic fabric physics. Simulates the micro-textures of cashmere and velvet flowing through turbulent fields with real-time dust volume rays.",
    bgGradient: "from-purple-950 via-[#1a1221] to-[#050507]",
    details: {
      client: "YSL speculative spec",
      timeline: "Q4 2025",
      role: "VFX Lead & Simulation Dev",
      engine: "Houdini / Karma Render"
    },
    metrics: [
      { label: "FABRIC PARTICLES", value: "2.4 Million Nodes" },
      { label: "DYNAMICS FREQ", value: "120 FPS Capture" },
      { label: "RESOLVED LIGHTS", value: "Physically Correct" }
    ]
  },
  {
    id: "05",
    title: "CHRONOS VR",
    category: "Volumetric VR Space",
    categories: ["VR", "VFX"],
    subtitle: "05 / AUDEMARS PIGUET",
    year: "2026",
    image: "/work_aura_configurator.png",
    tagline: "Volumetric horology portal enabling physical scale mechanical watch disassembly in VR space.",
    description: "A hyper-detailed watch mechanic environment for spatial headsets. Users physically pull gears, dials, and escapes of a luxury chronograph clock apart, mapping mechanical equations directly in full 3D.",
    bgGradient: "from-stone-900 via-zinc-950 to-[#050507]",
    details: {
      client: "AP speculator Spec",
      timeline: "Q1 2026",
      role: "Volumetric UI & Dev",
      engine: "Unity / OpenXR / HDRP"
    },
    metrics: [
      { label: "MECHANICAL PIECES", value: "312 Separate Parts" },
      { label: "COLLIDER SENS", value: "0.2mm Precision" },
      { label: "SPATIAL RESOLUTION", value: "4K Per Eye" }
    ]
  },
  {
    id: "06",
    title: "SYNAPSE AI STUDIO",
    category: "AI Production",
    categories: ["AI SHOOTS", "VIDEO"],
    subtitle: "06 / MIND LAB",
    year: "2026",
    image: "/work_omnis_interactive.png",
    tagline: "Expanding creative storytelling utilizing ComfyUI batch rendering pipelines and upscale nodes.",
    description: "An AI-powered storyboard studio utilizing customized generative neural weights. Built to batch process luxury concepts for agencies, scaling outputs to gorgeous 4K volumes without human facial drift.",
    bgGradient: "from-[#1b1712] via-neutral-900 to-[#050507]",
    details: {
      client: "Mind Lab Creative",
      timeline: "Q2 2026",
      role: "Lead Prompt & Comfy Dev",
      engine: "Stable Diffusion / Flux"
    },
    metrics: [
      { label: "LATENT LAYERS", value: "Flux Custom Lora" },
      { label: "GENERATION TIME", value: "12s Per Image" },
      { label: "UPSCALING FREQ", value: "High Fidelity" }
    ]
  },
  {
    id: "07",
    title: "VORTEX FLUIDICS",
    category: "Physics VFX & Sound",
    categories: ["VFX", "WEB DEV"],
    subtitle: "07 / NYX MUSIC",
    year: "2025",
    image: "/work_aura_configurator.png",
    tagline: "Sound-responsive dynamic WebGL fluid wave simulating physical acoustics on the browser.",
    description: "An interactive digital companion representing sound signals as dynamic fluid waves. Hooked into standard micro-frequencies of music to bend vector trajectories in locked 60 frames per second.",
    bgGradient: "from-emerald-950 via-slate-950 to-[#050507]",
    details: {
      client: "Nyx Sound Lab",
      timeline: "Q3 2025",
      role: "Fluid Shader Designer",
      engine: "GLSL / React Three Fiber"
    },
    metrics: [
      { label: "FLUID SOLVER", value: "Navier-Stokes Shader" },
      { label: "AURAL BINS", value: "256 Tracked Bands" },
      { label: "GRID DENSITY", value: "512 x 512 Sim" }
    ]
  },
  {
    id: "08",
    title: "CUSTOM SOFTWARE SYSTEM",
    category: "Custom Software Systems",
    categories: ["WEB DEV", "APPS"],
    subtitle: "08 / SPACEX SYSTEM",
    year: "2025",
    image: "/work_omnis_interactive.png",
    tagline: "Complex SpaceX specs mapping high-frequency rocket coordinates on clean, responsive frames.",
    description: "A secure diagnostic platform tracking spec payloads and rocket coordinate signals. Developed to simplify telemetry diagnostics for test pilots and mission logs in high stakes spaces.",
    bgGradient: "from-cyan-950 via-slate-950 to-[#050507]",
    details: {
      client: "SpaceXspecspec",
      timeline: "Q4 2025",
      role: "Dashboard Architect & Developer",
      engine: "Next.js / WebSocket System"
    },
    metrics: [
      { label: "DATA POINTS", value: "10,000 / Second" },
      { label: "LATENCY TARGET", value: "<15 Milliseconds" },
      { label: "SECURITY PROTOCOL", value: "End-to-End Encrypted" }
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
    quote: "The spatial environment crafted by Visionatrix redefined how luxury buyers interact with our brand. An absolute benchmark of creative technology.",
    author: "MARCUS VANE",
    role: "HEAD OF DIGITAL CREATIVE",
    company: "LEICA CAMERA AG CONCEPT",
    rating: 5,
    isActive: true
  },
  {
    id: "02",
    quote: "Their mathematical approach to shader art and VFX resulted in an automotive spec showcase that exceeded our absolute highest aesthetic standards.",
    author: "ELENA ROSTOVA",
    role: "VP OF INNOVATION MARKETING",
    company: "MERCEDES BENZ DESIGN",
    rating: 5,
    isActive: true
  },
  {
    id: "03",
    quote: "Bespoke engineering from start to finish. They built a custom WebGL portal that runs at a locked 60fps while displaying millions of active data nodes.",
    author: "DR. ARIS THORNE",
    role: "CHIEF ARCHITECT",
    company: "NEURAL NETWORK CO.",
    rating: 5,
    isActive: true
  }
];

// Initial preloaded mock CRM inbox requests
const initialProposals: Proposal[] = [
  {
    id: "prop-01",
    fullName: "Arthur Pendelton",
    email: "a.pendelton@apex-systems.io",
    organization: "Apex Racing Group",
    service: "CGI ADVERTISING",
    details: "Staging a high-fidelity visual simulator for our formula concept team. Need volumetric tracks and real-time reflection overlays on composite frames.",
    budget: "$40K - $100K",
    timestamp: "2026-05-22T12:30:00.000Z",
    status: "Pending"
  },
  {
    id: "prop-02",
    fullName: "Sarah Jenkins",
    email: "s.jenkins@leica-photo.de",
    organization: "Leica Camera Spec Team",
    service: "VR & SPATIAL XR",
    details: "Creating a Gaussian Splatting gallery app in spatial environments. Looking to represent raw vintage focal lens structures accurately.",
    budget: "$100K+",
    timestamp: "2026-05-21T18:15:00.000Z",
    status: "In-Review"
  }
];

// -------------------------------------------------------------
// Provider
// -------------------------------------------------------------
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate states from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedProjects = localStorage.getItem("visionatrix_projects");
    const storedServices = localStorage.getItem("visionatrix_services");
    const storedTestimonials = localStorage.getItem("visionatrix_testimonials");
    const storedProposals = localStorage.getItem("visionatrix_proposals");

    if (storedProjects) setProjects(JSON.parse(storedProjects));
    else {
      setProjects(initialProjects);
      localStorage.setItem("visionatrix_projects", JSON.stringify(initialProjects));
    }

    if (storedServices) setServices(JSON.parse(storedServices));
    else {
      setServices(initialServices);
      localStorage.setItem("visionatrix_services", JSON.stringify(initialServices));
    }

    if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));
    else {
      setTestimonials(initialTestimonials);
      localStorage.setItem("visionatrix_testimonials", JSON.stringify(initialTestimonials));
    }

    if (storedProposals) setProposals(JSON.parse(storedProposals));
    else {
      setProposals(initialProposals);
      localStorage.setItem("visionatrix_proposals", JSON.stringify(initialProposals));
    }

    setIsLoaded(true);
  }, []);

  // Update localStorage when values change
  const saveToStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // -------------------------------------------------------------
  // Projects CRUD
  // -------------------------------------------------------------
  const addProject = (p: Omit<Project, "id">) => {
    const newId = (Math.max(...projects.map(item => parseInt(item.id) || 0), 0) + 1)
      .toString()
      .padStart(2, "0");
    const newProject: Project = { ...p, id: newId };
    const updated = [...projects, newProject];
    setProjects(updated);
    saveToStorage("visionatrix_projects", updated);
  };

  const updateProject = (id: string, p: Project) => {
    const updated = projects.map(item => (item.id === id ? p : item));
    setProjects(updated);
    saveToStorage("visionatrix_projects", updated);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(item => item.id !== id);
    setProjects(updated);
    saveToStorage("visionatrix_projects", updated);
  };

  // -------------------------------------------------------------
  // Services CRUD
  // -------------------------------------------------------------
  const updateService = (id: string, s: ServiceItem) => {
    const updated = services.map(item => (item.id === id ? s : item));
    setServices(updated);
    saveToStorage("visionatrix_services", updated);
  };

  // -------------------------------------------------------------
  // Testimonials CRUD
  // -------------------------------------------------------------
  const addTestimonial = (t: Omit<Testimonial, "id">) => {
    const newId = (Math.max(...testimonials.map(item => parseInt(item.id) || 0), 0) + 1)
      .toString()
      .padStart(2, "0");
    const newTestimonial: Testimonial = { ...t, id: newId };
    const updated = [...testimonials, newTestimonial];
    setTestimonials(updated);
    saveToStorage("visionatrix_testimonials", updated);
  };

  const updateTestimonial = (id: string, t: Testimonial) => {
    const updated = testimonials.map(item => (item.id === id ? t : item));
    setTestimonials(updated);
    saveToStorage("visionatrix_testimonials", updated);
  };

  const deleteTestimonial = (id: string) => {
    const updated = testimonials.filter(item => item.id !== id);
    setTestimonials(updated);
    saveToStorage("visionatrix_testimonials", updated);
  };

  // -------------------------------------------------------------
  // Proposals CRM CRUD
  // -------------------------------------------------------------
  const addProposal = (p: Omit<Proposal, "id" | "timestamp" | "status"> & { fileName?: string | null }) => {
    const newId = `prop-${Date.now()}`;
    const newProposal: Proposal = {
      ...p,
      id: newId,
      timestamp: new Date().toISOString(),
      status: "Pending"
    };
    const updated = [newProposal, ...proposals];
    setProposals(updated);
    saveToStorage("visionatrix_proposals", updated);
  };

  const updateProposalStatus = (id: string, status: Proposal["status"]) => {
    const updated = proposals.map(item => (item.id === id ? { ...item, status } : item));
    setProposals(updated);
    saveToStorage("visionatrix_proposals", updated);
  };

  const deleteProposal = (id: string) => {
    const updated = proposals.filter(item => item.id !== id);
    setProposals(updated);
    saveToStorage("visionatrix_proposals", updated);
  };



  return (
    <AdminContext.Provider
      value={{
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
