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
  "/forgot-password",
  "/reset-password",
  "/onboarding",
  "/auth/callback",
  "/auth/confirm",
  "/api/webhooks/paddle",
  "/api/survey",
  "/survey.html",
  "/call",
];

// Route prefixes that are always public
const PUBLIC_PREFIXES = ["/ref/", "/_next/", "/favicon", "/api/webhooks/", "/api/admin/", "/api/courses/", "/api/submissions", "/api/call/", "/talk", "/call", "/career", "/admin/survey", "/landing", "/blog", "/about", "/comparison", "/pathways", "/tools", "/privacy", "/terms", "/interviews", "/college-interviews", "/history", "/faq"];

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

  // Redirect non-logged-in users from / to /landing (cinematic page)
  if (pathname === "/") {
    // Quick cookie check — Supabase stores auth in sb-*-auth-token cookies
    const hasAuthCookie = request.cookies.getAll().some(c => c.name.includes("auth-token"));
    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL("/landing", request.url));
    }
    return response;
  }

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
    // Allow guest access to voice sessions and interview scoring (guest trial flow)
    const guestApiRoutes = [
      "/api/ai/voice-session",
      "/api/language/voice-session",
      "/api/interviews/score",
    ];

    // API routes: return 401 (non-whitelisted) or pass through (whitelisted)
    // CRITICAL: must NOT fall through to the page redirect below — that would
    // turn a POST /api/* into a redirect to /login, and /login (a page) returns
    // 405 for POST requests, surfacing as the dreaded "API error 405".
    if (pathname.startsWith("/api/")) {
      if (guestApiRoutes.includes(pathname)) {
        return response; // whitelisted — let the route handler run
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Page routes: redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Subscription downgrade check moved to API routes — too slow for middleware.
  // Dynamic import + DB query on every request added 500ms+ latency.

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files, images, manifests, and HTML files in public/
    "/((?!_next/static|_next/image|favicon.ico|manifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|ico|txt|xml|json|webmanifest)$).*)",
  ],
};
