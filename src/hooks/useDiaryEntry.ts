'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DiaryEntry } from '@/types/diary';
import { getEntry, saveEntry } from '@/lib/db';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useDiaryEntry(date: string) {
  const [content, setContentState] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load on mount
  useEffect(() => {
    getEntry(date).then((existing) => {
      if (existing) {
        setContentState(existing.content);
        setEntry(existing);
        setSaveStatus('saved');
      }
    });
  }, [date]);

  const setContent = useCallback((val: string) => {
    setContentState(val);
    setSaveStatus('saving');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const saved = await saveEntry(date, val);
        setEntry(saved);
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    }, 800);
  }, [date]);

  const saveNow = useCallback(async (val: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus('saving');
    try {
      const saved = await saveEntry(date, val);
      setEntry(saved);
      setTimeout(() => setSaveStatus('saved'), 400);
    } catch {
      setSaveStatus('error');
    }
  }, [date]);

  return { content, setContent, saveNow, saveStatus, entry };
}
