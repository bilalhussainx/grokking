// src/app/settings/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useXP } from "@/contexts/XPContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileCard from "@/components/gamification/ProfileCard";
import GemShop from "@/components/gamification/GemShop";
import { Coins, User, CreditCard, Share2, Palette, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import type { League } from "@/lib/leaderboard-constants";

export default function SettingsPage() {
  const { user, profile, credits, loading } = useAuth();
  const { xp, level, gems, achievements } = useXP();
  const { toggleMute, isMuted } = useSoundEffect();
  const [copied, setCopied] = useState(false);
  const [soundOff, setSoundOff] = useState(false);
  const [league, setLeague] = useState<League>("bronze");
  const [profileTimedOut, setProfileTimedOut] = useState(false);

  useEffect(() => {
    setSoundOff(isMuted);
  }, [isMuted]);

  useEffect(() => {
    fetch("/api/xp/leaderboard")
      .then((r) => r.ok ? r.json() : null)
      .then((d: { league?: League } | null) => { if (d?.league) setLeague(d.league); })
      .catch(() => {});
  }, []);

  // If profile hasn't loaded after 5 seconds, stop waiting
  useEffect(() => {
    if (profile || !user) return;
    const timer = setTimeout(() => setProfileTimedOut(true), 5000);
    return () => clearTimeout(timer);
  }, [profile, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-pulse text-white/40">Loading settings...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <p className="text-white/40">Please sign in to view settings.</p>
      </div>
    );
  }
  if (!profile && !profileTimedOut) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-pulse text-white/40">Loading settings...</div>
      </div>
    );
  }
  if (!profile && profileTimedOut) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-white/60">Unable to load your profile.</p>
          <p className="text-sm text-white/30">
            There may be a connection issue with the database.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // At this point, profile is guaranteed non-null (all null cases return early above)
  const p = profile!;
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/ref/${p.referral_code}`;

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
              <span className="text-white">{p.full_name || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Email</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Role</span>
              <Badge variant={p.role === "pro" ? "default" : "secondary"}>
                {p.role}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Login Streak</span>
              <span className="text-white">{p.login_streak} days</span>
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
            <div className="text-4xl font-bold text-amber-400 mb-2">{credits ?? 0}</div>
            <p className="text-sm text-white/40">
              {p.role === "pro" && p.trial_ends_at
                ? `Free trial credits — expires ${new Date(p.trial_ends_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`
                : p.role === "pro"
                ? "500 credits refresh monthly with your Pro subscription."
                : "Upgrade to Pro for 500 credits/month."}
            </p>
            {p.role === "student" && (
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
            {p.role === "pro" || p.role === "teacher" ? (
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

        {/* Sound Effects */}
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {soundOff ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
              Sound Effects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">
                  {soundOff ? "Sound effects are muted." : "Sound effects are enabled."}
                </p>
                <p className="text-xs text-white/30 mt-1">Includes XP gains, level ups, and achievement sounds.</p>
              </div>
              <button
                onClick={() => {
                  const newMuted = toggleMute();
                  setSoundOff(newMuted);
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${soundOff ? "bg-white/10" : "bg-emerald-500"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${soundOff ? "" : "translate-x-6"}`}
                />
              </button>
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
                name={p.full_name || "Learner"}
                league={league}
                level={level}
                xp={xp}
                xpToNext={(level + 1) * 500}
                streak={p.login_streak}
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
