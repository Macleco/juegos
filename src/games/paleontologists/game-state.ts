import { levelById } from './game-data'
import type { GameState } from './game-types'

export const createGameState = (): GameState => ({ phase: 'select', dinosaurId: null, discoveredBoneIds: [], placedBoneIds: [], hintsUsed: 0 })
export const startGame = (dinosaurId: string): GameState => levelById(dinosaurId) ? { ...createGameState(), phase: 'excavate', dinosaurId } : createGameState()
export const discoverBone = (state: GameState, boneId: string): GameState => {
  const level = levelById(state.dinosaurId)
  if (state.phase !== 'excavate' || !level?.pieces.some(piece => piece.id === boneId) || state.discoveredBoneIds.includes(boneId)) return state
  return { ...state, discoveredBoneIds: [...state.discoveredBoneIds, boneId] }
}
export const advanceToAssembly = (state: GameState): GameState => {
  const level = levelById(state.dinosaurId)
  return level && state.phase === 'excavate' && state.discoveredBoneIds.length === level.pieces.length ? { ...state, phase: 'assemble' } : state
}
export const placeBone = (state: GameState, boneId: string, targetId: string): { accepted: boolean; state: GameState } => {
  const level = levelById(state.dinosaurId); const valid = level?.pieces.some(piece => piece.id === boneId && piece.targetId === targetId)
  if (state.phase !== 'assemble' || !valid || state.placedBoneIds.includes(boneId)) return { accepted: false, state }
  return { accepted: true, state: { ...state, placedBoneIds: [...state.placedBoneIds, boneId] } }
}
export const finishAssembly = (state: GameState): GameState => {
  const level = levelById(state.dinosaurId)
  return level && state.phase === 'assemble' && state.placedBoneIds.length === level.pieces.length ? { ...state, phase: 'reveal' } : state
}
export const completeReveal = (state: GameState): GameState => state.phase === 'reveal' ? { ...state, phase: 'complete' } : state
export const restartGame = (state: GameState): GameState => state.dinosaurId ? startGame(state.dinosaurId) : createGameState()
