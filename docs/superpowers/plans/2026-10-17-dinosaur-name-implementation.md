# Dinosaur Name Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a four-photo dinosaur name-matching game, reachable from the Dinosaurios menu.

**Architecture:** A new, isolated `src/games/dinosaur-name/` module holds immutable round state and its DnD React screen. The application adds a hash route and menu callback; shared dinosaur content stays in `src/data/dinosaurs.ts`.

**Tech Stack:** React 19, TypeScript, `@dnd-kit/core`, Vitest, React Testing Library, CSS.

**Spec:** `docs/superpowers/specs/2026-10-17-dinosaur-name-design.md`

## Global Constraints

- Use only dinosaur names and images already defined in `src/data/dinosaurs.ts`.
- Each round has exactly four distinct dinosaurs and shows four fixed photo destinations.
- Present one large, draggable pending name at a time; only a correct drop advances it.
- Preserve `touch-action: none`, large targets, semantic labels, 1920×1080 layout, and `prefers-reduced-motion`.
- Do not add persistence, audio, a shared game engine, or changes to the existing diet game.

## Review Focus

- A source collection with fewer than four dinosaurs: selection must return the available distinct dinosaurs without duplicating entries.
- An attempted drop after completion: it must not alter the completed state.
- An incorrect drop on a photo already marked correct: it must not advance the current name or duplicate progress.
- A restart after completing a round: it must clear resolved markers and restore a pending name.
- Hash navigation from and back to the dinosaur menu: the new route must render the correct screen and Home must return to the main menu.

### Task 1: Immutable dinosaur-name game state

**Files:**
- Create: `src/games/dinosaur-name/game-state.ts`
- Create: `src/games/dinosaur-name/game-state.test.ts`

**Interfaces:**
- Consumes: `Dinosaur` from `src/data/dinosaurs.ts`.
- Produces: `selectRound(dinosaurs: readonly Dinosaur[]): Dinosaur[]`, `createGameState(round: readonly Dinosaur[]): GameState`, and `matchCurrentName(state: GameState, dinosaurId: string): MatchResult`.

- [ ] **Step 1: Write failing state tests**

Cover a four-item round with unique ids, a source containing fewer than four dinosaurs, a correct match advancing the pending name and adding one resolved id, an incorrect match preserving object identity, and the fourth correct match setting `completed`.

- [ ] **Step 2: Run state tests to verify they fail**

Run: `npm test -- src/games/dinosaur-name/game-state.test.ts --run`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement state transitions in `src/games/dinosaur-name/game-state.ts`**

Define `GameState` with `round`, `pending`, `resolvedIds`, and `completed`, plus `MatchResult` with `accepted` and `state`. Shuffle a copied source array, take at most four entries, and never mutate the input state or round.

- [ ] **Step 4: Run state tests to verify they pass**

Run: `npm test -- src/games/dinosaur-name/game-state.test.ts --run`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/games/dinosaur-name/game-state.ts src/games/dinosaur-name/game-state.test.ts
git commit -m "feat: add dinosaur name game state"
```

### Task 2: Dinosaur-name game screen and visual feedback

**Files:**
- Create: `src/games/dinosaur-name/DinosaurNameGame.tsx`
- Create: `src/games/dinosaur-name/DinosaurNameGame.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: `DINOSAURS`, `GameHeader`, `Modal`, `ProgressIndicator`, and Task 1 state functions.
- Produces: `DinosaurNameGame({ onHome?: () => void }): JSX.Element`.

- [ ] **Step 1: Write failing component tests**

Render the game with deterministic `Math.random`, assert four image destinations and the first draggable name, then trigger DnD end events for a wrong id and the correct id. Assert wrong feedback does not advance progress, correct feedback marks its photo and shows the next name, and four correct drops show the celebration modal. Add a restart assertion that restores `0/4` and an active name.

- [ ] **Step 2: Run component tests to verify they fail**

Run: `npm test -- src/games/dinosaur-name/DinosaurNameGame.test.tsx --run`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement `DinosaurNameGame`**

Use `DndContext`, `PointerSensor` with an 8px activation distance, one `useDraggable` name card, and one `useDroppable` zone per photo id. Call `matchCurrentName` on a drag end; apply a brief wrong-state class when rejected, a resolved marker for accepted ids, and open a congratulatory `Modal` once completed. Include settings and restart behavior matching `DinosaurDietGame`.

- [ ] **Step 4: Add focused CSS to `src/styles/index.css`**

Create `.dinosaur-name-game` rules for four large photo zones, clear resolved and wrong states, a readable name card, and responsive fallback. Reuse the existing reduced-motion rule; retain `touch-action: none` on the draggable card.

- [ ] **Step 5: Run component tests to verify they pass**

Run: `npm test -- src/games/dinosaur-name/DinosaurNameGame.test.tsx --run`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/games/dinosaur-name/DinosaurNameGame.tsx src/games/dinosaur-name/DinosaurNameGame.test.tsx src/styles/index.css
git commit -m "feat: add dinosaur name matching game"
```

### Task 3: Navigation and Dinosaurios menu entry

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `src/app/DinosaurGamesMenu.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: `DinosaurNameGame` from Task 2.
- Produces: hash route `#/dinosaur-name` and `onStartDinosaurName` menu callback.

- [ ] **Step 1: Write failing route and menu tests**

Test that the Dinosaurios menu includes a button named «¿Cómo se llama el dinosaurio?» and that selecting it changes the hash and renders the new game title. Test the game Home action returns to the main menu.

- [ ] **Step 2: Run app tests to verify they fail**

Run: `npm test -- src/app/App.test.tsx --run`

Expected: FAIL because the menu button and route are absent.

- [ ] **Step 3: Wire the route and menu callback**

In `App.tsx`, add `DINOSAUR_NAME_HASH`, `openDinosaurName`, its route branch, and pass `onStartDinosaurName` to `DinosaurGamesMenu`. Add the second game card with a dinosaur photo and concise explanatory copy in `DinosaurGamesMenu.tsx`.

- [ ] **Step 4: Run app tests to verify they pass**

Run: `npm test -- src/app/App.test.tsx --run`

Expected: PASS.

- [ ] **Step 5: Run the required project verification**

Run: `npm test && npm run lint && npm run build`

Expected: all commands pass with no test failures, lint errors, or TypeScript/build errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/App.tsx src/app/DinosaurGamesMenu.tsx src/app/App.test.tsx
git commit -m "feat: expose dinosaur name game"
```
