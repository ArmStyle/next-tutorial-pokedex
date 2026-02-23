import { NextResponse } from 'next/server';

const POKEAPI_BASE = process.env.NEXT_PUBLIC_POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ generation: string }> }
) {
  try {
    const { generation } = await params;
    const generationNum = parseInt(generation, 10);

    // Validate generation (1-9)
    if (isNaN(generationNum) || generationNum < 1 || generationNum > 9) {
      return NextResponse.json(
        { error: 'Invalid generation. Must be 1-9' },
        { status: 400 }
      );
    }

    // Fetch generation data from PokéAPI
    const response = await fetch(`${POKEAPI_BASE}/generation/${generationNum}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract Pokémon list from generation
    // PokéAPI returns pokemon_species, but we'll return the names and urls
    const pokemonList = data.pokemon_species.map(
      (p: { name: string; url: string }) => ({
        name: p.name,
        url: p.url.replace('/pokemon-species/', '/pokemon/'),
      })
    );

    return NextResponse.json({
      generation: generationNum,
      name: data.name,
      pokemon_count: pokemonList.length,
      results: pokemonList,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
