import type { Dinosaur } from '../../data/dinosaurs'

export interface GameState {
  round: readonly Dinosaur[]
  pending: readonly Dinosaur[]
  resolvedIds: readonly string[]
  completed: boolean
}

export interface MatchResult {
  accepted: boolean
  state: GameState
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

export function selectRound(dinosaurs: readonly Dinosaur[]): Dinosaur[] {
  const seenIds = new Set<string>()
  const uniqueDinosaurs = dinosaurs.filter((dinosaur) => {
    if (seenIds.has(dinosaur.id)) return false
    seenIds.add(dinosaur.id)
    return true
  })

  return shuffle(uniqueDinosaurs).slice(0, 4)
}

export function createGameState(round: readonly Dinosaur[]): GameState {
  const pending = shuffle(round)
  if (pending.length > 1 && pending.every((dinosaur, index) => dinosaur.id === round[index].id)) {
    pending.push(pending.shift()!)
  }

  return {
    round: [...round],
    pending,
    resolvedIds: [],
    completed: round.length === 0,
  }
}

export function matchCurrentName(state: GameState, dinosaurId: string): MatchResult {
  const current = state.pending[0]
  if (!current || current.id !== dinosaurId) return { accepted: false, state }

  const pending = state.pending.slice(1)
  return {
    accepted: true,
    state: {
      ...state,
      pending,
      resolvedIds: [...state.resolvedIds, dinosaurId],
      completed: pending.length === 0,
    },
  }
}
