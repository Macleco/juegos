import { describe, expect, it } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { answerCurrentStep, createGameState, createRound, createRoundForCounts } from './game-state'

describe('jurassic sums game rules', () => {
  it('creates two groups from one to nine dinosaurs and three distinct option sets', () => {
    const round = createRound(DINOSAURS)

    expect(round.leftGroup.length).toBeGreaterThanOrEqual(1)
    expect(round.leftGroup.length).toBeLessThanOrEqual(9)
    expect(round.rightGroup.length).toBeGreaterThanOrEqual(1)
    expect(round.rightGroup.length).toBeLessThanOrEqual(9)
    expect(round.answers).toEqual([round.leftGroup.length, round.rightGroup.length, round.total])

    round.options.forEach((options, index) => {
      expect(options).toHaveLength(4)
      expect(new Set(options)).toHaveLength(4)
      expect(options).toContain(round.answers[index])
      expect(options.every((value) => value >= 1 && value <= (index === 2 ? 18 : 9))).toBe(true)
    })
  })

  it.each([[1, 1], [9, 9]])('keeps valid distinct options for %i + %i', (left, right) => {
    const round = createRoundForCounts(DINOSAURS, left, right)

    expect(round.options[2]).toContain(left + right)
    expect(new Set(round.options[2])).toHaveLength(4)
    expect(round.options[2].every((value) => value >= 2 && value <= 18)).toBe(true)
  })

  it('uses nearby distractors so a large total cannot be identified by magnitude alone', () => {
    const round = createRoundForCounts(DINOSAURS, 9, 9)

    expect(round.options[2]).toEqual(expect.arrayContaining([15, 16, 17, 18]))
  })

  it('cycles only when the source contains fewer dinosaurs than a requested group', () => {
    const round = createRoundForCounts(DINOSAURS.slice(0, 3), 4, 2)

    expect(round.leftGroup).toHaveLength(4)
    expect(round.rightGroup).toHaveLength(2)
    expect(new Set(round.rightGroup.map(({ id }) => id))).toHaveLength(2)
  })

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
    const wrong = answerCurrentStep(state, 4)
    const complete = [2, 3, 5].reduce((currentState, value) => answerCurrentStep(currentState, value).state, state)
    const afterCompletion = answerCurrentStep(complete, 5)

    expect(wrong).toEqual({ accepted: false, state })
    expect(wrong.state).toBe(state)
    expect(afterCompletion).toEqual({ accepted: false, state: complete })
    expect(afterCompletion.state).toBe(complete)
  })
})
