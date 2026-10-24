import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GameHeader } from './GameHeader'
import { Modal } from './Modal'
import { ProgressIndicator } from './ProgressIndicator'

describe('classroom UI primitives', () => {
  it('keeps the home control fitted to its icon in the header grid', () => {
    const styles = readFileSync(resolve(process.cwd(), 'src/styles/index.css'), 'utf8')

    expect(styles).toMatch(/\.home-button\s*\{[^}]*justify-self\s*:\s*start/)
  })

  it('renders labelled teacher controls', () => {
    render(<GameHeader onHome={vi.fn()} onRestart={vi.fn()} onSettings={vi.fn()} />)
    expect(screen.getByRole('button', { name: /reiniciar/i })).toBeEnabled()
  })

  it('shows the progress fraction', () => {
    render(<ProgressIndicator current={4} total={12} />)
    expect(screen.getByText('4 / 12')).toBeInTheDocument()
  })

  it('exposes a labelled dialog', () => {
    render(<Modal title="¡Muy bien!" onClose={vi.fn()}>Contenido</Modal>)
    expect(screen.getByRole('dialog', { name: /muy bien/i })).toBeInTheDocument()
  })

  it('keeps the message and action in a separate, spaced dialog content area', () => {
    const styles = readFileSync(resolve(process.cwd(), 'src/styles/index.css'), 'utf8')

    render(<Modal title="🎉 ¡MUY BIEN! 🎉" onClose={vi.fn()}><p>¡Has ganado!</p><button>Jugar otra vez</button></Modal>)

    expect(screen.getByRole('heading', { name: /¡muy bien!/i })).toHaveTextContent('¡MUY BIEN!')
    expect(screen.getByText('¡Has ganado!').parentElement).toHaveClass('modal-content')
    expect(styles).toMatch(/\.modal-content\s*\{[^}]*gap\s*:/)
  })
})
