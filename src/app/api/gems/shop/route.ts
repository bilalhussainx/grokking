import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { spendGems } from '@/lib/gems';

const SHOP_ITEMS: Record<string, { cost: number; field: string }> = {
  'frame-minimal': { cost: 0, field: 'card_frame' },
  'frame-neon': { cost: 20, field: 'card_frame' },
  'frame-gold': { cost: 20, field: 'card_frame' },
  'frame-holographic': { cost: 20, field: 'card_frame' },
  'bg-gradient': { cost: 0, field: 'card_bg' },
  'bg-space': { cost: 30, field: 'card_bg' },
  'bg-forest': { cost: 30, field: 'card_bg' },
  'bg-ocean': { cost: 30, field: 'card_bg' },
  'bg-circuit': { cost: 30, field: 'card_bg' },
  'flame-orange': { cost: 0, field: 'flame_color' },
  'flame-blue': { cost: 15, field: 'flame_color' },
  'flame-green': { cost: 15, field: 'flame_color' },
  'flame-purple': { cost: 15, field: 'flame_color' },
  'title-slot': { cost: 10, field: 'title' },
  'streak-freeze': { cost: 10, field: 'streak_freeze' },
};

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { itemId } = await req.json();
  const item = SHOP_ITEMS[itemId];
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  if (item.cost > 0) {
    const success = await spendGems(user.id, item.cost, itemId);
    if (!success) return NextResponse.json({ error: 'Insufficient gems' }, { status: 402 });
  }

  // Update cosmetics
  if (item.field !== 'streak_freeze') {
    const admin = createAdminSupabase();
    const value = itemId.split('-').slice(1).join('-');
    await admin.from('user_cosmetics').upsert({
      user_id: user.id,
      [item.field]: value,
    }, { onConflict: 'user_id' });
  }

  return NextResponse.json({ ok: true });
}
