import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { JurassicSumsGame } from './JurassicSumsGame'
import { createRoundForCounts } from './game-state'

const createTestRound = () => createRoundForCounts(DINOSAURS, 2, 3)
const answerAndAdvance = (value: number) => {
  fireEvent.click(screen.getByRole('button', { name: String(value) }))
  act(() => vi.advanceTimersByTime(600))
}

describe('JurassicSumsGame', () => {
  afterEach(() => vi.useRealTimers())

  it('marks the correct egg before advancing to the next group', () => {
    vi.useFakeTimers()
    render(<JurassicSumsGame createRound={createTestRound} />)

    const correctEgg = screen.getByRole('button', { name: '2' })
    fireEvent.click(correctEgg)

    expect(correctEgg).toHaveClass('correct')
    screen.getAllByRole('button', { name: /^[1-4]$/ }).forEach((button) => expect(button).toBeDisabled())
    expect(screen.getByText(/¿cuántos hay en el primer grupo/i)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/¡correcto!/i)

    act(() => vi.advanceTimersByTime(599))

    expect(screen.getByText(/¿cuántos hay en el primer grupo/i)).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))

    expect(screen.getByText(/¿cuántos hay en el segundo grupo/i)).toBeInTheDocument()
  })

  it('highlights the group or groups being counted in each step', () => {
    vi.useFakeTimers()
    render(<JurassicSumsGame createRound={createTestRound} />)

    const firstGroup = screen.getByRole('region', { name: /primer grupo/i })
    const secondGroup = screen.getByRole('region', { name: /segundo grupo/i })
    expect(firstGroup).toHaveClass('active')
    expect(secondGroup).not.toHaveClass('active')

    answerAndAdvance(2)
    expect(firstGroup).not.toHaveClass('active')
    expect(secondGroup).toHaveClass('active')

    answerAndAdvance(3)
    expect(firstGroup).toHaveClass('active')
    expect(secondGroup).toHaveClass('active')
  })

  it('highlights the result only when calculating the total', () => {
    vi.useFakeTimers()
    render(<JurassicSumsGame createRound={createTestRound} />)

    const result = screen.getByText('? + ? = ?')
    expect(result).not.toHaveClass('active')

    answerAndAdvance(2)
    expect(result).not.toHaveClass('active')

    answerAndAdvance(3)
    expect(result).toHaveClass('active')
  })

  it('keeps confirmed counts in the equation and then asks for the total', () => {
    vi.useFakeTimers()
    render(<JurassicSumsGame createRound={createTestRound} />)

    answerAndAdvance(2)
    answerAndAdvance(3)

    expect(screen.getByText('2 + 3 = ?')).toBeInTheDocument()
    expect(screen.getByText(/¿cuánto suman/i)).toBeInTheDocument()
  })

  it('keeps the active step after an incorrect option', () => {
    render(<JurassicSumsGame createRound={createTestRound} />)

    const options = screen.getByRole('group', { name: /respuestas/i })
    const wrongOption = within(options).getAllByRole('button').find((button) => button.textContent !== '2')!
    fireEvent.click(wrongOption)

    expect(screen.getByText(/¿cuántos hay en el primer grupo/i)).toBeInTheDocument()
    expect(wrongOption).toHaveClass('wrong')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('keeps cracks on incorrect eggs until the correct answer is chosen', () => {
    vi.useFakeTimers()
    render(<JurassicSumsGame createRound={createTestRound} />)

    const wrongEggs = screen.getAllByRole('button', { name: /^[1-4]$/ }).filter((egg) => egg.textContent !== '2')
    fireEvent.click(wrongEggs[0])
    fireEvent.click(wrongEggs[1])
    act(() => vi.advanceTimersByTime(450))

    expect(wrongEggs[0]).toHaveClass('cracked')
    expect(wrongEggs[1]).toHaveClass('cracked')

    fireEvent.click(screen.getByRole('button', { name: '2' }))

    expect(wrongEggs[0]).not.toHaveClass('cracked')
    expect(wrongEggs[1]).not.toHaveClass('cracked')
  })

  it('exposes each dinosaur as a countable item in both groups', () => {
    render(<JurassicSumsGame createRound={createTestRound} />)

    expect(within(screen.getByRole('list', { name: /primer grupo/i })).getAllByRole('listitem')).toHaveLength(2)
    expect(within(screen.getByRole('list', { name: /segundo grupo/i })).getAllByRole('listitem')).toHaveLength(3)
  })

  it('presents each answer as an egg-shaped choice', () => {
    render(<JurassicSumsGame createRound={createTestRound} />)

    within(screen.getByRole('group', { name: /respuestas/i })).getAllByRole('button').forEach((button) => {
      expect(button).toHaveClass('egg-option')
    })
  })

  it('restarts from the first counting step and closes the celebration', () => {
    vi.useFakeTimers()
    render(<JurassicSumsGame createRound={createTestRound} />)

    ;[2, 3, 5].forEach(answerAndAdvance)
    fireEvent.click(screen.getByRole('button', { name: /jugar otra vez/i }))

    expect(screen.getByText(/¿cuántos hay en el primer grupo/i)).toBeInTheDocument()
    expect(screen.queryByText(/¡muy bien!/i)).not.toBeInTheDocument()
  })

  it('does not offer more answers after closing the completion dialog', () => {
    vi.useFakeTimers()
    render(<JurassicSumsGame createRound={createTestRound} />)

    ;[2, 3, 5].forEach(answerAndAdvance)
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }))

    expect(screen.queryByRole('group', { name: /respuestas/i })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/suma completada/i)
    expect(screen.getAllByText(/¡suma completada!/i)).toHaveLength(1)
  })
})
