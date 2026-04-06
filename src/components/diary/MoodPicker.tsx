'use client';

import { Mood } from '@/types/diary';
import { saveMood } from '@/lib/localStorage';

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'excited', emoji: '🤩', label: 'Excited' },
  { value: 'content', emoji: '😌', label: 'Content' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'angry', emoji: '😠', label: 'Angry' },
];

interface MoodPickerProps {
  storageKey: string;
  currentMood?: Mood;
  onMoodChange: (mood: Mood | null) => void;
}

export function MoodPicker({ storageKey, currentMood, onMoodChange }: MoodPickerProps) {
  function handleClick(value: Mood) {
    const next = currentMood === value ? null : value;
    saveMood(storageKey, next);
    onMoodChange(next);
  }

  return (
    <div className="mb-6">
      <p className="text-xs font-sans text-stone-400 uppercase tracking-widest mb-3">How are you feeling?</p>
      <div className="flex flex-wrap gap-2">
        {MOODS.map(({ value, emoji, label }) => (
          <button
            key={value}
            onClick={() => handleClick(value)}
            title={label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
              currentMood === value
                ? 'bg-stone-800 text-white border-stone-800'
                : 'bg-transparent text-stone-600 border-stone-200 hover:border-stone-400'
            }`}
          >
            <span>{emoji}</span>
            <span className="font-sans text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
