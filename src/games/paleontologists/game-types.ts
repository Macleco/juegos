export type GamePhase = 'select' | 'excavate' | 'assemble' | 'reveal' | 'complete'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface FossilPiece {
  id: string
  label: string
  targetId: string
  excavationRegion: { x: number; y: number; width: number; height: number }
  assemblyPosition: { x: number; y: number }
}

export interface DinosaurLevel {
  id: string
  name: string
  difficulty: Difficulty
  image: string
  educationalFact: string
  pieces: readonly FossilPiece[]
}

export interface GameState {
  phase: GamePhase
  dinosaurId: string | null
  discoveredBoneIds: readonly string[]
  placedBoneIds: readonly string[]
  hintsUsed: number
}
