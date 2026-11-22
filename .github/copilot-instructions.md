# Copilot Instructions: Correlation Files

**The Correlation Files** is an interactive narrative game designed to teach data literacy, specifically how to distinguish correlation from causation. It's built as a modern-noir detective game where players investigate suspicious statistical claims.

## Project Overview

- **Purpose**: Educational game lab for teaching data interpretation, pattern recognition, and critical thinking about data claims
- **Tech Stack**: React 19 + TypeScript 6 + Vite + Zustand (state) + Motion (animations) + Lucide React (icons) + @dnd-kit/react (drag-drop) + Recharts (data viz)
- **Design Language**: Modern Noir Investigation—dark anthrazit backgrounds, cream paper documents, orange accents, serif headlines
- **Deployment**: GitHub Pages via Vite federation plugin (base: `/dash-games/`)

## High-Level Architecture

### Game Flow

The game is structured as a **multi-screen experience** managed by Zustand state:

```
Headquarters (case selection)
  → Case Briefing (narrative setup)
    → Evidence Room (collect clues)
      → Evidence Wall (categorize & hypothesize)
        → Data Investigation (interactive charts)
          → The Verdict (conclusions)
```

### Core State Management (`src/store/gameStore.ts`)

Zustand store with **persistent localStorage** (key: `correlation-files-save`) tracks:

- **`currentScreen`**: One of `"headquarters" | "briefing" | "evidence" | "evidence-wall"` (governs which component renders)
- **`selectedCaseId`**: The case being investigated (e.g., `"summer-mystery"`)
- **`progressByCase`**: Per-case progress object containing:
  - `discoveredEvidence`: IDs of evidence the player has seen
  - `collectedEvidence`: IDs of evidence the player has picked up
  - `evidencePlacements`: Map of evidence ID → category (`"supports" | "context" | "unclear"`)
  - `hypothesis`: Player's written hypothesis

**Migration strategy** (in persist config) auto-injects initial evidence for `summer-mystery` case to avoid loss on updates.

### Key Actions

- **Screen navigation**: `openCase()`, `goHome()`, `startInvestigation()`, `openEvidenceWall()`, `closeEvidenceWall()`
- **Evidence flow**: `discoverEvidence()` → `collectEvidence()` → `placeEvidence()` / `removeEvidencePlacement()`
- **Hypothesis**: `updateHypothesis()`

### Component Structure

```
App.tsx
├── Headquarters (case selection, card layout)
├── Briefing (narrative intro, case details)
├── EvidenceRoom (evidence discovery grid, collection mechanics)
│   └── EvidenceCard (clickable evidence items)
├── EvidenceWall (hypothesis board, drag-drop evidence placement)
│   └── EvidenceWallCard (draggable evidence)
└── DataInvestigation (Recharts visualizations, TODO)

Data Layer:
├── data/cases.ts (case definitions with narrative & metadata)
├── data/evidence.ts (evidence details, unlock conditions)
└── data/datasets.ts (Recharts dataset configs)
```

## Running Commands

### Development
```bash
yarn dev
# Starts Vite dev server on http://localhost:5174
```

### Build
```bash
yarn build
# Runs TypeScript compiler, then Vite build (outputs dist/)
```

### Linting
```bash
yarn lint
# ESLint + TypeScript strict mode (noUnusedLocals, noUnusedParameters, etc.)
```

### Single Test (when tests are added)
```bash
# Tests are not yet configured; use vitest when needed
```

## Code Conventions & Patterns

### Component Structure

Each screen component follows this pattern:

```tsx
function ScreenName() {
  const selector = useGameStore((state) => state.action);
  
  return (
    <motion.main className="screen-class">
      {/* Content */}
    </motion.main>
  );
}
```

- Use `useGameStore` hooks to select only needed state (not full state object)
- Wrap main elements in `<motion.*>` with Framer Motion `AnimatePresence` integration
- Always provide `initial`, `animate`, `exit` for smooth transitions
- Use semantic HTML (`<main>`, `<button>`, etc.)

### Styling

- **CSS-in-class** (no CSS-in-JS framework; inline classes)
- **BEM-lite naming**: `.screen-name`, `.button--variant`, `.card__title`
- **Color palette** (defined in design but apply via classes):
  - Background: `#171A1D`
  - Surface: `#252A2E`
  - Paper: `#E8E0D1` (documents)
  - Accent: `#D68B48` (highlights, hover)
  - Alert: `#9C5148` (warnings)
- **Typography**: Playfair Display (headings), DM Sans (UI), DM Mono (data/case numbers)
- **Responsive**: Mobile-first, test at 375px+ widths

### Data Structure

#### Cases (`src/data/cases.ts`)

