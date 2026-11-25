import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getDefaultContent } from "@/lib/content";
import { readContent } from "@/lib/content-server";
import type { Content } from "@/types/content";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export async function GET() {
  try {
    const content = await readContent();
    return NextResponse.json(content);
  } catch (e) {
    console.error("Content GET error:", e);
    return NextResponse.json(getDefaultContent());
  }
}

export async function POST(req: Request) {
  // The real gate: the admin page is only a form, this route is the boundary.
  if (!(await isAdmin(req))) {
    return NextResponse.json(
      {
        error:
          "Not signed in. Log in at /admin/login in a new tab, then save again.",
      },
      { status: 401 },
    );
  }
  try {
    const body = (await req.json()) as Content;
    const dir = path.dirname(CONTENT_PATH);
    await mkdir(dir, { recursive: true });
    await writeFile(CONTENT_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Content POST error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save" },
      { status: 500 },
    );
  }
}
