export type Diet = 'herbivore' | 'carnivore'

export interface Dinosaur {
  id: string
  name: string
  diet: Diet
  image: string
}

export const DINOSAURS: readonly Dinosaur[] = [
  { id: 'triceratops', name: 'Triceratops', diet: 'herbivore', image: 'dinos/triceratops.jpg' },
  { id: 'diplodocus', name: 'Diplodocus', diet: 'herbivore', image: 'dinos/diplodocus.jpg' },
  { id: 'pachycephalosaurus', name: 'Pachycephalosaurus', diet: 'herbivore', image: 'dinos/pachycephalosaurus.jpg' },
  { id: 'stegosaurus', name: 'Stegosaurus', diet: 'herbivore', image: 'dinos/stegosaurus.jpg' },
  { id: 'ankylosaurus', name: 'Ankylosaurus', diet: 'herbivore', image: 'dinos/ankylosaurus.jpg' },
  { id: 'parasaurolophus', name: 'Parasaurolophus', diet: 'herbivore', image: 'dinos/parasaurolophus.jpg' },
  { id: 'tyrannosaurus-rex', name: 'Tyrannosaurus Rex', diet: 'carnivore', image: 'dinos/tyrannosaurus-rex.jpg' },
  { id: 'velociraptor', name: 'Velociraptor', diet: 'carnivore', image: 'dinos/velociraptor.jpg' },
  { id: 'spinosaurus', name: 'Spinosaurus', diet: 'carnivore', image: 'dinos/spinosaurus.jpg' },
  { id: 'giganotosaurus', name: 'Giganotosaurus', diet: 'carnivore', image: 'dinos/giganotosaurus.jpg' },
  { id: 'carnotaurus', name: 'Carnotaurus', diet: 'carnivore', image: 'dinos/carnotaurus.jpg' },
  { id: 'dilophosaurus', name: 'Dilophosaurus', diet: 'carnivore', image: 'dinos/dilophosaurus.jpg' },
  { id: 'ampelosaurus', name: 'Ampelosaurus', diet: 'herbivore', image: 'dinos/ampelosaurus.jpg' },
  { id: 'brachiosaurus', name: 'Brachiosaurus', diet: 'herbivore', image: 'dinos/brachiosaurus.jpg' },
  { id: 'brontosaurus', name: 'Brontosaurus', diet: 'herbivore', image: 'dinos/brontosaurus.jpg' },
  { id: 'pteranodon', name: 'Pteranodon', diet: 'carnivore', image: 'dinos/pteranodon.jpg' },
  { id: 'pterodactyl', name: 'Pterodactyl', diet: 'carnivore', image: 'dinos/pterodactyl.jpg' },
]
