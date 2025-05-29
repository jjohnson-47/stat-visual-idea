import { deck, EVENTS, probability, intersection, isMutEx, isIndependent } from './events';
import * as d3 from 'd3';

export interface AppState {
  eventA: string | null;
  eventB: string | null;
}

/**
 * Draws Venn or rectangle diagrams showing the relationship between two events.
 * - Mutually exclusive: two distant circles (classic Venn)
 * - Intersecting: two overlapping rectangles
 */
export function renderRelationshipD3(state: AppState): void {
  const svg = d3.select('#venn-svg');
  svg.selectAll('*').remove();

  // Panel size - match CSS expectations
  const W = 400, H = 300;
  svg.attr('width', W).attr('height', H);

  if (!state.eventA || !state.eventB) return;
  const evtA = EVENTS[state.eventA];
  const evtB = EVENTS[state.eventB];
  if (!evtA || !evtB) return;
  
  const a = evtA.indices;
  const b = evtB.indices;
  const intersectionIndices = intersection(a, b);
  const mutex = isMutEx(a, b);

  const colorA = '#377eb8'; // blue
  const colorB = '#e41a1c'; // red

  if (mutex) {
    // Disjoint: Two circles, no overlap
    svg.append('circle')
      .attr('cx', 120).attr('cy', 150).attr('r', 70)
      .style('fill', colorA).style('fill-opacity', 0.7)
      .style('stroke', colorA).style('stroke-width', 2)
      .style('opacity', 0)
      .transition().duration(300).style('opacity', 1);

    svg.append('circle')
      .attr('cx', 280).attr('cy', 150).attr('r', 70)
      .style('fill', colorB).style('fill-opacity', 0.7)
      .style('stroke', colorB).style('stroke-width', 2)
      .style('opacity', 0)
      .transition().duration(300).style('opacity', 1);

    // Labels
    svg.append('text')
      .attr('x', 120).attr('y', 155)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-weight', 'bold')
      .style('font-size', '14px')
      .style('opacity', 0)
      .transition().delay(300).duration(200).style('opacity', 1)
      .text('A');

    svg.append('text')
      .attr('x', 280).attr('y', 155)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-weight', 'bold')
      .style('font-size', '14px')
      .style('opacity', 0)
      .transition().delay(300).duration(200).style('opacity', 1)
      .text('B');

  } else {
    // Overlapping: Two rectangles
    const rectA = { x: 80, y: 80, width: 140, height: 120 };
    const rectB = { x: 180, y: 100, width: 140, height: 120 };

    svg.append('rect')
      .attr('x', rectA.x).attr('y', rectA.y)
      .attr('width', rectA.width).attr('height', rectA.height)
      .style('fill', colorA).style('fill-opacity', 0.6)
      .style('stroke', colorA).style('stroke-width', 2)
      .style('opacity', 0)
      .transition().duration(300).style('opacity', 1);

    svg.append('rect')
      .attr('x', rectB.x).attr('y', rectB.y)
      .attr('width', rectB.width).attr('height', rectB.height)
      .style('fill', colorB).style('fill-opacity', 0.6)
      .style('stroke', colorB).style('stroke-width', 2)
      .style('opacity', 0)
      .transition().duration(300).style('opacity', 1);

    // Labels
    svg.append('text')
      .attr('x', rectA.x + 30).attr('y', rectA.y + 30)
      .style('fill', colorA)
      .style('font-weight', 'bold')
      .style('font-size', '16px')
      .style('opacity', 0)
      .transition().delay(300).duration(200).style('opacity', 1)
      .text('A');

    svg.append('text')
      .attr('x', rectB.x + rectB.width - 30).attr('y', rectB.y + 30)
      .attr('text-anchor', 'end')
      .style('fill', colorB)
      .style('font-weight', 'bold')
      .style('font-size', '16px')
      .style('opacity', 0)
      .transition().delay(300).duration(200).style('opacity', 1)
      .text('B');

    // Intersection count annotation
    if (intersectionIndices.length > 0) {
      const intersectX = Math.max(rectA.x, rectB.x) + 20;
      const intersectY = Math.max(rectA.y, rectB.y) + 40;
      
      svg.append('text')
        .attr('x', intersectX).attr('y', intersectY)
        .style('fill', '#333')
        .style('font-weight', 'bold')
        .style('font-size', '12px')
        .style('opacity', 0)
        .transition().delay(500).duration(200).style('opacity', 1)
        .text(`∩ = ${intersectionIndices.length}`);
    }
  }

  // Title
  svg.append('text')
    .attr('x', W/2).attr('y', 25)
    .attr('text-anchor', 'middle')
    .style('fill', '#333')
    .style('font-weight', 'bold')
    .style('font-size', '14px')
    .style('opacity', 0)
    .transition().delay(400).duration(200).style('opacity', 1)
    .text(mutex ? 'Mutually Exclusive Events' : 'Intersecting Events');
}

