// src/app/settings/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useXP } from "@/contexts/XPContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileCard from "@/components/gamification/ProfileCard";
import GemShop from "@/components/gamification/GemShop";
import { Coins, User, CreditCard, Share2, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import type { League } from "@/lib/leaderboard";

export default function SettingsPage() {
  const { user, profile, credits } = useAuth();
  const { xp, level, gems, achievements } = useXP();
  const [copied, setCopied] = useState(false);
  const [league, setLeague] = useState<League>("bronze");

  useEffect(() => {
    fetch("/api/xp/leaderboard")
      .then((r) => r.json())
      .then((d) => { if (d.league) setLeague(d.league); })
      .catch(() => {});
  }, []);

  if (!user || !profile) return null;

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/ref/${profile.referral_code}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>

        {/* Profile */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/50">Name</span>
              <span className="text-white">{profile.full_name || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Email</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Role</span>
              <Badge variant={profile.role === "pro" ? "default" : "secondary"}>
                {profile.role}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Login Streak</span>
              <span className="text-white">{profile.login_streak} days</span>
            </div>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" /> Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-400 mb-2">{credits}</div>
            <p className="text-sm text-white/40">
              {profile.role === "pro"
                ? "500 credits refresh monthly with your Pro subscription."
                : "Upgrade to Pro for 500 credits/month."}
            </p>
            {profile.role === "student" && (
              <Button className="mt-4 bg-violet-500 hover:bg-violet-600" asChild>
                <a href="/pricing">Upgrade to Pro</a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.role === "pro" || profile.role === "teacher" ? (
              <p className="text-sm text-white/60">
                Manage your subscription, update payment method, or view invoices through the Paddle customer portal.
              </p>
            ) : (
              <p className="text-sm text-white/40">No active subscription. Upgrade to Pro to unlock all features.</p>
            )}
          </CardContent>
        </Card>

        {/* Referral */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" /> Refer a Friend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/50 mb-3">Share your link — you both get 25 credits when they sign up.</p>
            <div className="flex gap-2">
              <code className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-xs text-white/70 truncate">
                {referralLink}
              </code>
              <Button variant="outline" size="sm" onClick={copyReferral} className="border-white/10">
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Card & Shop */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-violet-400" /> Profile Card & Shop
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <ProfileCard
                name={profile.full_name || "Learner"}
                league={league}
                level={level}
                xp={xp}
                xpToNext={(level + 1) * 500}
                streak={profile.login_streak}
                achievements={achievements.slice(0, 3).map((a) => ({ icon: a.icon }))}
              />
            </div>
            <div className="border-t border-white/[0.08] pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Gem Shop</h3>
              <GemShop />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
