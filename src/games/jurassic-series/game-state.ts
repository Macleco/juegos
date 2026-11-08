import type { Dinosaur } from '../../data/dinosaurs'

export interface JurassicSeries {
  id: string
  patternType: string
  pattern: readonly [Dinosaur, Dinosaur, Dinosaur, Dinosaur]
  answer: Dinosaur
}

export interface JurassicSeriesState {
  round: readonly JurassicSeries[]
  placed: readonly (string | null)[]
  answerOrder: readonly string[]
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

interface SeriesTemplate {
  id: string
  visiblePositions: readonly [number, number, number, number]
  answerPosition: number
}

const SERIES_TEMPLATES: readonly SeriesTemplate[] = [
  { id: 'alternating', visiblePositions: [0, 1, 0, 1], answerPosition: 0 },
  { id: 'pairs', visiblePositions: [0, 0, 1, 1], answerPosition: 0 },
  { id: 'palindrome', visiblePositions: [0, 1, 2, 1], answerPosition: 0 },
  { id: 'sandwich', visiblePositions: [0, 1, 1, 0], answerPosition: 1 },
  { id: 'triple', visiblePositions: [0, 0, 0, 1], answerPosition: 0 },
]

export function createRound(dinosaurs: readonly Dinosaur[]): readonly JurassicSeries[] {
  if (dinosaurs.length < 9) throw new Error('At least nine dinosaurs are required')

  const selectedDinosaurs = shuffle(dinosaurs).slice(0, 9)
  const templates = shuffle(SERIES_TEMPLATES).slice(0, 3)

  return templates.map((template, index) => {
    const dinosaursForSeries = selectedDinosaurs.slice(index * 3, index * 3 + 3)
    const pattern = template.visiblePositions.map((position) => dinosaursForSeries[position]) as [Dinosaur, Dinosaur, Dinosaur, Dinosaur]
    return {
      id: `series-${index + 1}`,
      patternType: template.id,
      pattern,
      answer: dinosaursForSeries[template.answerPosition],
    }
  })
}

export function createGameState(round: readonly JurassicSeries[]): JurassicSeriesState {
  return {
    round,
    placed: round.map(() => null),
    answerOrder: shuffle(round.map((series) => series.answer.id)),
    completed: false,
  }
}

export function placeDinosaur(state: JurassicSeriesState, seriesId: string, dinosaurId: string): PlaceDinosaurResult {
  const seriesIndex = state.round.findIndex((series) => series.id === seriesId)
  const series = state.round[seriesIndex]
  if (!series || state.placed[seriesIndex] !== null || series.answer.id !== dinosaurId) return { accepted: false, state }

  const placed = state.placed.map((item, index) => index === seriesIndex ? dinosaurId : item)
  return {
    accepted: true,
    state: {
      ...state,
      placed,
      answerOrder: state.answerOrder.filter((id) => id !== dinosaurId),
      completed: placed.every(Boolean),
    },
  }
}
