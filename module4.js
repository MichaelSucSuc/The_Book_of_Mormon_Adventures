// Module 4: Mosiah - The Kingdom and the Prophets
const module4 = {
    id: 4,
    name: "Mosíah - Reyes y profetas",
    libros: ["Mosíah"],
    personajes: ["Rey Benjamín", "Abinadí", "Alma padre", "Alma hijo"],
    enseñanzas: ["Servicio al prójimo", "Valor de testificar", "Convenios de bautismo", "Conversión y cambio"],
    unlocked: true,
    levels: [
        // LEVEL 1: King Benjamin's Tower
        {
            id: 1,
            name: "El Discurso del Rey Benjamín",
            desc: "Escala la torre del templo mientras recolectas ofrendas de servicio para el pueblo.",
            maxScroll: 2400,
            introTitle: "Servicio y Humildad",
            introText: "El anciano Rey Benjamín congrega al pueblo en torno al templo para dar su último discurso. Como la multitud es inmensa, hace erigir una gran torre para que todos le escuchen. Acompaña a Benjamín a subir y recolecta las insignias de servicio para el prójimo.",
            introObjective: "Sube las plataformas altas para llegar a la cima de la torre.",
            characterId: "lehi", // Uses Lehi's older profile model
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 800, height: 100, tipo: "suelo" },
                    { x: 350, y: 420, width: 150, height: 80, tipo: "plataforma" },
                    { x: 600, y: 340, width: 150, height: 60, tipo: "plataforma" },
                    { x: 850, y: 270, width: 200, height: 230, tipo: "bloque" },
                    { x: 1150, y: 220, width: 180, height: 30, tipo: "plataforma" },
                    { x: 1400, y: 150, width: 220, height: 350, tipo: "bloque" },
                    { x: 1700, y: 220, width: 150, height: 30, tipo: "plataforma" },
                    { x: 1950, y: 500, width: 600, height: 100, tipo: "suelo" }
                ];

                this.monedas = [
                    { x: 420, y: 380, collected: false },
                    { x: 670, y: 300, collected: false },
                    { x: 1240, y: 180, collected: false },
                    { x: 1770, y: 180, collected: false }
                ];

                this.enemies = [
                    { x: 600, y: 428, type: "burlon", hp: 1, range: 60, startX: 600, dir: 1, width: 40, height: 72, speed: 1.5, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Rey Benjamín", text: "Cuando os halláis al servicio de vuestros semejantes, solo estáis al servicio de vuestro Dios." },
                    { char: "Rey Benjamín", text: "Y he aquí, os digo estas cosas para que aprendáis sabiduría de vuestro rey." }
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
                    game.completeLevel("Has transmitido el mensaje de humildad y servicio.", "Mosíah 2:17", 300);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#0d1b2a");
                grad.addColorStop(1, "#415a77");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);
                
                ctx.fillStyle = "#e0aaff";
                this.platforms.forEach(plat => {
                    ctx.fillStyle = "#c084fc";
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#e9d5ff";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                });

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
                    pregunta: "¿Qué enseñó el Rey Benjamín acerca del servicio al prójimo?",
                    opciones: [
                        "Que solo debemos servir a los de nuestra propia familia.",
                        "Que al servir a nuestros semejantes, estamos sirviendo a Dios.",
                        "Que servir no es tan importante como acumular riquezas."
                    ],
                    correctaIndex: 1,
                    explicacion: "El Rey Benjamín enseñó que servir a los demás es la expresión máxima de nuestro servicio y amor a Dios."
                }
            ]
        },
        // LEVEL 2: Abinadi's Courage
        {
            id: 2,
            name: "El Testimonio de Abinadí",
            desc: "Ingresa al palacio y testifica con valentía de los mandamientos ante el malvado Rey Noé.",
            maxScroll: 2500,
            introTitle: "El Testigo de la Verdad",
            introText: "El profeta Abinadí entra disfrazado a la ciudad para amonestar al Rey Noé y a sus sacerdotes corruptos. Lleno del Espíritu del Señor, Abinadí enseña la ley de Moisés y profetiza la venida de Cristo con audacia, a pesar de las amenazas de muerte del rey. Avanza con cuidado por los pasillos del palacio.",
            introObjective: "Llega al salón del trono del Rey Noé evadiendo a los guardias reales.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 550, y: 410, width: 180, height: 90, tipo: "muro" },
                    { x: 850, y: 390, width: 220, height: 30, tipo: "plataforma" },
                    { x: 1250, y: 500, width: 1300, height: 100, tipo: "suelo" },
                    { x: 1500, y: 410, width: 200, height: 90, tipo: "bloque" },
                    { x: 1800, y: 380, width: 250, height: 30, tipo: "plataforma" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 950, y: 330, collected: false },
                    { x: 1400, y: 450, collected: false },
                    { x: 1900, y: 320, collected: false }
                ];

                this.enemies = [
                    { x: 750, y: 428, type: "soldier", hp: 2, range: 80, startX: 750, dir: -1, width: 45, height: 72, speed: 2, state: "patrol" },
                    { x: 1650, y: 428, type: "soldier", hp: 2, range: 100, startX: 1650, dir: 1, width: 45, height: 72, speed: 2.2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Abinadí", text: "No les causaré temor si les hablo de los mandamientos. Dios no permitirá que sea destruido hasta que cumpla mi misión." },
                    { char: "Abinadí", text: "Cristo es la luz y la vida del mundo; sí, una luz que es infinita, que nunca se puede extinguir." }
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
                    game.completeLevel("Has testificado con fidelidad inquebrantable ante los sacerdotes.", "Mosíah 17:20", 400);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Palace interior color gradient
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#3e2723");
                grad.addColorStop(1, "#1a0c00");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Golden Pillars
                ctx.fillStyle = "rgba(255, 215, 0, 0.15)";
                for (let i = 0; i < 6; i++) {
                    ctx.fillRect(i * 450, 50, 40, 450);
                }

                // Platforms
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#ffd700";
                    ctx.fillRect(plat.x, plat.y, plat.width, 4);
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

                // Enemies (Sacerdotes guardias)
                ctx.fillStyle = "#b71c1c";
                this.enemies.forEach(e => {
                    ctx.fillRect(e.x, e.y, e.width, e.height);
                });

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿De qué enseñó Abinadí al rey Noé antes de ser martirizado?",
                    opciones: [
                        "De cómo construir mejores barcos y puertos comerciales.",
                        "De los diez mandamientos, la ley de Moisés y la venida redentora del Mesías.",
                        "De las profecías sobre las riquezas de oro del reino."
                    ],
                    correctaIndex: 1,
                    explicacion: "Abinadí testificó de la necesidad de guardar la ley de Dios y de que Dios mismo bajaría a redimir a Su pueblo."
                }
            ]
        },
        // LEVEL 3: Waters of Mormon
        {
            id: 3,
            name: "Las Aguas de Mormón",
            desc: "Busca a las personas que desean hacer un convenio con Dios y guíalas al refugio del bosque.",
            maxScroll: 2500,
            introTitle: "El Convenio Bautismal",
            introText: "El sacerdote Alma, habiendo creído en las palabras de Abinadí, huye del palacio y enseña en secreto al pueblo. Se reúnen en el paraje arbolado junto a un hermoso manantial llamado las Aguas de Mormón. Ayuda a guiar a las almas sedientas de la verdad hacia el manantial de agua pura.",
            introObjective: "Dirige a los creyentes esquivando las patrullas del rey Noé.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1400, height: 100, tipo: "suelo" },
                    { x: 450, y: 420, width: 180, height: 80, tipo: "muro" },
                    { x: 800, y: 390, width: 220, height: 30, tipo: "plataforma" },
                    { x: 1200, y: 500, width: 1300, height: 100, tipo: "suelo" },
                    { x: 1550, y: 410, width: 200, height: 90, tipo: "bloque" },
                    { x: 1900, y: 380, width: 250, height: 30, tipo: "plataforma" }
                ];

                this.monedas = [
                    { x: 350, y: 450, collected: false },
                    { x: 900, y: 330, collected: false },
                    { x: 1350, y: 450, collected: false },
                    { x: 2000, y: 320, collected: false }
                ];

                this.enemies = [
                    { x: 650, y: 428, type: "soldier", hp: 1, range: 90, startX: 650, dir: 1, width: 45, height: 72, speed: 2, state: "patrol" },
                    { x: 1750, y: 428, type: "soldier", hp: 1, range: 100, startX: 1750, dir: -1, width: 45, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Alma padre", text: "He aquí, aquí están las aguas de Mormón. Desean entrar en el redil de Dios y ser llamados su pueblo." },
                    { char: "Alma padre", text: "Deben estar dispuestos a sobrellevar las cargas los unos de los otros para que sean ligeras." }
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

                if (game.player.x > 2300) {
                    game.completeLevel("El pueblo hace un convenio y recibe el bautismo con gran regocijo.", "Mosíah 18:16", 350);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#0a2342");
                grad.addColorStop(1, "#20639b");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Water glow
                ctx.fillStyle = "rgba(0, 191, 255, 0.25)";
                ctx.fillRect(1800, 480, 700, 100);

                // Platforms
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#81c784";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                    ctx.fillStyle = "#8d6e63";
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

                // Enemies
                ctx.fillStyle = "#37474f";
                this.enemies.forEach(e => {
                    ctx.fillRect(e.x, e.y, e.width, e.height);
                });

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Qué convenio de discipulado hacen los conversos en las Aguas de Mormón?",
                    opciones: [
                        "Prometer dar todo su ganado al rey Noé.",
                        "Estar dispuestos a llevar las cargas de los demás y consolar a los tristes.",
                        "Abandonar sus hogares para vivir solos en el bosque."
                    ],
                    correctaIndex: 1,
                    explicacion: "Hacen el convenio de servir a Dios, sobrellevar las cargas ajenas, llorar con los que lloran y ser testigos en todo momento."
                }
            ]
        },
        // LEVEL 4: Conversion of Alma the Younger
        {
            id: 4,
            name: "La Conversión de Alma el Joven",
            desc: "Avanza en medio de una gran tormenta hasta que la verdad te sea revelada.",
            maxScroll: 2400,
            introTitle: "El Camino del Cambio",
            introText: "Alma el Joven y los hijos de Mosíah se dedican a combatir la iglesia de Dios. Mientras andan con este fin de rebelión, el ángel del Señor se les aparece en medio de un trueno majestuoso que sacude la tierra. El corazón rebelde debe quebrarse para nacer de nuevo en la luz.",
            introObjective: "Sobrevive a los rayos y encuentra el arrepentimiento sincero.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1400, height: 100, tipo: "suelo" },
                    { x: 500, y: 420, width: 220, height: 80, tipo: "muro" },
                    { x: 850, y: 390, width: 180, height: 30, tipo: "plataforma" },
                    { x: 1150, y: 500, width: 1300, height: 100, tipo: "suelo" },
                    { x: 1400, y: 410, width: 240, height: 90, tipo: "bloque" },
                    { x: 1800, y: 370, width: 200, height: 30, tipo: "plataforma" }
                ];

                this.monedas = [
                    { x: 350, y: 450, collected: false },
                    { x: 920, y: 330, collected: false },
                    { x: 1300, y: 450, collected: false },
                    { x: 1900, y: 310, collected: false }
                ];

                this.enemies = [
                    { x: 600, y: 428, type: "burlon", hp: 1, range: 100, startX: 600, dir: 1, width: 40, height: 72, speed: 2.5, state: "patrol" },
                    { x: 1550, y: 428, type: "burlon", hp: 1, range: 100, startX: 1550, dir: -1, width: 40, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Ángel del Señor", text: "Alma, ¡levántate y preséntate! ¿Por qué persigues a la iglesia de Dios?" },
                    { char: "Alma el Joven", text: "Mi alma fue desgarrada con tormento eterno por mis rebeliones... ¡Oh Jesús, ten misericordia de mí!" }
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
                    game.completeLevel("Has nacido del Espíritu y has sido rescatado de las tinieblas.", "Mosíah 27:24", 500);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Stormy purple background
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#191128");
                grad.addColorStop(0.7, "#2e1f47");
                grad.addColorStop(1, "#0a0614");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Lightning flashes
                if (Math.floor(gameFrame / 30) % 4 === 0 && Math.floor(gameFrame / 2) % 3 === 0) {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                    ctx.fillRect(0, 0, 3000, 600);
                }

                // Platforms
                ctx.fillStyle = "#37474f";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#ffd700";
                    ctx.fillRect(plat.x, plat.y, plat.width, 3);
                });

                // Coins (as rays of light)
                ctx.fillStyle = "#ffffff";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Enemies
                ctx.fillStyle = "#4a148c";
                this.enemies.forEach(e => {
                    ctx.fillRect(e.x, e.y, e.width, e.height);
                });

                // Angel's glowing zone at the end
                let g = ctx.createRadialGradient(2250, 350, 5, 2250, 350, 100);
                g.addColorStop(0, "rgba(255, 215, 0, 0.95)");
                g.addColorStop(0.4, "rgba(255, 255, 255, 0.8)");
                g.addColorStop(1, "rgba(255, 215, 0, 0)");
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(2250, 350, 100, 0, Math.PI*2);
                ctx.fill();

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Qué asombroso acontecimiento detuvo a Alma el Joven en su rebelión?",
                    opciones: [
                        "El rey Mosíah lo metió en prisión.",
                        "Se le apareció un ángel en medio de una tremenda voz de trueno.",
                        "Decidió huir de la ciudad con sus amigos."
                    ],
                    correctaIndex: 1,
                    explicacion: "Un ángel del Señor se le apareció y le habló con voz de trueno para llamarlo al arrepentimiento y dejar de perseguir a la iglesia."
                }
            ]
        }
    ]
};

window.module4 = module4;
