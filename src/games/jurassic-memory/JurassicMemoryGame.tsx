import { useEffect, useRef, useState } from 'react'

import { GameHeader } from '../../components/GameHeader'
import { Modal } from '../../components/Modal'
import { DINOSAURS } from '../../data/dinosaurs'
import { createGameState, createRound, hideUnmatchedCards, selectCard, type MemoryCard } from './game-state'

const MISMATCH_DURATION = 1_200

interface JurassicMemoryGameProps {
  onHome?: () => void
  onDinosaurGames?: () => void
  createRound?: () => readonly MemoryCard[]
}

export function JurassicMemoryGame({ onHome = () => {}, onDinosaurGames = () => {}, createRound: makeRound = () => createRound(DINOSAURS) }: JurassicMemoryGameProps) {
  const [state, setState] = useState(() => createGameState(makeRound()))
  const [settings, setSettings] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const mismatchTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => {
    if (mismatchTimer.current !== undefined) window.clearTimeout(mismatchTimer.current)
  }, [])

  const restart = () => {
    if (mismatchTimer.current !== undefined) window.clearTimeout(mismatchTimer.current)
    mismatchTimer.current = undefined
    setState(createGameState(makeRound()))
    setSettings(false)
    setCelebrate(false)
  }

  const chooseCard = (cardId: string) => {
    const result = selectCard(state, cardId)
    if (!result.accepted) return
    setState(result.state)

    if (result.match === false) {
      mismatchTimer.current = window.setTimeout(() => {
        setState((current) => hideUnmatchedCards(current))
        mismatchTimer.current = undefined
      }, MISMATCH_DURATION)
    }
    if (result.state.completed) setCelebrate(true)
  }

  return <main className="game-shell jurassic-memory-game">
    <GameHeader title="Memory Jurásico" onHome={onHome} onDinosaurGames={onDinosaurGames} onRestart={restart} onSettings={() => setSettings(true)} />
    <section className="memory-game-content" aria-label="Memory Jurásico">
      <p className="memory-instruction">TOCA DOS CARTAS PARA ENCONTRAR SU PAREJA</p>
      <div className="memory-card-grid" aria-label="Cartas de Memory Jurásico">
        {state.cards.map((card, index) => {
          const visible = state.faceUpIds.includes(card.id) || state.matchedIds.includes(card.id)
          const matched = state.matchedIds.includes(card.id)
          return <button key={card.id} className={`memory-card ${visible ? 'face-up' : ''} ${matched ? 'matched' : ''}`} onClick={() => chooseCard(card.id)} disabled={matched} aria-label={visible ? card.dinosaur.name : `Carta boca abajo ${index + 1}`}>
            {visible ? <span className="memory-card-front"><img src={card.dinosaur.image} alt={card.dinosaur.name} /><strong>{card.dinosaur.name.toUpperCase()}</strong></span> : <img className="memory-card-back" data-testid="memory-card-back" src="reverso_memory.png" alt="" />}
          </button>
        })}
      </div>
      <p className="memory-progress" aria-live="polite">{state.matchedIds.length / 2} / {state.cards.length / 2} parejas</p>
    </section>
    {settings && <Modal title="Configuración" onClose={() => setSettings(false)}><p>Panel preparado para futuras opciones de aula.</p><button className="primary-button" onClick={restart}>Reiniciar partida</button></Modal>}
    {celebrate && <Modal title="🎉 ¡MUY BIEN! 🎉" onClose={() => setCelebrate(false)}><p>¡Has encontrado todas las parejas de dinosaurios!</p><button className="primary-button" onClick={restart}>Jugar otra vez</button></Modal>}
  </main>
}
