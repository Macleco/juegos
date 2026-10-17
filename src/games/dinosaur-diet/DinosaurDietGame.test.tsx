import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DinosaurDietGame } from './DinosaurDietGame'

describe('DinosaurDietGame', () => {
  it('shows one active dinosaur and progress', () => {
    render(<DinosaurDietGame />)
    const activeCard = screen.getByTestId('active-dinosaur-card')
    expect(screen.getAllByTestId('active-dinosaur-card')).toHaveLength(1)
    expect(activeCard.parentElement).toHaveClass('deck-card')
    expect(within(activeCard).getByRole('img')).toHaveAttribute('src', expect.stringMatching(/^dinos\/.+\.png$/))
    expect(screen.getByText('0 / 8')).toBeInTheDocument()
  })

  it('shows a single drag instruction beside the dinosaur deck', () => {
    render(<DinosaurDietGame />)

    expect(screen.getByRole('complementary', { name: /instrucciones de juego/i })).toHaveTextContent(/ARRASTRA\s*EL DINOSAURIO/)
    expect(screen.queryByText('¡Arrastra aquí!')).not.toBeInTheDocument()
  })
})
