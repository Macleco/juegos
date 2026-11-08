import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

import { GameHeader } from '../../components/GameHeader'
import { Modal } from '../../components/Modal'
import { DINOSAURS, type Dinosaur } from '../../data/dinosaurs'
import { createGameState, createRound, placeDinosaur, type JurassicSeries, type JurassicSeriesState } from './game-state'

interface JurassicSeriesGameProps {
  onHome?: () => void
  onDinosaurGames?: () => void
  createRound?: () => readonly JurassicSeries[]
}

function SeriesDinosaur({ dinosaur }: { dinosaur: Dinosaur }) {
  return <img src={dinosaur.image} alt={dinosaur.name} />
}

function AnswerDinosaur({ dinosaur, selected, onSelect }: { dinosaur: Dinosaur; selected: boolean; onSelect: () => void }) {
  const draggable = useDraggable({ id: dinosaur.id })
  return <button ref={draggable.setNodeRef} {...draggable.listeners} {...draggable.attributes} className={`series-answer-card ${selected ? 'selected' : ''}`} style={{ transform: CSS.Translate.toString(draggable.transform) }} onClick={onSelect} aria-label={`Dinosaurio para arrastrar: ${dinosaur.name}`}>
    <SeriesDinosaur dinosaur={dinosaur} />
  </button>
}

function EmptySlot({ series, placedDinosaur, selectedDinosaurId, onPlace }: { series: JurassicSeries; placedDinosaur?: Dinosaur; selectedDinosaurId: string | null; onPlace: (seriesId: string, dinosaurId: string) => void }) {
  const drop = useDroppable({ id: series.id })
  if (placedDinosaur) return <div className="series-slot filled"><SeriesDinosaur dinosaur={placedDinosaur} /></div>

  return <button ref={drop.setNodeRef} className={`series-slot ${drop.isOver ? 'over' : ''}`} onClick={() => selectedDinosaurId && onPlace(series.id, selectedDinosaurId)} aria-label={`Hueco de la serie ${series.id.split('-')[1]}`}>
    <span aria-hidden="true">?</span>
  </button>
}

export function JurassicSeriesGame({ onHome = () => {}, onDinosaurGames = () => {}, createRound: makeRound = () => createRound(DINOSAURS) }: JurassicSeriesGameProps) {
  const [state, setState] = useState<JurassicSeriesState>(() => createGameState(makeRound()))
  const [selectedDinosaurId, setSelectedDinosaurId] = useState<string | null>(null)
  const [wrongSeriesId, setWrongSeriesId] = useState<string | null>(null)
  const [settings, setSettings] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const restart = () => {
    setState(createGameState(makeRound()))
    setSelectedDinosaurId(null)
    setWrongSeriesId(null)
    setSettings(false)
    setCelebrate(false)
  }

  const place = (seriesId: string, dinosaurId: string) => {
    const result = placeDinosaur(state, seriesId, dinosaurId)
    if (!result.accepted) {
      setWrongSeriesId(seriesId)
      window.setTimeout(() => setWrongSeriesId(null), 450)
      return
    }
    setState(result.state)
    setSelectedDinosaurId(null)
    if (result.state.completed) window.setTimeout(() => setCelebrate(true), 350)
  }

  const availableAnswers = state.round.filter((_, index) => state.placed[index] === null).map((series) => series.answer)

  return <main className="game-shell jurassic-series-game">
    <GameHeader title="Series jurásicas" onHome={onHome} onDinosaurGames={onDinosaurGames} onRestart={restart} onSettings={() => setSettings(true)} />
    <DndContext sensors={sensors} onDragEnd={({ active, over }) => { if (typeof active.id === 'string' && typeof over?.id === 'string') place(over.id, active.id) }}>
      <section className="series-game-content" aria-label="Completa las series de dinosaurios">
        <p className="series-instruction">¿QUÉ DINOSAURIO VIENE DESPUÉS?</p>
        <div className="series-board">
          <div className="series-list">
            {state.round.map((series, index) => {
              const filledId = state.placed[index]
              const filledDinosaur = filledId ? series.answer : undefined
              return <section key={series.id} className={`dinosaur-series ${wrongSeriesId === series.id ? 'wrong' : ''}`} aria-label={`Serie ${index + 1}`}>
                {series.pattern.map((dinosaur, dinosaurIndex) => <SeriesDinosaur key={`${dinosaur.id}-${dinosaurIndex}`} dinosaur={dinosaur} />)}
                <EmptySlot series={series} placedDinosaur={filledDinosaur} selectedDinosaurId={selectedDinosaurId} onPlace={place} />
              </section>
            })}
          </div>
          <aside className="series-answers" aria-label="Dinosaurios para completar las series">
            {availableAnswers.map((dinosaur) => <AnswerDinosaur key={dinosaur.id} dinosaur={dinosaur} selected={selectedDinosaurId === dinosaur.id} onSelect={() => setSelectedDinosaurId(dinosaur.id)} />)}
          </aside>
        </div>
        <p className="series-progress" aria-live="polite">{state.placed.filter(Boolean).length} / {state.round.length} series completadas</p>
      </section>
    </DndContext>
    {settings && <Modal title="Configuración" onClose={() => setSettings(false)}><p>Panel preparado para futuras opciones de aula.</p><button className="primary-button" onClick={restart}>Reiniciar partida</button></Modal>}
    {celebrate && <Modal title="🎉 ¡MUY BIEN! 🎉" onClose={() => setCelebrate(false)}><p>¡Has completado todas las series jurásicas!</p><button className="primary-button" onClick={restart}>Jugar otra vez</button></Modal>}
  </main>
}
