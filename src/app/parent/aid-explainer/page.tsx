// Aid Explainer entry — opens Family Mode pre-loaded with the
// aid_explainer preset and the school's net-price figures so a parent can
// hear them in their own language. Linked from the NetPriceEstimator's
// per-school "Explain this to my parent" button. Shipped 2026-05-17 per
// the Cookiy validation finding that voice is most valuable as a
// parent-translation bridge for financial aid.

import AidExplainerLauncher from "@/components/cc/net-price/AidExplainerLauncher";

export const metadata = {
  title: "Explain my aid · KairosLearn",
  description: "Hear the financial aid breakdown for a school explained in your parent's language.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function parseRiskFlag(v: string | string[] | undefined): "none" | "need_aware_admission_risk" | "limited_intl_aid" {
  const s = Array.isArray(v) ? v[0] : v;
  if (s === "need_aware_admission_risk" || s === "limited_intl_aid") return s;
  return "none";
}

function num(v: string | string[] | undefined, fallback: number): number {
  const s = Array.isArray(v) ? v[0] : v;
  const n = s ? Number(s) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function str(v: string | string[] | undefined, fallback: string): string {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() ? s : fallback;
}

export default async function AidExplainerPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const schoolName = str(sp.school, "this school");
  const stickerPrice = num(sp.sticker, 0);
  const estimatedNetPrice = num(sp.net, 0);
  const estimatedGrantAid = num(sp.grant, 0);
  const estimatedFamilyContribution = num(sp.efc, 0);
  const aidRiskFlag = parseRiskFlag(sp.flag);

  return (
    <AidExplainerLauncher
      aidContext={{
        schoolName,
        stickerPrice,
        estimatedNetPrice,
        estimatedGrantAid,
        estimatedFamilyContribution,
        aidRiskFlag,
      }}
    />
  );
}
