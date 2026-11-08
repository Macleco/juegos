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
    if (!Number.isInteger(counts[color]) || counts[color] < 1 || counts[color] > 22) {
      throw new Error('Each egg color must have between one and twenty-two eggs')
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
  const balancedCounts: Array<Record<EggColor, number>> = []
  for (let blue = 5; blue <= 11; blue += 1) {
    for (let green = 5; green <= 11; green += 1) {
      const pink = 24 - blue - green
      if (pink >= 5 && pink <= 11) balancedCounts.push({ blue, green, pink })
    }
  }
  const counts = balancedCounts[Math.floor(Math.random() * balancedCounts.length)]

  return createRoundForCounts(counts)
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
