import { NextResponse } from "next/server";
import { validateAdminSession, unauthorizedResponse } from "@/utils/adminAuth";
import { getSupabaseAdmin } from "@/utils/supabaseServer";

// GET: List all proposals (admin only — PII)
export async function GET() {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("proposals")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update proposal status
export async function PATCH(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const validStatuses = ["Pending", "In-Review", "Approved", "Archived"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("proposals")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json({ data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a proposal
export async function DELETE(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing proposal id" }, { status: 400 });

    const { error } = await getSupabaseAdmin()
      .from("proposals")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
