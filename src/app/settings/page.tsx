'use client';

import { useState } from 'react';
import { getAllEntries } from '@/lib/localStorage';

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SettingsPage() {
  const [confirmText, setConfirmText] = useState('');
  const [cleared, setCleared] = useState(false);

  function exportJSON() {
    const entries = getAllEntries();
    downloadFile(JSON.stringify(entries, null, 2), 'diary-export.json', 'application/json');
  }

  function exportText() {
    const entries = getAllEntries();
    const text = entries.map((e) => `--- ${e.date} ---\n${e.content}`).join('\n\n');
    downloadFile(text, 'diary-export.txt', 'text/plain');
  }

  function clearAll() {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && /^diary-\d{4}-\d{2}-\d{2}$/.test(k)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    setCleared(true);
    setConfirmText('');
  }

  return (
    <div className="max-w-xl mx-auto w-full px-6 py-8">
      <h1 className="font-serif text-3xl text-stone-800 mb-1">Settings</h1>
      <p className="text-sm text-stone-400 font-sans mb-10">Manage your data.</p>

      {/* Export */}
      <section className="mb-10">
        <h2 className="font-sans text-xs uppercase tracking-widest text-stone-400 mb-4">Export</h2>
        <div className="flex gap-3">
          <button onClick={exportJSON}
            className="px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-700 hover:bg-stone-50 transition-colors font-sans">
            Download as JSON
          </button>
          <button onClick={exportText}
            className="px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-700 hover:bg-stone-50 transition-colors font-sans">
            Download as Text
          </button>
        </div>
        <p className="text-xs text-stone-400 mt-3">Exports all diary entries stored in this browser.</p>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="font-sans text-xs uppercase tracking-widest text-red-400 mb-4">Danger Zone</h2>
        {cleared ? (
          <p className="text-sm text-stone-500 italic">All entries have been deleted.</p>
        ) : (
          <div className="border border-red-100 rounded-lg p-4 bg-red-50">
            <p className="text-sm text-stone-700 mb-3">
              Permanently delete all diary entries. This cannot be undone.
            </p>
            <p className="text-xs text-stone-400 mb-2">Type <strong>delete</strong> to confirm:</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full text-sm border border-red-200 rounded px-3 py-1.5 bg-white focus:outline-none focus:border-red-400 mb-3"
              placeholder="delete"
            />
            <button
              onClick={clearAll}
              disabled={confirmText !== 'delete'}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-sans disabled:opacity-30 hover:bg-red-600 transition-colors disabled:cursor-not-allowed">
              Clear all data
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
