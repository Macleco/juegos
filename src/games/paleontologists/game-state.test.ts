import { describe, expect, it } from 'vitest'
import { PALEONTOLOGY_LEVELS } from './game-data'
import { advanceToAssembly, createGameState, discoverBone, finishAssembly, placeBone, startGame } from './game-state'

describe('paleontologists game state', () => {
  it('only advances after every fossil is found', () => {
    const level = PALEONTOLOGY_LEVELS[0]; let state = startGame(level.id)
    expect(advanceToAssembly(state)).toBe(state)
    level.pieces.forEach(piece => { state = discoverBone(state, piece.id) })
    expect(advanceToAssembly(state).phase).toBe('assemble')
  })
  it('does not count a fossil twice and accepts only its matching target', () => {
    const level = PALEONTOLOGY_LEVELS[0]; let state = startGame(level.id)
    state = discoverBone(state, level.pieces[0].id); expect(discoverBone(state, level.pieces[0].id)).toBe(state)
    state = { ...state, phase: 'assemble', placedBoneIds: [] }
    expect(placeBone(state, level.pieces[0].id, 'wrong').accepted).toBe(false)
    expect(placeBone(state, level.pieces[0].id, level.pieces[0].targetId).accepted).toBe(true)
  })
  it('reveals only after the completed skeleton', () => {
    const level = PALEONTOLOGY_LEVELS[0]; const state = { ...createGameState(), phase: 'assemble' as const, dinosaurId: level.id, placedBoneIds: level.pieces.map(piece => piece.id) }
    expect(finishAssembly(state).phase).toBe('reveal')
  })
})
