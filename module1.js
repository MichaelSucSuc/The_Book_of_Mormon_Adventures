// Module 1: 1 Nephi - The Faithful Family
const module1 = {
    id: 1,
    name: "1 Nefi - La familia fiel",
    libros: ["1 Nefi"],
    personajes: ["Nefi", "Lehí", "Saríah", "Lamán", "Lemuel", "Sam"],
    enseñanzas: ["Fe y obediencia", "Escrituras de Bronce", "Construcción con fe", "Guiados por la Liahona"],
    unlocked: true,
    levels: [
        // LEVEL 1: Escape from Jerusalem (Escort, Abandoning Riches, Gathering Supplies & Altar of Thanks)
        {
            id: 1,
            name: "Jerusalén - La Huida de Lehí",
            desc: "Obedece el mandamiento del Señor: deja atrás tus riquezas y guía a tu familia por el desierto hasta el Valle de Lemuel.",
            maxScroll: 4200,

            // Level introduction data
            introTitle: "Jerusalén: El Mandato de Salir al Desierto",
            introText: "Año 600 a.C. Tras orar fervientemente por su pueblo, el profeta Lehí vio un pilar de fuego y recibió un libro celestial anunciando la inminente destrucción de Jerusalén. Al salir a testificar de sus abominaciones y del Redentor del mundo, los judíos se enfurecieron e intentaron quitarle la vida. Entonces el Señor le habló en un sueño: 'Bendito eres tú, Lehí... sal para el desierto con tu familia'. Lehí fue obediente y abandonó su casa, su tierra, su oro, su plata y sus objetos preciosos, llevando únicamente a su familia, provisiones y tiendas.",
            introObjective: "Abandona las riquezas terrenales de Jerusalén, recoge provisiones y tiendas, guía a tu familia y edifica un altar de piedras en el Valle de Lemuel.",
            characterId: "lehi",

            // Reto de Fe (Quiz Doctrinal de Cierre)
            quiz: [
                {
                    pregunta: "¿Por qué abandonó Lehí su casa, sus tierras, su oro y su plata para salir al desierto?",
                    opciones: [
                        "Para buscar yacimientos de metales preciosos en la península arábiga.",
                        "Por obedecer el mandato de Dios recibido en un sueño para salvar a su familia de la destrucción.",
                        "Para evadir el pago de tributos militares al rey de Babilonia."
                    ],
                    correctaIndex: 1,
                    explicacion: "1 Nefi 2:2-4 enseña que Lehí fue obediente a la palabra del Señor, abandonando sus riquezas materiales terrenales y llevando solo a su familia, provisiones y tiendas."
                },
                {
                    pregunta: "¿Por qué murmuraban con amargura Lamán y Lemuel en contra de su padre en el desierto?",
                    opciones: [
                        "Porque no conocían el proceder de Dios y creían que Lehí era un hombre visionario llevado por locas imaginaciones.",
                        "Porque Lehí los obligaba a cargar todo el oro y la plata en sus espaldas.",
                        "Porque querían construir un barco de inmediato en lugar de acampar en tiendas."
                    ],
                    correctaIndex: 0,
                    explicacion: "1 Nefi 2:11-12 aclara que murmuraban por la dureza de su corazón, porque no creían que Jerusalén sería destruida ni conocían la manera de proceder del Señor."
                }
            ],

            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;

                // Interactive Tutorial & Divine Guides
                this.tutorials = [
                    { x: 180, text: "Observa los arcones: Lehí abandonó su oro y plata por obediencia (1 Nefi 2:4).", triggered: false },
                    { x: 260, text: "Usa ◀ ▶ para caminar. ¡Tu amada familia seguirá tus pasos!", triggered: false },
                    { x: 500, text: "Presiona Z (o ▲ en pantalla) para saltar muros y fosos.", triggered: false },
                    { x: 920, text: "Presiona X (o ⚔️ en pantalla) para ahuyentar a los soldados y burlones con tu bastón de fe.", triggered: false },
                    { x: 1320, text: "Presiona Abajo ▼ para agacharte al cruzar pasos estrechos.", triggered: false },
                    { x: 3450, text: "¡Hemos llegado al río Lamán! Recoge las 3 piedras sagradas para el altar.", triggered: false }
                ];

                // Checkpoint
                this.checkpoint = { x: 150, y: 400, visited: true };

                // Family queue configuration (Lehí is leading, family follows)
                this.family = [
                    { name: "Saríah", color: "#d2b48c", height: 88, offset: 35, healthy: true, jumping: false, jumpTimer: 0 },
                    { name: "Sam", color: "#a0522d", height: 90, offset: 70, healthy: true, jumping: false, jumpTimer: 0 },
                    { name: "Lamán", color: "#555555", height: 94, offset: 105, healthy: true, jumping: false, jumpTimer: 0, murmuring: false },
                    { name: "Lemuel", color: "#666666", height: 94, offset: 140, healthy: true, jumping: false, jumpTimer: 0, murmuring: false },
                    { name: "Nefi", color: "#0a66d0", height: 86, offset: 175, healthy: true, jumping: false, jumpTimer: 0, praying: false }
                ];

                // Position history buffer for snake following
                this.positionHistory = [];
                for (let i = 0; i < 400; i++) {
                    this.positionHistory.push({ x: 150, y: 400, agachado: false, jumping: false });
                }

                // Level layout: 3 Biomes (Jerusalén -> Desierto/Mar Rojo -> Valle de Lemuel)
                this.platforms = [
                    // ZONA 1: Jerusalén y Murallas (x: 0 a 1450)
                    { x: 0, y: 500, width: 1450, height: 100, tipo: "suelo" },
                    { x: 450, y: 410, width: 150, height: 90, tipo: "muro" },
                    { x: 750, y: 390, width: 220, height: 60, tipo: "plataforma" },
                    { x: 1100, y: 350, width: 180, height: 60, tipo: "plataforma" },

                    // ZONA 2: Desierto y Riberas del Mar Rojo (x: 1600 a 2800)
                    { x: 1600, y: 500, width: 1250, height: 100, tipo: "suelo" },
                    { x: 1750, y: 390, width: 230, height: 50, tipo: "plataforma" },
                    { x: 2100, y: 420, width: 160, height: 80, tipo: "bloque" },
                    { x: 2400, y: 360, width: 220, height: 50, tipo: "plataforma" },

                    // ZONA 3: Valle de Lemuel y Río Lamán (x: 2950 a 4200)
                    { x: 2950, y: 500, width: 1250, height: 100, tipo: "suelo" },
                    { x: 3100, y: 420, width: 200, height: 80, tipo: "bloque" },
                    { x: 3400, y: 440, width: 220, height: 60, tipo: "plataforma" },
                    { x: 3750, y: 470, width: 350, height: 80, tipo: "suelo" }
                ];

                // Architectural decorations
                this.decorations = [
                    { x: 80, y: 220, w: 220, h: 280, label: "Casa de Lehí" },
                    { x: 600, y: 350, w: 90, h: 150, label: "Puerta de Jerusalén" },
                    { x: 1620, y: 440, w: 100, h: 60, label: "Roca del Desierto" },
                    { x: 3320, y: 380, w: 180, h: 120, label: "Tiendas en el Valle" }
                ];

                // Torches placement for fire particle effects
                this.torches = [
                    { x: 330, y: 440 },
                    { x: 590, y: 360 },
                    { x: 700, y: 360 },
                    { x: 1640, y: 430 },
                    { x: 2450, y: 330 },
                    { x: 3260, y: 390 }
                ];

                // Supplies (Provisiones bíblicas - 1 Nefi 2:4)
                // Se reemplazan las monedas por Odres de Agua, Sacos de Grano y Lienzos de Tienda
                this.provisiones = [
                    { x: 380, y: 450, tipo: "grano", name: "Saco de Trigo y Cebada", collected: false },
                    { x: 860, y: 340, tipo: "agua", name: "Odre de Agua Fresca", collected: false },
                    { x: 1180, y: 300, tipo: "tienda", name: "Lienzo de Tienda Familiar", collected: false },
                    { x: 1800, y: 340, tipo: "agua", name: "Odre de Agua del Desierto", collected: false },
                    { x: 2180, y: 370, tipo: "grano", name: "Saco de Higos y Frutos Secos", collected: false },
                    { x: 2480, y: 310, tipo: "tienda", name: "Estacas de Campamento", collected: false },
                    { x: 3050, y: 450, tipo: "grano", name: "Provisiones del Valle", collected: false },
                    { x: 3250, y: 370, tipo: "agua", name: "Agua Dulce del Río Lamán", collected: false },
                    { x: 3480, y: 400, tipo: "tienda", name: "Pabellón de Saríah", collected: false }
                ];

                // Interactive Altar of Stones (1 Nefi 2:7)
                this.altar = {
                    x: 3820,
                    y: 440,
                    width: 70,
                    height: 50,
                    stonesPlaced: 0,
                    maxStones: 3,
                    completed: false,
                    flameIntensity: 0
                };

                // Uncut river stones to gather for the altar
                this.altarStones = [
                    { x: 3560, y: 455, collected: false, name: "Piedra de Cimiento" },
                    { x: 3680, y: 400, collected: false, name: "Piedra de Ofrenda" },
                    { x: 3760, y: 455, collected: false, name: "Piedra de Coronación" }
                ];

                // Enemies: Jerusalem Soldiers and Mockers (1 Nefi 1:19-20)
                this.enemies = [
                    { x: 650, y: 428, type: "soldier", hp: 2, range: 100, startX: 650, dir: -1, width: 45, height: 72, speed: 2, state: "patrol" },
                    { x: 1020, y: 428, type: "burlon", hp: 1, range: 90, startX: 1020, dir: 1, width: 40, height: 72, speed: 3, state: "patrol" },
                    { x: 1950, y: 428, type: "soldier", hp: 2, range: 120, startX: 1950, dir: -1, width: 45, height: 72, speed: 2.2, state: "patrol" },
                    { x: 2320, y: 428, type: "burlon", hp: 1, range: 100, startX: 2320, dir: -1, width: 40, height: 72, speed: 2.8, state: "patrol" }
                ];

                // Dialogue State Triggers
                this.sariahDialogueTriggered = false;
                this.valleyDialogueTriggered = false;
                this.altarDialogueTriggered = false;
                this.finishSpiritualTextShown = false;

                // Initial dialogue (1 Nefi 2:1-4)
                game.dialogueQueue = [
                    { char: "Lehí", text: "El Señor me habló en un sueño: 'Bendito eres tú, Lehí... he aquí, tratan de quitarte la vida. Sal para el desierto con tu familia'." },
                    { char: "Saríah", text: "Dejaremos nuestra casa, nuestro oro y plata, Lehí. El Señor proveerá para nosotros en el desierto." },
                    { char: "Nefi", text: "Iremos con fe, padre. El Señor jamás manda algo sin preparar una vía para que lo cumplamos." }
                ];
                game.startDialogue();
            },

            update: function(game, gameFrame, input) {
                // Record history for family snake following
                this.positionHistory.unshift({
                    x: game.player.x,
                    y: game.player.y,
                    agachado: game.player.agachado,
                    jumping: game.player.jumping
                });
                if (this.positionHistory.length > 400) {
                    this.positionHistory.pop();
                }

                // Update family positions
                this.family.forEach(member => {
                    const posIndex = member.offset;
                    const histPos = this.positionHistory[posIndex] || this.positionHistory[this.positionHistory.length - 1];
                    member.x = histPos.x;
                    member.y = histPos.y;
                    member.agachado = histPos.agachado;
                    member.jumping = histPos.jumping;
                });

                // Dialogue Trigger 1: Murmuring of Laman and Lemuel by the Red Sea (1 Nefi 2:11-14)
                if (!this.sariahDialogueTriggered && game.player.x > 1700 && game.player.grounded && Math.abs(game.player.velX) < 2) {
                    this.sariahDialogueTriggered = true;
                    this.family[2].murmuring = true; // Lamán
                    this.family[3].murmuring = true; // Lemuel
                    game.dialogueQueue = [
                        { char: "Lamán", text: "¡Esto es una locura! Nos has sacado de la tierra de nuestra herencia, de nuestro oro y plata, para hacernos perecer en este desierto ardiente." },
                        { char: "Lemuel", text: "¡Sí! ¡Eres un hombre visionario llevado por las locas imaginaciones de tu corazón! ¡Jerusalén jamás será destruida!" },
                        { char: "Lehí", text: "¡Silencio y escuchad! El Señor destruirá la iniquidad de Jerusalén, mas Sus entrañables misericordias fortalecen a los que acuden a Él con fe." }
                    ];
                    game.startDialogue();
                }

                // Dialogue Trigger 2: Arrival at Valley of Lemuel and River Laman (1 Nefi 2:8-10)
                if (!this.valleyDialogueTriggered && game.player.x > 3380 && game.player.grounded && Math.abs(game.player.velX) < 2) {
                    this.valleyDialogueTriggered = true;
                    this.family[2].murmuring = false;
                    this.family[3].murmuring = false;
                    game.dialogueQueue = [
                        { char: "Lehí", text: "¡Alabado sea el Señor! Tras tres días por el desierto, hemos hallado este valle fértil y un río de aguas vivas que desagua en el Mar Rojo." },
                        { char: "Lehí", text: "¡Oh Lamán, si fueras semejante a este río, fluyendo continuamente en la fuente de toda rectitud!" },
                        { char: "Lehí", text: "¡Oh Lemuel, si fueras semejante a este valle, firme, constante e inmutable en guardar los mandamientos de Dios!" },
                        { char: "Lehí", text: "Acerquémonos a la orilla del río para levantar un altar de piedras y dar gracias a nuestro Dios." }
                    ];
                    game.startDialogue();
                }

                // Update tutorial notifications
                this.tutorials.forEach(t => {
                    if (!t.triggered && game.player.x >= t.x) {
                        t.triggered = true;
                        game.showNotification(t.text);
                    }
                });

                // Update supplies collection (Provisiones)
                this.provisiones.forEach(p => {
                    if (!p.collected && game.collides(game.player, { x: p.x - 14, y: p.y - 14, width: 28, height: 28 })) {
                        p.collected = true;
                        game.score += 60;
                        window.gameAudio.playCoin();
                        game.showNotification("✨ Recogido: " + p.name + " (+60 PTS)");
                    }
                });

                // Update Altar Stones Collection
                let stonesCarried = 0;
                this.altarStones.forEach(s => {
                    if (!s.collected && game.collides(game.player, { x: s.x - 14, y: s.y - 14, width: 28, height: 28 })) {
                        s.collected = true;
                        window.gameAudio.playPowerUp();
                        let totalGathered = this.altarStones.filter(st => st.collected).length;
                        game.showNotification("🪨 " + s.name + " recogida (" + totalGathered + "/3). ¡Llévala al altar!");
                    }
                    if (s.collected) stonesCarried++;
                });

                // Build Altar Interaction (near x = 3820)
                if (!this.altar.completed && stonesCarried > this.altar.stonesPlaced) {
                    let distToAltar = Math.abs(game.player.x - this.altar.x);
                    if (distToAltar < 70) {
                        // Place stone automatically or with C/Attack key
                        this.altar.stonesPlaced = stonesCarried;
                        window.gameAudio.playPowerUp();

                        if (this.altar.stonesPlaced < 3) {
                            game.showNotification("Has colocado una piedra en el altar (" + this.altar.stonesPlaced + "/3).");
                        } else {
                            // Altar completed! Holy fire ignites
                            this.altar.completed = true;
                            this.altar.flameIntensity = 1.0;
                            window.gameAudio.playWin();
                            this.family[4].praying = true; // Nephi kneels in prayer

                            // Final sacred dialogue: Altar of thanksgiving & Nephi's prayer (1 Nefi 2:7, 16-17)
                            this.altarDialogueTriggered = true;
                            game.dialogueQueue = [
                                { char: "Lehí", text: "He erigido este altar de piedras y presento una ofrenda al Señor, dando gracias a Dios por preservar a mi familia." },
                                { char: "Nefi", text: "Y yo, teniendo grandes deseos de conocer los misterios de Dios, clamé al Señor; y he aquí, Él me visitó y enterneció mi corazón, y creí todas las palabras de mi padre." },
                                { char: "Sam", text: "Hermano Nefi, yo también creo de corazón en las cosas maravillosas que el Espíritu te ha manifestado." }
                            ];
                            game.startDialogue();
                        }
                    }
                }

                // Update enemies
                this.enemies.forEach(e => {
                    if (e.hp <= 0) {
                        if (e.state !== "dead") {
                            e.state = "dead";
                            game.score += e.type === "soldier" ? 60 : 30;
                        }
                        return;
                    }

                    // Patrol logic
                    if (e.state === "patrol") {
                        e.x += e.speed * e.dir;
                        if (Math.abs(e.x - e.startX) > e.range) {
                            e.dir *= -1;
                        }

                        // Touch player
                        if (game.player.inmune === 0 && game.collides(game.player, e)) {
                            game.playerHurt();
                        }

                        // Check family collisions
                        this.family.forEach(member => {
                            if (member.healthy && game.collides(member, e)) {
                                member.healthy = false;
                                game.score = Math.max(0, game.score - 40);
                                window.gameAudio.playHurt();
                                game.showNotification("¡Un miembro de la familia fue hostigado! Protege a los tuyos.");
                            }
                        });
                    }
                });

                // Dynamic Checkpoint updates
                if (game.player.x > 1650 && this.checkpoint.x < 1600 && game.player.grounded) {
                    this.checkpoint = { x: 1650, y: 400 };
                }
                if (game.player.x > 2980 && this.checkpoint.x < 2900 && game.player.grounded) {
                    this.checkpoint = { x: 2980, y: 400 };
                }

                // Pit/fall check
                if (game.player.y > 576) {
                    game.player.x = this.checkpoint.x;
                    game.player.y = this.checkpoint.y;
                    game.player.velX = 0;
                    game.player.velY = 0;
                    game.playerHurt();

                    // Reset position history for family
                    this.positionHistory = [];
                    for (let i = 0; i < 400; i++) {
                        this.positionHistory.push({ x: this.checkpoint.x, y: this.checkpoint.y, agachado: false, jumping: false });
                    }
                    this.family.forEach(member => {
                        member.x = this.checkpoint.x;
                        member.y = this.checkpoint.y;
                    });
                }

                // Check level completion after Altar dedication and dialogue finishes
                if (this.altar.completed && this.altarDialogueTriggered && !game.dialogueActive && !this.finishSpiritualTextShown) {
                    this.finishSpiritualTextShown = true;
                    let safeCount = this.family.filter(m => m.healthy).length;
                    let bonus = safeCount * 120 + 200; // Family safety + altar completion bonus
                    game.score += bonus;

                    // Completes level and triggers Quiz Screen (Reto de Fe)
                    game.completeLevel(
                        "Fue obediente a la palabra del Señor; erigió un altar de piedras y dio gracias al Señor nuestro Dios.",
                        "1 Nefi 2:3, 7",
                        bonus
                    );
                }
            },

            draw: function(ctx, game, gameFrame, camaraX) {
                // Dynamic Sky Background transitioning between the 3 biomes:
                // 1) Jerusalem Deep Night (0 - 1500)
                // 2) Red Sea Desert Dusk (1500 - 2800)
                // 3) Valley of Lemuel Verdant Oasis (2800 - 4200)
                let skyGrad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                if (camaraX < 1400) {
                    skyGrad.addColorStop(0, "#05030f");
                    skyGrad.addColorStop(0.5, "#100820");
                    skyGrad.addColorStop(1, "#26102e");
                } else if (camaraX < 2600) {
                    skyGrad.addColorStop(0, "#090616");
                    skyGrad.addColorStop(0.5, "#200e26");
                    skyGrad.addColorStop(1, "#3c172a");
                } else {
                    skyGrad.addColorStop(0, "#08101a");
                    skyGrad.addColorStop(0.5, "#18261e");
                    skyGrad.addColorStop(1, "#243826");
                }
                ctx.fillStyle = skyGrad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Twinkling Celestial Stars
                ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
                for (let i = 0; i < 30; i++) {
                    let starX = (i * 185 - camaraX * 0.08) % 1024;
                    if (starX < 0) starX += 1024;
                    let starY = (i * 59) % 240;
                    let size = 1.2 + Math.sin(gameFrame * 0.05 + i) * 0.9;
                    ctx.fillRect(starX, starY, size, size);
                }

                // Ethereal Crescent Moon in Jerusalem Sky
                if (camaraX < 1800) {
                    ctx.save();
                    ctx.shadowColor = "#fffae0";
                    ctx.shadowBlur = 18;
                    ctx.fillStyle = "#fffae0";
                    ctx.beginPath();
                    ctx.arc(140 - camaraX * 0.04, 75, 22, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "#05030f";
                    ctx.beginPath();
                    ctx.arc(150 - camaraX * 0.04, 70, 21, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }

                // Red Sea Water Horizon & Shimmer (Desert section x: 1400 to 2800)
                let seaStartX = 1400 - camaraX * 0.2;
                if (seaStartX < 1024 && seaStartX > -1200) {
                    ctx.save();
                    let seaGrad = ctx.createLinearGradient(0, 310, 0, 370);
                    seaGrad.addColorStop(0, "rgba(10, 25, 45, 0.85)");
                    seaGrad.addColorStop(1, "rgba(22, 55, 80, 0.4)");
                    ctx.fillStyle = seaGrad;
                    ctx.fillRect(0, 310, 1024, 60);

                    // Moonlight reflections on the Red Sea waters
                    ctx.fillStyle = "rgba(255, 240, 180, 0.25)";
                    for (let s = 0; s < 12; s++) {
                        let rx = (s * 85 + gameFrame * 0.4) % 1024;
                        let ry = 320 + (s * 7) % 40;
                        let rw = 25 + Math.sin(gameFrame * 0.1 + s) * 15;
                        ctx.fillRect(rx, ry, rw, 1.5);
                    }
                    ctx.restore();
                }

                // Parallax Mountain Ridges & Desert Dunes
                for (let i = 0; i < 10; i++) {
                    let dX = 1300 + i * 280 - camaraX * 0.3;
                    if (dX > -300 && dX < 1324) {
                        ctx.save();
                        ctx.fillStyle = "#1e1022";
                        ctx.beginPath();
                        ctx.moveTo(dX - 160, 500);
                        ctx.quadraticCurveTo(dX + 60, 360, dX + 280, 500);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                    }
                }

                // Parallax Canyon Cliffs of the Valley of Lemuel (x > 2700)
                for (let i = 0; i < 8; i++) {
                    let cliffX = 2800 + i * 240 - camaraX * 0.35;
                    if (cliffX > -250 && cliffX < 1274) {
                        ctx.save();
                        ctx.fillStyle = "#162218";
                        ctx.beginPath();
                        ctx.moveTo(cliffX, 500);
                        ctx.lineTo(cliffX + 30, 220);
                        ctx.lineTo(cliffX + 110, 200);
                        ctx.lineTo(cliffX + 180, 240);
                        ctx.lineTo(cliffX + 210, 500);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                    }
                }

                // River Lamán (Water Body flowing to the Red Sea, x: 3300 to 4200)
                ctx.save();
                ctx.translate(-camaraX, 0);
                if (camaraX > 2400) {
                    let riverGrad = ctx.createLinearGradient(3300, 485, 3300, 576);
                    riverGrad.addColorStop(0, "#00bcd4");
                    riverGrad.addColorStop(0.3, "#00838f");
                    riverGrad.addColorStop(1, "#004d40");
                    ctx.fillStyle = riverGrad;

                    // Animated undulating water stream
                    ctx.beginPath();
                    ctx.moveTo(3300, 500);
                    for (let wx = 3300; wx <= 4200; wx += 25) {
                        let wy = 492 + Math.sin(gameFrame * 0.08 + wx * 0.04) * 4;
                        ctx.lineTo(wx, wy);
                    }
                    ctx.lineTo(4200, 576);
                    ctx.lineTo(3300, 576);
                    ctx.closePath();
                    ctx.fill();

                    // Flowing Foam Crests
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    for (let wx = 3310; wx <= 4190; wx += 30) {
                        let wy = 494 + Math.sin(gameFrame * 0.08 + wx * 0.04) * 4;
                        ctx.moveTo(wx, wy);
                        ctx.lineTo(wx + 15, wy);
                    }
                    ctx.stroke();

                    // Signpost: Río Lamán
                    ctx.fillStyle = "#5d4037";
                    ctx.fillRect(3360, 430, 6, 50);
                    ctx.fillStyle = "#8d6e63";
                    ctx.fillRect(3320, 400, 85, 30);
                    ctx.strokeStyle = "#3e2723";
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(3320, 400, 85, 30);
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 10px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("RÍO LAMÁN", 3362, 415);
                    ctx.font = "8px Outfit";
                    ctx.fillStyle = "#ffe082";
                    ctx.fillText("(1 Nefi 2:8)", 3362, 425);
                }
                ctx.restore();

                // Draw Platforms
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.platforms.forEach(plat => {
                    ctx.save();
                    if (plat.x < 1500) {
                        // Jerusalem Ashlar Stone
                        let stoneGrad = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.height);
                        stoneGrad.addColorStop(0, "#a48866");
                        stoneGrad.addColorStop(1, "#54402d");
                        ctx.fillStyle = stoneGrad;
                        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                        ctx.strokeStyle = "#3d2c1c";
                        ctx.lineWidth = 1.5;
                        ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
                        // Limestone cap
                        ctx.fillStyle = "#dfcbb5";
                        ctx.fillRect(plat.x, plat.y, plat.width, 5);
                    } else if (plat.x < 2800) {
                        // Desert Dunes (Warm Ochre Sand)
                        let sandGrad = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.height);
                        sandGrad.addColorStop(0, "#c29153");
                        sandGrad.addColorStop(0.5, "#8d5d2a");
                        sandGrad.addColorStop(1, "#4e2c0e");
                        ctx.fillStyle = sandGrad;
                        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                        // Gold edge highlight
                        ctx.fillStyle = "#ffd599";
                        ctx.fillRect(plat.x, plat.y, plat.width, 4);
                    } else {
                        // Fertile Valley Ground (Lush turf and green grass)
                        let valleyGrad = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.height);
                        valleyGrad.addColorStop(0, "#3e5b32");
                        valleyGrad.addColorStop(0.3, "#2d3e24");
                        valleyGrad.addColorStop(1, "#1b2816");
                        ctx.fillStyle = valleyGrad;
                        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                        // Emerald grass cap
                        ctx.fillStyle = "#66bb6a";
                        ctx.fillRect(plat.x, plat.y, plat.width, 6);

                        // Grass blades
                        ctx.fillStyle = "#81c784";
                        for (let gx = 15; gx < plat.width - 15; gx += 35) {
                            ctx.beginPath();
                            ctx.moveTo(plat.x + gx, plat.y);
                            ctx.lineTo(plat.x + gx - 3, plat.y - 8);
                            ctx.lineTo(plat.x + gx + 1, plat.y);
                            ctx.fill();
                        }
                    }
                    ctx.restore();
                });
                ctx.restore();

                // Draw Abandoned Wealth of Lehi (1 Nefi 2:4) in Jerusalem
                ctx.save();
                ctx.translate(-camaraX, 0);
                if (camaraX < 1000) {
                    let chestX = 250;
                    let chestY = 460;
                    // Treasure Chest 1 (Gold)
                    ctx.fillStyle = "#5d4037"; // Wood body
                    ctx.fillRect(chestX, chestY, 44, 28);
                    ctx.strokeStyle = "#ffd700"; // Golden bands
                    ctx.lineWidth = 2;
                    ctx.strokeRect(chestX, chestY, 44, 28);
                    ctx.strokeRect(chestX + 12, chestY, 20, 28);

                    // Open chest lid
                    ctx.fillStyle = "#3e2723";
                    ctx.beginPath();
                    ctx.moveTo(chestX - 4, chestY);
                    ctx.lineTo(chestX + 22, chestY - 14);
                    ctx.lineTo(chestX + 48, chestY);
                    ctx.closePath();
                    ctx.fill();

                    // Sparkling gold and jewels overflowing
                    ctx.fillStyle = "#ffd700";
                    ctx.beginPath();
                    ctx.arc(chestX + 16, chestY + 2, 7, 0, Math.PI * 2);
                    ctx.arc(chestX + 28, chestY, 8, 0, Math.PI * 2);
                    ctx.arc(chestX + 36, chestY + 4, 6, 0, Math.PI * 2);
                    ctx.fill();

                    // Sparkle stars
                    ctx.fillStyle = "#ffffff";
                    let spk = Math.sin(gameFrame * 0.2) * 2;
                    ctx.fillRect(chestX + 22, chestY - 6 + spk, 3, 3);
                    ctx.fillRect(chestX + 32, chestY - 2 - spk, 2, 2);

                    // Doctrinal Badge on the ground
                    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                    ctx.fillRect(chestX - 25, chestY + 32, 120, 18);
                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 9px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("Oro y Plata abandonados", chestX + 35, chestY + 44);
                }
                ctx.restore();

                // Draw Torches with rising fire embers
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.torches.forEach(t => {
                    ctx.fillStyle = "#5d4037";
                    ctx.fillRect(t.x, t.y, 4, 20);
                    ctx.fillStyle = "#37474f";
                    ctx.fillRect(t.x - 2, t.y + 8, 8, 4);

                    for (let p = 0; p < 5; p++) {
                        let offsetSeed = p * 12 + gameFrame;
                        let pX = t.x + 2 + Math.sin(offsetSeed * 0.15) * 5;
                        let pY = t.y - 3 - (offsetSeed % 16);
                        let pSize = 3 + (offsetSeed % 4);
                        let colors = ["#ff3d00", "#ff9100", "#ffea00", "#ff6d00"];
                        ctx.fillStyle = colors[p % colors.length];
                        ctx.beginPath();
                        ctx.arc(pX, pY, pSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                ctx.restore();

                // Draw Supplies (Provisiones: Odres de Agua, Sacos de Grano, Lienzos de Tienda)
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.provisiones.forEach(p => {
                    if (p.collected) return;
                    let bobbing = Math.sin(gameFrame * 0.15 + p.x) * 4;

                    if (p.tipo === "agua") {
                        // Odre de agua de cuero (Leather Waterskin)
                        ctx.save();
                        ctx.translate(p.x, p.y + bobbing);
                        ctx.fillStyle = "#6d4c41"; // Dark leather
                        ctx.beginPath();
                        ctx.ellipse(0, 4, 9, 13, 0.2, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = "#3e2723";
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                        // Wooden stopper
                        ctx.fillStyle = "#d7ccc8";
                        ctx.fillRect(-2, -12, 4, 5);
                        // Strap
                        ctx.strokeStyle = "#271c19";
                        ctx.beginPath();
                        ctx.arc(0, 4, 11, Math.PI * 0.8, Math.PI * 1.8);
                        ctx.stroke();
                        // Water drop blue sheen
                        ctx.fillStyle = "#29b6f6";
                        ctx.beginPath();
                        ctx.arc(3, 4, 3, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    } else if (p.tipo === "grano") {
                        // Saco de provisiones (Burlap grain sack)
                        ctx.save();
                        ctx.translate(p.x, p.y + bobbing);
                        ctx.fillStyle = "#c7a76c"; // Tan burlap
                        ctx.beginPath();
                        ctx.ellipse(0, 4, 11, 12, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = "#8d6e3f";
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                        // Tied neck
                        ctx.fillStyle = "#5d4037";
                        ctx.fillRect(-4, -8, 8, 4);
                        ctx.fillStyle = "#d7ccc8";
                        ctx.beginPath();
                        ctx.ellipse(0, -10, 6, 3, 0, 0, Math.PI * 2);
                        ctx.fill();
                        // Wheat icon
                        ctx.strokeStyle = "#5d4037";
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, 9);
                        ctx.stroke();
                        ctx.restore();
                    } else {
                        // Lienzo de tienda (Rolled tent fabric bundle)
                        ctx.save();
                        ctx.translate(p.x, p.y + bobbing);
                        ctx.fillStyle = "#e0e0e0"; // Heavy canvas
                        ctx.fillRect(-12, -6, 24, 12);
                        ctx.strokeStyle = "#616161";
                        ctx.lineWidth = 1.5;
                        ctx.strokeRect(-12, -6, 24, 12);
                        // Leather tying cords
                        ctx.strokeStyle = "#5d4037";
                        ctx.beginPath();
                        ctx.moveTo(-5, -6);
                        ctx.lineTo(-5, 6);
                        ctx.moveTo(5, -6);
                        ctx.lineTo(5, 6);
                        ctx.stroke();
                        ctx.restore();
                    }
                });
                ctx.restore();

                // Draw Loose Altar Stones
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.altarStones.forEach(s => {
                    if (s.collected) return;
                    let bob = Math.sin(gameFrame * 0.12 + s.x) * 3;
                    ctx.save();
                    ctx.translate(s.x, s.y + bob);
                    // Holy glow aura
                    ctx.fillStyle = "rgba(255, 215, 0, 0.35)";
                    ctx.beginPath();
                    ctx.arc(0, 0, 15, 0, Math.PI * 2);
                    ctx.fill();

                    // Uncut river stone
                    ctx.fillStyle = "#b0bec5";
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 10, 7, 0.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = "#546e7a";
                    ctx.lineWidth = 1.5;
                    ctx.stroke();

                    // Mini label
                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 8px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("Piedra 🪨", 0, -10);
                    ctx.restore();
                });
                ctx.restore();

                // Draw Altar of Stones (1 Nefi 2:7)
                ctx.save();
                ctx.translate(-camaraX, 0);
                let ax = this.altar.x;
                let ay = this.altar.y;

                // Base platform foundation
                ctx.fillStyle = "#455a64";
                ctx.fillRect(ax - 20, ay + 20, 70, 15);
                ctx.strokeStyle = "#263238";
                ctx.lineWidth = 2;
                ctx.strokeRect(ax - 20, ay + 20, 70, 15);

                if (this.altar.stonesPlaced >= 1) {
                    // First Tier Stone
                    ctx.fillStyle = "#78909c";
                    ctx.fillRect(ax - 15, ay + 6, 60, 14);
                    ctx.strokeRect(ax - 15, ay + 6, 60, 14);
                }
                if (this.altar.stonesPlaced >= 2) {
                    // Second Tier Stone
                    ctx.fillStyle = "#90a4ae";
                    ctx.fillRect(ax - 8, ay - 6, 46, 12);
                    ctx.strokeRect(ax - 8, ay - 6, 46, 12);
                }
                if (this.altar.stonesPlaced >= 3) {
                    // Top Altar Stone Slab
                    ctx.fillStyle = "#cfd8dc";
                    ctx.fillRect(ax - 12, ay - 14, 54, 8);
                    ctx.strokeRect(ax - 12, ay - 14, 54, 8);

                    // Roaring Sacred Altar Fire
                    for (let f = 0; f < 8; f++) {
                        let fOffset = f * 9 + gameFrame;
                        let fx = ax + 15 + Math.sin(fOffset * 0.2) * 12;
                        let fy = ay - 16 - (fOffset % 26);
                        let fSize = 5 + (fOffset % 6);
                        let fColors = ["#ffffff", "#ffea00", "#ff9800", "#ff3d00"];
                        ctx.fillStyle = fColors[f % fColors.length];
                        ctx.beginPath();
                        ctx.arc(fx, fy, fSize, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Sacred Smoke rising to heaven
                    ctx.fillStyle = "rgba(238, 238, 238, 0.2)";
                    for (let sm = 0; sm < 4; sm++) {
                        let smOffset = sm * 25 + gameFrame * 0.7;
                        let smX = ax + 15 + Math.sin(smOffset * 0.08) * 18;
                        let smY = ay - 35 - (smOffset % 80);
                        ctx.beginPath();
                        ctx.arc(smX, smY, 12 + sm * 4, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Golden halo of thanksgiving
                    ctx.fillStyle = "rgba(255, 215, 0, 0.15)";
                    ctx.beginPath();
                    ctx.arc(ax + 15, ay - 10, 45, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Altar Name Plaque
                ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                ctx.fillRect(ax - 30, ay + 38, 90, 18);
                ctx.fillStyle = "#ffd700";
                ctx.font = "bold 9px Outfit";
                ctx.textAlign = "center";
                ctx.fillText("Altar de Piedras", ax + 15, ay + 50);

                ctx.restore();

                // Draw Family Queue with detailed visual designs
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.family.forEach(member => {
                    ctx.save();
                    let fH = member.agachado ? member.height * 0.55 : member.height;
                    let fY = member.y;

                    // Shadow under feet
                    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
                    ctx.beginPath();
                    ctx.ellipse(member.x + 20, fY + fH - 2, 12, 4, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Body robe
                    ctx.fillStyle = member.healthy ? member.color : "#d32f2f";
                    ctx.fillRect(member.x + 10, fY + 20, 20, fH - 28);

                    // Specific character touches
                    if (member.name === "Saríah") {
                        // Veiled matriarch
                        ctx.fillStyle = "#fcf8f2";
                        ctx.fillRect(member.x + 7, fY + 6, 26, 18);
                        ctx.beginPath();
                        ctx.ellipse(member.x + 20, fY + 6, 13, 7, 0, Math.PI, 0, false);
                        ctx.fill();
                        ctx.fillStyle = "#008080";
                        ctx.fillRect(member.x + 10, fY + fH - 12, 20, 3);
                    } else if (member.name === "Nefi") {
                        // Blue robe with golden sash
                        ctx.fillStyle = "#ffd700";
                        ctx.fillRect(member.x + 8, fY + 24, 24, 4);

                        // If praying at the end of level, draw divine light column above Nephi
                        if (member.praying) {
                            ctx.fillStyle = "rgba(255, 235, 59, 0.25)";
                            ctx.fillRect(member.x + 5, fY - 140, 30, 160);
                            ctx.fillStyle = "#ffd700";
                            ctx.font = "bold 8px Outfit";
                            ctx.textAlign = "center";
                            ctx.fillText("Oración de Fe ✨", member.x + 20, fY - 10);
                        }
                    } else if (member.name === "Sam") {
                        ctx.fillStyle = "#5d4037";
                        ctx.fillRect(member.x + 8, fY + 24, 24, 4);
                    } else {
                        // Laman & Lemuel
                        ctx.fillStyle = "#1e1e1e";
                        ctx.fillRect(member.x + 8, fY + 24, 24, 4);
                        if (member.murmuring) {
                            ctx.fillStyle = "#ff5252";
                            ctx.font = "bold 8px Outfit";
                            ctx.textAlign = "center";
                            ctx.fillText("Murmurando 💢", member.x + 20, fY - 12);
                        }
                    }

                    // Skin Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(member.x + 20, fY + 12, 9, 0, Math.PI * 2);
                    ctx.fill();

                    // Hair/beard
                    if (member.name !== "Saríah") {
                        ctx.fillStyle = member.name === "Sam" ? "#5d4037" : "#1a0d00";
                        ctx.fillRect(member.x + 11, fY + 3, 18, 3);
                        ctx.beginPath();
                        ctx.moveTo(member.x + 12, fY + 14);
                        ctx.quadraticCurveTo(member.x + 20, fY + 22, member.x + 28, fY + 14);
                        ctx.fill();
                    }

                    // Eyes
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(member.x + 15, fY + 8, 4, 3);
                    ctx.fillRect(member.x + 21, fY + 8, 4, 3);
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(member.x + 16, fY + 9, 1.5, 1.5);
                    ctx.fillRect(member.x + 22, fY + 9, 1.5, 1.5);

                    // Walking legs
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "#ffdbac";
                    let walkStep = Math.sin(gameFrame * 0.15 + member.offset * 0.25) * 8;
                    if (member.jumping) {
                        ctx.beginPath();
                        ctx.moveTo(member.x + 14, fY + fH - 8);
                        ctx.lineTo(member.x + 14, fY + fH - 2);
                        ctx.moveTo(member.x + 26, fY + fH - 8);
                        ctx.lineTo(member.x + 26, fY + fH - 2);
                        ctx.stroke();
                    } else if (member.agachado) {
                        ctx.fillStyle = "#ffdbac";
                        ctx.fillRect(member.x + 10, fY + fH - 4, 20, 4);
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(member.x + 14, fY + fH - 8);
                        ctx.lineTo(member.x + 14 + walkStep, fY + fH);
                        ctx.moveTo(member.x + 26, fY + fH - 8);
                        ctx.lineTo(member.x + 26 - walkStep, fY + fH);
                        ctx.stroke();
                        ctx.fillStyle = "#3e2723";
                        ctx.fillRect(member.x + 11 + walkStep, fY + fH - 2, 6, 3);
                        ctx.fillRect(member.x + 23 - walkStep, fY + fH - 2, 6, 3);
                    }

                    // Name Tag
                    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                    ctx.font = "bold 9px Outfit";
                    ctx.textAlign = "center";
                    ctx.shadowColor = "#000000";
                    ctx.shadowBlur = 4;
                    ctx.fillText(member.name, member.x + 20, fY - 5);

                    ctx.restore();
                });
                ctx.restore();

                // Draw Enemies (Soldiers & Mockers)
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.enemies.forEach(e => {
                    if (e.state === "dead") return;
                    ctx.save();

                    if (e.type === "soldier") {
                        // Soldier face
                        ctx.fillStyle = "#ffdbac";
                        ctx.fillRect(e.x + e.width / 2 - 10, e.y + 4, 20, 16);
                        ctx.fillStyle = "#1a0d00";
                        ctx.fillRect(e.x + e.width / 2 - 10, e.y + 12, 20, 8);
                        ctx.fillStyle = "#ffffff";
                        let eyeDirX = e.dir > 0 ? 3 : -7;
                        ctx.fillRect(e.x + e.width / 2 + eyeDirX, e.y + 6, 4, 3);
                        ctx.fillStyle = "#000000";
                        ctx.fillRect(e.x + e.width / 2 + eyeDirX + (e.dir > 0 ? 2 : 0), e.y + 7, 2, 2);

                        // Crimson Cape
                        ctx.fillStyle = "#b71c1c";
                        ctx.beginPath();
                        let capeBackX = e.dir > 0 ? e.x : e.x + e.width;
                        let capeWave = Math.sin(gameFrame * 0.1) * 8;
                        ctx.moveTo(capeBackX, e.y + 20);
                        ctx.lineTo(capeBackX - (25 * e.dir) + capeWave, e.y + e.height - 10);
                        ctx.lineTo(capeBackX - (5 * e.dir), e.y + e.height);
                        ctx.lineTo(e.x + e.width / 2, e.y + 20);
                        ctx.closePath();
                        ctx.fill();

                        // Bronze Cuirass
                        ctx.fillStyle = "#cd7f32";
                        ctx.fillRect(e.x + 8, e.y + 20, e.width - 16, e.height - 38);
                        ctx.fillStyle = "#ffd700";
                        ctx.fillRect(e.x + 10, e.y + 20, (e.width - 20) * 0.3, e.height - 38);

                        // Helmet
                        ctx.fillStyle = "#78909c";
                        ctx.beginPath();
                        ctx.arc(e.x + e.width / 2, e.y + 6, 12, Math.PI, 0, false);
                        ctx.lineTo(e.x + e.width / 2 + 10, e.y + 8);
                        ctx.lineTo(e.x + e.width / 2 - 10, e.y + 8);
                        ctx.closePath();
                        ctx.fill();
                        ctx.fillStyle = "#d32f2f";
                        ctx.fillRect(e.x + e.width / 2 - 4, e.y - 12, 8, 7);

                        // Spear & Shield
                        let weaponSide = e.dir > 0 ? 1 : -1;
                        ctx.fillStyle = "#5d4037";
                        let spX = weaponSide > 0 ? e.x + e.width - 6 : e.x + 6;
                        ctx.fillRect(spX, e.y + 4, 3, e.height - 4);
                        ctx.fillStyle = "#90a4ae";
                        ctx.beginPath();
                        ctx.moveTo(spX - 2, e.y + 4);
                        ctx.lineTo(spX + 1.5, e.y - 6);
                        ctx.lineTo(spX + 5, e.y + 4);
                        ctx.closePath();
                        ctx.fill();

                        // Bronze shield
                        ctx.fillStyle = "#cd7f32";
                        ctx.beginPath();
                        let shX = weaponSide > 0 ? e.x + 6 : e.x + e.width - 20;
                        ctx.arc(shX + 7, e.y + 32, 14, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = "#ffd700";
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                    } else {
                        // Burlón / Heckler
                        ctx.fillStyle = "#6a1b9a";
                        ctx.fillRect(e.x + 6, e.y + 16, e.width - 12, e.height - 16);
                        ctx.fillStyle = "#ffdbac";
                        ctx.beginPath();
                        ctx.arc(e.x + e.width / 2, e.y + 10, 9, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = "#fbc02d";
                        ctx.fillRect(e.x + e.width / 2 - 11, e.y - 1, 22, 6);
                    }
                    ctx.restore();
                });
                ctx.restore();

                // Draw Altar Prompt if player is carrying stones near the altar
                if (!this.altar.completed && this.altarStones.some(s => s.collected)) {
                    let dist = Math.abs(game.player.x - this.altar.x);
                    if (dist < 180) {
                        ctx.save();
                        ctx.translate(-camaraX, 0);
                        let pulse = Math.sin(gameFrame * 0.15) * 4;
                        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                        ctx.fillRect(this.altar.x - 60, this.altar.y - 50 + pulse, 150, 26);
                        ctx.strokeStyle = "#ffd700";
                        ctx.lineWidth = 1.5;
                        ctx.strokeRect(this.altar.x - 60, this.altar.y - 50 + pulse, 150, 26);
                        ctx.fillStyle = "#ffd700";
                        ctx.font = "bold 11px Outfit";
                        ctx.textAlign = "center";
                        ctx.fillText("¡Acércate para edificar el Altar!", this.altar.x + 15, this.altar.y - 33 + pulse);
                        ctx.restore();
                    }
                }
            }
        },

        // LEVEL 2: Obtaining the Plates of Brass (Faith, Infiltration, Sacred Sword & Covenant with Zoram)
        {
            id: 2,
            name: "Obteniendo las Planchas de Bronce",
            desc: "Regresa a Jerusalén, obedece la voz del Espíritu, rescata los anales sagrados y pacta la libertad con Zoram.",
            maxScroll: 4000,

            // Level introduction data
            introTitle: "Las Planchas de Bronce: El Mandato Sagrado",
            introText: "El Señor manda a los hijos de Lehí volver a Jerusalén para obtener las Planchas de Bronce que custodia Labán, las cuales contienen la ley de Moisés, las profecías y la genealogía de sus antepasados. Ante las quejas de sus hermanos mayores, Nefi declara con fe inquebrantable: 'Iré y haré lo que el Señor ha mandado'. Acompaña a tus hermanos en los primeros intentos, recupera las riquezas familiares, presencia la visita del ángel celestial, infíltrate de noche guiado por el Espíritu y regresa con las Planchas de Bronce y Zoram a la tienda de Lehí.",
            introObjective: "Cumple las fases de la misión: viaja con tus hermanos a Jerusalén, recolecta las riquezas de Lehí, huye de Labán a la cueva, contempla al ángel, infíltrate de noche, viste la armadura de Labán y rescata los anales sagrados con Zoram.",
            characterId: "nefi",

            // Reto de Fe (Quiz Doctrinal de Cierre)
            quiz: [
                {
                    pregunta: "¿Qué célebre declaración de fe pronunció Nefi cuando sus hermanos se resistían a volver a Jerusalén?",
                    opciones: [
                        "Iré y haré lo que el Señor ha mandado, porque sé que Él nunca da mandamientos sin preparar la vía.",
                        "Esperaremos en el desierto a que Labán decida enviarnos las planchas voluntariamente.",
                        "Pediremos a los ancianos del concejo de Jerusalén que intervengan legalmente por nosotros."
                    ],
                    correctaIndex: 0,
                    explicacion: "1 Nefi 3:7 es uno de los pasajes fundamentales del Libro de Mormón: enseña que cuando el Señor da un mandamiento, siempre provee los medios para cumplirlo si actuamos con fe y obediencia."
                },
                {
                    pregunta: "¿Por qué mandó el Espíritu a Nefi que obtuviera las planchas de bronce aun a costa de la vida de Labán?",
                    opciones: [
                        "Para vender las planchas de bronce en Egipto por una inmensa suma de riquezas.",
                        "Porque era preferible que muriese un hombre inicuo a permitir que una nación entera degenerara y pereciera en la incredulidad sin las escrituras.",
                        "Porque Labán había prometido entregar las planchas si alguien lo derrotaba en duelo público."
                    ],
                    correctaIndex: 1,
                    explicacion: "1 Nefi 4:13 enseña un principio de preservación espiritual: sin los anales sagrados que contenían la ley de Dios, los descendientes de Lehí habrían perecido espiritualmente en la incredulidad."
                }
            ],

            init: function(game) {
                game.player.x = 3500;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                game.camaraX = 3000;
                this.checkpoint = { x: 3500, y: 400 };
                this.cameraTargetX = undefined;

                this.currentObjective = "Acompaña a tus hermanos hacia el Palacio de Labán (x = 850)";
                this.objectiveTargetX = 850;
                this.objectiveTargetLabel = "Palacio de Labán";

                // Quest engine variables
                // 0: First attempt (Laman & casting lots, travel to palace)
                // 1: Gather family wealth at Lehi's house
                // 2: Offer wealth to Laban & escape persecution to cave
                // 3: Beating with rod in cave & Angel visitation
                // 4: Night infiltration into Jerusalem guided by the Spirit
                // 5: Finding Laban, Sword of Laban & taking disguise
                // 6: Treasury vault, Zoram & retrieving Plates of Brass
                // 7: Fleeing outside walls, oath of freedom with Zoram
                // 8: Joyful reunion with Lehi and Sariah at the wilderness tent (1 Nephi 5)
                this.currentPhase = 0;
                this.alarmActive = false;
                this.alarmTimer = 0;
                this.disguised = false;
                this.angelActive = false;
                this.angelTimer = 0;
                this.beatingActive = false;
                this.beatingTimer = 0;
                this.zoramOpeningGate = false;
                this.platesCollected = false;

                // Trackers to prevent duplicate triggers
                this.phase0ConfrontationTriggered = false;
                this.phase1DialoguePlayed = false;
                this.phase2DialogueTriggered = false;
                this.escapePhaseStarted = false;
                this.angelDialogueTriggered = false;
                this.phase3EndDialogueTriggered = false;
                this.phase4Initialized = false;
                this.phase4DialogueTriggered = false;
                this.phase5DialogueTriggered = false;
                this.phase6DialogueTriggered = false;
                this.phase7DialogueTriggered = false;
                this.oathDialogueTriggered = false;
                this.reunionDialogueTriggered = false;
                this.finishSpiritualTextShown = false;

                // Wealth chests in Lehí's house (Phase 1)
                // Positioned on open, accessible surfaces with both width/w and height/h
                this.wealthChests = [
                    { x: 1780, y: 460, w: 45, h: 35, width: 45, height: 35, collected: false, name: "Oro de Lehí", icon: "🪙" },
                    { x: 1980, y: 360, w: 45, h: 35, width: 45, height: 35, collected: false, name: "Plata de Herencia", icon: "🥈" },
                    { x: 2160, y: 460, w: 45, h: 35, width: 45, height: 35, collected: false, name: "Bienes Preciosos", icon: "💎" }
                ];

                // Shadows for hiding in streets during stealth
                this.shadows = [
                    { x: 1200, y: 340, width: 180, height: 160, label: "Pórtico Oscuro" },
                    { x: 1800, y: 340, width: 190, height: 160, label: "Sombra de Lehí" },
                    { x: 2450, y: 340, width: 190, height: 160, label: "Arco de Muralla" }
                ];

                // Solid, continuous, traversable layout across the entire 4000px level
                this.platforms = [
                    // Continuous ground floor (x: 0 to 4000)
                    { x: 0, y: 500, width: 4000, height: 100, tipo: "suelo" },
                    // Treasury Gate (separating Treasury vault at x = 480)
                    { x: 480, y: 250, width: 40, height: 250, tipo: "puerta_cerrada" },
                    // Palace elevated terraces and balustrades
                    { x: 600, y: 390, width: 320, height: 25, tipo: "plataforma" },
                    { x: 960, y: 320, width: 220, height: 25, tipo: "plataforma" },
                    // Jerusalem street elevated platforms & Lehi's house
                    { x: 1450, y: 420, width: 160, height: 25, tipo: "plataforma" },
                    { x: 1820, y: 445, width: 70, height: 20, tipo: "plataforma" }, // Access step
                    { x: 1900, y: 400, width: 220, height: 25, tipo: "plataforma" }, // Terrace of Lehi's House
                    { x: 2140, y: 445, width: 70, height: 20, tipo: "plataforma" }, // Access step
                    { x: 2320, y: 380, width: 200, height: 25, tipo: "plataforma" },
                    // City gate ramparts (x = 2800)
                    { x: 2750, y: 350, width: 160, height: 25, tipo: "plataforma" },
                    // Wilderness rocky ledges (x: 3000 to 4000)
                    { x: 3150, y: 420, width: 160, height: 25, tipo: "plataforma" },
                    { x: 3450, y: 410, width: 180, height: 25, tipo: "plataforma" }
                ];

                // Labán definition
                this.laban = { x: 750, y: 405, hp: 1, width: 65, height: 95, state: "alive" };

                // Enemies & Followers buffer
                this.enemies = [];
                // Brothers start accompanying Nephi in Phase 0!
                this.family = [
                    { name: "Lamán", color: "#555555", height: 94, offset: 35, healthy: true, jumping: false },
                    { name: "Lemuel", color: "#666666", height: 94, offset: 70, healthy: true, jumping: false },
                    { name: "Sam", color: "#a0522d", height: 90, offset: 105, healthy: true, jumping: false }
                ];
                this.positionHistory = [];
                for (let i = 0; i < 400; i++) {
                    this.positionHistory.push({ x: 3500, y: 400, agachado: false, jumping: false });
                }

                // Initial dialogue (Phase 0: The Command, "Iré y Haré", Casting Lots - 1 Nephi 3:2–11)
                game.dialogueQueue = [
                    { char: "Lehí", text: "Hijos míos, he soñado un sueño en el que el Señor manda que volváis a Jerusalén. Labán tiene los anales y la genealogía de nuestros padres grabados sobre Planchas de Bronce." },
                    { char: "Lamán", text: "¡Padre, nos pides una cosa demasiado difícil! Labán es un hombre poderoso que comanda soldados. Nos matará a todos si entramos a su casa." },
                    { char: "Nefi", text: "¡Iré y haré lo que el Señor ha mandado, porque sé que Él nunca da mandamientos a los hombres sin prepararles la vía para que cumplan lo que les manda!" },
                    { char: "Lamán", text: "Si tanto insistes, echemos suertes para ver cuál de nosotros irá primero a la casa de Labán... ¡La suerte ha caído sobre mí! Acompañadme hasta las puertas de su palacio." }
                ];
                game.startDialogue();
            },

            update: function(game, gameFrame, input) {
                // Check shadow zone hiding (Stealth mechanics)
                let inShadow = false;
                this.shadows.forEach(s => {
                    if (game.player.x + game.player.width > s.x && game.player.x < s.x + s.width &&
                        game.player.y + game.player.height > s.y && game.player.y < s.y + s.height) {
                        inShadow = true;
                    }
                });
                game.player.hidden = inShadow && input.abajo && game.player.grounded;

                // Sound alarm update
                if (this.alarmActive) {
                    this.alarmTimer++;
                    if (this.alarmTimer % 45 === 0) {
                        window.gameAudio.playAlarm();
                    }
                    if (this.alarmTimer > 250) {
                        this.alarmActive = false;
                    }
                }

                // Record history for followers (Phases 0, 1, 2, 7, 8)
                if (this.currentPhase === 0 || this.currentPhase === 1 || this.currentPhase === 2 || this.currentPhase === 7 || this.currentPhase === 8) {
                    this.positionHistory.unshift({
                        x: game.player.x,
                        y: game.player.y,
                        agachado: game.player.agachado,
                        jumping: game.player.jumping
                    });
                    if (this.positionHistory.length > 400) {
                        this.positionHistory.pop();
                    }

                    // Update followers coordinates
                    this.family.forEach(member => {
                        const posIndex = member.offset;
                        const histPos = this.positionHistory[posIndex] || this.positionHistory[this.positionHistory.length - 1];
                        member.x = histPos.x;
                        member.y = histPos.y;
                        member.agachado = histPos.agachado;
                        member.jumping = histPos.jumping;
                    });
                }

                // Phase 0: First Attempt (Nephi travels with brothers to Laban's palace - 1 Nephi 3:11–14)
                if (this.currentPhase === 0) {
                    if (game.player.x <= 950 && !this.phase0ConfrontationTriggered) {
                        this.phase0ConfrontationTriggered = true;
                        game.player.velX = 0;
                        game.dialogueQueue = [
                            { char: "Lamán", text: "¡Esperad aquí, hermanos! Yo entraré a la casa de Labán a pedirle los anales..." },
                            { char: "Labán", text: "¡¿Quién eres tú y qué buscas en mi palacio a estas horas?!" },
                            { char: "Lamán", text: "Soy Lamán, hijo de Lehí. Vengo a pedirte los anales grabados sobre las Planchas de Bronce que contienen la genealogía de mi padre." },
                            { char: "Labán", text: "¡¿Las Planchas de Bronce?! ¡Tú eres un ladrón y te quitaré la vida por osado! ¡Guardias, prendedlo!" },
                            { char: "Lamán", text: "¡Socorro! ¡Labán se enfureció y mandó a sus guardias a matarme! ¡Huyamos de regreso al desierto con nuestro padre!" },
                            { char: "Nefi", text: "¡Así como vive el Señor, y vivimos nosotros, no descenderemos hasta nuestro padre en el desierto hasta que hayamos cumplido lo que el Señor nos ha mandado!" },
                            { char: "Nefi", text: "Vayamos a la casa de nuestro padre en Jerusalén; reunamos nuestro oro, nuestra plata y todos nuestros objetos preciosos, y ofrezcámoslos a Labán para comprarle las planchas." }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase0ConfrontationTriggered && !game.dialogueActive) {
                        this.currentPhase = 1;
                        this.currentObjective = "Ve a la Casa de Lehí (x = 2000) y recoge las 3 riquezas familiares";
                        this.objectiveTargetX = 2000;
                        this.objectiveTargetLabel = "Casa de Lehí";
                        this.checkpoint = { x: 1000, y: 400 };
                        game.showNotification("💰 Misión: Ve a la Casa de Lehí (x = 2000) y recoge el oro, plata y bienes familiares.");
                    }
                }

                // Phase 1: Gather Gold & Silver at Lehí's House (1 Nephi 3:22–24)
                if (this.currentPhase === 1) {
                    this.wealthChests.forEach(c => {
                        if (c.collected) return;
                        let pCenterX = game.player.x + game.player.width / 2;
                        let pCenterY = game.player.y + game.player.height / 2;
                        let cCenterX = c.x + c.w / 2;
                        let cCenterY = c.y + c.h / 2;
                        let dist = Math.hypot(pCenterX - cCenterX, pCenterY - cCenterY);
                        if (dist < 65 || game.collides(game.player, c)) {
                            c.collected = true;
                            window.gameAudio.playCoin();
                            game.score += 60;
                            let remaining = this.wealthChests.filter(ch => !ch.collected).length;
                            if (remaining > 0) {
                                game.showNotification("✨ " + c.name + " recogido (+60 PTS). Faltan: " + remaining);
                            } else {
                                game.showNotification("🎉 ¡Todas las riquezas familiares han sido reunidas!");
                            }
                        }
                    });

                    if (this.wealthChests.every(c => c.collected) && !this.phase1DialoguePlayed) {
                        this.phase1DialoguePlayed = true;
                        this.currentPhase = 2;
                        this.currentObjective = "Lleva las riquezas familiares al Palacio de Labán (x = 850)";
                        this.objectiveTargetX = 850;
                        this.objectiveTargetLabel = "Palacio de Labán";
                        this.checkpoint = { x: 2000, y: 400 };
                        game.dialogueQueue = [
                            { char: "Nefi", text: "¡Hemos reunido todo nuestro oro, plata y bienes preciosos! Marchemos al palacio de Labán para ofrecérselos a cambio de las Planchas de Bronce." }
                        ];
                        game.startDialogue();
                    }
                }

                // Phase 2: Offer wealth to Laban & Escape persecution (1 Nephi 3:24–27)
                if (this.currentPhase === 2) {
                    if (game.player.x <= 920 && !this.phase2DialogueTriggered) {
                        this.phase2DialogueTriggered = true;
                        game.player.velX = 0;
                        game.dialogueQueue = [
                            { char: "Nefi", text: "Labán, mira todo nuestro oro, nuestra plata y nuestras piedras preciosas. Te entregaremos todo a cambio de las Planchas de Bronce de nuestro padre." },
                            { char: "Labán", text: "¡Qué inmensa fortuna! ¡Codicio todo este oro! ¡Vuestras riquezas son mías, y vosotros moriréis como ladrones! ¡Siervos, matadlos!" }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase2DialogueTriggered && !game.dialogueActive && !this.escapePhaseStarted) {
                        this.escapePhaseStarted = true;
                        this.alarmActive = true;
                        this.alarmTimer = 0;
                        this.currentObjective = "¡HUYE! Escapa de los soldados de Labán hasta la cueva del desierto (x = 3400)";
                        this.objectiveTargetX = 3400;
                        this.objectiveTargetLabel = "Cavidad de la Roca";

                        this.enemies = [
                            { x: 500, y: 420, type: "guard_normal", hp: 1, range: 4000, startX: 500, dir: 1, width: 50, height: 80, speed: 3.6, state: "chase" },
                            { x: 620, y: 420, type: "guard_torch", hp: 2, range: 4000, startX: 620, dir: 1, width: 50, height: 80, speed: 3.3, state: "chase" },
                            { x: 740, y: 420, type: "guard_normal", hp: 1, range: 4000, startX: 740, dir: 1, width: 50, height: 80, speed: 3.5, state: "chase" }
                        ];
                        game.showNotification("⚠️ ¡HUYE! Labán os ha arrebatado el oro y envía soldados. ¡Corre a la cavidad de la roca!");
                    }

                    if (this.escapePhaseStarted) {
                        this.enemies.forEach(e => {
                            if (e.hp <= 0) return;
                            e.dir = game.player.x > e.x ? 1 : -1;
                            e.x += e.speed * e.dir;
                            if (game.player.inmune === 0 && game.collides(game.player, e)) {
                                game.playerHurt();
                            }
                        });

                        // Reached cave
                        if (game.player.x >= 3350) {
                            this.currentPhase = 3;
                            this.enemies = [];
                            this.alarmActive = false;
                            this.currentObjective = "Presencia la intervención del Ángel del Señor.";
                            this.objectiveTargetX = undefined;
                            this.objectiveTargetLabel = "";
                            this.beatingActive = true;
                            this.beatingTimer = 0;
                            game.player.velX = 0;
                            game.dialogueQueue = [
                                { char: "Lamán", text: "¡Por tu culpa perdimos todo el oro y la herencia de nuestro padre! ¡Casi nos matan por tus insensatas ideas!" },
                                { char: "Lemuel", text: "¡Sí! ¡Siempre pretendes gobernarnos con tus palabras! ¡Ahora pagarás por esto!" }
                            ];
                            game.startDialogue();
                        }
                    }
                }

                // Phase 3: Beating with a Rod & The Angel's Visitation (1 Nephi 3:28–31)
                if (this.currentPhase === 3) {
                    if (this.beatingActive) {
                        this.beatingTimer++;
                        if (this.beatingTimer % 25 === 0) {
                            window.gameAudio.playHit();
                        }

                        if (this.beatingTimer >= 75 && !game.dialogueActive && !this.angelDialogueTriggered) {
                            this.angelDialogueTriggered = true;
                            this.angelActive = true;
                            window.gameAudio.playPowerUp();
                            game.dialogueQueue = [
                                { char: "Ángel del Señor", text: "¿Por qué golpeáis a vuestro hermano menor con una vara? ¿No sabéis que el Señor lo ha escogido para ser vuestro gobernante a causa de vuestras iniquidades?" },
                                { char: "Ángel del Señor", text: "Subid de nuevo a Jerusalén; el Señor entregará a Labán en vuestras manos." }
                            ];
                            game.startDialogue();
                        }
                    }

                    if (this.angelDialogueTriggered && !game.dialogueActive && !this.phase3EndDialogueTriggered) {
                        this.phase3EndDialogueTriggered = true;
                        this.angelActive = false;
                        this.beatingActive = false;
                        game.dialogueQueue = [
                            { char: "Lamán", text: "¿Cómo es posible que el Señor entregue a Labán en nuestras manos? Es un hombre poderoso que comanda a cincuenta soldados." },
                            { char: "Nefi", text: "¡Seamos fieles y fuertes como Moisés cuando el Mar Rojo se apartó! El Señor es más poderoso que Labán y sus decenas de millares." },
                            { char: "Nefi", text: "Ocultaos vosotros fuera de los muros de la ciudad. Yo entraré a solas de noche en Jerusalén, guiado por el Espíritu Santo." }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase3EndDialogueTriggered && !game.dialogueActive) {
                        this.currentPhase = 4;
                        this.currentObjective = "Infíltrate en Jerusalén de noche y busca a Labán (x = 880)";
                        this.objectiveTargetX = 880;
                        this.objectiveTargetLabel = "Labán ebrio";
                        this.checkpoint = { x: 2800, y: 400 };
                        this.family = []; // Nefi enters alone into the city!
                        game.showNotification("🌙 Infiltración nocturna: Avanza solo y usa las sombras (▼) para evadir las patrullas.");
                    }
                }

                // Phase 4: Night Infiltration Guided by the Spirit (1 Nephi 4:5–8)
                if (this.currentPhase === 4) {
                    if (!this.phase4Initialized) {
                        this.phase4Initialized = true;
                        this.enemies = [
                            { x: 1300, y: 420, type: "guard_normal", hp: 1, range: 120, startX: 1300, dir: -1, width: 50, height: 80, speed: 2, state: "patrol" },
                            { x: 1900, y: 420, type: "guard_torch", hp: 2, range: 100, startX: 1900, dir: 1, width: 50, height: 80, speed: 1.5, state: "patrol" },
                            { x: 2500, y: 420, type: "guard_torch", hp: 2, range: 120, startX: 2500, dir: -1, width: 50, height: 80, speed: 1.8, state: "patrol" }
                        ];
                        this.laban = { x: 880, y: 410, hp: 1, width: 65, height: 95, state: "drunk" };
                    }

                    // Patrol guards
                    this.enemies.forEach(e => {
                        e.x += e.speed * e.dir;
                        if (Math.abs(e.x - e.startX) > e.range) e.dir *= -1;
                        if (!game.player.hidden && game.player.inmune === 0 && game.collides(game.player, e)) {
                            game.playerHurt();
                        }
                    });

                    // Reach Labán drunken body
                    if (game.player.x <= 960 && !this.phase4DialogueTriggered) {
                        this.phase4DialogueTriggered = true;
                        game.player.velX = 0;
                        game.dialogueQueue = [
                            { char: "Nefi", text: "Iba guiado por el Espíritu, no sabiendo de antemano lo que tendría que hacer. Y he aquí, he hallado a un hombre caído al suelo, ebrio de vino..." },
                            { char: "Nefi", text: "¡Al acercarme descubrí que es el mismo Labán! Y percibiendo su espada, la he sacado de la vaina..." }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase4DialogueTriggered && !game.dialogueActive) {
                        this.currentPhase = 5;
                        this.currentObjective = "Examina la Espada de Labán y cumple la voz del Espíritu (Presiona X o acércate)";
                        this.objectiveTargetX = 880;
                        this.objectiveTargetLabel = "Espada de Labán";
                    }
                }

                // Phase 5: The Sword of Laban & Voice of the Spirit (1 Nephi 4:9–19)
                if (this.currentPhase === 5) {
                    let nearLaban = Math.abs(game.player.x - 880) < 70;
                    if (nearLaban && (input.atacar || input.crafting || Math.abs(game.player.x - 880) < 40)) {
                        if (!this.phase5DialogueTriggered) {
                            this.phase5DialogueTriggered = true;
                            window.gameAudio.playAttack();
                            game.dialogueQueue = [
                                { char: "Nefi", text: "El puño es de oro puro, labrado con primor, y la hoja de un acero finísimo. Mas me sobrecogí y dije: Yo nunca he derramado sangre humana." },
                                { char: "La Voz del Espíritu", text: "Mátalo, porque el Señor lo ha puesto en tus manos. Es preferible que muera un hombre a dejar que una nación entera degenere y perezca en la incredulidad." },
                                { char: "Nefi", text: "Y recordando la promesa del Señor, obedecí la voz del Espíritu. Ahora tomaré las vestiduras de Labán y me ceñiré con su armadura para hacerme pasar por él." }
                            ];
                            game.startDialogue();
                        }
                    }

                    if (this.phase5DialogueTriggered && !game.dialogueActive) {
                        this.currentPhase = 6;
                        this.disguised = true;
                        this.laban.state = "dead";
                        window.gameAudio.playPowerUp();
                        this.currentObjective = "Ve a la tesorería de Labán (x = 450) y habla con su siervo Zoram";
                        this.objectiveTargetX = 450;
                        this.objectiveTargetLabel = "Zoram en la Tesorería";
                        this.enemies = []; // Guards won't attack Laban!
                        this.checkpoint = { x: 800, y: 400 };
                        game.showNotification("🛡️ ¡Disfraz de Labán equipado! Los soldados te respetarán. Dirígete a la tesorería.");
                    }
                }

                // Phase 6: Treasury, Zoram & The Plates of Brass (1 Nephi 4:20–26)
                if (this.currentPhase === 6) {
                    if (game.player.x <= 500 && !this.phase6DialogueTriggered) {
                        this.phase6DialogueTriggered = true;
                        game.player.velX = 0;
                        game.dialogueQueue = [
                            { char: "Nefi (como Labán)", text: "¡Zoram, siervo mío! Tráeme las llaves y acompáñame al lugar del tesoro para extraer los anales grabados sobre las Planchas de Bronce." },
                            { char: "Zoram", text: "A vuestra orden, amo Labán. Veo vuestra espada y vuestras insignias. Enseguida abro la gran reja de la tesorería para entregaros los sagrados anales." }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase6DialogueTriggered && !game.dialogueActive && !this.zoramOpeningGate) {
                        this.zoramOpeningGate = true;
                        window.gameAudio.playSelect();
                        // Open treasury gate smoothly
                        let gate = this.platforms.find(p => p.tipo === "puerta_cerrada");
                        if (gate) {
                            gate.height = 0; // Gate opens!
                        }
                        this.currentObjective = "Entra a la bóveda y recoge las Planchas de Bronce (x = 150)";
                        this.objectiveTargetX = 150;
                        this.objectiveTargetLabel = "Planchas de Bronce";
                    }

                    // Collect the Plates of Brass
                    if (this.zoramOpeningGate && !this.platesCollected && game.player.x <= 200) {
                        this.platesCollected = true;
                        window.gameAudio.playWin();
                        game.score += 250;
                        game.showNotification("📖 ¡Planchas de Bronce obtenidas! Sagrados anales en tu poder (+250 PTS).");

                        this.currentPhase = 7;
                        this.currentObjective = "Sal de Jerusalén con Zoram y reúnete con tus hermanos (x = 3100)";
                        this.objectiveTargetX = 3100;
                        this.objectiveTargetLabel = "Afueras de la Ciudad";

                        // Zoram follows Nephi
                        this.family = [
                            { name: "Zoram", color: "#607d8b", height: 86, offset: 35, healthy: true, jumping: false }
                        ];
                        this.positionHistory = [];
                        for (let i = 0; i < 400; i++) {
                            this.positionHistory.push({ x: game.player.x, y: game.player.y, agachado: false, jumping: false });
                        }
                    }
                }

                // Phase 7: Meeting brothers & The Solemn Oath with Zoram (1 Nephi 4:28–38)
                if (this.currentPhase === 7) {
                    if (game.player.x >= 3100 && !this.phase7DialogueTriggered) {
                        this.phase7DialogueTriggered = true;
                        game.player.velX = 0;
                        game.dialogueQueue = [
                            { char: "Lamán", text: "¡Es Labán con su espada y su armadura! ¡Ha matado a Nefi y viene por nosotros! ¡Huyamos!" },
                            { char: "Nefi", text: "¡Hermanos míos, deteneos! ¡Soy yo, vuestro hermano Nefi! ¡Mirad, he obtenido las Planchas de Bronce!" },
                            { char: "Zoram", text: "¡¿No eres Labán?! ¡He sido engañado! ¡Auxilio, guardias de Jerusalén!" }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase7DialogueTriggered && !game.dialogueActive && !this.oathDialogueTriggered) {
                        this.oathDialogueTriggered = true;
                        game.dialogueQueue = [
                            { char: "Nefi", text: "¡Zoram, cálmate y escúchame! Siendo yo de grande estatura, lo sujeté con firmeza para que no huyera a dar aviso a la ciudad." },
                            { char: "Nefi", text: "¡Te juro por el Dios viviente y por nuestras propias vidas que si desciendes con nosotros al desierto, serás un hombre libre y tendrás lugar y paz con nosotros!" },
                            { char: "Zoram", text: "Si me juráis por el Señor que seré un hombre libre, hago juramento solemne con vosotros de descender al desierto y unirme a vuestra familia para siempre." },
                            { char: "Nefi", text: "¡El pacto está sellado ante Dios! Nuestros temores cesan. Marchemos gozosos de regreso a la tienda de nuestro padre." }
                        ];
                        game.startDialogue();
                    }

                    if (this.oathDialogueTriggered && !game.dialogueActive) {
                        this.currentPhase = 8; // Final climax: Return to Lehi and Sariah in wilderness!
                        this.currentObjective = "Avanza hasta la tienda familiar en el Valle de Lemuel (x = 3700)";
                        this.objectiveTargetX = 3700;
                        this.objectiveTargetLabel = "Tienda de Lehí y Saríah";

                        // Brothers join the joyful march
                        this.family = [
                            { name: "Zoram", color: "#607d8b", height: 86, offset: 35, healthy: true, jumping: false },
                            { name: "Sam", color: "#a0522d", height: 90, offset: 70, healthy: true, jumping: false },
                            { name: "Lamán", color: "#555555", height: 94, offset: 105, healthy: true, jumping: false },
                            { name: "Lemuel", color: "#666666", height: 94, offset: 140, healthy: true, jumping: false }
                        ];
                    }
                }

                // Phase 8: The Joy of Sariah & Lehi Examining the Plates (1 Nephi 5:1–22)
                if (this.currentPhase === 8) {
                    if (game.player.x >= 3650 && !this.reunionDialogueTriggered) {
                        this.reunionDialogueTriggered = true;
                        game.player.velX = 0;
                        window.gameAudio.playWin();

                        game.dialogueQueue = [
                            { char: "Saríah", text: "¡Hijos míos! Os creía muertos en el desierto y lloré amargamente. Pero ahora sé con certeza que el Señor ha mandado a mi marido huir y que el Señor os ha protegido de las manos de Labán." },
                            { char: "Lehí", text: "¡Bendito sea el Señor Dios de Israel! He escudriñado estas Planchas de Bronce y hallé que contienen los cinco libros de Moisés, las profecías de los santos profetas y la genealogía de nuestros padres." },
                            { char: "Lehí", text: "Profetizo que estas planchas jamás perecerán ni se empañarán por el tiempo, sino que saldrán a todas las naciones del mundo. ¡Cuán sabio y misericordioso es nuestro Dios!" }
                        ];
                        game.startDialogue();
                    }

                    if (this.reunionDialogueTriggered && !game.dialogueActive && !this.finishSpiritualTextShown) {
                        this.finishSpiritualTextShown = true;
                        // Completes level and opens Quiz screen (Reto de Fe)
                        game.completeLevel(
                            "Fui guiado por el Espíritu, no sabiendo de antemano lo que tendría que hacer.",
                            "1 Nefi 4:6",
                            500
                        );
                    }
                }

                // Pit/fall check
                if (game.player.y > 580) {
                    game.playerHurt();
                    if (game.player.fe > 0) {
                        game.player.x = this.checkpoint.x;
                        game.player.y = this.checkpoint.y;
                        game.player.velX = 0;
                        game.player.velY = 0;
                        this.positionHistory = [];
                        for (let i = 0; i < 400; i++) {
                            this.positionHistory.push({ x: this.checkpoint.x, y: this.checkpoint.y, agachado: false, jumping: false });
                        }
                    }
                }
            },

            draw: function(ctx, game, gameFrame, camaraX) {
                // Background sky: transitions dynamically with narrative phases
                let skyGrad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                if (this.currentPhase >= 4 && this.currentPhase <= 7) {
                    // Deep midnight darkness for stealth infiltration
                    skyGrad.addColorStop(0, "#020108");
                    skyGrad.addColorStop(0.5, "#080518");
                    skyGrad.addColorStop(1, "#150a24");
                } else if (this.currentPhase === 8) {
                    // Warm golden dawn rising in the Valley of Lemuel
                    skyGrad.addColorStop(0, "#2b1055");
                    skyGrad.addColorStop(0.4, "#75225b");
                    skyGrad.addColorStop(0.8, "#d16246");
                    skyGrad.addColorStop(1, "#f39c12");
                } else {
                    // Desert dusk over Judea
                    skyGrad.addColorStop(0, "#0c0820");
                    skyGrad.addColorStop(0.5, "#1d1235");
                    skyGrad.addColorStop(1, "#361b42");
                }
                ctx.fillStyle = skyGrad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Twinkling celestial stars
                ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
                for (let i = 0; i < 35; i++) {
                    let starX = (i * 173 - camaraX * 0.08) % 1024;
                    if (starX < 0) starX += 1024;
                    let starY = (i * 59) % 220;
                    let size = 1.0 + Math.sin(gameFrame * 0.05 + i) * 0.7;
                    ctx.fillRect(starX, starY, size, size);
                }

                // Glowing Moon (prominent during night stealth in Jerusalem)
                let moonX = 850 - camaraX * 0.05;
                let moonY = 80;
                ctx.save();
                let moonGlow = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 60);
                moonGlow.addColorStop(0, "rgba(255, 248, 225, 0.9)");
                moonGlow.addColorStop(0.5, "rgba(255, 236, 179, 0.3)");
                moonGlow.addColorStop(1, "rgba(255, 236, 179, 0)");
                ctx.fillStyle = moonGlow;
                ctx.beginPath();
                ctx.arc(moonX, moonY, 60, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#fff8e1";
                ctx.beginPath();
                ctx.arc(moonX, moonY, 20, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                // Ancient Jerusalem City Skyline (in background, x = 600 to 2800)
                ctx.save();
                ctx.translate(-camaraX * 0.2, 0);
                ctx.fillStyle = "rgba(20, 16, 38, 0.7)";
                // Distant domed temples and towers
                for (let b = 0; b < 12; b++) {
                    let bx = 300 + b * 220;
                    let bw = 140;
                    let bh = 110 + (b % 4) * 35;
                    ctx.fillRect(bx, 500 - bh, bw, bh);
                    // Domes
                    ctx.beginPath();
                    ctx.arc(bx + bw / 2, 500 - bh, bw / 3, Math.PI, 0, false);
                    ctx.fill();
                }
                ctx.restore();

                // WORLD SPACE ELEMENTS (All translated by -camaraX)
                ctx.save();
                ctx.translate(-camaraX, 0);

                // Shadows drawing (Large porticos & rocks for stealth hiding)
                this.shadows.forEach(s => {
                    let sGrad = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.height);
                    sGrad.addColorStop(0, "rgba(10, 8, 20, 0.95)");
                    sGrad.addColorStop(1, "rgba(5, 4, 12, 0.88)");
                    ctx.fillStyle = sGrad;
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
                    ctx.lineWidth = 1.5;
                    ctx.fillRect(s.x, s.y, s.width, s.height);
                    ctx.strokeRect(s.x, s.y, s.width, s.height);

                    // Stone archway pillars
                    ctx.fillStyle = "#1e1a2f";
                    ctx.fillRect(s.x + 8, s.y + 10, 14, s.height - 10);
                    ctx.fillRect(s.x + s.width - 22, s.y + 10, 14, s.height - 10);

                    // Indicator icon for hiding
                    if (this.currentPhase === 4) {
                        ctx.fillStyle = "#90caf9";
                        ctx.font = "bold 10px Outfit";
                        ctx.textAlign = "center";
                        ctx.fillText("🕶️ Sombra (Agáchate con ▼)", s.x + s.width / 2, s.y + 25);
                    }
                });

                // Jerusalem City Wall and Great Gate (at x = 2750 to 2950)
                let gwX = 2750;
                ctx.fillStyle = "#26223b";
                ctx.fillRect(gwX, 220, 180, 280);
                ctx.strokeStyle = "#403a5e";
                ctx.lineWidth = 3;
                ctx.strokeRect(gwX, 220, 180, 280);
                // Crenellations on wall
                for (let c = 0; c < 5; c++) {
                    ctx.fillRect(gwX + c * 36, 195, 22, 25);
                }
                // Archway opening in city wall
                ctx.fillStyle = "#120f21";
                ctx.beginPath();
                ctx.arc(gwX + 90, 440, 55, Math.PI, 0, false);
                ctx.lineTo(gwX + 145, 500);
                ctx.lineTo(gwX + 35, 500);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "#ffd700";
                ctx.font = "bold 11px Outfit";
                ctx.textAlign = "center";
                ctx.fillText("Puertas de Jerusalén", gwX + 90, 210);

                // Lehí's House Facade (x = 1750 to 2250)
                let hX = 1760;
                // House base stone walls
                ctx.fillStyle = "#241e3a";
                ctx.fillRect(hX, 330, 480, 170);
                ctx.strokeStyle = "#4d426d";
                ctx.lineWidth = 2;
                ctx.strokeRect(hX, 330, 480, 170);
                // Balcony railing at terrace (y = 400)
                ctx.strokeStyle = "#8d6e63";
                ctx.lineWidth = 2;
                ctx.strokeRect(1900, 375, 220, 25);
                // Windows with warm light inside
                ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
                ctx.fillRect(hX + 60, 360, 30, 35);
                ctx.fillRect(hX + 390, 360, 30, 35);
                // Main Entrance Doorway
                ctx.fillStyle = "#151024";
                ctx.beginPath();
                ctx.arc(hX + 240, 440, 30, Math.PI, 0, false);
                ctx.lineTo(hX + 270, 500);
                ctx.lineTo(hX + 210, 500);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "#ffd700";
                ctx.font = "bold 12px Outfit";
                ctx.fillText("CASA DE LEHÍ EN JERUSALÉN", hX + 240, 320);

                // Platforms with ancient stone masonry
                this.platforms.forEach(plat => {
                    if (plat.tipo === "puerta_cerrada") {
                        if (plat.height <= 0) return;
                        ctx.save();
                        // Massive stone arch gate frame
                        ctx.fillStyle = "#1e1e24";
                        ctx.fillRect(plat.x - 12, 250, plat.width + 24, 250);
                        ctx.strokeStyle = "#43434d";
                        ctx.lineWidth = 3;
                        ctx.strokeRect(plat.x - 12, 250, plat.width + 24, 250);

                        // Sliding iron portcullis bars
                        let currentGateHeight = plat.height;
                        ctx.fillStyle = "#37474f";
                        for (let bx = plat.x + 4; bx < plat.x + plat.width; bx += 10) {
                            ctx.fillRect(bx, 250, 4, currentGateHeight);
                        }
                        ctx.fillRect(plat.x, 250 + 10, plat.width, 8);

                        // Giant Golden Lock
                        if (currentGateHeight > 30) {
                            ctx.fillStyle = "#a0781c";
                            ctx.fillRect(plat.x + plat.width / 2 - 8, 250 + currentGateHeight - 30, 16, 24);
                            ctx.fillStyle = "#ffd700";
                            ctx.beginPath();
                            ctx.arc(plat.x + plat.width / 2, 250 + currentGateHeight - 18, 3, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.restore();
                        return;
                    }

                    // Platform surface
                    ctx.fillStyle = plat.tipo === "suelo" ? "#19152b" : "#2f2b46";
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

                    // Stone masonry seams
                    ctx.save();
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                    ctx.lineWidth = 1;
                    let brickW = 40;
                    let brickH = 15;
                    for (let bY = plat.y + brickH; bY < plat.y + plat.height; bY += brickH) {
                        ctx.beginPath();
                        ctx.moveTo(plat.x, bY);
                        ctx.lineTo(plat.x + plat.width, bY);
                        ctx.stroke();
                    }
                    ctx.restore();

                    // Top limestone cap
                    ctx.fillStyle = "#7986cb";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                });

                // Draw Hiding Cave (Cavidad de la Roca, x = 3300 to 3500)
                let caveX = 3300;
                let caveY = 320;
                ctx.fillStyle = "#161224";
                ctx.beginPath();
                ctx.arc(caveX + 150, caveY + 180, 140, Math.PI, 0, false);
                ctx.fill();
                ctx.strokeStyle = "#38314f";
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.fillStyle = "#ffd700";
                ctx.font = "bold 11px Outfit";
                ctx.textAlign = "center";
                ctx.fillText("Cavidad de la Roca (Desierto)", caveX + 150, caveY + 50);

                // Tent of Lehi at the end of the valley (x = 3750)
                ctx.fillStyle = "#4e342e";
                ctx.beginPath();
                ctx.moveTo(3700, 500);
                ctx.lineTo(3780, 360);
                ctx.lineTo(3860, 500);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = "#ffd700";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fillStyle = "#fff8e1";
                ctx.font = "bold 11px Outfit";
                ctx.fillText("Tienda de Lehí y Saríah", 3780, 350);

                // Campfire outside Lehi's tent
                let fireBob = Math.sin(gameFrame * 0.2) * 3;
                ctx.fillStyle = "#ff5722";
                ctx.beginPath();
                ctx.arc(3680, 490 + fireBob, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#ffeb3b";
                ctx.beginPath();
                ctx.arc(3680, 492 + fireBob, 5, 0, Math.PI * 2);
                ctx.fill();

                // Draw Wealth Chests at Lehí's House (Phase 1)
                if (this.currentPhase === 1) {
                    this.wealthChests.forEach(c => {
                        if (c.collected) return;
                        let bob = Math.sin(gameFrame * 0.15 + c.x) * 4;

                        // Golden sparkle aura
                        let auraGrad = ctx.createRadialGradient(c.x + c.w / 2, c.y + bob + 15, 5, c.x + c.w / 2, c.y + bob + 15, 35);
                        auraGrad.addColorStop(0, "rgba(255, 215, 0, 0.45)");
                        auraGrad.addColorStop(1, "rgba(255, 215, 0, 0)");
                        ctx.fillStyle = auraGrad;
                        ctx.beginPath();
                        ctx.arc(c.x + c.w / 2, c.y + bob + 15, 35, 0, Math.PI * 2);
                        ctx.fill();

                        // Chest base
                        ctx.fillStyle = "#5d4037";
                        ctx.fillRect(c.x, c.y + bob, c.w, c.h);
                        ctx.strokeStyle = "#ffd700";
                        ctx.lineWidth = 2.5;
                        ctx.strokeRect(c.x, c.y + bob, c.w, c.h);

                        // Glowing gold inside
                        ctx.fillStyle = "#ffd700";
                        ctx.beginPath();
                        ctx.arc(c.x + c.w / 2, c.y + bob + 8, 10, 0, Math.PI * 2);
                        ctx.fill();

                        // Sparkles
                        ctx.fillStyle = "#ffffff";
                        let spk = Math.sin(gameFrame * 0.3 + c.x) * 4;
                        ctx.fillRect(c.x + c.w / 2 - 2 + spk, c.y + bob + 4, 4, 4);

                        // Label with icon and action prompt
                        ctx.fillStyle = "#ffe082";
                        ctx.font = "bold 10px Outfit";
                        ctx.textAlign = "center";
                        ctx.fillText(c.icon + " " + c.name, c.x + c.w / 2, c.y + bob - 16);
                        ctx.fillStyle = "#ffffff";
                        ctx.font = "bold 8px Outfit";
                        ctx.fillText("✨ Recoge", c.x + c.w / 2, c.y + bob - 6);
                    });
                }

                // Draw Labán in his palace (Phases 0, 1, 2)
                if (this.currentPhase <= 2) {
                    let lx = this.laban.x;
                    let ly = this.laban.y;
                    let lw = this.laban.width;
                    let lh = this.laban.height;

                    // Throne
                    ctx.fillStyle = "#3e2723";
                    ctx.fillRect(lx - 25, ly - 20, 95, 120);
                    ctx.strokeStyle = "#ffd700";
                    ctx.lineWidth = 3;
                    ctx.strokeRect(lx - 25, ly - 20, 95, 120);

                    // Laban Body (Arrogant noble posture)
                    ctx.fillStyle = "#b71c1c"; // Crimson mantle
                    ctx.fillRect(lx - 8, ly + 20, lw + 16, lh - 20);
                    ctx.fillStyle = "#cd7f32"; // Bronze breastplate
                    ctx.fillRect(lx, ly + 25, lw, lh - 40);

                    // Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(lx + lw / 2, ly + 10, 14, 0, Math.PI * 2);
                    ctx.fill();

                    // Helmet with red crest
                    ctx.fillStyle = "#78909c";
                    ctx.beginPath();
                    ctx.arc(lx + lw / 2, ly + 5, 15, Math.PI, 0, false);
                    ctx.fill();
                    ctx.fillStyle = "#d32f2f";
                    ctx.fillRect(lx + lw / 2 - 4, ly - 18, 8, 14);

                    // Golden sword at waist
                    ctx.fillStyle = "#ffd700";
                    ctx.fillRect(lx + lw - 2, ly + 40, 6, 32);

                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 12px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("Labán en su Palacio", lx + lw / 2, ly - 28);
                }

                // Draw Labán drunken body in the street (Phases 4 & 5)
                if ((this.currentPhase === 4 || this.currentPhase === 5) && this.laban && this.laban.state !== "dead") {
                    let lx = this.laban.x;
                    let ly = this.laban.y;

                    // Fallen body in street
                    ctx.fillStyle = "#b71c1c";
                    ctx.fillRect(lx, ly + 60, this.laban.height, this.laban.width);
                    ctx.fillStyle = "#cd7f32";
                    ctx.fillRect(lx + 15, ly + 62, this.laban.height - 30, this.laban.width - 10);

                    // Head fallen
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(lx + this.laban.height - 10, ly + 75, 12, 0, Math.PI * 2);
                    ctx.fill();

                    // Drunken indicator
                    ctx.fillStyle = "#90caf9";
                    ctx.font = "bold 12px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("Zzz... (Ebrio de vino)", lx + 45, ly + 45 + Math.sin(gameFrame * 0.1) * 3);

                    // The Sword of Laban fallen beside him (1 Nephi 4:9)
                    // Golden hilt and fine steel blade!
                    ctx.save();
                    ctx.translate(lx + 20, ly + 95);
                    // Glowing aura around sword
                    let swordGlow = ctx.createRadialGradient(20, -4, 5, 20, -4, 30);
                    swordGlow.addColorStop(0, "rgba(224, 247, 250, 0.7)");
                    swordGlow.addColorStop(1, "rgba(224, 247, 250, 0)");
                    ctx.fillStyle = swordGlow;
                    ctx.beginPath();
                    ctx.arc(20, -4, 30, 0, Math.PI * 2);
                    ctx.fill();

                    // Blade
                    ctx.strokeStyle = "#e0f7fa";
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(45, -10);
                    ctx.stroke();
                    // Gold hilt
                    ctx.strokeStyle = "#ffd700";
                    ctx.lineWidth = 6;
                    ctx.beginPath();
                    ctx.moveTo(-10, 2);
                    ctx.lineTo(0, 0);
                    ctx.stroke();
                    ctx.restore();

                    // Label: Espada de Labán
                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 10px Outfit";
                    ctx.fillText("✨ Espada de Labán (Acero finísimo)", lx + 45, ly + 115);

                    if (this.currentPhase === 5) {
                        let pulseAlpha = 0.6 + Math.sin(gameFrame * 0.2) * 0.4;
                        ctx.fillStyle = `rgba(255, 235, 59, ${pulseAlpha})`;
                        ctx.font = "bold 10px Outfit";
                        ctx.fillText("⚔️ [Presiona X / Atacar] para cumplir el mandato", lx + 45, ly + 130);
                    }
                }

                // Draw Zoram in Treasury (Phase 6)
                if (this.currentPhase === 6) {
                    let zx = 420;
                    let zy = 415;
                    // Robe
                    ctx.fillStyle = "#607d8b";
                    ctx.fillRect(zx, zy + 20, 28, 65);
                    // Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(zx + 14, zy + 12, 10, 0, Math.PI * 2);
                    ctx.fill();
                    // Keys of Treasury in hand
                    ctx.fillStyle = "#ffd700";
                    ctx.beginPath();
                    ctx.arc(zx + 28, zy + 45, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillRect(zx + 28, zy + 45, 12, 3);

                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 10px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("Zoram (Guardián de las Llaves)", zx + 14, zy - 5);
                }

                // Draw Planchas de Bronce on pedestal inside Treasury vault (x = 150)
                if (!this.platesCollected) {
                    let px = 150;
                    let py = 410;

                    // Stone Pedestal
                    ctx.fillStyle = "#37474f";
                    ctx.fillRect(px - 10, py + 25, 60, 65);
                    ctx.strokeStyle = "#263238";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(px - 10, py + 25, 60, 65);

                    // Plates of Brass (Thick golden-bronze sacred bound book)
                    let pBob = Math.sin(gameFrame * 0.1) * 3;
                    ctx.fillStyle = "#cd7f32"; // Deep bronze
                    ctx.fillRect(px, py + pBob, 42, 28);
                    ctx.strokeStyle = "#ffd700"; // Golden border
                    ctx.lineWidth = 2;
                    ctx.strokeRect(px, py + pBob, 42, 28);

                    // Binding rings
                    ctx.fillStyle = "#ffd700";
                    ctx.beginPath();
                    ctx.arc(px + 8, py + pBob, 3, 0, Math.PI * 2);
                    ctx.arc(px + 21, py + pBob, 3, 0, Math.PI * 2);
                    ctx.arc(px + 34, py + pBob, 3, 0, Math.PI * 2);
                    ctx.fill();

                    // Sacred Golden Halo
                    ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
                    ctx.beginPath();
                    ctx.arc(px + 21, py + pBob + 14, 28, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 10px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("Planchas de Bronce", px + 21, py + pBob - 10);
                }

                // Draw Angel of the Lord in Cave (Phase 3)
                if (this.angelActive) {
                    let ax = 3520;
                    let ay = 320;

                    // Blinding Celestial Radiance
                    let auraPulse = Math.sin(gameFrame * 0.2) * 20;
                    let angelGrad = ctx.createRadialGradient(ax, ay + 20, 10, ax, ay + 20, 90 + auraPulse);
                    angelGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
                    angelGrad.addColorStop(0.4, "rgba(255, 235, 59, 0.6)");
                    angelGrad.addColorStop(1, "rgba(255, 215, 0, 0)");
                    ctx.fillStyle = angelGrad;
                    ctx.beginPath();
                    ctx.arc(ax, ay + 20, 95 + auraPulse, 0, Math.PI * 2);
                    ctx.fill();

                    // Angelic Wings
                    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                    ctx.beginPath();
                    ctx.ellipse(ax - 28, ay + 15, 30, 14, -0.4, 0, Math.PI * 2);
                    ctx.ellipse(ax + 28, ay + 15, 30, 14, 0.4, 0, Math.PI * 2);
                    ctx.fill();

                    // Pure white robe body
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(ax - 12, ay + 10, 24, 55);

                    // Head & Golden Crown
                    ctx.fillStyle = "#fff9c4";
                    ctx.beginPath();
                    ctx.arc(ax, ay, 12, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#ffd700";
                    ctx.beginPath();
                    ctx.arc(ax, ay - 6, 8, Math.PI, 0, false);
                    ctx.fill();

                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 13px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("¡ÁNGEL DEL SEÑOR!", ax, ay - 25);
                }

                // Draw Beating with Rod animation in Phase 3
                if (this.beatingActive && !this.angelActive) {
                    let bx = 3460;
                    let by = 430;
                    // Laman swinging rod
                    let rodAngle = Math.sin(this.beatingTimer * 0.3) * 0.6 - 0.4;
                    ctx.save();
                    ctx.translate(bx, by);
                    ctx.rotate(rodAngle);
                    ctx.fillStyle = "#8d6e63"; // Wooden rod
                    ctx.fillRect(0, -5, 45, 6);
                    ctx.restore();

                    ctx.fillStyle = "#ff5252";
                    ctx.font = "bold 11px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("¡Lamán golpeando con una vara!", bx + 20, by - 35);
                }

                // Draw Followers (Family & Zoram)
                this.family.forEach(member => {
                    ctx.save();
                    let fH = member.agachado ? member.height * 0.55 : member.height;
                    let fY = member.y;

                    // Robe
                    ctx.fillStyle = member.healthy ? member.color : "#d32f2f";
                    ctx.fillRect(member.x + 10, fY + 20, 20, fH - 28);

                    // Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(member.x + 20, fY + 12, 9, 0, Math.PI * 2);
                    ctx.fill();

                    // Legs
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "#ffdbac";
                    let step = Math.sin(gameFrame * 0.15 + member.offset * 0.25) * 8;
                    ctx.beginPath();
                    ctx.moveTo(member.x + 14, fY + fH - 8);
                    ctx.lineTo(member.x + 14 + step, fY + fH);
                    ctx.moveTo(member.x + 26, fY + fH - 8);
                    ctx.lineTo(member.x + 26 - step, fY + fH);
                    ctx.stroke();

                    // Name tag
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 9px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText(member.name, member.x + 20, fY - 5);
                    ctx.restore();
                });

                // Draw Enemies (Guards with spears & torches)
                this.enemies.forEach(e => {
                    if (e.hp <= 0) return;
                    ctx.save();
                    // Armor
                    ctx.fillStyle = "#78909c";
                    ctx.fillRect(e.x + 8, e.y + 20, e.width - 16, e.height - 28);
                    ctx.fillStyle = "#cd7f32";
                    ctx.fillRect(e.x + 10, e.y + 25, e.width - 20, e.height - 40);

                    // Head & helmet
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(e.x + e.width / 2, e.y + 12, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#d32f2f";
                    ctx.fillRect(e.x + e.width / 2 - 3, e.y - 6, 6, 8);

                    // Torch if guard_torch
                    if (e.type === "guard_torch") {
                        let tx = e.dir > 0 ? e.x + e.width + 2 : e.x - 8;
                        ctx.fillStyle = "#5d4037";
                        ctx.fillRect(tx, e.y + 15, 4, 30);
                        ctx.fillStyle = "#ff9800";
                        ctx.beginPath();
                        ctx.arc(tx + 2, e.y + 10, 7, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                });

                // Hidden indicator above player during stealth
                if (game.player.hidden) {
                    ctx.fillStyle = "#81c784";
                    ctx.font = "bold 11px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("🕶️ ¡Oculto en las sombras!", game.player.x + game.player.width / 2, game.player.y - 12);
                }

                ctx.restore();
            }
        },

        // LEVEL 3: Building the Ship (Crafting & Gathering)
        {
            id: 3,
            name: "La Construcción del Barco",
            desc: "Consigue madera del bosque, herramientas de la montaña y construye el barco en la playa.",
            maxScroll: 3000,
            
            // Level introduction data
            introTitle: "Construyendo el Barco con Fe",
            introText: "El Señor manda a Nefi construir un barco para cruzar el gran océano hacia la tierra prometida. A pesar de las burlas y el escepticismo de Lamán y Lemuel, Nefi obedece con fe inquebrantable. Reúne los materiales necesarios (madera de cedro de los bosques y herramientas de metal forjadas en la montaña) y edifica el barco para emprender el viaje sagrado.",
            introObjective: "Recolecta madera y metal, esquiva a las fieras y construye las 5 fases del barco en la playa.",

            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;

                // Inventory
                this.woodCount = 0;
                this.toolCount = 0;
                this.maxWood = 10;
                this.maxTools = 5;

                this.shipProgress = 0; // 0 to 5 build phases
                this.speedMultiplier = 1; // Doubles when tools collected

                // Forest (0 to 1000 X), Mountain (1000 to 2200 X), Beach (2200 to 3000 X)
                // Trees for wood
                this.trees = [
                    { x: 300, y: 380, w: 50, h: 120, hp: 3, woodDropped: false },
                    { x: 550, y: 380, w: 60, h: 120, hp: 3, woodDropped: false },
                    { x: 800, y: 380, w: 55, h: 120, hp: 3, woodDropped: false }
                ];
                
                // Falling wood logs
                this.droppedItems = [];

                // Mountain tool chests
                this.chests = [
                    { x: 1250, y: 320, w: 45, h: 35, opened: false },
                    { x: 1720, y: 160, w: 45, h: 35, opened: false },
                    { x: 1850, y: 140, w: 45, h: 35, opened: false }
                ];

                // Floating logs in water
                this.logs = [
                    { x: 1050, y: 490, width: 90, height: 20, startX: 1050, range: 120, speed: 0.02 },
                    { x: 2050, y: 490, width: 90, height: 20, startX: 2050, range: 100, speed: 0.03 }
                ];

                // Obstacles
                this.boulders = [
                    { x: 1450, y: -50, radius: 15, active: true, spawnTimer: 0 },
                    { x: 1750, y: -50, radius: 15, active: true, spawnTimer: 60 }
                ];

                // Falling tree blocks
                this.blockers = [
                    { x: 950, y: 410, width: 40, height: 90, hp: 4, cleared: false }
                ];

                // Layout
                this.platforms = [
                    // Forest floor
                    { x: 0, y: 500, width: 1000, height: 100, tipo: "suelo" },
                    // Mountain walls/steps
                    { x: 1200, y: 380, width: 200, height: 120, tipo: "bloque" },
                    { x: 1300, y: 260, width: 150, height: 240, tipo: "bloque" },
                    { x: 1600, y: 200, width: 180, height: 300, tipo: "bloque" },
                    { x: 1800, y: 180, width: 150, height: 320, tipo: "bloque" },
                    // Beach floor
                    { x: 2200, y: 500, width: 800, height: 100, tipo: "suelo" }
                ];

                // Cave safe zone (1100 to 1250 X)
                this.cave = { x: 1100, y: 380, width: 150, height: 120 };

                // Enemies
                this.enemies = [
                    { x: 450, y: 450, type: "boar", hp: 1, dir: -1, width: 45, height: 35, speed: 3.5 },
                    { x: 2400, y: 450, type: "boar", hp: 1, dir: -1, width: 45, height: 35, speed: 4 }
                ];

                // Laman and Lemuel throwing rocks
                this.brothers = [
                    { x: 700, y: 420, active: false, timer: 0, hp: 1 },
                    { x: 1500, y: 120, active: false, timer: 0, hp: 1 }
                ];
                this.projectiles = [];

                // Storm Event
                this.stormTimer = 0;
                this.stormActive = false;
                this.lightningTimer = 0;
                this.lightningX = 0;

                // Dialogues
                game.dialogueQueue = [
                    { char: "Nefi", text: "El Señor me ha mostrado en visión cómo construir un barco para cruzar las grandes aguas. Debemos trabajar con fe." },
                    { char: "Nefi", text: "¡Lamán y Lemuel intentarán sabotearnos! Debemos defendernos." }
                ];
                game.startDialogue();

                this.finishSpiritualTextShown = false;
            },

            update: function(game, gameFrame, input) {
                // Update floating logs
                this.logs.forEach(l => {
                    l.x = l.startX + Math.sin(gameFrame * l.speed) * l.range;
                    
                    // Stand on moving logs
                    if (game.player.x + game.player.width > l.x && game.player.x < l.x + l.width &&
                        Math.abs((game.player.y + game.player.height) - l.y) < 10 && game.player.velY >= 0) {
                        game.player.y = l.y - game.player.height;
                        game.player.velY = 0;
                        game.player.grounded = true;
                        game.player.jumping = false;
                        // carry player along
                        game.player.x += Math.cos(gameFrame * l.speed) * l.range * l.speed;
                    }
                });

                // Spawning Laman/Lemuel rock throwing
                this.brothers.forEach(b => {
                    b.timer++;
                    if (!b.active && b.timer > 300) {
                        b.active = true;
                        b.timer = 0;
                        b.hp = 1;
                        game.showNotification("⚠️ ¡Tus hermanos rebeldes se acercan para lanzar piedras!");
                    }

                    if (b.active) {
                        // Throw rock every 90 frames
                        if (b.timer % 90 === 0) {
                            let angle = Math.PI * 0.75; // throw left
                            this.projectiles.push({
                                x: b.x,
                                y: b.y,
                                velX: -5,
                                velY: -7,
                                size: 10
                            });
                        }

                        // Combat hit brother
                        if (game.player.atacando && game.player.ataqueCooldown === 15) {
                            let swordX = game.player.direccion === "derecha" ? game.player.x + game.player.width : game.player.x - 50;
                            let hitBox = { x: swordX, y: game.player.y, width: 50, height: game.player.height };
                            if (game.collides(hitBox, { x: b.x, y: b.y, width: 45, height: 80 })) {
                                b.hp--;
                                window.gameAudio.playHit();
                                if (b.hp <= 0) {
                                    b.active = false;
                                    b.timer = 0;
                                    game.score += 50;
                                    game.showNotification("💨 ¡Tus hermanos huyen corriendo!");
                                }
                            }
                        }
                    }
                });

                // Update projectiles
                this.projectiles.forEach((p, idx) => {
                    p.x += p.velX;
                    p.velY += 0.25; // gravity
                    p.y += p.velY;

                    if (p.y > 576) {
                        this.projectiles.splice(idx, 1);
                        return;
                    }

                    // Collide player
                    if (game.player.inmune === 0 && game.collides(game.player, { x: p.x - p.size, y: p.y - p.size, width: p.size*2, height: p.size*2 })) {
                        game.playerHurt();
                        this.projectiles.splice(idx, 1);
                    }
                });

                // Update falling boulders on Mountain
                this.boulders.forEach(b => {
                    b.spawnTimer++;
                    if (b.spawnTimer > 120) {
                        b.spawnTimer = 0;
                        b.y = -20;
                        b.velY = 0;
                    }

                    b.velY += 0.3;
                    b.y += b.velY;

                    // Colls
                    if (game.player.inmune === 0 && game.collides(game.player, { x: b.x - b.radius, y: b.y - b.radius, width: b.radius*2, height: b.radius*2 })) {
                        game.playerHurt();
                        b.y = 800; // deactivate
                    }
                });

                // Update Storm Cycle (Storm lasts 15s every 45s)
                this.stormTimer++;
                if (!this.stormActive && this.stormTimer > 1800) { // 30s
                    this.stormActive = true;
                    this.stormTimer = 0;
                    this.lightningTimer = 0;
                    window.gameAudio.playThunder();
                    game.showNotification("⛈️ ¡Se acerca una Tormenta Espiritual! Refúgiate en la cueva.");
                }

                if (this.stormActive) {
                    if (this.stormTimer > 900) { // 15s
                        this.stormActive = false;
                        this.stormTimer = 0;
                        game.showNotification("☀️ La tormenta ha pasado.");
                    } else {
                        // Rain effects & Lightning
                        this.lightningTimer++;
                        if (this.lightningTimer === 90) {
                            // Target warning
                            this.lightningX = game.player.x + (Math.random() * 200 - 100);
                        }
                        if (this.lightningTimer >= 130) {
                            // Strike!
                            this.lightningTimer = 0;
                            window.gameAudio.playThunder();
                            
                            // Check safe cave zone
                            let playerInCave = game.player.x > this.cave.x && game.player.x + game.player.width < this.cave.x + this.cave.width;
                            
                            if (!playerInCave && Math.abs(game.player.x - this.lightningX) < 80) {
                                game.playerHurt();
                                // Lose materials
                                this.woodCount = Math.max(0, this.woodCount - 2);
                                this.toolCount = Math.max(0, this.toolCount - 1);
                                game.showNotification("⚡ ¡Te golpeó un rayo! Pierdes materiales.");
                            }
                        }
                    }
                }

                // Update Boars
                this.enemies.forEach(e => {
                    if (e.hp <= 0) return;
                    e.x += e.speed * e.dir;
                    if (e.x < 50 || e.x > 900) e.dir *= -1; // bounce forest

                    if (game.player.inmune === 0 && game.collides(game.player, e)) {
                        game.playerHurt();
                    }

                    // Sword hit boar
                    if (game.player.atacando && game.player.ataqueCooldown === 15) {
                        let swordX = game.player.direccion === "derecha" ? game.player.x + game.player.width : game.player.x - 50;
                        let hitBox = { x: swordX, y: game.player.y, width: 50, height: game.player.height };
                        if (game.collides(hitBox, e)) {
                            e.hp--;
                            window.gameAudio.playHit();
                            game.score += 30;
                        }
                    }
                });

                // Blockers (Fallen trees)
                this.blockers.forEach(b => {
                    if (b.cleared) return;
                    
                    // Stop player
                    if (game.player.x + game.player.width > b.x && game.player.x < b.x + b.width) {
                        if (game.player.velX > 0) game.player.x = b.x - game.player.width;
                    }

                    if (game.player.atacando && game.player.ataqueCooldown === 15) {
                        let swordX = game.player.direccion === "derecha" ? game.player.x + game.player.width : game.player.x - 50;
                        let hitBox = { x: swordX, y: game.player.y, width: 50, height: game.player.height };
                        if (game.collides(hitBox, b)) {
                            // Metal tools cut trees faster
                            b.hp -= this.speedMultiplier;
                            window.gameAudio.playHit();
                            if (b.hp <= 0) {
                                b.cleared = true;
                                game.showNotification("🪓 Árbol despejado.");
                                // Drop extra wood
                                this.droppedItems.push({ x: b.x, y: 450, type: "wood", collected: false });
                            }
                        }
                    }
                });

                // Chop trees
                this.trees.forEach(t => {
                    if (t.woodDropped) return;

                    if (game.player.atacando && game.player.ataqueCooldown === 15) {
                        let swordX = game.player.direccion === "derecha" ? game.player.x + game.player.width : game.player.x - 50;
                        let hitBox = { x: swordX, y: game.player.y, width: 50, height: game.player.height };
                        if (game.collides(hitBox, { x: t.x, y: t.y, width: t.w, height: t.h })) {
                            t.hp -= this.speedMultiplier;
                            window.gameAudio.playHit();
                            if (t.hp <= 0) {
                                t.woodDropped = true;
                                this.droppedItems.push({ x: t.x + 10, y: 450, type: "wood", collected: false });
                                game.showNotification("🌲 ¡Cortaste el árbol! Recoge la madera.");
                            }
                        }
                    }
                });

                // Open chests for tools
                this.chests.forEach(c => {
                    if (c.opened) return;
                    if (game.collides(game.player, { x: c.x, y: c.y, width: c.w, height: c.h })) {
                        c.opened = true;
                        this.toolCount = Math.min(this.maxTools, this.toolCount + 1);
                        window.gameAudio.playCoin();
                        game.showNotification("🔧 Encontraste herramientas de metal. ¡La recolección es más rápida!");
                        this.speedMultiplier = 2; // Double chopping speed
                    }
                });

                // Collect dropped items
                this.droppedItems.forEach(item => {
                    if (!item.collected && game.collides(game.player, { x: item.x - 20, y: item.y - 20, width: 40, height: 40 })) {
                        item.collected = true;
                        if (item.type === "wood") {
                            this.woodCount = Math.min(this.maxWood, this.woodCount + 2);
                        }
                        window.gameAudio.playCoin();
                    }
                });

                // Crafting on Beach
                if (game.player.x > 2400 && input.crafting) {
                    input.crafting = false; // Reset key
                    
                    if (this.shipProgress >= 5) {
                        game.showNotification("⛵ El barco ya está completamente construido.");
                        return;
                    }

                    // Check materials requirements (e.g., 2 wood, 1 tool per phase)
                    if (this.woodCount >= 2 && this.toolCount >= 1) {
                        this.woodCount -= 2;
                        this.toolCount -= 1;
                        this.shipProgress++;
                        window.gameAudio.playPowerUp();
                        game.score += 150;
                        game.showNotification(`🔨 ¡Fase de construcción ${this.shipProgress}/5 completada!`);

                        if (this.shipProgress === 5) {
                            game.dialogueQueue = [
                                { char: "Nefi", text: "Mira lo que el Señor ha hecho posible a través de nuestra fe. Ahora cruzaremos las grandes aguas." }
                            ];
                            game.startDialogue();
                        }
                    } else {
                        game.showNotification("❌ Materiales insuficientes. Necesitas 2 Madera y 1 Herramienta.");
                    }
                }

                // Pit/fall check
                if (game.player.y > 576) {
                    game.player.x = 150;
                    game.player.y = 400;
                    game.playerHurt();
                }

                // End level
                if (this.shipProgress === 5 && !game.dialogueActive && !this.finishSpiritualTextShown) {
                    this.finishSpiritualTextShown = true;
                    // Extra materials bonus
                    let bonus = (this.woodCount + this.toolCount) * 50;
                    game.score += bonus;
                    game.completeLevel("Con Dios, todo lo que parece imposible se vuelve posible.", "1 Nefi 17:51", bonus);
                }
            },

            draw: function(ctx, game, gameFrame, camaraX) {
                // Background forest / mountain / beach
                ctx.fillStyle = this.stormActive ? "#050614" : "#0d1b2a";
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Storm effects
                if (this.stormActive) {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
                    for (let i=0; i<30; i++) {
                        let rx = (i * 120 - gameFrame * 8) % 1024;
                        let ry = (i * 47 + gameFrame * 12) % 576;
                        ctx.fillRect(rx, ry, 1, 15);
                    }
                    
                    // Lightning warning
                    if (this.lightningTimer >= 90) {
                        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
                        ctx.fillRect(this.lightningX - camaraX - 2, 0, 4, 576);
                    }
                    if (this.lightningTimer >= 125) {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    }
                }

                // Platforms with brick textures
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.platforms.forEach(plat => {
                    ctx.fillStyle = plat.tipo === "suelo" ? "#1b2a47" : "#0f172a";
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    
                    // Draw brick texture lines
                    ctx.save();
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
                    ctx.lineWidth = 1;
                    let brickW = 40;
                    let brickH = 15;
                    // Horizontal lines
                    for (let bY = plat.y + brickH; bY < plat.y + plat.height; bY += brickH) {
                        ctx.beginPath();
                        ctx.moveTo(plat.x, bY);
                        ctx.lineTo(plat.x + plat.width, bY);
                        ctx.stroke();
                    }
                    // Vertical lines (staggered)
                    let row = 0;
                    for (let bY = plat.y; bY < plat.y + plat.height; bY += brickH) {
                        let offset = (row % 2) * (brickW / 2);
                        for (let bX = plat.x + offset; bX < plat.x + plat.width; bX += brickW) {
                            ctx.beginPath();
                            ctx.moveTo(bX, bY);
                            ctx.lineTo(bX, Math.min(plat.y + plat.height, bY + brickH));
                            ctx.stroke();
                        }
                        row++;
                    }
                    ctx.restore();

                    ctx.fillStyle = "#e0e1dd";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                });
                ctx.restore();

                // Draw Forest Trees
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.trees.forEach(t => {
                    if (t.woodDropped) {
                        // Stumps
                        ctx.fillStyle = "#4e342e";
                        ctx.fillRect(t.x + 15, 470, 20, 30);
                    } else {
                        // Trunk
                        ctx.fillStyle = "#5d4037";
                        ctx.fillRect(t.x + 15, t.y + 40, 20, 80);
                        // Foliage
                        ctx.fillStyle = "#2e7d32";
                        ctx.beginPath();
                        ctx.arc(t.x + 25, t.y + 20, 35, 0, Math.PI*2);
                        ctx.fill();
                    }
                });
                ctx.restore();

                // Blocker trees
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.blockers.forEach(b => {
                    if (b.cleared) return;
                    ctx.fillStyle = "#4e342e";
                    ctx.fillRect(b.x, b.y, b.width, b.height);
                    ctx.fillStyle = "#ffd54f"; // wood splinters
                    ctx.fillRect(b.x + 10, b.y + 30, 20, 5);
                });
                ctx.restore();

                // Floating Logs
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.logs.forEach(l => {
                    ctx.fillStyle = "#d84315";
                    ctx.fillRect(l.x, l.y, l.width, l.height);
                });
                ctx.restore();

                // Chests
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.chests.forEach(c => {
                    ctx.fillStyle = c.opened ? "#cfd8dc" : "#ffb300";
                    ctx.fillRect(c.x, c.y, c.w, c.h);
                    ctx.fillStyle = "#4a148c";
                    ctx.fillRect(c.x + c.w/2 - 4, c.y + 8, 8, 8);
                });
                ctx.restore();

                // Falling boulders
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.boulders.forEach(b => {
                    if (b.y > 0 && b.y < 576) {
                        ctx.fillStyle = "#78909c";
                        ctx.beginPath();
                        ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
                        ctx.fill();
                    }
                });
                ctx.restore();

                // Dropped wood logs on ground
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.droppedItems.forEach(item => {
                    if (!item.collected) {
                        ctx.fillStyle = "#a1887f";
                        ctx.fillRect(item.x, item.y, 25, 12);
                    }
                });
                ctx.restore();

                // Projectiles
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.projectiles.forEach(p => {
                    ctx.fillStyle = "#ffffff";
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                    ctx.fill();
                });
                ctx.restore();

                // Boars
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.enemies.forEach(e => {
                    if (e.hp <= 0) return;
                    ctx.fillStyle = "#3e2723";
                    ctx.fillRect(e.x, e.y, e.width, e.height);
                    ctx.fillStyle = "#ff8a80"; // tusks
                    ctx.fillRect(e.x + (e.dir > 0 ? e.width - 5 : -5), e.y + 15, 10, 8);
                });
                ctx.restore();

                // Brothers
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.brothers.forEach(b => {
                    if (!b.active) return;
                    ctx.fillStyle = "#555555";
                    ctx.fillRect(b.x, b.y, 45, 80);
                    ctx.fillStyle = "#ffdbac";
                    ctx.fillRect(b.x + 10, b.y, 25, 15);
                });
                ctx.restore();

                // Cave
                ctx.save();
                ctx.translate(-camaraX, 0);
                ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
                ctx.fillRect(this.cave.x, this.cave.y, this.cave.width, this.cave.height);
                ctx.strokeStyle = "#37474f";
                ctx.strokeRect(this.cave.x, this.cave.y, this.cave.width, this.cave.height);
                ctx.restore();

                // Ship Construction Blueprint & Building Stages
                ctx.save();
                ctx.translate(-camaraX, 0);
                
                // Ship blueprint X=2500, Y=350
                let sX = 2500;
                let sY = 320;

                // Draw blueprint silhouette if progress < 5
                ctx.strokeStyle = "rgba(255,255,255,0.15)";
                ctx.lineWidth = 2;
                ctx.strokeRect(sX, sY, 300, 180);

                // Stage 1: Hull bottom
                if (this.shipProgress >= 1) {
                    ctx.fillStyle = "#5d4037";
                    ctx.beginPath();
                    ctx.moveTo(sX, sY + 150);
                    ctx.lineTo(sX + 300, sY + 150);
                    ctx.lineTo(sX + 240, sY + 180);
                    ctx.lineTo(sX + 60, sY + 180);
                    ctx.closePath();
                    ctx.fill();
                }
                // Stage 2: Sides
                if (this.shipProgress >= 2) {
                    ctx.fillStyle = "#4e342e";
                    ctx.fillRect(sX + 15, sY + 100, 270, 50);
                }
                // Stage 3: Deck
                if (this.shipProgress >= 3) {
                    ctx.fillStyle = "#8d6e63";
                    ctx.fillRect(sX, sY + 95, 300, 10);
                }
                // Stage 4: Mast
                if (this.shipProgress >= 4) {
                    ctx.fillStyle = "#3e2723";
                    ctx.fillRect(sX + 145, sY + 10, 10, 85);
                }
                // Stage 5: Sails
                if (this.shipProgress >= 5) {
                    ctx.fillStyle = "#f5f5f5";
                    ctx.beginPath();
                    ctx.moveTo(sX + 150, sY + 15);
                    ctx.lineTo(sX + 230, sY + 50);
                    ctx.lineTo(sX + 150, sY + 80);
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();

                // CUSTOM GATHER HUD ON CANVAS
                ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                ctx.fillRect(400, 20, 224, 45);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 11px Outfit";
                ctx.fillText(`Madera: ${this.woodCount}/${this.maxWood} 🌲`, 415, 45);
                ctx.fillText(`Herr.: ${this.toolCount}/${this.maxTools} 🔧`, 520, 45);

                // Build prompt
                if (game.player.x > 2400 && this.shipProgress < 5) {
                    ctx.fillStyle = "rgba(255, 215, 0, 0.85)";
                    ctx.font = "bold 13px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("Presiona C (o pulsa abajo) para CONSTRUIR barco", 2700 - camaraX, sY - 20);
                }
            }
        },

        // LEVEL 4: Journey to Promised Land (Ship Survival Platformer)
        {
            id: 4,
            name: "El Viaje a la Tierra Prometida",
            desc: "Sobrevive a la tormenta en alta mar durante 60 segundos guardando los mandamientos.",
            maxScroll: 1024,
            
            // Level introduction data
            introTitle: "El Viaje a la Tierra Prometida",
            introText: "Durante la travesía por el océano, Lamán y Lemuel se rebelan y atan a Nefi al mástil del barco, provocando la ira del Señor y una gran tempestad. Al cuarto día, temiendo perecer, sus hermanos lo liberan. Nefi ora con fe y la Liahona vuelve a funcionar, calmando los vientos. ¡Sobrevive a la gran tormenta!",
            introObjective: "Evita caer al mar, mantén activa la Liahona y resiste la tempestad durante 60 segundos.",

            init: function(game) {
                game.player.x = 400;
                game.player.y = 350;
                game.score = 0;
                game.player.fe = 3;

                this.timer = 60; // 60s
                this.ticker = 0;

                this.shipAngle = 0; // sway angle
                this.swayDir = 1;

                this.liahonaActive = false;
                this.liahonaTimer = 0;
                this.liahonaPower = { x: 500, y: 200, active: true };

                // Moving wave items
                this.giantWaves = [];
                this.waveSpawnTimer = 0;

                // Sea monster
                this.monster = { y: 600, active: false, timer: 0, warning: false, phase: 0 };

                // Mast climb rope paths
                this.ropes = [
                    { x: 300, yStart: 100, yEnd: 460 },
                    { x: 700, yStart: 100, yEnd: 460 }
                ];

                // Layout (Ship Deck)
                this.platforms = [
                    // Main deck with holes
                    { x: 100, y: 460, width: 350, height: 100, tipo: "suelo" },
                    // Gap/Hole in middle deck
                    { x: 550, y: 460, width: 370, height: 100, tipo: "suelo" },
                    
                    // Elevated structures
                    { x: 250, y: 300, width: 100, height: 20, tipo: "plataforma" },
                    { x: 650, y: 300, width: 100, height: 20, tipo: "plataforma" }
                ];

                // Dialogues
                game.dialogueQueue = [
                    { char: "Lehí", text: "Hemos estado muchos días en el mar. La Liahona funciona y nos guía según nuestra fe y diligencia." },
                    { char: "Nefi", text: "¡Todos al barco! La tormenta se aproxima, mantengamos la fe en Dios." }
                ];
                game.startDialogue();

                this.stormTriggered = false;
                this.finishSpiritualTextShown = false;
            },

            update: function(game, gameFrame, input) {
                // Timer tick
                this.ticker++;
                if (this.ticker >= 60) { // 1 second
                    this.ticker = 0;
                    this.timer--;
                    
                    if (this.timer <= 0) {
                        this.timer = 0;
                    }
                }

                // Sway mechanics (oscillate ship angle)
                let swaySpeed = this.timer < 30 ? 0.04 : 0.02; // violent in late game
                this.shipAngle = Math.sin(gameFrame * swaySpeed) * (this.timer < 30 ? 0.08 : 0.04);
                
                // Add sliding force to player based on angle
                if (game.player.grounded && !input.abajo) {
                    game.player.velX += this.shipAngle * 4;
                }

                // Rope climbing logic
                let nearRope = null;
                this.ropes.forEach(r => {
                    if (Math.abs(game.player.x + game.player.width/2 - r.x) < 30 &&
                        game.player.y >= r.yStart - 50 && game.player.y <= r.yEnd + 50) {
                        nearRope = r;
                    }
                });

                if (nearRope) {
                    if (input.saltar) { // Climb up
                        game.player.velY = -4;
                        game.player.jumping = true;
                        game.player.grounded = false;
                    } else if (input.abajo) { // Climb down
                        game.player.velY = 4;
                    }
                }

                // Wave spawners
                this.waveSpawnTimer++;
                let waveRate = this.timer < 30 ? 120 : 200; // spawn faster during final storm
                if (this.waveSpawnTimer > waveRate) {
                    this.waveSpawnTimer = 0;
                    let dir = Math.random() > 0.5 ? 1 : -1;
                    this.giantWaves.push({
                        x: dir > 0 ? -100 : 1100,
                        y: 360,
                        width: 70,
                        height: 120,
                        speed: 5 * dir
                    });
                }

                // Update Waves
                this.giantWaves.forEach((w, idx) => {
                    w.x += w.speed;
                    
                    if (w.x < -150 || w.x > 1200) {
                        this.giantWaves.splice(idx, 1);
                        return;
                    }

                    // Collide player
                    if (!this.liahonaActive && game.player.inmune === 0 && game.collides(game.player, w)) {
                        game.playerHurt();
                        game.player.velX = w.speed > 0 ? 12 : -12; // massive pushback
                        this.giantWaves.splice(idx, 1);
                        game.showNotification("🌊 ¡Te golpeó una ola gigante!");
                    }
                });

                // Update Liahona Power-up
                if (this.liahonaPower.active) {
                    let liaBox = { x: this.liahonaPower.x - 20, y: this.liahonaPower.y - 20, width: 40, height: 40 };
                    if (game.collides(game.player, liaBox)) {
                        this.liahonaPower.active = false;
                        this.liahonaActive = true;
                        this.liahonaTimer = 600; // 10 seconds
                        window.gameAudio.playPowerUp();
                        game.showNotification("🧭 ¡Liahona activada! Protección espiritual y aumento de velocidad.");
                    }
                }

                if (this.liahonaActive) {
                    this.liahonaTimer--;
                    // Speed bonus
                    game.player.speed = 12;
                    if (this.liahonaTimer <= 0) {
                        this.liahonaActive = false;
                        game.player.speed = 8;
                    }
                }

                // Sea Monster spawns every 20 seconds
                this.monster.timer++;
                if (this.monster.timer > 1000) { // approx 17s
                    this.monster.warning = true;
                }
                if (this.monster.timer > 1100) {
                    this.monster.warning = false;
                    this.monster.active = true;
                    this.monster.timer = 0;
                    window.gameAudio.playThunder();
                    game.showNotification("🐉 ¡Un monstruo marino emerge a babor! Agáchate ▼ para esquivar.");
                }

                if (this.monster.active) {
                    // Sweeps head across deck
                    this.monster.phase += 0.05;
                    this.monster.y = 300 + Math.sin(this.monster.phase) * 100;
                    
                    let mBox = { x: 0, y: this.monster.y, width: 1024, height: 80 };
                    if (!this.liahonaActive && game.player.inmune === 0 && game.collides(game.player, mBox)) {
                        game.playerHurt();
                    }

                    if (this.monster.phase > Math.PI) {
                        this.monster.active = false;
                        this.monster.phase = 0;
                    }
                }

                // Storm Dialogues mid-game - quiet moments only
                if (!this.stormTriggered && this.timer <= 30 && game.player.grounded && Math.abs(game.player.velX) < 2) {
                    this.stormTriggered = true;
                    game.dialogueQueue = [
                        { char: "Nefi", text: "¡La tormenta arrecia! Lamán y Lemuel, atadme al mástil si queréis, ¡pero yo alabaré al Señor y Él salvará este barco!" },
                        { char: "Lamán", text: "¡Vamos a morir por tu culpa!" }
                    ];
                    game.startDialogue();
                }

                // Fall checks
                if (game.player.y > 576) {
                    game.player.x = 400;
                    game.player.y = 300;
                    game.playerHurt();
                }

                // Level victory
                if (this.timer <= 0 && !game.dialogueActive && !this.finishSpiritualTextShown) {
                    this.finishSpiritualTextShown = true;
                    game.completeLevel("Si guardan mis mandamientos, prosperarán en la tierra.", "1 Nefi 2:20", 300);
                }
            },

            draw: function(ctx, game, gameFrame, camaraX) {
                // Ocean sky and storm color
                ctx.fillStyle = this.timer < 30 ? "#02030f" : "#0d1b2a";
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Rain lines during storm
                ctx.fillStyle = "rgba(255,255,255,0.1)";
                for (let i = 0; i < 40; i++) {
                    let rx = (i * 97 - gameFrame * 15) % 1024;
                    let ry = (i * 37 + gameFrame * 20) % 576;
                    ctx.fillRect(rx, ry, 1.5, 20);
                }

                // Draw Ropes/Masts
                this.ropes.forEach(r => {
                    ctx.strokeStyle = "#8d6e63";
                    ctx.lineWidth = 12;
                    ctx.beginPath();
                    ctx.moveTo(r.x, r.yStart);
                    ctx.lineTo(r.x, r.yEnd);
                    ctx.stroke();

                    // Ladder steps
                    ctx.strokeStyle = "#4e342e";
                    ctx.lineWidth = 4;
                    for (let stepY = r.yStart + 20; stepY < r.yEnd; stepY += 25) {
                        ctx.beginPath();
                        ctx.moveTo(r.x - 12, stepY);
                        ctx.lineTo(r.x + 12, stepY);
                        ctx.stroke();
                    }
                });

                // Apply Ship Sway rotation matrix
                ctx.save();
                ctx.translate(512, 460); // rotate around middle deck
                ctx.rotate(this.shipAngle);
                ctx.translate(-512, -460);

                // Deck wood panels with wood planks texture
                this.platforms.forEach(plat => {
                    ctx.fillStyle = "#5d4037";
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    
                    // Draw vertical wood plank lines
                    ctx.save();
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
                    ctx.lineWidth = 1;
                    let plankW = 15;
                    for (let pX = plat.x + plankW; pX < plat.x + plat.width; pX += plankW) {
                        ctx.beginPath();
                        ctx.moveTo(pX, plat.y);
                        ctx.lineTo(pX, plat.y + plat.height);
                        ctx.stroke();
                    }
                    ctx.restore();

                    ctx.fillStyle = "#8d6e63";
                    ctx.fillRect(plat.x, plat.y, plat.width, 8);
                });

                // Swaying decoration assets (cabin, wheel)
                ctx.fillStyle = "#3e2723";
                ctx.fillRect(120, 380, 80, 80); // cabin
                ctx.fillStyle = "#ffe082";
                ctx.fillRect(140, 400, 20, 20); // window

                ctx.restore();

                // Draw waves (outside rotation)
                this.giantWaves.forEach(w => {
                    ctx.fillStyle = "rgba(0, 191, 255, 0.65)";
                    ctx.beginPath();
                    ctx.moveTo(w.x, w.y + w.height);
                    ctx.quadraticCurveTo(w.x + w.width/2, w.y, w.x + w.width, w.y + w.height);
                    ctx.closePath();
                    ctx.fill();
                    // Foam
                    ctx.fillStyle = "#ffffff";
                    ctx.beginPath();
                    ctx.arc(w.x + w.width/2, w.y + 10, 15, 0, Math.PI*2);
                    ctx.fill();
                });

                // Sea Monster Head sweep
                if (this.monster.active) {
                    ctx.fillStyle = "#1b5e20"; // Dark scales
                    ctx.fillRect(0, this.monster.y, 1024, 60);
                    // Glowing yellow eyes
                    ctx.fillStyle = "#ffd600";
                    ctx.beginPath();
                    ctx.arc(512, this.monster.y + 30, 20, 0, Math.PI*2);
                    ctx.fill();
                } else if (this.monster.warning) {
                    // Warning flash on water level
                    if (Math.floor(gameFrame / 10) % 2 === 0) {
                        ctx.fillStyle = "rgba(211, 47, 47, 0.4)";
                        ctx.fillRect(0, 480, 1024, 10);
                        ctx.fillStyle = "#ffffff";
                        ctx.font = "bold 13px Outfit";
                        ctx.textAlign = "center";
                        ctx.fillText("⚠️ ¡PELIGRO ACUÁTICO INMINENTE! PREPÁRATE PARA AGACHARTE", 512, 450);
                    }
                }

                // Liahona powerup float
                if (this.liahonaPower.active) {
                    let floatY = this.liahonaPower.y + Math.sin(gameFrame * 0.08) * 8;
                    ctx.fillStyle = "rgba(255, 215, 0, 0.2)";
                    ctx.beginPath();
                    ctx.arc(this.liahonaPower.x, floatY, 25, 0, Math.PI*2);
                    ctx.fill();
                    // Gold compass core
                    ctx.fillStyle = "#ffd700";
                    ctx.beginPath();
                    ctx.arc(this.liahonaPower.x, floatY, 12, 0, Math.PI*2);
                    ctx.fill();
                    // Arrow pointer
                    ctx.fillStyle = "#d50000";
                    ctx.beginPath();
                    ctx.moveTo(this.liahonaPower.x, floatY - 8);
                    ctx.lineTo(this.liahonaPower.x - 4, floatY + 4);
                    ctx.lineTo(this.liahonaPower.x + 4, floatY + 4);
                    ctx.closePath();
                    ctx.fill();
                }

                // Draw Ocean front (moving waves covering deck bottom)
                ctx.fillStyle = "rgba(13, 27, 42, 0.8)";
                ctx.beginPath();
                ctx.moveTo(0, 480);
                for (let x = 0; x <= 1024; x += 40) {
                    let waveY = 480 + Math.sin(gameFrame * 0.05 + x * 0.02) * 12;
                    ctx.lineTo(x, waveY);
                }
                ctx.lineTo(1024, 576);
                ctx.lineTo(0, 576);
                ctx.closePath();
                ctx.fill();

                // Liahona UI Arrow (Navigation aid)
                if (this.liahonaActive) {
                    ctx.save();
                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 13px Outfit";
                    ctx.fillText("BRÚJULA LIAHONA EN LÍNEA 🧭", 412, 90);
                    // Pulsing golden ring around player
                    ctx.strokeStyle = `rgba(255, 215, 0, ${0.4 + Math.sin(gameFrame*0.2)*0.3})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(game.player.x + game.player.width/2, game.player.y + game.player.height/2, 50, 0, Math.PI*2);
                    ctx.stroke();
                    ctx.restore();
                }

                // HUD Countdown timer
                ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                ctx.fillRect(450, 20, 124, 45);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 16px Outfit";
                ctx.textAlign = "center";
                ctx.fillText(`${this.timer} SEG`, 512, 48);
            }
        }
    ]
};

window.module1 = module1;
