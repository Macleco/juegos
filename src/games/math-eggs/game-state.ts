export const EGG_COLORS = ['blue', 'green', 'pink'] as const

export type EggColor = typeof EGG_COLORS[number]

export interface Egg {
  id: string
  color: EggColor
}

export interface MathEggsRound {
  eggs: readonly Egg[]
  counts: Record<EggColor, number>
  options: Record<EggColor, readonly number[]>
}

export interface MathEggsState {
  round: MathEggsRound
  color: EggColor
  selected: Record<EggColor, number | null>
  completed: boolean
}

export interface AnswerResult {
  accepted: boolean
  state: MathEggsState
}

function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

function createOptions(answer: number): number[] {
  const candidates = [answer, answer - 1, answer + 1, answer - 2, answer + 2].filter((value) => value >= 1)
  return shuffle(candidates.slice(0, 3))
}

export function createRoundForCounts(counts: Record<EggColor, number>): MathEggsRound {
  EGG_COLORS.forEach((color) => {
    if (!Number.isInteger(counts[color]) || counts[color] < 3 || counts[color] > 12) {
      throw new Error('Each egg color must have between three and twelve eggs')
    }
  })

  const eggs = shuffle(EGG_COLORS.flatMap((color) => Array.from(
    { length: counts[color] },
    (_, index) => ({ id: `${color}-${index + 1}`, color }),
  )))

  return {
    eggs,
    counts: { ...counts },
    options: {
      blue: createOptions(counts.blue),
      green: createOptions(counts.green),
      pink: createOptions(counts.pink),
    },
  }
}

export function createRound(): MathEggsRound {
  let blue = 10
  let green = 10
  let pink = 10

  do {
    blue = Math.floor(Math.random() * 5) + 8
    green = Math.floor(Math.random() * 5) + 8
    pink = 30 - blue - green
  } while (pink < 8 || pink > 12)

  return createRoundForCounts({ blue, green, pink })
}

export function createGameState(round: MathEggsRound): MathEggsState {
  return {
    round,
    color: 'blue',
    selected: { blue: null, green: null, pink: null },
    completed: false,
  }
}

export function answerCurrentColor(state: MathEggsState, value: number): AnswerResult {
  if (state.completed || value !== state.round.counts[state.color]) return { accepted: false, state }

  const selected = { ...state.selected, [state.color]: value }
  const colorIndex = EGG_COLORS.indexOf(state.color)
  const completed = colorIndex === EGG_COLORS.length - 1

  return {
    accepted: true,
    state: {
      ...state,
      selected,
      color: completed ? state.color : EGG_COLORS[colorIndex + 1],
      completed,
    },
  }
}