/** Populate event selector with available events */
export function populateEventSelector(selectElement: HTMLSelectElement): void {
  // Clear existing options except the first one
  selectElement.innerHTML = '<option value="">Select an event...</option>';
  
  Object.entries(EVENTS).forEach(([key, event]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = event.name;
    selectElement.appendChild(option);
  });
}

/** Render the card grid with highlighting based on current state */
export function renderCardGrid(state: AppState): void {
  const gridElement = document.getElementById('card-grid');
  if (!gridElement) return;

  gridElement.innerHTML = '';
  
  const eventAIndices = state.eventA ? new Set(EVENTS[state.eventA]?.indices || []) : new Set();
  const eventBIndices = state.eventB ? new Set(EVENTS[state.eventB]?.indices || []) : new Set();
  
  deck.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.textContent = `${card.rank}${getSuitSymbol(card.suit)}`;
    
    // Apply highlighting classes
    const inA = eventAIndices.has(card.idx);
    const inB = eventBIndices.has(card.idx);
    
    if (inA && inB) {
      cardElement.classList.add('in-both');
    } else if (inA) {
      cardElement.classList.add('in-a');
    } else if (inB) {
      cardElement.classList.add('in-b');
    }
    
    gridElement.appendChild(cardElement);
  });
}

/** Update the probability panel with calculations */
export function updateProbabilityPanel(state: AppState): void {
  const panelElement = document.getElementById('prob-panel');
  if (!panelElement) return;

  if (!state.eventA || !state.eventB) {
    panelElement.innerHTML = '<p>Select two events to see probability calculations</p>';
    return;
  }

  const eventA = EVENTS[state.eventA];
  const eventB = EVENTS[state.eventB];
  
  if (!eventA || !eventB) return;

  const pA = probability(eventA.indices);
  const pB = probability(eventB.indices);
  const intersectionIndices = intersection(eventA.indices, eventB.indices);
  const pAB = probability(intersectionIndices);
  
  const isMutuallyExclusive = isMutEx(eventA.indices, eventB.indices);
  const areIndependent = isIndependent(eventA.indices, eventB.indices);

  panelElement.innerHTML = `
    <div class="probability-stats">
      <h3>Probability Analysis</h3>
      <div class="prob-row">
        <span class="prob-label">P(${eventA.name}):</span>
        <span class="prob-value">${pA.toFixed(4)} (${eventA.indices.length}/52)</span>
      </div>
      <div class="prob-row">
        <span class="prob-label">P(${eventB.name}):</span>
        <span class="prob-value">${pB.toFixed(4)} (${eventB.indices.length}/52)</span>
      </div>
      <div class="prob-row">
        <span class="prob-label">P(A ∩ B):</span>
        <span class="prob-value">${pAB.toFixed(4)} (${intersectionIndices.length}/52)</span>
      </div>
      <div class="relationship-analysis">
        <div class="relationship-row">
          <span class="relationship-label">Mutually Exclusive:</span>
          <span class="relationship-value ${isMutuallyExclusive ? 'yes' : 'no'}">
            ${isMutuallyExclusive ? 'Yes ✓' : 'No ✗'}
          </span>
        </div>
        <div class="relationship-row">
          <span class="relationship-label">Independent:</span>
          <span class="relationship-value ${areIndependent ? 'yes' : 'no'}">
            ${areIndependent ? 'Yes ✓' : 'No ✗'}
          </span>
        </div>
      </div>
    </div>
  `;
}

/** Get Unicode symbol for card suit */
function getSuitSymbol(suit: string): string {
  const symbols: Record<string, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  };
  return symbols[suit] || suit;
}

/** Initialize all UI components */
export function initializeUI(): void {
  const eventASelect = document.getElementById('event-a') as HTMLSelectElement;
  const eventBSelect = document.getElementById('event-b') as HTMLSelectElement;
  
  if (eventASelect) populateEventSelector(eventASelect);
  if (eventBSelect) populateEventSelector(eventBSelect);
  
  // Initial render with empty state
  const initialState: AppState = { eventA: null, eventB: null };
  renderCardGrid(initialState);
  updateProbabilityPanel(initialState);
}