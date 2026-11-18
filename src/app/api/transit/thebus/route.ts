import { NextRequest, NextResponse } from 'next/server';
import { THEBUS_STOPS } from '@/lib/transit/data';
import { fetchHeaArrivals } from '@/lib/transit/hea';
import type { HeaApiResponse } from '@/lib/transit/types';

export const dynamic = 'force-dynamic';

// Example: GET /api/transit/thebus?stop=983
// In mockup mode the endpoint is safe to call, but returns no fake live times.
export async function GET(request: NextRequest) {
  const stopId = request.nextUrl.searchParams.get('stop') ?? '983';
  if (!THEBUS_STOPS.some((stop) => stop.stopId === stopId)) {
    return NextResponse.json({ mode: 'error', stop: stopId, arrivals: [], message: 'Unknown stop' } satisfies HeaApiResponse, { status: 400 });
  }

  const apiKey = process.env.THEBUS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      mode: 'not-configured', stop: stopId, arrivals: [],
      message: 'HEA AppID is not configured. The mockup uses clearly labeled samples instead.',
    } satisfies HeaApiResponse);
  }

  try {
    const arrivals = await fetchHeaArrivals(stopId, apiKey);
    return NextResponse.json({ mode: 'live', stop: stopId, arrivals, updatedAt: new Date().toISOString() } satisfies HeaApiResponse,
      { headers: { 'Cache-Control': 'public, max-age=20, stale-while-revalidate=30' } });
  } catch {
    // Keep upstream failures generic: no credentials or request URLs in responses.
    return NextResponse.json({ mode: 'error', stop: stopId, arrivals: [],
      message: 'TheBus arrival feed is unavailable right now. Please check official HEA.',
    } satisfies HeaApiResponse, { status: 502 });
  }
}