```ts
export interface Case {
  id: string;
  number: string;        // "001", "002", etc.
  title: string;
  subtitle: string;
  description: string;
  learningGoals: string[]; // e.g., ["Correlation vs Causation", "Confounding Variables"]
}
```

#### Evidence (`src/data/evidence.ts`)

```ts
export interface Evidence {
  id: string;
  caseId: string;
  title: string;
  content: string;
  category: "document" | "data" | "note"; // Visual grouping
  revealed?: boolean;    // Whether initially visible
  unlockCondition?: {    // Can depend on other evidence
    type: "after-discovery";
    dependsOn: string;
  };
}
```

#### Datasets (`src/data/datasets.ts`)

Recharts-compatible data structures:

```ts
export const summerMysteryData = [
  { month: "June", iceCreamSales: 100, waterAccidents: 5, temperature: 20 },
  // ...
];
```

### State Update Patterns

Zustand updates use **immer middleware** (automatically freezes state). Always use spread syntax for nested updates:

```ts
set((state) => ({
  progressByCase: {
    ...state.progressByCase,
    [caseId]: {
      ...progress,
      collectedEvidence: [...progress.collectedEvidence, id],
    },
  },
}));
```

**Never mutate directly**; always create new objects.

### Animation Patterns

Use Motion for screen transitions and interactive elements:

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.3 }}
/>
```

For drag-drop in EvidenceWall, **@dnd-kit/react** provides hooks—avoid native HTML drag-drop (unreliable on touch).

## Pedagogical Principles

- **No arbitrary gamification**: No XP, badges, or leaderboards
- **Discovery learning**: Avoid explicit "correct answer" messaging
- **Progressive disclosure**: Unlock evidence gradually; force reasoning before revealing more
- **Branching scenarios**: Multiple valid conclusions when data is ambiguous (e.g., "Data insufficient" is a valid verdict)
- **Role-playing**: Player is an investigator; design language reinforces this
- **Interactive storytelling**: Narrative pacing matches cognitive load

Apply these when:
- Writing evidence content (avoid spoiling the case)
- Designing feedback (acknowledge valid reasoning, even if not "correct")
- Structuring case progression (each screen should raise new questions)
- Labeling categories (use neutral terms: "Supports my hypothesis," not "Right/Wrong")

## Known Issues & Next Steps

### Current Blockers

- **Navigation to EvidenceWall**: Button exists but transition may not render reliably—verify `currentScreen` value reaches `"evidence-wall"` in Zustand state
- **Drag-drop stability**: Native HTML drag events work but inconsistent on touch; @dnd-kit migration needed for mobile support

### Priority 1 (Stabilization)

- Verify all screen transitions in App.tsx AnimatePresence logic
- Test that `openEvidenceWall()` action fires and state updates correctly
- Console log state changes to debug navigation

### Priority 2 (EvidenceWall UX)

- Migrate to @dnd-kit/react (already in package.json, not yet integrated)
- Add keyboard fallback for drag-drop (accessibility)
- Visualize evidence placement (highlight placed items differently)

### Priority 3 (DataInvestigation)

- Implement Recharts visualizations (component skeleton exists)
- Surface confounding variables incrementally (e.g., reveal temperature after player guesses ice cream → accidents)
- Add interactive toggles (show/hide third variable)

### Priority 4 (The Verdict)

- Multiple-choice verdict screen
- Text feedback on player's reasoning quality
- Case-completion state & unlocking next case

## TypeScript & Linting Notes

- **Strict mode enabled**: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **React 19 JSX transform**: No `import React` needed; use `react-jsx` automatic transform
- **Module resolution**: Set to `bundler`; import paths are relative (no path aliases)
- **ESLint flat config**: Uses `typescript-eslint` v8+, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

Fix linting errors before committing:

```bash
yarn lint    # Check
# Then manually fix or use IDE quick-fixes for auto-solvable issues
```

## Git & Deployment

- **Branch**: Main branch auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`
- **Base URL**: `/dash-games/` (configured in vite.config.ts)
- **Vite federation**: Exposes `./App` as `remoteEntry.js` for potential micro-frontend integration
- **Cache busting**: Vite handles asset hashing automatically

Before pushing:
1. Run `yarn lint`
2. Run `yarn build` to verify no build errors
3. Test locally: `yarn dev` → open http://localhost:5174

## Resources & References

- **Game design**: See README.md for detailed vision, learning goals (4 cases), and visual design guidelines
- **TypeScript config**: `tsconfig.app.json` for app code (strict), `tsconfig.node.json` for build tooling
- **Vite federation**: `.originjs/vite-plugin-federation` for module federation setup
- **State persistence**: Zustand persist middleware with localStorage; migration function handles schema updates
