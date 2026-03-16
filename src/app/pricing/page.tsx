// src/app/pricing/page.tsx
import PricingCards from "@/components/pricing/PricingCards";

export const metadata = { title: "Pricing — Samsara.ai" };

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-20 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Simple Pricing
        </h1>
        <p className="text-white/50 text-lg max-w-md mx-auto">
          Start free. Upgrade when you need AI coaching, voice interviews, and all courses.
        </p>
      </div>
      <PricingCards />
    </div>
  );
}
