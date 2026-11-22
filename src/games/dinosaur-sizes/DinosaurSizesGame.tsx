import { DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

import { GameHeader } from '../../components/GameHeader'
import { Modal } from '../../components/Modal'
import { DINOSAURS } from '../../data/dinosaurs'
import { createGameState, createRound, placeDinosaurSize, type DinosaurSizeCard, type DinosaurSizesRound, type DinosaurSizesState } from './game-state'

interface DinosaurSizesGameProps {
  onHome?: () => void
  onDinosaurGames?: () => void
  createRound?: () => DinosaurSizesRound
}

const BOARD_CELLS = [
  { column: '1 / span 3', row: '1 / span 2' },
  { column: '5 / span 3', row: '1 / span 2' },
  { column: '9 / span 3', row: '1 / span 2' },
  { column: '1 / span 3', row: '3 / span 2' },
  { column: '4 / span 3', row: '3 / span 2' },
  { column: '7 / span 3', row: '3 / span 2' },
  { column: '10 / span 3', row: '3 / span 2' },
] as const

function SizeDinosaur({ card, image, name }: { card: DinosaurSizeCard; image: string; name: string }) {
  const sizeWidths = [14, 23, 35, 48, 61, 75, 90]
  const width = `${sizeWidths[card.size - 1]}%`
  return <img src={image} alt={`${name}, tamaño ${card.size}`} style={{ width }} />
}

function DraggableDinosaur({ card, image, name, selected, dragging, onSelect }: { card: DinosaurSizeCard; image: string; name: string; selected: boolean; dragging: boolean; onSelect: () => void }) {
  const draggable = useDraggable({ id: card.id })
  const cell = BOARD_CELLS[card.boardPosition]
  return <button ref={draggable.setNodeRef} {...draggable.listeners} {...draggable.attributes} className={`size-dinosaur-card ${selected ? 'selected' : ''} ${dragging ? 'dragging' : ''}`} style={{ transform: CSS.Translate.toString(draggable.transform), translate: `${card.horizontalOffset}% ${card.verticalOffset}%`, gridColumn: cell.column, gridRow: cell.row }} onClick={onSelect} aria-label={`Dinosaurio para ordenar: ${name}, tamaño ${card.size}`}>
    <SizeDinosaur card={card} image={image} name={name} />
  </button>
}

function DragPreview({ card, image, name }: { card: DinosaurSizeCard; image: string; name: string }) {
  return <div className="size-dinosaur-drag-overlay"><SizeDinosaur card={card} image={image} name={name} /></div>
}

function SizeSlot({ slot, card, image, name, count, selectedCardId, onPlace }: { slot: number; card?: DinosaurSizeCard; image: string; name: string; count: number; selectedCardId: string | null; onPlace: (slot: number, cardId: string) => void }) {
  const droppable = useDroppable({ id: `size-slot-${slot}` })
  const label = slot === 0 ? 'Más pequeño' : slot === count - 1 ? 'Más grande' : `Posición ${slot + 1}`
  if (card) return <div className="size-slot filled" aria-label={`${label}: ${name}`}><SizeDinosaur card={card} image={image} name={name} /><span>{label}</span></div>

  return <button ref={droppable.setNodeRef} className={`size-slot ${droppable.isOver ? 'over' : ''}`} onClick={() => selectedCardId && onPlace(slot, selectedCardId)} aria-label={`Hueco ${label}`}>
    <span>{label}</span>
  </button>
}

export function DinosaurSizesGame({ onHome = () => {}, onDinosaurGames = () => {}, createRound: makeRound = () => createRound(DINOSAURS) }: DinosaurSizesGameProps) {
  const [state, setState] = useState<DinosaurSizesState>(() => createGameState(makeRound()))
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null)
  const [wrongSlot, setWrongSlot] = useState<number | null>(null)
  const [settings, setSettings] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const restart = () => {
    setState(createGameState(makeRound()))
    setSelectedCardId(null)
    setDraggingCardId(null)
    setWrongSlot(null)
    setSettings(false)
    setCelebrate(false)
  }

  const place = (slot: number, cardId: string) => {
    const result = placeDinosaurSize(state, slot, cardId)
    if (!result.accepted) {
      setWrongSlot(slot)
      window.setTimeout(() => setWrongSlot(null), 450)
      return
    }
    setState(result.state)
    setSelectedCardId(null)
    if (result.state.completed) window.setTimeout(() => setCelebrate(true), 350)
  }

  const placedCards = state.placed.map((cardId) => state.round.cards.find((card) => card.id === cardId))
  const availableCards = state.round.cards.filter((card) => !state.placed.includes(card.id))
  const { dinosaur, sizeCount } = state.round
  const draggingCard = state.round.cards.find((card) => card.id === draggingCardId)

  return <main className="game-shell dinosaur-sizes-game">
    <GameHeader title="Tamaños jurásicos" onHome={onHome} onDinosaurGames={onDinosaurGames} onRestart={restart} onSettings={() => setSettings(true)} />
    <DndContext sensors={sensors} onDragStart={({ active }) => setDraggingCardId(typeof active.id === 'string' ? active.id : null)} onDragCancel={() => setDraggingCardId(null)} onDragEnd={({ active, over }) => {
      const slotMatch = typeof over?.id === 'string' ? /^size-slot-(\d+)$/.exec(over.id) : null
      if (typeof active.id === 'string' && slotMatch) place(Number(slotMatch[1]), active.id)
      setDraggingCardId(null)
    }}>
      <section className="sizes-game-content" aria-label="Ordena los dinosaurios por tamaño">
        <p className="sizes-instruction">ORDENA DE MÁS PEQUEÑO A MÁS GRANDE</p>
        <section className="sizes-dinosaur-area" aria-label={`Dinosaurios ${dinosaur.name} para ordenar`}>
          {availableCards.map((card) => <DraggableDinosaur key={card.id} card={card} image={dinosaur.image} name={dinosaur.name} selected={selectedCardId === card.id} dragging={draggingCardId === card.id} onSelect={() => setSelectedCardId(card.id)} />)}
        </section>
        <section className="sizes-order-area" aria-label="Fila para ordenar por tamaño">
          <div className="size-slots" style={{ gridTemplateColumns: `repeat(${sizeCount}, minmax(0, 1fr))` }}>
            {Array.from({ length: sizeCount }, (_, slot) => <div key={slot} className={wrongSlot === slot ? 'wrong' : ''}><SizeSlot slot={slot} card={placedCards[slot]} image={dinosaur.image} name={dinosaur.name} count={sizeCount} selectedCardId={selectedCardId} onPlace={place} /></div>)}
          </div>
          <p className="sizes-progress" aria-live="polite">{state.placed.filter(Boolean).length} / {sizeCount} dinosaurios ordenados</p>
        </section>
      </section>
      <DragOverlay dropAnimation={null}>{draggingCard && <DragPreview card={draggingCard} image={dinosaur.image} name={dinosaur.name} />}</DragOverlay>
    </DndContext>
    {settings && <Modal title="Configuración" onClose={() => setSettings(false)}><p>Panel preparado para futuras opciones de aula.</p><button className="primary-button" onClick={restart}>Reiniciar partida</button></Modal>}
    {celebrate && <Modal title="¡Muy bien!" onClose={() => setCelebrate(false)}><p>¡Has ordenado todos los dinosaurios de más pequeño a más grande!</p><button className="primary-button" onClick={restart}>Jugar otra vez</button></Modal>}
  </main>
}
