import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Blob's free tier is ~1 GB. Unresized phone photos are 4-6 MB each, so a few
// hundred product shots would blow through it. The admin UI downscales before
// upload; this is the backstop.
const MAX_BYTES = 2 * 1024 * 1024;

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

/**
 * Connecting a Blob store in Vercel names the variable after the prefix chosen
 * in the dashboard, so it may arrive as BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN
 * rather than the plain name the SDK expects. Accept either.
 */
function blobToken() {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN ||
    undefined
  );
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Not authorised" }, { status: 401 });
  }

  const token = blobToken();

  if (!token) {
    return NextResponse.json(
      { message: "Image storage is not configured. Add BLOB_READ_WRITE_TOKEN." },
      { status: 503 },
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const entry = form.get("file");
    if (entry instanceof File) file = entry;
  } catch {
    return NextResponse.json({ message: "Invalid upload" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { message: "Only JPG, PNG, WebP, or AVIF images are allowed" },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: `Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 2 MB.` },
      { status: 413 },
    );
  }

  try {
    const safeName = (file.name || "product").replace(/[^a-zA-Z0-9._-]/g, "-").slice(-60);

    const blob = await put(`products/${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
      token,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("[upload] blob upload failed:", error);
    return NextResponse.json({ message: "Upload failed. Please try again." }, { status: 500 });
  }
}
