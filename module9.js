// Module 9: 4 Nephi and Mormon - The Peace and the Decline
const module9 = {
    id: 9,
    name: "4 Nefi y Mormón - Recopilación de registros",
    libros: ["4 Nefi", "Mormón"],
    personajes: ["Mormón"],
    enseñanzas: ["Convivencia en armonía", "Preservación del testimonio", "Perseverancia ante la adversidad"],
    unlocked: true,
    levels: [
        // LEVEL 1: 200 Years of Peace
        {
            id: 1,
            name: "Doscientos Años de Paz",
            desc: "Ayuda a reconstruir y edificar una sociedad unida en amor y armonía.",
            maxScroll: 2400,
            introTitle: "La Sociedad de Sión",
            introText: "Tras la visita del Salvador, todo el pueblo de nefitas y lamanitas se convierte al Señor. Durante doscientos años no hay envidias, ni ricos ni pobres, sino que todos son libres y comparten todo en común. Disfruta edificar hogares y campos pacíficos.",
            introObjective: "Recolecta los frutos de la tierra y edifica en paz.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 2500, height: 100, tipo: "suelo" },
                    { x: 500, y: 410, width: 180, height: 90, tipo: "bloque" },
                    { x: 1000, y: 410, width: 180, height: 90, tipo: "bloque" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 750, y: 350, collected: false },
                    { x: 1200, y: 450, collected: false }
                ];

                this.enemies = []; // No enemies in this era of peace!

                game.dialogueQueue = [
                    { char: "Mormón", text: "No había contiendas en la tierra a causa del amor de Dios que moraba en el corazón de la gente." },
                    { char: "Mormón", text: "Y no había lamanitas, ni secta alguna; sino que eran uno, hijos de Cristo y herederos del reino." }
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

                if (game.player.x > 2100) {
                    game.completeLevel("Has vivido la felicidad de una sociedad unida en amor cristiano.", "4 Nefi 1:15-17", 300);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Peaceful bright morning sky
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#c2e9fb");
                grad.addColorStop(1, "#fffde7");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Houses silhouettes (homes built)
                ctx.fillStyle = "rgba(139, 195, 74, 0.4)";
                for (let i = 0; i < 6; i++) {
                    ctx.fillRect(200 + i * 400, 350, 80, 150);
                }

                // Platforms
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#8bc34a";
                    ctx.fillRect(plat.x, plat.y, plat.width, 6);
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
                    pregunta: "¿Cómo era la sociedad de 4 Nefi durante sus 200 años de paz?",
                    opciones: [
                        "Había constantes guerras por el control de las tierras.",
                        "Vivían divididos en ricos y pobres, con disputas constantes.",
                        "No había contiendas, compartían todo en común y vivían con amor en sus corazones."
                    ],
                    correctaIndex: 2,
                    explicacion: "No existían divisiones de clases ni sectas, el amor de Dios moraba en el pueblo y todo se compartía por igual."
                }
            ]
        },
        // LEVEL 2: Mormon compiles the records
        {
            id: 2,
            name: "Mormón y las Planchas",
            desc: "Recopila los registros de las escrituras históricas de las ruinas antes de la gran batalla.",
            maxScroll: 2500,
            introTitle: "El Compendio Sagrado",
            introText: "El profeta y líder militar Mormón observa con gran pesar el decaimiento espiritual y las destructivas guerras de su pueblo. Sabiendo que los anales corren peligro de perderse, compila y resume los registros históricos en un único juego de planchas. Ayuda a Mormón a recoger las planchas de las ruinas y ponerlas a salvo.",
            introObjective: "Encuentra y guarda los registros sagrados de las ruinas.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 500, y: 410, width: 220, height: 90, tipo: "muro" },
                    { x: 850, y: 380, width: 180, height: 30, tipo: "plataforma" },
                    { x: 1200, y: 500, width: 1300, height: 100, tipo: "suelo" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 920, y: 320, collected: false },
                    { x: 1400, y: 450, collected: false }
                ];

                this.enemies = [
                    { x: 700, y: 428, type: "soldier", hp: 2, range: 80, startX: 700, dir: -1, width: 45, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Mormón", text: "Hago un registro de las cosas que he visto y oído... Es preciso preservarlas para que el conocimiento no se pierda." },
                    { char: "Mormón", text: "Ocultaré estos registros en el cerro Cumorah para que no sean destruidos por mano del enemigo." }
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
                    game.completeLevel("Los registros compilados han quedado a salvo en el Cerro Cumorah.", "Mormón 6:6", 450);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Sad dark red stormy twilight sky
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#2c0c0c");
                grad.addColorStop(0.5, "#421d1d");
                grad.addColorStop(1, "#180a0a");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Ruined stone shapes
                ctx.fillStyle = "#37474f";
                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(400 + i * 500, 400, 30, 100);
                }

                // Platforms
                ctx.fillStyle = "#4e342e";
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
                    pregunta: "¿Qué tarea fundamental realizó Mormón con los antiguos registros sagrados?",
                    opciones: [
                        "Los destruyó para que nadie los pudiera leer.",
                        "Los tradujo todos en papel moderno.",
                        "Compiló y resumió los anales de su pueblo en las Planchas de Oro."
                    ],
                    correctaIndex: 2,
                    explicacion: "Mormón resumió el compendio de cientos de años de historia en un solo volumen de planchas para la posteridad."
                }
            ]
        }
    ]
};

window.module9 = module9;
