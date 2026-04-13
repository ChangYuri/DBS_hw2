import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { CommunityEntry, CommunityComment, Mood } from '@/types/diary';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  const supabase = createServerSupabaseClient();

  // Fetch 10 random shared entries from other users via RPC
  const { data: entries, error } = await supabase
    .rpc('get_shared_entries', { viewer_id: userId, row_limit: 10 });

  if (error || !entries) return NextResponse.json([], { status: 500 });

  // For each entry, fetch like count, whether current user liked, and 3 recent comments
  const results: CommunityEntry[] = await Promise.all(
    entries.map(async (row: any) => {
      const [likesRes, commentsRes, userLikeRes] = await Promise.all([
        supabase
          .from('entry_likes')
          .select('id', { count: 'exact', head: true })
          .eq('entry_id', row.id),
        supabase
          .from('entry_comments')
          .select('id, body, created_at')
          .eq('entry_id', row.id)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('entry_likes')
          .select('id')
          .eq('entry_id', row.id)
          .eq('user_id', userId)
          .single(),
      ]);

      const comments: CommunityComment[] = (commentsRes.data ?? []).map((c: any) => ({
        id: c.id,
        body: c.body,
        createdAt: c.created_at,
      }));

      return {
        id: row.id,
        date: row.date,
        excerpt: (row.content as string).slice(0, 200),
        mood: (row.mood as Mood) ?? undefined,
        likeCount: likesRes.count ?? 0,
        likedByMe: !!userLikeRes.data,
        comments,
      };
    })
  );

  return NextResponse.json(results);
}
