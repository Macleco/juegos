---
name: Marta Game
description: Juegos educativos en pizarra digital para explorar, practicar y acertar acompañados.
colors:
  slate-blue: "#123d56"
  classroom-cream: "#fff9ed"
  game-sky: "#8ed1ee"
  success-green: "#75cf85"
  action-lilac: "#7064b4"
  correction-coral: "#f0807b"
  card-white: "#fffdf8"
  soft-green: "#dff8d1"
  soft-lilac: "#f0edff"
  soft-coral: "#ffe1dc"
typography:
  display:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 2.55vw, 2.7rem)"
    fontWeight: 900
    lineHeight: 1.15
  title:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.8vw, 1.8rem)"
    fontWeight: 900
  body:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.6vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.25
  label:
    fontFamily: "Nunito, ui-rounded, system-ui, sans-serif"
    fontWeight: 900
rounded:
  control: "18px"
  card: "26px"
  panel: "42px"
  pill: "999px"
spacing:
  compact: "0.5rem"
  standard: "1rem"
  spacious: "clamp(1rem, 2vw, 1.75rem)"
components:
  button-primary:
    backgroundColor: "{colors.action-lilac}"
    textColor: "#fff"
    rounded: "{rounded.control}"
    padding: "0.95rem 1.5rem"
  button-primary-hover:
    backgroundColor: "#6e60c3"
  zone-success:
    backgroundColor: "{colors.soft-green}"
    textColor: "#176446"
    rounded: "{rounded.panel}"
  answer-card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.slate-blue}"
    rounded: "{rounded.card}"
  icon-button:
    backgroundColor: "#cdeaff"
    textColor: "{colors.slate-blue}"
    rounded: "50%"
    size: "62px"
---

# Design System: Marta Game

## Overview

**Creative North Star: "Pizarra de exploración amable"**

Marta Game convierte la pizarra digital en un espacio de exploración sereno, claro y alegre. La interfaz está construida para alumnado de 5 y 6 años acompañado por profesorado o familias: cada acción debe leerse rápido, sentirse manipulable y tener una respuesta visual inequívoca.

El sistema combina fondos crema luminosos, zonas pastel por significado y un azul pizarra profundo que mantiene la legibilidad. Las tarjetas, paneles y controles tienen esquinas generosas, bordes definidos y una elevación corta que los hace parecer piezas que se pueden tocar y mover. Es una identidad transversal: debe servir a dinosaurios, matemáticas, amistad y futuras temáticas sin depender de una sola de ellas.

**Key Characteristics:**

- Alegre y táctil, sin saturar la pizarra.
- Muy legible a distancia, con jerarquía basada en tamaño y contraste.
- Semántica de color consistente para aciertos, errores, acciones y categorías.
- Componentes elevados como pegatinas o piezas de juego.

## Colors

Pasteles luminosos organizan el contenido; el Azul pizarra ancla texto, iconos y contornos para conservar claridad en pantallas grandes.

### Primary

- **Azul pizarra:** color estructural para texto, iconos y bordes de actividad. Es la voz estable sobre la que se apoyan los pasteles.
- **Cielo de juego:** color de navegación, progreso y contenedores informativos. Mantiene la experiencia abierta y amable.

### Secondary

- **Verde acierto:** confirma progreso, resoluciones correctas y zonas favorables. Debe comunicar éxito con claridad, no decorarse de forma arbitraria.
- **Lila de acción:** reserva su fuerza para botones de acción, opciones y elementos arrastrables.

### Tertiary

- **Coral de corrección:** comunica errores o estados incorrectos con una versión suave y no punitiva.

### Neutral

- **Crema de aula:** superficie base cálida de la aplicación.
- **Blanco de tarjeta:** superficie clara para cartas, etiquetas y contenido que requiere máxima separación.

### Named Rules

**The Meaningful Pastel Rule.** Los colores pastel deben tener una función de estado, categoría o jerarquía; el Azul pizarra permanece disponible para todo texto e icono que requiera contraste.

## Typography

**Display Font:** Nunito (con `ui-rounded`, `system-ui`, `sans-serif` como respaldo)

**Body Font:** Nunito (con `ui-rounded`, `system-ui`, `sans-serif` como respaldo)

**Character:** Una sans redondeada, pesada y amable que sostiene lectura temprana y señalización visible desde el aula. La fuerza viene del peso 700–900 y de escalas fluidas, no de tipos condensados ni de texto pequeño.

### Hierarchy

- **Display** (900, `clamp(1.2rem, 2.55vw, 2.7rem)`, 1.15): título principal de cada actividad en una cápsula clara.
- **Headline** (900, `clamp(1.7rem, 3.5vw, 3rem)`): nombres de temas o actividades en los menús.
- **Title** (900, `clamp(1.05rem, 1.8vw, 1.8rem)`): títulos de zonas, consignas y categorías.
- **Body** (700, `clamp(1rem, 1.6vw, 1.5rem)`, 1.25): instrucciones cortas, mensajes y progreso.
- **Label** (900, mayúsculas cuando identifica una opción o nombre de juego): etiquetas breves de alta visibilidad.

### Named Rules

**The Read-From-Away Rule.** Las instrucciones y objetivos deben poder comprenderse desde una pizarra: texto breve, peso alto y tamaños fluidos; no usar texto diminuto como única explicación.

