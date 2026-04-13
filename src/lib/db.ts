import { CommunityComment, CommunityEntry, DiaryEntry, Mood } from '@/types/diary';

// Client-side data layer. All functions call the /api/diary routes.
// This replaces src/lib/localStorage.ts.

export async function getEntry(date: string): Promise<DiaryEntry | null> {
  const res = await fetch(`/api/diary/${date}`);
  if (!res.ok) return null;
  return res.json();
}

export async function saveEntry(date: string, content: string): Promise<DiaryEntry> {
  const res = await fetch(`/api/diary/${date}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function saveMood(date: string, mood: Mood | null): Promise<DiaryEntry> {
  const res = await fetch(`/api/diary/${date}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood }),
  });
  return res.json();
}

export async function getAllEntries(): Promise<DiaryEntry[]> {
  const res = await fetch('/api/diary');
  if (!res.ok) return [];
  return res.json();
}

export async function deleteAllEntries(): Promise<void> {
  await fetch('/api/diary', { method: 'DELETE' });
}

export async function setShared(date: string, isShared: boolean): Promise<DiaryEntry> {
  const res = await fetch(`/api/diary/${date}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_shared: isShared }),
  });
  return res.json();
}

export async function getCommunityEntries(): Promise<CommunityEntry[]> {
  const res = await fetch('/api/community');
  if (!res.ok) return [];
  return res.json();
}

export async function toggleLike(entryId: string): Promise<{ likedByMe: boolean; likeCount: number }> {
  const res = await fetch('/api/community/likes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entryId }),
  });
  return res.json();
}

export async function postComment(entryId: string, body: string): Promise<CommunityComment> {
  const res = await fetch('/api/community/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entryId, body }),
  });
  return res.json();
}
