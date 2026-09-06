import { NextResponse } from "next/server";
import { validateAdminSession, unauthorizedResponse } from "@/utils/adminAuth";
import { getSupabaseAdmin } from "@/utils/supabaseServer";

interface TestimonialPayload {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
  rating?: number;
  is_active?: boolean;
}

function sanitizeTestimonialInput(data: Record<string, unknown>): TestimonialPayload {
  const sanitized: TestimonialPayload = {};
  if (typeof data.quote === "string") sanitized.quote = data.quote.trim();
  if (typeof data.author === "string") sanitized.author = data.author.trim();
  if (typeof data.role === "string") sanitized.role = data.role.trim();
  if (typeof data.company === "string") sanitized.company = data.company.trim();
  if (typeof data.rating === "number" && data.rating >= 1 && data.rating <= 5) {
    sanitized.rating = Math.round(data.rating);
  }
  if (typeof data.is_active === "boolean") sanitized.is_active = data.is_active;
  return sanitized;
}

// POST: Add a new testimonial
export async function POST(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const body = await request.json();
    if (!body.quote || typeof body.quote !== "string") {
      return NextResponse.json({ error: "Quote is required and must be a string" }, { status: 400 });
    }
    if (!body.author || typeof body.author !== "string") {
      return NextResponse.json({ error: "Author is required and must be a string" }, { status: 400 });
    }

    const sanitized = sanitizeTestimonialInput(body);
    const { data, error } = await getSupabaseAdmin()
      .from("testimonials")
      .insert([sanitized])
      .select();

    if (error) throw error;
    return NextResponse.json({ data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create testimonial" }, { status: 500 });
  }
}

// PUT: Update a testimonial
export async function PUT(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const body = await request.json();
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "Missing or invalid testimonial id" }, { status: 400 });
    }

    const { id, ...rawUpdates } = body;
    const sanitizedUpdates = sanitizeTestimonialInput(rawUpdates);

    const { data, error } = await getSupabaseAdmin()
      .from("testimonials")
      .update(sanitizedUpdates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json({ data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update testimonial" }, { status: 500 });
  }
}

// DELETE: Delete a testimonial
export async function DELETE(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing or invalid testimonial id" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete testimonial" }, { status: 500 });
  }
}
