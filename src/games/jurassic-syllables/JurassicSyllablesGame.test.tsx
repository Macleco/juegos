import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { JurassicSyllablesGame } from './JurassicSyllablesGame'

describe('JurassicSyllablesGame', () => {
  it('shows the active image card, the three syllable groups and progress', () => {
    render(<JurassicSyllablesGame />)

    const activeCard = screen.getByTestId('active-syllable-card')
    expect(within(activeCard).getByRole('img')).toHaveAttribute('src', expect.stringMatching(/^imagenes_dino_silabas\/.+\.jpg$/))
    expect(screen.getByRole('region', { name: '2 sílabas' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: '3 sílabas' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: '4 sílabas' })).toBeInTheDocument()
    expect(screen.getByText('0 / 12')).toBeInTheDocument()
  })
})
