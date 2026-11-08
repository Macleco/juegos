import { describe, expect, it, vi } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { createGameState, createRound, placeDinosaur } from './game-state'

describe('jurassic series game rules', () => {
  it('creates three different series patterns, with repetitions when appropriate', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    const round = createRound(DINOSAURS)

    expect(round).toHaveLength(3)
    expect(new Set(round.map((series) => series.patternType)).size).toBe(3)
    round.forEach((series) => {
      expect(series.pattern).toHaveLength(4)
      expect(new Set(series.pattern.map((dinosaur) => dinosaur.id)).size).toBeLessThan(4)
      expect(series.pattern).toContainEqual(series.answer)
    })
  })

  it('fills a series only with its next dinosaur', () => {
    const round = createRound(DINOSAURS)
    const state = createGameState(round)
    const accepted = placeDinosaur(state, round[0].id, round[0].answer.id)

    expect(accepted).toMatchObject({ accepted: true, state: { placed: [round[0].answer.id, null, null], completed: false } })
  })

  it('shuffles the available answers independently from the series order', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const round = createRound(DINOSAURS)
    const state = createGameState(round)

    expect(state.answerOrder).toEqual([...round.map((series) => series.answer.id).slice(1), round[0].answer.id])
    expect(new Set(state.answerOrder)).toEqual(new Set(round.map((series) => series.answer.id)))
  })

  it('keeps the state unchanged after an incorrect dinosaur', () => {
    const round = createRound(DINOSAURS)
    const state = createGameState(round)
    const wrongDinosaur = round[1].answer

    expect(placeDinosaur(state, round[0].id, wrongDinosaur.id)).toEqual({ accepted: false, state })
  })
})
