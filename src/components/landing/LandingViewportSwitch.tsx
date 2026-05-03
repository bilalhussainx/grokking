"use client";
// Picks the mobile or desktop landing renderer based on viewport. Server
// /landing/page.tsx renders this thin client component; useMediaQuery
// handles the actual viewport check.
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MOBILE_MEDIA_QUERY } from "@/lib/device";
import CinematicLandingV2 from "@/components/landing/CinematicLandingV2";
import MobileLanding from "@/components/mobile/landing/MobileLanding";

export default function LandingViewportSwitch() {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  return isMobile ? <MobileLanding /> : <CinematicLandingV2 />;
}
