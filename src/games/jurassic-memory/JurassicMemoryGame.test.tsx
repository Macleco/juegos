import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { MemoryCard } from './game-state'
import { JurassicMemoryGame } from './JurassicMemoryGame'

const round: readonly MemoryCard[] = [
  { id: 'triceratops-1', dinosaur: { id: 'triceratops', name: 'Triceratops', diet: 'herbivore', image: 'dinos/triceratops.png' } },
  { id: 'diplodocus-1', dinosaur: { id: 'diplodocus', name: 'Diplodocus', diet: 'herbivore', image: 'dinos/diplodocus.png' } },
  { id: 'triceratops-2', dinosaur: { id: 'triceratops', name: 'Triceratops', diet: 'herbivore', image: 'dinos/triceratops.png' } },
  { id: 'diplodocus-2', dinosaur: { id: 'diplodocus', name: 'Diplodocus', diet: 'herbivore', image: 'dinos/diplodocus.png' } },
  { id: 'stegosaurus-1', dinosaur: { id: 'stegosaurus', name: 'Stegosaurus', diet: 'herbivore', image: 'dinos/stegosaurus.png' } },
  { id: 'stegosaurus-2', dinosaur: { id: 'stegosaurus', name: 'Stegosaurus', diet: 'herbivore', image: 'dinos/stegosaurus.png' } },
  { id: 'ankylosaurus-1', dinosaur: { id: 'ankylosaurus', name: 'Ankylosaurus', diet: 'herbivore', image: 'dinos/ankylosaurus.png' } },
  { id: 'ankylosaurus-2', dinosaur: { id: 'ankylosaurus', name: 'Ankylosaurus', diet: 'herbivore', image: 'dinos/ankylosaurus.png' } },
  { id: 'parasaurolophus-1', dinosaur: { id: 'parasaurolophus', name: 'Parasaurolophus', diet: 'herbivore', image: 'dinos/parasaurolophus.png' } },
  { id: 'parasaurolophus-2', dinosaur: { id: 'parasaurolophus', name: 'Parasaurolophus', diet: 'herbivore', image: 'dinos/parasaurolophus.png' } },
]

describe('JurassicMemoryGame', () => {
  afterEach(() => { vi.useRealTimers() })

  it('shows ten face-down cards in a 2 by 5 memory grid', () => {
    render(<JurassicMemoryGame createRound={() => round} />)

    expect(screen.getByLabelText('Cartas de Memory Jurásico')).toHaveClass('memory-card-grid')
    expect(screen.getAllByRole('button', { name: /carta boca abajo/i })).toHaveLength(10)
    expect(screen.getAllByTestId('memory-card-back')).toHaveLength(10)
    expect(screen.getAllByTestId('memory-card-back')[0]).toHaveAttribute('src', 'reverso_memory.png')
  })

  it('shows a dinosaur image and name after touching a card, then keeps a correct pair visible', () => {
    render(<JurassicMemoryGame createRound={() => round} />)

    fireEvent.click(screen.getByRole('button', { name: 'Carta boca abajo 1' }))
    expect(screen.getByRole('img', { name: 'Triceratops' })).toHaveAttribute('src', 'dinos/triceratops.png')
    expect(screen.getByText('TRICERATOPS')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Carta boca abajo 3' }))
    expect(screen.getAllByText('TRICERATOPS')).toHaveLength(2)
    expect(screen.getByText('1 / 5 parejas')).toBeInTheDocument()
  })

  it('hides an incorrect pair after a brief pause', () => {
    vi.useFakeTimers()
    render(<JurassicMemoryGame createRound={() => round} />)

    fireEvent.click(screen.getByRole('button', { name: 'Carta boca abajo 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Carta boca abajo 2' }))
    expect(screen.getByText('DIPLODOCUS')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(900))
    expect(screen.queryByText('TRICERATOPS')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /carta boca abajo/i })).toHaveLength(10)
  })
})
