// Core probability logic: cards, events, helpers

export type Card = { rank: string; suit: string; idx: number };

// Generate standard 52-card deck
export const SUITS = ["hearts", "diamonds", "clubs", "spades"];
export const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
export const deck: Card[] = SUITS.flatMap((suit, s) =>
  RANKS.map((rank, r) => ({ rank, suit, idx: s * 13 + r }))
);

// Named logical events, using card indexes
export const EVENTS: Record<string, { name: string; indices: number[] }> = {
  red: {
    name: "Red (Hearts or Diamonds)",
    indices: deck.filter(c => c.suit === "hearts" || c.suit === "diamonds").map(c => c.idx),
  },
  black: {
    name: "Black (Clubs or Spades)",
    indices: deck.filter(c => c.suit === "clubs" || c.suit === "spades").map(c => c.idx),
  },
  ace: {
    name: "Ace",
    indices: deck.filter(c => c.rank === "A").map(c => c.idx),
  },
  face: {
    name: "Face Card (J, Q, K)",
    indices: deck.filter(c => ["J", "Q", "K"].includes(c.rank)).map(c => c.idx),
  },
  spades: {
    name: "Spades",
    indices: deck.filter(c => c.suit === "spades").map(c => c.idx),
  },
  hearts: {
    name: "Hearts",
    indices: deck.filter(c => c.suit === "hearts").map(c => c.idx),
  },
  clubs: {
    name: "Clubs",
    indices: deck.filter(c => c.suit === "clubs").map(c => c.idx),
  },
  diamonds: {
    name: "Diamonds",
    indices: deck.filter(c => c.suit === "diamonds").map(c => c.idx),
  },
};

/** Get probability of event indices in a 52-card deck **/
export function probability(indices: number[]): number {
  return indices.length / deck.length;
}

/** Intersection indices of two events **/
export function intersection(a: number[], b: number[]): number[] {
  const aset = new Set(a);
  return b.filter(idx => aset.has(idx));
}

/** Union indices of two events **/
export function union(a: number[], b: number[]): number[] {
  const result = new Set([...a, ...b]);
  return Array.from(result).sort((x, y) => x - y);
}

/** Disjointness: mutually exclusive if no overlap **/
export function isMutEx(a: number[], b: number[]): boolean {
  return intersection(a, b).length === 0;
}

/** Independence: P(A ∩ B) ≈ P(A)*P(B) within epsilon **/
export function isIndependent(a: number[], b: number[], epsilon = 1e-10): boolean {
  const pA = probability(a);
  const pB = probability(b);
  const pAB = probability(intersection(a, b));
  return Math.abs(pA * pB - pAB) < epsilon;
}