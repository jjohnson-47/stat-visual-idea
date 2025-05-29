import { deck, EVENTS, probability, intersection, union, isMutEx, isIndependent } from "./events";

describe("card deck integrity", () => {
  it("deck should have 52 unique cards", () => {
    expect(deck).toHaveLength(52);
    const unique = new Set(deck.map(c => c.idx));
    expect(unique.size).toBe(52);
  });
});

describe("EVENTS definition", () => {
  it("red event is 26 cards (hearts/diamonds)", () => {
    expect(EVENTS.red.indices.length).toBe(26);
  });
  it("black event is 26 cards (clubs/spades)", () => {
    expect(EVENTS.black.indices.length).toBe(26);
  });
  it("ace event is 4 cards", () => {
    expect(EVENTS.ace.indices.length).toBe(4);
  });
  it("face cards are 12 cards (J,Q,K of each suit)", () => {
    expect(EVENTS.face.indices.length).toBe(12);
  });
  it("each suit is 13 cards", () => {
    expect(EVENTS.spades.indices.length).toBe(13);
    expect(EVENTS.hearts.indices.length).toBe(13);
    expect(EVENTS.clubs.indices.length).toBe(13);
    expect(EVENTS.diamonds.indices.length).toBe(13);
  });
});

describe("probability functions", () => {
  const A = EVENTS.ace.indices;
  const R = EVENTS.red.indices;
  const B = EVENTS.black.indices;
  const S = EVENTS.spades.indices;
  const H = EVENTS.hearts.indices;
  const C = EVENTS.clubs.indices;
  const F = EVENTS.face.indices;

  it("probability examples", () => {
    expect(probability(A)).toBeCloseTo(4/52);
    expect(probability(R)).toBeCloseTo(26/52);
    expect(probability(S)).toBeCloseTo(13/52);
    expect(probability(F)).toBeCloseTo(12/52);
  });

  it("intersection -- e.g. Ace ∩ Red (Ace of Hearts/Diamonds)", () => {
    const aceRed = intersection(A, R);
    expect(aceRed.length).toBe(2); // Ace of hearts and ace of diamonds
    
    const aceSpades = intersection(A, S);
    expect(aceSpades.length).toBe(1); // Ace of spades only
  });
  
  it("union -- e.g. Ace ∪ Face (Aces + Face cards)", () => {
    const aceOrFace = union(A, F);
    expect(aceOrFace.length).toBe(16); // 4 aces + 12 face cards
  });

  it("isMutEx -- Red vs Black (should be mutually exclusive)", () => {
    expect(isMutEx(R, B)).toBe(true);
    expect(isMutEx(R, S)).toBe(true); // Red vs Spades
    expect(isMutEx(R, C)).toBe(true); // Red vs Clubs
    expect(isMutEx(H, S)).toBe(true); // Hearts vs Spades
    
    // Not mutually exclusive
    expect(isMutEx(A, R)).toBe(false); // Aces and Red overlap
  });
  
  it("isIndependent -- mathematically correct independence tests", () => {
    // Ace and Red: P(A)=4/52, P(R)=26/52, P(A∩R)=2/52
    // P(A)*P(R) = (4/52)*(26/52) = 104/2704 = 2/52 ✓
    expect(isIndependent(A, R)).toBe(true);
    
    // Ace and Spades: P(A)=4/52, P(S)=13/52, P(A∩S)=1/52
    // P(A)*P(S) = (4/52)*(13/52) = 52/2704 = 1/52 ✓
    expect(isIndependent(A, S)).toBe(true);
    
    // Red and Spades: P(R)=26/52, P(S)=13/52, P(R∩S)=0/52
    // P(R)*P(S) = (26/52)*(13/52) = 338/2704 ≠ 0 ✗
    expect(isIndependent(R, S)).toBe(false);
    
    // Red and Black: completely disjoint
    expect(isIndependent(R, B)).toBe(false);
  });
});