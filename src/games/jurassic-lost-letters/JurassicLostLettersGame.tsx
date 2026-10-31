import { useEffect, useRef, useState } from 'react'

import { GameHeader } from '../../components/GameHeader'
import { Modal } from '../../components/Modal'
import { DINOSAURS } from '../../data/dinosaurs'
import { answerCurrentLetter, createGameState, createRound, maskedName, type Difficulty, type LostLetterPuzzle } from './game-state'

const CORRECT_FEEDBACK_DURATION = 2_000

interface JurassicLostLettersGameProps { onHome?: () => void; onDinosaurGames?: () => void; createRound?: (difficulty: Difficulty) => readonly LostLetterPuzzle[] }

function LostLettersWord({ puzzle, revealedCount, showNextAnswer }: { puzzle: LostLetterPuzzle; revealedCount: number; showNextAnswer: boolean }) {
  const visibleCount = revealedCount + (showNextAnswer ? 1 : 0)
  const word = maskedName(puzzle, visibleCount)
  const complete = visibleCount === puzzle.missingIndexes.length
  const highlightedIndex = showNextAnswer ? puzzle.missingIndexes[revealedCount] : undefined
  return <p className="lost-letters-word" aria-label={`Nombre ${complete ? 'completo' : 'incompleto'}: ${word}`}>
    {[...word].map((character, index) => <span key={`${character}-${index}`} className={index === highlightedIndex ? 'revealed-letter' : ''}>{character}</span>)}
  </p>
}

export function JurassicLostLettersGame({ onHome = () => {}, onDinosaurGames = () => {}, createRound: makeRound = (difficulty) => createRound(DINOSAURS, difficulty) }: JurassicLostLettersGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [state, setState] = useState(() => createGameState(makeRound('easy')))
  const [settings, setSettings] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [wrongLetter, setWrongLetter] = useState<string | null>(null)
  const [correctLetter, setCorrectLetter] = useState<string | null>(null)
  const feedbackTimer = useRef<number | undefined>(undefined)
  const current = state.puzzles[state.currentIndex]

  useEffect(() => () => { if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current) }, [])

  const restart = (nextDifficulty = difficulty) => {
    if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current)
    feedbackTimer.current = undefined
    setDifficulty(nextDifficulty)
    setState(createGameState(makeRound(nextDifficulty)))
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
    <GameHeader title="Letras jurásicas" onHome={onHome} onDinosaurGames={onDinosaurGames} onRestart={restart} onSettings={() => setSettings(true)} />
    {current && <section className="lost-letters-board" aria-label="Adivina la letra que falta">
      <article className="lost-letters-dinosaur"><img src={current.dinosaur.image} alt={current.dinosaur.name} /></article>
      <div className="lost-letters-prompt"><p>¿QUÉ LETRA FALTA?</p><LostLettersWord puzzle={current} revealedCount={state.revealedCount} showNextAnswer={correctLetter !== null} /><p className="lost-letters-feedback" role="status">{correctLetter ? '¡Correcto!' : ''}</p></div>
    </section>}
    {!state.completed && current && <section className="lost-letters-options" role="group" aria-label="Elige una letra">
      {current.options[state.revealedCount].map((letter) => <button key={letter} className={`lost-letter-option ${wrongLetter === letter ? 'wrong' : ''} ${correctLetter === letter ? 'correct' : ''}`} disabled={correctLetter !== null} onClick={() => chooseLetter(letter)}>{letter}</button>)}
    </section>}
    <p className="lost-letters-progress" aria-live="polite">{Math.min(state.currentIndex + 1, state.puzzles.length)} / {state.puzzles.length} palabras</p>
    {settings && <Modal title="Configuración" onClose={() => setSettings(false)}><p>Elige el nivel de dificultad.</p><div className="difficulty-options" role="group" aria-label="Nivel de dificultad">
      <button className={difficulty === 'easy' ? 'selected' : ''} aria-pressed={difficulty === 'easy'} onClick={() => restart('easy')}><strong>Fácil</strong><small>Falta una letra.</small></button>
      <button className={difficulty === 'medium' ? 'selected' : ''} aria-pressed={difficulty === 'medium'} onClick={() => restart('medium')}><strong>Medio</strong><small>Falta la mitad de las letras.</small></button>
      <button className={difficulty === 'hard' ? 'selected' : ''} aria-pressed={difficulty === 'hard'} onClick={() => restart('hard')}><strong>Difícil</strong><small>Falta el 80% de las letras.</small></button>
    </div></Modal>}
    {celebrate && <Modal title="🎉 ¡MUY BIEN! 🎉" onClose={() => setCelebrate(false)}><p>¡Has completado todas las palabras jurásicas!</p><button className="primary-button" onClick={() => restart()}>Jugar otra vez</button></Modal>}
  </main>
}
