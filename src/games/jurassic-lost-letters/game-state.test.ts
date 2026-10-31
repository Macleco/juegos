import { describe, expect, it } from 'vitest'
import { DINOSAURS } from '../../data/dinosaurs'
import { answerCurrentLetter, createGameState, createPuzzle, createRound, maskedName } from './game-state'

describe('jurassic lost letters game rules', () => {
  it('creates a puzzle with one missing letter and three distinct choices', () => {
    const puzzle = createPuzzle(DINOSAURS[0], 1)
    expect(maskedName(puzzle)).toBe('T_ICERATOPS'); expect(puzzle.answer).toBe('R'); expect(puzzle.options).toHaveLength(3); expect(new Set(puzzle.options)).toHaveLength(3); expect(puzzle.options).toContain('R')
  })
  it('uses existing dinosaur names and only hides letters', () => {
    const round = createRound(DINOSAURS)
    expect(round).toHaveLength(5)
    round.forEach((puzzle) => { expect(DINOSAURS).toContain(puzzle.dinosaur); expect(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(puzzle.dinosaur.name[puzzle.missingIndex])).toBe(true) })
  })
  it('advances only after the correct letter and completes the final puzzle', () => {
    const first = createPuzzle(DINOSAURS[0], 0); const second = createPuzzle(DINOSAURS[1], 0); const state = createGameState([first, second])
    expect(answerCurrentLetter(state, 'Z')).toEqual({ accepted: false, state })
    const afterFirst = answerCurrentLetter(state, first.answer); const afterSecond = answerCurrentLetter(afterFirst.state, second.answer)
    expect(afterFirst).toMatchObject({ accepted: true, state: { currentIndex: 1, completed: false } }); expect(afterSecond).toMatchObject({ accepted: true, state: { currentIndex: 2, completed: true } })
  })
})
