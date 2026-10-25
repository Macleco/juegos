export type SyllableCount = 2 | 3 | 4

export interface JurassicSyllableCard {
  id: string
  word: string
  syllables: SyllableCount
  image: string
}

export const JURASSIC_SYLLABLE_CARDS: readonly JurassicSyllableCard[] = [
  { id: 'garra', word: 'Garra', syllables: 2, image: 'imagenes_dino_silabas/garra.jpg' },
  { id: 'hueso', word: 'Hueso', syllables: 2, image: 'imagenes_dino_silabas/hueso.jpg' },
  { id: 'huevo', word: 'Huevo', syllables: 2, image: 'imagenes_dino_silabas/huevo.jpg' },
  { id: 'volcan', word: 'Volcán', syllables: 2, image: 'imagenes_dino_silabas/volcan.jpg' },
  { id: 'colmillo', word: 'Colmillo', syllables: 3, image: 'imagenes_dino_silabas/colmillo.jpg' },
  { id: 'espina', word: 'Espina', syllables: 3, image: 'imagenes_dino_silabas/espina.jpg' },
  { id: 'fosiles', word: 'Fósiles', syllables: 3, image: 'imagenes_dino_silabas/fosiles.jpg' },
  { id: 'pantano', word: 'Pantano', syllables: 3, image: 'imagenes_dino_silabas/pantano.jpg' },
  { id: 'carnivoro', word: 'Carnívoro', syllables: 4, image: 'imagenes_dino_silabas/carnivoro.jpg' },
  { id: 'dinosaurio', word: 'Dinosaurio', syllables: 4, image: 'imagenes_dino_silabas/dinosaurio.jpg' },
  { id: 'esqueleto', word: 'Esqueleto', syllables: 4, image: 'imagenes_dino_silabas/esqueleto.jpg' },
  { id: 'herbivoro', word: 'Herbívoro', syllables: 4, image: 'imagenes_dino_silabas/herviboro.jpg' },
]
