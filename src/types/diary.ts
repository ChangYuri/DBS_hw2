export type Mood = 'happy' | 'excited' | 'content' | 'neutral' | 'anxious' | 'sad' | 'angry';

export interface DiaryEntry {
  date: string;       // "YYYY-MM-DD"
  content: string;
  mood?: Mood;        // one mood per day, optional
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}

export interface OnThisDayEvent {
  year: number;
  text: string;
  thumbnail?: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  image?: string;
}
