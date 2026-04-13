import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient, rowToEntry } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(data.map(rowToEntry));
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({}, { status: 401 });

  const supabase = createServerSupabaseClient();
  await supabase.from('diary_entries').delete().eq('user_id', userId);
  return NextResponse.json({ ok: true });
}
