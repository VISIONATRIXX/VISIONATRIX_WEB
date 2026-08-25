import { NextResponse } from "next/server";
import { validateAdminSession, unauthorizedResponse } from "@/utils/adminAuth";
import { getSupabaseAdmin } from "@/utils/supabaseServer";

// PUT: Update a service
export async function PUT(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing service id" }, { status: 400 });

    const { data, error } = await getSupabaseAdmin()
      .from("services")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json({ data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
