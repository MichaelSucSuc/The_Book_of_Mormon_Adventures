# Estructura Completa de Niveles y Funciones
### Proyecto: Aventuras del Libro de Mormón (*The Book of Mormon Adventures*)
> Documento técnico y de diseño para la formulación y reestructuración de requisitos.

---

## 1. Arquitectura General y Motor del Videojuego

El videojuego está construido con **HTML5 Canvas**, **JavaScript moderno (Vanilla JS)** y **Web Audio API procedural**, sin librerías externas ni dependencias pesadas.

### 1.1 Archivos Principales
* **`index.html`**: Define el viewport de juego (1024x576 en relación 16:9), la interfaz gráfica superpuesta (HUD, menús modales, pantallas de inicio de nivel, pantallas de victoria/derrota, selector de niveles, galería de héroes y reliquias, retos de fe/quizzes y controles táctiles para móviles).
* **`style.css`**: Estilos visuales temáticos (tonos dorados, cinzel/serif, glassmorphism, efectos de brillo y disposición adaptable).
* **`audio.js` (`AudioEngine`)**: Motor de audio sintetizado en tiempo real mediante Web Audio API (no requiere archivos MP3/WAV externos).
* **`game.js` (`GameController`)**: Motor central del juego. Controla el bucle a 60 FPS, física, cámara, detección de colisiones, gestión de estados, diálogos con efecto máquina de escribir, inventario/estrellas, rachas y guardado en `localStorage`.
* **`module1.js` a `module11.js`**: Archivos modulares que definen cada uno de los 11 módulos doctrinales y sus 32 niveles correspondientes.
* **`CONTENIDO.md`**: Matriz doctrinal y pedagógica con referencias canónicas del Libro de Mormón.

---

## 2. Catálogo de Funciones del Motor (`game.js` y `audio.js`)

### 2.1 Motor Principal (`GameController` en `game.js`)

| Función / Método | Parámetros | Descripción y Responsabilidad |
| :--- | :--- | :--- |
| `constructor()` | Ninguno | Inicializa el canvas, contexto 2D, estado (`MENU`), variables del jugador (posición, velocidad, vidas/fe, estados), inputs, cola de diálogos, sistemas de progreso por módulo/nivel, estrellas y galería de héroes. Carga datos guardados y racha diaria. |
| `resizeCanvas()` | Ninguno | Ajusta y garantiza las dimensiones estrictas de 1024x576 (formato 16:9). |
| `initEvents()` | Ninguno | Configura los escuchadores de teclado (`ArrowLeft`/`KeyA`, `ArrowRight`/`KeyD`, `ArrowDown`/`KeyS` para agacharse, `Space`/`KeyZ` para saltar, `KeyX` para atacar/ahuyentar, `KeyC` para fabricar/construir, `Enter`/`KeyE` para avanzar diálogos). |
| `bindTouchButton(id, actionName)` | `id, actionName` | Enlaza eventos táctiles (`touchstart`, `touchend`, `touchcancel`) de los botones en pantalla para soporte completo en dispositivos móviles. |
| `showNotification(text)` | `text` | Muestra una notificación flotante (toast) con temporizador de 180 frames (3 segundos). |
| `startDialogue()` | Ninguno | Inicia la secuencia de diálogos activa si hay elementos en `dialogueQueue`. |
| `setupDialogueItem()` | Ninguno | Prepara el siguiente mensaje de diálogo: asigna el personaje que habla, el texto y reinicia el efecto máquina de escribir. |
| `advanceDialogue()` | Ninguno | Si el texto se está escribiendo, lo autocompleta inmediatamente; si ya está completo, avanza al siguiente diálogo o cierra la caja. |
| `playerHurt()` | Ninguno | Resta 1 punto de Fe (vida), otorga 75 frames de inmunidad, aplica retroceso físico (`velY = -6`, `velX = ±6`) y reproduce sonido de daño. Si la Fe llega a 0, activa la pantalla de `GAME_OVER` con reflexiones de derrota contextuales del nivel. Si la Fe > 0, muestra un toast con pista táctica y reflexión espiritual. |
| `retryLevel()` | Ninguno | Oculta la pantalla de Game Over y reinicia el nivel actual (`loadLevel`). |
| `loadLevel(levelIndex)` | `levelIndex` | Cambia el estado a `LOADING`, resetea la posición del jugador, cámara y atributos. Si el jugador ha muerto 3 veces (`deathsInCurrentLevel >= 3`), activa el sistema de **Dificultad Dinámica** (+1 vida inicial: Escudo de Fe). Ejecuta el método `init(game)` del nivel e inicia la animación de carga hacia la pantalla de `INTRO`. |
| `startLevelGameplay()` | Ninguno | Cierra la pantalla de introducción modal, cambia el estado a `JUGANDO` y activa los controles táctiles si el dispositivo es táctil. |
| `completeLevel(spiritualText, scriptureRef, bonus)` | `spiritualText, scriptureRef, bonus` | Llamada al cumplir el objetivo del nivel. Almacena los datos finales. Si el nivel posee preguntas (`lvl.quiz`), transiciona a `showQuiz`; si no, pasa directo a `showFinishScreen`. |
| `showQuiz(quizQuestions)` | `quizQuestions` | Activa la pantalla modal de "Reto de Fe" (`FIN_NIVEL_QUIZ`), resetea los estados de la trivia y presenta la primera pregunta. |
| `presentQuizQuestion()` | Ninguno | Dibuja la pregunta actual, genera dinámicamente los botones de respuesta y oculta la caja de retroalimentación previa. |
| `handleQuizAnswer(selectedIndex, clickedBtn)` | `selectedIndex, clickedBtn` | Evalúa la opción seleccionada contra `correctaIndex`. Aplica estilos visuales (`correct` o `wrong`), reproduce sonido (`playWin` o `playHurt`), marca `quizFailedAny` si falló y muestra la explicación doctrinal. |
| `finishQuiz()` | Ninguno | Avanza a la siguiente pregunta del quiz o, si terminó todas, cierra el modal de trivia y abre la pantalla final (`showFinishScreen`). |
| `showFinishScreen()` | Ninguno | Despliega el resumen de nivel: pasaje espiritual, cita de escrituras, puntaje y cálculo de 3 estrellas (⭐ Estrella 1: Nivel completado, ⭐ Estrella 2: Fe intacta con 3 corazones, ⭐ Estrella 3: Quiz perfecto). Guarda el progreso. |
| `saveProgress()` | Ninguno | Guarda en `localStorage` el estado de desbloqueo de módulos, niveles, estrellas y puntaje total. |
| `loadProgress()` | Ninguno | Carga desde `localStorage` el progreso guardado previamente. |
| `updateStreak()` | Ninguno | Calcula los días consecutivos jugados (Racha de Fe) comparando la fecha de hoy con la última guardada. |
| `refreshUI()` | Ninguno | Actualiza los indicadores visuales del menú principal: días de racha, porcentaje global completado, barras de progreso y estado de bloqueo de módulos y reliquias. |
| `loadModule(moduleId)` | `moduleId` | Carga el módulo solicitado si está desbloqueado y abre el selector de etapas (`showLevelSelector`). |
| `showLevelSelector()` | Ninguno | Renderiza en pantalla las tarjetas de los niveles del módulo seleccionado con sus estrellas y estado de bloqueo. |
| `nextLevel()` | Ninguno | Avanza al siguiente nivel del módulo o llama a `completeModule()` si era el último. |
| `completeModule()` | Ninguno | Desbloquea el siguiente módulo (del 1 al 11), calcula puntos y muestra la pantalla modal de módulo finalizado con reliquias obtenidas. |
| `restartModule()` | Ninguno | Reinicia el módulo desde su primer nivel (Nivel 1). |
| `showMenu()` | Ninguno | Regresa a la pantalla del menú principal y refresca las tarjetas de módulos. |
| `showGallery()` | Ninguno | Abre la pantalla de Galería de Héroes y Vitrina de Reliquias desbloqueadas. |
| `update()` | Ninguno | Bucle de actualización por fotograma (60 FPS). Si el estado es `JUGANDO`, actualiza la física (`updatePhysics`), la lógica específica del nivel actual (`lvl.update`), temporizadores de ataque, inmunidad y notificaciones. |
| `updatePhysics()` | Ninguno | Aplica gravedad, aceleración lateral, fricción y colisiones precisas entre el jugador y las plataformas (`suelo`, `muro`, `plataforma`, `bloque`, `puerta_cerrada`). Ajusta la cámara para seguir al jugador o centrarse en objetivos. |
| `collides(rect1, rect2)` | `rect1, rect2` | Verifica intersección rectangular AABB entre dos entidades `{x, y, width, height}`. |
| `render()` | Ninguno | Limpia el canvas y dibuja secuencialmente: fondo y entidades del nivel (`lvl.draw`), sprite del jugador (`drawPlayerSprite`), HUD superior (`drawHUD`), caja de diálogo (`drawDialogueBox`) y avisos (`drawNotificationBox`). |
| `drawPlayerSprite(x, y, w, h)` | `x, y, w, h` | Redirige al dibujado procedimental de Nefi o Lehí según `playerCharacter`. |
| `drawNefiSprite(x, y, w, h)` | `x, y, w, h` | Renderiza proceduralmente el personaje de Nefi en Canvas: túnica azul/blanca, cinto, sandalias, cinta en la cabeza, postura agachada, animación de caminar, salto, bastón/espada de ataque y el disfraz de armadura de Labán si está en la fase de sigilo de las Planchas de Bronce. |
| `drawLehiSprite(x, y, w, h)` | `x, y, w, h` | Renderiza proceduralmente al profeta Lehí: túnica terrosa, manto con capucha, barba blanca respetable y bastón pastoral. |
| `drawDialogueBox()` | Ninguno | Renderiza en la parte inferior de la pantalla la caja de diálogo dorada con avatar, nombre del orador, texto progresivo e indicador visual para continuar. |
| `drawHUD()` | Ninguno | Renderiza en la parte superior: corazones de Fe (vidas), puntuación acumulada, nombre de la etapa, objetivo actual y flecha/brújula de dirección hacia la meta si está fuera de pantalla. |
| `drawNotificationBox()` | Ninguno | Renderiza en la parte superior central el toast flotante dorado con pistas tácticas y reflexiones espirituales. |

