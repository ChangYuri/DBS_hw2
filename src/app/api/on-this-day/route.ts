import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');
  const day = searchParams.get('day');

  if (!month || !day || !/^\d{1,2}$/.test(month) || !/^\d{1,2}$/.test(day)) {
    return NextResponse.json({ error: 'Invalid month or day' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`,
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 86400 }, // cache server-side for 24 hours
      }
    );
    if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`);
    const data = await res.json();

    const events = (data.events ?? []).slice(0, 5).map((e: {
      year: number;
      text: string;
      pages?: Array<{ thumbnail?: { source: string } }>;
    }) => ({
      year: e.year,
      text: e.text,
      thumbnail: e.pages?.[0]?.thumbnail?.source,
    }));

    return NextResponse.json({ events }, {
      headers: { 'Cache-Control': 'public, max-age=86400' },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
