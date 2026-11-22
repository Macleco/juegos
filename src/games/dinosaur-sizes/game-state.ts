import type { Dinosaur } from '../../data/dinosaurs'

export interface DinosaurSizeCard {
  id: string
  size: number
  boardPosition: number
}

export interface DinosaurSizesRound {
  dinosaur: Dinosaur
  cards: readonly DinosaurSizeCard[]
  sizeCount: number
}

export interface DinosaurSizesState {
  round: DinosaurSizesRound
  placed: readonly (string | null)[]
  completed: boolean
}

export interface PlaceDinosaurSizeResult {
  accepted: boolean
  state: DinosaurSizesState
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

export function createRound(dinosaurs: readonly Dinosaur[]): DinosaurSizesRound {
  if (dinosaurs.length === 0) throw new Error('At least one dinosaur is required')

  const dinosaur = dinosaurs[Math.floor(Math.random() * dinosaurs.length)]
  const sizeCount = 7
  const boardPositions = shuffle(Array.from({ length: sizeCount }, (_, index) => index))
  const cards = shuffle(Array.from({ length: sizeCount }, (_, index) => ({
    id: `${dinosaur.id}-size-${index + 1}`,
    size: index + 1,
    boardPosition: boardPositions[index],
  })))

  return { dinosaur, cards, sizeCount }
}

export function createGameState(round: DinosaurSizesRound): DinosaurSizesState {
  return {
    round,
    placed: Array.from({ length: round.sizeCount }, () => null),
    completed: false,
  }
}

export function placeDinosaurSize(state: DinosaurSizesState, slot: number, cardId: string): PlaceDinosaurSizeResult {
  const card = state.round.cards.find((item) => item.id === cardId)
  if (!card || slot < 0 || slot >= state.round.sizeCount || state.placed[slot] !== null || card.size !== slot + 1 || state.placed.includes(cardId)) {
    return { accepted: false, state }
  }

  const placed = state.placed.map((item, index) => index === slot ? cardId : item)
  return {
    accepted: true,
    state: {
      ...state,
      placed,
      completed: placed.every(Boolean),
    },
  }
}
