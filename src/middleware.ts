// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/pricing",
  "/courses",
  "/auth/callback",
  "/api/webhooks/paddle",
];

// Route prefixes that are always public
const PUBLIC_PREFIXES = ["/ref/", "/_next/", "/favicon", "/api/webhooks/", "/api/admin/", "/api/courses/"];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;

  // /course/<slug> (course overview) is public, but /course/<slug>/<lesson> requires auth
  if (pathname.startsWith("/course/")) {
    const segments = pathname.replace(/^\/course\//, "").split("/").filter(Boolean);
    if (segments.length <= 1) return true;
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  // Skip public routes
  if (isPublicRoute(pathname)) return response;

  // Create Supabase client with cookie access
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session (important — extends session lifetime)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // API routes return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Page routes redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Lazy check: if user has a canceled subscription past its period end, downgrade role
  // This avoids needing a cron job for role downgrades
  if (pathname.startsWith("/api/ai/") || pathname.startsWith("/course/")) {
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: sub } = await admin
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", user.id)
      .eq("status", "canceled")
      .single();
    if (sub && sub.current_period_end && new Date(sub.current_period_end) < new Date()) {
      await admin.from("user_profiles").update({ role: "student" }).eq("id", user.id);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
