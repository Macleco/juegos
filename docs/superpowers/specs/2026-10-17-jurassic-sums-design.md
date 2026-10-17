# Diseño: Sumas Jurásicas

## Objetivo

Incorporar un tercer juego de dinosaurios para pizarra digital. El alumnado
cuenta dos grupos de dinosaurios y resuelve, en orden, el valor del primer
sumando, el segundo sumando y el resultado de la suma.

## Alcance

- Crear el juego aislado en `src/games/jurassic-sums/`.
- Generar sumas con dos grupos de entre uno y nueve dinosaurios; el resultado
  estará entre dos y dieciocho.
- Mostrar cuatro respuestas numéricas grandes y distintas en cada paso:
  una correcta y tres distractores válidos.
- Resolver secuencialmente el primer grupo, el segundo grupo y el total.
- Conservar el valor elegido de cada paso como confirmación visual y mostrar
  una señal breve ante una respuesta incorrecta sin modificar el estado.
- Añadir felicitación al completar la suma, reinicio, regreso a inicio, ruta
  hash propia y tarjeta en el menú Dinosaurios.
- Usar únicamente las imágenes de dinosaurios existentes.

No se añaden persistencia, audio, nuevos recursos gráficos ni cambios de
reglas a los demás juegos.

## Arquitectura y flujo

`game-state.ts` contendrá lógica pura e inmutable: creación de una suma,
generación de opciones distintas, registro de una respuesta y avance del paso
activo. El estado mantendrá los dos sumandos, las opciones de cada paso, las
respuestas confirmadas, el paso activo y la finalización.

`JurassicSumsGame.tsx` presentará la suma con dos grupos de dinosaurios y una
fila de cuatro botones. Al acertar se bloquea y se marca el resultado de ese
paso, se habilita el siguiente y, al responder el total, se abre el modal de
felicitación. Una opción equivocada no altera el progreso y recibe feedback
visual temporal. Las pruebas cubrirán creación de rondas, opciones,
transiciones correctas e incorrectas, finalización y acceso desde la app.

`App.tsx` añadirá `#/jurassic-sums`; `DinosaurGamesMenu` recibirá el callback
para iniciar este juego. Los estilos específicos se integrarán en el CSS
global, conservando controles táctiles grandes, contraste alto, semántica y
`prefers-reduced-motion`.

## Interfaz

El encabezado mostrará «SUMAS JURÁSICAS». En el espacio principal aparecerán
dos paneles con dinosaurios, separados por un signo más, seguidos de un signo
igual y el resultado. La presentación seguirá el carácter cálido, redondeado
y de alto contraste de la referencia, pero usará las fotografías de
dinosaurios ya disponibles.

En cada paso una instrucción clara indicará qué contar: «¿Cuántos hay en el
primer grupo?», «¿Cuántos hay en el segundo grupo?» o «¿Cuánto suman?». Debajo
se mostrarán cuatro botones numéricos de gran tamaño. Los resultados
confirmados quedan visibles en la ecuación para reforzar el razonamiento.

## Accesibilidad y errores

Los grupos tendrán etiquetas accesibles que anuncien el orden de conteo, y
los botones expondrán su valor y si son la respuesta activa. No se dependerá
de hover ni de gestos de precisión. Ante un error, la opción se señalará
brevemente y el mismo paso continuará disponible. El diseño priorizará
1920×1080 sin desplazamiento vertical durante la partida.

## Verificación

Antes de finalizar se ejecutarán `npm test`, `npm run lint` y `npm run build`.
