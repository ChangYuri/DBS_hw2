import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient, rowToEntry } from '@/lib/supabase';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json(null, { status: 401 });

  const { date } = await params;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  return NextResponse.json(data ? rowToEntry(data) : null);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json(null, { status: 401 });

  const { date } = await params;
  const body = await req.json(); // { content?: string, mood?: string | null }
  const now = new Date().toISOString();
  const supabase = createServerSupabaseClient();

  // Fetch existing row to preserve fields we are not updating
  const { data: existing } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  const upsertRow = {
    user_id: userId,
    date,
    content: body.content !== undefined ? body.content : (existing?.content ?? ''),
    mood: body.mood !== undefined ? body.mood : existing?.mood,
    is_shared: body.is_shared !== undefined ? body.is_shared : (existing?.is_shared ?? false),
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from('diary_entries')
    .upsert(upsertRow, { onConflict: 'user_id,date' })
    .select()
    .single();

  if (error) return NextResponse.json(null, { status: 500 });
  return NextResponse.json(rowToEntry(data));
}
