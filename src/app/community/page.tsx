'use client';

import { useEffect, useState, useRef } from 'react';
import { CommunityEntry, CommunityComment, Mood } from '@/types/diary';
import { getCommunityEntries, toggleLike, postComment } from '@/lib/db';

const MOOD_COLOR: Record<Mood, string> = {
  happy:   'bg-amber-300',
  excited: 'bg-yellow-300',
  content: 'bg-green-300',
  neutral: 'bg-stone-300',
  anxious: 'bg-purple-300',
  sad:     'bg-blue-300',
  angry:   'bg-red-300',
};

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function EntryCard({ entry: initial }: { entry: CommunityEntry }) {
  const [entry, setEntry] = useState(initial);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleLike() {
    const result = await toggleLike(entry.id);
    setEntry((e) => ({ ...e, likedByMe: result.likedByMe, likeCount: result.likeCount }));
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      const newComment = await postComment(entry.id, trimmed);
      setEntry((e) => ({ ...e, comments: [newComment, ...e.comments].slice(0, 3) }));
      setComment('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="panel flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        {entry.mood && (
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${MOOD_COLOR[entry.mood]}`} />
        )}
        <span className="font-sans text-xs text-stone-400 tracking-wide">{formatDate(entry.date)}</span>
      </div>

      {/* Content excerpt */}
      <p className="font-serif text-base text-stone-800 leading-relaxed">
        {entry.excerpt}
        {entry.excerpt.length === 200 && <span className="text-stone-300">…</span>}
      </p>

      {/* Like button */}
      <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-sans transition-colors px-2 py-1 rounded-full ${
            entry.likedByMe
              ? 'text-white'
              : 'text-stone-400 hover:text-stone-600 bg-stone-100 hover:bg-stone-200'
          }`}
          style={entry.likedByMe ? { background: '#C96A50' } : {}}
        >
          ♥ {entry.likeCount > 0 && <span>{entry.likeCount}</span>}
          {entry.likedByMe ? 'Liked' : 'Like'}
        </button>
      </div>

      {/* Comments */}
      {entry.comments.length > 0 && (
        <div className="space-y-2">
          {entry.comments.map((c: CommunityComment) => (
            <p key={c.id} className="font-sans text-xs text-stone-600 bg-stone-50 rounded-lg px-3 py-2 leading-relaxed">
              {c.body}
            </p>
          ))}
        </div>
      )}

      {/* Comment input */}
      <form onSubmit={handleComment} className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 140))}
          placeholder="Leave a short note… (140 chars)"
          rows={1}
          className="flex-1 font-sans text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-400 placeholder:text-stone-300 text-stone-700 resize-none"
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(e as any); } }}
        />
        <button
          type="submit"
          disabled={!comment.trim() || submitting}
          className="px-3 py-1.5 rounded-lg text-xs font-sans text-white disabled:opacity-30 transition-colors shrink-0"
          style={{ background: '#C96A50' }}
        >
          Post
        </button>
      </form>
      {comment.length > 100 && (
        <p className="text-[10px] text-stone-300 font-sans -mt-2">{140 - comment.length} chars left</p>
      )}
    </article>
  );
}

export default function CommunityPage() {
  const [entries, setEntries] = useState<CommunityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setEntries(await getCommunityEntries());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-serif text-3xl text-stone-800">Community</h1>
        <button
          onClick={load}
          disabled={loading}
          className="font-sans text-xs text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-40"
        >
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
      </div>
      <p className="text-sm text-stone-400 font-sans mb-8">
        Anonymous diary entries shared by others. All names are hidden.
      </p>

      {loading && entries.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel animate-pulse">
              <div className="h-3 bg-stone-100 rounded w-24 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-stone-100 rounded w-full" />
                <div className="h-3 bg-stone-100 rounded w-4/5" />
                <div className="h-3 bg-stone-100 rounded w-3/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <p className="text-stone-400 italic text-sm mt-8">
          No shared entries yet. Be the first — toggle &quot;Share today&apos;s entry&quot; on the home page.
        </p>
      )}

      <div className="space-y-6">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
