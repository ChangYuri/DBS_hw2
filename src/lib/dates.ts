import { format, subYears, subDays } from 'date-fns';

export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function toStorageKey(date: Date): string {
  return `diary-${toDateKey(date)}`;
}

export function getLastYearKey(date: Date): string {
  return toStorageKey(subYears(date, 1));
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

// Returns 3 storage keys: today-1yr, yesterday-1yr, 2daysago-1yr
export function getLastYearKeys(today: Date): string[] {
  return [0, 1, 2].map((offset) => toStorageKey(subYears(subDays(today, offset), 1)));
}
