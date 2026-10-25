import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Pointer } from 'lucide-react'
import { useState } from 'react'

import { GameHeader } from '../../components/GameHeader'
import { Modal } from '../../components/Modal'
import { ProgressIndicator } from '../../components/ProgressIndicator'
import { JURASSIC_SYLLABLE_CARDS, type JurassicSyllableCard, type SyllableCount } from '../../data/jurassic-syllables'
import { classifyCurrentCard, createGameState, shuffle } from './game-state'

const SYLLABLE_GROUPS: readonly SyllableCount[] = [2, 3, 4]

function SyllableCard({ card, active = false }: { card: JurassicSyllableCard; active?: boolean }) {
  const draggable = useDraggable({ id: card.id, disabled: !active })
  return <article ref={draggable.setNodeRef} {...draggable.listeners} {...draggable.attributes} data-testid={active ? 'active-syllable-card' : undefined} className={`syllable-card ${active ? 'active-card' : ''}`} style={active ? { transform: CSS.Translate.toString(draggable.transform) } : undefined}>
    <img src={card.image} alt={`Ilustración de ${card.word}`} />
    <strong>{card.word}</strong>
  </article>
}

function SyllableZone({ syllables, cards }: { syllables: SyllableCount; cards: readonly JurassicSyllableCard[] }) {
  const drop = useDroppable({ id: syllables })
  return <section ref={drop.setNodeRef} className={`syllable-zone syllable-zone-${syllables} ${drop.isOver ? 'over' : ''}`} aria-label={`${syllables} sílabas`}>
    <h2><span>{syllables}</span> SÍLABAS</h2>
    <div className="syllable-classified">{cards.map(card => <SyllableCard key={card.id} card={card} />)}</div>
  </section>
}

export function JurassicSyllablesGame({ onHome = () => {}, onDinosaurGames = () => {} }: { onHome?: () => void; onDinosaurGames?: () => void }) {
  const [state, setState] = useState(() => createGameState(shuffle(JURASSIC_SYLLABLE_CARDS)))
  const [settings, setSettings] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [wrong, setWrong] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const current = state.deck[0]
  const total = JURASSIC_SYLLABLE_CARDS.length

  const restart = () => { setState(createGameState(shuffle(JURASSIC_SYLLABLE_CARDS))); setCelebrate(false); setSettings(false); setWrong(false) }
  const classify = (target: SyllableCount) => {
    const result = classifyCurrentCard(state, target)
    if (!result.accepted) { setWrong(true); window.setTimeout(() => setWrong(false), 450); return }
    setState(result.state)
    if (result.state.completed) window.setTimeout(() => setCelebrate(true), 350)
  }

  return <main className="game-shell jurassic-syllables-game">
    <GameHeader title="Sílabas jurásicas" onHome={onHome} onDinosaurGames={onDinosaurGames} onRestart={restart} onSettings={() => setSettings(true)} />
    <DndContext sensors={sensors} onDragEnd={({ over }) => { if (over?.id === 2 || over?.id === 3 || over?.id === 4) classify(over.id) }}>
      <section className="syllable-zones" aria-label="Grupos de sílabas">{SYLLABLE_GROUPS.map(syllables => <SyllableZone key={syllables} syllables={syllables} cards={state.classified[syllables]} />)}</section>
      <div className="game-bottom syllable-game-bottom">
        <aside className="drag-instruction" aria-label="Instrucciones de juego"><Pointer aria-hidden="true" /><span>ARRASTRA<br />LA TARJETA</span></aside>
        <section className="deck" aria-label="Mazo de palabras"><div className="card-back back-one" /><div className="card-back back-two" />{current && <div className={`deck-card ${wrong ? 'wrong' : ''}`}><SyllableCard card={current} active /></div>}</section>
        <ProgressIndicator current={total - state.deck.length} total={total} label="palabras clasificadas" />
      </div>
    </DndContext>
    {settings && <Modal title="Configuración" onClose={() => setSettings(false)}><p>Panel preparado para futuras opciones de aula.</p><button className="primary-button" onClick={restart}>Reiniciar partida</button></Modal>}
    {celebrate && <Modal title="🎉 ¡MUY BIEN! 🎉" onClose={() => setCelebrate(false)}><p>¡Has clasificado todas las palabras por sílabas!</p><button className="primary-button" onClick={restart}>Jugar otra vez</button></Modal>}
  </main>
}
