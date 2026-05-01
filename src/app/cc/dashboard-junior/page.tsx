// Legacy redirect. The unified /cc/dashboard auto-picks the junior variant
// (variants.ts → selectVariant) when grade_level === 11. Keeping this route
// as a 308 so any cached links / external bookmarks still land somewhere
// useful — the adaptive design that actually matches the spec.
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function JuniorDashboardLegacyPage() {
  redirect("/cc/dashboard");
}
