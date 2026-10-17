import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { JurassicSumsGame } from './JurassicSumsGame'
import { createRoundForCounts } from './game-state'

const createTestRound = () => createRoundForCounts(DINOSAURS, 2, 3)

describe('JurassicSumsGame', () => {
  it('keeps confirmed counts in the equation and then asks for the total', () => {
    render(<JurassicSumsGame createRound={createTestRound} />)

    fireEvent.click(screen.getByRole('button', { name: '2' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))

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
  })

  it('restarts from the first counting step and closes the celebration', () => {
    render(<JurassicSumsGame createRound={createTestRound} />)

    ;[2, 3, 5].forEach((value) => fireEvent.click(screen.getByRole('button', { name: String(value) })))
    fireEvent.click(screen.getByRole('button', { name: /jugar otra vez/i }))

    expect(screen.getByText(/¿cuántos hay en el primer grupo/i)).toBeInTheDocument()
    expect(screen.queryByText(/¡muy bien!/i)).not.toBeInTheDocument()
  })
})
