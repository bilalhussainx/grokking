// Variant configuration for the adaptive dashboard. One row per user
// context. The page picks the row at render time and the shell renders.

import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  BookOpen,
  ChartNoAxesColumn,
  Compass,
  FileText,
  Activity,
  MessageSquare,
  GraduationCap,
  Sun,
  MapPin,
  Mail,
  Hourglass,
  DollarSign,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";

export type VariantKey =
  | "g9"
  | "g10"
  | "junior"
  | "senior_writing"
  | "senior_post_submit"
  | "senior_decisions"
  | "transfer"
  | "unknown";

export type DashboardData = {
  preferredName: string | null;
  gradeLabel: string | null; // "Junior · senior writing"
  daysToCommonApp: number; // negative if past
  schoolCount: number;
  schoolReachCount: number;
  schoolMatchCount: number;
  schoolSafetyCount: number;
  nextDeadline: { schoolName: string; key: string; date: string; days: number } | null;
  urgentDeadlineCount: number; // < 14 days
  essaysSubmittedCount: number;
  essaysTotal: number;
  activitiesCount: number;
  activitiesAnalyzed: boolean;
  satRecommendation: string | null; // 'SAT' | 'ACT' | 'BOTH' | null
  satNextSitting: string | null; // ISO date
  hasWaitlistedSchool: boolean;
  waitlistSchoolName: string | null;
  hasGPA: boolean;
  isInternational: boolean;
  // Transfer-only
  transferCurrentSchool: string | null;
  transferTargetTerm: string | null;
};

export type Hero = {
  eyebrow: string;
  headline: string; // can include <em>
  body: string;
  ctaLabel: string;
  ctaHref: string;
  urgent?: boolean;
};

export type PriorityCard = {
  href: string;
  icon: LucideIcon;
  label: string;
  valueKind: "num" | "text";
  valueNum?: string;
  valueSuffix?: string;
  valueText?: string;
  meta: string;
  urgent?: boolean;
};

export type Tile = {
  href: string;
  icon: LucideIcon;
  label: string;
  cap?: string;
  locked?: boolean;
};

export type Variant = {
  hero: Hero;
  priority: PriorityCard[];
  tiles: Tile[];
};

