import { describe, expect, it, vi } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { createGameState, createRound, placeDinosaurSize } from './game-state'

describe('dinosaur sizes game rules', () => {
  it('creates seven shuffled sizes for one dinosaur', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const round = createRound(DINOSAURS)

    expect(round.dinosaur).toBe(DINOSAURS[0])
    expect(round.sizeCount).toBe(7)
    expect(round.cards).toHaveLength(7)
    expect(round.cards.map((card) => card.size).sort()).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(new Set(round.cards.map((card) => card.id)).size).toBe(7)
    expect(new Set(round.cards.map((card) => card.boardPosition)).size).toBe(7)
  })

  it('always uses seven cards', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.75)
    expect(createRound(DINOSAURS).sizeCount).toBe(7)
  })

  it('only places each dinosaur in its matching size position', () => {
    const round = createRound(DINOSAURS)
    const state = createGameState(round)
    const smallest = round.cards.find((card) => card.size === 1)!
    const largest = round.cards.find((card) => card.size === round.sizeCount)!

    expect(placeDinosaurSize(state, 0, largest.id)).toEqual({ accepted: false, state })
    const result = placeDinosaurSize(state, 0, smallest.id)
    expect(result.accepted).toBe(true)
    expect(result.state.placed[0]).toBe(smallest.id)
  })

  it('marks the game complete once every size is ordered', () => {
    const round = createRound(DINOSAURS)
    let state = createGameState(round)
    for (let slot = 0; slot < round.sizeCount; slot += 1) {
      const card = round.cards.find((item) => item.size === slot + 1)!
      state = placeDinosaurSize(state, slot, card.id).state
    }
    expect(state.completed).toBe(true)
  })
})
