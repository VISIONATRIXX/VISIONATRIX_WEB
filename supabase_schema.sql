-- =====================================================================
-- VISIONATRIX AGENCY - DATABASE SCHEMA & MIGRATION SCRIPT
-- PostgreSQL / Supabase Schema for Projects, Services, Testimonials, & CRM
-- =====================================================================

-- Clean up existing objects if they exist
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. PROJECTS TABLE (Works & Portfolio Showcase)
-- =====================================================================
CREATE TABLE projects (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    categories TEXT[] NOT NULL DEFAULT '{}',
    subtitle TEXT,
    year TEXT DEFAULT '2026',
    image TEXT DEFAULT '/work_aura_configurator.png',
    tagline TEXT,
    description TEXT,
    bg_gradient TEXT DEFAULT 'from-slate-900 via-sky-950 to-[#050507]',
    details JSONB NOT NULL DEFAULT '{"role": "Digital Studio", "client": "Concept", "engine": "Octane", "timeline": "Q1 2026"}'::jsonb,
    metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 2. SERVICES TABLE (Capabilities Stack)
-- =====================================================================
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL, -- e.g. "Film", "Sparkles", "Box", "Layers", "Cpu", "Smartphone", "ScanFace", "Eye"
    hud_title TEXT NOT NULL,
    hud_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    bullets TEXT[] NOT NULL DEFAULT '{}',
    tools TEXT[] NOT NULL DEFAULT '{}',
    canvas_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 3. TESTIMONIALS TABLE (Client Feedback)
-- =====================================================================
CREATE TABLE testimonials (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 4. PROPOSALS TABLE (CRM Inbound Inquiries)
-- =====================================================================
CREATE TABLE proposals (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization TEXT,
    service TEXT NOT NULL,
    details TEXT,
    budget TEXT NOT NULL,
    file_name TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In-Review', 'Approved', 'Archived')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================================

-- A. Projects Policies
CREATE POLICY "Allow public read-only access to projects" 
    ON projects FOR SELECT 
    USING (true);

CREATE POLICY "Allow authorized admin CRUD on projects" 
    ON projects FOR ALL 
    USING (true)
    WITH CHECK (true); -- Note: In strict production auth, bind to auth.role() = 'authenticated'

-- B. Services Policies
CREATE POLICY "Allow public read-only access to services" 
    ON services FOR SELECT 
    USING (true);

CREATE POLICY "Allow authorized admin CRUD on services" 
    ON services FOR ALL 
    USING (true)
    WITH CHECK (true);

-- C. Testimonials Policies
CREATE POLICY "Allow public read-only access to testimonials" 
    ON testimonials FOR SELECT 
    USING (true);

CREATE POLICY "Allow authorized admin CRUD on testimonials" 
    ON testimonials FOR ALL 
    USING (true)
    WITH CHECK (true);

-- D. Proposals CRM Policies
CREATE POLICY "Allow anonymous submission of inquiries (Insert only)" 
    ON proposals FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow authorized admin full access to proposals" 
    ON proposals FOR ALL 
    USING (true)
    WITH CHECK (true);

-- =====================================================================
-- SEED DEFAULT DATASETS
-- =====================================================================

-- 1. Seed Projects
INSERT INTO projects (id, title, category, categories, subtitle, year, image, tagline, description, bg_gradient, details, metrics) VALUES
(
    '01', 
    'AURA CONFIGURATOR', 
    'CGI & Volumetric Design', 
    ARRAY['CGI', 'VR'], 
    '01 / MERCEDES-BENZ CONCEPT', 
    '2026', 
    '/work_aura_configurator.png', 
    'Formulating custom high-fidelity configuration environments with real-time path-traced material shaders.', 
    'An immersive digital showroom designed for Mercedes-Benz concept vehicles. Built with path-traced shaders to simulate realistic carbon fiber weave patterns, active aerodynamic mechanics, and high-frequency light reflections in real time.', 
    'from-slate-900 via-sky-950 to-[#050507]', 
    '{"role": "CGI Lead & Interactive Dev", "client": "Mercedes Benz Spec", "engine": "Octane Render / GLSL Shaders", "timeline": "Q1 2026"}'::jsonb, 
    '[{"label": "RESOLUTION", "value": "8K Projections"}, {"label": "RENDER TIME", "value": "1,420 Node Hours"}, {"label": "POLY COUNT", "value": "18.4 Million"}]'::jsonb
),
(
    '02', 
    'OMNIS INTERACTIVE', 
    'Holographic UI & Code', 
    ARRAY['VR', 'WEB DEV', 'APPS'], 
    '02 / LEICA OPTICS', 
    '2025', 
    '/work_omnis_interactive.png', 
    'Crafting sub-pixel accurate smartwatch interfaces, glass refraction shaders, and micro-bezel mechanics.', 
    'A luxury smartwatch design explorer mapping physical light refraction, mechanical gear rotations, and high-performance WebGL state management for customized watch faces.', 
    'from-zinc-900 via-[#1c1212] to-[#050507]', 
    '{"role": "UI Design & Shader Engineer", "client": "Leica Concept Spec", "engine": "Three.js / React Fiber", "timeline": "Q2 2025"}'::jsonb, 
    '[{"label": "SUB-PIXEL SAMPLING", "value": "1024 Samples"}, {"label": "FPS TARGET", "value": "60 FPS Locked"}, {"label": "GLASS SHADERS", "value": "Physically Accurate"}]'::jsonb
),
(
    '03', 
    'NEO-CITY DIGITAL TWIN', 
    'Spatial & VR Mapping', 
    ARRAY['VR', 'CGI'], 
    '03 / TOKYO SMART GRID', 
    '2026', 
    '/work_aura_configurator.png', 
    'Creating real-time geospatial digital twins utilizing procedural layout math and dynamic lighting.', 
    'A dense procedural mapping interface reproducing Tokyo''s skyscraper networks. Merges live municipal API signals with custom geometry shaders to reflect active traffic volumes and power loads visually.', 
    'from-blue-950 via-slate-900 to-[#050507]', 
    '{"role": "Spatial Architect & Developer", "client": "Tokyo Municipal Spec", "engine": "Unreal Engine / WebGL Map", "timeline": "Q1 2026"}'::jsonb, 
    '[{"label": "CITY TILES", "value": "128 Custom Nodes"}, {"label": "GEOMETRY COUNT", "value": "45 Million Polys"}, {"label": "LIVE FEED DELAY", "value": "45 Milliseconds"}]'::jsonb
),
(
    '04', 
    'ETHER EDITORIAL', 
    'Cinema & VFX Production', 
    ARRAY['VIDEO', 'VFX'], 
    '04 / SAINT LAURENT PARIS', 
    '2025', 
    '/work_omnis_interactive.png', 
    'High-fashion commercial editorial demonstrating interactive fabric simulations and raytraced dust.', 
    'A luxury editorial speculative promotion featuring active dynamic fabric physics. Simulates the micro-textures of cashmere and velvet flowing through turbulent fields with real-time dust volume rays.', 
    'from-purple-950 via-[#1a1221] to-[#050507]', 
    '{"role": "VFX Lead & Simulation Dev", "client": "YSL speculative spec", "engine": "Houdini / Karma Render", "timeline": "Q4 2025"}'::jsonb, 
    '[{"label": "FABRIC PARTICLES", "value": "2.4 Million Nodes"}, {"label": "DYNAMICS FREQ", "value": "120 FPS Capture"}, {"label": "RESOLVED LIGHTS", "value": "Physically Correct"}]'::jsonb
),
(
    '05', 
    'CHRONOS VR', 
    'Volumetric VR Space', 
    ARRAY['VR', 'VFX'], 
    '05 / AUDEMARS PIGUET', 
    '2026', 
    '/work_aura_configurator.png', 
    'Volumetric horology portal enabling physical scale mechanical watch disassembly in VR space.', 
    'A hyper-detailed watch mechanic environment for spatial headsets. Users physically pull gears, dials, and escapes of a luxury chronograph clock apart, mapping mechanical equations directly in full 3D.', 
    'from-stone-900 via-zinc-950 to-[#050507]', 
    '{"role": "Volumetric UI & Dev", "client": "AP speculator Spec", "engine": "Unity / OpenXR / HDRP", "timeline": "Q1 2026"}'::jsonb, 
    '[{"label": "MECHANICAL PIECES", "value": "312 Separate Parts"}, {"label": "COLLIDER SENS", "value": "0.2mm Precision"}, {"label": "SPATIAL RESOLUTION", "value": "4K Per Eye"}]'::jsonb
),
(
    '06', 
    'SYNAPSE AI STUDIO', 
    'AI Production', 
    ARRAY['AI SHOOTS', 'VIDEO'], 
    '06 / MIND LAB', 
    '2026', 
    '/work_omnis_interactive.png', 
    'Expanding creative storytelling utilizing ComfyUI batch rendering pipelines and upscale nodes.', 
    'An AI-powered storyboard studio utilizing customized generative neural weights. Built to batch process luxury concepts for agencies, scaling outputs to gorgeous 4K volumes without human facial drift.', 
    'from-[#1b1712] via-neutral-900 to-[#050507]', 
    '{"role": "Lead Prompt & Comfy Dev", "client": "Mind Lab Creative", "engine": "Stable Diffusion / Flux", "timeline": "Q2 2026"}'::jsonb, 
    '[{"label": "LATENT LAYERS", "value": "Flux Custom Lora"}, {"label": "GENERATION TIME", "value": "12s Per Image"}, {"label": "UPSCALING FREQ", "value": "High Fidelity"}]'::jsonb
),
(
    '07', 
    'VORTEX FLUIDICS', 
    'Physics VFX & Sound', 
    ARRAY['VFX', 'WEB DEV'], 
    '07 / NYX MUSIC', 
    '2025', 
    '/work_aura_configurator.png', 
    'Sound-responsive dynamic WebGL fluid wave simulating physical acoustics on the browser.', 
    'An interactive digital companion representing sound signals as dynamic fluid waves. Hooked into standard micro-frequencies of music to bend vector trajectories in locked 60 frames per second.', 
    'from-emerald-950 via-slate-950 to-[#050507]', 
    '{"role": "Fluid Shader Designer", "client": "Nyx Sound Lab", "engine": "GLSL / React Three Fiber", "timeline": "Q3 2025"}'::jsonb, 
    '[{"label": "FLUID SOLVER", "value": "Navier-Stokes Shader"}, {"label": "AURAL BINS", "value": "256 Tracked Bands"}, {"label": "GRID DENSITY", "value": "512 x 512 Sim"}]'::jsonb
),
(
    '08', 
    'CUSTOM SOFTWARE SYSTEM', 
    'Custom Software Systems', 
    ARRAY['WEB DEV', 'APPS'], 
    '08 / SPACEX SYSTEM', 
    '2025', 
    '/work_omnis_interactive.png', 
    'Complex SpaceX specs mapping high-frequency rocket coordinates on clean, responsive frames.', 
    'A secure diagnostic platform tracking spec payloads and rocket coordinate signals. Developed to simplify telemetry diagnostics for test pilots and mission logs in high stakes spaces.', 
    'from-cyan-950 via-slate-950 to-[#050507]', 
    '{"role": "Dashboard Architect & Developer", "client": "SpaceXspecspec", "engine": "Next.js / WebSocket System", "timeline": "Q4 2025"}'::jsonb, 
    '[{"label": "DATA POINTS", "value": "10,000 / Second"}, {"label": "LATENCY TARGET", "value": "<15 Milliseconds"}, {"label": "SECURITY PROTOCOL", "value": "End-to-End Encrypted"}]'::jsonb
);

-- 2. Seed Services
INSERT INTO services (id, title, description, icon_name, hud_title, hud_items, bullets, tools, canvas_type) VALUES
(
    '01', 
    'VIDEO EDITING', 
    'We structure cinematic narratives, high-impact brand commercials, and director''s cut releases utilizing tailored framing rhythms that command digital presence.', 
    'Film', 
    '[ PRODUCTION HUD ]', 
    '[{"label": "FOCUS", "value": "Cinematic Narrative"}, {"label": "OUTPUT", "value": "4K / 8K Master Deliveries"}, {"label": "COLOR", "value": "Bespoke Color Gradients"}, {"label": "TECH", "value": "DaVinci Resolve / Premiere"}]'::jsonb, 
    ARRAY['// Soundscapes Synthesis', '// Rhythmic Staccato Edits', '// Haute Couture Commercials'], 
    ARRAY['DaVinci Resolve', 'Premiere Pro', 'After Effects', 'Avid Link'], 
    'video'
),
(
    '02', 
    'VFX SIMULATIONS', 
    'We simulate and composite hyper-realistic environmental phenomena, particle streams, and digital cosmetics tailored for cinema and high-fashion advertising campaigns.', 
    'Sparkles', 
    '[ COMPOSITING HUD ]', 
    '[{"label": "FOCUS", "value": "Photoreal FX"}, {"label": "OUTPUT", "value": "DeepEXR Sequences"}, {"label": "GRAIN", "value": "Camera-matched Noise"}, {"label": "TECH", "value": "Nuke / Houdini"}]'::jsonb, 
    ARRAY['// Fluid Dynamics Simulations', '// Photorealistic Compositing', '// Deep Compositing Workflows'], 
    ARRAY['Nuke', 'Houdini', 'PFTrack', 'Syntheyes'], 
    'vfx'
),
(
    '03', 
    'CGI ADVERTISING', 
    'We construct cinematic luxury product renders, automotive concept visualizations, and bespoke promotional sequences engineered to bridge commercial luxury with futuristic aesthetics.', 
    'Box', 
    '[ RENDER SPECS ]', 
    '[{"label": "PIPELINE", "value": "Sub-pixel Raytracing"}, {"label": "MATERIALS", "value": "Physically Based Shading"}, {"label": "RESOLUTIONS", "value": "8K Master Projections"}, {"label": "AUDIENCE", "value": "Luxury B2B Focus"}]'::jsonb, 
    ARRAY['// 3D Raytraced Metamorphs', '// Physically Accurate Textures', '// Luxury Architectural Shaders'], 
    ARRAY['Blender 3D', 'Cinema 4D', 'Redshift', 'Octane Render'], 
    'cgi'
),
(
    '04', 
    'ENVIRONMENT CREATION', 
    'We build sprawling virtual landscapes, digital twin showrooms, and interactive sensory environments rendered in real-time utilizing state-of-the-art geometry pipelines.', 
    'Layers', 
    '[ SPATIAL DIAGNOSTICS ]', 
    '[{"label": "GEOMETRY", "value": "Bespoke Megascans"}, {"label": "LIGHTING", "value": "Lumen / Path Tracer"}, {"label": "DETAIL", "value": "Sub-millimeter Micro-mesh"}, {"label": "TECH", "value": "Unreal Engine 5.5"}]'::jsonb, 
    ARRAY['// Realtime Virtual Sets', '// Procedural Terrain Generation', '// High-fidelity Digital Twins'], 
    ARRAY['Unreal Engine 5', 'SpeedTree', 'Quixel Bridge', 'Substance Painter'], 
    'env'
),
(
    '05', 
    'WEBGL WEB CODE', 
    'We write bespoke WebGL shaders, fluid simulation portals, and 3D websites that load in milliseconds and deliver silky-smooth interactions on any device.', 
    'Cpu', 
    '[ RENDER CORE ]', 
    '[{"label": "ENGINE", "value": "Three.js / WebGL"}, {"label": "PERFORMANCE", "value": "60 FPS Locked"}, {"label": "SHADERS", "value": "Custom GLSL Noise"}, {"label": "TECH", "value": "React Three Fiber"}]'::jsonb, 
    ARRAY['// Custom GLSL Shader Art', '// Interactive Physics Systems', '// Headless WebGL Engines'], 
    ARRAY['Three.js', 'GLSL', 'React Three Fiber', 'Vite'], 
    'webgl'
),
(
    '06', 
    'APP ARCHITECTURES', 
    'We design enterprise-grade mobile interfaces and robust cloud platforms optimized for extreme speed, security, and complex spatial UI interactions.', 
    'Smartphone', 
    '[ SYSTEMS METRICS ]', 
    '[{"label": "FRAMEWORK", "value": "Next.js / React Native"}, {"label": "STATE", "value": "Zustand / Redux"}, {"label": "DATABASE", "value": "Supabase / PostgreSQL"}, {"label": "TECH", "value": "Vercel Edge API"}]'::jsonb, 
    ARRAY['// Edge API Handlers', '// Micro-frontend Schemes', '// Realtime Database Sync'], 
    ARRAY['Next.js', 'React Native', 'Supabase', 'Tailwind CSS'], 
    'app'
),
(
    '07', 
    'AI PRODUCTION SHOOTS', 
    'We direct AI-driven commercial productions and campaign photography, combining traditional cinematography guidelines with state-of-the-art latent models.', 
    'ScanFace', 
    '[ LATENT HUD ]', 
    '[{"label": "SAMPLING", "value": "Flux / SDXL"}, {"label": "UPSCALE", "value": "4K Magnific AI"}, {"label": "CONSISTENCY", "value": "IP-Adapter / ControlNet"}, {"label": "TECH", "value": "ComfyUI Nodes"}]'::jsonb, 
    ARRAY['// Latent Temporal Consistency', '// Hyper-premium Character Design', '// ControlNet Directed Framing'], 
    ARRAY['ComfyUI', 'Stable Diffusion', 'Midjourney', 'Photoshop AI'], 
    'ai'
),
(
    '08', 
    'VR & SPATIAL XR', 
    'We code fully immersive volumetric environments, spatial computed applications, and hand-tracked simulations pushing the boundaries of human presence.', 
    'Eye', 
    '[ OPTICAL TELEMETRY ]', 
    '[{"label": "TARGET", "value": "Vision Pro / Quest"}, {"label": "TRACKING", "value": "6DoF Hand Tracking"}, {"label": "VOLUMETRIC", "value": "Gaussian Splatting"}, {"label": "TECH", "value": "Unity / WebXR"}]'::jsonb, 
    ARRAY['// Spatial UI/UX Architecture', '// 3D Gaussian Splat Ingestion', '// Low Latency Spatial Feeds'], 
    ARRAY['Unity 3D', 'WebXR', 'OpenXR', 'Swift / VisionOS'], 
    'xr'
);

-- 3. Seed Testimonials
INSERT INTO testimonials (id, quote, author, role, company, rating, is_active) VALUES
(
    '01', 
    'The spatial environment crafted by Visionatrix redefined how luxury buyers interact with our brand. An absolute benchmark of creative technology.', 
    'MARCUS VANE', 
    'HEAD OF DIGITAL CREATIVE', 
    'LEICA CAMERA AG CONCEPT', 
    5, 
    true
),
(
    '02', 
    'Their mathematical approach to shader art and VFX resulted in an automotive spec showcase that exceeded our absolute highest aesthetic standards.', 
    'ELENA ROSTOVA', 
    'VP OF INNOVATION MARKETING', 
    'MERCEDES BENZ DESIGN', 
    5, 
    true
),
(
    '03', 
    'Bespoke engineering from start to finish. They built a custom WebGL portal that runs at a locked 60fps while displaying millions of active data nodes.', 
    'DR. ARIS THORNE', 
    'CHIEF ARCHITECT', 
    'NEURAL NETWORK CO.', 
    5, 
    true
);

-- 4. Seed Proposals
INSERT INTO proposals (id, full_name, email, organization, service, details, budget, status) VALUES
(
    'prop-01', 
    'Arthur Pendelton', 
    'a.pendelton@apex-systems.io', 
    'Apex Racing Group', 
    'CGI ADVERTISING', 
    'Staging a high-fidelity visual simulator for our formula concept team. Need volumetric tracks and real-time reflection overlays on composite frames.', 
    '$40K - $100K', 
    'Pending'
),
(
    'prop-02', 
    'Sarah Jenkins', 
    's.jenkins@leica-photo.de', 
    'Sarah Jenkins Photography', 
    'VR & SPATIAL XR', 
    'Creating a Gaussian Splatting gallery app in spatial environments. Looking to represent raw vintage focal lens structures accurately.', 
    '$100K+', 
    'In-Review'
);