---

### 2.2 Motor de Audio Sintetizado (`AudioEngine` en `audio.js`)

| Método | Tipo de Síntesis | Efecto Sonoro |
| :--- | :--- | :--- |
| `init()` | Web Audio Context | Inicializa o reanuda el contexto de audio del navegador tras la primera interacción del usuario. |
| `playJump()` | Oscilador Triangular | Barrido ascendente rápido (150 Hz a 600 Hz en 0.15s). Sonido clásico de salto ágil. |
| `playAttack()` | Ruido Blanco + Filtro Bandpass | Ráfaga de ruido blanco filtrada en frecuencia descendente (1200 Hz a 150 Hz en 0.12s). Sonido de tajo de espada o bastón. |
| `playHit()` | Oscilador Cuadrado | Golpe sordo y grave con barrido lineal rápido (220 Hz a 60 Hz en 0.1s). Impacto de daño o colisión contundente. |
| `playCoin()` | Oscilador Senoidal | Arpegio de dos notas en frecuencia pura y aguda (1046 Hz a 1318 Hz). Recolección de monedas, frutos o pergaminos. |
| `playHurt()` | Osciladores Sawtooth + Square | Acorde disonante en caída rápida (180 Hz a 50 Hz). Pérdida de corazón o respuesta errónea en quiz. |
| `playPowerUp()` | Escala Cromática Senoidal | Serie ascendente rápida de 4 notas brillantes (523 Hz, 659 Hz, 784 Hz, 1046 Hz). Recuperación de fe o hito completado. |
| `playAlarm()` | Oscilador Cuadrado Alternado | Tono de sirena de advertencia urgente (dos pulsos de 440 Hz a 880 Hz). Detección por guardias en fases de sigilo. |
| `playDialogueBlip()` | Oscilador Senoidal Corto | Pulso sutil y suave de alta frecuencia (800 Hz, 0.03s) para la escritura de cada carácter de diálogo. |
| `playSelect()` | Click Senoidal Amortiguado | Toque sutil de interfaz (400 Hz a 200 Hz en 0.05s). Navegación de menús y botones. |
| `playWin()` | Tríada Mayor Arpegiada | Fanfarria armónica triunfal (Do-Mi-Sol-Do agudo con decaimiento suave). Victoria de nivel y respuestas de quiz perfectas. |
| `playThunder()` | Ruido Rosa / Low-Pass Filter | Rugido sordo y envolvente de trueno o cataclismo sísmico. Tormentas y terremotos. |

---

## 3. Catálogo Detallado de los 11 Módulos y sus 32 Niveles


---

## MÓDULO 1: 1 NEFI - LA FAMILIA FIEL
* **Libros canónicos:** 1 Nefi
* **Personajes destacados:** Nefi, Lehí, Saríah, Lamán, Lemuel, Sam
* **Enseñanzas clave:** Fe y obediencia, Escrituras de Bronce, Construcción con fe, Guiados por la Liahona
* **Cantidad de niveles:** 4

### 📍 Nivel 1.1: Jerusalén - La Huida de Lehí
* **Descripción corta:** *Obedece el mandamiento del Señor: deja atrás tus riquezas y guía a tu familia por el desierto hasta el Valle de Lemuel.*
* **Personaje en juego:** `lehi`
* **Extensión del escenario (`maxScroll`):** `4200 píxeles`
* **Entidades en escena:** Plataformas: **12**, Enemigos: **4** (soldier, burlon), Coleccionables (Monedas/Frutos/Tesoros): **0**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Jerusalén: El Mandato de Salir al Desierto
* **Texto Doctrinal (`introText`):** "Año 600 a.C. Tras orar fervientemente por su pueblo, el profeta Lehí vio un pilar de fuego y recibió un libro celestial anunciando la inminente destrucción de Jerusalén. Al salir a testificar de sus abominaciones y del Redentor del mundo, los judíos se enfurecieron e intentaron quitarle la vida. Entonces el Señor le habló en un sueño: 'Bendito eres tú, Lehí... sal para el desierto con tu familia'. Lehí fue obediente y abandonó su casa, su tierra, su oro, su plata y sus objetos preciosos, llevando únicamente a su familia, provisiones y tiendas."
* **Objetivo Declarado (`introObjective`):** "Abandona las riquezas terrenales de Jerusalén, recoge provisiones y tiendas, guía a tu familia y edifica un altar de piedras en el Valle de Lemuel."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Mecánica de Escolta de la Familia:** Lehí lidera la marcha y 5 miembros de la familia (Saríah, Sam, Lamán, Lemuel y Nefi) siguen sus pasos mediante un buffer de historial de posiciones (`positionHistory` de 300 muestras), simulando un seguimiento dinámico con salto y agachado sincronizado.
- **Tutorial Integrado:** Marcadores de aprendizaje a lo largo del mapa (movimiento horizontal, salto de muros en x=500, uso de bastón en x=900 y agacharse en x=1300).
- **Enemigos:** Guardias soldados de Jerusalén y burlones que intentan frenar la marcha de la caravana.

#### Condición de Victoria y Mensaje Doctrinal
* Activación por coordenada de meta (`game.completeLevel`).

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Por qué abandonó Lehí su casa, sus tierras, su oro y su plata para salir al desierto?"
* **Opciones:**
  1. Para buscar yacimientos de metales preciosos en la península arábiga.
  2. ✅ **Por obedecer el mandato de Dios recibido en un sueño para salvar a su familia de la destrucción.** (Correcta)
  3. Para evadir el pago de tributos militares al rey de Babilonia.
* **Explicación espiritual:** *1 Nefi 2:2-4 enseña que Lehí fue obediente a la palabra del Señor, abandonando sus riquezas materiales terrenales y llevando solo a su familia, provisiones y tiendas.*
* **Pregunta:** "¿Por qué murmuraban con amargura Lamán y Lemuel en contra de su padre en el desierto?"
* **Opciones:**
  1. ✅ **Porque no conocían el proceder de Dios y creían que Lehí era un hombre visionario llevado por locas imaginaciones.** (Correcta)
  2. Porque Lehí los obligaba a cargar todo el oro y la plata en sus espaldas.
  3. Porque querían construir un barco de inmediato en lugar de acampar en tiendas.
* **Explicación espiritual:** *1 Nefi 2:11-12 aclara que murmuraban por la dureza de su corazón, porque no creían que Jerusalén sería destruida ni conocían la manera de proceder del Señor.*

