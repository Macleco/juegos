import { describe, expect, it } from 'vitest'
import { DINOSAURS } from '../../data/dinosaurs'
import { answerCurrentLetter, createGameState, createPuzzle, createRound, maskedName } from './game-state'

describe('jurassic lost letters game rules', () => {
  it('creates an easy puzzle with one missing letter and three distinct choices', () => {
    const puzzle = createPuzzle(DINOSAURS[0], 1)
    expect(maskedName(puzzle)).toBe('T_ICERATOPS'); expect(puzzle.answers).toEqual(['R']); expect(puzzle.options[0]).toHaveLength(3); expect(new Set(puzzle.options[0])).toHaveLength(3); expect(puzzle.options[0]).toContain('R')
  })
  it('hides half the letters on medium and 80% on hard', () => {
    const mediumRound = createRound(DINOSAURS, 'medium')
    mediumRound.forEach((puzzle) => {
      const letterCount = [...puzzle.dinosaur.name].filter((letter) => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(letter)).length
      expect(puzzle.missingIndexes).toHaveLength(Math.ceil(letterCount / 2))
    })
    createRound(DINOSAURS, 'hard').forEach((puzzle) => {
      const letterCount = [...puzzle.dinosaur.name].filter((letter) => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(letter)).length
      expect(puzzle.missingIndexes).toHaveLength(Math.ceil(letterCount * 0.8))
    })
  })
  it('reveals missing letters one at a time before advancing to the next word', () => {
    const first = createPuzzle(DINOSAURS[0], [0, 1]); const second = createPuzzle(DINOSAURS[1], 0); const state = createGameState([first, second])
    expect(answerCurrentLetter(state, 'Z')).toEqual({ accepted: false, state })
    const afterFirstLetter = answerCurrentLetter(state, first.answers[0]); const afterWord = answerCurrentLetter(afterFirstLetter.state, first.answers[1]); const afterRound = answerCurrentLetter(afterWord.state, second.answers[0])
    expect(afterFirstLetter).toMatchObject({ accepted: true, state: { currentIndex: 0, revealedCount: 1, completed: false } }); expect(afterWord).toMatchObject({ accepted: true, state: { currentIndex: 1, revealedCount: 0, completed: false } }); expect(afterRound).toMatchObject({ accepted: true, state: { completed: true } })
  })
})
