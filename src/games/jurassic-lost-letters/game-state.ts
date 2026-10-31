import type { Dinosaur } from '../../data/dinosaurs'

export interface LostLetterPuzzle {
  dinosaur: Dinosaur
  missingIndex: number
  answer: string
  options: readonly string[]
}

export interface LostLettersState {
  puzzles: readonly LostLetterPuzzle[]
  currentIndex: number
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

export function createPuzzle(dinosaur: Dinosaur, missingIndex: number): LostLetterPuzzle {
  const letters = letterIndexes(dinosaur.name)
  if (!letters.includes(missingIndex)) throw new Error('La letra ausente debe ser una letra del nombre')
  const answer = dinosaur.name[missingIndex].toLocaleUpperCase('es-ES')
  return { dinosaur, missingIndex, answer, options: createOptions(answer) }
}

export function createRound(dinosaurs: readonly Dinosaur[], count = 5): LostLetterPuzzle[] {
  const uniqueDinosaurs = dinosaurs.filter((dinosaur, index) => dinosaurs.findIndex(({ id }) => id === dinosaur.id) === index)
  if (uniqueDinosaurs.length === 0) throw new Error('Letras perdidas del Jurásico necesita al menos un dinosaurio')
  return shuffle(uniqueDinosaurs).slice(0, Math.min(count, uniqueDinosaurs.length)).map((dinosaur) => {
    const indexes = letterIndexes(dinosaur.name)
    return createPuzzle(dinosaur, indexes[Math.floor(Math.random() * indexes.length)])
  })
}

export function createGameState(puzzles: readonly LostLetterPuzzle[]): LostLettersState {
  return { puzzles: [...puzzles], currentIndex: 0, completed: puzzles.length === 0 }
}

export function answerCurrentLetter(state: LostLettersState, letter: string): LetterAnswerResult {
  const current = state.puzzles[state.currentIndex]
  if (!current || state.completed || letter !== current.answer) return { accepted: false, state }
  const currentIndex = state.currentIndex + 1
  return { accepted: true, state: { ...state, currentIndex, completed: currentIndex === state.puzzles.length } }
}

export function maskedName(puzzle: LostLetterPuzzle): string {
  return [...puzzle.dinosaur.name.toLocaleUpperCase('es-ES')].map((character, index) => index === puzzle.missingIndex ? '_' : character).join('')
}
