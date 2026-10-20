import { useEffect, useRef, useState } from 'react'

import { GameHeader } from '../../components/GameHeader'
import { Modal } from '../../components/Modal'
import { DINOSAURS } from '../../data/dinosaurs'
import {
  answerCurrentStep,
  createGameState,
  createRound,
  type JurassicSumsRound,
} from './game-state'

const STEP_INDEX = { left: 0, right: 1, total: 2 } as const
const CORRECT_FEEDBACK_DURATION = 600

interface JurassicSumsGameProps {
  onHome?: () => void
  onDinosaurGames?: () => void
  createRound?: () => JurassicSumsRound
}

function promptFor(step: keyof typeof STEP_INDEX) {
  if (step === 'left') return '¿Cuántos hay en el primer grupo?'
  if (step === 'right') return '¿Cuántos hay en el segundo grupo?'
  return '¿Cuánto suman?'
}

function DinosaurGroup({ position, dinosaurs, active }: { position: 'primer' | 'segundo'; dinosaurs: JurassicSumsRound['leftGroup']; active: boolean }) {
  return <section className={`sum-dinosaur-group ${active ? 'active' : ''}`} aria-label={`${position} grupo de dinosaurios`}>
    <ul className="sum-dinosaur-list" aria-label={`${position} grupo de dinosaurios`}>
      {dinosaurs.map((dinosaur, index) => <li key={`${dinosaur.id}-${index}`}><img src={dinosaur.image} alt={`Dinosaurio ${index + 1}: ${dinosaur.name}`} /></li>)}
    </ul>
  </section>
}

export function JurassicSumsGame({ onHome = () => {}, onDinosaurGames = () => {}, createRound: makeRound = () => createRound(DINOSAURS) }: JurassicSumsGameProps) {
  const [state, setState] = useState(() => createGameState(makeRound()))
  const [settings, setSettings] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [wrongValues, setWrongValues] = useState<number[]>([])
  const [correctValue, setCorrectValue] = useState<number | null>(null)
  const feedbackTimer = useRef<number | undefined>(undefined)
  const activeIndex = STEP_INDEX[state.step]
  const [left, right, total] = state.selected
  const equation = `${left ?? '?'} + ${right ?? '?'} = ${total ?? '?'}`

  useEffect(() => () => {
    if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current)
  }, [])

  const restart = () => {
    if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current)
    feedbackTimer.current = undefined
    setState(createGameState(makeRound()))
    setSettings(false)
    setCelebrate(false)
    setWrongValues([])
    setCorrectValue(null)
  }

  const answer = (value: number) => {
    if (correctValue !== null) return

    const result = answerCurrentStep(state, value)
    if (!result.accepted) {
      setWrongValues((values) => values.includes(value) ? values : [...values, value])
      return
    }

    setWrongValues([])
    setCorrectValue(value)
    feedbackTimer.current = window.setTimeout(() => {
      setState(result.state)
      setCorrectValue(null)
      if (result.state.completed) setCelebrate(true)
    }, CORRECT_FEEDBACK_DURATION)
  }

  return <main className="game-shell jurassic-sums-game">
    <GameHeader title="Sumas jurásicas" onHome={onHome} onDinosaurGames={onDinosaurGames} onRestart={restart} onSettings={() => setSettings(true)} />
    <section className="sum-board" aria-label="Suma de dinosaurios">
      <DinosaurGroup position="primer" dinosaurs={state.round.leftGroup} active={state.step === 'left' || state.step === 'total'} />
      <div className="sum-symbols" aria-hidden="true"><span>+</span></div>
      <DinosaurGroup position="segundo" dinosaurs={state.round.rightGroup} active={state.step === 'right' || state.step === 'total'} />
    </section>
    <section className="sum-answer-area" aria-label="Resolver la suma">
      <p className={`sum-equation ${state.step === 'total' ? 'active' : ''}`} aria-label={`Ecuación: ${equation}`}>{equation}</p>
      {!state.completed && <p className="sum-prompt" aria-live="polite">{promptFor(state.step)}</p>}
      <p className="sum-feedback" role="status">{state.completed ? '¡Suma completada!' : correctValue !== null ? '¡Correcto!' : ''}</p>
      {!state.completed && <div className="sum-options" role="group" aria-label="Respuestas posibles">
        {state.round.options[activeIndex].map((option) => <button key={option} className={`sum-option egg-option ${wrongValues.includes(option) ? 'wrong cracked' : ''} ${correctValue === option ? 'correct' : ''}`} disabled={correctValue !== null} onClick={() => answer(option)}>{option}</button>)}
      </div>}
    </section>
    {settings && <Modal title="Configuración" onClose={() => setSettings(false)}><p>Panel preparado para futuras opciones de aula.</p><button className="primary-button" onClick={restart}>Reiniciar partida</button></Modal>}
    {celebrate && <Modal title="🎉 ¡Muy bien! 🎉" onClose={() => setCelebrate(false)}><p>¡Has contado los dinosaurios y resuelto la suma!</p><button className="primary-button" onClick={restart}>Jugar otra vez</button></Modal>}
  </main>
}