---
### 📍 Nivel 1.2: Obteniendo las Planchas de Bronce
* **Descripción corta:** *Regresa a Jerusalén, obedece la voz del Espíritu, rescata los anales sagrados y pacta la libertad con Zoram.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `4000 píxeles`
* **Entidades en escena:** Plataformas: **10**, Enemigos: **0** , Coleccionables (Monedas/Frutos/Tesoros): **0**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Las Planchas de Bronce: El Mandato Sagrado
* **Texto Doctrinal (`introText`):** "El Señor manda a los hijos de Lehí volver a Jerusalén para obtener las Planchas de Bronce que custodia Labán, las cuales contienen la ley de Moisés, las profecías y la genealogía de sus antepasados. Ante las quejas de sus hermanos mayores, Nefi declara con fe inquebrantable: 'Iré y haré lo que el Señor ha mandado'. Tras dos intentos fallidos donde Labán los amenaza y les roba sus riquezas familiares, un ángel celestial interviene. Finalmente, Nefi entrará a solas de noche en la ciudad, guiado únicamente por el Espíritu Santo..."
* **Objetivo Declarado (`introObjective`):** "Cumple las fases de la misión: recupera las riquezas familiares, presencia la visita del ángel, infíltrate de noche guiado por el Espíritu y regresa con las Planchas de Bronce y Zoram a la tienda de Lehí."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Mecánica Dinámica de Infiltración, Diálogo y Sigilo (9 Fases en total - 1 Nefi 3–5):**
  * *Fase 0 (El Mandato Sagrado y la Primera Demanda):* Nefi y sus hermanos inician en el campamento (`x = 3500`). El jugador tiene control total e interactivo desde el primer segundo. Tras el diálogo doctrinal inicial ("Iré y haré"), Nefi y sus hermanos corren hacia las puertas del palacio de Labán (`x = 850`). Al aproximarse, Lamán entra a demandar las planchas, Labán lo amenaza de muerte como ladrón, y Lamán huye aterrado hacia Nefi, quien pronuncia el voto solemne de no volver con las manos vacías y propone recoger las riquezas familiares.
  * *Fase 1 (Recuperar las Riquezas en Casa de Lehí):* Viaje a la casa de Lehí (`x = 2000`) para recolectar el Oro de Lehí, la Plata de Herencia y los Bienes Preciosos (`wealthChests`). Se habilitó detección dual por AABB y radio de proximidad (`dist < 65`) junto con animaciones doradas de partículas para evitar bloqueos.
  * *Fase 2 (Ofrecer Riquezas a Labán y Fuga Perseguida):* Traslado del tesoro a las puertas de Labán (`x = 850`). Labán codicia las riquezas, las arrebata y envía guardias armados con antorchas y lanzas. Alarma generalizada y persecución a pie esquivando soldados hasta llegar a la cavidad de la roca en el desierto (`x = 3400`).
  * *Fase 3 (La Vara y la Teofanía del Ángel):* En la cueva, Lamán y Lemuel descargan su ira contra Sam y Nefi golpeándolos con una vara (animación y efectos de sonido). Una radiación celestial inunda la caverna y desciende el Ángel del Señor con alas y corona, reprendiéndolos y prometiendo que el Señor entregará a Labán en sus manos. Nefi infunde fe a sus hermanos recordando a Moisés en el Mar Rojo y parte solo de noche hacia la ciudad.
  * *Fase 4 (Infiltración Nocturna Guiada por el Espíritu):* Jerusalén bajo cielo de medianoche con estrellas y luna llena. Nefi avanza en solitario. Mecánica de sombras (`shadows`): al agacharse con **Abajo ▼** en los pórticos oscuros, se activa el estado `hidden` con indicador visual, permitiendo evadir a las patrullas. Llega hasta Labán caído en la calle ebrio de vino.
  * *Fase 5 (La Espada de Labán y la Voz del Espíritu):* Nefi examina la espada de Labán (puño de oro puro y hoja de acero finísimo). Al presionar el botón de ataque/interacción o acercarse, la voz del Espíritu le constriñe: "Es preferible que muera un hombre a dejar que una nación entera degenere y perezca en la incredulidad". Nefi cumple el mandato y se coloca la vestidura y armadura de Labán (`disguised = true`), ganándose el respeto de las patrullas.
  * *Fase 6 (La Tesorería, Zoram y las Planchas de Bronce):* Acude al guardián de las llaves, Zoram (`x = 450`), quien lo confunde con Labán y abre la gran reja de hierro. Nefi ingresa a la bóveda y recoge las Planchas de Bronce (+250 PTS) colocadas sobre el pedestal sagrado. Zoram lo acompaña como seguidor hacia las afueras.
  * *Fase 7 (Salida de la Ciudad y Juramento Solemne):* Al salir de los muros (`x = 3100`), sus hermanos huyen aterrados creyendo ver a Labán. Nefi revela su identidad. Zoram entra en pánico al notar el engaño, pero Nefi (siendo de grande estatura) lo sujeta y le jura por el Dios viviente que será un hombre libre y tendrá paz y familia con ellos. Zoram sella el pacto de lealtad.
  * *Fase 8 (Reencuentro de Gozo en la Tienda de Lehí):* Marcha triunfal de toda la familia y Zoram hasta la tienda en el Valle de Lemuel (`x = 3700`). Saríah rompe en llanto de gozo al abrazar a sus hijos vivos. Lehí examina las Planchas de Bronce, certificando los cinco libros de Moisés, las profecías y la genealogía de sus antepasados, y profetiza que jamás perecerán. El nivel culmina con +500 PTS y despliega el Reto de Fe.

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `1 Nefi 4:6`
* **Texto espiritual final:** "Fui guiado por el Espíritu, no sabiendo de antemano lo que tendría que hacer."
* **Puntos de bonificación:** `+500 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué célebre declaración de fe pronunció Nefi cuando sus hermanos se resistían a volver a Jerusalén?"
* **Opciones:**
  1. ✅ **Iré y haré lo que el Señor ha mandado, porque sé que Él nunca da mandamientos sin preparar la vía.** (Correcta)
  2. Esperaremos en el desierto a que Labán decida enviarnos las planchas voluntariamente.
  3. Pediremos a los ancianos del concejo de Jerusalén que intervengan legalmente por nosotros.
* **Explicación espiritual:** *1 Nefi 3:7 es uno de los pasajes fundamentales del Libro de Mormón: enseña que cuando el Señor da un mandamiento, siempre provee los medios para cumplirlo si actuamos con fe y obediencia.*
* **Pregunta:** "¿Por qué mandó el Espíritu a Nefi que obtuviera las planchas de bronce aun a costa de la vida de Labán?"
* **Opciones:**
  1. Para vender las planchas de bronce en Egipto por una inmensa suma de riquezas.
  2. ✅ **Porque era preferible que muriese un hombre inicuo a permitir que una nación entera degenerara y pereciera en la incredulidad sin las escrituras.** (Correcta)
  3. Porque Labán había prometido entregar las planchas si alguien lo derrotaba en duelo público.
* **Explicación espiritual:** *1 Nefi 4:13 enseña un principio de preservación espiritual: sin los anales sagrados que contenían la ley de Dios, los descendientes de Lehí habrían perecido espiritualmente en la incredulidad.*

---
### 📍 Nivel 1.3: La Construcción del Barco
* **Descripción corta:** *Consigue madera del bosque, herramientas de la montaña y construye el barco en la playa.*
* **Personaje en juego:** `nefi (por defecto)`
* **Extensión del escenario (`maxScroll`):** `3000 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **2** (boar), Coleccionables (Monedas/Frutos/Tesoros): **0**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Construyendo el Barco con Fe
* **Texto Doctrinal (`introText`):** "El Señor manda a Nefi construir un barco para cruzar el gran océano hacia la tierra prometida. A pesar de las burlas y el escepticismo de Lamán y Lemuel, Nefi obedece con fe inquebrantable. Reúne los materiales necesarios (madera de cedro de los bosques y herramientas de metal forjadas en la montaña) y edifica el barco para emprender el viaje sagrado."
* **Objetivo Declarado (`introObjective`):** "Recolecta madera y metal, esquiva a las fieras y construye las 5 fases del barco en la playa."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Mecánica de Recolección y Construcción (`Crafting`):**
  * Talar árboles golpeándolos con el ataque (`woodCount` hasta 10).
  * Buscar mineral en la cueva de la montaña (`toolCount` hasta 5) para fundir herramientas.
  * Fabricar en la playa usando la tecla **C** para completar las 5 fases de construcción del barco.
  * Ataques de jabalíes salvajes (`boar`) y hermanos rebeldes que lanzan piedras (`projectiles`).
  * Rayo y choque del Espíritu Santo si los hermanos intentan tocar a Nefi (1 Nefi 17:53).

#### Condición de Victoria y Mensaje Doctrinal
* Activación por coordenada de meta (`game.completeLevel`).

#### Reto de Fe (Quiz Doctrinal)
* *Este nivel no utiliza trivia; su evaluación se realiza mediante mecánicas interactivas y cinemáticas.*

---
### 📍 Nivel 1.4: El Viaje a la Tierra Prometida
* **Descripción corta:** *Sobrevive a la tormenta en alta mar durante 60 segundos guardando los mandamientos.*
* **Personaje en juego:** `nefi (por defecto)`
* **Extensión del escenario (`maxScroll`):** `1024 píxeles`
* **Entidades en escena:** Plataformas: **4**, Enemigos: **0** , Coleccionables (Monedas/Frutos/Tesoros): **0**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** El Viaje a la Tierra Prometida
* **Texto Doctrinal (`introText`):** "Durante la travesía por el océano, Lamán y Lemuel se rebelan y atan a Nefi al mástil del barco, provocando la ira del Señor y una gran tempestad. Al cuarto día, temiendo perecer, sus hermanos lo liberan. Nefi ora con fe y la Liahona vuelve a funcionar, calmando los vientos. ¡Sobrevive a la gran tormenta!"
* **Objetivo Declarado (`introObjective`):** "Evita caer al mar, mantén activa la Liahona y resiste la tempestad durante 60 segundos."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Minijuego de Navegación y Supervivencia Marítima:**
  * La cubierta del barco oscila físicamente con balanceo de oleaje (`shipAngle`, `swayDir`).
  * Temporizador de supervivencia de 60 segundos.
  * Rebelión a bordo: la Liahona deja de funcionar si hay conflicto; el jugador debe activar la brújula y resistir las olas gigantes (`giantWaves`) y tentáculos marinos manteniendo la fe.

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `1 Nefi 2:20`
* **Texto espiritual final:** "Si guardan mis mandamientos, prosperarán en la tierra."
* **Puntos de bonificación:** `+300 PTS`

#### Reto de Fe (Quiz Doctrinal)
* *Este nivel no utiliza trivia; su evaluación se realiza mediante mecánicas interactivas y cinemáticas.*

---

---

## MÓDULO 2: 2 NEFI - LA DIVISIÓN Y LA LEY
* **Libros canónicos:** 2 Nefi
* **Personajes destacados:** Nefi, Sam, Jacob, José, Zoram
* **Enseñanzas clave:** Albedrío, Oposición, Templo de Nefi, Doctrina de Cristo
* **Cantidad de niveles:** 4

