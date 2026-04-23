import type { Metadata } from "next";
import CinematicLandingV2 from "@/components/landing/CinematicLandingV2";
import ExitIntentModal from "@/components/landing/ExitIntentModal";

export const metadata: Metadata = {
  title: "KairosLearn — Every student deserves a counselor who actually knows them.",
  description:
    "Your AI counselor — for every student. Coach Kairos guides first-gen, international, and underprivileged applicants through intake, school list, essays, interviews, and financial aid. $10/mo or free for verified applicants.",
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
      <CinematicLandingV2 />
      <ExitIntentModal />
    </main>
  );
}
