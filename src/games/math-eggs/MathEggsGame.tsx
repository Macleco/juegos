import { useEffect, useRef, useState } from 'react'

import { GameHeader } from '../../components/GameHeader'
import { Modal } from '../../components/Modal'
import {
  answerCurrentColor,
  createGameState,
  createRound,
  type EggColor,
  type MathEggsRound,
} from './game-state'

const COLOR_LABELS: Record<EggColor, string> = {
  blue: 'azules',
  green: 'verdes',
  pink: 'rosas',
  purple: 'morados',
  yellow: 'amarillos',
  orange: 'naranjas',
}
const EGG_LABELS: Record<EggColor, string> = {
  blue: 'azul',
  green: 'verde',
  pink: 'rosa',
  purple: 'morado',
  yellow: 'amarillo',
  orange: 'naranja',
}
const CORRECT_FEEDBACK_DURATION = 600

interface MathEggsGameProps {
  onHome?: () => void
  onDinosaurGames?: () => void
  createRound?: () => MathEggsRound
}

export function MathEggsGame({ onHome = () => {}, onDinosaurGames = () => {}, createRound: makeRound = createRound }: MathEggsGameProps) {
  const [state, setState] = useState(() => createGameState(makeRound()))
  const [settings, setSettings] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [wrongValue, setWrongValue] = useState<number | null>(null)
  const [correctValue, setCorrectValue] = useState<number | null>(null)
  const feedbackTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => {
    if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current)
  }, [])

  const restart = () => {
    if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current)
    feedbackTimer.current = undefined
    setState(createGameState(makeRound()))
    setSettings(false)
    setCelebrate(false)
    setWrongValue(null)
    setCorrectValue(null)
  }

  const answer = (value: number) => {
    if (correctValue !== null) return
    const result = answerCurrentColor(state, value)
    if (!result.accepted) {
      setWrongValue(value)
      if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current)
      feedbackTimer.current = window.setTimeout(() => setWrongValue(null), 450)
      return
    }

    setWrongValue(null)
    setCorrectValue(value)
    feedbackTimer.current = window.setTimeout(() => {
      setState(result.state)
      setCorrectValue(null)
      if (result.state.completed) setCelebrate(true)
    }, CORRECT_FEEDBACK_DURATION)
  }

  const activeColor = state.color
  return <main className="game-shell math-eggs-game">
    <GameHeader title="Huevos prehistóricos" onHome={onHome} onDinosaurGames={onDinosaurGames} onRestart={restart} onSettings={() => setSettings(true)} />
    <section className="math-eggs-board" aria-label="Huevos para contar">
      <ul className="math-egg-grid" aria-label="Huevos para contar">
        {state.round.eggs.map((egg) => <li key={egg.id} className={`math-egg egg-${egg.color}`} aria-label={`Huevo ${EGG_LABELS[egg.color]}`} />)}
      </ul>
    </section>
    <section className="math-eggs-answer-area" aria-label="Contar huevos">
      <div className="math-eggs-color-card">
        <span className={`math-egg question-egg egg-${activeColor}`} aria-hidden="true" />
        <p>Cuenta los huevos<br /><strong>{COLOR_LABELS[activeColor]}</strong></p>
      </div>
      <div className="math-eggs-question">
        {!state.completed && <p className="math-eggs-prompt" aria-live="polite">¿Cuántos huevos {COLOR_LABELS[activeColor]} hay?</p>}
        <p className="math-eggs-feedback" role="status">{state.completed ? '¡Has contado todos los huevos!' : correctValue !== null ? '¡Correcto!' : ''}</p>
        {!state.completed && <div className="math-eggs-options" role="group" aria-label="Respuestas posibles">
          {state.round.options[activeColor].map((option) => <button key={option} className={`math-eggs-option ${wrongValue === option ? 'wrong' : ''} ${correctValue === option ? 'correct' : ''}`} disabled={correctValue !== null} onClick={() => answer(option)}>{option}</button>)}
        </div>}
      </div>
      <ol className="math-eggs-progress" aria-label="Colores por contar">
        {state.round.colors.map((color) => {
          const selectedCount = state.selected[color]
          return <li key={color} className={selectedCount === null ? '' : 'done'}>
            <span className={`math-egg progress-egg egg-${color}`} aria-hidden="true">{selectedCount ?? ''}</span>
            <span className="sr-only">Huevos {COLOR_LABELS[color]}{selectedCount === null ? '' : `: ${selectedCount}`}</span>
          </li>
        })}
      </ol>
    </section>
    {settings && <Modal title="Configuración" onClose={() => setSettings(false)}><p>Panel preparado para futuras opciones de aula.</p><button className="primary-button" onClick={restart}>Reiniciar partida</button></Modal>}
    {celebrate && <Modal title="🎉 ¡MUY BIEN! 🎉" onClose={() => setCelebrate(false)}><p>¡Has contado todos los huevos de colores!</p><button className="primary-button" onClick={restart}>Jugar otra vez</button></Modal>}
  </main>
}
