import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MathEggsGame } from './MathEggsGame'
import { createRoundForCounts } from './game-state'

const createTestRound = () => createRoundForCounts({ blue: 4, green: 6, pink: 5 })

describe('MathEggsGame', () => {
  afterEach(() => vi.useRealTimers())

  it('asks for the blue eggs first and offers exactly three answers', () => {
    render(<MathEggsGame createRound={createTestRound} />)

    expect(screen.getByText(/¿cuántos huevos azules hay/i)).toBeInTheDocument()
    expect(within(screen.getByRole('group', { name: /respuestas posibles/i })).getAllByRole('button')).toHaveLength(3)
    expect(within(screen.getByRole('list', { name: /huevos para contar/i })).getAllByRole('listitem')).toHaveLength(15)
  })

  it('shows the correct choice, then advances to the next color', () => {
    vi.useFakeTimers()
    render(<MathEggsGame createRound={createTestRound} />)

    const answer = screen.getByRole('button', { name: '4' })
    fireEvent.click(answer)

    expect(answer).toHaveClass('correct')
    expect(screen.getByRole('status')).toHaveTextContent(/¡correcto!/i)
    expect(screen.getByText(/¿cuántos huevos azules hay/i)).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(600))

    expect(screen.getByText(/¿cuántos huevos verdes hay/i)).toBeInTheDocument()
    expect(screen.getByText('4', { selector: '.progress-egg' })).toBeInTheDocument()
  })

  it('keeps the current color after an incorrect answer', () => {
    render(<MathEggsGame createRound={createTestRound} />)

    const wrongAnswer = screen.getAllByRole('button', { name: /^[235]$/ }).find((button) => button.textContent !== '4')!
    fireEvent.click(wrongAnswer)

    expect(wrongAnswer).toHaveClass('wrong')
    expect(screen.getByText(/¿cuántos huevos azules hay/i)).toBeInTheDocument()
  })
})
