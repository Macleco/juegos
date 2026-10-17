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
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
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
    render(<JurassicSumsGame createRound={createTestRound} />)

    ;[2, 3, 5].forEach((value) => fireEvent.click(screen.getByRole('button', { name: String(value) })))
    fireEvent.click(screen.getByRole('button', { name: /jugar otra vez/i }))

    expect(screen.getByText(/¿cuántos hay en el primer grupo/i)).toBeInTheDocument()
    expect(screen.queryByText(/¡muy bien!/i)).not.toBeInTheDocument()
  })

  it('does not offer more answers after closing the completion dialog', () => {
    render(<JurassicSumsGame createRound={createTestRound} />)

    ;[2, 3, 5].forEach((value) => fireEvent.click(screen.getByRole('button', { name: String(value) })))
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }))

    expect(screen.queryByRole('group', { name: /respuestas/i })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/suma completada/i)
  })
})
