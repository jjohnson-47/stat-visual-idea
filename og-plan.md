Below is a **full, production‑oriented implementation plan** that folds the feedback you received into an actionable roadmap—from content lock‑down all the way to deployment and classroom evaluation.  Sections are ordered so you can hand this straight to collaborators or treat it as your own checklist.

---

## 0 · Executive summary

| Aspect                | Decision                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Tech stack**        | HTML + CSS + TypeScript, bundled with Vite; D3 v7 for SVG drawing/tweens; Jest + Playwright for tests.       |
| **Artifacts**         | 1 × interactive web page, 1 × export‑to‑GIF script, optional PDF hand‑out.                                   |
| **Milestones**        | Content freeze → Core engine → Static visuals → Animation layer → UI polish → Accessibility & test → Deploy. |
| **Target completion** | 4 weeks part‑time (≈40–45 hours total) or 10 days full‑time.                                                 |

---

## 1 · Content finalisation (Days 1‑2)

| Task                                                                               | Owner                          | Deliverable                                                                                         | Acceptance criteria                                          |
| ---------------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **1.1 Storyboard each slide** (7 mandatory + room for extras)                      | *Instructional designer / you* | PDF / FigJam board with: wording, card grid highlights, Venn/rect layout, probability panel values. | All wording approved; numeric probabilities double‑checked.  |
| **1.2 Refine tricky‑case titles** (Slide 4)                                        | Same                           | Final list of slide titles (e.g. “Distinct Categories, Shared Outcomes”)                            | Titles no longer ambiguous; fit in UI width.                 |
| **1.3 Add explicit takeaway slide** (“Exclusive ⇒ never independent (non‑zero P)”) | Same                           | Storyboard frame 8                                                                                  | Text appears for ≥4 s in autoplay mode; matches RST colours. |

---

## 2 · Repo bootstrap (Day 2)

```bash
mkdir prob‑visualizer && cd prob‑visualizer
npm create vite@latest . --template vanilla-ts
npm i d3@7 card-info-typescript  # thin helper lib you’ll write
npm i -D jest @testing-library/dom playwright prettier eslint
```

* Enable **Prettier + ESLint** with a shared config.
* Add GitHub Actions for lint/test on push.
* Decide on `src/` sub‑modules now:
  `events.ts`, `deck.tsx` (yes: tiny Preact wrapper to keep DOM diffing trivial), `viz.ts`, `ui.ts`, `styles/`.

---

## 3 · Core logic module (`events.ts`) (Days 3‑4)

### 3.1 Deck representation

```ts
type Card = { rank: "A"|2|…|"K"; suit: "♠"|"♥"|"♦"|"♣"; idx: 0‑51 };
export const deck: Card[] = /* … */;
```

### 3.2 Event registry

```ts
interface EventDef { label: string; indices: number[] }
export const EVENTS: Record<string,EventDef> = {
  red: {...}, queen: {...}, // etc.
};
```

### 3.3 Probability helpers

```ts
export function probability(indices: number[]): number { return indices.length / 52; }

export function intersection(a:number[], b:number[]): number[] {
  const set = new Set(a); return b.filter(i => set.has(i));
}

export function isMutEx(a:number[], b:number[]): boolean { return intersection(a,b).length === 0; }

export function isIndependent(a:number[], b:number[]): boolean {
  const pA = probability(a), pB = probability(b);
  const pInt = probability(intersection(a,b));
  return Math.abs(pInt - pA*pB) < 1e‑12;
}
```

*Unit test all edge cases; include subset case (Slide 5) and probability‑0 events.*

---

## 4 · Static visuals (Days 4‑5)

1. **Card grid** (`DeckView.tsx`)

   * 52 × `div` flex grid; CSS classes `.in‑A`, `.in‑B`, `.in‑both`.
   * Data attribute with card idx for quick look‑ups.

2. **SVG scaffolding** (`VennView.ts`)

   * Pre‑compute positions: circles at (100,75) & (200,75), r = 60; rectangles 120 × 80 with centre offset.
   * Draw static shapes first; animation layer will mutate `transform`/`opacity`.

