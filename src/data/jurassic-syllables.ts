export type SyllableCount = 2 | 3 | 4

export interface JurassicSyllableCard {
  id: string
  word: string
  syllables: SyllableCount
  image: string
}

export const JURASSIC_SYLLABLE_CARDS: readonly JurassicSyllableCard[] = [
  { id: 'garra', word: 'Garra', syllables: 2, image: 'imagenes_dino_silabas/garra-enfocada.png' },
  { id: 'hueso', word: 'Hueso', syllables: 2, image: 'imagenes_dino_silabas/hueso-enfocado.png' },
  { id: 'huevo', word: 'Huevo', syllables: 2, image: 'imagenes_dino_silabas/huevo-enfocado.png' },
  { id: 'volcan', word: 'Volcán', syllables: 2, image: 'imagenes_dino_silabas/volcan-enfocado.png' },
  { id: 'colmillo', word: 'Colmillo', syllables: 3, image: 'imagenes_dino_silabas/colmillo-enfocado.png' },
  { id: 'espina', word: 'Espina', syllables: 3, image: 'imagenes_dino_silabas/espina-enfocada.png' },
  { id: 'fosiles', word: 'Fósiles', syllables: 3, image: 'imagenes_dino_silabas/fosiles-enfocados.png' },
  { id: 'pantano', word: 'Pantano', syllables: 3, image: 'imagenes_dino_silabas/pantano-enfocado.png' },
  { id: 'carnivoro', word: 'Carnívoro', syllables: 4, image: 'imagenes_dino_silabas/carnivoro-enfocado.png' },
  { id: 'dinosaurio', word: 'Dinosaurio', syllables: 4, image: 'imagenes_dino_silabas/dinosaurio-enfocado.png' },
  { id: 'esqueleto', word: 'Esqueleto', syllables: 4, image: 'imagenes_dino_silabas/esqueleto-enfocado.png' },
  { id: 'herbivoro', word: 'Herbívoro', syllables: 4, image: 'imagenes_dino_silabas/herbivoro-enfocado.png' },
]
