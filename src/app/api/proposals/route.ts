import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/utils/rateLimiter";
import { supabase } from "@/utils/supabase";

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: 5 proposal submissions per minute per IP
    const rateCheck = checkRateLimit(`proposal:${ip}`, 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many proposal submissions. Please wait a minute before submitting again." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { fullName, email, organization, service, details, budget, fileName } = body;

    // Validation
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    if (fullName.length > 100) {
      return NextResponse.json({ error: "Full name exceeds maximum length of 100 characters." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (email.length > 150) {
      return NextResponse.json({ error: "Email address exceeds maximum length of 150 characters." }, { status: 400 });
    }

    if (!service || typeof service !== "string" || !service.trim()) {
      return NextResponse.json({ error: "Service selection is required." }, { status: 400 });
    }

    if (!details || typeof details !== "string" || !details.trim()) {
      return NextResponse.json({ error: "Dossier specifications/details are required." }, { status: 400 });
    }
    if (details.length > 2000) {
      return NextResponse.json({ error: "Details exceed maximum length of 2000 characters." }, { status: 400 });
    }

    if (!budget || typeof budget !== "string" || !budget.trim()) {
      return NextResponse.json({ error: "Budget specification is required." }, { status: 400 });
    }

    const sanitizedData = {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      organization: typeof organization === "string" && organization.trim() ? organization.trim().slice(0, 100) : null,
      service: service.trim().slice(0, 100),
      details: details.trim().slice(0, 2000),
      budget: budget.trim().slice(0, 50),
      file_name: typeof fileName === "string" && fileName.trim() ? fileName.trim().slice(0, 150) : null,
      status: "Pending"
    };

    const { data, error } = await supabase
      .from("proposals")
      .insert([sanitizedData])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data?.[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Public proposal submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit proposal. Please try again later." },
      { status: 500 }
    );
  }
}
