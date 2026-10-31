import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { JurassicLostLettersGame } from './JurassicLostLettersGame'
import { createPuzzle } from './game-state'

const puzzles = [createPuzzle(DINOSAURS[0], 1), createPuzzle(DINOSAURS[1], 0)]

describe('JurassicLostLettersGame', () => {
  afterEach(() => vi.useRealTimers())

  it('shows the dinosaur image, its incomplete name, and three letter choices', () => {
    render(<JurassicLostLettersGame createRound={() => puzzles} />)
    expect(screen.getByRole('img', { name: 'Triceratops' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre incompleto: T_ICERATOPS')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^[A-ZÑ]$/ })).toHaveLength(3)
  })

  it('marks a wrong letter briefly and stays on the same word', () => {
    vi.useFakeTimers()
    render(<JurassicLostLettersGame createRound={() => puzzles} />)
    const wrong = puzzles[0].options.find((letter) => letter !== puzzles[0].answer)!
    const button = screen.getByRole('button', { name: wrong })
    fireEvent.click(button)
    expect(button).toHaveClass('wrong'); expect(screen.getByLabelText('Nombre incompleto: T_ICERATOPS')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(450))
    expect(button).not.toHaveClass('wrong')
  })

  it('advances after a correct letter and celebrates the completed round', () => {
    vi.useFakeTimers()
    render(<JurassicLostLettersGame createRound={() => puzzles} />)
    fireEvent.click(screen.getByRole('button', { name: puzzles[0].answer }))
    expect(screen.getByRole('status')).toHaveTextContent(/¡correcto!/i)
    act(() => vi.advanceTimersByTime(600))
    expect(screen.getByRole('img', { name: 'Diplodocus' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: puzzles[1].answer }))
    act(() => vi.advanceTimersByTime(600))
    expect(screen.getByText(/¡muy bien!/i)).toBeInTheDocument()
  })
})
