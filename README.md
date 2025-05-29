# Probability Visualizer

An interactive web application that demonstrates key probability concepts using a standard 52-card deck. Built with TypeScript, Vite, and D3.js.

## Features

- **Interactive Event Selection**: Choose from 8 predefined events (red/black cards, suits, aces, face cards)
- **Real-time Probability Calculations**: Displays P(A), P(B), and P(A ∩ B) with exact fractions
- **Visual Card Highlighting**: Color-coded deck display showing event membership
- **D3 Relationship Visualization**: 
  - Mutually exclusive events shown as separate circles
  - Intersecting events shown as overlapping rectangles
- **Mathematical Analysis**: Automatic detection of mutual exclusivity and independence

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Integration as Submodule

This project is designed to be used as a git submodule. To integrate into your main project:

```bash
# Add as submodule
git submodule add https://github.com/jjohnson-47/stat-visual-idea.git path/to/visualizer

# Initialize and update
git submodule update --init --recursive

# Build the visualizer
cd path/to/visualizer
npm install
npm run build
```

### Integration Options

1. **Standalone Deployment**: Use `dist/` folder contents for static hosting
2. **Embedded Component**: Import and use individual functions from `src/`
3. **Development Integration**: Mount as development dependency

## Project Structure

```
src/
├── events.ts          # Core probability logic and card deck operations
├── ui.ts             # UI helpers and D3 visualization functions
├── main.ts           # Application entry point and state management
├── style.css         # Complete application styling
└── events.test.ts    # Comprehensive test suite (11 tests)
```

## Technical Details

- **Build Tool**: Vite 6.x with TypeScript
- **Language**: TypeScript 5.8 with strict mode
- **Visualization**: D3.js v7 for SVG manipulation
- **Testing**: Jest with ts-jest for ESM support
- **Styling**: Modern CSS with responsive design

## API Reference

### Core Functions (`src/events.ts`)

```typescript
// Probability calculations
probability(indices: number[]): number
intersection(a: number[], b: number[]): number[]
union(a: number[], b: number[]): number[]
isMutEx(a: number[], b: number[]): boolean
isIndependent(a: number[], b: number[]): boolean

// Available events
EVENTS: {
  red, black, ace, face, spades, hearts, clubs, diamonds
}
```

### UI Functions (`src/ui.ts`)

```typescript
// Main visualization function
renderRelationshipD3(state: AppState): void

// UI helpers
populateEventSelector(select: HTMLSelectElement): void
renderCardGrid(state: AppState): void
updateProbabilityPanel(state: AppState): void
initializeUI(): void
```

## Educational Use Cases

Perfect for demonstrating:

- **Mutual Exclusivity**: Red vs Black cards, different suits
- **Independence**: Ace vs Red cards (P(A∩B) = P(A)×P(B))
- **Conditional Probability**: Subset relationships
- **Set Theory**: Visual intersection and union operations

## Development

### Commands

- `npm run dev` - Development server with hot reload
- `npm run build` - Production build (TypeScript + Vite)
- `npm run preview` - Preview production build
- `npx jest` - Run test suite
- `npx tsc` - TypeScript type checking

### Testing

Comprehensive test suite covering:
- Deck integrity (52 unique cards)
- Event definitions (correct card counts)
- Probability calculations (mathematical accuracy)
- Set operations (intersection, union, mutual exclusivity)
- Independence verification (with epsilon tolerance)

## Browser Support

- Modern browsers with ES2020 support
- Responsive design for desktop and mobile
- SVG support required for visualizations

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]