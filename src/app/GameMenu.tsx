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
      </header>
      <section className="theme-menu-list" aria-label="Temáticas disponibles">
        <button className="theme-menu-card dinosaur-theme-card" onClick={onOpenDinosaurGames}>
          <img src="dinos/triceratops.jpg" alt="" />
          <strong>Dinosaurios</strong>
        </button>
        <button className="theme-menu-card friendship-theme-card" onClick={onStartFriendshipSignals}>
          <img src="imagenes_amistad/abrazar.png" alt="" />
          <strong>Amistad</strong>
        </button>
      </section>
    </main>
  )
}
