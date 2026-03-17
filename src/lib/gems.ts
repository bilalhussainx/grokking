import { createAdminSupabase } from '@/lib/supabase-auth';

export async function earnGems(userId: string, amount: number, action: string): Promise<number> {
  const supabase = createAdminSupabase();

  const { data: current } = await supabase
    .from('gem_balance')
    .select('balance')
    .eq('user_id', userId)
    .single();

  const newBalance = (current?.balance || 0) + amount;

  await supabase.from('gem_balance').upsert({
    user_id: userId,
    balance: newBalance,
  }, { onConflict: 'user_id' });

  await supabase.from('gem_transactions').insert({
    user_id: userId,
    amount,
    action,
  });

  return newBalance;
}

export async function spendGems(userId: string, amount: number, item: string): Promise<boolean> {
  const supabase = createAdminSupabase();

  const { data: current } = await supabase
    .from('gem_balance')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (!current || current.balance < amount) return false;

  await supabase.from('gem_balance').update({
    balance: current.balance - amount,
  }).eq('user_id', userId);

  await supabase.from('gem_transactions').insert({
    user_id: userId,
    amount: -amount,
    action: 'purchase',
    item,
  });

  return true;
}

export async function getGemBalance(userId: string): Promise<number> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('gem_balance')
    .select('balance')
    .eq('user_id', userId)
    .single();
  return data?.balance || 0;
}
