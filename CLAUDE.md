# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a probability visualization project built with TypeScript, Vite, and D3.js. The goal is to create an interactive webpage that demonstrates key probability concepts (mutual exclusivity, independence) using a standard 52-card deck.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compiler + Vite build)
- `npm run preview` - Preview production build locally
- `npx jest` - Run tests (Jest with ts-jest for TypeScript support)
- `npx tsc` - Run TypeScript type checking

## Architecture

### Core Structure
- `src/events.ts` - Core probability logic and card deck operations
- `src/main.ts` - Entry point and DOM setup
- `src/counter.ts` - Counter component (legacy from Vite template)
- Tests use `.test.ts` suffix and are located alongside source files

### Key Components

**Card System (`events.ts`)**:
- `Card` type with rank, suit, and index properties
- Standard 52-card deck generation
- Event registry (`EVENTS`) mapping named events to card indices
- Probability calculation functions (`probability`, `intersection`, `isMutEx`, `isIndependent`)

**Architecture Pattern**:
- Index-based event representation for efficient set operations
- Functional approach with pure helper functions
- Events defined as arrays of card indices for performance

## Technology Stack

- **Build Tool**: Vite with TypeScript template
- **Language**: TypeScript with strict mode enabled
- **Visualization**: D3.js v7 for SVG manipulation
- **Testing**: Jest with ts-jest preset for ESM support
- **Module System**: ES modules (`"type": "module"` in package.json)

## Testing Configuration

Jest is configured for TypeScript ESM:
- Tests must use `.ts` extension
- Located in `src/` directory
- ESM imports/exports supported
- Test files follow pattern: `*.test.ts` or `*.spec.ts`