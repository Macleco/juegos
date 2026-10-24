import { useEffect, useState } from 'react'
import { DinosaurDietGame } from '../games/dinosaur-diet/DinosaurDietGame'
import { DinosaurNameGame } from '../games/dinosaur-name/DinosaurNameGame'
import { JurassicSumsGame } from '../games/jurassic-sums/JurassicSumsGame'
import { JurassicMemoryGame } from '../games/jurassic-memory/JurassicMemoryGame'
import { FriendshipSignalsGame } from '../games/friendship-signals/FriendshipSignalsGame'
import { DinosaurGamesMenu } from './DinosaurGamesMenu'
import { GameMenu } from './GameMenu'

const DINOSAUR_DIET_HASH = '#/dinosaur-diet'
const DINOSAUR_NAME_HASH = '#/dinosaur-name'
const DINOSAUR_SUMS_HASH = '#/jurassic-sums'
const JURASSIC_MEMORY_HASH = '#/jurassic-memory'
const DINOSAUR_GAMES_HASH = '#/dinosaur-games'
const FRIENDSHIP_SIGNALS_HASH = '#/friendship-signals'

function currentRoute() {
  return window.location.hash
}

export function App() {
  const [route, setRoute] = useState(currentRoute)

  useEffect(() => {
    const syncRoute = () => setRoute(currentRoute())
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  const openDinosaurDiet = () => {
    window.location.hash = DINOSAUR_DIET_HASH
    setRoute(DINOSAUR_DIET_HASH)
  }
  const openDinosaurGames = () => {
    window.location.hash = DINOSAUR_GAMES_HASH
    setRoute(DINOSAUR_GAMES_HASH)
  }
  const openDinosaurName = () => {
    window.location.hash = DINOSAUR_NAME_HASH
    setRoute(DINOSAUR_NAME_HASH)
  }
  const openJurassicSums = () => {
    window.location.hash = DINOSAUR_SUMS_HASH
    setRoute(DINOSAUR_SUMS_HASH)
  }
  const openJurassicMemory = () => {
    window.location.hash = JURASSIC_MEMORY_HASH
    setRoute(JURASSIC_MEMORY_HASH)
  }
  const openFriendshipSignals = () => {
    window.location.hash = FRIENDSHIP_SIGNALS_HASH
    setRoute(FRIENDSHIP_SIGNALS_HASH)
  }
  const returnToMenu = () => {
    window.location.hash = ''
    setRoute('')
  }

  if (route === DINOSAUR_DIET_HASH) return <DinosaurDietGame onHome={returnToMenu} onDinosaurGames={openDinosaurGames} />
  if (route === DINOSAUR_NAME_HASH) return <DinosaurNameGame onHome={returnToMenu} onDinosaurGames={openDinosaurGames} />
  if (route === DINOSAUR_SUMS_HASH) return <JurassicSumsGame onHome={returnToMenu} onDinosaurGames={openDinosaurGames} />
  if (route === JURASSIC_MEMORY_HASH) return <JurassicMemoryGame onHome={returnToMenu} onDinosaurGames={openDinosaurGames} />
  if (route === DINOSAUR_GAMES_HASH) {
    return <DinosaurGamesMenu onBack={returnToMenu} onStartDinosaurDiet={openDinosaurDiet} onStartDinosaurName={openDinosaurName} onStartJurassicSums={openJurassicSums} onStartJurassicMemory={openJurassicMemory} />
  }
  if (route === FRIENDSHIP_SIGNALS_HASH) return <FriendshipSignalsGame onHome={returnToMenu} />
  return <GameMenu onOpenDinosaurGames={openDinosaurGames} onStartFriendshipSignals={openFriendshipSignals} />
}
