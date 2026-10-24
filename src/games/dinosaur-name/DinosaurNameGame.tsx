import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Pointer } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { GameHeader } from '../../components/GameHeader'
import { Modal } from '../../components/Modal'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import { DINOSAURS, type Dinosaur } from '../../data/dinosaurs'
import { createGameState, matchCurrentName, selectRound } from './game-state'

function PhotoZone({ dinosaur, resolved }: { dinosaur: Dinosaur; resolved: boolean }) {
  const drop = useDroppable({ id: dinosaur.id })
  return <article ref={drop.setNodeRef} data-testid="dinosaur-photo-zone" className={`dinosaur-photo-zone ${drop.isOver ? 'over' : ''} ${resolved ? 'resolved' : ''}`} aria-label={`Fotografía de ${dinosaur.name}`}>
    <img src={dinosaur.image} alt={`Fotografía de ${dinosaur.name}`} />
    {resolved && <span data-testid={`resolved-${dinosaur.id}`} className="resolved-badge">✓ ¡Correcto!</span>}
  </article>
}

function NameCard({ dinosaur, wrong }: { dinosaur: Dinosaur; wrong: boolean }) {
  const draggable = useDraggable({ id: 'dinosaur-name' })
  return <article ref={draggable.setNodeRef} {...draggable.listeners} {...draggable.attributes} data-testid="active-dinosaur-name" className={`dinosaur-name-card ${wrong ? 'wrong' : ''}`} style={{ transform: CSS.Translate.toString(draggable.transform) }}>
    {dinosaur.name}
  </article>
}

export function DinosaurNameGame({ onHome = () => {}, onDinosaurGames = () => {} }: { onHome?: () => void; onDinosaurGames?: () => void }) {
  const [state, setState] = useState(() => createGameState(selectRound(DINOSAURS)))
  const [settings, setSettings] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [wrong, setWrong] = useState(false)
  const celebrationTimer = useRef<number | undefined>(undefined)
  const current = state.pending[0]
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  useEffect(() => () => {
    if (celebrationTimer.current !== undefined) window.clearTimeout(celebrationTimer.current)
  }, [])

  const restart = () => {
    if (celebrationTimer.current !== undefined) window.clearTimeout(celebrationTimer.current)
    celebrationTimer.current = undefined
    setState(createGameState(selectRound(DINOSAURS)))
    setCelebrate(false)
    setSettings(false)
    setWrong(false)
  }
  const match = (dinosaurId: string) => {
    const result = matchCurrentName(state, dinosaurId)
    if (!result.accepted) {
      setWrong(true)
      window.setTimeout(() => setWrong(false), 450)
      return
    }
    setState(result.state)
    if (result.state.completed) celebrationTimer.current = window.setTimeout(() => setCelebrate(true), 350)
  }

  return <main className="game-shell dinosaur-name-game">
    <GameHeader title="¿Cómo se llama el dinosaurio?" onHome={onHome} onDinosaurGames={onDinosaurGames} onRestart={restart} onSettings={() => setSettings(true)} />
    <DndContext sensors={sensors} onDragEnd={({ over }) => { if (typeof over?.id === 'string') match(over.id) }}>
      <section className="dinosaur-photo-grid" aria-label="Fotografías de dinosaurios">
        {state.round.map((dinosaur) => <PhotoZone key={dinosaur.id} dinosaur={dinosaur} resolved={state.resolvedIds.includes(dinosaur.id)} />)}
      </section>
      <div className="name-game-bottom">
        <aside className="drag-instruction" aria-label="Instrucciones de juego"><Pointer aria-hidden="true" /><span>ARRASTRA<br />EL NOMBRE</span></aside>
        <section className="name-deck" aria-label="Nombre del dinosaurio">
          {current && <NameCard dinosaur={current} wrong={wrong} />}
        </section>
        <ProgressIndicator current={state.resolvedIds.length} total={state.round.length} label="nombres resueltos" />
      </div>
    </DndContext>
    {settings && <Modal title="Configuración" onClose={() => setSettings(false)}><p>Panel preparado para futuras opciones de aula.</p><button className="primary-button" onClick={restart}>Reiniciar partida</button></Modal>}
    {celebrate && <Modal title="🎉 ¡MUY BIEN! 🎉" onClose={() => setCelebrate(false)}><p>¡Has relacionado todos los dinosaurios con su nombre!</p><button className="primary-button" onClick={restart}>Jugar otra vez</button></Modal>}
  </main>
}