## Layout

Las partidas priorizan 1920×1080 con una cuadrícula de tres franjas: cabecera, tablero principal y zona de interacción o respuesta. Los juegos de clasificación usan dos o tres paneles de actividad; los de respuesta usan tableros centrados, cartas grandes y opciones separadas. Los menús sitúan su contenido en una columna o cuadrícula centrada, con tarjetas de tamaño generoso.

La separación combina `vh`, `vw`, `clamp()` y una escala base de medio, uno y varios rem. En anchos inferiores a 800px, las cuadrículas pasan a una columna o menos columnas y se permite desplazamiento vertical; en escritorio se evita durante la partida. La interacción principal siempre ocupa áreas amplias, no controles densos.

## Elevation & Depth

El sistema usa elevación estructural corta: sombras verticales sólidas bajo tarjetas, zonas y opciones, complementadas por sombras suaves en capas flotantes. La profundidad comunica que una pieza se puede tocar, arrastrar o elegir; no pretende simular materiales realistas.

### Shadow Vocabulary

- **Tarjeta táctil:** `0 8px 18px #34405422`; separa cartas y contenidos del tablero.
- **Borde escalonado:** `0 8px 0` en el color de borde; da a paneles y opciones su efecto de pegatina.
- **Capa modal:** `0 18px 50px #34405455`; reserva la mayor elevación para diálogo y celebración.

### Named Rules

**The Touchable Layer Rule.** Si un elemento se arrastra, se pulsa o se elige, debe mantener una silueta clara y una elevación suficiente para leerse como objeto manipulable.

## Shapes

Las formas son blandas y confiadas: cápsulas para títulos, instrucciones y progreso; círculos para iconos; y rectángulos muy redondeados para tarjetas y paneles. Los radios recurrentes son 18px para controles, 26px para tarjetas y aproximadamente 42px para zonas de tablero. Los bordes son gruesos —habitualmente de 4px a 6px— y coloreados; no se sustituyen por líneas grises finas.

## Components

### Buttons

Carácter: acciones simples, elevadas y suficientemente grandes para dedos pequeños y punteros de pizarra.

- **Shape:** esquinas redondeadas (18px) o circular para iconos (50%).
- **Primary:** Lila de acción sobre texto blanco, con relleno de `0.95rem 1.5rem`.
- **Hover / Focus:** el hover ajusta brillo o asciende ligeramente; el foco visible usa un contorno lila de 4px con separación.
- **Incorrect / Correct:** Coral de corrección y Verde acierto sustituyen borde, fondo y sombra de manera conjunta.

### Cards / Containers

Carácter: piezas de juego blancas sobre zonas pastel, preparadas para contener imagen y etiqueta.

- **Corner Style:** tarjeta generosamente redondeada (26px); panel o zona (42px).
- **Background:** Blanco de tarjeta para contenido; pasteles semánticos para grupos, zonas y contexto.
- **Shadow Strategy:** borde escalonado para opciones y paneles; sombra suave para cartas independientes.
- **Border:** bordes blancos o de categoría, entre 3px y 6px de grosor.
- **Internal Padding:** de `0.65rem` a `clamp(1rem, 2vw, 1.75rem)` según la escala del juego.

### Navigation

Carácter: controles icónicos circulares y explícitos, ubicados en los extremos de la cabecera.

- **Style:** botones de al menos 62px, fondo Cielo de juego y relieve interior; el acceso de inicio usa un Lila suave para diferenciarse.
- **State:** el hover reduce levemente el brillo; las etiquetas `aria-label` nombran las acciones aunque se muestren iconos.

### Progress Indicators

Carácter: contador claro y amable que muestra avance sin competir con la actividad.

- **Style:** texto fuerte en una cápsula Cielo de juego o verde suave, con puntos o huevos como unidades completadas.
- **State:** el progreso resuelto adopta Verde acierto; las unidades pendientes usan un neutro tenue.

### Classification Zones

Carácter: destinos grandes y diferenciados que hacen evidente dónde soltar una tarjeta.

- **Style:** paneles de 4px a 6px, con grandes esquinas redondeadas, un título en cápsula blanca y una base pastel con textura vegetal o ilustrativa discreta.
- **State:** al recibir un arrastre, la zona aumenta levemente de escala y ajusta su brillo; el contenido clasificado conserva tarjetas blancas legibles.

## Do's and Don'ts

### Do:

- **Do** usar Azul pizarra para texto, iconografía y contornos que necesiten contraste.
- **Do** emplear pasteles por significado: Verde acierto para confirmación, Coral de corrección para error y Lila de acción para elecciones o acciones.
- **Do** conservar objetivos e instrucciones en frases cortas, tamaño fluido y peso alto.
- **Do** hacer que los elementos interactivos se lean como piezas tocables mediante bordes gruesos, esquinas suaves y elevación.
- **Do** mantener objetivos táctiles amplios y `touch-action` adecuado en elementos de arrastre.

### Don't:

- **Don't** depender de hover, texto pequeño o precisión de puntero para comprender una actividad.
- **Don't** usar colores pastel sin una función semántica o sustituir el contraste estructural por tonos claros.
- **Don't** convertir las tarjetas y controles en superficies planas, afiladas o visualmente frágiles.
- **Don't** introducir tipografías estrechas, frágiles o demasiado adultas que compitan con Nunito.
