import { NextResponse } from 'next/server';

const POKEAPI_BASE = process.env.NEXT_PUBLIC_POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    // First, get the Pokemon species to find the evolution chain URL
    const speciesRes = await fetch(`${POKEAPI_BASE}/pokemon-species/${name.toLowerCase()}`);
    
    if (!speciesRes.ok) {
      return NextResponse.json(
        { error: 'Pokemon species not found' },
        { status: 404 }
      );
    }

    const speciesData = await speciesRes.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;

    // Fetch the evolution chain
    const chainRes = await fetch(evolutionChainUrl);
    
    if (!chainRes.ok) {
      return NextResponse.json(
        { error: 'Evolution chain not found' },
        { status: chainRes.status }
      );
    }

    const chainData = await chainRes.json();

    // Parse the evolution chain into a more usable format
    const parseChain = (chainLink: Record<string, unknown>): Record<string, unknown> => {
      const link = chainLink as {
        species: { name: string; url: string };
        is_baby: boolean;
        evolution_details: unknown[];
        evolves_to: Array<Record<string, unknown>>;
      };
      return {
        name: link.species.name,
        url: link.species.url,
        isBaby: link.is_baby,
        evolutionDetails: link.evolution_details,
        evolvesTo: link.evolves_to?.map((l) => parseChain(l)) || [],
      };
    };

    const evolutionChain = parseChain(chainData.chain);

    return NextResponse.json({
      id: chainData.id,
      evolution_chain: evolutionChain,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
