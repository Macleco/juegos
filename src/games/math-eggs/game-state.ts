export const EGG_COLORS = ['blue', 'green', 'pink', 'purple', 'yellow', 'orange'] as const
const DEFAULT_GAME_COLORS = ['blue', 'green', 'pink'] as const

export type EggColor = typeof EGG_COLORS[number]

export interface Egg {
  id: string
  color: EggColor
}

export interface MathEggsRound {
  colors: readonly EggColor[]
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

export function createRoundForCounts(counts: Partial<Record<EggColor, number>>, colors: readonly EggColor[] = DEFAULT_GAME_COLORS): MathEggsRound {
  if (colors.length !== 3 || new Set(colors).size !== 3) throw new Error('A round requires three different egg colors')

  colors.forEach((color) => {
    const count = counts[color]
    if (!Number.isInteger(count) || count === undefined || count < 1 || count > 22) {
      throw new Error('Each egg color must have between one and twenty-two eggs')
    }
  })

  const allCounts = Object.fromEntries(EGG_COLORS.map((color) => [color, counts[color] ?? 0])) as Record<EggColor, number>
  const eggs = shuffle(colors.flatMap((color) => Array.from(
    { length: allCounts[color] },
    (_, index) => ({ id: `${color}-${index + 1}`, color }),
  )))

  return {
    colors: [...colors],
    eggs,
    counts: allCounts,
    options: {
      blue: allCounts.blue === 0 ? [] : createOptions(allCounts.blue),
      green: allCounts.green === 0 ? [] : createOptions(allCounts.green),
      pink: allCounts.pink === 0 ? [] : createOptions(allCounts.pink),
      purple: allCounts.purple === 0 ? [] : createOptions(allCounts.purple),
      yellow: allCounts.yellow === 0 ? [] : createOptions(allCounts.yellow),
      orange: allCounts.orange === 0 ? [] : createOptions(allCounts.orange),
    },
  }
}

export function createRound(): MathEggsRound {
  const balancedCounts: Array<{ blue: number; green: number; pink: number }> = []
  for (let blue = 5; blue <= 11; blue += 1) {
    for (let green = 5; green <= 11; green += 1) {
      const pink = 24 - blue - green
      if (pink >= 5 && pink <= 11) balancedCounts.push({ blue, green, pink })
    }
  }
  const counts = balancedCounts[Math.floor(Math.random() * balancedCounts.length)]!
  const colors = shuffle(EGG_COLORS).slice(0, 3)

  return createRoundForCounts({
    [colors[0]!]: counts.blue,
    [colors[1]!]: counts.green,
    [colors[2]!]: counts.pink,
  }, colors)
}

export function createGameState(round: MathEggsRound): MathEggsState {
  return {
    round,
    color: round.colors[0]!,
    selected: Object.fromEntries(EGG_COLORS.map((color) => [color, null])) as Record<EggColor, number | null>,
    completed: false,
  }
}

export function answerCurrentColor(state: MathEggsState, value: number): AnswerResult {
  if (state.completed || value !== state.round.counts[state.color]) return { accepted: false, state }

  const selected = { ...state.selected, [state.color]: value }
  const colorIndex = state.round.colors.indexOf(state.color)
  const completed = colorIndex === state.round.colors.length - 1

  return {
    accepted: true,
    state: {
      ...state,
      selected,
      color: completed ? state.color : state.round.colors[colorIndex + 1]!,
      completed,
    },
  }
}
