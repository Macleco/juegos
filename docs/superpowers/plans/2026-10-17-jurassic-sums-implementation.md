# Sumas Jurásicas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir un juego de conteo y suma de dinosaurios con dos sumandos de uno a nueve y tres respuestas secuenciales.

**Architecture:** El juego vivirá de forma aislada en `src/games/jurassic-sums/`. `game-state.ts` generará y transicionará una ronda inmutable; `JurassicSumsGame.tsx` representará los grupos, ecuación y opciones. La app solo añadirá una ruta hash y un acceso en el menú de Dinosaurios.

**Tech Stack:** React 19, TypeScript estricto, Vite, Vitest, React Testing Library y CSS global existente.

**Spec:** `docs/superpowers/specs/2026-10-17-jurassic-sums-design.md`

## Global Constraints

- Cada grupo debe tener de uno a nueve dinosaurios; la suma queda entre dos y dieciocho.
- Cada paso ofrece cuatro valores numéricos distintos: la respuesta correcta y tres distractores válidos.
- Los pasos se responden en este orden: primer grupo, segundo grupo y suma total.
- Usar únicamente las imágenes de `src/data/dinosaurs.ts`; no añadir recursos gráficos, audio ni persistencia.
- Mantener la lógica de `game-state.ts` pura e inmutable.
- Priorizar 1920×1080 sin scroll vertical, controles táctiles grandes, contraste, HTML semántico y `prefers-reduced-motion`.
- Antes de finalizar, ejecutar `npm test`, `npm run lint` y `npm run build`.

## Review Focus

- Una fuente con menos de nueve dinosaurios: la selección debe seguir siendo válida sin repetir recursos en el mismo grupo si hay suficientes elementos; se cubre en la Tarea 1.
- Valores extremos `1 + 1` y `9 + 9`: opciones distintas deben conservar la respuesta correcta dentro de `2..18`; se cubre en la Tarea 1.
- Una opción incorrecta o una pulsación posterior a completar: no deben mutar el estado; se cubre en la Tarea 1.
- Los dos resultados confirmados deben permanecer visibles antes de pedir el total; se cubre en la Tarea 2.
- Reiniciar durante la partida debe restaurar un paso inicial y ocultar la celebración; se cubre en la Tarea 2.

### Task 1: Reglas puras de una suma jurásica

**Files:**
- Create: `src/games/jurassic-sums/game-state.ts`
- Create: `src/games/jurassic-sums/game-state.test.ts`

**Interfaces:**
- Consumes: `Dinosaur` de `src/data/dinosaurs.ts`.
- Produces: `JurassicSumsState`, `SumStep`, `createRound(dinosaurs)`, `createGameState(round)` y `answerCurrentStep(state, value)` para la pantalla.

- [ ] **Step 1: Write the failing tests for round generation and options**

```ts
it('creates two groups from one to nine dinosaurs and three distinct option sets', () => {
  const round = createRound(DINOSAURS)

  expect(round.leftGroup).toHaveLength(expect.any(Number))
  expect(round.leftGroup.length).toBeGreaterThanOrEqual(1)
  expect(round.leftGroup.length).toBeLessThanOrEqual(9)
  expect(round.rightGroup.length).toBeGreaterThanOrEqual(1)
  expect(round.rightGroup.length).toBeLessThanOrEqual(9)
  expect(round.answers).toEqual([round.leftGroup.length, round.rightGroup.length, round.total])
  round.options.forEach((options, index) => {
    expect(options).toHaveLength(4)
    expect(new Set(options)).toHaveLength(4)
    expect(options).toContain(round.answers[index])
    expect(options.every((value) => value >= 1 && value <= 18)).toBe(true)
  })
})

it.each([[1, 1], [9, 9]])('keeps valid distinct options for %i + %i', (left, right) => {
  const round = createRoundForCounts(DINOSAURS, left, right)
  expect(round.options[2]).toContain(left + right)
  expect(new Set(round.options[2])).toHaveLength(4)
})
```

- [ ] **Step 2: Run the rule tests to verify they fail**

Run: `npm test -- src/games/jurassic-sums/game-state.test.ts`

Expected: FAIL because the module and its exported functions do not exist.

- [ ] **Step 3: Implement round types and `createRound(dinosaurs: readonly Dinosaur[]): JurassicSumsRound`**