### 📍 Nivel 2.1: La Advertencia de Huir al Desierto
* **Descripción corta:** *Escapa de las amenazas de tus hermanos lamanitas y guía a tu familia a salvo en la noche.*
* **Personaje en juego:** `nefi (por defecto)`
* **Extensión del escenario (`maxScroll`):** `3200 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **4** (guard_torch), Coleccionables (Monedas/Frutos/Tesoros): **5**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Advertencia de Huir
* **Texto Doctrinal (`introText`):** "Tras llegar a la tierra prometida, surgen graves tensiones. Lamán y Lemuel, llenos de ira, acusan a Nefi de querer gobernarlos y conspiran para quitarle la vida. El Señor advierte a Nefi en una revelación que huya de nuevo al desierto junto con todos los que crean en las amonestaciones de Dios. Escapa sigilosamente en la noche y guía a tu familia."
* **Objetivo Declarado (`introObjective`):** "Guía a Sam, Jacob, José y Zoram por el cañón sin ser detectado por las patrullas lamanitas."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Escape Nocturno por el Cañón (Sigilo y Escolta):** Sam, Jacob, José y Zoram siguen a Nefi. Mecánica de patrullas con antorchas luminosas (`guard_torch`) y zonas oscuras de refugio (`shadows`) para evitar que se desate la alarma.

#### Condición de Victoria y Mensaje Doctrinal
* Activación por coordenada de meta (`game.completeLevel`).

#### Reto de Fe (Quiz Doctrinal)
* *Este nivel no utiliza trivia; su evaluación se realiza mediante mecánicas interactivas y cinemáticas.*

---
### 📍 Nivel 2.2: Fundando la Tierra de Nefi y el Templo
* **Descripción corta:** *Cosecha madera de cedro, pica vetas de metal y erige un hermoso templo al Señor.*
* **Personaje en juego:** `nefi (por defecto)`
* **Extensión del escenario (`maxScroll`):** `3000 píxeles`
* **Entidades en escena:** Plataformas: **5**, Enemigos: **3** (wolf, bear), Coleccionables (Monedas/Frutos/Tesoros): **0**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Edificando un Templo al Señor
* **Texto Doctrinal (`introText`):** "Nefi y su pueblo se establecen en un nuevo lugar al que llaman la Tierra de Nefi. Para adorar al Señor y guardar Sus mandamientos, Nefi decide edificar un templo a semejanza del templo de Salomón, utilizando los abundantes recursos de la región. José le asiste para reunir cedros de los montes y valiosos metales."
* **Objetivo Declarado (`introObjective`):** "Recolecta madera de cedro y vetas de metal, y construye las 4 fases del templo."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Construcción del Templo y Forja de Espadas:** Recolección de madera de cedro en el bosque y extracción de vetas de metal en los riscos para construir en 4 etapas el Templo de Nefi según el modelo de Salomón.

#### Condición de Victoria y Mensaje Doctrinal
* Activación por coordenada de meta (`game.completeLevel`).

#### Reto de Fe (Quiz Doctrinal)
* *Este nivel no utiliza trivia; su evaluación se realiza mediante mecánicas interactivas y cinemáticas.*

---
### 📍 Nivel 2.3: El Sermón de Jacob: Oposición en Todas las Cosas
* **Descripción corta:** *Defiende a tu hermano Jacob mientras enseña la ley, y recupera los pergaminos sagrados de Isaías.*
* **Personaje en juego:** `nefi (por defecto)`
* **Extensión del escenario (`maxScroll`):** `1024 píxeles`
* **Entidades en escena:** Plataformas: **2**, Enemigos: **0** , Coleccionables (Monedas/Frutos/Tesoros): **0**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** El Sermón de Jacob
* **Texto Doctrinal (`introText`):** "Jacob es consagrado por Nefi como sacerdote y enseña al pueblo verdades eternas sobre el albedrío, la caída y la redención del Salvador. Sin embargo, guerreros lamanitas hostiles intentan irrumpir y perturbar el sermón. Defiende las gradas del templo y recupera los sagrados pergaminos de Isaías que caigan durante la revuelta."
* **Objetivo Declarado (`introObjective`):** "Defiende a Jacob de los invasores y recupera al menos 3 pergaminos de Isaías antes de agotarse el tiempo."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Defensa del Sermón de Jacob:** Temporizador contrarreloj donde el jugador debe proteger a Jacob mientras predica y recolectar al menos 3 pergaminos sagrados de Isaías dispersos en el área antes de que finalice el tiempo.

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `2 Nefi 2:11, 26", scrollsBonus);
                    } else {
                        // Restart warning if not enough scrolls
                        game.showNotification("❌ No lograste recuperar suficientes pergaminos de Isaías. Reintentando...`
* **Texto espiritual final:** "Es preciso que haya una oposición en todas las cosas... Existen, pues, las cosas para actuar."
* **Puntos de bonificación:** `+300 PTS`

#### Reto de Fe (Quiz Doctrinal)
* *Este nivel no utiliza trivia; su evaluación se realiza mediante mecánicas interactivas y cinemáticas.*

---
### 📍 Nivel 2.4: La Doctrina de Cristo: El Camino Estrecho y Angosto
* **Descripción corta:** *Avanza por la senda de luz resplandeciente, esquiva las tentaciones de las tinieblas y alcanza la vida eterna.*
* **Personaje en juego:** `nefi (por defecto)`
* **Extensión del escenario (`maxScroll`):** `3000 píxeles`
* **Entidades en escena:** Plataformas: **10**, Enemigos: **0** , Coleccionables (Monedas/Frutos/Tesoros): **5**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** La Doctrina de Cristo
* **Texto Doctrinal (`introText`):** "Nefi escribe sus últimas palabras en las planchas menores. Presenta una hermosa metáfora sobre el camino estrecho y angosto que conduce a la vida eterna. En esta senda de luz, debes avanzar con fe inquebrantable, deleitándote en la palabra de Cristo, y resister los dardos encendidos y las nieblas de tinieblas del adversario."
* **Objetivo Declarado (`introObjective`):** "Sigue la senda dorada, esquiva los dardos de tentación y alcanza el Árbol de la Vida."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Plataformas de Precisión - El Camino Estrecho:** Seguir la senda de luz dorada aferrándose a la barra de hierro, esquivando las nubes de niebla de oscuridad y los dardos de tentación hasta alcanzar el Árbol de la Vida.

#### Condición de Victoria y Mensaje Doctrinal
* Activación por coordenada de meta (`game.completeLevel`).

#### Reto de Fe (Quiz Doctrinal)
* *Este nivel no utiliza trivia; su evaluación se realiza mediante mecánicas interactivas y cinemáticas.*

---

---

## MÓDULO 3: JACOB A OMNI - PROTECTORES DE LOS ANALES
* **Libros canónicos:** Jacob, Enós, Jarom, Omni
* **Personajes destacados:** Jacob, Enós, Jarom, Omni
* **Enseñanzas clave:** Recogimiento de Israel, Oración de corazón, Preservación histórica
* **Cantidad de niveles:** 3

### 📍 Nivel 3.1: La Alegoría del Olivo
* **Descripción corta:** *Ayuda a Jacob a cuidar la viña del Señor y recoger los frutos buenos.*
* **Personaje en juego:** `jacob`
* **Extensión del escenario (`maxScroll`):** `2500 píxeles`
* **Entidades en escena:** Plataformas: **7**, Enemigos: **2** (burlon, soldier), Coleccionables (Monedas/Frutos/Tesoros): **6**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** La Viña del Señor
* **Texto Doctrinal (`introText`):** "El profeta Jacob enseña la famosa alegoría de los olivos cultivados y silvestres. Nos muestra cómo el Amo de la viña trabaja incansablemente junto a sus siervos para salvar sus árboles del decaimiento. Debemos avanzar por la viña, recolectar los frutos buenos y evitar las ramas secas que caen."
* **Objetivo Declarado (`introObjective`):** "Avanza por la viña recolectando frutos del olivo y esquivando obstáculos."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon, soldier`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2200`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Jacob 5:72`
* **Texto espiritual final:** "El Señor de la viña trabaja con nosotros para nutrir las buenas obras."
* **Puntos de bonificación:** `+300 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué representa principalmente la alegoría de los olivos de Jacob?"
* **Opciones:**
  1. La historia agrícola de Jerusalén.
  2. ✅ **La dispersión y recogimiento del pueblo de Israel.** (Correcta)
  3. La construcción de barcos en el desierto.
* **Explicación espiritual:** *Representa el amor de Dios por Israel y su esfuerzo constante por dispersar y congregar a Su pueblo para salvarlo.*

---
### 📍 Nivel 3.2: La Oración de Enós
* **Descripción corta:** *Busca un lugar tranquilo en el bosque para elevar tu alma en oración.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2600 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **2** (burlon), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** La Oración Sincera
* **Texto Doctrinal (`introText`):** "Enós, hijo de Jacob, sale a cazar al bosque cuando las palabras de su padre sobre la vida eterna penetran profundamente su corazón. Siente una gran necesidad de arrepentimiento y de comunicarse con el Creador. Camina por el bosque, supera las distracciones y encuentra el claro iluminado para arrodillarte."
* **Objetivo Declarado (`introObjective`):** "Cruza el espeso bosque esquivando bestias salvajes y clama en oración."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon, burlon`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2300`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Enós 1:5`
* **Texto espiritual final:** "Tu fe te ha salvado. Recibes el perdón por tu sinceridad."
* **Puntos de bonificación:** `+400 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué motivó a Enós a orar con tanta entrega en el bosque?"
* **Opciones:**
  1. Deseaba cazar una bestia muy grande.
  2. ✅ **Las palabras de su padre Jacob sobre la vida eterna calaron su alma.** (Correcta)
  3. Estaba perdido y buscaba el camino a casa.
* **Explicación espiritual:** *Las enseñanzas de su padre Jacob penetraron profundamente en su corazón, sintiendo el hambre espiritual de pedir perdón y consuelo.*

---
### 📍 Nivel 3.3: El Legado de los Anales
* **Descripción corta:** *Pasa los registros sagrados de generación en generación guardando la ley.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **2** (burlon, soldier), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Anales de Generaciones
* **Texto Doctrinal (`introText`):** "El pequeño libro de Jacob es transmitido a Enós, luego a Jarom, Omni, y sucesivamente a través de varios grabadores fieles para mantener la genealogía y las revelaciones. Recorre el cañón montañoso y entrega las planchas al siguiente historiador para preservar la fe de tu pueblo."
* **Objetivo Declarado (`introObjective`):** "Lleva el registro de bronce y oro sano y salvo al templo final."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon, soldier`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Omni 1:25`
* **Texto espiritual final:** "Las planchas sagradas han llegado a salvo a las manos de los reyes."
* **Puntos de bonificación:** `+300 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Por qué era sumamente vital transmitir las planchas de generación en generación?"
* **Opciones:**
  1. Para usarlas como escudo en batallas físicas.
  2. ✅ **Para preservar la ley de Dios, las profecías y la genealogía del pueblo.** (Correcta)
  3. Para vender el oro en tierras lejanas.
* **Explicación espiritual:** *Preservar las escrituras mantuvo viva la memoria espiritual, el idioma y la fe del pueblo nefita a lo largo de los siglos.*

---

---

## MÓDULO 4: MOSÍAH - REYES Y PROFETAS
* **Libros canónicos:** Mosíah
* **Personajes destacados:** Rey Benjamín, Abinadí, Alma padre, Alma hijo
* **Enseñanzas clave:** Servicio al prójimo, Valor de testificar, Convenios de bautismo, Conversión y cambio
* **Cantidad de niveles:** 4

### 📍 Nivel 4.1: El Discurso del Rey Benjamín
* **Descripción corta:** *Escala la torre del templo mientras recolectas ofrendas de servicio para el pueblo.*
* **Personaje en juego:** `lehi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **8**, Enemigos: **1** (burlon), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Servicio y Humildad
* **Texto Doctrinal (`introText`):** "El anciano Rey Benjamín congrega al pueblo en torno al templo para dar su último discurso. Como la multitud es inmensa, hace erigir una gran torre para que todos le escuchen. Acompaña a Benjamín a subir y recolecta las insignias de servicio para el prójimo."
* **Objetivo Declarado (`introObjective`):** "Sube las plataformas altas para llegar a la cima de la torre."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Mosíah 2:17`
* **Texto espiritual final:** "Has transmitido el mensaje de humildad y servicio."
* **Puntos de bonificación:** `+300 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué enseñó el Rey Benjamín acerca del servicio al prójimo?"
* **Opciones:**
  1. Que solo debemos servir a los de nuestra propia familia.
  2. ✅ **Que al servir a nuestros semejantes, estamos sirviendo a Dios.** (Correcta)
  3. Que servir no es tan importante como acumular riquezas.
* **Explicación espiritual:** *El Rey Benjamín enseñó que servir a los demás es la expresión máxima de nuestro servicio y amor a Dios.*

---
### 📍 Nivel 4.2: El Testimonio de Abinadí
* **Descripción corta:** *Ingresa al palacio y testifica con valentía de los mandamientos ante el malvado Rey Noé.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2500 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **2** (soldier), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** El Testigo de la Verdad
* **Texto Doctrinal (`introText`):** "El profeta Abinadí entra disfrazado a la ciudad para amonestar al Rey Noé y a sus sacerdotes corruptos. Lleno del Espíritu del Señor, Abinadí enseña la ley de Moisés y profetiza la venida de Cristo con audacia, a pesar de las amenazas de muerte del rey. Avanza con cuidado por los pasillos del palacio."
* **Objetivo Declarado (`introObjective`):** "Llega al salón del trono del Rey Noé evadiendo a los guardias reales."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`soldier, soldier`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2200`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Mosíah 17:20`
* **Texto espiritual final:** "Has testificado con fidelidad inquebrantable ante los sacerdotes."
* **Puntos de bonificación:** `+400 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿De qué enseñó Abinadí al rey Noé antes de ser martirizado?"
* **Opciones:**
  1. De cómo construir mejores barcos y puertos comerciales.
  2. ✅ **De los diez mandamientos, la ley de Moisés y la venida redentora del Mesías.** (Correcta)
  3. De las profecías sobre las riquezas de oro del reino.
* **Explicación espiritual:** *Abinadí testificó de la necesidad de guardar la ley de Dios y de que Dios mismo bajaría a redimir a Su pueblo.*

---
### 📍 Nivel 4.3: Las Aguas de Mormón
* **Descripción corta:** *Busca a las personas que desean hacer un convenio con Dios y guíalas al refugio del bosque.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2500 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **2** (soldier), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** El Convenio Bautismal
* **Texto Doctrinal (`introText`):** "El sacerdote Alma, habiendo creído en las palabras de Abinadí, huye del palacio y enseña en secreto al pueblo. Se reúnen en el paraje arbolado junto a un hermoso manantial llamado las Aguas de Mormón. Ayuda a guiar a las almas sedientas de la verdad hacia el manantial de agua pura."
* **Objetivo Declarado (`introObjective`):** "Dirige a los creyentes esquivando las patrullas del rey Noé."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`soldier, soldier`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2200`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Mosíah 18:16`
* **Texto espiritual final:** "El pueblo hace un convenio y recibe el bautismo con gran regocijo."
* **Puntos de bonificación:** `+350 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué convenio de discipulado hacen los conversos en las Aguas de Mormón?"
* **Opciones:**
  1. Prometer dar todo su ganado al rey Noé.
  2. ✅ **Estar dispuestos a llevar las cargas de los demás y consolar a los tristes.** (Correcta)
  3. Abandonar sus hogares para vivir solos en el bosque.
* **Explicación espiritual:** *Hacen el convenio de servir a Dios, sobrellevar las cargas ajenas, llorar con los que lloran y ser testigos en todo momento.*

---
### 📍 Nivel 4.4: La Conversión de Alma el Joven
* **Descripción corta:** *Avanza en medio de una gran tormenta hasta que la verdad te sea revelada.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **2** (burlon), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** El Camino del Cambio
* **Texto Doctrinal (`introText`):** "Alma el Joven y los hijos de Mosíah se dedican a combatir la iglesia de Dios. Mientras andan con este fin de rebelión, el ángel del Señor se les aparece en medio de un trueno majestuoso que sacude la tierra. El corazón rebelde debe quebrarse para nacer de nuevo en la luz."
* **Objetivo Declarado (`introObjective`):** "Sobrevive a los rayos y encuentra el arrepentimiento sincero."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon, burlon`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Mosíah 27:24`
* **Texto espiritual final:** "Has nacido del Espíritu y has sido rescatado de las tinieblas."
* **Puntos de bonificación:** `+500 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué asombroso acontecimiento detuvo a Alma el Joven en su rebelión?"
* **Opciones:**
  1. El rey Mosíah lo metió en prisión.
  2. ✅ **Se le apareció un ángel en medio de una tremenda voz de trueno.** (Correcta)
  3. Decidió huir de la ciudad con sus amigos.
* **Explicación espiritual:** *Un ángel del Señor se le apareció y le habló con voz de trueno para llamarlo al arrepentimiento y dejar de perseguir a la iglesia.*

---

---

## MÓDULO 5: ALMA I - MISIONEROS Y MILAGROS
* **Libros canónicos:** Alma (1-39)
* **Personajes destacados:** Alma hijo, Amulek, Ammón, Rey Lamoni
* **Enseñanzas clave:** Servicio desinteresado, Fe ante la opresión, La palabra como semilla
* **Cantidad de niveles:** 3

### 📍 Nivel 5.1: Ammón defiende los rebaños
* **Descripción corta:** *Usa tu honda y bastón para proteger los rebaños del rey Lamoni de los ladrones.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **3**, Enemigos: **2** (burlon, soldier), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Servicio Fiel
* **Texto Doctrinal (`introText`):** "El príncipe Ammón decide servir como siervo del rey lamanita Lamoni. Al llevar los rebaños a las aguas de Sebo, unos ladrones dispersan las ovejas. Ammón manda a sus compañeros a reunir las ovejas mientras él se enfrenta a los asaltantes con valor y fe en el Señor."
* **Objetivo Declarado (`introObjective`):** "Ahuyenta a los dispersadores de rebaños y reúne las ovejas."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon, soldier`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Alma 17:39`
* **Texto espiritual final:** "Has protegido con éxito el rebaño del rey lamanita."
* **Puntos de bonificación:** `+300 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Cómo demostró Ammón su lealtad al rey Lamoni antes de enseñarle?"
* **Opciones:**
  1. Le ofreció tesoros de oro y plata de los nefitas.
  2. ✅ **Se convirtió en su siervo y defendió valientemente sus rebaños en las aguas de Sebo.** (Correcta)
  3. Le ayudó a conquistar otras tribus enemigas.
* **Explicación espiritual:** *Ammón rehusó ser rey y prefirió servir con amor y honestidad, lo que conmovió el corazón de Lamoni.*

---
### 📍 Nivel 5.2: Alma y Amulek en Ammoníah
* **Descripción corta:** *Escapa de la prisión de Ammoníah mientras sus muros tiemblan y se derrumban.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2500 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **0** , Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** El Derrumbe de la Prisión
* **Texto Doctrinal (`introText`):** "Alma y Amulek son atados en prisión y burlados por jueces inicuos. Sin embargo, claman al Señor por fuerzas. Su fe es tan inmensa que las ligaduras se rompen y la tierra tiembla violentamente, derribando los muros de la prisión. Escapa en medio del colapso."
* **Objetivo Declarado (`introObjective`):** "Corre hacia la salida esquivando los escombros que caen."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`sin enemigos`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2200`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Alma 14:27-28`
* **Texto espiritual final:** "Los muros han caído. El Señor os ha librado por vuestra fe."
* **Puntos de bonificación:** `+400 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Por qué se derrumbaron los muros de la prisión en Ammoníah?"
* **Opciones:**
  1. Debido a un gran ariete del ejército nefita.
  2. ✅ **Por el poder del Señor manifestado a través de la gran fe de Alma y Amulek.** (Correcta)
  3. Porque las vigas de madera estaban viejas.
* **Explicación espiritual:** *Alma y Amulek clamaron con fe en Cristo, rompiendo sus cuerdas, tras lo cual un terremoto botó los muros de la cárcel.*

---
### 📍 Nivel 5.3: La Semilla de la Fe
* **Descripción corta:** *Planta y cuida las semillas de la palabra en tu corazón para que crezcan.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **4**, Enemigos: **1** (burlon), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** La Semilla que Crece
* **Texto Doctrinal (`introText`):** "Alma enseña a los humildes zoramitas comparando la palabra de Dios con una semilla. Si es una semilla buena, y le das cabida en tu corazón, empezará a hincharse y a brotar. Evita las dudas (malezas) y nutre la semilla con paciencia y fe."
* **Objetivo Declarado (`introObjective`):** "Siembra y riega las semillas a lo largo del sendero fértil."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Alma 32:28`
* **Texto espiritual final:** "Has plantado la palabra y la nutres para que eche raíces profundas."
* **Puntos de bonificación:** `+300 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué sucede cuando nutres la palabra de Dios con paciencia y fe en tu corazón?"
* **Opciones:**
  1. Se marchita y desaparece por completo.
  2. ✅ **Empieza a hincharse, brotar y echar raíces, convirtiéndose en un árbol.** (Correcta)
  3. Hace que te olvides de tus responsabilidades.
* **Explicación espiritual:** *Alma enseña que la fe se desarrolla al nutrir pacientemente la palabra de verdad, la cual expande el alma.*

---

---

## MÓDULO 6: ALMA II - EL TÍTULO Y LA LIBERTAD
* **Libros canónicos:** Alma (43-63)
* **Personajes destacados:** Capitán Moroni, Helamán, 2,000 Jóvenes Guerreros
* **Enseñanzas clave:** Defensa de la libertad, Preparación integral, Fe y confianza filial
* **Cantidad de niveles:** 3

### 📍 Nivel 6.1: El Título de Libertad
* **Descripción corta:** *Alza el estandarte de libertad en el punto más alto del muro nefita.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **7**, Enemigos: **1** (burlon), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** El Estandarte de Fe
* **Texto Doctrinal (`introText`):** "El Capitán Moroni, lleno de celo por la libertad de su pueblo, rasga su túnica y escribe sobre ella: 'En memoria de nuestro Dios, nuestra religión, nuestra libertad, y nuestra paz, nuestras esposas y nuestros hijos'. Lo ata a un asta y sale al pueblo llamándolos a defender sus derechos. Sube al templo y alza el estandarte."
* **Objetivo Declarado (`introObjective`):** "Escala las plataformas defensivas del muro para izar el Título de Libertad."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Alma 46:12-13`
* **Texto espiritual final:** "El Título de Libertad ondea gloriosamente en lo alto del muro."
* **Puntos de bonificación:** `+300 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué frase emblemática escribió el Capitán Moroni en el Título de Libertad?"
* **Opciones:**
  1. Nefi es nuestro único rey terrenal.
  2. ✅ **En memoria de nuestro Dios, nuestra religión, libertad, paz, esposas e hijos.** (Correcta)
  3. Las planchas de oro pertenecerán a la corona.
* **Explicación espiritual:** *Moroni escribió sobre su túnica rasgada los motivos santos y familiares por los cuales luchar y defender la paz.*

---
### 📍 Nivel 6.2: Las Estratagemas de Moroni
* **Descripción corta:** *Ayuda a levantar las zanjas y terraplenes alrededor de la ciudad desprotegida.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **5**, Enemigos: **1** (soldier), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Defensa Activa
* **Texto Doctrinal (`introText`):** "El Capitán Moroni es sabio. Sabiendo que los ejércitos lamanitas son numerosos, no confía solo en la fuerza humana. Fortifica cada ciudad construyendo altas murallas de tierra y zanjas profundas, de modo que sus enemigos queden estupefactos al ver la gran preparación nefita. Junta madera y piedra."
* **Objetivo Declarado (`introObjective`):** "Recolecta recursos y ayuda a terminar las defensas nefitas."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`soldier`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Alma 49:4-5`
* **Texto espiritual final:** "Las defensas se completaron. Los atacantes han retrocedido intimidados."
* **Puntos de bonificación:** `+350 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Por qué los enemigos no pudieron tomar las ciudades nefitas por sorpresa?"
* **Opciones:**
  1. Porque las ciudades nefitas estaban vacías.
  2. ✅ **Debido a las excelentes fortificaciones, zanjas y torres de vigía ideadas por Moroni.** (Correcta)
  3. Porque los lamanitas decidieron regresar a sus casas.
* **Explicación espiritual:** *Moroni fortificó las murallas y cavó zanjas profundas en las entradas de las ciudades, sorprendiendo y desanimando a los atacantes.*

---
### 📍 Nivel 6.3: Los 2,000 Jóvenes Guerreros
* **Descripción corta:** *Lidera la tropa a través del valle montañoso esquivando las flechas enemigas.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2500 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **2** (soldier), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** La Fe de las Madres
* **Texto Doctrinal (`introText`):** "Los hijos del pueblo pacifista de Anti-Nefi-Lehi toman las armas para defender a sus protectores nefitas. Liderados por el profeta Helamán, estos dos mil jóvenes marchan al combate con un valor asombroso. No dudan en que Dios los protegerá porque sus madres se lo enseñaron."
* **Objetivo Declarado (`introObjective`):** "Dirige a los jóvenes guerreros a la victoria esquivando las flechas."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`soldier, soldier`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2200`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Alma 57:25`
* **Texto espiritual final:** "¡Ni uno solo ha perecido! El poder divino los ha protegido por su gran fe."
* **Puntos de bonificación:** `+500 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Por qué no temían a la muerte los 2,000 jóvenes guerreros de Helamán?"
* **Opciones:**
  1. Porque eran físicamente indestructibles.
  2. ✅ **Porque confiaban en las palabras de sus madres de que Dios los libraría si no dudaban.** (Correcta)
  3. Porque contaban con un armamento muy avanzado.
* **Explicación espiritual:** *Su inmensa fe en el testimonio de sus madres sobre la protección de Dios les dio la valentía necesaria para el combate.*

---

---

## MÓDULO 7: HELAMÁN - MUROS DE PROFECÍA
* **Libros canónicos:** Helamán
* **Personajes destacados:** Nefi hijo, Lehí hijo, Samuel el Lamanita
* **Enseñanzas clave:** Voz apacible del Espíritu, Profecía y fe, Protección divina
* **Cantidad de niveles:** 2

### 📍 Nivel 7.1: Nefi y Lehí en la Prisión
* **Descripción corta:** *Permanece firme en medio de la prisión mientras el fuego sagrado os rodea.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **3**, Enemigos: **1** (burlon), Coleccionables (Monedas/Frutos/Tesoros): **3**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Fuego en la Prisión
* **Texto Doctrinal (`introText`):** "Nefi y Lehí, hijos de Helamán, son capturados por el ejército lamanita y echados en prisión. De pronto, son rodeados por una columna de fuego que no los consume. La tierra tiembla y una voz apacible, como un susurro, llama al pueblo al arrepentimiento. Camina en medio del fuego milagroso."
* **Objetivo Declarado (`introObjective`):** "Cruza la celda rodeada de llamas sagradas que te protegen del peligro."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Helamán 5:43-44`
* **Texto espiritual final:** "El pueblo ha visto la luz y las columnas de fuego."
* **Puntos de bonificación:** `+400 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué rodeó milagrosamente a Nefi y a Lehí en la cárcel?"
* **Opciones:**
  1. Un enjambre de avispas salvajes.
  2. ✅ **Columnas de fuego espiritual que no los quemaban y una voz del cielo.** (Correcta)
  3. Una niebla muy densa y oscura.
* **Explicación espiritual:** *Fueron envueltos por llamas celestiales protectoras que llenaron el lugar de luz, mientras una voz los llamaba al arrepentimiento.*

---
### 📍 Nivel 7.2: Samuel en la Muralla
* **Descripción corta:** *Sube a la muralla y profetiza la venida del Salvador esquivando las flechas.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2500 píxeles`
* **Entidades en escena:** Plataformas: **4**, Enemigos: **1** (burlon), Coleccionables (Monedas/Frutos/Tesoros): **3**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Profeta en el Muro
* **Texto Doctrinal (`introText`):** "El profeta Samuel el Lamanita sube a las murallas de Zarahemla tras haber sido expulsado. Declara las profecías del nacimiento y muerte de Jesucristo. La multitud se enfurece y le arroja piedras y flechas, pero el Espíritu de Dios le protege y nada le daña. Alza tu voz con valor."
* **Objetivo Declarado (`introObjective`):** "Esquiva las piedras y flechas enemigas mientras declaras la verdad."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2200`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Helamán 16:2`
* **Texto espiritual final:** "Has testificado fielmente de las señales del Señor."
* **Puntos de bonificación:** `+450 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Por qué los opositores no lograban herir a Samuel el Lamanita con flechas o piedras?"
* **Opciones:**
  1. Porque vestía una armadura invisible de acero.
  2. ✅ **Porque el Espíritu de Dios estaba sobre él para protegerlo.** (Correcta)
  3. Porque estaba demasiado alto y lejos de su alcance.
* **Explicación espiritual:** *Las escrituras señalan que el Espíritu de Dios estaba con él de tal manera que las flechas y piedras no pudieron darle.*

---

---

## MÓDULO 8: 3 NEFI - LA VISITA DE CRISTO
* **Libros canónicos:** 3 Nefi
* **Personajes destacados:** Nefi el Discípulo, Jesucristo
* **Enseñanzas clave:** Renacimiento espiritual, Testimonio del Resucitado, Amor por la niñez
* **Cantidad de niveles:** 3

### 📍 Nivel 8.1: La Gran Tempestad y Señales
* **Descripción corta:** *Sobrevive a la terrible tormenta, terremotos y tinieblas de la tierra.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2500 píxeles`
* **Entidades en escena:** Plataformas: **3**, Enemigos: **1** (burlon), Coleccionables (Monedas/Frutos/Tesoros): **3**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** La Gran Tempestad
* **Texto Doctrinal (`introText`):** "A la muerte de nuestro Salvador en Jerusalén, se desata una terrible destrucción en las tierras de América. Vientos impetuosos, terremotos y rayos destruyen ciudades enteras, seguidos de una densa y opresiva niebla de tres días de obscuridad total. Avanza con fe en medio de la tempestad."
* **Objetivo Declarado (`introObjective`):** "Cruza las ruinas y abismos en medio de los temblores de la tierra."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2200`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `3 Nefi 8:19`
* **Texto espiritual final:** "Has sobrevivido a las horas de espanto y destrucción."
* **Puntos de bonificación:** `+350 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué catástrofes señalaron la muerte de Jesucristo en la tierra de América?"
* **Opciones:**
  1. Grandes nevadas e inundaciones de hielo.
  2. ✅ **Terribles tempestades, terremotos, incendios y tres días de densa obscuridad.** (Correcta)
  3. Una plaga de langostas que acabó con los sembradíos.
* **Explicación espiritual:** *Las escrituras registran gran destrucción física de ciudades, vientos, sismos y tinieblas que cubrieron la faz de la tierra.*

---
### 📍 Nivel 8.2: La Aparición del Salvador
* **Descripción corta:** *Aproxímate al templo de Abundancia en actitud reverente para escuchar la voz de Dios.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **1**, Enemigos: **0** , Coleccionables (Monedas/Frutos/Tesoros): **3**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** El Mesías Desciende
* **Texto Doctrinal (`introText`):** "El pueblo superviviente se reúne en torno al templo en la tierra de Abundancia. De pronto, escuchan una voz apacible que viene de lo alto, y contemplan a un hombre vestido con una túnica blanca que desciende del cielo. Jesús ha resucitado y se presenta a las ovejas de América."
* **Objetivo Declarado (`introObjective`):** "Camina reverentemente hacia el Salvador en el templo."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`sin enemigos`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `3 Nefi 11:14-15`
* **Texto espiritual final:** "Has tocado las marcas de Sus manos y testificas de Su resurrección."
* **Puntos de bonificación:** `+500 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué dijo la voz del Padre Celestial al presentar a Jesucristo resucitado?"
* **Opciones:**
  1. Que huyeran de la tierra lo más pronto posible.
  2. ✅ **He aquí a mi Hijo Amado, en quien me complazco... a él oíd.** (Correcta)
  3. Que se arrodillaran ante la gran torre del templo.
* **Explicación espiritual:** *El Padre Celestial testificó de Su Hijo Amado en el templo de Abundancia y mandó al pueblo escucharle.*

---
### 📍 Nivel 8.3: Jesús bendice a los niños
* **Descripción corta:** *Acerca a los niños ante el Salvador para que los bendiga y los rodee con ángeles.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **1**, Enemigos: **0** , Coleccionables (Monedas/Frutos/Tesoros): **3**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Ángeles de Fuego
* **Texto Doctrinal (`introText`):** "El Salvador manda traer a los niños pequeños del pueblo y se arrodilla a orar por ellos. Su oración es tan gloriosa que conmueve al pueblo. Los cielos se abren y ángeles descienden envueltos en fuego celestial para rodear y bendecir a los pequeños. Recolecta las estrellas celestiales."
* **Objetivo Declarado (`introObjective`):** "Lleva las bendiciones y guíalos bajo la luz del cielo."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`sin enemigos`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `3 Nefi 17:24`
* **Texto espiritual final:** "Los ángeles ministran a los pequeñitos con infinito amor."
* **Puntos de bonificación:** `+400 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué ocurrió mientras Jesús rodeaba y bendecía a los niños pequeños?"
* **Opciones:**
  1. Comenzó a llover fuertemente sobre el templo.
  2. ✅ **Los cielos se abrieron, bajaron ángeles rodeados de fuego celestial y ministraron a los niños.** (Correcta)
  3. El pueblo lamanita atacó la ciudad.
* **Explicación espiritual:** *Los cielos se abrieron, los ángeles descendieron y rodearon a los niños con un fuego protector celestial.*

---

---

## MÓDULO 9: 4 NEFI Y MORMÓN - RECOPILACIÓN DE REGISTROS
* **Libros canónicos:** 4 Nefi, Mormón
* **Personajes destacados:** Mormón
* **Enseñanzas clave:** Convivencia en armonía, Preservación del testimonio, Perseverancia ante la adversidad
* **Cantidad de niveles:** 2

### 📍 Nivel 9.1: Doscientos Años de Paz
* **Descripción corta:** *Ayuda a reconstruir y edificar una sociedad unida en amor y armonía.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **3**, Enemigos: **0** , Coleccionables (Monedas/Frutos/Tesoros): **3**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** La Sociedad de Sión
* **Texto Doctrinal (`introText`):** "Tras la visita del Salvador, todo el pueblo de nefitas y lamanitas se convierte al Señor. Durante doscientos años no hay envidias, ni ricos ni pobres, sino que todos son libres y comparten todo en común. Disfruta edificar hogares y campos pacíficos."
* **Objetivo Declarado (`introObjective`):** "Recolecta los frutos de la tierra y edifica en paz."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`sin enemigos`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `4 Nefi 1:15-17`
* **Texto espiritual final:** "Has vivido la felicidad de una sociedad unida en amor cristiano."
* **Puntos de bonificación:** `+300 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Cómo era la sociedad de 4 Nefi durante sus 200 años de paz?"
* **Opciones:**
  1. Había constantes guerras por el control de las tierras.
  2. Vivían divididos en ricos y pobres, con disputas constantes.
  3. ✅ **No había contiendas, compartían todo en común y vivían con amor en sus corazones.** (Correcta)
* **Explicación espiritual:** *No existían divisiones de clases ni sectas, el amor de Dios moraba en el pueblo y todo se compartía por igual.*

---
### 📍 Nivel 9.2: Mormón y las Planchas
* **Descripción corta:** *Recopila los registros de las escrituras históricas de las ruinas antes de la gran batalla.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2500 píxeles`
* **Entidades en escena:** Plataformas: **4**, Enemigos: **1** (soldier), Coleccionables (Monedas/Frutos/Tesoros): **3**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** El Compendio Sagrado
* **Texto Doctrinal (`introText`):** "El profeta y líder militar Mormón observa con gran pesar el decaimiento espiritual y las destructivas guerras de su pueblo. Sabiendo que los anales corren peligro de perderse, compila y resume los registros históricos en un único juego de planchas. Ayuda a Mormón a recoger las planchas de las ruinas y ponerlas a salvo."
* **Objetivo Declarado (`introObjective`):** "Encuentra y guarda los registros sagrados de las ruinas."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`soldier`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2200`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Mormón 6:6`
* **Texto espiritual final:** "Los registros compilados han quedado a salvo en el Cerro Cumorah."
* **Puntos de bonificación:** `+450 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué tarea fundamental realizó Mormón con los antiguos registros sagrados?"
* **Opciones:**
  1. Los destruyó para que nadie los pudiera leer.
  2. Los tradujo todos en papel moderno.
  3. ✅ **Compiló y resumió los anales de su pueblo en las Planchas de Oro.** (Correcta)
* **Explicación espiritual:** *Mormón resumió el compendio de cientos de años de historia en un solo volumen de planchas para la posteridad.*

---

---

## MÓDULO 10: ÉTER - LAS BARCAZAS Y LAS PIEDRAS
* **Libros canónicos:** Éter
* **Personajes destacados:** Hermano de Jared
* **Enseñanzas clave:** Fe que mueve montañas, Luz en la oscuridad, Confianza en las tormentas
* **Cantidad de niveles:** 2

### 📍 Nivel 10.1: El Hermano de Jared y la Luz
* **Descripción corta:** *Sube al Monte Shelem para presentar las 16 piedras blancas al Señor.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2500 píxeles`
* **Entidades en escena:** Plataformas: **7**, Enemigos: **1** (burlon), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Fe para ver al Señor
* **Texto Doctrinal (`introText`):** "El hermano de Jared funde de la roca 16 piedras pequeñas y transparentes como cristal. Las lleva a la cima de la montaña muy alta llamada Shelem y suplica al Señor que las toque con su dedo para que brillen en la oscuridad de las barcazas cerradas. Avanza por el escarpado monte."
* **Objetivo Declarado (`introObjective`):** "Escala la escarpada montaña para encontrarte con el Señor."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`burlon`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2200`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Éter 3:6`
* **Texto espiritual final:** "El Señor ha tocado las piedras y tu fe te ha mostrado Su presencia."
* **Puntos de bonificación:** `+400 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Cómo iluminó el Señor las 16 piedras transparentes del hermano de Jared?"
* **Opciones:**
  1. Usando fósforos y ramas de árboles secas.
  2. ✅ **Tocándolas individualmente con Su dedo lleno de gloria celestial.** (Correcta)
  3. Haciéndolas rodar cuesta abajo por la montaña.
* **Explicación espiritual:** *Al ver la inmensa fe del hermano de Jared, el Señor tocó las piedras con Su dedo para que emitieran luz perpetua.*

---
### 📍 Nivel 10.2: Cruce de las Barcazas
* **Descripción corta:** *Navega a través del inmenso océano con viento en popa y luz divina en tu barca.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2500 píxeles`
* **Entidades en escena:** Plataformas: **1**, Enemigos: **0** , Coleccionables (Monedas/Frutos/Tesoros): **3**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Hacia la Tierra Prometida
* **Texto Doctrinal (`introText`):** "El pueblo jaredita entra en las ocho barcas cerradas herméticamente. Sin ventanas, las barcazas dependen de las piedras brillantes del Señor para alumbrarse por dentro. El viento sopla fuertemente empujándolos sobre las olas gigantes del mar. Conduce la barca a salvo a la costa."
* **Objetivo Declarado (`introObjective`):** "Cruza el embravecido mar esquivando tormentas y olas enormes."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`sin enemigos`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2200`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Éter 6:12`
* **Texto espiritual final:** "Las barcazas jareditas han llegado felizmente a las playas."
* **Puntos de bonificación:** `+400 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Cómo guiaban y alumbraban los jareditas sus barcas herméticas en el océano?"
* **Opciones:**
  1. Usando fuego de antorchas y velas comunes.
  2. ✅ **Confiando en el viento soplando sobre las velas y las piedras brillantes tocadas por el Señor.** (Correcta)
  3. Siguiendo una brújula de metal llamada Liahona.
* **Explicación espiritual:** *No podían usar fuego por falta de aire en las barcas cerradas, por lo que usaron las piedras iluminadas divinamente y se encomendaron al viento.*

---

---

## MÓDULO 11: MORONI - LA PROMESA Y EL SELLO
* **Libros canónicos:** Moroni
* **Personajes destacados:** Moroni
* **Enseñanzas clave:** Perseverancia en soledad, Fe, esperanza y caridad, La promesa espiritual
* **Cantidad de niveles:** 2

### 📍 Nivel 11.1: El Camino de la Perseverancia
* **Descripción corta:** *Deambula por el desierto protegiendo los registros sagrados de las patrullas enemigas.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **2** (guard_torch), Coleccionables (Monedas/Frutos/Tesoros): **4**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** Solo con la Verdad
* **Texto Doctrinal (`introText`):** "Tras la gran batalla final, Moroni queda completamente solo. Todos sus seres queridos y su pueblo han perecido. Durante muchos años deambula solitario esquivando las patrullas enemigas que buscan matarlo por no negar su fe en Cristo. Avanza con prudencia y sigilo protegiendo el libro."
* **Objetivo Declarado (`introObjective`):** "Cruza el desierto sigilosamente sin ser descubierto por las patrullas."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`guard_torch, guard_torch`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Moroni 1:1-4`
* **Texto espiritual final:** "Has logrado mantener a salvo el registro sagrado en medio del peligro."
* **Puntos de bonificación:** `+300 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Por qué deambulaba Moroni solo en el desierto durante muchos años?"
* **Opciones:**
  1. Estaba explorando nuevas rutas de comercio.
  2. ✅ **Para salvaguardar las planchas nefitas y no negar su fe en Jesucristo frente a los enemigos.** (Correcta)
  3. Buscaba un tesoro perdido.
* **Explicación espiritual:** *Moroni perseveró fielmente solo en el desierto protegiendo los anales a pesar de que toda su gente había perecido.*

---
### 📍 Nivel 11.2: La Promesa de Moroni
* **Descripción corta:** *Llega a la cumbre del Cerro Cumorah y deposita las planchas sagradas.*
* **Personaje en juego:** `nefi`
* **Extensión del escenario (`maxScroll`):** `2400 píxeles`
* **Entidades en escena:** Plataformas: **6**, Enemigos: **0** , Coleccionables (Monedas/Frutos/Tesoros): **3**

#### Introducción Narrativa del Nivel
* **Título Modal (`introTitle`):** El Depósito Final
* **Texto Doctrinal (`introText`):** "Moroni sabe que su jornada en la tierra está concluyendo. Deposita y sella las Planchas de Oro en una caja de piedra en la falda del Cerro Cumorah. Antes de hacerlo, nos deja una maravillosa promesa: Preguntar a Dios con fe si estas cosas son verdaderas. Escala la cumbre de Cumorah."
* **Objetivo Declarado (`introObjective`):** "Llega a la cima del Cerro Cumorah para sellar el testimonio."

#### Funciones del Ciclo de Vida del Nivel
* `init(game)`: Configura la posición inicial del jugador (`game.player.x, y`), reinicia el puntaje, configura las plataformas fijas, enemigos, coleccionables, puntos de control (`checkpoint`), variables de estado internas y encola los diálogos introductorios (`game.dialogueQueue`).
* `update(game, gameFrame, input)`: Ejecutado a 60 FPS por el motor. Gestiona la lógica interna del nivel: recolección de monedas/recursos, patrullaje de enemigos y daño al jugador, verificación de avance de fases, activación de alarmas y detección del cumplimiento del objetivo final para invocar `game.completeLevel(...)`.
* `draw(ctx, game, gameFrame, camaraX)`: Renderiza el fondo atmosférico del nivel con gradientes o efectos climáticos, siluetas de fondo con efecto parallax relativo a `camaraX`, plataformas decoradas, objetos del escenario (árboles, templos, antorchas, barcos) y enemigos personalizados.

#### Mecánicas Específicas e Implementación Actual
- **Estructura de Juego:** Nivel de avance lateral y plataformas atmosféricas. Superación de obstáculos del terreno, recolección de tesoros/monedas y evasión o derrota de patrullas enemigas (`sin enemigos`).
- **Cierre Pedagógico:** Al llegar al final de la ruta (`x > 2100`), se activa el **Reto de Fe** (Quiz doctrinal interactivo de 1 pregunta).

#### Condición de Victoria y Mensaje Doctrinal
* **Referencia canónica:** `Moroni 10:3-5`
* **Texto espiritual final:** "¡Felicitaciones! Has completado el viaje del Libro de Mormón."
* **Puntos de bonificación:** `+500 PTS`

#### Reto de Fe (Quiz Doctrinal)
* **Pregunta:** "¿Qué asombrosa promesa hace Moroni en el capítulo 10 de su libro?"
* **Opciones:**
  1. Que recibiremos un gran tesoro de monedas de oro físico si excavamos el cerro.
  2. ✅ **Que Dios nos manifestará la verdad de todas las cosas por el poder del Espíritu Santo si preguntamos con fe y corazón sincero.** (Correcta)
  3. Que los nefitas volverían a gobernar las ciudades.
* **Explicación espiritual:** *Promete que el Espíritu Santo manifestará la veracidad del registro sagrado a quienes pregunten sinceramente con fe.*

---

## 4. Resumen Comparativo de Madurez por Módulo

| Módulo | Nombre Doctrinal | Niveles | Mecánica Principal Implementada | Estado Actual |
| :---: | :--- | :---: | :--- | :--- |
| **1** | 1 Nefi - La familia fiel | 4 | Escolta familiar, sigilo en 8 fases (armadura Labán/Zoram), recolección/crafting del barco, tormenta marina de 60s. | **Avanzado y Complejo** |
| **2** | 2 Nefi - La división y la ley | 4 | Sigilo nocturno con antorchas, construcción del templo/espadas, defensa contrarreloj de Jacob, barra de hierro. | **Avanzado y Complejo** |
| **3** | Jacob a Omni - Protectores de los anales | 3 | Plataformas y recolección temática (viña, bosque de Enós, anales) + Quiz interactivo. | *Plantilla Funcional* |
| **4** | Mosíah - Reyes y profetas | 4 | Plataformas temáticas (torre Benjamín, juicio Abinadí, aguas de Mormón, ángel de Alma) + Quiz interactivo. | *Plantilla Funcional* |
| **5** | Alma I - Misioneros y milagros | 3 | Plataformas temáticas (rebaños de Sebo, cárcel de Ammoníah, semilla de la fe) + Quiz interactivo. | *Plantilla Funcional* |
| **6** | Alma II - El título y la libertad | 3 | Plataformas temáticas (estandarte de libertad, fortificaciones, 2,000 guerreros) + Quiz interactivo. | *Plantilla Funcional* |
| **7** | Helamán - Muros de profecía | 2 | Plataformas temáticas (cárcel de fuego, muralla de Samuel el Lamanita) + Quiz interactivo. | *Plantilla Funcional* |
| **8** | 3 Nefi - La visita de Cristo | 3 | Plataformas y avance reverente (tempestad, aparición de Cristo en el templo, bendición de niños) + Quiz. | *Plantilla Funcional* |
| **9** | 4 Nefi y Mormón - Recopilación | 2 | Plataformas temáticas (sociedad de paz, escondite de planchas en Cumorah) + Quiz interactivo. | *Plantilla Funcional* |
| **10** | Éter - Las barcazas y las piedras | 2 | Plataformas temáticas (ascenso al monte Shelem, navegación de barcazas con luz) + Quiz interactivo. | *Plantilla Funcional* |
| **11** | Moroni - La promesa y el sello | 2 | Plataformas de sigilo y ascenso (desierto solitario, depósito de planchas en Cumorah) + Quiz interactivo. | *Plantilla Funcional* |

---

## 5. Instrucciones para la Definición de Nuevos Requisitos

Para facilitarte la estructuración del documento de especificaciones donde indicarás cómo quieres que funcione cada nivel, te recomendamos organizar cada etapa con los siguientes apartados:

```markdown
### Módulo X - Nivel Y: [Nombre del Nivel]
1. **Propósito Doctrinal y Referencia:** (Pasajes y lección que debe aprender el jugador).
2. **Personaje Principal y Aliados:** (Quién controla el jugador y si hay acompañantes o NPCs).
3. **Mecánica de Juego Deseada:** (Plataformas, sigilo, puzzle, recolección/crafteo, defensa de oleadas, minijuego musical o rítmico, boss fight pacífica o bíblica, runner, etc.).
4. **Condiciones de Victoria y Derrota:** (Qué debe lograr exactamente y qué le hace perder Fe).
5. **Eventos Cinemáticos o Diálogos:** (Qué conversaciones o escenas ocurren al inicio, intermedio y final).
6. **Reto de Fe / Quiz:** (Preguntas deseadas, opciones y mensaje explicativo).
```
