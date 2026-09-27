"use client";

import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TopNavProvider } from "@/contexts/TopNavContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GlossaryProvider } from "@/contexts/GlossaryContext";
import TopNav from "@/components/layout/TopNav";
import ShortcutsHelp from "@/components/ui/ShortcutsHelp";
import SurveyPrompt from "@/components/feedback/SurveyPrompt";
import { CoachKairosProvider } from "@/contexts/CoachKairosContext";
import CoachKairosShell from "@/components/cc/coach/CoachKairosShell";
import { UpgradeGateProvider } from "@/hooks/useFetchWithUpgrade";

/** AppLayout — TopNav above the page. Coach Kairos mounts in AppOverlays. */
function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isDaybreakHome = (pathname === "/" || pathname === "/welcome") && !user;
  const isCinematicPage = pathname === "/landing";
  // MarketingShell pages carry their own sticky marketing nav — mounting the
  // global TopNav above it produced a stacked double header with duplicate
  // sign-in CTAs on /product/* (and /pricing, /stories).
  const hasOwnMarketingNav =
    (pathname?.startsWith("/product/") ?? false) ||
    pathname === "/pricing" ||
    pathname === "/stories";

  // Cinematic landing page needs full document scroll (GSAP ScrollTrigger)
  // — no TopNav, no overflow-hidden wrapper
  if (isCinematicPage || hasOwnMarketingNav || isDaybreakHome) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
      <TopNavProvider>
          <GlossaryProvider>
          <CoachKairosProvider>
            <UpgradeGateProvider>
              <AppLayout>
                {children}
              </AppLayout>
              <AppOverlays />
            </UpgradeGateProvider>
          </CoachKairosProvider>
          </GlossaryProvider>
      </TopNavProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

/** Anonymous homepage owns its full-page marketing surface; signed-in overlays stay intact. */
function AppOverlays() {
  const pathname = usePathname();
  const { user } = useAuth();
  if ((pathname === "/" || pathname === "/welcome") && !user) return null;
  return <><CoachKairosShell /><ShortcutsHelp /><SurveyPrompt /></>;
}
