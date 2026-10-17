interface DinosaurGamesMenuProps {
  onBack: () => void
  onStartDinosaurDiet: () => void
  onStartDinosaurName: () => void
}

export function DinosaurGamesMenu({ onBack, onStartDinosaurDiet, onStartDinosaurName }: DinosaurGamesMenuProps) {
  return (
    <main className="game-menu dinosaur-games-menu">
      <header className="game-menu-header">
        <button className="menu-back-button" onClick={onBack}>← Temáticas</button>
        <h1>Dinosaurios</h1>
        <h2>Elige un juego</h2>
      </header>
      <section className="dinosaur-games-list" aria-label="Juegos de dinosaurios">
        <button className="game-menu-card dinosaur-game-card" onClick={onStartDinosaurDiet}>
          <img src="dinos/triceratops.png" alt="" />
          <span>
            <strong>¿Qué comía cada dinosaurio?</strong>
            <small>Clasifica dinosaurios en herbívoros y carnívoros.</small>
          </span>
        </button>
        <button className="game-menu-card dinosaur-game-card dinosaur-name-menu-card" onClick={onStartDinosaurName}>
          <img src="dinos/stegosaurus.png" alt="" />
          <span>
            <strong>¿Cómo se llama el dinosaurio?</strong>
            <small>Relaciona cada fotografía con su nombre.</small>
          </span>
        </button>
      </section>
    </main>
  )
}