3. **Probability panel** (`StatsView.tsx`)

   * Render LaTeX‑ish with [KaTeX](https://katex.org) or simple HTML (`<sub>` / `<sup>`).
   * Tick mark/❌ icon inline SVG; driven by `isIndependent`.

---

## 5 · Animation & interaction (Days 6‑8)

### 5.1 State machine

```ts
interface VizState {
  eventA: string;
  eventB: string;
  mutEx: boolean;
  independent: boolean;
}
```

* Use a tiny observable store (or Preact/Signals) so all views reactively update.

### 5.2 D3 transitions

* **MutEx true → circles mode**

  * On state change, if previous not MutEx, fade rectangles out, then draw circles.
  * “Bounce” = keyframe CSS scaleX(0.9) over 400 ms.

* **MutEx false → rectangles mode**

  * Fade circles out; draw rectangles with `fill-opacity:0.5`.
  * Intersection rectangle: separate `<rect>` whose opacity animates from 0 → 0.5 in 300 ms.

* **Independence check**

  * If true: `#check` shows ✔ with green glow (`filter: drop-shadow`).
  * Else: blink ❌ 3× (CSS animation) then settle.

* Hook up `<select>`s: options pulled from `EVENTS`.

---

## 6 · UX polish & accessibility (Days 8‑9)

| Item                     | Requirement                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| **Keyboard nav**         | `tab` to selectors → `enter` to toggle deck highlight.                                         |
| **ARIA roles**           | `role="img"` on SVG; `aria-label` dynamic: “Two disjoint circles” vs “Overlapping rectangles”. |
| **Colour‑blind palette** | Use ColourBrewer safe palette (#377eb8, #e41a1c, #4daf4a).                                     |
| **Mobile layout**        | Breakpoint at < 600 px: grid under SVG, selectors top.                                         |

---

## 7 · Testing (Days 9‑10)

* **Logic tests** (`events.test.ts`) for every pair in `EVENTS`.
* **Visual regression**: Playwright screenshot tests for Slides 1–7.
* **Accessibility audit**: `npm run playwright -- --a11y`.

---

## 8 · Export & derivative assets (Day 11)

* Script `scripts/capture.js` (Node + Puppeteer)

  * Opens each slide in headless Chrome, records 3‑second MP4 @ 30 fps.
  * `ffmpeg` concat → GIF (for slides) and MP4 (for lecture).
* PDF hand‑out generated via `deck‑print.html` (static page + `wkhtmltopdf`).

---

## 9 · Deployment (Day 12)

| Step    | Tool                                            |
| ------- | ----------------------------------------------- |
| Build   | `vite build` → `dist/`                          |
| Hosting | GitHub Pages (or Netlify for nicer URL).        |
| CI      | Deploy on `main` push; Tag releases (`v1.0.0`). |

---

## 10 · Maintenance & extensibility

* **Adding new experiments** (e.g. dice, coin): drop‑in events in `EVENTS`; if experiment ≠ cards, toggle `#deck` into a dice SVG grid—component already abstracted behind `DeckView`.
* **Internationalisation**: Wrap labels in `i18n.ts`, load per user locale.
* **Analytics**: Simple click‑through tracking via Plausible to see which event pairs students test.

---

## 11 · Risk table & mitigations

| Risk                                                                         | Likelihood | Impact | Mitigation                                                                            |
| ---------------------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------- |
| Floating‑point rounding makes independence test fail for 1/52×4/52 ≈ 0.0059… | Low        | Medium | Use exact rational arithmetic (`fraction.js`) or tolerance 1e‑12 (already in helper). |
| Students misinterpret subset case                                            | Med        | Med    | Add on‑hover tooltip: “Event A ⊆ Event B, so knowing A guarantees B.”                 |
| Animation jank on low‑power devices                                          | Low        | Low    | `prefers-reduced-motion` media query disables bounce/fade; uses static shapes.        |

---

## 12 · Timeline Gantt (optional)

```
Week 1: |■■■■Storyboard■■■■|■■Repo & logic■■|
Week 2: |■■Static visuals■■|■■Anim & UI■■■■|
Week 3: |■■Testing & a11y■■|■Export/Deploy■|
```

---

### Ready for kickoff

With this plan you can:

1. **Freeze content** tomorrow.
2. **Write & test the engine** by the end of week one.
3. **Ship a polished, accessible interactive** in under three weeks—including derivative GIFs for slide decks.

Let me know which section you’d like fleshed out further (e.g. unit‑test examples, precise D3 code snippets, or design assets). Happy building!

