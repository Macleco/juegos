import { act, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@dnd-kit/core', async () => {
  return {
    DndContext: ({ children, onDragEnd }: { children: ReactNode; onDragEnd: (event: { over: { id: string } }) => void }) => (
      <div>
        <button onClick={() => onDragEnd({ over: { id: 'triceratops' } })}>Soltar en triceratops</button>
        <button onClick={() => onDragEnd({ over: { id: 'diplodocus' } })}>Soltar en diplodocus</button>
        <button onClick={() => onDragEnd({ over: { id: 'pachycephalosaurus' } })}>Soltar en pachycephalosaurus</button>
        <button onClick={() => onDragEnd({ over: { id: 'stegosaurus' } })}>Soltar en stegosaurus</button>
        {children}
      </div>
    ),
    PointerSensor: class PointerSensor {},
    useDraggable: () => ({ attributes: {}, listeners: {}, setNodeRef: () => {}, transform: null }),
    useDroppable: () => ({ isOver: false, setNodeRef: () => {} }),
    useSensor: () => ({}),
    useSensors: () => [],
  }
})

import { DinosaurNameGame } from './DinosaurNameGame'

describe('DinosaurNameGame', () => {
  beforeEach(() => vi.spyOn(Math, 'random').mockReturnValue(0.999))
  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

  it('shows four photographs and one name ready to drag', () => {
    render(<DinosaurNameGame />)

    expect(screen.getAllByTestId('dinosaur-photo-zone')).toHaveLength(4)
    expect(screen.getByTestId('active-dinosaur-name')).toHaveTextContent('Diplodocus')
    expect(screen.getByText('0 / 4')).toBeInTheDocument()
  })

  it('keeps the current name after an incorrect drop and advances after the correct one', () => {
    render(<DinosaurNameGame />)

    fireEvent.click(screen.getByRole('button', { name: 'Soltar en triceratops' }))
    expect(screen.getByTestId('active-dinosaur-name')).toHaveTextContent('Diplodocus')
    expect(screen.getByTestId('active-dinosaur-name')).toHaveClass('wrong')
    expect(screen.getByText('0 / 4')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Soltar en diplodocus' }))
    expect(screen.getByTestId('resolved-diplodocus')).toBeInTheDocument()
    expect(screen.getByTestId('active-dinosaur-name')).toHaveTextContent('Pachycephalosaurus')
    expect(screen.getByText('1 / 4')).toBeInTheDocument()
  })

  it('celebrates the completed round and restart creates a new active round', async () => {
    render(<DinosaurNameGame />)

    for (const id of ['diplodocus', 'pachycephalosaurus', 'stegosaurus', 'triceratops']) {
      fireEvent.click(screen.getByRole('button', { name: `Soltar en ${id}` }))
    }
    expect(await screen.findByRole('heading', { name: /muy bien/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar partida' }))
    expect(screen.getByText('0 / 4')).toBeInTheDocument()
    expect(screen.getByTestId('active-dinosaur-name')).toBeInTheDocument()
  })

  it('does not show the previous round celebration after an immediate restart', () => {
    vi.useFakeTimers()
    render(<DinosaurNameGame />)

    for (const id of ['diplodocus', 'pachycephalosaurus', 'stegosaurus', 'triceratops']) {
      fireEvent.click(screen.getByRole('button', { name: `Soltar en ${id}` }))
    }
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar partida' }))
    act(() => vi.advanceTimersByTime(350))

    expect(screen.queryByRole('heading', { name: /muy bien/i })).not.toBeInTheDocument()
    expect(screen.getByText('0 / 4')).toBeInTheDocument()
  })
})
