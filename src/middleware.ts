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
  // /cc is the public toolkit overview — linked from /landing as "Explore Coach Kairos".
  // Individual tool pages under /cc/* still require auth (they're not matched by this exact-path rule).
  "/cc",
];

// Route prefixes that are always public
const PUBLIC_PREFIXES = [
  "/ref/",
  "/_next/",
  "/favicon",
  "/api/webhooks/",
  "/api/admin/",
  "/api/courses/",
  "/api/submissions",
  "/api/call/",
  "/api/cc/intake/",
  "/api/cc/shared/",
  "/api/cc/guest/", // guest session audit endpoints — caller identifies self via cookie
  "/api/leads/",    // exit-intent lead capture (email-only, no auth)
  "/resume/",       // email resume link landing page — public by design
  "/talk",
  "/call",
  "/career",
  "/admin/survey",
  "/landing",
  "/blog",
  "/about",
  "/comparison",
  "/pathways",
  "/tools",
  "/privacy",
  "/terms",
  "/interviews",
  "/college-interviews",
  "/history",
  "/achievements",
  "/leaderboard",
  "/faq",
  "/intake",
  "/cc/shared",
];

// Routes that anonymous (guest) users can reach, but real-account-required
// routes cannot. These are the § 8.1 "guest-accessible" routes from the plan.
// Anything NOT in this list or PUBLIC_* requires a non-anonymous user.
const GUEST_ACCESSIBLE_PREFIXES = [
  "/api/cc/coach/",
  "/api/cc/schools",
  "/api/cc/school-list",
  "/api/cc/activities/",
  "/api/cc/essays/",    // review is gated server-side via tier-gate
  "/api/cc/chancing/",
  "/api/cc/me/",        // tier lookup, profile read
  "/cc/dashboard",
  "/cc/essays",
  "/cc/activities-optimizer",
  "/schools",           // school list builder (root-level route)
  "/cc/schools",        // legacy alias
  "/cc/my-schools",     // legacy alias
];

// Pro-tier-only routes. Non-Pro users (anon or free) get redirected to
// /pricing?capability=<name> or a 402 for API calls. Server-side tier-gate
// also enforces these — this is just a cheap middleware short-circuit.
const PRO_ONLY_PREFIXES = [
  "/api/cc/financial-aid/",
  "/api/cc/share-link/",
  "/cc/share",
];

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

function matchesAnyPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  // Skip public routes entirely (fastest path)
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAnonymous = Boolean(user?.is_anonymous);
  const isRealUser = Boolean(user && !user.is_anonymous);

  if (!user) {
    // Legacy unauthenticated-guest whitelist (pre-dates the guest-session flow).
    // Kept for call/voice endpoints that don't want to initialize an anon session.
    const guestApiRoutes = [
      "/api/ai/voice-session",
      "/api/language/voice-session",
      "/api/interviews/score",
      "/api/interviews/text-message",
    ];

    if (pathname.startsWith("/api/")) {
      if (guestApiRoutes.includes(pathname)) {
        return response;
      }
      // API call with no session at all — 401.
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Page routes: redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- One-time language picker (Feature 1A) ------------------------------
  // Real users (not anon) who haven't seen the picker get bounced to the picker
  // route once. Skip the API surface, the picker itself, and shared/auth flows.
  const isPickerExempt =
    pathname === "/onboarding/language" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/cc/shared") ||
    pathname.startsWith("/auth/");

  if (isRealUser && !isPickerExempt) {
    const { data: profile } = await supabase
      .from("cc_student_profiles")
      .select("language_picker_seen_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profile && profile.language_picker_seen_at == null) {
      return NextResponse.redirect(new URL("/onboarding/language", request.url));
    }
  }

  // --- Root / landing routing (only for users with a session) -------------
  if (pathname === "/") {
    if (isAnonymous) {
      return NextResponse.redirect(new URL("/landing", request.url));
    }
    return response;
  }

  // Real users hitting /landing bounce to dashboard. Anon users stay on
  // landing because that's where the hero chat lives.
  if (pathname === "/landing" && isRealUser) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // --- Pro-only gating ----------------------------------------------------
  if (matchesAnyPrefix(pathname, PRO_ONLY_PREFIXES)) {
    // The server-side tier-gate is authoritative. Middleware just avoids
    // making a DB round-trip by returning 402 for anon users immediately.
    if (isAnonymous) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Pro feature", upgradeTo: "pro" },
          { status: 402 }
        );
      }
      return NextResponse.redirect(
        new URL(`/pricing?capability=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    // Real users fall through — API handlers still call assertCapacity.
    return response;
  }

  // --- Anonymous access permissions ---------------------------------------
  if (isAnonymous) {
    if (matchesAnyPrefix(pathname, GUEST_ACCESSIBLE_PREFIXES)) {
      return response;
    }
    // Anonymous user hit a real-account-only route.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Sign up to continue", upgradeTo: "free" },
        { status: 402 }
      );
    }
    // Send them to signup with a return path so they land back where they wanted.
    const signupUrl = new URL("/signup", request.url);
    signupUrl.searchParams.set("next", pathname);
    signupUrl.searchParams.set("reason", "anon-gated");
    return NextResponse.redirect(signupUrl);
  }

  // Real user — already authenticated; fall through to handler.
  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files, images, manifests, and HTML files in public/
    "/((?!_next/static|_next/image|favicon.ico|manifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|ico|txt|xml|json|webmanifest)$).*)",
  ],
};
