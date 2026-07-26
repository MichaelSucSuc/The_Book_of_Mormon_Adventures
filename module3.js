// Module 3: Jacob, Enos, Jarom, Omni - The Keepers of the Plates
const module3 = {
    id: 3,
    name: "Jacob a Omni - Protectores de los anales",
    libros: ["Jacob", "Enós", "Jarom", "Omni"],
    personajes: ["Jacob", "Enós", "Jarom", "Omni"],
    enseñanzas: ["Recogimiento de Israel", "Oración de corazón", "Preservación histórica"],
    unlocked: true,
    levels: [
        // LEVEL 1: Jacob and the Olive Vineyard
        {
            id: 1,
            name: "La Alegoría del Olivo",
            desc: "Ayuda a Jacob a cuidar la viña del Señor y recoger los frutos buenos.",
            maxScroll: 2500,
            introTitle: "La Viña del Señor",
            introText: "El profeta Jacob enseña la famosa alegoría de los olivos cultivados y silvestres. Nos muestra cómo el Amo de la viña trabaja incansablemente junto a sus siervos para salvar sus árboles del decaimiento. Debemos avanzar por la viña, recolectar los frutos buenos y evitar las ramas secas que caen.",
            introObjective: "Avanza por la viña recolectando frutos del olivo y esquivando obstáculos.",
            characterId: "jacob",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1000, height: 100, tipo: "suelo" },
                    { x: 450, y: 420, width: 150, height: 80, tipo: "muro" },
                    { x: 750, y: 390, width: 200, height: 30, tipo: "plataforma" },
                    { x: 1100, y: 500, width: 1500, height: 100, tipo: "suelo" },
                    { x: 1300, y: 400, width: 220, height: 35, tipo: "plataforma" },
                    { x: 1700, y: 420, width: 180, height: 80, tipo: "bloque" },
                    { x: 2000, y: 380, width: 250, height: 30, tipo: "plataforma" }
                ];

                this.monedas = [
                    { x: 300, y: 440, collected: false },
                    { x: 800, y: 330, collected: false },
                    { x: 1200, y: 440, collected: false },
                    { x: 1400, y: 340, collected: false },
                    { x: 1800, y: 350, collected: false },
                    { x: 2100, y: 320, collected: false }
                ];

                this.enemies = [
                    { x: 600, y: 428, type: "burlon", hp: 1, range: 80, startX: 600, dir: 1, width: 40, height: 72, speed: 2, state: "patrol" },
                    { x: 1500, y: 428, type: "soldier", hp: 2, range: 100, startX: 1500, dir: -1, width: 45, height: 72, speed: 1.8, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Jacob", text: "El Amo de la viña dice: Me duele perder este árbol. Iré y lo podaré, cavaré alrededor de él y lo nutriré." },
                    { char: "Jacob", text: "Esforcémonos con empeño en esta última oportunidad para salvar el fruto de la viña." }
                ];
                game.startDialogue();
            },
            update: function(game, gameFrame, input) {
                // Collect coins
                this.monedas.forEach(m => {
                    if (!m.collected && Math.abs(game.player.x - m.x) < 30 && Math.abs(game.player.y + 40 - m.y) < 40) {
                        m.collected = true;
                        game.score += 100;
                        window.gameAudio.playCoin();
                    }
                });

                // Enemy update and hit logic
                this.enemies.forEach(e => {
                    // Patrol logic
                    e.x += e.speed * e.dir;
                    if (Math.abs(e.x - e.startX) > e.range) {
                        e.dir *= -1;
                    }
                    // Player hit detection
                    if (game.player.inmune === 0 && Math.abs(game.player.x - e.x) < 35 && Math.abs(game.player.y - (game.player.y)) < 40) {
                        game.playerHurt();
                    }
                });

                // Check finish
                if (game.player.x > 2300) {
                    game.completeLevel("El Señor de la viña trabaja con nosotros para nutrir las buenas obras.", "Jacob 5:72", 300);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Sky background
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#1b2a1a");
                grad.addColorStop(1, "#3c5e3a");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Trees silhouettes
                ctx.fillStyle = "#1e331c";
                for (let i = 0; i < 10; i++) {
                    ctx.fillRect(i * 300 - camaraX * 0.3, 200, 40, 300);
                    ctx.beginPath();
                    ctx.arc(i * 300 + 20 - camaraX * 0.3, 180, 60, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Draw platforms
                ctx.save();
                ctx.translate(-camaraX, 0);
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#4caf50";
                    ctx.fillRect(plat.x, plat.y, plat.width, 6);
                    ctx.fillStyle = "#8d6e63";
                });

                // Draw fruit (coins)
                ctx.fillStyle = "#ffeb3b";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Draw enemies
                ctx.fillStyle = "#f44336";
                this.enemies.forEach(e => {
                    ctx.fillRect(e.x, e.y, e.width, e.height);
                });
                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Qué representa principalmente la alegoría de los olivos de Jacob?",
                    opciones: [
                        "La historia agrícola de Jerusalén.",
                        "La dispersión y recogimiento del pueblo de Israel.",
                        "La construcción de barcos en el desierto."
                    ],
                    correctaIndex: 1,
                    explicacion: "Representa el amor de Dios por Israel y su esfuerzo constante por dispersar y congregar a Su pueblo para salvarlo."
                }
            ]
        },
        // LEVEL 2: Enos' Sincere Prayer
        {
            id: 2,
            name: "La Oración de Enós",
            desc: "Busca un lugar tranquilo en el bosque para elevar tu alma en oración.",
            maxScroll: 2600,
            introTitle: "La Oración Sincera",
            introText: "Enós, hijo de Jacob, sale a cazar al bosque cuando las palabras de su padre sobre la vida eterna penetran profundamente su corazón. Siente una gran necesidad de arrepentimiento y de comunicarse con el Creador. Camina por el bosque, supera las distracciones y encuentra el claro iluminado para arrodillarte.",
            introObjective: "Cruza el espeso bosque esquivando bestias salvajes y clama en oración.",
            characterId: "nefi", // Reuses Nefi sprite model
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 600, y: 410, width: 200, height: 90, tipo: "muro" },
                    { x: 950, y: 380, width: 180, height: 30, tipo: "plataforma" },
                    // Pit
                    { x: 1400, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 1600, y: 410, width: 220, height: 90, tipo: "bloque" },
                    { x: 2000, y: 390, width: 150, height: 30, tipo: "plataforma" }
                ];

                this.monedas = [
                    { x: 350, y: 450, collected: false },
                    { x: 800, y: 350, collected: false },
                    { x: 1200, y: 350, collected: false },
                    { x: 1850, y: 350, collected: false }
                ];

                this.enemies = [
                    { x: 800, y: 428, type: "burlon", hp: 1, range: 120, startX: 800, dir: -1, width: 40, height: 72, speed: 2.2, state: "patrol" },
                    { x: 1750, y: 428, type: "burlon", hp: 1, range: 90, startX: 1750, dir: 1, width: 40, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Enós", text: "Mi alma tuvo hambre; y me arrodillé ante mi Hacedor, y clamé a él con potente oración." },
                    { char: "Enós", text: "Clamaré todo el día, y cuando anochezca, aún elevaré mi voz para que mi alma halle paz." }
                ];
                game.startDialogue();
            },
            update: function(game, gameFrame, input) {
                this.monedas.forEach(m => {
                    if (!m.collected && Math.abs(game.player.x - m.x) < 30 && Math.abs(game.player.y + 40 - m.y) < 40) {
                        m.collected = true;
                        game.score += 100;
                        window.gameAudio.playCoin();
                    }
                });

                this.enemies.forEach(e => {
                    e.x += e.speed * e.dir;
                    if (Math.abs(e.x - e.startX) > e.range) e.dir *= -1;
                    if (game.player.inmune === 0 && Math.abs(game.player.x - e.x) < 35 && Math.abs(game.player.y - game.player.y) < 40) {
                        game.playerHurt();
                    }
                });

                if (game.player.x > 2400) {
                    game.completeLevel("Tu fe te ha salvado. Recibes el perdón por tu sinceridad.", "Enós 1:5", 400);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Deep forest sunset sky
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#140a1d");
                grad.addColorStop(0.6, "#2e122b");
                grad.addColorStop(1, "#542c3e");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);
                
                // Draw platforms
                ctx.fillStyle = "#5c4033";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#33691e";
                    ctx.fillRect(plat.x, plat.y, plat.width, 6);
                    ctx.fillStyle = "#5c4033";
                });

                // Coins
                ctx.fillStyle = "#ff9800";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Enemies
                ctx.fillStyle = "#795548";
                this.enemies.forEach(e => {
                    ctx.fillRect(e.x, e.y, e.width, e.height);
                });

                // Glowing prayer spot
                let g = ctx.createRadialGradient(2420, 380, 5, 2420, 380, 50);
                g.addColorStop(0, "rgba(255, 253, 220, 0.8)");
                g.addColorStop(1, "rgba(255, 253, 220, 0)");
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(2420, 380, 50, 0, Math.PI*2);
                ctx.fill();

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Qué motivó a Enós a orar con tanta entrega en el bosque?",
                    opciones: [
                        "Deseaba cazar una bestia muy grande.",
                        "Las palabras de su padre Jacob sobre la vida eterna calaron su alma.",
                        "Estaba perdido y buscaba el camino a casa."
                    ],
                    correctaIndex: 1,
                    explicacion: "Las enseñanzas de su padre Jacob penetraron profundamente en su corazón, sintiendo el hambre espiritual de pedir perdón y consuelo."
                }
            ]
        },
        // LEVEL 3: Relaying the Plates
        {
            id: 3,
            name: "El Legado de los Anales",
            desc: "Pasa los registros sagrados de generación en generación guardando la ley.",
            maxScroll: 2400,
            introTitle: "Anales de Generaciones",
            introText: "El pequeño libro de Jacob es transmitido a Enós, luego a Jarom, Omni, y sucesivamente a través de varios grabadores fieles para mantener la genealogía y las revelaciones. Recorre el cañón montañoso y entrega las planchas al siguiente historiador para preservar la fe de tu pueblo.",
            introObjective: "Lleva el registro de bronce y oro sano y salvo al templo final.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1400, height: 100, tipo: "suelo" },
                    { x: 500, y: 420, width: 250, height: 80, tipo: "muro" },
                    { x: 900, y: 390, width: 200, height: 30, tipo: "plataforma" },
                    { x: 1250, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 1500, y: 420, width: 180, height: 80, tipo: "bloque" },
                    { x: 1850, y: 380, width: 220, height: 30, tipo: "plataforma" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 1000, y: 330, collected: false },
                    { x: 1400, y: 450, collected: false },
                    { x: 1950, y: 320, collected: false }
                ];

                this.enemies = [
                    { x: 700, y: 428, type: "burlon", hp: 1, range: 100, startX: 700, dir: 1, width: 40, height: 72, speed: 2, state: "patrol" },
                    { x: 1600, y: 428, type: "soldier", hp: 2, range: 80, startX: 1600, dir: -1, width: 45, height: 72, speed: 1.8, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Jarom", text: "Es preciso que preservemos estos anales conforme a los mandatos de nuestros padres." },
                    { char: "Omni", text: "Escribo mi pequeña porción para conservar la genealogía de nuestro pueblo ante Dios." }
                ];
                game.startDialogue();
            },
            update: function(game, gameFrame, input) {
                this.monedas.forEach(m => {
                    if (!m.collected && Math.abs(game.player.x - m.x) < 30 && Math.abs(game.player.y + 40 - m.y) < 40) {
                        m.collected = true;
                        game.score += 100;
                        window.gameAudio.playCoin();
                    }
                });

                this.enemies.forEach(e => {
                    e.x += e.speed * e.dir;
                    if (Math.abs(e.x - e.startX) > e.range) e.dir *= -1;
                    if (game.player.inmune === 0 && Math.abs(game.player.x - e.x) < 35 && Math.abs(game.player.y - game.player.y) < 40) {
                        game.playerHurt();
                    }
                });

                if (game.player.x > 2200) {
                    game.completeLevel("Las planchas sagradas han llegado a salvo a las manos de los reyes.", "Omni 1:25", 300);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Gold / Sand canyon background
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#1c140a");
                grad.addColorStop(0.7, "#3e2723");
                grad.addColorStop(1, "#5d4037");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);
                
                // Draw platforms
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#d7ccc8";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                    ctx.fillStyle = "#8d6e63";
                });

                // Coins
                ctx.fillStyle = "#ffd700";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Enemies
                ctx.fillStyle = "#5d4037";
                this.enemies.forEach(e => {
                    ctx.fillRect(e.x, e.y, e.width, e.height);
                });

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Por qué era sumamente vital transmitir las planchas de generación en generación?",
                    opciones: [
                        "Para usarlas como escudo en batallas físicas.",
                        "Para preservar la ley de Dios, las profecías y la genealogía del pueblo.",
                        "Para vender el oro en tierras lejanas."
                    ],
                    correctaIndex: 1,
                    explicacion: "Preservar las escrituras mantuvo viva la memoria espiritual, el idioma y la fe del pueblo nefita a lo largo de los siglos."
                }
            ]
        }
    ]
};

window.module3 = module3;
