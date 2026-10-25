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
    expect(screen.getByRole('button', { name: 'DINOSAURIOS' })).toContainElement(
      screen.getAllByAltText('')[0],
    )
    expect(screen.getAllByAltText('')[0]).toHaveAttribute('src', 'logo_dinosaurios_no_texto.png')
    expect(screen.getByRole('button', { name: 'AMISTAD' })).toContainElement(
      screen.getAllByAltText('')[1],
    )
    expect(screen.getAllByAltText('')[1]).toHaveAttribute('src', 'amistad_no_texto.png')
    expect(screen.getByText('DINOSAURIOS')).toBeInTheDocument()
    expect(screen.getByText('AMISTAD')).toBeInTheDocument()
  })

  it('opens the dinosaur game list before starting its game', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /dinosaurios/i }))

    expect(screen.getByRole('heading', { name: /dinosaurios/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /elige un juego/i })).toBeInTheDocument()
    const gameLogos = screen.getAllByAltText('')
    expect(gameLogos[0]).toHaveAttribute('src', 'logo_herbivoros.png')
    expect(gameLogos[1]).toHaveAttribute('src', 'logo_juego_nombres.png')
    expect(gameLogos[2]).toHaveAttribute('src', 'logo_sumas.png')
    expect(screen.getByRole('button', { name: /memory jurásico/i })).toBeInTheDocument()
    expect(gameLogos[3]).toHaveAttribute('src', 'logo_memory.png')
    expect(screen.getByRole('button', { name: /sílabas jurásicas/i })).toBeInTheDocument()
    expect(gameLogos[4]).toHaveAttribute('src', 'logo_silabas.png')

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

  it('opens Memory Jurásico from the dinosaur menu', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /dinosaurios/i }))
    fireEvent.click(screen.getByRole('button', { name: /memory jurásico/i }))

    expect(screen.getByRole('heading', { name: /memory jurásico/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/jurassic-memory')
  })

  it('opens Sílabas jurásicas from the dinosaur menu', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /dinosaurios/i }))
    fireEvent.click(screen.getByRole('button', { name: /sílabas jurásicas/i }))

    expect(screen.getByRole('heading', { name: /sílabas jurásicas/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/jurassic-syllables')
  })

  it.each([
    ['¿Qué comía cada dinosaurio?', '#/dinosaur-diet'],
    ['¿Cómo se llama el dinosaurio?', '#/dinosaur-name'],
    ['Sumas jurásicas', '#/jurassic-sums'],
    ['Memory Jurásico', '#/jurassic-memory'],
    ['Sílabas jurásicas', '#/jurassic-syllables'],
  ])('returns from %s to the dinosaur game category', (gameName, expectedHash) => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /dinosaurios/i }))
    fireEvent.click(screen.getByRole('button', { name: (name) => name.startsWith(gameName) }))
    expect(window.location.hash).toBe(expectedHash)

    fireEvent.click(screen.getByRole('button', { name: 'Juegos de dinosaurios' }))

    expect(screen.getByRole('heading', { name: /elige un juego/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/dinosaur-games')
  })

  it('opens the friendship signals game from the menu', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /amistad/i }))

    expect(screen.getByRole('heading', { name: /señales de mis amistades/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/friendship-signals')
  })
})
