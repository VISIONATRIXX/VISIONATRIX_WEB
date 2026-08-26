import { Project, ServiceItem, Testimonial, Proposal } from "@/types/admin";

export const initialProjects: Project[] = [
  {
    id: "01",
    title: "BILLING-OS",
    category: "Restaurant POS & Automated WhatsApp CRM",
    categories: ["WEB DEV", "SAAS", "POS SYSTEM", "FULLSTACK"],
    subtitle: "01 / SAAS POS PLATFORM",
    year: "2026",
    image: "",
    tagline: "Modern Restaurant POS & Automated WhatsApp CRM Platform with Real-time GST & n8n Automation.",
    description: "Billing-OS is a modern, mobile-optimized Point of Sale (POS) web application built using React 18, Vite, and a sleek Glassmorphic Midnight Slate dark mode UI. It allows restaurant staff to manage food menu items, generate customer bills with real-time GST calculations, and store order history in Google Firebase Firestore. Upon checkout, the system triggers n8n Webhooks and Evolution API (v2) to instantly send automated digital receipts to customers via WhatsApp while maintaining an automated CRM database in Google Sheets.",
    bgGradient: "from-amber-950 via-zinc-900 to-[#050507]",
    details: {
      role: "Lead POS & Automation Architect",
      client: "Madhav Restaurant / Billing-OS",
      engine: "React 18 / Vite / Firebase / n8n / Evolution API",
      timeline: "2026",
      videoUrl: null,
      liveUrl: "https://www.billingos.online/"
    },
    metrics: [
      { label: "WHATSAPP CRM", value: "Automated Receipts 📲" },
      { label: "DATABASE ENGINE", value: "Firebase Cloud Firestore" },
      { label: "WORKFLOW AUTOMATION", value: "n8n Webhook & Evolution API" }
    ]
  },
  {
    id: "02",
    title: "YUVRAJ RATHOD STUDIO",
    category: "Full-Stack Web & Creative Tech",
    categories: ["WEB DEV", "APPS", "FULLSTACK"],
    subtitle: "02 / LIVE PORTFOLIO PLATFORM",
    year: "2026",
    image: "",
    tagline: "Ultra-responsive creative portfolio showcasing full-stack digital products, 3D WebGL visuals, and custom web architecture.",
    description: "An elite creative studio and full-stack developer portfolio platform built by Yuvraj Rathod. Engineered with high-frequency micro-interactions, dark aesthetic design tokens, smooth Lenis scrolling physics, and real-time interactive sandboxing.",
    bgGradient: "from-slate-900 via-sky-950 to-[#050507]",
    details: {
      role: "Lead Full-Stack Architect",
      client: "Yuvraj Rathod Studio",
      engine: "Next.js 15 / React / Tailwind / GSAP",
      timeline: "Live Production 2026",
      videoUrl: null,
      liveUrl: "https://yuvrajrathod.online/"
    },
    metrics: [
      { label: "LOAD PERFORMANCE", value: "< 0.4s Edge Speed" },
      { label: "SEO OPTIMIZATION", value: "100 / 100 Score" },
      { label: "STATUS", value: "LIVE HOSTED 🟢" }
    ]
  },
  {
    id: "03",
    title: "FILEGRAM",
    category: "Unlimited Telegram Cloud Storage Web Platform",
    categories: ["WEB DEV", "SAAS", "CLOUD STORAGE", "FULLSTACK"],
    subtitle: "03 / CLOUD STORAGE PLATFORM",
    year: "2026",
    image: "",
    tagline: "Turn your Telegram storage into an unlimited, high-speed cloud drive with a modern web interface.",
    description: "FileGram is a modern cloud storage platform leveraging Telegram API as an unlimited, zero-cost backend storage layer. Built with Next.js 14, Tailwind CSS, Supabase Auth, and GramJS/Telegram API for high-speed file chunking, instant stream playback, and file sharing.",
    bgGradient: "from-cyan-950 via-sky-950 to-[#050507]",
    details: {
      role: "Full-Stack Web Architect",
      client: "FileGram Platform",
      engine: "Next.js 14 / Telegram API / Supabase / Tailwind",
      timeline: "2026",
      videoUrl: null,
      liveUrl: "https://filegramm.vercel.app/"
    },
    metrics: [
      { label: "STORAGE ENGINE", value: "Telegram API Chunking" },
      { label: "BANDWIDTH", value: "Unlimited Free Transfer" },
      { label: "FRAMEWORK", value: "Next.js 14 / Supabase" }
    ]
  },
  {
    id: "04",
    title: "ESTATEOS",
    category: "AI Real Estate CRM & WhatsApp Operating System",
    categories: ["WEB DEV", "SAAS", "AI AGENT", "FULLSTACK"],
    subtitle: "04 / REAL ESTATE SAAS",
    year: "2026",
    image: "",
    tagline: "Minimalist AI-Powered Operating System for Real Estate Brokers with WhatsApp Lead Automation & Voice Follow-ups.",
    description: "EstateOS is an end-to-end SaaS platform built for Indian real estate agents. Features a WhatsApp-first AI lead qualification agent (Aria) with Hinglish support, real-time Google Sheets CRM sync, automated Sarvam AI Hindi voice follow-up callers, and instant property video walkthrough generators.",
    bgGradient: "from-emerald-950 via-zinc-900 to-[#050507]",
    details: {
      role: "Founder & Lead Architect",
      client: "EstateOS SaaS Platform",
      engine: "Next.js 14 / n8n / Claude API / Sarvam AI",
      timeline: "2026",
      videoUrl: null,
      liveUrl: "http://estateos-os.vercel.app/"
    },
    metrics: [
      { label: "WHATSAPP BOT", value: "Multilingual Aria AI" },
      { label: "VOICE CALLS", value: "Sarvam AI Hindi TTS" },
      { label: "CRM STORAGE", value: "Real-time Sheets & Drive" }
    ]
  },
  {
    id: "05",
    title: "BOXCRICK",
    category: "Box Cricket Turf Booking & Management System",
    categories: ["WEB DEV", "SAAS", "TURF BOOKING", "FULLSTACK"],
    subtitle: "05 / CRICKET TURF BOOKING",
    year: "2026",
    image: "",
    tagline: "Full-Stack Box Cricket Turf Booking & Live Score Management Platform.",
    description: "BoxCrick is a premier web platform designed for box cricket turf owners and players. Features real-time slot availability, instant online booking & payment integration, tournament leaderboard tracking, and automated booking receipts.",
    bgGradient: "from-green-950 via-emerald-950 to-[#050507]",
    details: {
      role: "Lead Full-Stack Developer",
      client: "BoxCrick Sports",
      engine: "React / Firebase / Node.js / Tailwind CSS",
      timeline: "2026",
      videoUrl: null,
      liveUrl: "https://boxcrick.web.app/"
    },
    metrics: [
      { label: "BOOKING ENGINE", value: "Real-time Slot Booking" },
      { label: "PAYMENT GATEWAY", value: "Instant UPI & Cards" },
      { label: "HOSTING", value: "Firebase Cloud Hosting" }
    ]
  },
  {
    id: "06",
    title: "VISORA",
    category: "AI Visual Context Engine & MCP Component Patcher",
    categories: ["WEB DEV", "AI AGENT", "MCP SERVER", "FULLSTACK"],
    subtitle: "06 / AI VISUAL ENGINE",
    year: "2026",
    image: "",
    tagline: "The Visual Context Engine for AI Coding — Real-time component selector & MCP patcher.",
    description: "Visora is an advanced AI visual context engine developed by Visionatrixx. It connects AI coding assistants directly to frontend DOM components via the Model Context Protocol (MCP), allowing developers to visually select, patch, and iterate on live React & Vite user interfaces in real time.",
    bgGradient: "from-indigo-950 via-slate-900 to-[#050507]",
    details: {
      role: "Lead AI Systems Developer",
      client: "Visionatrix AI Core",
      engine: "MCP / React / Vite / TypeScript / Node",
      timeline: "2026",
      videoUrl: null,
      liveUrl: "https://visora-demo.vercel.app/"
    },
    metrics: [
      { label: "AI CORE", value: "Model Context Protocol (MCP)" },
      { label: "DOM PATCHER", value: "Real-time Component Sync" },
      { label: "FRAMEWORK", value: "React / Vite / Node" }
    ]
  },
  {
    id: "07",
    title: "JAIMIN FILMS",
    category: "Cinematic Film Studio & Video Production Web Platform",
    categories: ["WEB DEV", "FILM STUDIO", "VIDEO PORTFOLIO", "FULLSTACK"],
    subtitle: "07 / FILM STUDIO PORTAL",
    year: "2026",
    image: "",
    tagline: "Immersive video portfolio & cinematic production showcase engineered with smooth motion physics.",
    description: "An ultra-sleek digital showcase platform designed for Jaimin Films. Highlights high-definition commercial films, director cuts, wedding cinematics, and video portfolios with seamless 4K video streaming and dynamic project filtering.",
    bgGradient: "from-blue-950 via-slate-900 to-[#050507]",
    details: {
      role: "Creative Web Architect",
      client: "Jaimin Films Studio",
      engine: "Next.js / React / Framer Motion / Video CDN",
      timeline: "2026",
      videoUrl: null,
      liveUrl: "http://jaimin-films.vercel.app/"
    },
    metrics: [
      { label: "VIDEO STREAMING", value: "4K Master Playback" },
      { label: "UI ACCELERATION", value: "Hardware Accelerated" },
      { label: "RESPONSIVENESS", value: "All Breakpoints" }
    ]
  }
];

export const initialServices: ServiceItem[] = [
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

export const initialTestimonials: Testimonial[] = [
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

export const initialProposals: Proposal[] = [];
