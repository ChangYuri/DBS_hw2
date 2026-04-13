import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({}, { status: 401 });

  const { entryId } = await req.json();
  if (!entryId) return NextResponse.json({}, { status: 400 });

  const supabase = createServerSupabaseClient();

  // Check if like exists
  const { data: existing } = await supabase
    .from('entry_likes')
    .select('id')
    .eq('entry_id', entryId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    await supabase.from('entry_likes').delete().eq('id', existing.id);
  } else {
    await supabase.from('entry_likes').insert({ entry_id: entryId, user_id: userId });
  }

  const { count } = await supabase
    .from('entry_likes')
    .select('id', { count: 'exact', head: true })
    .eq('entry_id', entryId);

  return NextResponse.json({ likedByMe: !existing, likeCount: count ?? 0 });
}
