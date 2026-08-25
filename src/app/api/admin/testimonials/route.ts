import { NextResponse } from "next/server";
import { validateAdminSession, unauthorizedResponse } from "@/utils/adminAuth";
import { getSupabaseAdmin } from "@/utils/supabaseServer";

// POST: Add a new testimonial
export async function POST(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { data, error } = await getSupabaseAdmin()
      .from("testimonials")
      .insert([body])
      .select();

    if (error) throw error;
    return NextResponse.json({ data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update a testimonial
export async function PUT(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing testimonial id" }, { status: 400 });

    const { data, error } = await getSupabaseAdmin()
      .from("testimonials")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json({ data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a testimonial
export async function DELETE(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing testimonial id" }, { status: 400 });

    const { error } = await getSupabaseAdmin()
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
