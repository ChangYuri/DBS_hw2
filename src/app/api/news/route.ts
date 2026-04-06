import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'NEWS_API_KEY not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`,
      { next: { revalidate: 1800 } } // cache server-side for 30 minutes
    );
    if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);
    const data = await res.json();

    const articles = (data.articles ?? []).map((a: {
      title: string;
      url: string;
      source?: { name: string };
      urlToImage?: string;
    }) => ({
      title: a.title,
      url: a.url,
      source: a.source?.name ?? '',
      image: a.urlToImage,
    }));

    return NextResponse.json({ articles }, {
      headers: { 'Cache-Control': 'public, max-age=1800' },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
