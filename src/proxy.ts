import { type NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

// Sends signed-out visitors from the admin pages to the login form.
// The write APIs check the session themselves; this is only for the pages.
export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (await isAdmin(req)) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
