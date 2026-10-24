import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Check, Hand, OctagonAlert, Pointer } from 'lucide-react'
import { useState } from 'react'
import type { FriendshipSignal, FriendshipSituation } from '../../data/friendship-situations'
import { FRIENDSHIP_SITUATIONS } from '../../data/friendship-situations'
import { GameHeader } from '../../components/GameHeader'
import { Modal } from '../../components/Modal'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import { classifyCurrentCard, createGameState, selectRound } from './game-state'

const signalDetails: Record<FriendshipSignal, { title: string; icon: typeof Check }> = {
  green: { title: 'ESTÁ BIEN', icon: Check },
  yellow: { title: 'NO ME GUSTA', icon: Hand },
  red: { title: 'TENGO QUE PARAR', icon: OctagonAlert },
}

function Card({ situation, active = false }: { situation: FriendshipSituation; active?: boolean }) {
  const draggable = useDraggable({ id: situation.id, disabled: !active })
  return <article ref={draggable.setNodeRef} {...draggable.listeners} {...draggable.attributes} data-testid={active ? 'active-situation-card' : undefined} className={`situation-card ${active ? 'active-card' : ''}`} style={active ? { transform: CSS.Translate.toString(draggable.transform) } : undefined}><img className="situation-image" src={situation.image} alt={`Ilustración: ${situation.text}`} /><strong>{situation.text}</strong></article>
}

function Zone({ signal, situations }: { signal: FriendshipSignal; situations: readonly FriendshipSituation[] }) {
  const drop = useDroppable({ id: signal })
  const { title, icon: Icon } = signalDetails[signal]
  return <section ref={drop.setNodeRef} className={`signal-zone signal-${signal} ${drop.isOver ? 'over' : ''}`} aria-label={title}>
    <h2><Icon aria-hidden="true" /> {title}</h2><div className="classified">{situations.map(situation => <Card key={situation.id} situation={situation} />)}</div>
  </section>
}

export function FriendshipSignalsGame({ onHome = () => {} }: { onHome?: () => void }) {
  const [state, setState] = useState(() => createGameState(selectRound(FRIENDSHIP_SITUATIONS)))
  const [settings, setSettings] = useState(false); const [celebrate, setCelebrate] = useState(false); const [wrong, setWrong] = useState(false)
  const current = state.deck[0]; const total = state.deck.length + Object.values(state.classified).flat().length
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const restart = () => { setState(createGameState(selectRound(FRIENDSHIP_SITUATIONS))); setCelebrate(false); setSettings(false) }
  const classify = (target: FriendshipSignal) => { const result = classifyCurrentCard(state, target); if (!result.accepted) { setWrong(true); window.setTimeout(() => setWrong(false), 450); return }; setState(result.state); if (result.state.completed) window.setTimeout(() => setCelebrate(true), 350) }
  return <main className="game-shell friendship-game"><GameHeader title="Señales de mis amistades" onHome={onHome} onRestart={restart} onSettings={() => setSettings(true)} />
    <DndContext sensors={sensors} onDragEnd={({ over }) => { if (over?.id === 'green' || over?.id === 'yellow' || over?.id === 'red') classify(over.id) }}>
      <div className="signal-zones"><Zone signal="green" situations={state.classified.green} /><Zone signal="yellow" situations={state.classified.yellow} /><Zone signal="red" situations={state.classified.red} /></div>
      <div className="game-bottom"><aside className="drag-instruction" aria-label="Instrucciones de juego"><Pointer aria-hidden="true" /><span>ARRASTRA<br />LA TARJETA</span></aside><section className="deck" aria-label="Mazo de situaciones"><div className="card-back back-one"/><div className="card-back back-two"/>{current && <div className={`deck-card ${wrong ? 'wrong' : ''}`}><Card situation={current} active /></div>}</section><ProgressIndicator current={total - state.deck.length} total={total} label="situaciones clasificadas" /></div>
    </DndContext>
    {settings && <Modal title="Configuración" onClose={() => setSettings(false)}><p>Panel preparado para futuras opciones de aula.</p><button className="primary-button" onClick={restart}>Reiniciar partida</button></Modal>}
    {celebrate && <Modal title="🎉 ¡MUY BIEN! 🎉" onClose={() => setCelebrate(false)}><p>¡Has clasificado todas las situaciones!</p><button className="primary-button" onClick={restart}>Jugar otra vez</button></Modal>}
  </main>
}
