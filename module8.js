// Module 8: 3 Nephi - The Coming of Christ
const module8 = {
    id: 8,
    name: "3 Nefi - La visita de Cristo",
    libros: ["3 Nefi"],
    personajes: ["Nefi el Discípulo", "Jesucristo"],
    enseñanzas: ["Renacimiento espiritual", "Testimonio del Resucitado", "Amor por la niñez"],
    unlocked: true,
    levels: [
        // LEVEL 1: Great Destruction
        {
            id: 1,
            name: "La Gran Tempestad y Señales",
            desc: "Sobrevive a la terrible tormenta, terremotos y tinieblas de la tierra.",
            maxScroll: 2500,
            introTitle: "La Gran Tempestad",
            introText: "A la muerte de nuestro Salvador en Jerusalén, se desata una terrible destrucción en las tierras de América. Vientos impetuosos, terremotos y rayos destruyen ciudades enteras, seguidos de una densa y opresiva niebla de tres días de obscuridad total. Avanza con fe en medio de la tempestad.",
            introObjective: "Cruza las ruinas y abismos en medio de los temblores de la tierra.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1000, height: 100, tipo: "suelo" },
                    { x: 450, y: 420, width: 180, height: 80, tipo: "plataforma" },
                    // Large Pit
                    { x: 1200, y: 500, width: 1300, height: 100, tipo: "suelo" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 900, y: 350, collected: false },
                    { x: 1300, y: 450, collected: false }
                ];

                this.enemies = [
                    { x: 700, y: 428, type: "burlon", hp: 1, range: 60, startX: 700, dir: 1, width: 40, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Nefi", text: "¡Señor! Toda la tierra tiembla y la oscuridad es tan densa que no podemos encender antorchas." },
                    { char: "Voz Celestial", text: "He aquí, soy Jesucristo, el Hijo de Dios. He venido al mundo para traer luz." }
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
                    game.completeLevel("Has sobrevivido a las horas de espanto y destrucción.", "3 Nefi 8:19", 350);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Almost total darkness sky
                ctx.fillStyle = "#030208";
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Earth shakes
                let shakeOffset = (gameFrame % 10 < 5) ? 2 : -2;

                // Platforms
                ctx.fillStyle = "#263238";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y + shakeOffset, plat.width, plat.height);
                });

                // Coins
                ctx.fillStyle = "#ffb300";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y + shakeOffset, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Qué catástrofes señalaron la muerte de Jesucristo en la tierra de América?",
                    opciones: [
                        "Grandes nevadas e inundaciones de hielo.",
                        "Terribles tempestades, terremotos, incendios y tres días de densa obscuridad.",
                        "Una plaga de langostas que acabó con los sembradíos."
                    ],
                    correctaIndex: 1,
                    explicacion: "Las escrituras registran gran destrucción física de ciudades, vientos, sismos y tinieblas que cubrieron la faz de la tierra."
                }
            ]
        },
        // LEVEL 2: Appearance of Christ
        {
            id: 2,
            name: "La Aparición del Salvador",
            desc: "Aproxímate al templo de Abundancia en actitud reverente para escuchar la voz de Dios.",
            maxScroll: 2400,
            introTitle: "El Mesías Desciende",
            introText: "El pueblo superviviente se reúne en torno al templo en la tierra de Abundancia. De pronto, escuchan una voz apacible que viene de lo alto, y contemplan a un hombre vestido con una túnica blanca que desciende del cielo. Jesús ha resucitado y se presenta a las ovejas de América.",
            introObjective: "Camina reverentemente hacia el Salvador en el templo.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 2500, height: 100, tipo: "suelo" }
                ];

                this.monedas = [
                    { x: 400, y: 450, collected: false },
                    { x: 900, y: 450, collected: false },
                    { x: 1400, y: 450, collected: false }
                ];

                this.enemies = []; // No enemies, pure peaceful moment

                game.dialogueQueue = [
                    { char: "Voz del Padre", text: "He aquí a mi Hijo Amado, en quien me complazco, en quien he glorificado mi nombre; a él oíd." },
                    { char: "Jesucristo", text: "Soy Jesucristo, de quien los profetas testificaron que vendría al mundo." },
                    { char: "Jesucristo", text: "Levantaos y venid a mí, meted vuestras manos en mi costado, para que sepáis que soy el Dios de toda la tierra." }
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
                    game.completeLevel("Has tocado las marcas de Sus manos y testificas de Su resurrección.", "3 Nefi 11:14-15", 500);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Heavenly golden morning sky
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#fffde7");
                grad.addColorStop(0.5, "#ffd54f");
                grad.addColorStop(1, "#ffe082");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Templo de Abundancia mockup
                ctx.fillStyle = "#cfd8dc";
                ctx.fillRect(1800, 200, 500, 300);
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(1900, 100, 100, 100);

                // Platforms
                ctx.fillStyle = "#eceff1";
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

                // Savior glowing figure on the right
                let g = ctx.createRadialGradient(2000, 350, 5, 2000, 350, 60);
                g.addColorStop(0, "rgba(255, 255, 255, 1)");
                g.addColorStop(1, "rgba(255, 255, 255, 0)");
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(2000, 350, 60, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Qué dijo la voz del Padre Celestial al presentar a Jesucristo resucitado?",
                    opciones: [
                        "Que huyeran de la tierra lo más pronto posible.",
                        "He aquí a mi Hijo Amado, en quien me complazco... a él oíd.",
                        "Que se arrodillaran ante la gran torre del templo."
                    ],
                    correctaIndex: 1,
                    explicacion: "El Padre Celestial testificó de Su Hijo Amado en el templo de Abundancia y mandó al pueblo escucharle."
                }
            ]
        },
        // LEVEL 3: Blessing the Children
        {
            id: 3,
            name: "Jesús bendice a los niños",
            desc: "Acerca a los niños ante el Salvador para que los bendiga y los rodee con ángeles.",
            maxScroll: 2400,
            introTitle: "Ángeles de Fuego",
            introText: "El Salvador manda traer a los niños pequeños del pueblo y se arrodilla a orar por ellos. Su oración es tan gloriosa que conmueve al pueblo. Los cielos se abren y ángeles descienden envueltos en fuego celestial para rodear y bendecir a los pequeños. Recolecta las estrellas celestiales.",
            introObjective: "Lleva las bendiciones y guíalos bajo la luz del cielo.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 2500, height: 100, tipo: "suelo" }
                ];

                this.monedas = [
                    { x: 400, y: 450, collected: false },
                    { x: 900, y: 450, collected: false },
                    { x: 1400, y: 450, collected: false }
                ];

                this.enemies = []; // Pure love and light

                game.dialogueQueue = [
                    { char: "Jesucristo", text: "Mirad a vuestros pequeñitos." },
                    { char: "Nefi", text: "Los cielos se abren y ángeles descienden del cielo como si estuvieran en medio de fuego y ministran a los niños." }
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
                    game.completeLevel("Los ángeles ministran a los pequeñitos con infinito amor.", "3 Nefi 17:24", 400);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Purple and Gold sunset sky
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#ea00d9");
                grad.addColorStop(0.5, "#711c91");
                grad.addColorStop(1, "#0d1b2a");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Rays of light descending
                ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(400 + i * 400, 0, 80, 500);
                }

                // Platforms
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#e8f5e9";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                });

                // Coins (as golden hearts)
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
                    pregunta: "¿Qué ocurrió mientras Jesús rodeaba y bendecía a los niños pequeños?",
                    opciones: [
                        "Comenzó a llover fuertemente sobre el templo.",
                        "Los cielos se abrieron, bajaron ángeles rodeados de fuego celestial y ministraron a los niños.",
                        "El pueblo lamanita atacó la ciudad."
                    ],
                    correctaIndex: 1,
                    explicacion: "Los cielos se abrieron, los ángeles descendieron y rodearon a los niños con un fuego protector celestial."
                }
            ]
        }
    ]
};

window.module8 = module8;
