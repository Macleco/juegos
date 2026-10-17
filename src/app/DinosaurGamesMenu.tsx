interface DinosaurGamesMenuProps {
  onBack: () => void
  onStartDinosaurDiet: () => void
}

export function DinosaurGamesMenu({ onBack, onStartDinosaurDiet }: DinosaurGamesMenuProps) {
  return (
    <main className="game-menu dinosaur-games-menu">
      <header className="game-menu-header">
        <button className="menu-back-button" onClick={onBack}>← Temáticas</button>
        <h1>Dinosaurios</h1>
        <h2>Elige un juego</h2>
      </header>
      <section className="dinosaur-games-list" aria-label="Juegos de dinosaurios">
        <button className="game-menu-card dinosaur-game-card" onClick={onStartDinosaurDiet}>
          <img src="dinos/triceratops.jpg" alt="" />
          <span>
            <strong>¿Qué comía cada dinosaurio?</strong>
            <small>Clasifica dinosaurios en herbívoros y carnívoros.</small>
          </span>
        </button>
      </section>
    </main>
  )
}
