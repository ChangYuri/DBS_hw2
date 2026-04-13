export type Mood = 'happy' | 'excited' | 'content' | 'neutral' | 'anxious' | 'sad' | 'angry';

export interface DiaryEntry {
  date: string;       // "YYYY-MM-DD"
  content: string;
  mood?: Mood;        // one mood per day, optional
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
  isShared?: boolean; // opt-in to community feed, default false
}

export interface CommunityEntry {
  id: string;          // entry UUID — needed for likes/comments
  date: string;        // "YYYY-MM-DD"
  excerpt: string;     // first 200 chars of content
  mood?: Mood;
  likeCount: number;
  likedByMe: boolean;
  comments: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  body: string;
  createdAt: string;
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
