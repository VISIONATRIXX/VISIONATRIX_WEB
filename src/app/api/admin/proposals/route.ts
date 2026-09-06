import { NextResponse } from "next/server";
import { validateAdminSession, unauthorizedResponse, getClientIp, checkRateLimit } from "@/utils/adminAuth";
import { getSupabaseAdmin } from "@/utils/supabaseServer";

const VALID_STATUSES = ["Pending", "In-Review", "Approved", "Archived"] as const;

interface ProposalPayload {
  full_name?: string;
  email?: string;
  organization?: string;
  service?: string;
  details?: string;
  budget?: string;
  file_name?: string;
  status?: string;
}

function sanitizeProposalInput(data: Record<string, unknown>): ProposalPayload {
  const sanitized: ProposalPayload = {};
  if (typeof data.full_name === "string") sanitized.full_name = data.full_name.trim();
  if (typeof data.email === "string") sanitized.email = data.email.trim();
  if (typeof data.organization === "string") sanitized.organization = data.organization.trim();
  if (typeof data.service === "string") sanitized.service = data.service.trim();
  if (typeof data.details === "string") sanitized.details = data.details.trim();
  if (typeof data.budget === "string") sanitized.budget = data.budget.trim();
  if (typeof data.file_name === "string") sanitized.file_name = data.file_name.trim();
  if (typeof data.status === "string" && VALID_STATUSES.includes(data.status as any)) {
    sanitized.status = data.status;
  }
  return sanitized;
}

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
    return NextResponse.json({ error: error.message || "Failed to fetch proposals" }, { status: 500 });
  }
}

// PATCH: Update proposal status
export async function PATCH(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const body = await request.json();
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json({ error: "Missing or invalid proposal id" }, { status: 400 });
    }

    const { id, ...rawUpdates } = body;
    const sanitizedUpdates = sanitizeProposalInput(rawUpdates);

    // Only allow status updates via this endpoint
    if (!sanitizedUpdates.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from("proposals")
      .update(sanitizedUpdates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json({ data: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update proposal status" }, { status: 500 });
  }
}

// DELETE: Delete a proposal
export async function DELETE(request: Request) {
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { id } = body;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing or invalid proposal id" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("proposals")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete proposal" }, { status: 500 });
  }
}
