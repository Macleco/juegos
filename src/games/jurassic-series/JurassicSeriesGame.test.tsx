import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { createRound } from './game-state'
import { JurassicSeriesGame } from './JurassicSeriesGame'

const round = createRound(DINOSAURS)

describe('JurassicSeriesGame', () => {
  it('shows three series, three empty positions and their dinosaur choices', () => {
    render(<JurassicSeriesGame createRound={() => round} />)

    expect(screen.getByRole('heading', { name: /series jurásicas/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /hueco de la serie/i })).toHaveLength(3)
    expect(screen.getAllByRole('button', { name: /dinosaurio para arrastrar/i })).toHaveLength(3)
  })

  it('fills a series by touching its dinosaur and then its empty position', () => {
    render(<JurassicSeriesGame createRound={() => round} />)
    const initialDinosaurCount = screen.getAllByRole('img', { name: round[0].answer.name }).length

    fireEvent.click(screen.getByRole('button', { name: `Dinosaurio para arrastrar: ${round[0].answer.name}` }))
    fireEvent.click(screen.getByRole('button', { name: /hueco de la serie 1/i }))

    expect(screen.getAllByRole('img', { name: round[0].answer.name })).toHaveLength(initialDinosaurCount)
    expect(screen.queryByRole('button', { name: `Dinosaurio para arrastrar: ${round[0].answer.name}` })).not.toBeInTheDocument()
    expect(screen.getByText('1 / 3 series completadas')).toBeInTheDocument()
  })
})
