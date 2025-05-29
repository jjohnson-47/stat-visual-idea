Okay, here's a simplified and elegant plan focusing on the core functionality while retaining quality. This version prioritizes a quick path to a valuable, working interactive visualization.

---

## **Simplified Probability Visualizer Plan: Core MVP**

**Objective:** Rapidly develop an interactive webpage to clearly demonstrate key probability concepts (mutual exclusivity, independence) using a standard 52-card deck. Elegance will come from clarity and simplicity.

**Tech Stack (Core):** HTML + CSS + TypeScript, bundled with Vite; D3 v7 for SVG drawing/simple transitions; Jest for logic tests.

**Artifact:** 1 × interactive web page.

**Milestones:** Content Definition → Core Logic Engine → Static Visuals + Basic Interaction → Simple Transitions & Polish → Test & Deploy.

**Target Completion:** ~5-7 days part-time (≈15-20 hours) or 2-3 days full-time.

---

### **Phase 1: Foundation & Core Logic (≈ 1-2 days)**

1.  **Content Definition (Crucial but brief):**
    * Select **3 key illustrative scenarios** (e.g., 1 mutually exclusive, 1 independent, 1 subset).
    * Finalize wording for these scenarios directly.
2.  **Repo Bootstrap (Minimal):**
    * `npm create vite@latest . --template vanilla-ts`
    * `npm i d3@7`
    * `npm i -D jest`
    * Structure: `src/main.ts`, `src/events.ts`, `src/ui.ts`, `src/style.css`.
3.  **Core Logic Module (`events.ts`):**
    * **Deck Representation:** `type Card = { rank: string; suit: string; idx: number }; const deck: Card[]`.
    * **Event Registry:** `EVENTS` object, hardcoded with only the 3 chosen scenarios (e.g., `red`, `ace`, `spades`).
    * **Probability Helpers:**
        * `probability(indices: number[]): number`
        * `intersection(a:number[], b:number[]): number[]`
        * `isMutEx(a:number[], b:number[]): boolean`
        * `isIndependent(a:number[], b:number[]): boolean` (use a small epsilon for float comparisons, e.g., `1e-12`).
    * **Unit Tests (Jest):** Test all helper functions and the logic for your chosen event pairs. **This is key to quality.**

---

### **Phase 2: Visuals & Interaction (≈ 2-3 days)**

1.  **Static Visuals & Basic DOM (`main.ts` / HTML / `ui.ts`):**
    * **Card Grid:** Simple HTML structure styled with CSS Flexbox/Grid. Cards can be `<div>` elements.
        * CSS classes for highlighting: `.in-A`, `.in-B`, `.in-both`.
    * **SVG Scaffolding (D3):**
        * A single SVG area.
        * Functions to draw/update basic shapes: two circles (for mutually exclusive/independent) and two rectangles (for overlapping). Initially, just draw them statically.
    * **Probability Panel:** Simple HTML elements (`<p>`, `<span>`) to display P(A), P(B), P(A ∩ B), and a text status for "Mutually Exclusive: Yes/No", "Independent: Yes/No".
2.  **Interaction (`ui.ts` / `main.ts`):**
    * **Event Selection:** Two `<select>` elements, options populated from your simplified `EVENTS` object.
    * **State Management:** A minimal global state object in `main.ts` (e.g., `let currentState = { eventA: null, eventB: null, ... }`).
    * **Reactive Updates (Manual):**
        * On `<select>` change:
            * Update `currentState`.
            * Recalculate probabilities and statuses using `events.ts` functions.
            * Update text in the probability panel.
            * Update CSS classes on card grid elements.
            * Call D3 functions to redraw/update the SVG shapes (see next step).

---

### **Phase 3: Simple Animation & Polish (≈ 1 day)**

1.  **D3 Transitions (Subtle & Clear):**
    * When event selections change and SVG needs to update (e.g., circles to rectangles, or intersection area appearing):
        * Use simple D3 transitions (`.transition().duration(300)`) to animate opacity or position changes.
        * Example: If switching from MutEx (circles) to non-MutEx (rectangles), fade out circles, fade in rectangles.
        * Intersection rectangle: Animate `fill-opacity` from 0 to 0.5.
    * **Independence Indicator:** A static checkmark (✔) or cross (❌) icon (SVG or text) next to the "Independent" status. No complex animations needed.
2.  **Basic UX & Accessibility:**
    * Ensure keyboard navigation works for `<select>` elements.
    * Add `aria-label` to the SVG container describing its general purpose.
    * Use a clear, high-contrast color scheme.

---

### **Phase 4: Testing & Deployment (≈ 1 day)**

1.  **Testing:**
    * Thorough manual testing of the 3 chosen scenarios in a primary browser (e.g., Chrome).
    * Verify calculations, visual representations, and interactions.
2.  **Build & Deploy:**
    * `vite build`
    * Deploy the `dist/` folder to GitHub Pages or Netlify (manual drag-and-drop or simple CLI deploy).

---

**Key Simplifications for this MVP:**

* **Content:** Drastically reduced number of scenarios/slides.
* **Artifacts:** Web page only. No GIF/MP4/PDF.
* **Animations:** Minimal and simple D3 transitions. No CSS keyframe animations or complex D3 sequences.
* **UI:** Standard HTML controls. Minimal custom styling.
* **Tech:** No Preact/Signals (manual DOM updates or simple D3 data binding is fine for this scale).
* **Testing:** Core logic unit tests are essential. Visual testing is manual. No Playwright or extensive accessibility audits for this cut-down version.
* **Deployment:** Manual or simple CI.
* **Deferred:** Advanced accessibility, internationalization, analytics, mobile-specific layouts, export features.

This streamlined approach delivers the core educational value quickly and elegantly through its focus and simplicity.
