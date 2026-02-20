import { NextResponse } from 'next/server';

const POKEAPI_BASE = process.env.NEXT_PUBLIC_POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Decode the id in case it's URL encoded
    const decodedId = decodeURIComponent(id).toLowerCase();
    
    const response = await fetch(`${POKEAPI_BASE}/pokemon/${decodedId}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
