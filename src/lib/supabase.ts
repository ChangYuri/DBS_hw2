import { createClient } from '@supabase/supabase-js';
import { DiaryEntry } from '@/types/diary';

// Server-only — uses the service-role key. Never import this from client components.
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Maps a Supabase row to the DiaryEntry shape used throughout the app.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToEntry(row: any): DiaryEntry {
  return {
    date: row.date,
    content: row.content,
    mood: row.mood ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isShared: row.is_shared ?? false,
  };
}
