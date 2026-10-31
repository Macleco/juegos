interface DinosaurGamesMenuProps {
  onBack: () => void
  onStartDinosaurDiet: () => void
  onStartDinosaurName: () => void
  onStartJurassicSums: () => void
  onStartJurassicMemory: () => void
  onStartJurassicSyllables: () => void
  onStartJurassicLostLetters: () => void
}

export function DinosaurGamesMenu({ onBack, onStartDinosaurDiet, onStartDinosaurName, onStartJurassicSums, onStartJurassicMemory, onStartJurassicSyllables, onStartJurassicLostLetters }: DinosaurGamesMenuProps) {
  return (
    <main className="game-menu dinosaur-games-menu">
      <header className="game-menu-header">
        <button className="menu-back-button" onClick={onBack}>← Temáticas</button>
        <h1>Dinosaurios</h1>
        <h2>Elige un juego</h2>
      </header>
      <section className="dinosaur-games-list" aria-label="Juegos de dinosaurios">
        <button className="game-menu-card dinosaur-game-card" onClick={onStartDinosaurDiet}>
          <img src="logo_herbivoros.png" alt="" />
          <span>
            <strong>¿Qué comía cada dinosaurio?</strong>
            <small>Clasifica dinosaurios en herbívoros y carnívoros.</small>
          </span>
        </button>
        <button className="game-menu-card dinosaur-game-card dinosaur-name-menu-card" onClick={onStartDinosaurName}>
          <img src="logo_juego_nombres.png" alt="" />
          <span>
            <strong>¿Cómo se llama el dinosaurio?</strong>
            <small>Relaciona cada fotografía con su nombre.</small>
          </span>
        </button>
        <button className="game-menu-card dinosaur-game-card" onClick={onStartJurassicSums}>
          <img src="logo_sumas.png" alt="" />
          <span>
            <strong>Sumas jurásicas</strong>
            <small>Cuenta los dinosaurios y resuelve la suma.</small>
          </span>
        </button>
        <button className="game-menu-card dinosaur-game-card" onClick={onStartJurassicMemory}>
          <img src="logo_memory.png" alt="" />
          <span>
            <strong>Memory Jurásico</strong>
            <small>Encuentra las parejas de dinosaurios.</small>
          </span>
        </button>
        <button className="game-menu-card dinosaur-game-card" onClick={onStartJurassicSyllables}>
          <img src="logo_silabas.png" alt="" />
          <span>
            <strong>Sílabas jurásicas</strong>
            <small>Clasifica las palabras según sus sílabas.</small>
          </span>
        </button>
        <button className="game-menu-card dinosaur-game-card" onClick={onStartJurassicLostLetters}>
          <img src="dinos/stegosaurus.png" alt="" />
          <span>
            <strong>Letras perdidas del Jurásico</strong>
            <small>Completa el nombre de cada dinosaurio.</small>
          </span>
        </button>
      </section>
    </main>
  )
}
