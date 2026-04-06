type SaveStatus = 'idle' | 'saving' | 'saved';

export function SaveStatus({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;
  return (
    <span className="text-xs font-sans text-stone-400 transition-opacity">
      {status === 'saving' ? 'Saving...' : 'All changes saved'}
    </span>
  );
}