// ─────────────────────────────────────────────────────────────────────────
// Hero matrix — phase-aware copy for each context.
// Returns the most relevant hero given the data the dashboard already has.
// ─────────────────────────────────────────────────────────────────────────
function pickHero(key: VariantKey, d: DashboardData): Hero {
  // Always-on rules first — apply across grade contexts.
  if (d.urgentDeadlineCount > 0 && d.nextDeadline) {
    return {
      eyebrow: "Urgent",
      headline: `${d.nextDeadline.schoolName} ${d.nextDeadline.key} deadline in <em>${d.nextDeadline.days} days</em>.`,
      body: "Open the application board, run through the components checklist, and move what's done into Submitted.",
      ctaLabel: "Open Applications →",
      ctaHref: "/applications",
      urgent: true,
    };
  }
  if (d.hasWaitlistedSchool && d.waitlistSchoolName) {
    return {
      eyebrow: "Waitlist",
      headline: `${d.waitlistSchoolName} <em>waitlisted</em> you. Decide and write a LOCI.`,
      body: "Generate a tailored letter of continued interest, mark it sent when ready, and keep your other applications moving in parallel.",
      ctaLabel: "Open Waitlist →",
      ctaHref: "/cc/waitlist",
    };
  }

  switch (key) {
    case "g9":
      if (d.activitiesCount === 0) {
        return {
          eyebrow: "Grade 9",
          headline: "Pick <em>one harder course</em> for next year and add it to your course list.",
          body: "Grade 9 is about the foundation. One harder course this year, two clubs you actually like, and grades that show ownership — that's the whole job.",
          ctaLabel: "Add a course →",
          ctaHref: "/cc/courses",
        };
      }
      return {
        eyebrow: "Grade 9",
        headline: "Pick <em>one club</em> you want to commit to for the year.",
        body: "Two activities you stay with for four years beats ten activities you do for a semester. Pick something you actually like.",
        ctaLabel: "Talk to Coach Kairos →",
        ctaHref: "/?coach=open",
      };
    case "g10":
      if (!d.satRecommendation) {
        return {
          eyebrow: "Grade 10",
          headline: "Take the <em>PSAT this October</em> — register today if you haven't.",
          body: "PSAT 10 + a planned summer experience are the two grade-10 deliverables that actually move your application. Start the test plan now.",
          ctaLabel: "Open Test strategy →",
          ctaHref: "/cc/test-strategy",
        };
      }
      return {
        eyebrow: "Grade 10",
        headline: "Plan one <em>meaningful summer</em> experience.",
        body: "Sophomore summer is the first place admissions readers can see depth. Pick one program, internship, or project — log it now so it's real by spring.",
        ctaLabel: "Plan summer →",
        ctaHref: "/cc/summer",
      };
    case "junior": {
      // Time-of-year aware. Months 8-11 = fall, 0-2 = winter, 3-6 = spring/summer.
      const month = new Date().getMonth();
      if (d.schoolCount === 0) {
        return {
          eyebrow: "Junior year",
          headline: "Start your <em>school list</em> draft — 10-15 schools.",
          body: "Reach / match / safety, balanced. The list is the spine of your senior year — every later module pulls from it.",
          ctaLabel: "Open the school list →",
          ctaHref: "/schools",
        };
      }
      if (!d.satRecommendation && month >= 7 && month <= 11) {
        return {
          eyebrow: "Junior fall",
          headline: "Take a <em>diagnostic</em> SAT or ACT this fall.",
          body: "You've started the school list — now anchor it. A real diagnostic tells us which test fits your brain and what your target score is.",
          ctaLabel: "Open Test strategy →",
          ctaHref: "/cc/test-strategy",
        };
      }
      if (month >= 3 && month <= 6) {
        return {
          eyebrow: "Junior spring",
          headline: "Brainstorm your <em>personal statement</em> — no draft yet.",
          body: "Spring is for raw material — scenes, moments, throughlines. Drafting starts senior fall. Talk to Coach Kairos in your language; we'll lift the English from your stories.",
          ctaLabel: "Open brainstorm →",
          ctaHref: "/cc/essays",
        };
      }
      return {
        eyebrow: "Junior summer",
        headline: "Lock your <em>activity list</em>. Plan supplements for fall.",
        body: "Summer is for finishing the activity list and pre-drafting supplement outlines for your top schools. The fall calendar is brutal otherwise.",
        ctaLabel: "Open Activities →",
        ctaHref: "/cc/activities-optimizer",
      };
    }
    case "senior_writing":
      if (d.essaysSubmittedCount === 0 && d.essaysTotal === 0) {
        return {
          eyebrow: "Senior writing",
          headline: "Outline your <em>personal statement</em> — first deadline is close.",
          body: "Brainstorm → outline → draft → revise. The earlier deadlines start at November 1; everything else is downstream of the PS.",
          ctaLabel: "Open Essay Studio →",
          ctaHref: "/cc/essays",
        };
      }
      return {
        eyebrow: "Senior writing",
        headline: "<em>Supplements</em> are where applications win and lose.",
        body: "Most students applying to 10 schools write 20-40 supplements. Tackle them by school — start with the school whose deadline is soonest.",
        ctaLabel: "Open Supplements →",
        ctaHref: "/cc/essays/supplements",
      };
    case "senior_post_submit":
      return {
        eyebrow: "Senior — submitted",
        headline: "Decisions <em>start dropping soon</em>. Stay calm, stay ready.",
        body: "While you wait, log every campus visit + any rep meetings. Some schools track demonstrated interest right up to the decision.",
        ctaLabel: "Open Applications →",
        ctaHref: "/applications",
      };
    case "senior_decisions":
      return {
        eyebrow: "Decisions",
        headline: "Compare your <em>aid packages</em> before you commit.",
        body: "The May 1 deposit deadline is real. Run the numbers on each accepted school's net price. Coach Kairos can help you read the financial-aid letters in your parent's language.",
        ctaLabel: "Open Applications →",
        ctaHref: "/applications",
      };
    case "transfer":
      if (!d.transferCurrentSchool) {
        return {
          eyebrow: "Transfer applicant",
          headline: "Tell us <em>where you are</em> — current school + why.",
          body: "Transfer admissions is a different game — different deadlines, different essays, different acceptance rates. Five lines on the why now means a sharper coach later.",
          ctaLabel: "Complete your profile →",
          ctaHref: "/cc/dashboard-transfer",
        };
      }
      return {
        eyebrow: "Transfer applicant",
        headline: "Refine your <em>why-transfer essay</em> — it's the heart of your file.",
        body: "Transfers don't get to lean on the activity list. The essay carries everything — the inflection point, the academic reasons, the destination fit.",
        ctaLabel: "Open Essay Studio →",
        ctaHref: "/cc/essays",
      };
    case "unknown":
    default:
      return {
        eyebrow: "Welcome",
        headline: "Talk to <em>Coach Kairos</em> — we'll figure out the next step.",
        body: "Tell Coach Kairos a bit about your goals. We'll calibrate the dashboard from there.",
        ctaLabel: "Open Coach Kairos →",
        ctaHref: "/?coach=open&focus=intake",
      };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Priority module mapping — 3 cards per variant, populated with live data.
// ─────────────────────────────────────────────────────────────────────────
function buildPriority(key: VariantKey, d: DashboardData): PriorityCard[] {
  switch (key) {
    case "g9":
      return [
        {
          href: "/cc/courses",
          icon: BookOpen,
          label: "Course rigor",
          valueKind: "num",
          valueNum: String(d.activitiesCount === 0 ? 0 : d.activitiesCount),
          valueSuffix: "courses logged",
          meta: "Aim for 1+ honors-level course this year.",
        },
        {
          href: "/cc/summer",
          icon: Sun,
          label: "Summer plan",
          valueKind: "text",
          valueText: "Pick one thing",
          meta: "One real summer experience matters more than three optional ones.",
        },
        {
          href: "/cc/majors",
          icon: Compass,
          label: "Major exploration",
          valueKind: "text",
          valueText: "Low-stakes",
          meta: "Try the interest quiz — it's not binding.",
        },
      ];
    case "g10":
      return [
        {
          href: "/cc/test-strategy",
          icon: ChartNoAxesColumn,
          label: "Test strategy",
          valueKind: "text",
          valueText: d.satRecommendation ? d.satRecommendation : "Take the quiz",
          meta: d.satNextSitting ? `Next sitting: ${d.satNextSitting}` : "PSAT this October.",
        },
        {
          href: "/cc/courses",
          icon: BookOpen,
          label: "Course rigor",
          valueKind: "num",
          valueNum: String(d.activitiesCount),
          valueSuffix: "courses",
          meta: "Add depth in one area.",
        },
        {
          href: "/cc/summer",
          icon: Sun,
          label: "Summer plan",
          valueKind: "text",
          valueText: "1-2 things",
          meta: "Sophomore summer = first 'show, don't tell' moment.",
        },
      ];
    case "junior":
      return [
        {
          href: "/schools",
          icon: GraduationCap,
          label: "School list",
          valueKind: "num",
          valueNum: String(d.schoolCount),
          valueSuffix: "schools",
          meta: `${d.schoolReachCount} reach · ${d.schoolMatchCount} match · ${d.schoolSafetyCount} safety`,
        },
        {
          href: "/cc/test-strategy",
          icon: ChartNoAxesColumn,
          label: "Test strategy",
          valueKind: "text",
          valueText: d.satRecommendation ?? "Take the quiz",
          meta: d.satNextSitting ? `Next sitting: ${d.satNextSitting}` : "Diagnose this fall.",
        },
        {
          href: "/cc/activities-optimizer",
          icon: Activity,
          label: "Activities",
          valueKind: "num",
          valueNum: String(d.activitiesCount),
          valueSuffix: "logged",
          meta: d.activitiesAnalyzed ? "Diagnosis run." : "Run the narrative diagnosis at 3+.",
        },
      ];
    case "senior_writing":
      return [
        {
          href: "/applications",
          icon: Calendar,
          label: "Applications",
          valueKind: "text",
          valueText: d.nextDeadline
            ? `${d.nextDeadline.days}d`
            : "—",
          meta: d.nextDeadline
            ? `${d.nextDeadline.schoolName} · ${d.nextDeadline.key}`
            : "All deadlines logged.",
          urgent: d.urgentDeadlineCount > 0,
        },
        {
          href: "/cc/essays/supplements",
          icon: FileText,
          label: "Supplements",
          valueKind: "num",
          valueNum: `${d.essaysSubmittedCount}`,
          valueSuffix: `/ ${Math.max(d.essaysTotal, d.essaysSubmittedCount)}`,
          meta: "Tackle by school — soonest deadline first.",
        },
        {
          href: "/cc/essays",
          icon: Sparkles,
          label: "Personal statement",
          valueKind: "text",
          valueText: "Draft phase",
          meta: "Brainstorm → outline → draft → revise.",
        },
      ];
    case "senior_post_submit":
      return [
        {
          href: "/applications",
          icon: Calendar,
          label: "Decisions tracker",
          valueKind: "num",
          valueNum: String(d.essaysSubmittedCount),
          valueSuffix: "submitted",
          meta: "Decisions roll in mid-March → late-March.",
        },
        {
          href: "/cc/waitlist",
          icon: Hourglass,
          label: "Waitlist",
          valueKind: "text",
          valueText: d.hasWaitlistedSchool ? "Active" : "—",
          meta: d.hasWaitlistedSchool ? `${d.waitlistSchoolName}` : "No waitlists yet.",
        },
        {
          href: "/cc/visits",
          icon: MapPin,
          label: "Visits",
          valueKind: "text",
          valueText: "Demonstrated interest",
          meta: "Some schools track touchpoints right up to decision day.",
        },
      ];
    case "senior_decisions":
      return [
        {
          href: "/applications",
          icon: Calendar,
          label: "Aid comparator",
          valueKind: "text",
          valueText: "Run the math",
          meta: "May 1 deposit deadline.",
        },
        {
          href: "/cc/waitlist",
          icon: Hourglass,
          label: "Waitlist",
          valueKind: "text",
          valueText: d.hasWaitlistedSchool ? "Active" : "—",
          meta: d.hasWaitlistedSchool ? `${d.waitlistSchoolName}` : "No waitlists yet.",
        },
        {
          href: "/cc/interview-prep/reflect",
          icon: MessageSquare,
          label: "Interview reflection",
          valueKind: "text",
          valueText: "Track + grow",
          meta: "Log alumni interviews.",
        },
      ];
    case "transfer":
      return [
        {
          href: "/cc/essays",
          icon: FileText,
          label: "Why-transfer essay",
          valueKind: "text",
          valueText: "Edit + revise",
          meta: "The whole file rests on this one.",
        },
        {
          href: "/applications",
          icon: ArrowLeftRight,
          label: "Transfer schools",
          valueKind: "num",
          valueNum: String(d.schoolCount),
          valueSuffix: "schools",
          meta: "Transfer rates differ from first-year.",
        },
        {
          href: "/cc/recommenders",
          icon: Mail,
          label: "Professor recs",
          valueKind: "text",
          valueText: "College profs",
          meta: "Transfers need college, not high-school recs.",
        },
      ];
    case "unknown":
    default:
      return [
        {
          href: "/?coach=open&focus=intake",
          icon: Sparkles,
          label: "Coach Kairos",
          valueKind: "text",
          valueText: "Start here",
          meta: "Tell Coach about you in 2 minutes.",
        },
      ];
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Tile grid mapping — 4-6 tiles per variant. Locked tiles for under-18s.
// ─────────────────────────────────────────────────────────────────────────
function buildTiles(key: VariantKey): Tile[] {
  switch (key) {
    case "g9":
      return [
        { href: "/cc/courses", icon: BookOpen, label: "Track your courses" },
        { href: "/cc/majors", icon: Compass, label: "Major exploration", cap: "Low-stakes — try the interest quiz." },
        { href: "/cc/summer", icon: Sun, label: "Plan your summer" },
        { href: "/?coach=open", icon: Sparkles, label: "Coach Kairos" },
        { href: "#", icon: Calendar, label: "Application tracker", cap: "Unlocks junior year.", locked: true },
        { href: "#", icon: FileText, label: "Essay Studio", cap: "Unlocks junior year.", locked: true },
      ];
    case "g10":
      return [
        { href: "/cc/courses", icon: BookOpen, label: "Track your courses" },
        { href: "/cc/test-strategy", icon: ChartNoAxesColumn, label: "Test strategy", cap: "PSAT 10 first." },
        { href: "/cc/majors", icon: Compass, label: "Major exploration" },
        { href: "/cc/summer", icon: Sun, label: "Plan your summer" },
        { href: "/cc/visits", icon: MapPin, label: "Virtual tours" },
        { href: "/?coach=open", icon: Sparkles, label: "Coach Kairos" },
      ];
    case "junior":
      return [
        { href: "/cc/essays", icon: FileText, label: "Brainstorm only", cap: "Draft + revise unlock at grade 12." },
        { href: "/cc/courses", icon: BookOpen, label: "Course rigor" },
        { href: "/cc/majors", icon: Compass, label: "Major exploration" },
        { href: "/cc/summer", icon: Sun, label: "Summer experiences" },
        { href: "/cc/visits", icon: MapPin, label: "Visits" },
        { href: "/?coach=open", icon: Sparkles, label: "Coach Kairos" },
      ];
    case "senior_writing":
      return [
        { href: "/cc/activities-optimizer", icon: Activity, label: "Activities" },
        { href: "/cc/recommenders", icon: Mail, label: "Recommenders" },
        { href: "/cc/test-strategy", icon: ChartNoAxesColumn, label: "Test scores (final)" },
        { href: "/cc/visits", icon: MapPin, label: "Visits" },
        { href: "/?coach=open", icon: Sparkles, label: "Coach Kairos" },
        { href: "/applications", icon: DollarSign, label: "Aid posture" },
      ];
    case "senior_post_submit":
      return [
        { href: "/cc/interview-prep/reflect", icon: MessageSquare, label: "Interview reflection" },
        { href: "/applications", icon: Calendar, label: "Application history" },
        { href: "/cc/visits", icon: MapPin, label: "Visit log" },
        { href: "/?coach=open", icon: Sparkles, label: "Coach Kairos" },
      ];
    case "senior_decisions":
      return [
        { href: "/applications", icon: Calendar, label: "Application history" },
        { href: "/cc/interview-prep/reflect", icon: MessageSquare, label: "Interview reflection" },
        { href: "/?coach=open", icon: Sparkles, label: "Coach Kairos" },
      ];
    case "transfer":
      return [
        { href: "/cc/courses", icon: BookOpen, label: "Course evaluations" },
        { href: "/?coach=open", icon: Sparkles, label: "Coach Kairos" },
        { href: "/cc/recommenders", icon: Mail, label: "Translate-for-parent docs" },
      ];
    case "unknown":
    default:
      return [
        { href: "/cc/courses", icon: BookOpen, label: "Track your courses" },
        { href: "/?coach=open&focus=intake", icon: Sparkles, label: "Talk to Coach Kairos" },
      ];
  }
}

export function buildVariant(key: VariantKey, d: DashboardData): Variant {
  return {
    hero: pickHero(key, d),
    priority: buildPriority(key, d),
    tiles: buildTiles(key),
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Variant selection from profile. The dashboard page calls this with
// freshly-loaded data and renders the chosen variant.
// ─────────────────────────────────────────────────────────────────────────
export function selectVariant(profile: {
  is_transfer_student: boolean | null;
  grade_level: number | null;
}, schools: { application_status: string | null }[]): VariantKey {
  if (profile.is_transfer_student) return "transfer";
  if (!profile.grade_level) return "unknown";

  if (profile.grade_level === 9) return "g9";
  if (profile.grade_level === 10) return "g10";
  if (profile.grade_level === 11) return "junior";
  if (profile.grade_level === 12) {
    const submitted = schools.some((s) => s.application_status === "submitted");
    const decided = schools.some((s) =>
      ["accepted", "rejected", "waitlisted", "deferred", "deposited"].includes(s.application_status ?? ""),
    );
    if (decided) return "senior_decisions";
    if (submitted) return "senior_post_submit";
    return "senior_writing";
  }
  return "unknown";
}
