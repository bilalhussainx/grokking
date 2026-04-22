"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import CompletionRing from "@/components/cc/profile/CompletionRing";
import ProfileWizard from "@/components/cc/profile/ProfileWizard";
import IdentityForm from "@/components/cc/profile/IdentityForm";
import AcademicForm from "@/components/cc/profile/AcademicForm";
import ActivitiesForm from "@/components/cc/profile/ActivitiesForm";
import HonorsForm from "@/components/cc/profile/HonorsForm";
import FinancialForm from "@/components/cc/profile/FinancialForm";

const TABS = ["Identity", "Academic", "Activities", "Honors", "Financial"] as const;

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageInner />
    </Suspense>
  );
}

function ProfilePageInner() {
  const searchParams = useSearchParams();
  const [profileData, setProfileData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showWizard, setShowWizard] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/cc/profile");
    if (res.ok) {
      const data = await res.json();
      setProfileData(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const wizardParam = searchParams.get("wizard") === "1";
    const wizardDone = localStorage.getItem("profile_wizard_done") === "true";
    if (wizardParam && !wizardDone) setShowWizard(true);
    fetchProfile();
  }, [searchParams, fetchProfile]);

  const saveIdentity = useCallback(async (fields: Record<string, unknown>) => {
    await fetch("/api/cc/profile/identity", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    fetchProfile();
  }, [fetchProfile]);

  const saveAcademic = useCallback(async (fields: Record<string, unknown>) => {
    await fetch("/api/cc/profile/academic", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    fetchProfile();
  }, [fetchProfile]);

  const saveActivity = useCallback(async (activity: Record<string, unknown>) => {
    await fetch("/api/cc/profile/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    });
    fetchProfile();
  }, [fetchProfile]);

  const deleteActivity = useCallback(async (id: string) => {
    await fetch("/api/cc/profile/activities", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProfile();
  }, [fetchProfile]);

  const saveHonor = useCallback(async (honor: Record<string, unknown>) => {
    await fetch("/api/cc/profile/honors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(honor),
    });
    fetchProfile();
  }, [fetchProfile]);

  const deleteHonor = useCallback(async (id: string) => {
    await fetch("/api/cc/profile/honors", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProfile();
  }, [fetchProfile]);

  const saveFinancial = useCallback(async (fields: Record<string, unknown>) => {
    await fetch("/api/cc/profile/financial", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    fetchProfile();
  }, [fetchProfile]);

  if (loading || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  if (showWizard) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <GraduationCap className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Let&apos;s build your profile</h1>
          <p className="text-sm text-white/50 mt-1">This helps Coach Kairos give you personalized college guidance.</p>
        </div>
        <ProfileWizard
          profileData={profileData as never}
          onSaveIdentity={saveIdentity}
          onSaveAcademic={saveAcademic}
          onSaveActivity={saveActivity}
          onDeleteActivity={deleteActivity}
          onSaveHonor={saveHonor}
          onDeleteHonor={deleteHonor}
          onSaveFinancial={saveFinancial}
          onComplete={() => setShowWizard(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <CompletionRing percent={(profileData as { completion_pct: number }).completion_pct} />
        <div>
          <h1 className="text-xl font-bold text-white">Your Profile</h1>
          <p className="text-sm text-white/40">
            {(profileData as { completion_pct: number }).completion_pct}% complete
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white/[0.02] border border-white/5 px-4 py-3 mb-6">
        <p className="text-xs text-white/30 leading-relaxed">
          This is your full Common App profile. Fill it out at your own pace — Coach Kairos only needs your GPA and grade to start recommending schools. Everything else helps fine-tune your recommendations and essays.
        </p>
      </div>

      <div className="flex gap-1 border-b border-white/10 mb-6 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === i
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && <IdentityForm data={(profileData as { profile: never }).profile} onSave={saveIdentity as never} />}
      {activeTab === 1 && (
        <AcademicForm
          data={(profileData as { academic: never }).academic}
          onSave={saveAcademic as never}
          countryCode={(profileData as { profile: { country?: string | null } }).profile.country ?? null}
        />
      )}
      {activeTab === 2 && <ActivitiesForm activities={(profileData as { activities: never[] }).activities} onSave={saveActivity as never} onDelete={deleteActivity} />}
      {activeTab === 3 && <HonorsForm honors={(profileData as { honors: never[] }).honors} onSave={saveHonor as never} onDelete={deleteHonor} />}
      {activeTab === 4 && <FinancialForm data={(profileData as { financial: never }).financial} onSave={saveFinancial as never} />}
    </div>
  );
}
