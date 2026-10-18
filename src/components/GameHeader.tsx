import { Home, List, RotateCcw, Settings } from 'lucide-react'

interface GameHeaderProps {
  title?: string
  onHome: () => void
  onDinosaurGames?: () => void
  onRestart: () => void
  onSettings: () => void
}

export function GameHeader({ title = '¿Qué comía cada dinosaurio?', onHome, onDinosaurGames, onRestart, onSettings }: GameHeaderProps) {
  return <header className="game-header">
    <div className="header-navigation">
      <button className="icon-button home-button" aria-label="Inicio" onClick={onHome}><Home aria-hidden="true" /></button>
      {onDinosaurGames && <button className="icon-button" aria-label="Juegos de dinosaurios" onClick={onDinosaurGames}><List aria-hidden="true" /></button>}
    </div>
    <h1>{title}</h1>
    <div className="header-actions">
      <button className="icon-button" aria-label="Reiniciar partida" onClick={onRestart}><RotateCcw aria-hidden="true" /></button>
      <button className="icon-button" aria-label="Configuración" onClick={onSettings}><Settings aria-hidden="true" /></button>
    </div>
  </header>
}
