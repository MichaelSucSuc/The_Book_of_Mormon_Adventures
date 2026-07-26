// Module 7: Helaman - The Fire of the Spirit and the Wall
const module7 = {
    id: 7,
    name: "Helamán - Muros de profecía",
    libros: ["Helamán"],
    personajes: ["Nefi hijo", "Lehí hijo", "Samuel el Lamanita"],
    enseñanzas: ["Voz apacible del Espíritu", "Profecía y fe", "Protección divina"],
    unlocked: true,
    levels: [
        // LEVEL 1: Fire in the prison
        {
            id: 1,
            name: "Nefi y Lehí en la Prisión",
            desc: "Permanece firme en medio de la prisión mientras el fuego sagrado os rodea.",
            maxScroll: 2400,
            introTitle: "Fuego en la Prisión",
            introText: "Nefi y Lehí, hijos de Helamán, son capturados por el ejército lamanita y echados en prisión. De pronto, son rodeados por una columna de fuego que no los consume. La tierra tiembla y una voz apacible, como un susurro, llama al pueblo al arrepentimiento. Camina en medio del fuego milagroso.",
            introObjective: "Cruza la celda rodeada de llamas sagradas que te protegen del peligro.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 2500, height: 100, tipo: "suelo" },
                    { x: 500, y: 410, width: 220, height: 90, tipo: "bloque" },
                    { x: 1000, y: 410, width: 220, height: 90, tipo: "bloque" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 750, y: 350, collected: false },
                    { x: 1300, y: 450, collected: false }
                ];

                this.enemies = [
                    { x: 800, y: 428, type: "burlon", hp: 1, range: 100, startX: 800, dir: 1, width: 40, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Nefi", text: "El Señor nos rodea con su fuego. ¡No temáis, las llamas no os harán daño!" },
                    { char: "Voz Celestial", text: "Arrepentíos, arrepentíos, y no busquéis más destruir a mis siervos." }
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
                    game.completeLevel("El pueblo ha visto la luz y las columnas de fuego.", "Helamán 5:43-44", 400);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Dark mystical background
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#08020f");
                grad.addColorStop(0.6, "#2c0e37");
                grad.addColorStop(1, "#08020f");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Columna de fuego (mystical pillars of flame)
                let g = ctx.createLinearGradient(1200, 0, 1300, 0);
                g.addColorStop(0, "rgba(255, 110, 64, 0)");
                g.addColorStop(0.5, "rgba(255, 110, 64, 0.4)");
                g.addColorStop(1, "rgba(255, 110, 64, 0)");
                ctx.fillStyle = g;
                ctx.fillRect(1150, 0, 200, 500);

                // Platforms
                ctx.fillStyle = "#3e2723";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#5d4037";
                    ctx.fillRect(plat.x, plat.y, plat.width, 4);
                });

                // Coins (spirit sparks)
                ctx.fillStyle = "#ff6e40";
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
                    pregunta: "¿Qué rodeó milagrosamente a Nefi y a Lehí en la cárcel?",
                    opciones: [
                        "Un enjambre de avispas salvajes.",
                        "Columnas de fuego espiritual que no los quemaban y una voz del cielo.",
                        "Una niebla muy densa y oscura."
                    ],
                    correctaIndex: 1,
                    explicacion: "Fueron envueltos por llamas celestiales protectoras que llenaron el lugar de luz, mientras una voz los llamaba al arrepentimiento."
                }
            ]
        },
        // LEVEL 2: Samuel on the Wall
        {
            id: 2,
            name: "Samuel en la Muralla",
            desc: "Sube a la muralla y profetiza la venida del Salvador esquivando las flechas.",
            maxScroll: 2500,
            introTitle: "Profeta en el Muro",
            introText: "El profeta Samuel el Lamanita sube a las murallas de Zarahemla tras haber sido expulsado. Declara las profecías del nacimiento y muerte de Jesucristo. La multitud se enfurece y le arroja piedras y flechas, pero el Espíritu de Dios le protege y nada le daña. Alza tu voz con valor.",
            introObjective: "Esquiva las piedras y flechas enemigas mientras declaras la verdad.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 800, height: 100, tipo: "suelo" },
                    { x: 450, y: 410, width: 250, height: 90, tipo: "muro" },
                    { x: 800, y: 320, width: 300, height: 180, tipo: "bloque" }, // Zarahemla wall
                    { x: 1200, y: 500, width: 1300, height: 100, tipo: "suelo" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 600, y: 350, collected: false },
                    { x: 950, y: 250, collected: false }
                ];

                this.enemies = [
                    { x: 1300, y: 428, type: "burlon", hp: 1, range: 120, startX: 1300, dir: 1, width: 40, height: 72, speed: 2.2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Samuel el Lamanita", text: "He aquí, os doy una señal: Dentro de cinco años vendrá el Hijo de Dios para redimir a la humanidad." },
                    { char: "Samuel el Lamanita", text: "Habrá una noche entera sin tinieblas, y nacerá una estrella nueva en los cielos." }
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

                // Simulated falling arrows at wall
                if (gameFrame % 60 === 0 && game.player.x > 800 && game.player.x < 1100 && game.player.inmune === 0) {
                    game.playerHurt();
                    game.showNotification("🏹 ¡Una flecha te rozó! ¡Muévete rápido!");
                }

                if (game.player.x > 2100) {
                    game.completeLevel("Has testificado fielmente de las señales del Señor.", "Helamán 16:2", 450);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Sunset sky Zarahemla
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#e65c00");
                grad.addColorStop(1, "#f9d423");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Muralla de Zarahemla
                ctx.fillStyle = "#546e7a";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#78909c";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                });

                // Coins
                ctx.fillStyle = "#ffffff";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Falling arrows mockups
                if (game.player.x > 800 && game.player.x < 1100 && gameFrame % 60 < 15) {
                    ctx.strokeStyle = "#ff0000";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(game.player.x + 10, 100);
                    ctx.lineTo(game.player.x - 10, 200);
                    ctx.stroke();
                }

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Por qué los opositores no lograban herir a Samuel el Lamanita con flechas o piedras?",
                    opciones: [
                        "Porque vestía una armadura invisible de acero.",
                        "Porque el Espíritu de Dios estaba sobre él para protegerlo.",
                        "Porque estaba demasiado alto y lejos de su alcance."
                    ],
                    correctaIndex: 1,
                    explicacion: "Las escrituras señalan que el Espíritu de Dios estaba con él de tal manera que las flechas y piedras no pudieron darle."
                }
            ]
        }
    ]
};

window.module7 = module7;
