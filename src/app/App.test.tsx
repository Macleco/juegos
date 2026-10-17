import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { App } from './App'

describe('App', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('shows the game menu at the root URL', () => {
    render(<App />)

    expect(screen.getByRole('img', { name: /juegos interactivos/i })).toHaveAttribute('src', 'logo.png')
    expect(screen.queryByText(/aprende jugando/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /elige temática/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dinosaurios/i })).toContainElement(
      screen.getByRole('img', { name: /dinosaurios/i }),
    )
    expect(screen.getByRole('img', { name: /dinosaurios/i })).toHaveAttribute('src', 'logo_seccion_dinosaurios.png')
    expect(screen.getByRole('button', { name: /amistad/i })).toContainElement(
      screen.getByRole('img', { name: /amistad/i }),
    )
    expect(screen.getByRole('img', { name: /amistad/i })).toHaveAttribute('src', 'logo_amistad.png')
  })

  it('opens the dinosaur game list before starting its game', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /dinosaurios/i }))

    expect(screen.getByRole('heading', { name: /dinosaurios/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /elige un juego/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /qué comía cada dinosaurio/i }))

    expect(screen.getByRole('heading', { name: /qué comía cada dinosaurio/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/dinosaur-diet')

    fireEvent.click(screen.getByRole('button', { name: /inicio/i }))

    expect(screen.getByRole('img', { name: /juegos interactivos/i })).toHaveAttribute('src', 'logo.png')
    expect(window.location.hash).toBe('')
  })

  it('opens the dinosaur name game and returns home', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /dinosaurios/i }))
    fireEvent.click(screen.getByRole('button', { name: /cómo se llama el dinosaurio/i }))

    expect(screen.getByRole('heading', { name: /cómo se llama el dinosaurio/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/dinosaur-name')

    fireEvent.click(screen.getByRole('button', { name: /inicio/i }))

    expect(screen.getByRole('img', { name: /juegos interactivos/i })).toHaveAttribute('src', 'logo.png')
    expect(window.location.hash).toBe('')
  })

  it('opens Jurassic Sums from the dinosaur menu and returns home', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /dinosaurios/i }))
    fireEvent.click(screen.getByRole('button', { name: /sumas jurásicas/i }))

    expect(screen.getByRole('heading', { name: /sumas jurásicas/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/jurassic-sums')

    fireEvent.click(screen.getByRole('button', { name: /inicio/i }))

    expect(screen.getByRole('img', { name: /juegos interactivos/i })).toHaveAttribute('src', 'logo.png')
    expect(window.location.hash).toBe('')
  })

  it('opens the friendship signals game from the menu', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /amistad/i }))

    expect(screen.getByRole('heading', { name: /señales de mis amistades/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/friendship-signals')
  })
})
