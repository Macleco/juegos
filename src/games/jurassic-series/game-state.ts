import type { Dinosaur } from '../../data/dinosaurs'

export interface JurassicSeries {
  id: string
  pattern: readonly [Dinosaur, Dinosaur, Dinosaur, Dinosaur]
  answer: Dinosaur
}

export interface JurassicSeriesState {
  round: readonly JurassicSeries[]
  placed: readonly (string | null)[]
  completed: boolean
}

export interface PlaceDinosaurResult {
  accepted: boolean
  state: JurassicSeriesState
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

export function createRound(dinosaurs: readonly Dinosaur[]): readonly JurassicSeries[] {
  if (dinosaurs.length < 9) throw new Error('At least nine dinosaurs are required')

  return shuffle(dinosaurs).slice(0, 9).reduce<JurassicSeries[]>((series, _dinosaur, index, selected) => {
    if (index % 3 !== 0) return series
    const [first, second, third] = selected.slice(index, index + 3)
    return [...series, {
      id: `series-${series.length + 1}`,
      pattern: [first, second, third, first],
      answer: second,
    }]
  }, [])
}

export function createGameState(round: readonly JurassicSeries[]): JurassicSeriesState {
  return { round, placed: round.map(() => null), completed: false }
}

export function placeDinosaur(state: JurassicSeriesState, seriesId: string, dinosaurId: string): PlaceDinosaurResult {
  const seriesIndex = state.round.findIndex((series) => series.id === seriesId)
  const series = state.round[seriesIndex]
  if (!series || state.placed[seriesIndex] !== null || series.answer.id !== dinosaurId) return { accepted: false, state }

  const placed = state.placed.map((item, index) => index === seriesIndex ? dinosaurId : item)
  return { accepted: true, state: { ...state, placed, completed: placed.every(Boolean) } }
}
