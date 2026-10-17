import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { App } from './App'

describe('App', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('shows the game menu at the root URL', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /juegos interactivos/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /elige temática/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dinosaurios/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /amistad/i })).toBeInTheDocument()
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

    expect(screen.getByRole('heading', { name: /juegos interactivos/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('')
  })

  it('opens the friendship signals game from the menu', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /amistad/i }))

    expect(screen.getByRole('heading', { name: /señales de mis amistades/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/friendship-signals')
  })
})
