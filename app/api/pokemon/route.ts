import { NextResponse } from 'next/server';

const POKEAPI_BASE = process.env.NEXT_PUBLIC_POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';

    const response = await fetch(
      `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Pokemon' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
