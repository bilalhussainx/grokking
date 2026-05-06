// PATCH /api/counselor/services/[id] — update price / title / active flag / etc.
// DELETE /api/counselor/services/[id] — soft-delete by flipping active=false
//   (real delete would orphan engagements that reference this service).

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";
import { getCounselorForUser } from "@/lib/cc/counselor-helpers";

interface PatchBody {
  title?: string;
  description?: string | null;
  price_usd?: number;
  turnaround_hours?: number | null;
  scope?: Record<string, unknown>;
  active?: boolean;
  sort_order?: number;
}

async function ownService(userId: string, serviceId: string) {
  const counselor = await getCounselorForUser(userId);
  if (!counselor) return null;
  const db = createAdminSupabase();
  const { data } = await db
    .from("cc_counselor_services")
    .select("id, counselor_id")
    .eq("id", serviceId)
    .maybeSingle();
  if (!data || data.counselor_id !== counselor.id) return null;
  return { counselor, db };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await ownService(user.id, id);
  if (!ctx) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as PatchBody;
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) {
    if (body.title.trim().length < 3) {
      return NextResponse.json({ error: "Title too short" }, { status: 400 });
    }
    update.title = body.title.trim();
  }
  if (body.description !== undefined) update.description = body.description?.trim() || null;
  if (body.price_usd !== undefined) {
    if (body.price_usd < 1) return NextResponse.json({ error: "Price must be ≥ $1" }, { status: 400 });
    update.price_usd = body.price_usd;
  }
  if (body.turnaround_hours !== undefined) update.turnaround_hours = body.turnaround_hours;
  if (body.scope !== undefined) update.scope_jsonb = body.scope;
  if (body.active !== undefined) update.active = body.active;
  if (body.sort_order !== undefined) update.sort_order = body.sort_order;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await ctx.db
    .from("cc_counselor_services")
    .update(update)
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await ownService(user.id, id);
  if (!ctx) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Soft delete to preserve historical engagements that reference this service.
  const { error } = await ctx.db
    .from("cc_counselor_services")
    .update({ active: false })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
