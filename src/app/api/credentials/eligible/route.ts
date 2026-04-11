// src/app/api/credentials/eligible/route.ts
// Verifiable Credentials SP1 — Task 10
// GET — returns the diploma catalog with eligibility + already-minted status
// for the authenticated caller. Gated to Pro tier.
import { NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";
import { isPro } from "@/lib/credentials-pro-gate";
import { loadEligibilityForUser } from "@/lib/credential-eligibility";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminSupabase();

  const pro = await isPro(admin, user.id);
  if (!pro) {
    return NextResponse.json({ error: "Pro tier required" }, { status: 403 });
  }

  try {
    const [eligibility, { data: issuedRows, error: issuedErr }] =
      await Promise.all([
        loadEligibilityForUser(user.id),
        admin
          .from("issued_credentials")
          .select("diploma_id, token_id, tx_hash, status")
          .eq("user_id", user.id)
          .eq("credential_type", "diploma")
          .eq("status", "minted"),
      ]);

    if (issuedErr) {
      console.error("[credentials/eligible] issued_credentials error:", issuedErr);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const mintedByDiploma = new Map<
      string,
      { token_id: string | null; tx_hash: string | null }
    >();
    for (const row of issuedRows ?? []) {
      const r = row as {
        diploma_id: string;
        token_id: string | null;
        tx_hash: string | null;
      };
      mintedByDiploma.set(r.diploma_id, {
        token_id: r.token_id,
        tx_hash: r.tx_hash,
      });
    }

    const diplomas = eligibility.map((e) => {
      const minted = mintedByDiploma.get(e.diplomaId);
      return {
        diplomaId: e.diplomaId,
        title: e.title,
        description: e.description,
        category: e.category,
        imagePath: e.imagePath,
        eligible: e.eligible,
        reason: e.reason,
        evidence: e.evidence,
        alreadyMinted: Boolean(minted),
        tokenId: minted?.token_id ?? undefined,
        txHash: minted?.tx_hash ?? undefined,
      };
    });

    return NextResponse.json({ diplomas });
  } catch (err) {
    console.error("[credentials/eligible] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
