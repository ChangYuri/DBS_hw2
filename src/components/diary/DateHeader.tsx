interface DateHeaderProps {
  date: Date | string;
}

export function DateHeader({ date }: DateHeaderProps) {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  const display = d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <time dateTime={typeof date === 'string' ? date : d.toISOString().split('T')[0]}
      className="block text-sm font-sans text-stone-400 uppercase tracking-widest">
      {display}
    </time>
  );
}
