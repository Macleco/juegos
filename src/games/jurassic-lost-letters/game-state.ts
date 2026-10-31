import type { Dinosaur } from '../../data/dinosaurs'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface LostLetterPuzzle {
  dinosaur: Dinosaur
  missingIndexes: readonly number[]
  answers: readonly string[]
  options: readonly (readonly string[])[]
}

export interface LostLettersState {
  puzzles: readonly LostLetterPuzzle[]
  currentIndex: number
  revealedCount: number
  completed: boolean
}

export interface LetterAnswerResult { accepted: boolean; state: LostLettersState }

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

function letterIndexes(name: string): number[] {
  return [...name].flatMap((character, index) => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(character) ? [index] : [])
}

function createOptions(answer: string): string[] {
  return shuffle([answer, ...shuffle(ALPHABET.filter((letter) => letter !== answer)).slice(0, 2)])
}

export function createPuzzle(dinosaur: Dinosaur, indexes: number | readonly number[]): LostLetterPuzzle {
  const missingIndexes = (typeof indexes === 'number' ? [indexes] : [...indexes]).sort((left, right) => left - right)
  const letters = letterIndexes(dinosaur.name)
  if (missingIndexes.length === 0 || new Set(missingIndexes).size !== missingIndexes.length || missingIndexes.some((index) => !letters.includes(index))) {
    throw new Error('Las letras ausentes deben pertenecer al nombre')
  }
  const answers = missingIndexes.map((index) => dinosaur.name[index].toLocaleUpperCase('es-ES'))
  return { dinosaur, missingIndexes, answers, options: answers.map(createOptions) }
}

function missingIndexesFor(name: string, difficulty: Difficulty): number[] {
  const indexes = letterIndexes(name)
  const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? Math.ceil(indexes.length / 2) : indexes.length
  return shuffle(indexes).slice(0, count).sort((left, right) => left - right)
}

export function createRound(dinosaurs: readonly Dinosaur[], difficulty: Difficulty = 'easy', count = 5): LostLetterPuzzle[] {
  const uniqueDinosaurs = dinosaurs.filter((dinosaur, index) => dinosaurs.findIndex(({ id }) => id === dinosaur.id) === index)
  if (uniqueDinosaurs.length === 0) throw new Error('Letras jurásicas necesita al menos un dinosaurio')
  return shuffle(uniqueDinosaurs).slice(0, Math.min(count, uniqueDinosaurs.length)).map((dinosaur) => createPuzzle(dinosaur, missingIndexesFor(dinosaur.name, difficulty)))
}

export function createGameState(puzzles: readonly LostLetterPuzzle[]): LostLettersState {
  return { puzzles: [...puzzles], currentIndex: 0, revealedCount: 0, completed: puzzles.length === 0 }
}

export function answerCurrentLetter(state: LostLettersState, letter: string): LetterAnswerResult {
  const current = state.puzzles[state.currentIndex]
  if (!current || state.completed || letter !== current.answers[state.revealedCount]) return { accepted: false, state }
  const revealedCount = state.revealedCount + 1
  if (revealedCount < current.answers.length) return { accepted: true, state: { ...state, revealedCount } }
  const currentIndex = state.currentIndex + 1
  return { accepted: true, state: { ...state, currentIndex, revealedCount: 0, completed: currentIndex === state.puzzles.length } }
}

export function maskedName(puzzle: LostLetterPuzzle, revealedCount = 0): string {
  return [...puzzle.dinosaur.name.toLocaleUpperCase('es-ES')].map((character, index) => {
    const missingPosition = puzzle.missingIndexes.indexOf(index)
    return missingPosition >= revealedCount ? '_' : character
  }).join('')
}
