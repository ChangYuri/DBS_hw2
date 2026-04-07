'use client';

import { Mood } from '@/types/diary';
import { saveMood } from '@/lib/localStorage';

const MOODS: { value: Mood; label: string }[] = [
  { value: 'happy',   label: 'Happy'   },
  { value: 'excited', label: 'Excited' },
  { value: 'content', label: 'Content' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'sad',     label: 'Sad'     },
  { value: 'angry',   label: 'Angry'   },
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
      <p className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-3">How are you feeling?</p>
      <div className="flex flex-wrap gap-2">
        {MOODS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleClick(value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans border transition-all ${
              currentMood === value
                ? 'border-transparent text-white'
                : 'bg-transparent text-stone-500 border-stone-200 hover:border-stone-400'
            }`}
            style={currentMood === value ? { background: '#C96A50' } : {}}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
