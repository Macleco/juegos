import type { Dinosaur } from '../../data/dinosaurs'

export interface DinosaurSizeCard {
  id: string
  size: number
  boardPosition: number
  horizontalOffset: number
  verticalOffset: number
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
  const offsets = shuffle([
    { horizontalOffset: -6, verticalOffset: -9 },
    { horizontalOffset: 6, verticalOffset: 6 },
    { horizontalOffset: -3, verticalOffset: 10 },
    { horizontalOffset: 4, verticalOffset: -11 },
    { horizontalOffset: -7, verticalOffset: 3 },
    { horizontalOffset: 7, verticalOffset: -5 },
    { horizontalOffset: 1, verticalOffset: 9 },
  ])
  const cards = shuffle(Array.from({ length: sizeCount }, (_, index) => ({
    id: `${dinosaur.id}-size-${index + 1}`,
    size: index + 1,
    boardPosition: boardPositions[index],
    ...offsets[index],
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
