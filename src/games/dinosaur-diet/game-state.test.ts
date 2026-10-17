import { describe, expect, it } from 'vitest'

import { DINOSAURS } from '../../data/dinosaurs'
import { classifyCurrentCard, createGameState, selectRound, shuffle } from './game-state'

describe('dinosaur diet game rules', () => {
  it('includes the new dinosaurs with their agreed diets', () => {
    expect(DINOSAURS).toHaveLength(17)
    expect(DINOSAURS.filter(({ diet }) => diet === 'herbivore')).toHaveLength(9)
    expect(DINOSAURS.filter(({ diet }) => diet === 'carnivore')).toHaveLength(8)

    expect(DINOSAURS.slice(-5)).toEqual([
      { id: 'ampelosaurus', name: 'Ampelosaurus', diet: 'herbivore', image: 'dinos/ampelosaurus.png' },
      { id: 'brachiosaurus', name: 'Brachiosaurus', diet: 'herbivore', image: 'dinos/brachiosaurus.png' },
      { id: 'brontosaurus', name: 'Brontosaurus', diet: 'herbivore', image: 'dinos/brontosaurus.png' },
      { id: 'pteranodon', name: 'Pteranodon', diet: 'carnivore', image: 'dinos/pteranodon.png' },
      { id: 'pterodactyl', name: 'Pterodactyl', diet: 'carnivore', image: 'dinos/pterodactyl.png' },
    ])
  })

  it('assigns a unique site-relative public photograph to every dinosaur', () => {
    const images = DINOSAURS.map(({ image }) => image)

    expect(images).toEqual([
      'dinos/triceratops.png',
      'dinos/diplodocus.png',
      'dinos/pachycephalosaurus.png',
      'dinos/stegosaurus.png',
      'dinos/ankylosaurus.png',
      'dinos/parasaurolophus.png',
      'dinos/tyrannosaurus-rex.png',
      'dinos/velociraptor.png',
      'dinos/spinosaurus.png',
      'dinos/giganotosaurus.png',
      'dinos/carnotaurus.png',
      'dinos/dilophosaurus.png',
      'dinos/ampelosaurus.png',
      'dinos/brachiosaurus.png',
      'dinos/brontosaurus.png',
      'dinos/pteranodon.png',
      'dinos/pterodactyl.png',
    ])
    expect(new Set(images).size).toBe(17)
  })

  it('shuffles without losing or mutating dinosaurs', () => {
    const shuffled = shuffle(DINOSAURS)
    expect(new Set(shuffled.map(({ id }) => id))).toEqual(new Set(DINOSAURS.map(({ id }) => id)))
    expect(shuffled).not.toBe(DINOSAURS)
  })

  it('selects eight distinct dinosaurs balanced across both diets', () => {
    const round = selectRound(DINOSAURS)

    expect(round).toHaveLength(8)
    expect(new Set(round.map(({ id }) => id))).toHaveLength(8)
    expect(round.filter(({ diet }) => diet === 'herbivore')).toHaveLength(4)
    expect(round.filter(({ diet }) => diet === 'carnivore')).toHaveLength(4)
  })

  it('moves the current dinosaur to its matching collection', () => {
    const state = createGameState([DINOSAURS[0]])
    const result = classifyCurrentCard(state, DINOSAURS[0].diet)
    expect(result.accepted).toBe(true)
    expect(result.state.deck).toHaveLength(0)
    expect(result.state.classifiedHerbivores).toContainEqual(DINOSAURS[0])
    expect(result.state.completed).toBe(true)
  })

  it('keeps the current dinosaur after an incorrect classification', () => {
    const state = createGameState([DINOSAURS[0]])
    const result = classifyCurrentCard(state, 'carnivore')
    expect(result.accepted).toBe(false)
    expect(result.state.deck).toEqual(state.deck)
    expect(result.state.classifiedHerbivores).toEqual([])
  })

  it('completes after every dinosaur in the round is correctly classified', () => {
    const round = selectRound(DINOSAURS)
    let state = createGameState(round)
    for (const dinosaur of round) state = classifyCurrentCard(state, dinosaur.diet).state
    expect(state.completed).toBe(true)
    expect(state.deck).toHaveLength(0)
  })
})
