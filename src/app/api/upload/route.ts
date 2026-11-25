import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { detectImageType, MAX_UPLOAD_BYTES, safeBaseName } from "@/lib/upload";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  if (!(await isAdmin(req))) {
    return NextResponse.json(
      {
        error:
          "Not signed in. Log in at /admin/login in a new tab, then try again.",
      },
      { status: 401 },
    );
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File is over 5 MB" }, { status: 413 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    // Type from the bytes, never the name: html or svg here would run as this site.
    const ext = detectImageType(buffer);
    if (!ext) {
      return NextResponse.json(
        { error: "Only JPG, PNG or WebP images" },
        { status: 415 },
      );
    }
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${safeBaseName(file.name)}-${Date.now()}${ext}`;
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
