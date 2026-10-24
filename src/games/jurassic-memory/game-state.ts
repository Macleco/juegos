import type { Dinosaur } from '../../data/dinosaurs'

export interface MemoryCard {
  id: string
  dinosaur: Dinosaur
}

export interface MemoryGameState {
  cards: readonly MemoryCard[]
  faceUpIds: readonly string[]
  matchedIds: readonly string[]
  moves: number
  completed: boolean
}

export interface CardSelectionResult {
  accepted: boolean
  match: boolean | null
  state: MemoryGameState
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

export function createRound(dinosaurs: readonly Dinosaur[]): MemoryCard[] {
  const uniqueDinosaurs = dinosaurs.filter((dinosaur, index) => dinosaurs.findIndex(({ id }) => id === dinosaur.id) === index)
  if (uniqueDinosaurs.length < 6) throw new Error('Memory Jurásico necesita al menos seis dinosaurios distintos')

  return shuffle(uniqueDinosaurs)
    .slice(0, 6)
    .flatMap((dinosaur) => [1, 2].map((copy) => ({ id: `${dinosaur.id}-${copy}`, dinosaur })))
    .sort(() => Math.random() - 0.5)
}

export function createGameState(cards: readonly MemoryCard[]): MemoryGameState {
  return { cards: [...cards], faceUpIds: [], matchedIds: [], moves: 0, completed: cards.length === 0 }
}

export function selectCard(state: MemoryGameState, cardId: string): CardSelectionResult {
  const card = state.cards.find(({ id }) => id === cardId)
  if (!card || state.completed || state.faceUpIds.length === 2 || state.faceUpIds.includes(cardId) || state.matchedIds.includes(cardId)) {
    return { accepted: false, match: null, state }
  }

  const faceUpIds = [...state.faceUpIds, cardId]
  if (faceUpIds.length === 1) return { accepted: true, match: null, state: { ...state, faceUpIds } }

  const firstCard = state.cards.find(({ id }) => id === faceUpIds[0])!
  const match = firstCard.dinosaur.id === card.dinosaur.id
  const matchedIds = match ? [...state.matchedIds, ...faceUpIds] : state.matchedIds
  return {
    accepted: true,
    match,
    state: {
      ...state,
      faceUpIds: match ? [] : faceUpIds,
      matchedIds,
      moves: state.moves + 1,
      completed: matchedIds.length === state.cards.length,
    },
  }
}

export function hideUnmatchedCards(state: MemoryGameState): MemoryGameState {
  if (state.faceUpIds.length !== 2) return state
  return { ...state, faceUpIds: [] }
}
