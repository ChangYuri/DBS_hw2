import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({}, { status: 401 });

  const { entryId, body } = await req.json();
  if (!entryId || !body || typeof body !== 'string') {
    return NextResponse.json({}, { status: 400 });
  }

  const trimmed = body.trim().slice(0, 140);
  if (!trimmed) return NextResponse.json({}, { status: 400 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('entry_comments')
    .insert({ entry_id: entryId, user_id: userId, body: trimmed })
    .select('id, body, created_at')
    .single();

  if (error) return NextResponse.json({}, { status: 500 });

  return NextResponse.json({ id: data.id, body: data.body, createdAt: data.created_at });
}
