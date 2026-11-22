import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { createRound } from './game-state'
import { DinosaurSizesGame } from './DinosaurSizesGame'

const round = createRound(DINOSAURS)

describe('DinosaurSizesGame', () => {
  it('shows one dinosaur in six or seven different sizes and a place for each one', () => {
    render(<DinosaurSizesGame createRound={() => round} />)

    expect(screen.getByRole('heading', { name: /tamaños jurásicos/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /dinosaurio para ordenar/i })).toHaveLength(round.sizeCount)
    expect(screen.getAllByRole('button', { name: /hueco/i })).toHaveLength(round.sizeCount)
  })

  it('orders a dinosaur by touching it and then its matching size space', () => {
    render(<DinosaurSizesGame createRound={() => round} />)
    const smallest = round.cards.find((card) => card.size === 1)!

    fireEvent.click(screen.getByRole('button', { name: `Dinosaurio para ordenar: ${round.dinosaur.name}, tamaño 1` }))
    fireEvent.click(screen.getByRole('button', { name: /hueco más pequeño/i }))

    expect(screen.queryByRole('button', { name: `Dinosaurio para ordenar: ${round.dinosaur.name}, tamaño 1` })).not.toBeInTheDocument()
    expect(screen.getByText(`1 / ${round.sizeCount} dinosaurios ordenados`)).toBeInTheDocument()
    expect(screen.getByLabelText(`Más pequeño: ${round.dinosaur.name}`)).toBeInTheDocument()
    expect(smallest).toBeDefined()
  })
})
