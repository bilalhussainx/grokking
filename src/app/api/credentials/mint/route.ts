// src/app/api/credentials/mint/route.ts
// Verifiable Credentials SP1 — Task 10
// POST — mints a diploma SBT for the authenticated caller. Pro-gated.
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";
import { isPro } from "@/lib/credentials-pro-gate";
import { issueDiploma } from "@/lib/credential-issuer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { diplomaId } = (body ?? {}) as { diplomaId?: unknown };
  if (typeof diplomaId !== "string" || diplomaId.trim() === "") {
    return NextResponse.json(
      { error: "diplomaId must be a non-empty string" },
      { status: 400 },
    );
  }

  // Look up the caller's linked wallet.
  const { data: walletRow, error: walletErr } = await admin
    .from("user_wallets")
    .select("wallet_address")
    .eq("user_id", user.id)
    .maybeSingle();

  if (walletErr) {
    console.error("[credentials/mint] wallet lookup error:", walletErr);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
  if (!walletRow?.wallet_address) {
    return NextResponse.json({ error: "Wallet not linked" }, { status: 400 });
  }

  try {
    const result = await issueDiploma({
      userId: user.id,
      diplomaId,
      recipientAddress: walletRow.wallet_address as `0x${string}`,
    });
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[credentials/mint] issueDiploma error:", err);
    const msg = err instanceof Error ? err.message : String(err);

    if (/Not eligible/i.test(msg)) {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    if (/Already minted/i.test(msg)) {
      return NextResponse.json({ error: msg }, { status: 409 });
    }
    if (/ISSUER_PRIVATE_KEY|PINATA_JWT/.test(msg)) {
      return NextResponse.json(
        { error: "Service misconfigured" },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
