interface GameMenuProps {
  onOpenDinosaurGames: () => void
  onStartFriendshipSignals: () => void
}

export function GameMenu({ onOpenDinosaurGames, onStartFriendshipSignals }: GameMenuProps) {
  return (
    <main className="game-menu">
      <header className="game-menu-header">
        <h1 className="game-menu-logo">
          <img src="logo.png" alt="Juegos interactivos" />
        </h1>
        <h2>¿A qué quieres jugar hoy?</h2>
      </header>
      <section className="theme-menu-list" aria-label="Temáticas disponibles">
        <button className="theme-menu-card dinosaur-theme-card" onClick={onOpenDinosaurGames}>
          <img src="logo_dinosaurios_no_texto.png" alt="" />
          <span>
            <strong>DINOSAURIOS</strong>
            <small>9 juegos para contar, leer y clasificar</small>
            <em>Ver 9 juegos</em>
          </span>
        </button>
        <button className="theme-menu-card friendship-theme-card" onClick={onStartFriendshipSignals}>
          <img src="amistad_no_texto.png" alt="" />
          <span>
            <strong>AMISTAD</strong>
            <small>Un juego para aprender a convivir</small>
            <em>Jugar ahora</em>
          </span>
        </button>
      </section>
    </main>
  )
}
