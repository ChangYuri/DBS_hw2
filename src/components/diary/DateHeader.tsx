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
      className="block font-serif italic text-2xl" style={{ color: 'var(--foreground)', opacity: 0.75 }}>
      {display}
    </time>
  );
}
