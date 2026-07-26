// Module 11: Moroni - The Promise and the Seal
const module11 = {
    id: 11,
    name: "Moroni - La promesa y el sello",
    libros: ["Moroni"],
    personajes: ["Moroni"],
    enseñanzas: ["Perseverancia en soledad", "Fe, esperanza y caridad", "La promesa espiritual"],
    unlocked: true,
    levels: [
        // LEVEL 1: Wandering Alone
        {
            id: 1,
            name: "El Camino de la Perseverancia",
            desc: "Deambula por el desierto protegiendo los registros sagrados de las patrullas enemigas.",
            maxScroll: 2400,
            introTitle: "Solo con la Verdad",
            introText: "Tras la gran batalla final, Moroni queda completamente solo. Todos sus seres queridos y su pueblo han perecido. Durante muchos años deambula solitario esquivando las patrullas enemigas que buscan matarlo por no negar su fe en Cristo. Avanza con prudencia y sigilo protegiendo el libro.",
            introObjective: "Cruza el desierto sigilosamente sin ser descubierto por las patrullas.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1000, height: 100, tipo: "suelo" },
                    { x: 450, y: 410, width: 220, height: 90, tipo: "muro" },
                    { x: 750, y: 390, width: 180, height: 30, tipo: "plataforma" },
                    { x: 1100, y: 500, width: 1400, height: 100, tipo: "suelo" },
                    { x: 1300, y: 410, width: 200, height: 90, tipo: "bloque" },
                    { x: 1650, y: 380, width: 220, height: 30, tipo: "plataforma" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 800, y: 330, collected: false },
                    { x: 1200, y: 450, collected: false },
                    { x: 1700, y: 320, collected: false }
                ];

                this.enemies = [
                    { x: 600, y: 428, type: "guard_torch", hp: 1, range: 100, startX: 600, dir: 1, width: 50, height: 80, speed: 2, state: "patrol" },
                    { x: 1500, y: 428, type: "guard_torch", hp: 1, range: 120, startX: 1500, dir: -1, width: 50, height: 80, speed: 2.2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Moroni", text: "Vago solo para salvar mi propia vida... y no quiero negar a Cristo." },
                    { char: "Moroni", text: "Escribiré unas pocas palabras más, contrariamente a lo que había supuesto, para beneficio de mis hermanos." }
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

                if (game.player.x > 2100) {
                    game.completeLevel("Has logrado mantener a salvo el registro sagrado en medio del peligro.", "Moroni 1:1-4", 300);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Lonely night desert transition
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#030208");
                grad.addColorStop(0.7, "#140a1d");
                grad.addColorStop(1, "#26132b");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Platforms
                ctx.fillStyle = "#3e2723";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
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

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Por qué deambulaba Moroni solo en el desierto durante muchos años?",
                    opciones: [
                        "Estaba explorando nuevas rutas de comercio.",
                        "Para salvaguardar las planchas nefitas y no negar su fe en Jesucristo frente a los enemigos.",
                        "Buscaba un tesoro perdido."
                    ],
                    correctaIndex: 1,
                    explicacion: "Moroni perseveró fielmente solo en el desierto protegiendo los anales a pesar de que toda su gente había perecido."
                }
            ]
        },
        // LEVEL 2: The Promise
        {
            id: 2,
            name: "La Promesa de Moroni",
            desc: "Llega a la cumbre del Cerro Cumorah y deposita las planchas sagradas.",
            maxScroll: 2400,
            introTitle: "El Depósito Final",
            introText: "Moroni sabe que su jornada en la tierra está concluyendo. Deposita y sella las Planchas de Oro en una caja de piedra en la falda del Cerro Cumorah. Antes de hacerlo, nos deja una maravillosa promesa: Preguntar a Dios con fe si estas cosas son verdaderas. Escala la cumbre de Cumorah.",
            introObjective: "Llega a la cima del Cerro Cumorah para sellar el testimonio.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 800, height: 100, tipo: "suelo" },
                    { x: 450, y: 410, width: 180, height: 90, tipo: "plataforma" },
                    { x: 750, y: 320, width: 200, height: 180, tipo: "bloque" },
                    { x: 1050, y: 240, width: 220, height: 260, tipo: "bloque" },
                    { x: 1350, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 1600, y: 200, width: 350, height: 300, tipo: "bloque" } // Hill summit
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 900, y: 200, collected: false },
                    { x: 1450, y: 450, collected: false }
                ];

                this.enemies = []; // No enemies, pure spiritual climax

                game.dialogueQueue = [
                    { char: "Moroni", text: "Y cuando recibáis estas cosas, os exhorto a que preguntéis a Dios el Eterno Padre, en el nombre de Cristo, si no son verdaderas." },
                    { char: "Moroni", text: "Y si preguntáis con un corazón sincero, con verdadera intención, teniendo fe en Cristo, él os manifestará la verdad de ellas por el poder del Espíritu Santo." }
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

                if (game.player.x > 1650 && game.player.y < 210) {
                    game.completeLevel("¡Felicitaciones! Has completado el viaje del Libro de Mormón.", "Moroni 10:3-5", 500);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Heavenly morning sunrise on Cumorah
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#fff8e1");
                grad.addColorStop(0.5, "#ffe082");
                grad.addColorStop(1, "#ffe082");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Platforms
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#8bc34a";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                });

                // Coins (light rays)
                ctx.fillStyle = "#ffd700";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Golden plates stone chest box mockup on summit
                ctx.fillStyle = "#9e9e9e";
                ctx.fillRect(1750, 180, 40, 20); // stone box
                ctx.fillStyle = "#ffd700";
                ctx.fillRect(1755, 175, 30, 5); // gold plates inside

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Qué asombrosa promesa hace Moroni en el capítulo 10 de su libro?",
                    opciones: [
                        "Que recibiremos un gran tesoro de monedas de oro físico si excavamos el cerro.",
                        "Que Dios nos manifestará la verdad de todas las cosas por el poder del Espíritu Santo si preguntamos con fe y corazón sincero.",
                        "Que los nefitas volverían a gobernar las ciudades."
                    ],
                    correctaIndex: 1,
                    explicacion: "Promete que el Espíritu Santo manifestará la veracidad del registro sagrado a quienes pregunten sinceramente con fe."
                }
            ]
        }
    ]
};

window.module11 = module11;
