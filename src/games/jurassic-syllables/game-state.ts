import type { JurassicSyllableCard, SyllableCount } from '../../data/jurassic-syllables'

export interface JurassicSyllablesState {
  deck: readonly JurassicSyllableCard[]
  classified: Record<SyllableCount, readonly JurassicSyllableCard[]>
  completed: boolean
}

export interface ClassificationResult {
  accepted: boolean
  state: JurassicSyllablesState
}

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

export function createGameState(deck: readonly JurassicSyllableCard[]): JurassicSyllablesState {
  return { deck: [...deck], classified: { 2: [], 3: [], 4: [] }, completed: deck.length === 0 }
}

export function classifyCurrentCard(state: JurassicSyllablesState, target: SyllableCount): ClassificationResult {
  const currentCard = state.deck[0]
  if (!currentCard || currentCard.syllables !== target) return { accepted: false, state }

  const deck = state.deck.slice(1)
  return {
    accepted: true,
    state: {
      deck,
      classified: { ...state.classified, [target]: [...state.classified[target], currentCard] },
      completed: deck.length === 0,
    },
  }
}
