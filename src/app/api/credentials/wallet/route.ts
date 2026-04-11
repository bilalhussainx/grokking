// src/app/api/credentials/wallet/route.ts
// Verifiable Credentials SP1 — Task 10
// GET  — returns the caller's linked wallet row (or null)
// POST — links a Privy wallet to the caller's user_id
//
// Wallet linking is NOT Pro-gated — any signed-in user may link a wallet.
// Only diploma minting (/mint) requires Pro tier.
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("user_wallets")
    .select("privy_did, wallet_address")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[credentials/wallet GET] supabase error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ wallet: data ?? null });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { privyDid, walletAddress } = (body ?? {}) as {
    privyDid?: unknown;
    walletAddress?: unknown;
  };

  if (typeof privyDid !== "string" || privyDid.trim() === "") {
    return NextResponse.json(
      { error: "privyDid must be a non-empty string" },
      { status: 400 },
    );
  }
  if (typeof walletAddress !== "string" || !ADDRESS_RE.test(walletAddress)) {
    return NextResponse.json(
      { error: "walletAddress must be a 0x-prefixed 40-char hex string" },
      { status: 400 },
    );
  }

  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("user_wallets")
    .upsert(
      {
        user_id: user.id,
        privy_did: privyDid,
        wallet_address: walletAddress,
      },
      { onConflict: "user_id" },
    )
    .select("privy_did, wallet_address")
    .single();

  if (error || !data) {
    console.error("[credentials/wallet POST] upsert error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to link wallet" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, wallet: data });
}
