import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-auth';
import { getGemBalance } from '@/lib/gems';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const balance = await getGemBalance(user.id);
  return NextResponse.json({ balance });
}
