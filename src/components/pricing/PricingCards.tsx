// src/components/pricing/PricingCards.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
const PADDLE_ENV = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox") as "sandbox" | "production";
const PRO_MONTHLY_PRICE = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_MONTHLY || "";
const PRO_ANNUAL_PRICE = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_ANNUAL || "";

const FREE_FEATURES = [
  "3 full courses (Python, JS, Web Dev)",
  "50 AI credits on signup",
  "Code editor + auto-grading",
  "Community Discord access",
  "Progress tracking",
];

const PRO_FEATURES = [
  "All 13+ courses unlocked",
  "500 AI credits/month",
  "AI Coach voice sessions",
  "Mock interview practice",
  "Certificates of completion",
  "Choose coach/interviewer voice",
  "Priority support",
];

const TEAM_FEATURES = [
  "Everything in Pro",
  "Classroom management",
  "Student progress dashboard",
  "Homework assignment",
  "Team analytics",
  "Admin controls",
];

export default function PricingCards() {
  const { user, profile } = useAuth();
  const [annual, setAnnual] = useState(true);
  const [paddleInstance, setPaddleInstance] = useState<Paddle | null>(null);

  const openCheckout = async (priceId: string) => {
    let paddle = paddleInstance;
    if (!paddle && PADDLE_CLIENT_TOKEN) {
      paddle = (await initializePaddle({
        token: PADDLE_CLIENT_TOKEN,
        environment: PADDLE_ENV,
      })) || null;
      setPaddleInstance(paddle);
    }
    if (!paddle) return;

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { userId: user?.id, plan: "pro" },
      customer: user?.email ? { email: user.email } : undefined,
    });
  };

  const isPro = profile?.role === "pro" || profile?.role === "teacher" || profile?.role === "admin";

  return (
    <div>
      {/* Annual/Monthly Toggle */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span className={`text-sm ${!annual ? "text-white" : "text-white/40"}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-violet-500" : "bg-white/20"}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${annual ? "translate-x-6" : "translate-x-0.5"}`} />
        </button>
        <span className={`text-sm ${annual ? "text-white" : "text-white/40"}`}>Annual <span className="text-emerald-400 text-xs">(save 20%)</span></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Free Tier */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white">Free</CardTitle>
            <CardDescription>Start learning today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-1">$0</div>
            <div className="text-sm text-white/40 mb-6">forever</div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-white/10" disabled={!!user}>
              {user ? "Current Plan" : "Get Started"}
            </Button>
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card className="bg-violet-500/10 border-violet-500/30 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
            MOST POPULAR
          </div>
          <CardHeader>
            <CardTitle className="text-white">Pro</CardTitle>
            <CardDescription>Unlimited learning + AI coaching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-1">
              ${annual ? "12" : "15"}<span className="text-lg text-white/40">/mo</span>
            </div>
            <div className="text-sm text-white/40 mb-6">
              {annual ? "$144/year" : "billed monthly"}
            </div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-violet-500 hover:bg-violet-600"
              onClick={() => openCheckout(annual ? PRO_ANNUAL_PRICE : PRO_MONTHLY_PRICE)}
              disabled={isPro}
            >
              {isPro ? "Current Plan" : "Upgrade to Pro"}
            </Button>
          </CardContent>
        </Card>

        {/* Teams Tier */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white">Teams</CardTitle>
            <CardDescription>For classrooms and teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white mb-1">
              $10<span className="text-lg text-white/40">/seat/mo</span>
            </div>
            <div className="text-sm text-white/40 mb-6">min 5 seats</div>
            <ul className="space-y-3 mb-8">
              {TEAM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-white/10">
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
