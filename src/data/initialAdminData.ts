import { Project, ServiceItem, Testimonial, Proposal } from "@/types/admin";

export const initialProjects: Project[] = [];

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
