// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isGrade9BlockedPath } from "@/lib/cc/grade-route-policy";

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
  "/api/billing/stripe/webhook",
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
  "/parent/",       // Feature 10 — token-gated parent portal, no auth needed
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
  "/product/",  // marketing pages: /product/counselor, /product/essays, /product/schools
  "/stories",   // marketing testimonials page
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

  // Create Supabase client with cookie access. Hoisted above the public-route
  // early-return because the Feature 1A picker check runs for "/" and other
  // public-but-authenticated paths too.
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

  // --- One-time onboarding gate -------------------------------------------
  // Real users (not anon) who haven't completed onboarding get bounced to
  // /onboarding (multi-step: language -> role -> grade/transfer -> concerns).
  // Runs BEFORE isPublicRoute so authenticated users landing on "/" or
  // "/landing" are caught. Skip the API surface, /onboarding itself, billing
  // webhooks, shared content, and auth callbacks.
  // NB: language_picker_seen_at is the onboarding-complete sentinel — it's
  // set by /api/cc/onboarding/complete. The standalone /onboarding/language
  // page is preserved as a deep link (settings flow) but middleware no
  // longer redirects to it.
  const isOnboardingExempt =
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/cc/shared") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/landing" ||
    // Counselor marketplace surfaces. The student-onboarding gate
    // (language picker → grade picker → concerns) is irrelevant to:
    //   /counselor/*       — counselor own onboarding + dashboard +
    //                         services + payouts + session room
    //   /counselors/*      — public counselor profile pages (anyone
    //                         can browse)
    //   /agencies/*        — public agency landing pages
    //   /find-counselor    — public counselor discovery + search
    //   /engagements/*     — booking detail page for both counselor and
    //                         student parties; access is gated by
    //                         engagement participation (see page-level
    //                         check), not by student onboarding state
    // Without these exemptions, hitting /counselor/onboard for the
    // first time bounces a brand-new account through /onboarding which
    // is the wrong flow for someone signing up to become a counselor.
    pathname.startsWith("/counselor") ||
    pathname.startsWith("/counselors") ||
    pathname.startsWith("/agencies") ||
    pathname === "/find-counselor" ||
    pathname.startsWith("/engagements") ||
    // /join/<code> — student invite-code redemption. A brand-new student
    // following a counselor's invite link must be able to redeem the code
    // BEFORE the student-onboarding gate fires; otherwise the gate bounces
    // them to /onboarding and the code is lost. The page itself is still
    // auth-gated (it falls through to the !user → /login?next= redirect
    // below for logged-out visitors), so this only exempts the onboarding
    // step, not authentication.
    pathname.startsWith("/join/");

  if (user && isRealUser && !isOnboardingExempt) {
    const { data: profile } = await supabase
      .from("cc_student_profiles")
      .select("language_picker_seen_at, grade_level")
      .eq("user_id", user.id)
      .maybeSingle<{ language_picker_seen_at: string | null; grade_level: number | null }>();
    // Redirect if (a) the user has no profile row yet (brand-new account —
    // the row is created lazily by ensureStudentProfile when they hit a
    // coach API) OR (b) the onboarding sentinel is still null. Either way
    // the first thing the user should see is the multi-step onboarding.
    if (!profile || profile.language_picker_seen_at == null) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    // Grade-9 route guard (Feature 16). Page-level checks already exist on
    // the standalone dashboards but not on the per-feature surfaces. Block at
    // the edge so a 14-year-old following a deep link can't open senior tools.
    if (profile.grade_level === 9 && isGrade9BlockedPath(pathname)) {
      const url = new URL("/cc/dashboard", request.url);
      url.searchParams.set("blocked", "grade9");
      return NextResponse.redirect(url);
    }
    // Onboarded real users on the legacy "/" land on /cc/dashboard
    // server-side. This used to happen client-side via a useEffect in
    // src/app/page.tsx, which produced a 3-frame flicker on sign-in:
    //   (1) legacy CounselorDashboard renders briefly
    //   (2) preferences fetch decides to redirect — adaptive dashboard
    //       renders without sidebar while route transitions
    //   (3) settles on /cc/dashboard
    // Doing it here at the edge means the browser never sees "/" — first
    // paint is /cc/dashboard, no flicker. Query params (e.g. coach=open,
    // focus=intake from the onboarding language-picker handoff) are
    // preserved so the new dashboard can read them.
    if (pathname === "/") {
      const url = new URL("/cc/dashboard", request.url);
      request.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
      return NextResponse.redirect(url);
    }
  }

  // Skip remaining public-route checks (fastest path)
  if (isPublicRoute(pathname)) return response;

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
