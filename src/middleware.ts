// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isGrade9BlockedPath } from "@/lib/cc/grade-route-policy";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/welcome",
  "/login",
  "/signup",
  "/pricing",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
  "/auth/callback",
  "/auth/confirm",
  "/api/billing/stripe/webhook",
  "/api/survey",
  "/survey.html",
  "/call",
  // /cc is the public toolkit overview.
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
  "/api/submissions",
  "/api/call/",
  "/api/cc/intake/",
  "/api/cc/shared/",
  "/api/cc/glossary", // read-only term definitions; GlossaryProvider mounts for guests too
  "/api/cc/guest/", // guest session audit endpoints — caller identifies self via cookie
  "/api/leads/",    // exit-intent lead capture (email-only, no auth)
  "/resume/",       // email resume link landing page — public by design
  "/parent/",       // Feature 10 — token-gated parent portal, no auth needed
  "/call",
  "/admin/survey",
  "/about",
  "/privacy",
  "/terms",
  "/integrity",
  "/college-interviews",
  "/history",
  "/faq",
  "/intake",
  "/cc/shared",
  "/product/",  // marketing pages: /product/counselor, /product/essays, /product/schools
  "/stories",   // marketing testimonials page
  // Marketplace discovery is public — prospects should be able to browse
  // counselors and their services before creating an account. Booking is
  // still auth-gated at the API (/api/counselor/booking requires a session).
  "/find-counselor",
  "/counselors/",
  "/agencies/",
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

export function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;

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
  // Runs BEFORE isPublicRoute so authenticated users landing on "/" are
  // caught. Skip the API surface, /onboarding itself, billing
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
    const profileIncomplete = !profile || profile.language_picker_seen_at == null;

    // Counselor routing. A user with a cc_counselors row lives in the
    // /counselor/* workspace, never the student dashboard. This check runs when:
    //   (a) they have no completed student profile — the original
    //       onboarding-skip case (don't force a counselor through the student
    //       language → grade → concerns flow), OR
    //   (b) they hit the post-login landing ("/") or the student dashboard
    //       root ("/cc/dashboard").
    // Case (b) is the fix for a real misroute: a counselor who ALSO has a
    // completed student profile (they tried the product as a student first,
    // THEN set up a counselor account — a common path) used to fall past the
    // old counselor check, which was nested only inside the incomplete-profile
    // branch, and land silently on /cc/dashboard. Bounded to the landing paths
    // so it never adds a DB query to ordinary /cc/* feature requests, and it
    // doesn't touch a counselor's ability to open a specific student's view
    // under /counselor/students/[id].
    const isDashboardLanding = pathname === "/" || pathname === "/cc/dashboard";
    if (profileIncomplete || isDashboardLanding) {
      const { data: counselor } = await supabase
        .from("cc_counselors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle<{ id: string }>();
      if (counselor) {
        return NextResponse.redirect(new URL("/counselor/dashboard", request.url));
      }
    }

    // Non-counselor with no completed student profile → student onboarding.
    if (profileIncomplete) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    // Grade-9 route guard (Feature 16). Page-level checks already exist on
    // the standalone dashboards but not on the per-feature surfaces. Block at
    // the edge so a 14-year-old following a deep link can't open senior tools.
    if (profile?.grade_level === 9 && isGrade9BlockedPath(pathname)) {
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

  // Signed-out visitors on "/" get the server-rendered admissions homepage
  // (/welcome).
  if (pathname === "/" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/welcome";
    const rewrite = NextResponse.rewrite(url, { request });
    response.cookies.getAll().forEach((c) => rewrite.cookies.set(c));
    return rewrite;
  }

  // Guest sessions on "/" go to the dashboard too (real users were redirected
  // above). The legacy course home is gone; keep the query (focus=intake, coach=open).
  if (pathname === "/" && user) {
    const url = new URL("/cc/dashboard", request.url);
    request.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
    return NextResponse.redirect(url);
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

  // --- Head-only counselor surfaces ---------------------------------------
  // /counselor/team (member management + invite-code minting) is head-only.
  // The page already client-redirects non-heads and every underlying API is
  // server-side head-gated (403), so this is defense-in-depth — it just stops
  // a non-head from seeing the page shell flash before the client redirect.
  if (pathname.startsWith("/counselor/team")) {
    // NB: select all membership rows — a user can belong to more than one
    // agency, so .maybeSingle() would error on multiple rows and wrongly
    // bounce a legitimate head. Pass if ANY membership is head.
    const { data: memberships } = await supabase
      .from("cc_agency_members")
      .select("role")
      .eq("user_id", user.id);
    const isHead = (memberships ?? []).some((m) => m.role === "head");
    if (!isHead) {
      return NextResponse.redirect(new URL("/counselor/dashboard", request.url));
    }
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
    // Daybreak's public WOFF2 assets and homepage share card need no session.
    // Keep the font exception scoped; application/auth route matching is unchanged.
    "/((?!_next/static|_next/image|favicon.ico|manifest|opengraph-image$|fonts/daybreak/[^/]+\\.woff2$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|ico|txt|xml|json|webmanifest)$).*)",
  ],
};
