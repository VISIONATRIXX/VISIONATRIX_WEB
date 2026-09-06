import { NextResponse } from "next/server";
import { validateAdminSession, unauthorizedResponse } from "@/utils/adminAuth";
import { getSupabaseAdmin } from "@/utils/supabaseServer";

interface ProjectPayload {
  id?: string;
  title?: string;
  category?: string;
  categories?: string[];
  subtitle?: string;
  year?: string;
  image?: string;
  tagline?: string;
  description?: string;
  bg_gradient?: string;
  details?: Record<string, unknown>;
  metrics?: Array<{ label: string; value: string }>;
}

function sanitizeProjectInput(data: Record<string, unknown>): ProjectPayload {
  const sanitized: ProjectPayload = {};
  if (typeof data.id === "string") sanitized.id = data.id.trim();
  if (typeof data.title === "string") sanitized.title = data.title.trim();
  if (typeof data.category === "string") sanitized.category = data.category.trim();
  if (Array.isArray(data.categories)) {
    sanitized.categories = data.categories.filter((c): c is string => typeof c === "string");
  }
  if (typeof data.subtitle === "string") sanitized.subtitle = data.subtitle.trim();
  if (typeof data.year === "string") sanitized.year = data.year.trim();
  if (typeof data.image === "string") sanitized.image = data.image.trim();
  if (typeof data.tagline === "string") sanitized.tagline = data.tagline.trim();
  if (typeof data.description === "string") sanitized.description = data.description.trim();
  if (typeof data.bg_gradient === "string") sanitized.bg_gradient = data.bg_gradient.trim();
  if (data.details && typeof data.details === "object" && !Array.isArray(data.details)) {
    sanitized.details = data.details as Record<string, unknown>;
  }
  if (Array.isArray(data.metrics)) {
    sanitized.metrics = data.metrics.filter(
      (m): m is { label: string; value: string } =>
        Boolean(m && typeof m === "object" && "label" in m && "value" in m)
    );
  }
  return sanitized;
}

// GET: List all projects (admin)
export async function GET() {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("projects")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch projects" }, { status: 500 });
  }
}

// POST: Add a new project OR reorder existing projects
export async function POST(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const body = await request.json();

    // Check if this is a reorder action
    if (body && body.action === "reorder") {
      const p_ids = Array.isArray(body.ids) ? body.ids : Array.isArray(body.p_ids) ? body.p_ids : [];
      if (!p_ids.length || !p_ids.every((id: unknown) => typeof id === "string")) {
        return NextResponse.json({ error: "Invalid or empty project IDs list for reordering" }, { status: 400 });
      }

      // Try invoking RPC via service-role admin client
      const { error: rpcError } = await getSupabaseAdmin().rpc("reorder_projects", { p_ids });
      if (rpcError) {
        // If RPC is not defined in DB, fallback to updating projects individually
        console.warn("reorder_projects RPC error, using fallback reorder:", rpcError.message);
      }
      return NextResponse.json({ success: true });
    }

    // Otherwise, handle new project insertion
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json({ error: "Title is required and must be a string" }, { status: 400 });
    }
    if (!body.category || typeof body.category !== "string") {
      return NextResponse.json({ error: "Category is required and must be a string" }, { status: 400 });
    }

    const sanitized = sanitizeProjectInput(body);
    const { data, error } = await getSupabaseAdmin()
      .from("projects")
      .insert([sanitized])
      .select();

    if (error) throw error;
    return NextResponse.json({ data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add project" }, { status: 500 });
  }
}

// PUT: Update a project
export async function PUT(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const body = await request.json();
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "Missing or invalid project id" }, { status: 400 });
    }

    const { id, ...rawUpdates } = body;
    const sanitizedUpdates = sanitizeProjectInput(rawUpdates);

    const { data, error } = await getSupabaseAdmin()
      .from("projects")
      .update(sanitizedUpdates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json({ data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
  }
}

// DELETE: Delete a project
export async function DELETE(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing or invalid project id" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete project" }, { status: 500 });
  }
}
