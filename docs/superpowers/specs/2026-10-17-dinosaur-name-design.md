# Diseño: ¿Cómo se llama el dinosaurio?

## Objetivo

Incorporar un segundo juego de dinosaurios para pizarra digital. En cada
ronda, el alumnado identifica cuatro fotografías y arrastra el nombre mostrado
hacia la fotografía correspondiente.

## Alcance

- Usar exclusivamente los dinosaurios, nombres e imágenes de
  `src/data/dinosaurs.ts`.
- Elegir cuatro dinosaurios distintos de forma aleatoria en cada ronda.
- Mostrar las cuatro fotografías simultáneamente como destinos de arrastre.
- Mostrar un único nombre grande y arrastrable. Tras cada acierto se muestra
  uno de los nombres todavía pendientes.
- Marcar visualmente cada fotografía resuelta, proporcionar feedback breve al
  error y celebrar la finalización de los cuatro emparejamientos.
- Permitir reiniciar y volver al menú de temáticas, igual que el juego actual.
- Incorporar una tarjeta de acceso en el menú de Dinosaurios y una ruta hash
  propia.

No se añaden dinosaurios, persistencia, audio ni cambios al primer juego.

## Arquitectura y flujo

Se añadirá `src/games/dinosaur-name/` sin introducir un motor compartido:

- `game-state.ts` contendrá lógica pura e inmutable: selección aleatoria de
  cuatro dinosaurios, creación de estado y validación del nombre actual contra
  una fotografía destino.
- `DinosaurNameGame.tsx` conectará esa lógica con `@dnd-kit/core`, las zonas
  de las fotografías, la tarjeta de nombre, progreso, ajustes y celebración.
- Sus pruebas verificarán la selección, transiciones correctas e incorrectas,
  finalización y el flujo de interfaz de arrastrar y soltar.

El estado mantiene la ronda completa, los identificadores ya resueltos, el
nombre actual y `completed`. Las fotografías no cambian de posición durante la
ronda. El nombre actual solo avanza cuando coincide con el identificador de la
foto de destino; ante un error el estado no cambia y la tarjeta recibe una
señal visual breve.

`App.tsx` añadirá la ruta `#/dinosaur-name`, y `DinosaurGamesMenu` recibirá un
callback adicional para abrirla. Los estilos específicos se añadirán al CSS
global existente, con targets grandes, `touch-action: none`, layout pensado
para 1920x1080, y respeto a `prefers-reduced-motion`.

## Interfaz

El encabezado indicará «¿CÓMO SE LLAMA EL DINOSAURIO?». Debajo habrá una fila
de cuatro tarjetas de foto. Las tarjetas resueltas conservarán su imagen y
mostrarán un distintivo de acierto, para que el progreso sea visible. En la
parte inferior se ubicará la instrucción de arrastre, el nombre activo y el
indicador `n/4`.

Al completar la ronda se mostrará un modal de felicitación con la acción
«Jugar otra vez». Reiniciar genera una ronda independiente de cuatro
dinosaurios.

## Casos de error y accesibilidad

Un nombre soltado en una fotografía incorrecta no altera el progreso ni las
fotos resueltas. Las zonas conservan etiquetas accesibles con el nombre de la
foto, y las imágenes usan texto alternativo descriptivo. No se depende de
hover para entender o completar el juego.

## Verificación

Antes de dar el trabajo por terminado se ejecutarán `npm test`, `npm run lint`
y `npm run build`.