Define `SumStep` as `'left' | 'right' | 'total'`. The round must expose `leftGroup`, `rightGroup`, `answers` in step order, and `options` in the same order. Add an exported deterministic `createRoundForCounts(dinosaurs, leftCount, rightCount)` used by tests; select images cyclically only when the provided source has fewer elements than requested. Generate distractors inside `1..18`, exclude the correct value and shuffle the completed option list.

- [ ] **Step 4: Run the rule tests to verify they pass**

Run: `npm test -- src/games/jurassic-sums/game-state.test.ts`

Expected: PASS.

- [ ] **Step 5: Write the failing tests for immutable answer transitions**

```ts
it('records correct answers in order and completes after the total', () => {
  const state = createGameState(createRoundForCounts(DINOSAURS, 2, 3))
  const afterLeft = answerCurrentStep(state, 2)
  const afterRight = answerCurrentStep(afterLeft.state, 3)
  const afterTotal = answerCurrentStep(afterRight.state, 5)

  expect(afterLeft).toMatchObject({ accepted: true, state: { step: 'right', selected: [2, null, null] } })
  expect(afterRight).toMatchObject({ accepted: true, state: { step: 'total', selected: [2, 3, null] } })
  expect(afterTotal).toMatchObject({ accepted: true, state: { completed: true, selected: [2, 3, 5] } })
})

it('returns the original state for an incorrect value or an answer after completion', () => {
  const state = createGameState(createRoundForCounts(DINOSAURS, 2, 3))
  expect(answerCurrentStep(state, 4)).toEqual({ accepted: false, state })
})
```

- [ ] **Step 6: Run the transition tests to verify they fail**

Run: `npm test -- src/games/jurassic-sums/game-state.test.ts`

Expected: FAIL because `createGameState` and `answerCurrentStep` do not exist.

- [ ] **Step 7: Implement `createGameState(round: JurassicSumsRound): JurassicSumsState` and `answerCurrentStep(state: JurassicSumsState, value: number): AnswerResult`**

Use a three-position `selected: readonly (number | null)[]`. Correct answers return a new state and advance `step`; the total marks `completed: true`. Wrong or post-completion answers return `{ accepted: false, state }` with the same state reference.

- [ ] **Step 8: Run the rule suite to verify it passes**

Run: `npm test -- src/games/jurassic-sums/game-state.test.ts`

Expected: PASS.

- [ ] **Step 9: Commit the rules**

```bash
git add src/games/jurassic-sums/game-state.ts src/games/jurassic-sums/game-state.test.ts
git commit -m "feat: añadir reglas de sumas jurásicas"
```

### Task 2: Pantalla del juego y retroalimentación

**Files:**
- Create: `src/games/jurassic-sums/JurassicSumsGame.tsx`
- Create: `src/games/jurassic-sums/JurassicSumsGame.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: `DINOSAURS`, `GameHeader`, `Modal`, y las exportaciones de `./game-state`.
- Produces: `JurassicSumsGame({ onHome?: () => void })`, listo para montar desde `App.tsx`.

- [ ] **Step 1: Write the failing component tests for the sequence and error feedback**

```tsx
it('keeps confirmed counts in the equation and then asks for the total', () => {
  render(<JurassicSumsGame createRound={() => createRoundForCounts(DINOSAURS, 2, 3)} />)
  fireEvent.click(screen.getByRole('button', { name: '2' }))
  fireEvent.click(screen.getByRole('button', { name: '3' }))

  expect(screen.getByText('2 + 3 = ?')).toBeInTheDocument()
  expect(screen.getByText(/¿cuánto suman/i)).toBeInTheDocument()
})

it('keeps the active step after an incorrect option', () => {
  render(<JurassicSumsGame createRound={() => createRoundForCounts(DINOSAURS, 2, 3)} />)
  const options = screen.getByRole('group', { name: /respuestas/i })
  const wrongOption = within(options).getAllByRole('button').find((button) => button.textContent !== '2')!
  fireEvent.click(wrongOption)
  expect(screen.getByText(/¿cuántos hay en el primer grupo/i)).toBeInTheDocument()
  expect(wrongOption).toHaveClass('wrong')
})
```

- [ ] **Step 2: Run the component tests to verify they fail**

Run: `npm test -- src/games/jurassic-sums/JurassicSumsGame.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement `JurassicSumsGame` with an injectable `createRound` test seam**

