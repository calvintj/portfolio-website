import { NextResponse } from "next/server";

export async function GET() {
  const enabled = Boolean(process.env.DEEPINFRA_API_KEY?.trim());
  return NextResponse.json({ enabled });
}
