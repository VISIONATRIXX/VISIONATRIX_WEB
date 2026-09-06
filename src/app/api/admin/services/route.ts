import { NextResponse } from "next/server";
import { validateAdminSession, unauthorizedResponse } from "@/utils/adminAuth";
import { getSupabaseAdmin } from "@/utils/supabaseServer";

interface ServicePayload {
  title?: string;
  description?: string;
  icon_name?: string;
  hud_title?: string;
  hud_items?: Array<{ label: string; value: string }>;
  bullets?: string[];
  tools?: string[];
  canvas_type?: string;
}

function sanitizeServiceInput(data: Record<string, unknown>): ServicePayload {
  const sanitized: ServicePayload = {};
  if (typeof data.title === "string") sanitized.title = data.title.trim();
  if (typeof data.description === "string") sanitized.description = data.description.trim();
  if (typeof data.icon_name === "string") sanitized.icon_name = data.icon_name.trim();
  if (typeof data.hud_title === "string") sanitized.hud_title = data.hud_title.trim();
  if (typeof data.canvas_type === "string") sanitized.canvas_type = data.canvas_type.trim();
  if (Array.isArray(data.bullets)) {
    sanitized.bullets = data.bullets.filter((b): b is string => typeof b === "string");
  }
  if (Array.isArray(data.tools)) {
    sanitized.tools = data.tools.filter((t): t is string => typeof t === "string");
  }
  if (Array.isArray(data.hud_items)) {
    sanitized.hud_items = data.hud_items.filter(
      (item): item is { label: string; value: string } =>
        Boolean(item && typeof item === "object" && "label" in item && "value" in item)
    );
  }
  return sanitized;
}

// PUT: Update a service
export async function PUT(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const body = await request.json();
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "Missing or invalid service id" }, { status: 400 });
    }

    const { id, ...rawUpdates } = body;
    const sanitizedUpdates = sanitizeServiceInput(rawUpdates);

    const { data, error } = await getSupabaseAdmin()
      .from("services")
      .update(sanitizedUpdates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json({ data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update service" }, { status: 500 });
  }
}
