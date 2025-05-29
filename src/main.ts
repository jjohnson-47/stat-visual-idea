import './style.css'
import { initializeUI, renderCardGrid, updateProbabilityPanel, renderRelationshipD3, AppState } from './ui'

// Application state
let currentState: AppState = {
  eventA: null,
  eventB: null
};

// Initialize the application
function initApp(): void {
  // Initialize UI components
  initializeUI();
  
  // Set up event listeners
  setupEventListeners();
}

// Set up event listeners for the selectors
function setupEventListeners(): void {
  const eventASelect = document.getElementById('event-a') as HTMLSelectElement;
  const eventBSelect = document.getElementById('event-b') as HTMLSelectElement;
  
  if (eventASelect) {
    eventASelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      currentState.eventA = target.value || null;
      updateUI();
    });
  }
  
  if (eventBSelect) {
    eventBSelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      currentState.eventB = target.value || null;
      updateUI();
    });
  }
}

// Update all UI components based on current state
function updateUI(): void {
  renderCardGrid(currentState);
  updateProbabilityPanel(currentState);
  renderRelationshipD3(currentState);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
