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
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
    other: {
      'official-artwork': { front_default: string };
    };
  };
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
  moves: Array<{
    move: { name: string };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: { name: string };
    }>;
  }>;
  held_items: Array<{
    item: { name: string };
    version_details: Array<{
      rarity: number;
      version: { name: string };
    }>;
  }>;
  cries: {
    latest: string;
    legacy: string | null;
  };
}
