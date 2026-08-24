export interface Metric {
  label: string;
  value: string;
}

export interface ProjectDetails {
  client: string;
  timeline: string;
  role: string;
  engine: string;
  videoUrl?: string | null;
  images?: string[] | null;
  liveUrl?: string | null;
}

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
  details: ProjectDetails;
  metrics: Metric[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
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

export interface AdminContextType {
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
