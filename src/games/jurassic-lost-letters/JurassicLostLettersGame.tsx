import { useEffect, useRef, useState } from 'react'

import { GameHeader } from '../../components/GameHeader'
import { Modal } from '../../components/Modal'
import { DINOSAURS } from '../../data/dinosaurs'
import { answerCurrentLetter, createGameState, createRound, maskedName, type LostLetterPuzzle } from './game-state'

const CORRECT_FEEDBACK_DURATION = 2_000

interface JurassicLostLettersGameProps { onHome?: () => void; onDinosaurGames?: () => void; createRound?: () => readonly LostLetterPuzzle[] }

function LostLettersWord({ puzzle, showAnswer }: { puzzle: LostLetterPuzzle; showAnswer: boolean }) {
  const word = showAnswer ? puzzle.dinosaur.name.toLocaleUpperCase('es-ES') : maskedName(puzzle)
  return <p className="lost-letters-word" aria-label={`Nombre ${showAnswer ? 'completo' : 'incompleto'}: ${word}`}>
    {[...word].map((character, index) => <span key={`${character}-${index}`} className={showAnswer && index === puzzle.missingIndex ? 'revealed-letter' : ''}>{character}</span>)}
  </p>
}

export function JurassicLostLettersGame({ onHome = () => {}, onDinosaurGames = () => {}, createRound: makeRound = () => createRound(DINOSAURS) }: JurassicLostLettersGameProps) {
  const [state, setState] = useState(() => createGameState(makeRound()))
  const [settings, setSettings] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [wrongLetter, setWrongLetter] = useState<string | null>(null)
  const [correctLetter, setCorrectLetter] = useState<string | null>(null)
  const feedbackTimer = useRef<number | undefined>(undefined)
  const current = state.puzzles[state.currentIndex]

  useEffect(() => () => { if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current) }, [])

  const restart = () => {
    if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current)
    feedbackTimer.current = undefined
    setState(createGameState(makeRound()))
    setSettings(false); setCelebrate(false); setWrongLetter(null); setCorrectLetter(null)
  }
  const chooseLetter = (letter: string) => {
    if (correctLetter !== null) return
    const result = answerCurrentLetter(state, letter)
    if (!result.accepted) {
      setWrongLetter(letter)
      if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current)
      feedbackTimer.current = window.setTimeout(() => setWrongLetter(null), 450)
      return
    }
    setWrongLetter(null); setCorrectLetter(letter)
    feedbackTimer.current = window.setTimeout(() => {
      setState(result.state); setCorrectLetter(null)
      if (result.state.completed) setCelebrate(true)
    }, CORRECT_FEEDBACK_DURATION)
  }

  return <main className="game-shell jurassic-lost-letters-game">
    <GameHeader title="Letras perdidas del Jurásico" onHome={onHome} onDinosaurGames={onDinosaurGames} onRestart={restart} onSettings={() => setSettings(true)} />
    {current && <section className="lost-letters-board" aria-label="Adivina la letra que falta">
      <article className="lost-letters-dinosaur"><img src={current.dinosaur.image} alt={current.dinosaur.name} /></article>
      <div className="lost-letters-prompt"><p>¿QUÉ LETRA FALTA?</p><LostLettersWord puzzle={current} showAnswer={correctLetter !== null} /><p className="lost-letters-feedback" role="status">{correctLetter ? '¡Correcto!' : ''}</p></div>
    </section>}
    {!state.completed && current && <section className="lost-letters-options" role="group" aria-label="Elige una letra">
      {current.options.map((letter) => <button key={letter} className={`lost-letter-option ${wrongLetter === letter ? 'wrong' : ''} ${correctLetter === letter ? 'correct' : ''}`} disabled={correctLetter !== null} onClick={() => chooseLetter(letter)}>{letter}</button>)}
    </section>}
    <p className="lost-letters-progress" aria-live="polite">{Math.min(state.currentIndex + 1, state.puzzles.length)} / {state.puzzles.length} palabras</p>
    {settings && <Modal title="Configuración" onClose={() => setSettings(false)}><p>Panel preparado para futuras opciones de aula.</p><button className="primary-button" onClick={restart}>Reiniciar partida</button></Modal>}
    {celebrate && <Modal title="🎉 ¡MUY BIEN! 🎉" onClose={() => setCelebrate(false)}><p>¡Has completado todas las palabras jurásicas!</p><button className="primary-button" onClick={restart}>Jugar otra vez</button></Modal>}
  </main>
}
