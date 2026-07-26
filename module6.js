// Module 6: Alma (Part 2) - Captain Moroni and the Wars
const module6 = {
    id: 6,
    name: "Alma II - El título y la libertad",
    libros: ["Alma (43-63)"],
    personajes: ["Capitán Moroni", "Helamán", "2,000 Jóvenes Guerreros"],
    enseñanzas: ["Defensa de la libertad", "Preparación integral", "Fe y confianza filial"],
    unlocked: true,
    levels: [
        // LEVEL 1: Title of Liberty
        {
            id: 1,
            name: "El Título de Libertad",
            desc: "Alza el estandarte de libertad en el punto más alto del muro nefita.",
            maxScroll: 2400,
            introTitle: "El Estandarte de Fe",
            introText: "El Capitán Moroni, lleno de celo por la libertad de su pueblo, rasga su túnica y escribe sobre ella: 'En memoria de nuestro Dios, nuestra religión, nuestra libertad, y nuestra paz, nuestras esposas y nuestros hijos'. Lo ata a un asta y sale al pueblo llamándolos a defender sus derechos. Sube al templo y alza el estandarte.",
            introObjective: "Escala las plataformas defensivas del muro para izar el Título de Libertad.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 800, height: 100, tipo: "suelo" },
                    { x: 300, y: 420, width: 200, height: 80, tipo: "plataforma" },
                    { x: 600, y: 340, width: 180, height: 60, tipo: "plataforma" },
                    { x: 900, y: 260, width: 220, height: 240, tipo: "bloque" },
                    { x: 1200, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 1400, y: 410, width: 250, height: 90, tipo: "bloque" },
                    { x: 1800, y: 220, width: 200, height: 280, tipo: "bloque" }
                ];

                this.monedas = [
                    { x: 380, y: 380, collected: false },
                    { x: 680, y: 300, collected: false },
                    { x: 1450, y: 350, collected: false },
                    { x: 1900, y: 170, collected: false }
                ];

                this.enemies = [
                    { x: 1300, y: 428, type: "burlon", hp: 1, range: 80, startX: 1300, dir: -1, width: 40, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Capitán Moroni", text: "¡Alcemos este título y pidamos la bendición de la libertad sobre toda nuestra tierra!" },
                    { char: "Capitán Moroni", text: "Quienes mantengan el pacto del Señor, salid y mantened vuestros derechos." }
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

                if (game.player.x > 1900 && game.player.y < 230) {
                    game.completeLevel("El Título de Libertad ondea gloriosamente en lo alto del muro.", "Alma 46:12-13", 300);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#002b49");
                grad.addColorStop(1, "#0d1b2a");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Platforms
                ctx.fillStyle = "#475569";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#94a3b8";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                    ctx.fillStyle = "#475569";
                });

                // Coins
                ctx.fillStyle = "#00bfff";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Title of liberty flag mockup on top
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(1900, 100, 4, 120); // pole
                ctx.fillStyle = "#ffd700";
                ctx.fillRect(1904, 100, 50, 30); // flag
                ctx.fillStyle = "#000000";
                ctx.font = "bold 8px Outfit";
                ctx.fillText("LIBERTAD", 1906, 118);

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Qué frase emblemática escribió el Capitán Moroni en el Título de Libertad?",
                    opciones: [
                        "Nefi es nuestro único rey terrenal.",
                        "En memoria de nuestro Dios, nuestra religión, libertad, paz, esposas e hijos.",
                        "Las planchas de oro pertenecerán a la corona."
                    ],
                    correctaIndex: 1,
                    explicacion: "Moroni escribió sobre su túnica rasgada los motivos santos y familiares por los cuales luchar y defender la paz."
                }
            ]
        },
        // LEVEL 2: Fortifications
        {
            id: 2,
            name: "Las Estratagemas de Moroni",
            desc: "Ayuda a levantar las zanjas y terraplenes alrededor de la ciudad desprotegida.",
            maxScroll: 2400,
            introTitle: "Defensa Activa",
            introText: "El Capitán Moroni es sabio. Sabiendo que los ejércitos lamanitas son numerosos, no confía solo en la fuerza humana. Fortifica cada ciudad construyendo altas murallas de tierra y zanjas profundas, de modo que sus enemigos queden estupefactos al ver la gran preparación nefita. Junta madera y piedra.",
            introObjective: "Recolecta recursos y ayuda a terminar las defensas nefitas.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 900, height: 100, tipo: "suelo" },
                    { x: 350, y: 420, width: 220, height: 80, tipo: "muro" },
                    { x: 650, y: 390, width: 200, height: 30, tipo: "plataforma" },
                    // Gap (representing ditch)
                    { x: 1100, y: 500, width: 1400, height: 100, tipo: "suelo" },
                    { x: 1300, y: 410, width: 220, height: 90, tipo: "bloque" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 750, y: 330, collected: false },
                    { x: 1200, y: 450, collected: false },
                    { x: 1400, y: 350, collected: false }
                ];

                this.enemies = [
                    { x: 500, y: 428, type: "soldier", hp: 2, range: 80, startX: 500, dir: 1, width: 45, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Capitán Moroni", text: "Hemos preparado nuestras ciudades levantando parapetos de tierra y cavando fosos a su alrededor." },
                    { char: "Capitán Moroni", text: "Quien se prepara con sabiduría física y espiritual, resistirá las tormentas con valor." }
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
                    game.completeLevel("Las defensas se completaron. Los atacantes han retrocedido intimidados.", "Alma 49:4-5", 350);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Sandy defense camp background
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#2d302e");
                grad.addColorStop(0.7, "#585e59");
                grad.addColorStop(1, "#3e2723");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Platforms
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#795548";
                    ctx.fillRect(plat.x, plat.y, plat.width, 8);
                });

                // Wood/Metal resources (coins)
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
                    pregunta: "¿Por qué los enemigos no pudieron tomar las ciudades nefitas por sorpresa?",
                    opciones: [
                        "Porque las ciudades nefitas estaban vacías.",
                        "Debido a las excelentes fortificaciones, zanjas y torres de vigía ideadas por Moroni.",
                        "Porque los lamanitas decidieron regresar a sus casas."
                    ],
                    correctaIndex: 1,
                    explicacion: "Moroni fortificó las murallas y cavó zanjas profundas en las entradas de las ciudades, sorprendiendo y desanimando a los atacantes."
                }
            ]
        },
        // LEVEL 3: 2000 Stripling Warriors
        {
            id: 3,
            name: "Los 2,000 Jóvenes Guerreros",
            desc: "Lidera la tropa a través del valle montañoso esquivando las flechas enemigas.",
            maxScroll: 2500,
            introTitle: "La Fe de las Madres",
            introText: "Los hijos del pueblo pacifista de Anti-Nefi-Lehi toman las armas para defender a sus protectores nefitas. Liderados por el profeta Helamán, estos dos mil jóvenes marchan al combate con un valor asombroso. No dudan en que Dios los protegerá porque sus madres se lo enseñaron.",
            introObjective: "Dirige a los jóvenes guerreros a la victoria esquivando las flechas.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1300, height: 100, tipo: "suelo" },
                    { x: 500, y: 410, width: 220, height: 90, tipo: "bloque" },
                    { x: 850, y: 380, width: 180, height: 30, tipo: "plataforma" },
                    { x: 1200, y: 500, width: 1300, height: 100, tipo: "suelo" },
                    { x: 1500, y: 410, width: 200, height: 90, tipo: "bloque" },
                    { x: 1850, y: 380, width: 220, height: 30, tipo: "plataforma" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 900, y: 320, collected: false },
                    { x: 1300, y: 450, collected: false },
                    { x: 1950, y: 320, collected: false }
                ];

                this.enemies = [
                    { x: 700, y: 428, type: "soldier", hp: 2, range: 100, startX: 700, dir: -1, width: 45, height: 72, speed: 2.2, state: "patrol" },
                    { x: 1600, y: 428, type: "soldier", hp: 2, range: 80, startX: 1600, dir: 1, width: 45, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Helamán", text: "Nunca vi valor tan grande en toda mi vida. No temen la muerte; piensan más en la libertad de sus padres que en sus vidas." },
                    { char: "Guerrero Joven", text: "No dudamos de que nuestras madres lo sabían. Dios nos librará si no dudamos." }
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
                    game.completeLevel("¡Ni uno solo ha perecido! El poder divino los ha protegido por su gran fe.", "Alma 57:25", 500);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Evening battlefield sunset
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#3e2723");
                grad.addColorStop(0.5, "#d32f2f");
                grad.addColorStop(1, "#ffd700");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Platforms
                ctx.fillStyle = "#5d4037";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#8d6e63";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
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
                ctx.fillStyle = "#800000";
                this.enemies.forEach(e => {
                    ctx.fillRect(e.x, e.y, e.width, e.height);
                });

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Por qué no temían a la muerte los 2,000 jóvenes guerreros de Helamán?",
                    opciones: [
                        "Porque eran físicamente indestructibles.",
                        "Porque confiaban en las palabras de sus madres de que Dios los libraría si no dudaban.",
                        "Porque contaban con un armamento muy avanzado."
                    ],
                    correctaIndex: 1,
                    explicacion: "Su inmensa fe en el testimonio de sus madres sobre la protección de Dios les dio la valentía necesaria para el combate."
                }
            ]
        }
    ]
};

window.module6 = module6;