Use `GameHeader`, settings modal and final modal consistently with the existing dinosaur games. Render semantic labelled group sections, an `aria-live` instruction, a visible equation whose unresolved positions use `?`, and a four-button option group sourced from the active step. Invoke `answerCurrentStep` on click; only accepted answers advance, while rejected answers add a temporary `wrong` class. `restart` must recreate state, clear feedback and close modals.

- [ ] **Step 4: Add styles for the desktop-first sum board**

Create a `jurassic-sums-game` layout that fits the header, two clearly separated dinosaur groups, equation and four large number buttons inside a 1920×1080 viewport without vertical scroll. Reuse palette and visual language of the dinosaur games, add focus-visible styles, and add responsive rules for narrow screens. Reuse the existing reduced-motion media query for error feedback.

- [ ] **Step 5: Run the component tests to verify they pass**

Run: `npm test -- src/games/jurassic-sums/JurassicSumsGame.test.tsx`

Expected: PASS.

- [ ] **Step 6: Write and run the failing restart test, then implement only what it requires**

```tsx
it('restarts from the first counting step and closes the celebration', () => {
  render(<JurassicSumsGame createRound={() => createRoundForCounts(DINOSAURS, 2, 3)} />)
  ;[2, 3, 5].forEach((value) => fireEvent.click(screen.getByRole('button', { name: String(value) })))
  fireEvent.click(screen.getByRole('button', { name: /jugar otra vez/i }))
  expect(screen.getByText(/¿cuántos hay en el primer grupo/i)).toBeInTheDocument()
  expect(screen.queryByText(/¡muy bien!/i)).not.toBeInTheDocument()
})
```

Run: `npm test -- src/games/jurassic-sums/JurassicSumsGame.test.tsx`

Expected before implementation: FAIL; after the minimal restart update: PASS.

- [ ] **Step 7: Commit the game screen**

```bash
git add src/games/jurassic-sums/JurassicSumsGame.tsx src/games/jurassic-sums/JurassicSumsGame.test.tsx src/styles/index.css
git commit -m "feat: añadir pantalla de sumas jurásicas"
```

### Task 3: Navegación y acceso en Dinosaurios

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/app/DinosaurGamesMenu.tsx`

**Interfaces:**
- Consumes: `JurassicSumsGame` y su prop `onHome`.
- Produces: ruta `#/jurassic-sums` y la tarjeta «Sumas jurásicas» en el menú Dinosaurios.

- [ ] **Step 1: Write the failing app-navigation test**

```tsx
it('opens Jurassic Sums from the dinosaur menu and returns home', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /dinosaurios/i }))
  fireEvent.click(screen.getByRole('button', { name: /sumas jurásicas/i }))

  expect(screen.getByRole('heading', { name: /sumas jurásicas/i })).toBeInTheDocument()
  expect(window.location.hash).toBe('#/jurassic-sums')
})
```

- [ ] **Step 2: Run the app test to verify it fails**

Run: `npm test -- src/app/App.test.tsx`

Expected: FAIL because the menu card and route do not exist.

- [ ] **Step 3: Add the route and menu card**

In `App.tsx`, define `DINOSAUR_SUMS_HASH = '#/jurassic-sums'`, render `JurassicSumsGame` for it, and pass a route setter to `DinosaurGamesMenu`. Extend that menu's props and add a third dinosaur game card labelled exactly «Sumas jurásicas», with a concise counting-and-addition description and an existing dinosaur image.

- [ ] **Step 4: Run the app test to verify it passes**

Run: `npm test -- src/app/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit navigation**

```bash
git add src/app/App.tsx src/app/App.test.tsx src/app/DinosaurGamesMenu.tsx
git commit -m "feat: enlazar sumas jurásicas desde el menú"
```

### Task 4: Integración y verificación final

**Files:**
- Modify: files from Tasks 1–3 only if verification reveals a defect.

**Interfaces:**
- Consumes: juego, navegación, estilos y pruebas de las tareas anteriores.
- Produces: integración comprobada para entrega.

- [ ] **Step 1: Run the full test suite**

Run: `npm test -- --run`

Expected: PASS with no failed tests.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code 0 with no lint errors.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 4: Commit any verification-only corrections**

```bash
git add <only-files-corrected-during-verification>
git commit -m "fix: corregir integración de sumas jurásicas"
```

Skip this step when verification needs no corrections.
