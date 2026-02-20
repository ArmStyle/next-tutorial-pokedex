// ─────────────────────────────────────────────
// Shared Pokémon type definitions
// ─────────────────────────────────────────────

export interface Pokemon {
  name: string;
  url: string;
  id?: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    type: { name: string };
  }>;
  abilities: Array<{
    ability: { name: string };
    is_hidden: boolean;
  }>;
  sprites: {
    other: {
      'official-artwork': { front_default: string };
    };
  };
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
}
