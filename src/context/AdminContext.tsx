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
  initialTestimonials, 
  initialProposals 
} from "@/data/initialAdminData";

// Re-export types so existing imports from "@/context/AdminContext" continue working seamlessly!
export type { Project, ServiceItem, Testimonial, Proposal, AdminContextType };

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Helper to safely format error objects into strings for clean console output
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatErrorMsg = (err: any): string => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  return err.message || err.details || JSON.stringify(err);
};

// -------------------------------------------------------------
// Database Mappers
// -------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    images: dbProj.details?.images || [],
    liveUrl: dbProj.details?.liveUrl || null
  },
  metrics: dbProj.metrics || []
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapTestimonialFromDb = (dbTest: any): Testimonial => ({
  id: dbTest.id,
  quote: dbTest.quote,
  author: dbTest.author,
  role: dbTest.role,
  company: dbTest.company,
  rating: dbTest.rating,
  isActive: dbTest.is_active
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapTestimonialToDb = (test: any) => ({
  quote: test.quote,
  author: test.author,
  role: test.role,
  company: test.company,
  rating: test.rating,
  is_active: test.isActive
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          const mappedProjs = projRes.data.map(mapProjectFromDb);
          
          // Ensure all default initial live projects exist in the list
          initialProjects.forEach((initP) => {
            const hasP = mappedProjs.some(
              p => p.title.toUpperCase() === initP.title.toUpperCase() || 
                   (initP.details?.liveUrl && p.details?.liveUrl === initP.details.liveUrl)
            );
            if (!hasP) {
              mappedProjs.push(initP);
            }
          });

          // Deduplicate by title & re-index unique IDs cleanly
          const uniqueMap = new Map<string, Project>();
          mappedProjs.forEach(p => {
            const key = p.title.toUpperCase().trim();
            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, p);
            }
          });

          const cleanProjs = Array.from(uniqueMap.values()).map((p, idx) => ({
            ...p,
            id: (idx + 1).toString().padStart(2, '0')
          }));

          setProjects(cleanProjs);
        } else {
          setProjects(initialProjects);
        }
        if (servRes.data && servRes.data.length > 0) {
          setServices(servRes.data.map(mapServiceFromDb));
        }
        if (testRes.data && testRes.data.length > 0) {
          setTestimonials(testRes.data.map(mapTestimonialFromDb));
        }
        if (propRes.data && propRes.data.length > 0) {
          const mappedProps = propRes.data.map(mapProposalFromDb).filter(p => !p.organization?.toLowerCase().includes("aetheria"));
          setProposals(mappedProps);
        } else {
          setProposals([]);
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

      // Auto-assign the formatted index to the subtitle if not specified
      const pWithSeqSubtitle = { ...p };
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
