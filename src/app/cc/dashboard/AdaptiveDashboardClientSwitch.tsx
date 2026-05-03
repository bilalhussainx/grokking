"use client";
// Picks the mobile or desktop dashboard renderer based on viewport. The
// server-side page.tsx renders this thin client component in the v2
// branch; useMediaQuery handles the actual viewport check.
//
// Both renderers self-fetch /api/cc/dashboard/summary, so no data needs
// to flow through this switch — it's purely a viewport multiplexer.
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MOBILE_MEDIA_QUERY } from "@/lib/device";
import AdaptiveDashboard from "./AdaptiveDashboard";
import MobileDashboard from "@/components/mobile/dashboard/MobileDashboard";

export default function AdaptiveDashboardClientSwitch() {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  return isMobile ? <MobileDashboard /> : <AdaptiveDashboard />;
}
