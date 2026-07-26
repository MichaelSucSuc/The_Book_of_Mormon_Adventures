// Module 5: Alma (Part 1) - Missions and the Word of God
const module5 = {
    id: 5,
    name: "Alma I - Misioneros y milagros",
    libros: ["Alma (1-39)"],
    personajes: ["Alma hijo", "Amulek", "Ammón", "Rey Lamoni"],
    enseñanzas: ["Servicio desinteresado", "Fe ante la opresión", "La palabra como semilla"],
    unlocked: true,
    levels: [
        // LEVEL 1: Ammon at the Waters of Sebus
        {
            id: 1,
            name: "Ammón defiende los rebaños",
            desc: "Usa tu honda y bastón para proteger los rebaños del rey Lamoni de los ladrones.",
            maxScroll: 2400,
            introTitle: "Servicio Fiel",
            introText: "El príncipe Ammón decide servir como siervo del rey lamanita Lamoni. Al llevar los rebaños a las aguas de Sebo, unos ladrones dispersan las ovejas. Ammón manda a sus compañeros a reunir las ovejas mientras él se enfrenta a los asaltantes con valor y fe en el Señor.",
            introObjective: "Ahuyenta a los dispersadores de rebaños y reúne las ovejas.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 2500, height: 100, tipo: "suelo" },
                    { x: 600, y: 410, width: 150, height: 90, tipo: "bloque" },
                    { x: 1200, y: 410, width: 200, height: 90, tipo: "bloque" }
                ];

                this.monedas = [
                    { x: 350, y: 450, collected: false }, // representing sheep saved
                    { x: 750, y: 450, collected: false },
                    { x: 1100, y: 450, collected: false },
                    { x: 1500, y: 450, collected: false }
                ];

                this.enemies = [
                    { x: 800, y: 428, type: "burlon", hp: 1, range: 100, startX: 800, dir: -1, width: 40, height: 72, speed: 2.2, state: "patrol" },
                    { x: 1400, y: 428, type: "soldier", hp: 2, range: 100, startX: 1400, dir: 1, width: 45, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Ammón", text: "Estad de buen ánimo, hermanos míos, y vayamos en busca de las ovejas; las reuniremos y las guardaremos." },
                    { char: "Ammón", text: "El Señor me sostendrá para proteger los rebaños de mi señor el rey." }
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
                    game.completeLevel("Has protegido con éxito el rebaño del rey lamanita.", "Alma 17:39", 300);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Sebus green fields sunset
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#006400");
                grad.addColorStop(0.5, "#415a77");
                grad.addColorStop(1, "#ffd700");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Water source at Sebus
                ctx.fillStyle = "#00bfff";
                ctx.fillRect(1500, 480, 200, 20);

                // Platforms
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                });

                // Sheep icons representing coins
                ctx.fillStyle = "#ffffff";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y, 10, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = "#000000";
                        ctx.fillRect(m.x + 4, m.y - 4, 3, 3); // eye
                        ctx.fillStyle = "#ffffff";
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
                    pregunta: "¿Cómo demostró Ammón su lealtad al rey Lamoni antes de enseñarle?",
                    opciones: [
                        "Le ofreció tesoros de oro y plata de los nefitas.",
                        "Se convirtió en su siervo y defendió valientemente sus rebaños en las aguas de Sebo.",
                        "Le ayudó a conquistar otras tribus enemigas."
                    ],
                    correctaIndex: 1,
                    explicacion: "Ammón rehusó ser rey y prefirió servir con amor y honestidad, lo que conmovió el corazón de Lamoni."
                }
            ]
        },
        // LEVEL 2: Deliverance from Ammonihah Prison
        {
            id: 2,
            name: "Alma y Amulek en Ammoníah",
            desc: "Escapa de la prisión de Ammoníah mientras sus muros tiemblan y se derrumban.",
            maxScroll: 2500,
            introTitle: "El Derrumbe de la Prisión",
            introText: "Alma y Amulek son atados en prisión y burlados por jueces inicuos. Sin embargo, claman al Señor por fuerzas. Su fe es tan inmensa que las ligaduras se rompen y la tierra tiembla violentamente, derribando los muros de la prisión. Escapa en medio del colapso.",
            introObjective: "Corre hacia la salida esquivando los escombros que caen.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1000, height: 100, tipo: "suelo" },
                    { x: 400, y: 410, width: 220, height: 90, tipo: "muro" },
                    { x: 750, y: 390, width: 180, height: 30, tipo: "plataforma" },
                    { x: 1100, y: 500, width: 1400, height: 100, tipo: "suelo" },
                    { x: 1300, y: 410, width: 200, height: 90, tipo: "bloque" },
                    { x: 1650, y: 380, width: 250, height: 30, tipo: "plataforma" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false },
                    { x: 850, y: 330, collected: false },
                    { x: 1200, y: 450, collected: false },
                    { x: 1750, y: 320, collected: false }
                ];

                this.enemies = []; // No enemies needed, the earthquake is the enemy

                game.dialogueQueue = [
                    { char: "Alma hijo", text: "¿Hasta cuándo sufriremos estos grandes dolores? ¡Oh Señor, danos fuerzas según nuestra fe en Cristo!" },
                    { char: "Amulek", text: "¡Mira, los muros se están partiendo en dos! La mano del Señor está con nosotros." }
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

                // Simulated falling rocks damage
                if (gameFrame % 90 === 0 && game.player.inmune === 0 && game.player.x > 300 && game.player.x < 2000) {
                    game.playerHurt();
                    game.showNotification("⚠️ ¡Cuidado con los escombros que caen!");
                }

                if (game.player.x > 2200) {
                    game.completeLevel("Los muros han caído. El Señor os ha librado por vuestra fe.", "Alma 14:27-28", 400);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Dusty red-brown dungeon
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#2b1c1c");
                grad.addColorStop(0.8, "#1a0f0f");
                grad.addColorStop(1, "#0d0707");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Screen shaking lines
                if (gameFrame % 4 === 0) {
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
                    ctx.beginPath();
                    ctx.moveTo(100, 0);
                    ctx.lineTo(100, 600);
                    ctx.moveTo(800, 0);
                    ctx.lineTo(800, 600);
                    ctx.stroke();
                }

                // Platforms
                ctx.fillStyle = "#5c4033";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#3e2723";
                    ctx.fillRect(plat.x, plat.y, plat.width, 4);
                    ctx.fillStyle = "#5c4033";
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

                // Falling rock warning indicator
                if (game.player.x > 300 && game.player.x < 2000 && gameFrame % 90 < 20) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.35)";
                    ctx.fillRect(game.player.x + 20, 100, 30, 350);
                }

                ctx.restore();
            },
            quiz: [
                {
                    pregunta: "¿Por qué se derrumbaron los muros de la prisión en Ammoníah?",
                    opciones: [
                        "Debido a un gran ariete del ejército nefita.",
                        "Por el poder del Señor manifestado a través de la gran fe de Alma y Amulek.",
                        "Porque las vigas de madera estaban viejas."
                    ],
                    correctaIndex: 1,
                    explicacion: "Alma y Amulek clamaron con fe en Cristo, rompiendo sus cuerdas, tras lo cual un terremoto botó los muros de la cárcel."
                }
            ]
        },
        // LEVEL 3: Seed of Faith
        {
            id: 3,
            name: "La Semilla de la Fe",
            desc: "Planta y cuida las semillas de la palabra en tu corazón para que crezcan.",
            maxScroll: 2400,
            introTitle: "La Semilla que Crece",
            introText: "Alma enseña a los humildes zoramitas comparando la palabra de Dios con una semilla. Si es una semilla buena, y le das cabida en tu corazón, empezará a hincharse y a brotar. Evita las dudas (malezas) y nutre la semilla con paciencia y fe.",
            introObjective: "Siembra y riega las semillas a lo largo del sendero fértil.",
            characterId: "nefi",
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                this.checkpoint = { x: 150, y: 400 };

                this.platforms = [
                    { x: 0, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 500, y: 420, width: 180, height: 80, tipo: "muro" },
                    { x: 800, y: 390, width: 220, height: 30, tipo: "plataforma" },
                    { x: 1200, y: 500, width: 1300, height: 100, tipo: "suelo" }
                ];

                this.monedas = [
                    { x: 300, y: 450, collected: false }, // seeds
                    { x: 750, y: 350, collected: false },
                    { x: 1100, y: 450, collected: false },
                    { x: 1600, y: 450, collected: false }
                ];

                this.enemies = [
                    { x: 600, y: 428, type: "burlon", hp: 1, range: 100, startX: 600, dir: 1, width: 40, height: 72, speed: 2, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Alma hijo", text: "Compararemos la palabra a una semilla. Si dais lugar para que se siembre en vuestro corazón..." },
                    { char: "Alma hijo", text: "Si la alimentáis con fe, diligencia y paciencia, echará raíz y se convertirá en un árbol de vida." }
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
                    game.completeLevel("Has plantado la palabra y la nutres para que eche raíces profundas.", "Alma 32:28", 300);
                }
            },
            draw: function(ctx, game, gameFrame, camaraX) {
                // Soft blue morning sky
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#a1c4fd");
                grad.addColorStop(1, "#c2e9fb");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.save();
                ctx.translate(-camaraX, 0);

                // Growing trees on background
                ctx.fillStyle = "#81c784";
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(200 + i * 400, 300, 15, 200);
                    ctx.beginPath();
                    ctx.arc(207 + i * 400, 290, 35, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Platforms
                ctx.fillStyle = "#8d6e63";
                this.platforms.forEach(plat => {
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    ctx.fillStyle = "#4caf50";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                });

                // Seeds (coins)
                ctx.fillStyle = "#4caf50";
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.beginPath();
                        ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
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
                    pregunta: "¿Qué sucede cuando nutres la palabra de Dios con paciencia y fe en tu corazón?",
                    opciones: [
                        "Se marchita y desaparece por completo.",
                        "Empieza a hincharse, brotar y echar raíces, convirtiéndose en un árbol.",
                        "Hace que te olvides de tus responsabilidades."
                    ],
                    correctaIndex: 1,
                    explicacion: "Alma enseña que la fe se desarrolla al nutrir pacientemente la palabra de verdad, la cual expande el alma."
                }
            ]
        }
    ]
};

window.module5 = module5;
