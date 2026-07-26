// Module 10: Ether - The Jaredite Nation
const module10 = {
    id: 10,
    name: "Éter - Las barcazas y las piedras",
    libros: ["Éter"],
    personajes: ["Hermano de Jared"],
    enseñanzas: ["Fe que mueve montañas", "Luz en la oscuridad", "Confianza en las tormentas"],
    unlocked: true,
    levels: [
        // LEVEL 1: Mount Shelem
        {
            id: 1,
            name: "El Hermano de Jared y la Luz",
            desc: "Sube al Monte Shelem para presentar las 16 piedras blancas al Señor.",
            maxScroll: 2500,
            introTitle: "Fe para ver al Señor",
            introText: "El hermano de Jared funde de la roca 16 piedras pequeñas y transparentes como cristal. Las lleva a la cima de la montaña muy alta llamada Shelem y suplica al Señor que las toque con su dedo para que brillen en la oscuridad de las barcazas cerradas. Avanza por el escarpado monte.",
            introObjective: "Escala la escarpada montaña para encontrarte con el Señor.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 800, height: 100, tipo: "suelo" },
                    { x: 400, y: 410, width: 180, height: 90, tipo: "plataforma" },
                    { x: 700, y: 320, width: 200, height: 180, tipo: "bloque" },
                    { x: 1000, y: 240, width: 220, height: 260, tipo: "bloque" },
                    { x: 1300, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 1500, y: 410, width: 200, height: 90, tipo: "bloque" },
                    { x: 1800, y: 220, width: 250, height: 280, tipo: "bloque" } // Summit
                ];

                this.monedas = [
                    { x: 450, y: 350, collected: false },
                    { x: 750, y: 260, collected: false },
                    { x: 1100, y: 180, collected: false },
                    { x: 1600, y: 350, collected: false }
                ];

                this.enemies = [
                    { x: 1350, y: 428, type: "burlon", hp: 1, range: 60, startX: 1350, dir: -1, width: 40, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Hermano de Jared", text: "¡Oh Señor! Toca estas piedras con tu dedo, para que brillen en la obscuridad de nuestras barcazas." },
                    { char: "Señor", text: "He aquí, porque sabes que puedo hacer esto, has visto el dedo de mi mano. Ningún hombre ha venido a mí con tanta fe." }
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

                if (game.player.x > 1850 && game.player.y < 230) {
                    game.completeLevel("El Señor ha tocado las piedras y tu fe te ha mostrado Su presencia.", "Éter 3:6", 400);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // High mountain purple-grey sky
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#2c1a4d");
                grad.addColorStop(0.7, "#42285f");
                grad.addColorStop(1, "#180a22");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Platforms
                ctx.fillStyle = "#3e2723";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#a1887f";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                });

                // Stones to gather (coins)
                ctx.fillStyle = "#ffffff";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Heavenly light glow on summit
                let g = ctx.createRadialGradient(1920, 180, 5, 1920, 180, 70);
                g.addColorStop(0, "rgba(255, 235, 59, 1)");
                g.addColorStop(1, "rgba(255, 235, 59, 0)");
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(1920, 180, 70, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Cómo iluminó el Señor las 16 piedras transparentes del hermano de Jared?",
                    opciones: [
                        "Usando fósforos y ramas de árboles secas.",
                        "Tocándolas individualmente con Su dedo lleno de gloria celestial.",
                        "Haciéndolas rodar cuesta abajo por la montaña."
                    ],
                    correctaIndex: 1,
                    explicacion: "Al ver la inmensa fe del hermano de Jared, el Señor tocó las piedras con Su dedo para que emitieran luz perpetua."
                }
            ]
        },
        // LEVEL 2: Jaredite Barges
        {
            id: 2,
            name: "Cruce de las Barcazas",
            desc: "Navega a través del inmenso océano con viento en popa y luz divina en tu barca.",
            maxScroll: 2500,
            introTitle: "Hacia la Tierra Prometida",
            introText: "El pueblo jaredita entra en las ocho barcas cerradas herméticamente. Sin ventanas, las barcazas dependen de las piedras brillantes del Señor para alumbrarse por dentro. El viento sopla fuertemente empujándolos sobre las olas gigantes del mar. Conduce la barca a salvo a la costa.",
            introObjective: "Cruza el embravecido mar esquivando tormentas y olas enormes.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 2500, height: 100, tipo: "suelo" } // representing the surface of water/barge deck
                ];

                this.monedas = [
                    { x: 500, y: 450, collected: false },
                    { x: 1000, y: 450, collected: false },
                    { x: 1500, y: 450, collected: false }
                ];

                this.enemies = []; // Water tempest is the danger

                game.dialogueQueue = [
                    { char: "Hermano de Jared", text: "Aunque nos sepulten las olas gigantes en las profundidades del mar, saldremos a flote porque nuestras barcas son estancas." },
                    { char: "Hermano de Jared", text: "Alabemos al Señor por el viento que nos empuja continuamente hacia la tierra de promisión." }
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

                // Damage from waves rising
                if (gameFrame % 100 === 0 && game.player.inmune === 0 && game.player.x > 300 && game.player.x < 2000) {
                    game.playerHurt();
                    game.showNotification("🌊 ¡Una gran ola golpeó la barcaza! ¡Mantén el equilibrio!");
                }

                if (game.player.x > 2100) {
                    game.completeLevel("Las barcazas jareditas han llegado felizmente a las playas.", "Éter 6:12", 400);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Ocean storm dark teal sky
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#011f26");
                grad.addColorStop(0.7, "#033e4d");
                grad.addColorStop(1, "#015c73");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Wave lines
                ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
                ctx.lineWidth = 4;
                ctx.beginPath();
                for (let i = 0; i < 2500; i += 100) {
                    let wY = 480 + Math.sin(gameFrame * 0.05 + i) * 15;
                    if (i === 0) ctx.moveTo(i, wY);
                    else ctx.lineTo(i, wY);
                }
                ctx.stroke();

                // Platforms (mockup deck of barge)
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
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

                // Barge shape in background
                ctx.fillStyle = "#4e342e";
                ctx.fillRect(game.player.x - 30, 480, 100, 20);

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Cómo guiaban y alumbraban los jareditas sus barcas herméticas en el océano?",
                    opciones: [
                        "Usando fuego de antorchas y velas comunes.",
                        "Confiando en el viento soplando sobre las velas y las piedras brillantes tocadas por el Señor.",
                        "Siguiendo una brújula de metal llamada Liahona."
                    ],
                    correctaIndex: 1,
                    explicacion: "No podían usar fuego por falta de aire en las barcas cerradas, por lo que usaron las piedras iluminadas divinamente y se encomendaron al viento."
                }
            ]
        }
    ]
};

window.module10 = module10;
