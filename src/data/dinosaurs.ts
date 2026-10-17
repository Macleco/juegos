export type Diet = 'herbivore' | 'carnivore'

export interface Dinosaur {
  id: string
  name: string
  diet: Diet
  image: string
}

export const DINOSAURS: readonly Dinosaur[] = [
  { id: 'triceratops', name: 'Triceratops', diet: 'herbivore', image: 'dinos/triceratops.png' },
  { id: 'diplodocus', name: 'Diplodocus', diet: 'herbivore', image: 'dinos/diplodocus.png' },
  { id: 'pachycephalosaurus', name: 'Pachycephalosaurus', diet: 'herbivore', image: 'dinos/pachycephalosaurus.png' },
  { id: 'stegosaurus', name: 'Stegosaurus', diet: 'herbivore', image: 'dinos/stegosaurus.png' },
  { id: 'ankylosaurus', name: 'Ankylosaurus', diet: 'herbivore', image: 'dinos/ankylosaurus.png' },
  { id: 'parasaurolophus', name: 'Parasaurolophus', diet: 'herbivore', image: 'dinos/parasaurolophus.png' },
  { id: 'tyrannosaurus-rex', name: 'Tyrannosaurus Rex', diet: 'carnivore', image: 'dinos/tyrannosaurus-rex.png' },
  { id: 'velociraptor', name: 'Velociraptor', diet: 'carnivore', image: 'dinos/velociraptor.png' },
  { id: 'spinosaurus', name: 'Spinosaurus', diet: 'carnivore', image: 'dinos/spinosaurus.png' },
  { id: 'giganotosaurus', name: 'Giganotosaurus', diet: 'carnivore', image: 'dinos/giganotosaurus.png' },
  { id: 'carnotaurus', name: 'Carnotaurus', diet: 'carnivore', image: 'dinos/carnotaurus.png' },
  { id: 'dilophosaurus', name: 'Dilophosaurus', diet: 'carnivore', image: 'dinos/dilophosaurus.png' },
  { id: 'ampelosaurus', name: 'Ampelosaurus', diet: 'herbivore', image: 'dinos/ampelosaurus.png' },
  { id: 'brachiosaurus', name: 'Brachiosaurus', diet: 'herbivore', image: 'dinos/brachiosaurus.png' },
  { id: 'brontosaurus', name: 'Brontosaurus', diet: 'herbivore', image: 'dinos/brontosaurus.png' },
  { id: 'pteranodon', name: 'Pteranodon', diet: 'carnivore', image: 'dinos/pteranodon.png' },
  { id: 'pterodactyl', name: 'Pterodactyl', diet: 'carnivore', image: 'dinos/pterodactyl.png' },
]
