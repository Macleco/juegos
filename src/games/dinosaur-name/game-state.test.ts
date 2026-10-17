import { afterEach, describe, expect, it, vi } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { createGameState, matchCurrentName, selectRound } from './game-state'

describe('dinosaur name game rules', () => {
  afterEach(() => vi.restoreAllMocks())

  it('selects four distinct dinosaurs without mutating the source collection', () => {
    const source = [...DINOSAURS]

    const round = selectRound(source)

    expect(round).toHaveLength(4)
    expect(new Set(round.map(({ id }) => id))).toHaveLength(4)
    expect(source).toEqual(DINOSAURS)
  })

  it('uses every available dinosaur when fewer than four are provided', () => {
    const round = selectRound(DINOSAURS.slice(0, 3))

    expect(round.map(({ id }) => id)).toEqual(expect.arrayContaining(['triceratops', 'diplodocus', 'pachycephalosaurus']))
    expect(round).toHaveLength(3)
  })

  it('shuffles the pending names independently from the photo order', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const round = DINOSAURS.slice(0, 4)

    const state = createGameState(round)

    expect(state.pending.map(({ id }) => id)).toEqual(expect.arrayContaining(round.map(({ id }) => id)))
    expect(state.pending.map(({ id }) => id)).not.toEqual(round.map(({ id }) => id))
  })

  it('advances the pending name and marks its photograph resolved after a correct match', () => {
    const state = createGameState(DINOSAURS.slice(0, 2))
    const current = state.pending[0]

    const result = matchCurrentName(state, current.id)

    expect(result.accepted).toBe(true)
    expect(result.state.pending).toHaveLength(1)
    expect(result.state.pending[0].id).not.toBe(current.id)
    expect(result.state.resolvedIds).toEqual([current.id])
    expect(result.state.completed).toBe(false)
  })

  it('keeps the exact state after an incorrect match', () => {
    const state = createGameState(DINOSAURS.slice(0, 2))
    const wrongId = state.round.find(({ id }) => id !== state.pending[0].id)!.id

    const result = matchCurrentName(state, wrongId)

    expect(result).toEqual({ accepted: false, state })
    expect(result.state).toBe(state)
  })

  it('completes after resolving the fourth dinosaur and ignores further drops', () => {
    const round = DINOSAURS.slice(0, 4)
    let state = createGameState(round)

    while (state.pending[0]) state = matchCurrentName(state, state.pending[0].id).state
    const afterCompletion = matchCurrentName(state, round[0].id)

    expect(state).toMatchObject({ pending: [], completed: true })
    expect(state.resolvedIds).toEqual(expect.arrayContaining(round.map(({ id }) => id)))
    expect(afterCompletion).toEqual({ accepted: false, state })
    expect(afterCompletion.state).toBe(state)
  })
})
