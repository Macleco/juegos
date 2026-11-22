import type { DinosaurLevel, FossilPiece } from './game-types'

const pieces = (items: readonly [string, string, number, number][]): readonly FossilPiece[] => items.map(([id, label, x, y], index) => ({
  id, label, targetId: id, excavationRegion: { x, y, width: .18, height: .22 }, assemblyPosition: { x: .16 + (index % 3) * .28, y: .18 + Math.floor(index / 3) * .42 },
}))

export const PALEONTOLOGY_LEVELS: readonly DinosaurLevel[] = [
  { id: 'stegosaurus', name: 'Estegosaurio', difficulty: 'easy', image: 'dinos/stegosaurus.png', educationalFact: 'Tenía grandes placas en la espalda y comía plantas.', pieces: pieces([['head', 'Cabeza', .16, .22], ['spine', 'Tronco y columna', .48, .2], ['tail', 'Cola', .7, .5], ['legs', 'Patas', .31, .65]]) },
  { id: 'triceratops', name: 'Triceratops', difficulty: 'medium', image: 'dinos/triceratops.png', educationalFact: 'Tenía tres cuernos y un gran escudo en la cabeza.', pieces: pieces([['head', 'Cabeza con cuernos', .18, .25], ['body', 'Tronco', .48, .18], ['tail', 'Cola', .72, .46], ['front-legs', 'Patas delanteras', .28, .68], ['back-legs', 'Patas traseras', .55, .67]]) },
  { id: 'tyrannosaurus-rex', name: 'Tiranosaurio rex', difficulty: 'hard', image: 'dinos/tyrannosaurus-rex.png', educationalFact: 'Tenía dientes grandes, patas fuertes y brazos pequeños.', pieces: pieces([['head', 'Cabeza y mandíbula', .15, .22], ['body', 'Tronco y columna', .47, .17], ['tail', 'Cola', .72, .35], ['arms', 'Brazos', .32, .48], ['left-leg', 'Pata izquierda', .3, .7], ['right-leg', 'Pata derecha', .57, .68]]) },
]

export const levelById = (id: string | null) => PALEONTOLOGY_LEVELS.find(level => level.id === id)
