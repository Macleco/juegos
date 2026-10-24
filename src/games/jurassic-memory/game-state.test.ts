import { describe, expect, it, vi } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { createGameState, createRound, hideUnmatchedCards, selectCard } from './game-state'

describe('jurassic memory game rules', () => {
  it('creates six dinosaur pairs shuffled into twelve cards', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    const round = createRound(DINOSAURS)

    expect(round).toHaveLength(12)
    expect(new Set(round.map((card) => card.dinosaur.id))).toHaveLength(6)
    expect(round.reduce<Record<string, number>>((counts, card) => ({ ...counts, [card.dinosaur.id]: (counts[card.dinosaur.id] ?? 0) + 1 }), {})).toEqual(
      expect.objectContaining(Object.fromEntries([...new Set(round.map((card) => card.dinosaur.id))].map((id) => [id, 2]))),
    )
  })

  it('keeps a matching pair face up and records one pair found', () => {
    const round = createRound(DINOSAURS)
    const firstCard = round[0]
    const matchingCard = round.find((card) => card.id !== firstCard.id && card.dinosaur.id === firstCard.dinosaur.id)!
    const afterFirst = selectCard(createGameState(round), firstCard.id)
    const afterPair = selectCard(afterFirst.state, matchingCard.id)

    expect(afterPair).toMatchObject({ accepted: true, match: true, state: { matchedIds: [firstCard.id, matchingCard.id], faceUpIds: [] } })
  })

  it('turns an incorrect pair face down before another choice', () => {
    const round = createRound(DINOSAURS)
    const firstCard = round[0]
    const differentCard = round.find((card) => card.dinosaur.id !== firstCard.dinosaur.id)!
    const afterPair = selectCard(selectCard(createGameState(round), firstCard.id).state, differentCard.id)
    const afterHide = hideUnmatchedCards(afterPair.state)

    expect(afterPair).toMatchObject({ accepted: true, match: false, state: { faceUpIds: [firstCard.id, differentCard.id], moves: 1 } })
    expect(afterHide.faceUpIds).toEqual([])
  })

  it('does not allow a third card while an incorrect pair is visible', () => {
    const round = createRound(DINOSAURS)
    const firstCard = round[0]
    const differentCard = round.find((card) => card.dinosaur.id !== firstCard.dinosaur.id)!
    const thirdCard = round.find((card) => card.id !== firstCard.id && card.id !== differentCard.id)!
    const state = selectCard(selectCard(createGameState(round), firstCard.id).state, differentCard.id).state

    expect(selectCard(state, thirdCard.id)).toEqual({ accepted: false, match: null, state })
  })
})
