import type { Metadata } from "next";
import { Suspense } from "react";
import LandingViewportSwitch from "@/components/landing/LandingViewportSwitch";
import ExitIntentModal from "@/components/landing/ExitIntentModal";
import LoggedOutToast from "@/components/landing/LoggedOutToast";

export const metadata: Metadata = {
  title: "KairosLearn — Every student deserves a counselor who actually knows them.",
  description:
    "Your AI counselor — for every student. Coach Kairos guides first-gen, international, and underprivileged applicants through intake, school list, essays, interviews, and financial aid. $12/mo or free for verified applicants.",
};

export default function LandingPage() {
  return (
    <main
      style={{
        background: "#05080d",
        color: "#f2ede3",
        overflowX: "hidden",
      }}
    >
      <LandingViewportSwitch />
      <ExitIntentModal />
      {/* useSearchParams reads the query string — wrap in Suspense so Next.js
          doesn't bail out of static generation for the landing page. */}
      <Suspense fallback={null}>
        <LoggedOutToast />
      </Suspense>
    </main>
  );
}
