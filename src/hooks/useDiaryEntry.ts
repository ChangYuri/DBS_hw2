'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DiaryEntry } from '@/types/diary';
import { getEntry, saveEntry } from '@/lib/localStorage';

type SaveStatus = 'idle' | 'saving' | 'saved';

export function useDiaryEntry(storageKey: string) {
  const [content, setContentState] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load on mount
  useEffect(() => {
    const existing = getEntry(storageKey);
    if (existing) {
      setContentState(existing.content);
      setEntry(existing);
      setSaveStatus('saved');
    }
  }, [storageKey]);

  const setContent = useCallback((val: string) => {
    setContentState(val);
    setSaveStatus('saving');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const saved = saveEntry(storageKey, val);
      setEntry(saved);
      setSaveStatus('saved');
    }, 800);
  }, [storageKey]);

  return { content, setContent, saveStatus, entry };
}
