// Legacy redirect. The unified /cc/dashboard auto-picks the g9 variant
// (variants.ts → selectVariant) when grade_level === 9, and that variant
// matches the actual design spec (cinematic shell, locked tiles for
// premium routes, four-year roadmap surfaced via copy).
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Grade9DashboardLegacyPage() {
  redirect("/cc/dashboard");
}
