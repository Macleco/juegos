import { describe, expect, it } from 'vitest'

import { answerCurrentColor, createGameState, createRound, createRoundForCounts } from './game-state'

describe('math eggs game rules', () => {
  it('creates a mixed collection and three answer choices for every color', () => {
    const round = createRound()

    expect(round.eggs).toHaveLength(round.counts.blue + round.counts.green + round.counts.pink)
    expect(round.eggs).toHaveLength(30)
    expect(new Set(round.eggs.map((egg) => egg.color))).toEqual(new Set(['blue', 'green', 'pink']))

    ;(['blue', 'green', 'pink'] as const).forEach((color) => {
      expect(round.options[color]).toHaveLength(3)
      expect(new Set(round.options[color])).toHaveLength(3)
      expect(round.options[color]).toContain(round.counts[color])
    })
  })

  it('only moves to the next color after its exact count is selected', () => {
    const state = createGameState(createRoundForCounts({ blue: 4, green: 6, pink: 5 }))
    const wrong = answerCurrentColor(state, 3)
    const afterBlue = answerCurrentColor(state, 4)
    const afterGreen = answerCurrentColor(afterBlue.state, 6)
    const afterPink = answerCurrentColor(afterGreen.state, 5)

    expect(wrong).toEqual({ accepted: false, state })
    expect(afterBlue).toMatchObject({ accepted: true, state: { color: 'green', selected: { blue: 4, green: null, pink: null } } })
    expect(afterGreen).toMatchObject({ accepted: true, state: { color: 'pink', selected: { blue: 4, green: 6, pink: null } } })
    expect(afterPink).toMatchObject({ accepted: true, state: { completed: true, selected: { blue: 4, green: 6, pink: 5 } } })
  })
})
