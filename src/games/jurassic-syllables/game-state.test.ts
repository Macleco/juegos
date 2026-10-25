import { describe, expect, it } from 'vitest'

import { JURASSIC_SYLLABLE_CARDS } from '../../data/jurassic-syllables'
import { classifyCurrentCard, createGameState } from './game-state'

describe('jurassic syllables game rules', () => {
  it('contains twelve cards balanced across the three syllable groups', () => {
    expect(JURASSIC_SYLLABLE_CARDS).toHaveLength(12)
    expect(JURASSIC_SYLLABLE_CARDS.filter(({ syllables }) => syllables === 2)).toHaveLength(4)
    expect(JURASSIC_SYLLABLE_CARDS.filter(({ syllables }) => syllables === 3)).toHaveLength(4)
    expect(JURASSIC_SYLLABLE_CARDS.filter(({ syllables }) => syllables === 4)).toHaveLength(4)
  })

  it('moves the current image card into its matching syllable group', () => {
    const card = JURASSIC_SYLLABLE_CARDS[0]
    const result = classifyCurrentCard(createGameState([card]), card.syllables)

    expect(result.accepted).toBe(true)
    expect(result.state.deck).toEqual([])
    expect(result.state.classified[card.syllables]).toEqual([card])
    expect(result.state.completed).toBe(true)
  })

  it('keeps the card in the deck after an incorrect classification', () => {
    const card = JURASSIC_SYLLABLE_CARDS[0]
    const state = createGameState([card])
    const incorrectGroup = card.syllables === 2 ? 3 : 2
    const result = classifyCurrentCard(state, incorrectGroup)

    expect(result.accepted).toBe(false)
    expect(result.state).toBe(state)
  })
})
