import type { Dinosaur } from '../../data/dinosaurs'

export type SumStep = 'left' | 'right' | 'total'

export interface JurassicSumsRound {
  leftGroup: readonly Dinosaur[]
  rightGroup: readonly Dinosaur[]
  total: number
  answers: readonly [number, number, number]
  options: readonly [readonly number[], readonly number[], readonly number[]]
}

export interface JurassicSumsState {
  round: JurassicSumsRound
  step: SumStep
  selected: readonly [number | null, number | null, number | null]
  completed: boolean
}

export interface AnswerResult {
  accepted: boolean
  state: JurassicSumsState
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

function chooseGroup(dinosaurs: readonly Dinosaur[], count: number, speciesIndex: number): Dinosaur[] {
  if (dinosaurs.length === 0) throw new Error('At least one dinosaur is required')
  const dinosaur = dinosaurs[speciesIndex % dinosaurs.length]
  return Array.from({ length: count }, () => dinosaur)
}

function createOptions(answer: number, minimum: number, maximum: number): number[] {
  const values = [answer]
  for (let distance = 1; values.length < 4; distance += 1) {
    const lower = answer - distance
    const higher = answer + distance
    if (lower >= minimum) values.push(lower)
    if (values.length < 4 && higher <= maximum) values.push(higher)
  }
  return shuffle(values)
}

export function createRoundForCounts(
  dinosaurs: readonly Dinosaur[],
  leftCount: number,
  rightCount: number,
): JurassicSumsRound {
  if (leftCount < 1 || leftCount > 9 || rightCount < 1 || rightCount > 9) {
    throw new Error('Each group must contain between one and nine dinosaurs')
  }

  const leftGroup = chooseGroup(dinosaurs, leftCount, 0)
  const rightGroup = chooseGroup(dinosaurs, rightCount, 1)
  const total = leftCount + rightCount

  return {
    leftGroup,
    rightGroup,
    total,
    answers: [leftCount, rightCount, total],
    options: [
      createOptions(leftCount, 1, 9),
      createOptions(rightCount, 1, 9),
      createOptions(total, 2, 18),
    ],
  }
}

export function createRound(dinosaurs: readonly Dinosaur[]): JurassicSumsRound {
  const leftCount = Math.floor(Math.random() * 9) + 1
  const rightCount = Math.floor(Math.random() * 9) + 1
  return createRoundForCounts(shuffle(dinosaurs), leftCount, rightCount)
}

export function createGameState(round: JurassicSumsRound): JurassicSumsState {
  return {
    round,
    step: 'left',
    selected: [null, null, null],
    completed: false,
  }
}

const STEPS: readonly SumStep[] = ['left', 'right', 'total']

export function answerCurrentStep(state: JurassicSumsState, value: number): AnswerResult {
  if (state.completed) return { accepted: false, state }

  const stepIndex = STEPS.indexOf(state.step)
  if (value !== state.round.answers[stepIndex]) return { accepted: false, state }

  const selected = [...state.selected] as [number | null, number | null, number | null]
  selected[stepIndex] = value
  const completed = stepIndex === STEPS.length - 1

  return {
    accepted: true,
    state: {
      ...state,
      selected,
      step: completed ? 'total' : STEPS[stepIndex + 1],
      completed,
    },
  }
}
