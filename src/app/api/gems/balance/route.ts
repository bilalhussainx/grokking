import { NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { getGemBalance } from '@/lib/gems';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminSupabase();
  const [balance, cosmeticsResult] = await Promise.all([
    getGemBalance(user.id),
    admin.from('user_cosmetics').select('card_frame, card_bg, flame_color').eq('user_id', user.id).single(),
  ]);

  return NextResponse.json({ balance, cosmetics: cosmeticsResult.data || null });
}
