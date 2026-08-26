"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { 
  Project, 
  ServiceItem, 
  Testimonial, 
  Proposal, 
  AdminContextType 
} from "@/types/admin";
import { 
  initialProjects, 
  initialServices, 
  initialTestimonials 
} from "@/data/initialAdminData";

// Re-export types so existing imports from "@/context/AdminContext" continue working seamlessly!
export type { Project, ServiceItem, Testimonial, Proposal, AdminContextType };

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Helper to safely format error objects into strings for clean console output
const formatErrorMsg = (err: unknown): string => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return JSON.stringify(err);
};

// -------------------------------------------------------------
// Database Mappers
// -------------------------------------------------------------
interface DbProjectRow {
  id: string;
  title: string;
  category: string;
  categories?: string[];
  subtitle?: string;
  year?: string;
  image?: string;
  tagline?: string;
  description?: string;
  bg_gradient?: string;
  details?: {
    client?: string;
    timeline?: string;
    role?: string;
    engine?: string;
    videoUrl?: string | null;
    images?: string[];
    liveUrl?: string | null;
  };
  metrics?: { label: string; value: string }[];
}

const mapProjectFromDb = (dbProj: DbProjectRow): Project => ({
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
    images: dbProj.details?.images || [],
    liveUrl: dbProj.details?.liveUrl || null
  },
  metrics: dbProj.metrics || []
});

const mapProjectToDb = (proj: Project) => ({
  title: proj.title,
  category: proj.category,
  categories: proj.categories || [],
  subtitle: proj.subtitle || "",
  year: proj.year || "2026",
  image: proj.image || "",
  tagline: proj.tagline || "",
  description: proj.description || "",
  bg_gradient: proj.bgGradient || "from-slate-900 via-sky-950 to-[#050507]",
  details: proj.details || {},
  metrics: proj.metrics
});



interface DbServiceRow {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
  hud_title?: string;
  hud_items?: { label: string; value: string }[];
  bullets?: string[];
  tools?: string[];
  canvas_type?: string;
}

const mapServiceFromDb = (dbService: DbServiceRow): ServiceItem => ({
  id: dbService.id,
  title: dbService.title,
  description: dbService.description,
  iconName: dbService.icon_name || "Sparkles",
  hudTitle: dbService.hud_title || "",
  hudItems: dbService.hud_items || [],
  bullets: dbService.bullets || [],
  tools: dbService.tools || [],
  canvasType: dbService.canvas_type || "webdev"
});

const mapServiceToDb = (service: ServiceItem) => ({
  title: service.title,
  description: service.description,
  icon_name: service.iconName,
  hud_title: service.hudTitle,
  hud_items: service.hudItems,
  bullets: service.bullets,
  tools: service.tools,
  canvas_type: service.canvasType
});

interface DbTestimonialRow {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  is_active?: boolean;
}

const mapTestimonialFromDb = (dbTest: DbTestimonialRow): Testimonial => ({
  id: dbTest.id,
  quote: dbTest.quote,
  author: dbTest.author,
  role: dbTest.role,
  company: dbTest.company,
  rating: dbTest.rating,
  isActive: dbTest.is_active ?? true
});

const mapTestimonialToDb = (test: Testimonial) => ({
  quote: test.quote,
  author: test.author,
  role: test.role,
  company: test.company,
  rating: test.rating,
  is_active: test.isActive ?? true
});

interface DbProposalRow {
  id: string;
  full_name: string;
  email: string;
  organization: string;
  service: string;
  details?: string;
  budget: string;
  file_name?: string | null;
  timestamp: string;
  status: Proposal["status"];
}

const mapProposalFromDb = (dbProp: DbProposalRow): Proposal => ({
  id: dbProp.id,
  fullName: dbProp.full_name,
  email: dbProp.email,
  organization: dbProp.organization,
  service: dbProp.service,
  details: dbProp.details || "",
  budget: dbProp.budget,
  fileName: dbProp.file_name,
  timestamp: dbProp.timestamp,
  status: dbProp.status
});

