import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { validateAdminSession, unauthorizedResponse } from "@/utils/adminAuth";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "visionatrix-web";
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;

// Allowed MIME type prefixes
const ALLOWED_MIME_PREFIXES = ["image/", "video/"];
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

// Initialize S3 client configured for Cloudflare R2 storage
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
});

import { checkRateLimit, getClientIp } from "@/utils/rateLimiter";

export async function POST(req: Request) {
  // Validate R2 configuration first
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error("Missing Cloudflare R2 environment variables on the server.");
    return NextResponse.json(
      { error: "Server Configuration Error: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, or R2_SECRET_ACCESS_KEY is missing." },
      { status: 500 }
    );
  }

  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(`upload:${ip}`, 20, 60 * 1000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many upload requests. Please wait a minute." },
      { status: 429 }
    );
  }

  // Require admin authentication
  if (!(await validateAdminSession())) return unauthorizedResponse();

  try {
    const { fileName, contentType, fileSize } = await req.json();

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "Missing required filename or contentType parameter." },
        { status: 400 }
      );
    }

    // Validate MIME type
    const isAllowed = ALLOWED_MIME_PREFIXES.some((prefix) =>
      contentType.toLowerCase().startsWith(prefix)
    );
    if (!isAllowed) {
      return NextResponse.json(
        { error: `Content type "${contentType}" is not allowed. Only image/* and video/* are permitted.` },
        { status: 400 }
      );
    }

    // Validate file size if provided
    if (fileSize && typeof fileSize === "number" && fileSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.` },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp to prevent collisions
    const uniqueFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const key = `uploads/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    // Generate S3 presigned URL valid for 15 minutes (900 seconds)
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });

    // Format public URL using custom subdomain or Cloudflare R2 development subdomain
    const publicUrl = R2_PUBLIC_DOMAIN
      ? `${R2_PUBLIC_DOMAIN.replace(/\/$/, "")}/${key}`
      : `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

    return NextResponse.json({ signedUrl, publicUrl, key });
  } catch (err: any) {
    console.error("Failed to generate R2 presigned URL:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate R2 presigned URL." },
      { status: 500 }
    );
  }
}
