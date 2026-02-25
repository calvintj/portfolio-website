import { readFile } from "fs/promises";
import path from "path";
import type { Content } from "@/types/content";
import { getDefaultContent } from "@/lib/content";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

/** Server-only: reads content from data/content.json. Use in API routes only. */
export async function readContent(): Promise<Content> {
  try {
    const raw = await readFile(CONTENT_PATH, "utf-8");
    return JSON.parse(raw) as Content;
  } catch {
    return getDefaultContent();
  }
}