const mapProposalToDb = (prop: Omit<Proposal, "id" | "timestamp" | "status"> & { status?: Proposal["status"] }) => ({
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
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate public data from Supabase (read-only via anon key — safe with locked RLS)
  useEffect(() => {
    async function fetchPublicData() {
      try {
        const [projRes, servRes, testRes] = await Promise.all([
          supabase.from("projects").select("*").order("id", { ascending: true }),
          supabase.from("services").select("*").order("id", { ascending: true }),
          supabase.from("testimonials").select("*").order("id", { ascending: true })
        ]);

        if (projRes.data) {
          setProjects(projRes.data.map(mapProjectFromDb));
        }
        if (servRes.data && servRes.data.length > 0) {
          setServices(servRes.data.map(mapServiceFromDb));
        }
        if (testRes.data && testRes.data.length > 0) {
          setTestimonials(testRes.data.map(mapTestimonialFromDb));
        }
      } catch (error) {
        console.warn("Error hydrating public data from Supabase (using fallback local data):", formatErrorMsg(error));
      } finally {
        setIsLoaded(true);
      }
    }

    // Fetch proposals via server API (admin-only, requires session cookie)
    async function fetchProposals() {
      try {
        const res = await fetch("/api/admin/proposals");
        if (res.ok) {
          const { data } = await res.json();
          if (data && data.length > 0) {
            setProposals(data.map(mapProposalFromDb));
          }
        }
        // If 401, user is not admin — proposals stays empty (expected for public visitors)
      } catch {
        // Silently fail — proposals not visible to public
      }
    }

    fetchPublicData();
    fetchProposals();
  }, []);

  // Supabase Realtime subscriptions for live synchronization (public read-only tables)
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
            const mapped = (data || []).map(mapProjectFromDb);
            setProjects(mapped);
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
            const mapped = mapServiceFromDb(payload.new as DbServiceRow);
            setServices(prev => {
              if (prev.some(s => s.id === mapped.id)) return prev;
              return [...prev, mapped];
            });
          } else if (payload.eventType === "UPDATE") {
            const mapped = mapServiceFromDb(payload.new as DbServiceRow);
            setServices(prev => prev.map(s => (s.id === mapped.id ? mapped : s)));
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id: string }).id;
            setServices(prev => prev.filter(s => s.id !== oldId));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "testimonials" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const mapped = mapTestimonialFromDb(payload.new as DbTestimonialRow);
            setTestimonials(prev => {
              if (prev.some(t => t.id === mapped.id)) return prev;
              return [...prev, mapped];
            });
          } else if (payload.eventType === "UPDATE") {
            const mapped = mapTestimonialFromDb(payload.new as DbTestimonialRow);
            setTestimonials(prev => prev.map(t => (t.id === mapped.id ? mapped : t)));
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id: string }).id;
            setTestimonials(prev => prev.filter(t => t.id !== oldId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // -------------------------------------------------------------
  // Projects CRUD — via server API routes (service role key)
  // -------------------------------------------------------------
  const addProject = async (p: Omit<Project, "id">) => {
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

    const pWithSeqSubtitle = { ...p };
    if (!p.subtitle || p.subtitle === `${p.title} Spec` || p.subtitle === `${p.title.toUpperCase()} Spec`) {
      pWithSeqSubtitle.subtitle = `${nextId} / ${p.title}`;
    }

    const newProj: Project = {
      ...pWithSeqSubtitle,
      id: nextId
    };

    setProjects(prev => [...prev, newProj]);

    try {
      const dbProj = {
        ...mapProjectToDb(pWithSeqSubtitle as Project),
        id: nextId
      };

      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbProj)
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to add project on server:", err);
      }
    } catch (error) {
      console.error("Failed to add project:", formatErrorMsg(error));
    }
  };

  const updateProject = async (id: string, p: Project) => {
    setProjects(prev => prev.map(item => (item.id === id ? p : item)));

    try {
      const dbProj = mapProjectToDb(p);

      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...dbProj })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to update project on server:", err);
      }
    } catch (error) {
      console.error("Failed to update project:", formatErrorMsg(error));
    }
  };

  const deleteProject = async (id: string) => {
    // Optimistically remove from state immediately so UI updates instantly
    setProjects(prev => prev.filter(item => item.id !== id));

    try {
      const res = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to delete project on server:", err);
      }
    } catch (error) {
      console.error("Failed to delete project:", formatErrorMsg(error));
    }
  };

  const reorderProjects = async (newOrder: Project[]) => {
    try {
      setProjects(newOrder);

      const orderedIds = newOrder.map(p => p.id);
      if (orderedIds.length === 0) return;

      const { error: rpcError } = await supabase.rpc("reorder_projects", {
        p_ids: orderedIds
      });

      if (rpcError) throw rpcError;
    } catch (error) {
      console.error("Failed to persist project reordering:", formatErrorMsg(error));
    }
  };

  // -------------------------------------------------------------
  // Services CRUD — via server API route
  // -------------------------------------------------------------
  const updateService = async (id: string, s: ServiceItem) => {
    try {
      const dbService = mapServiceToDb(s);

      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...dbService })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update service");
      }

      setServices(prev => prev.map(item => (item.id === id ? s : item)));
    } catch (error) {
      console.error("Failed to update service:", formatErrorMsg(error));
    }
  };

  // -------------------------------------------------------------
  // Testimonials CRUD — via server API route
  // -------------------------------------------------------------
  const addTestimonial = async (t: Omit<Testimonial, "id">) => {
    try {
      const dbTest = mapTestimonialToDb(t as Testimonial);

      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbTest)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add testimonial");
      }

      const { data } = await res.json();
      if (data) {
        const newTest = mapTestimonialFromDb(data);
        setTestimonials(prev => [...prev, newTest]);
      }
    } catch (error) {
      console.error("Failed to add testimonial:", formatErrorMsg(error));
    }
  };

  const updateTestimonial = async (id: string, t: Testimonial) => {
    try {
      const dbTest = mapTestimonialToDb(t);

      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...dbTest })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update testimonial");
      }

      setTestimonials(prev => prev.map(item => (item.id === id ? t : item)));
    } catch (error) {
      console.error("Failed to update testimonial:", formatErrorMsg(error));
    }
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials(prev => prev.filter(item => item.id !== id));

    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to delete testimonial on server:", err);
      }
    } catch (error) {
      console.error("Failed to delete testimonial:", formatErrorMsg(error));
    }
  };

  // -------------------------------------------------------------
  // Proposals CRM CRUD — via server API route
  // -------------------------------------------------------------
  const addProposal = async (p: Omit<Proposal, "id" | "timestamp" | "status"> & { fileName?: string | null }) => {
    try {
      // Contact form submissions still use the anon key INSERT policy (public access)
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
      console.error("Failed to add proposal:", formatErrorMsg(error));
    }
  };

  const updateProposalStatus = async (id: string, status: Proposal["status"]) => {
    setProposals(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));

    try {
      const res = await fetch("/api/admin/proposals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to update proposal status on server:", err);
      }
    } catch (error) {
      console.error("Failed to update proposal status:", formatErrorMsg(error));
    }
  };

  const deleteProposal = async (id: string) => {
    setProposals(prev => prev.filter(item => item.id !== id));

    try {
      const res = await fetch("/api/admin/proposals", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to delete proposal on server:", err);
      }
    } catch (error) {
      console.error("Failed to delete proposal:", formatErrorMsg(error));
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
        reorderProjects,
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
