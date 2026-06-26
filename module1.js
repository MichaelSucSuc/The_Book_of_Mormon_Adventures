// Module 1: 1 Nephi - The Faithful Family
const module1 = {
    id: 1,
    name: "1 Nefi - La familia fiel",
    libros: ["1 Nefi"],
    personajes: ["Nefi", "Lehí", "Saríah", "Lamán", "Lemuel", "Sam"],
    enseñanzas: ["Fe y obediencia", "Escrituras de Bronce", "Construcción con fe", "Guiados por la Liahona"],
    unlocked: true,
    levels: [
        // LEVEL 1: Escape from Jerusalem (Escort & Tutorial)
        {
            id: 1,
            name: "Jerusalén - La Huida de Lehí",
            desc: "Lleva a tu familia a salvo fuera de Jerusalén hacia el desierto.",
            maxScroll: 3800,
            
            // Level introduction data
            introTitle: "Jerusalén: La Huida de Lehí",
            introText: "Año 600 a.C. El Señor ha mandado al profeta Lehí salir de Jerusalén con su familia e internarse en el desierto para salvar sus vidas de la inminente destrucción. Sin embargo, los líderes y guardias de la ciudad nos persiguen hostilmente para capturarnos por haber testificado contra su maldad. Debemos huir de prisa con nuestra familia, evitar a las patrullas que nos siguen y avanzar con fe.",
            introObjective: "Llega al Valle de Lemuel guiando a tu familia y evadiendo a los guardias que te persiguen.",
            characterId: "lehi",
            
            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                
                // Tutorial messages
                this.tutorials = [
                    { x: 200, text: "Usa ◀ ▶ para caminar. ¡Tu familia te seguirá!", triggered: false },
                    { x: 500, text: "Presiona Z (o ▲ en celular) para saltar muros.", triggered: false },
                    { x: 900, text: "Presiona X (o ⚔️ en celular) para ahuyentar enemigos usando tu bastón de fe.", triggered: false },
                    { x: 1300, text: "Presiona Abajo ▼ para agacharte y pasar por túneles.", triggered: false }
                ];

                // Checkpoint
                this.checkpoint = { x: 150, y: 400, visited: true };

                // Family queue configuration (Lehí is leading, family follows)
                this.family = [
                    { name: "Saríah", color: "#d2b48c", height: 88, offset: 35, healthy: true, jumping: false, jumpTimer: 0 },
                    { name: "Sam", color: "#a0522d", height: 90, offset: 70, healthy: true, jumping: false, jumpTimer: 0 },
                    { name: "Lamán", color: "#555555", height: 94, offset: 105, healthy: true, jumping: false, jumpTimer: 0 },
                    { name: "Lemuel", color: "#666666", height: 94, offset: 140, healthy: true, jumping: false, jumpTimer: 0 },
                    { name: "Nefi", color: "#0a66d0", height: 85, offset: 175, healthy: true, jumping: false, jumpTimer: 0 }
                ];
                
                // Position history buffer for snake following
                this.positionHistory = [];
                for(let i=0; i<300; i++) {
                    this.positionHistory.push({ x: 150, y: 400, agachado: false, jumping: false });
                }

                // Level layout
                this.platforms = [
                    { x: 0, y: 500, width: 1400, height: 100, tipo: "suelo" },
                    { x: 450, y: 410, width: 150, height: 90, tipo: "muro" },
                    { x: 800, y: 390, width: 220, height: 60, tipo: "plataforma" },
                    { x: 1150, y: 350, width: 180, height: 60, tipo: "plataforma" },
                    // Gap/Pit
                    { x: 1550, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 1700, y: 380, width: 250, height: 60, tipo: "plataforma" },
                    { x: 2100, y: 420, width: 150, height: 80, tipo: "bloque" },
                    { x: 2400, y: 360, width: 200, height: 60, tipo: "plataforma" },
                    // Gap/Pit
                    { x: 2900, y: 500, width: 1200, height: 100, tipo: "suelo" },
                    { x: 3000, y: 420, width: 300, height: 80, tipo: "bloque" }
                ];

                this.decorations = [
                    { x: 100, y: 220, w: 200, h: 280, label: "Casa de Lehí" },
                    { x: 600, y: 350, w: 80, h: 150, label: "Puerta Jerusalén" },
                    { x: 1600, y: 450, w: 100, h: 50, label: "Ruinas" },
                    { x: 3300, y: 380, w: 160, h: 120, label: "Tiendas de Lehí" }
                ];

                // Torches placement for fire particle effects
                this.torches = [
                    { x: 580, y: 360 },
                    { x: 690, y: 360 },
                    { x: 1620, y: 430 },
                    { x: 3260, y: 390 }
                ];

                this.monedas = [
                    { x: 350, y: 450, collected: false },
                    { x: 880, y: 360, collected: false },
                    { x: 920, y: 360, collected: false },
                    { x: 1240, y: 320, collected: false },
                    { x: 1800, y: 360, collected: false },
                    { x: 2200, y: 350, collected: false },
                    { x: 2500, y: 330, collected: false },
                    { x: 3100, y: 360, collected: false }
                ];

                this.enemies = [
                    { x: 650, y: 428, type: "soldier", hp: 2, range: 100, startX: 650, dir: -1, width: 45, height: 72, speed: 2, state: "patrol" },
                    { x: 1050, y: 428, type: "burlon", hp: 1, range: 80, startX: 1050, dir: 1, width: 40, height: 72, speed: 3, state: "patrol" },
                    { x: 1950, y: 428, type: "soldier", hp: 2, range: 120, startX: 1950, dir: -1, width: 45, height: 72, speed: 2.2, state: "patrol" },
                    { x: 2350, y: 428, type: "burlon", hp: 1, range: 100, startX: 2350, dir: -1, width: 40, height: 72, speed: 3, state: "patrol" }
                ];

                // Dialogues
                game.dialogueQueue = [
                    { char: "Lehí", text: "Familia mía, he visto en visión que Jerusalén será destruida si no se arrepiente. El Señor nos ha mandado huir al desierto y abandonar nuestro oro y plata." },
                    { char: "Nefi", text: "Padre, confiaremos en la revelación del Señor. Dejaremos nuestras riquezas y te seguiremos al desierto." }
                ];
                game.startDialogue();

                this.sariahDialogueTriggered = false;
                this.valleyDialogueTriggered = false;
                this.finishSpiritualTextShown = false;
            },

            update: function(game, gameFrame, input) {
                // Record history for family queue
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

                // Dialogue trigger middle - quiet moments only
                if (!this.sariahDialogueTriggered && game.player.x > 1600 && game.player.grounded && Math.abs(game.player.velX) < 2) {
                    this.sariahDialogueTriggered = true;
                    game.dialogueQueue = [
                        { char: "Saríah", text: "¿Estás seguro de que esto es lo correcto, Lehí? Hemos dejado todo nuestro oro y nuestro hogar por el desierto." },
                        { char: "Lehí", text: "Saríah, confía en el Señor. Jerusalén ciertamente será destruida si nos quedamos. Él nos guiará." }
                    ];
                    game.startDialogue();
                }

                // Dialogue trigger arriving at Valley of Lemuel - quiet moments only
                if (!this.valleyDialogueTriggered && game.player.x > 3300 && game.player.grounded && Math.abs(game.player.velX) < 2) {
                    this.valleyDialogueTriggered = true;
                    game.dialogueQueue = [
                        { char: "Lehí", text: "Hemos llegado al Valle de Lemuel, cerca de las orillas del Mar Rojo. Aquí armaremos nuestras tiendas y descansaremos." },
                        { char: "Nefi", text: "Construiré un altar de piedras, padre, para que demos gracias y ofrezcamos sacrificios al Señor por habernos librado." },
                        { char: "Lehí", text: "¡Oh Lamán, que seas como este río, fluyendo continuamente en la senda de la rectitud! ¡Y tú, Lemuel, que seas como este valle, firme y constante en guardar los mandamientos!" },
                        { char: "Lehí", text: "Pero vuestra fe se pondrá a prueba. El Señor me ha mandado en un sueño que vosotros, mis hijos, debéis regresar a Jerusalén para obtener las Planchas de Bronce de Labán." },
                        { char: "Nefi", text: "¡Iré y haré lo que el Señor ha mandado! Regresaremos a la ciudad, padre. Sé que el Señor preparará una vía para que cumplamos Su mandato." }
                    ];
                    game.startDialogue();
                }

                // Update tutorials
                this.tutorials.forEach(t => {
                    if (!t.triggered && game.player.x >= t.x) {
                        t.triggered = true;
                        game.showNotification(t.text);
                    }
                });

                // Update enemies
                this.enemies.forEach(e => {
                    if (e.hp <= 0) {
                        if (e.state !== "dead") {
                            e.state = "dead";
                            game.score += e.type === "soldier" ? 50 : 25;
                        }
                        return;
                    }

                    // Simple patrol logic
                    if (e.state === "patrol") {
                        e.x += e.speed * e.dir;
                        if (Math.abs(e.x - e.startX) > e.range) {
                            e.dir *= -1;
                        }

                        // Touch player
                        if (game.player.inmune === 0 && game.collides(game.player, e)) {
                            game.playerHurt();
                        }

                        // Check family colls
                        this.family.forEach(member => {
                            if (member.healthy && game.collides(member, e)) {
                                member.healthy = false;
                                game.score = Math.max(0, game.score - 50);
                                window.gameAudio.playHurt();
                                game.showNotification("¡Un familiar fue asustado! Pierdes puntos.");
                            }
                        });
                    } else if (e.state === "scared") {
                        // Burlones run away
                        e.x += e.speed * 2 * e.dir;
                    }
                });

                // Check coin collection
                this.monedas.forEach(m => {
                    if (!m.collected && game.collides(game.player, { x: m.x - 10, y: m.y - 10, width: 20, height: 20 })) {
                        m.collected = true;
                        game.score += 10;
                        window.gameAudio.playCoin();
                    }
                });

                // Dynamic Checkpoint updates
                if (game.player.x > 1650 && this.checkpoint.x < 1600 && game.player.grounded) {
                    this.checkpoint = { x: 1650, y: 400 };
                }
                if (game.player.x > 2950 && this.checkpoint.x < 2900 && game.player.grounded) {
                    this.checkpoint = { x: 2950, y: 400 };
                }

                // Pit/fall check
                if (game.player.y > 576) {
                    game.player.x = this.checkpoint.x;
                    game.player.y = this.checkpoint.y;
                    game.player.velX = 0;
                    game.player.velY = 0;
                    game.playerHurt();

                    // Reset position history so family doesn't stretch or snap in weird ways
                    this.positionHistory = [];
                    for(let i=0; i<300; i++) {
                        this.positionHistory.push({ x: this.checkpoint.x, y: this.checkpoint.y, agachado: false, jumping: false });
                    }
                    this.family.forEach(member => {
                        member.x = this.checkpoint.x;
                        member.y = this.checkpoint.y;
                    });
                }

                // Check level completion after reaching the tents and dialogue has finished
                if (this.valleyDialogueTriggered && !game.dialogueActive && game.player.x > 3600 && !this.finishSpiritualTextShown) {
                    this.finishSpiritualTextShown = true;
                    // Calculate safety bonus
                    let safeCount = this.family.filter(m => m.healthy).length;
                    let bonus = safeCount * 100;
                    game.score += bonus;
                    
                    game.completeLevel("Fue obediente a la palabra del Señor y partió para el desierto.", "1 Nefi 2:2-3", bonus);
                }
            },

            draw: function(ctx, game, gameFrame, camaraX) {
                // Background sky Jerusalem night transitioning to desert night
                let skyGrad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                skyGrad.addColorStop(0, "#060412");
                skyGrad.addColorStop(0.5, "#120924");
                skyGrad.addColorStop(1, "#2c1435");
                ctx.fillStyle = skyGrad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Twinkling stars
                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                for(let i=0; i<25; i++) {
                    let starX = (i * 190 - camaraX * 0.1) % 1024;
                    if (starX < 0) starX += 1024;
                    let starY = (i * 61) % 240;
                    let size = 1.2 + Math.sin(gameFrame * 0.05 + i) * 0.8;
                    ctx.fillRect(starX, starY, size, size);
                }

                // Glowing crescent moon in top left sky
                ctx.save();
                ctx.shadowColor = "#fffae0";
                ctx.shadowBlur = 20;
                ctx.fillStyle = "#fffae0";
                ctx.beginPath();
                ctx.arc(140, 80, 24, 0, Math.PI * 2);
                ctx.fill();
                // cut moon crescent shape
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#060412"; // matches sky top color
                ctx.beginPath();
                ctx.arc(150, 74, 23, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                // Parallax silhouettes of old Jerusalem buildings transitioning to sand dunes
                // Far city silhouette
                for (let i = 0; i < 8; i++) {
                    let bX = i * 280 - camaraX * 0.2;
                    let opacity = Math.max(0, Math.min(1, (1800 - bX) / 400));
                    if (opacity > 0) {
                        ctx.save();
                        ctx.globalAlpha = opacity;
                        ctx.fillStyle = "#0c0a1a";
                        ctx.fillRect(bX, 240, 110, 260);
                        ctx.beginPath();
                        ctx.arc(bX + 55, 240, 50, 0, Math.PI, true);
                        ctx.fill();
                        ctx.restore();
                    }
                }
                
                // Near city silhouette
                for (let i = 0; i < 11; i++) {
                    let bX = i * 220 - camaraX * 0.35;
                    let opacity = Math.max(0, Math.min(1, (1900 - bX) / 400));
                    if (opacity > 0) {
                        ctx.save();
                        ctx.globalAlpha = opacity;
                        ctx.fillStyle = "#120f26";
                        ctx.fillRect(bX, 280, 140, 220);
                        
                        // Draw battlements
                        for (let batt = 0; batt < 140; batt += 35) {
                            ctx.fillRect(bX + batt, 268, 20, 12);
                        }
                        
                        // Glowing warm windows
                        ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
                        ctx.fillRect(bX + 30, 310, 16, 25);
                        ctx.fillRect(bX + 90, 310, 16, 25);
                        ctx.restore();
                    }
                }

                // Parallax Sand Dunes in the desert region
                // Far dunes
                for (let i = 0; i < 12; i++) {
                    let dX = 1200 + i * 260 - camaraX * 0.3;
                    let opacity = Math.max(0, Math.min(1, (dX - 900) / 400));
                    if (opacity > 0) {
                        ctx.save();
                        ctx.globalAlpha = opacity;
                        ctx.fillStyle = "#201128";
                        ctx.beginPath();
                        ctx.moveTo(dX - 180, 500);
                        ctx.quadraticCurveTo(dX + 50, 370, dX + 280, 500);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                    }
                }
                
                // Near dunes
                for (let i = 0; i < 12; i++) {
                    let dX = 1350 + i * 260 - camaraX * 0.45;
                    let opacity = Math.max(0, Math.min(1, (dX - 900) / 400));
                    if (opacity > 0) {
                        ctx.save();
                        ctx.globalAlpha = opacity;
                        ctx.fillStyle = "#2c152a";
                        ctx.beginPath();
                        ctx.moveTo(dX - 220, 500);
                        ctx.quadraticCurveTo(dX + 80, 410, dX + 320, 500);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                    }
                }

                // Palm trees in background
                for (let i = 0; i < 6; i++) {
                    let pX = 1800 + i * 360 - camaraX * 0.45;
                    let opacity = Math.max(0, Math.min(1, (pX - 1200) / 400));
                    if (opacity > 0 && pX > -100 && pX < 1124) {
                        ctx.save();
                        ctx.globalAlpha = opacity;
                        ctx.fillStyle = "#16071f";
                        // Trunk
                        ctx.beginPath();
                        ctx.moveTo(pX, 500);
                        ctx.quadraticCurveTo(pX + 10, 430, pX + 5, 360);
                        ctx.lineTo(pX - 5, 360);
                        ctx.quadraticCurveTo(pX, 430, pX - 5, 500);
                        ctx.closePath();
                        ctx.fill();
                        // Leaves (fronds)
                        ctx.translate(pX, 360);
                        for (let f = 0; f < 5; f++) {
                            ctx.rotate((Math.PI * 2) / 5);
                            ctx.beginPath();
                            ctx.ellipse(0, -18, 7, 24, 0.1, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.restore();
                    }
                }

                // Draw decorations (houses, gates, tents)
                this.decorations.forEach(dec => {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    if (dec.label.includes("Casa")) {
                        ctx.fillStyle = "#261b15";
                        ctx.fillRect(dec.x, dec.y, dec.w, dec.h);
                        // Stone block borders
                        ctx.strokeStyle = "#4d382d";
                        ctx.lineWidth = 3;
                        ctx.strokeRect(dec.x, dec.y, dec.w, dec.h);
                        // Glowing windows
                        ctx.fillStyle = "#ffb300";
                        ctx.fillRect(dec.x + 30, dec.y + 40, 30, 40);
                        ctx.fillRect(dec.x + 140, dec.y + 40, 30, 40);
                        ctx.fillStyle = "rgba(0,0,0,0.3)";
                        ctx.fillRect(dec.x + 30, dec.y + 40, 15, 40);
                        ctx.fillRect(dec.x + 140, dec.y + 40, 15, 40);
                        
                        ctx.fillStyle = "#cca87a";
                        ctx.font = "bold 12px Outfit";
                        ctx.fillText("Casa de Lehí", dec.x + 60, dec.y - 10);
                    } else if (dec.label.includes("Puerta")) {
                        // Grand stone Arch of Jerusalem in the background (Visual gateway)
                        ctx.fillStyle = "#1a130f";
                        // Left column
                        ctx.fillRect(dec.x, dec.y, 22, dec.h);
                        // Right column
                        ctx.fillRect(dec.x + dec.w - 22, dec.y, 22, dec.h);
                        // Arched vault header
                        ctx.beginPath();
                        ctx.arc(dec.x + dec.w/2, dec.y + 22, dec.w/2, Math.PI, 0, false);
                        ctx.lineTo(dec.x + dec.w - 22, dec.y + 22);
                        ctx.arc(dec.x + dec.w/2, dec.y + 22, dec.w/2 - 22, 0, Math.PI, true);
                        ctx.lineTo(dec.x, dec.y + 22);
                        ctx.closePath();
                        ctx.fill();
                        
                        // Stone keystone
                        ctx.fillStyle = "#8c6e5c";
                        ctx.fillRect(dec.x + dec.w/2 - 12, dec.y - 8, 24, 18);
                        
                        // Pillar lines
                        ctx.strokeStyle = "rgba(255,255,255,0.06)";
                        ctx.lineWidth = 1;
                        for(let py = dec.y + 22; py < dec.y + dec.h; py += 25) {
                            ctx.beginPath();
                            ctx.moveTo(dec.x, py); ctx.lineTo(dec.x + 22, py);
                            ctx.moveTo(dec.x + dec.w - 22, py); ctx.lineTo(dec.x + dec.w, py);
                            ctx.stroke();
                        }
                    } else if (dec.label.includes("Tiendas")) {
                        // Tents (Desert Wilderness Campsite)
                        ctx.fillStyle = "#b88e6e";
                        ctx.beginPath();
                        ctx.moveTo(dec.x, dec.y + dec.h);
                        ctx.lineTo(dec.x + dec.w/2, dec.y);
                        ctx.lineTo(dec.x + dec.w, dec.y + dec.h);
                        ctx.closePath();
                        ctx.fill();
                        
                        // Inner door shade
                        ctx.fillStyle = "#5d4037";
                        ctx.beginPath();
                        ctx.moveTo(dec.x + dec.w/2 - 24, dec.y + dec.h);
                        ctx.lineTo(dec.x + dec.w/2, dec.y + 55);
                        ctx.lineTo(dec.x + dec.w/2 + 24, dec.y + dec.h);
                        ctx.closePath();
                        ctx.fill();
                    }
                    ctx.restore();
                });

                // Platforms with ancient textured styling
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.platforms.forEach(plat => {
                    let isCity = plat.x < 1800;
                    ctx.save();
                    
                    if (isCity) {
                        // Limestone blocks
                        ctx.fillStyle = "#3d2f25"; // Stone base shadow
                        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                        
                        // Render stone brick texture
                        ctx.strokeStyle = "rgba(255, 235, 200, 0.07)";
                        ctx.lineWidth = 1.5;
                        let stepX = 40;
                        let stepY = 20;
                        for (let yOffset = 0; yOffset < plat.height; yOffset += stepY) {
                            ctx.beginPath();
                            ctx.moveTo(plat.x, plat.y + yOffset);
                            ctx.lineTo(plat.x + plat.width, plat.y + yOffset);
                            ctx.stroke();
                            
                            let startShift = (yOffset / stepY) % 2 === 0 ? 0 : stepX / 2;
                            for (let xOffset = startShift; xOffset < plat.width; xOffset += stepX) {
                                ctx.beginPath();
                                ctx.moveTo(plat.x + xOffset, plat.y + yOffset);
                                ctx.lineTo(plat.x + xOffset, Math.min(plat.y + plat.height, plat.y + yOffset + stepY));
                                ctx.stroke();
                            }
                        }
                        
                        // Top limestone cap
                        ctx.fillStyle = "#c2a67e";
                        ctx.fillRect(plat.x, plat.y, plat.width, 6);
                        
                        // Edge bevel highlights
                        ctx.fillStyle = "#edd2ad";
                        ctx.fillRect(plat.x, plat.y, plat.width, 2);
                    } else if (plat.x >= 2900) {
                        // Tents platform: Golden desert sand dunes
                        ctx.fillStyle = "#5c3c21"; // Warm sand base
                        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

                        // Organic wavy sand dunes on top of the platform
                        ctx.fillStyle = "#d49f63"; // Warm sand top
                        ctx.beginPath();
                        ctx.moveTo(plat.x, plat.y + 10);
                        for (let dx = 0; dx <= plat.width; dx += 20) {
                            let dy = Math.sin((plat.x + dx) * 0.05) * 6;
                            ctx.lineTo(plat.x + dx, plat.y + dy);
                        }
                        ctx.lineTo(plat.x + plat.width, plat.y + plat.height);
                        ctx.lineTo(plat.x, plat.y + plat.height);
                        ctx.closePath();
                        ctx.fill();

                        // Top golden highlight cap
                        ctx.fillStyle = "#ffd700";
                        ctx.beginPath();
                        ctx.moveTo(plat.x, plat.y);
                        for (let dx = 0; dx <= plat.width; dx += 20) {
                            let dy = Math.sin((plat.x + dx) * 0.05) * 6;
                            ctx.lineTo(plat.x + dx, plat.y + dy);
                        }
                        for (let dx = plat.width; dx >= 0; dx -= 20) {
                            let dy = Math.sin((plat.x + dx) * 0.05) * 6 + 3;
                            ctx.lineTo(plat.x + dx, plat.y + dy);
                        }
                        ctx.closePath();
                        ctx.fill();
                    } else {
                        // Desert earth/sand blocks
                        ctx.fillStyle = "#291810"; // Dark sandy ground base
                        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                        
                        // Draw organic sand ripples/layers
                        ctx.strokeStyle = "rgba(230, 160, 100, 0.12)";
                        ctx.lineWidth = 3;
                        for (let yOffset = 15; yOffset < plat.height; yOffset += 20) {
                            ctx.beginPath();
                            ctx.moveTo(plat.x, plat.y + yOffset);
                            ctx.bezierCurveTo(plat.x + plat.width * 0.35, plat.y + yOffset - 5, plat.x + plat.width * 0.65, plat.y + yOffset + 5, plat.x + plat.width, plat.y + yOffset);
                            ctx.stroke();
                        }
                        
                        // Top sand cap
                        ctx.fillStyle = "#a67c52"; // Golden desert sand
                        ctx.fillRect(plat.x, plat.y, plat.width, 8);
                        
                        // Highlight top cap
                        ctx.fillStyle = "#d49f63";
                        ctx.fillRect(plat.x, plat.y, plat.width, 3);
                    }
                    ctx.restore();
                });
                ctx.restore();

                // Draw Torches with rising fire particles
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.torches.forEach(t => {
                    // Torch stick
                    ctx.fillStyle = "#5d4037";
                    ctx.fillRect(t.x, t.y, 4, 20);
                    // Iron base
                    ctx.fillStyle = "#37474f";
                    ctx.fillRect(t.x - 2, t.y, 8, 4);

                    // Dynamic flame particles
                    for (let p = 0; p < 6; p++) {
                        let offsetSeed = p * 12 + gameFrame;
                        let pX = t.x + 2 + Math.sin(offsetSeed * 0.15) * 6;
                        let pY = t.y - 4 - (offsetSeed % 18);
                        let pSize = 3 + (offsetSeed % 5);
                        
                        let colors = ["#ff3d00", "#ff9100", "#ffea00", "#ff6d00"];
                        ctx.fillStyle = colors[p % colors.length];
                        ctx.shadowColor = "#ff3d00";
                        ctx.shadowBlur = 10;
                        ctx.beginPath();
                        ctx.arc(pX, pY, pSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                ctx.restore();

                // Coins
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.fillStyle = "#ffd700";
                        ctx.beginPath();
                        ctx.arc(m.x, m.y + Math.sin(gameFrame * 0.15) * 3.5, 7, 0, Math.PI*2);
                        ctx.fill();
                        ctx.strokeStyle = "#e65100";
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                        // Inner star reflection
                        ctx.fillStyle = "#fff799";
                        ctx.beginPath();
                        ctx.arc(m.x - 1, m.y + Math.sin(gameFrame * 0.15) * 3.5 - 1, 2, 0, Math.PI*2);
                        ctx.fill();
                    }
                });
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
                    ctx.ellipse(member.x + 20, fY + fH - 2, 12, 4, 0, 0, Math.PI*2);
                    ctx.fill();

                    // Body robe with highlights & shading (leaves 8px at the bottom for legs)
                    ctx.fillStyle = member.healthy ? member.color : "#d32f2f"; // Red if hit
                    ctx.fillRect(member.x + 10, fY + 20, 20, fH - 28);
                    
                    // Render details depending on who they are
                    if (member.name === "Saríah") {
                        // Cream veil draped over the head & shoulders
                        ctx.fillStyle = "#fcf8f2";
                        ctx.fillRect(member.x + 7, fY + 6, 26, 18);
                        ctx.beginPath();
                        ctx.ellipse(member.x + 20, fY + 6, 13, 7, 0, Math.PI, 0, false);
                        ctx.fill();
                        
                        // Teal details/sash
                        ctx.fillStyle = "#008080";
                        ctx.fillRect(member.x + 10, fY + fH - 12, 20, 3);
                    } else if (member.name === "Nefi") {
                        // Blue robe with a golden sash
                        ctx.fillStyle = "#ffd700";
                        ctx.fillRect(member.x + 8, fY + 24, 24, 4); // sash
                    } else if (member.name === "Sam") {
                        // Brown sash
                        ctx.fillStyle = "#5d4037";
                        ctx.fillRect(member.x + 8, fY + 24, 24, 4);
                    } else {
                        // Dark/grey belts for Laman/Lemuel
                        ctx.fillStyle = "#1e1e1e";
                        ctx.fillRect(member.x + 8, fY + 24, 24, 4);
                    }

                    // Skin Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(member.x + 20, fY + 12, 9, 0, Math.PI*2);
                    ctx.fill();

                    // Hair/beard for brothers in Level 1
                    if (member.name !== "Saríah") {
                        ctx.fillStyle = member.name === "Sam" ? "#5d4037" : "#1a0d00"; // Sam brown, others black
                        ctx.fillRect(member.x + 11, fY + 3, 18, 3);
                        // beard for brothers
                        ctx.beginPath();
                        ctx.moveTo(member.x + 12, fY + 14);
                        ctx.quadraticCurveTo(member.x + 20, fY + 22, member.x + 28, fY + 14);
                        ctx.fill();
                    }
                    
                    // Polished Eyes (White outer, black pupil)
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
                        
                        // sandals
                        ctx.fillStyle = "#3e2723";
                        ctx.fillRect(member.x + 11 + walkStep, fY + fH - 2, 6, 3);
                        ctx.fillRect(member.x + 23 - walkStep, fY + fH - 2, 6, 3);
                    }

                    // Name Tag (Premium styling)
                    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                    ctx.font = "bold 9px Outfit";
                    ctx.textAlign = "center";
                    ctx.shadowColor = "#000000";
                    ctx.shadowBlur = 4;
                    ctx.fillText(member.name, member.x + 20, fY - 6);

                    ctx.restore();
                });
                ctx.restore();

                // Enemies (Guards: Soldiers & Mockers)
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.enemies.forEach(e => {
                    if (e.state === "dead") return;

                    ctx.save();
                    
                    if (e.type === "soldier") {
                        // determined warrior face
                        ctx.fillStyle = "#ffdbac"; // Skin
                        ctx.fillRect(e.x + e.width/2 - 10, e.y + 4, 20, 16);
                        
                        // soldier beard/eyes
                        ctx.fillStyle = "#1a0d00";
                        ctx.fillRect(e.x + e.width/2 - 10, e.y + 12, 20, 8); // Beard
                        ctx.fillStyle = "#ffffff";
                        let eyeDirX = e.dir > 0 ? 3 : -7;
                        ctx.fillRect(e.x + e.width/2 + eyeDirX, e.y + 6, 4, 3);
                        ctx.fillStyle = "#000000";
                        ctx.fillRect(e.x + e.width/2 + eyeDirX + (e.dir > 0 ? 2 : 0), e.y + 7, 2, 2);

                        // Flowing Crimson Cape (drawn behind body)
                        ctx.fillStyle = "#b71c1c";
                        ctx.beginPath();
                        let capeBackX = e.dir > 0 ? e.x : e.x + e.width;
                        let capeWave = Math.sin(gameFrame * 0.1) * 8;
                        ctx.moveTo(capeBackX, e.y + 20);
                        ctx.lineTo(capeBackX - (25 * e.dir) + capeWave, e.y + e.height - 10);
                        ctx.lineTo(capeBackX - (5 * e.dir), e.y + e.height);
                        ctx.lineTo(e.x + e.width/2, e.y + 20);
                        ctx.closePath();
                        ctx.fill();

                        // Bronze Cuirass (Breastplate Body)
                        ctx.fillStyle = "#cd7f32"; // Bronze base
                        ctx.fillRect(e.x + 8, e.y + 20, e.width - 16, e.height - 38);
                        // Chest armor metallic shine highlights
                        ctx.fillStyle = "#ffd700";
                        ctx.fillRect(e.x + 10, e.y + 20, (e.width - 20) * 0.3, e.height - 38);
                        
                        // Iron Tunic/Skirt strips below breastplate
                        ctx.fillStyle = "#eceff1";
                        ctx.fillRect(e.x + 8, e.y + e.height - 18, e.width - 16, 5);
                        ctx.fillStyle = "#455a64";
                        ctx.fillRect(e.x + 10, e.y + e.height - 13, 6, 5);
                        ctx.fillRect(e.x + 18, e.y + e.height - 13, 6, 5);
                        ctx.fillRect(e.x + 26, e.y + e.height - 13, 6, 5);
                        
                        // Helmet with red crest
                        ctx.fillStyle = "#78909c"; // Silver-grey steel helm
                        ctx.beginPath();
                        ctx.arc(e.x + e.width/2, e.y + 6, 12, Math.PI, 0, false);
                        ctx.lineTo(e.x + e.width/2 + 10, e.y + 8);
                        ctx.lineTo(e.x + e.width/2 - 10, e.y + 8);
                        ctx.closePath();
                        ctx.fill();
                        
                        // Red crest plume
                        ctx.fillStyle = "#d32f2f";
                        ctx.fillRect(e.x + e.width/2 - 4, e.y - 12, 8, 7);
                        ctx.beginPath();
                        ctx.arc(e.x + e.width/2, e.y - 12, 8, Math.PI, 0, false);
                        ctx.fill();

                        // Legs & Walk animation
                        ctx.lineWidth = 4;
                        ctx.strokeStyle = "#ffdbac";
                        let step = Math.sin(gameFrame * 0.15) * 8;
                        ctx.beginPath();
                        ctx.moveTo(e.x + 12, e.y + e.height - 8);
                        ctx.lineTo(e.x + 12 + step, e.y + e.height);
                        ctx.moveTo(e.x + e.width - 12, e.y + e.height - 8);
                        ctx.lineTo(e.x + e.width - 12 - step, e.y + e.height);
                        ctx.stroke();
                        
                        // Sandals
                        ctx.fillStyle = "#3e2723";
                        ctx.fillRect(e.x + 10 + step, e.y + e.height - 2, 6, 3);
                        ctx.fillRect(e.x + e.width - 14 - step, e.y + e.height - 2, 6, 3);

                        // Bronze shield & spear
                        let weaponSide = e.dir > 0 ? 1 : -1;
                        
                        // Spear
                        ctx.fillStyle = "#5d4037"; // wooden shaft
                        let spX = weaponSide > 0 ? e.x + e.width - 6 : e.x + 6;
                        ctx.fillRect(spX, e.y + 4, 3, e.height - 4);
                        ctx.fillStyle = "#90a4ae"; // steel head
                        ctx.beginPath();
                        ctx.moveTo(spX - 2, e.y + 4);
                        ctx.lineTo(spX + 1.5, e.y - 6);
                        ctx.lineTo(spX + 5, e.y + 4);
                        ctx.closePath();
                        ctx.fill();

                        // Round Bronze Shield (held in front)
                        ctx.fillStyle = "#cd7f32";
                        ctx.beginPath();
                        let shX = weaponSide > 0 ? e.x + 6 : e.x + e.width - 20;
                        ctx.arc(shX + 7, e.y + 32, 14, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = "#ffd700";
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                        // Central stud
                        ctx.fillStyle = "#ffd700";
                        ctx.beginPath();
                        ctx.arc(shX + 7, e.y + 32, 3, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        // Burlón (Heckler)
                        // Wearing plain, baggy greyish-purple robes and mocking hood
                        ctx.fillStyle = "#6a1b9a"; // Heckler purple robe
                        ctx.fillRect(e.x + 6, e.y + 16, e.width - 12, e.height - 16);
                        
                        // Head
                        ctx.fillStyle = "#ffdbac";
                        ctx.beginPath();
                        ctx.arc(e.x + e.width/2, e.y + 10, 9, 0, Math.PI*2);
                        ctx.fill();
                        
                        // Golden mocking hood/turban
                        ctx.fillStyle = "#fbc02d";
                        ctx.fillRect(e.x + e.width/2 - 11, e.y - 1, 22, 6);
                        ctx.beginPath();
                        ctx.arc(e.x + e.width/2, e.y - 1, 9, Math.PI, 0, false);
                        ctx.fill();

                        // Legs & Walk animation
                        ctx.lineWidth = 4;
                        ctx.strokeStyle = "#ffdbac";
                        let step = Math.sin(gameFrame * 0.2) * 8;
                        ctx.beginPath();
                        ctx.moveTo(e.x + 12, e.y + e.height - 4);
                        ctx.lineTo(e.x + 12 + step, e.y + e.height);
                        ctx.moveTo(e.x + e.width - 12, e.y + e.height - 4);
                        ctx.lineTo(e.x + e.width - 12 - step, e.y + e.height);
                        ctx.stroke();
                    }
                    ctx.restore();
                });
                ctx.restore();
            }
        },

        // LEVEL 2: Obtaining the Plates of Brass (Stealth & Infiltration)
        // LEVEL 2: Obtaining the Plates of Brass (Stealth & Infiltration)
        {
            id: 2,
            name: "Obteniendo las Planchas de Bronce",
            desc: "Regresa a Jerusalén, recupera el tesoro familiar y obtén las planchas obedeciendo al Espíritu.",
            maxScroll: 4000,
            
            // Level introduction data
            introTitle: "Las Planchas de Bronce",
            introText: "El Señor manda a los hijos de Lehí regresar a Jerusalén para obtener las Planchas de Bronce. En el primer intento, Lamán es amenazado de muerte por Labán. En el segundo, Labán les roba sus riquezas familiares y los persigue. Al final, Nefi debe infiltrarse solo de noche, guiado por el Espíritu Santo, para cumplir la voluntad del Señor y recuperar la sagrada historia de su pueblo.",
            introObjective: "Cumple las fases de la misión para obtener las planchas de bronce.",

            init: function(game) {
                game.player.x = 3500;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                game.camaraX = 2976;
                this.checkpoint = { x: 3500, y: 400 };
                this.cameraTargetX = undefined;

                this.currentObjective = "Espera el primer intento de Lamán.";
                this.objectiveTargetX = undefined;
                this.objectiveTargetLabel = "";

                // Quest engine variables
                this.currentPhase = 0; // 0: first attempt (Laman), 1: gather gold, 2: offer gold & escape, 3: beating & angel, 4: night infiltration, 5: slay Laban & disguise, 6: get plates from Zoram, 7: return with Zoram
                this.alarmActive = false;
                this.alarmTimer = 0;
                this.gateOpening = false;
                this.disguised = false;
                this.angelActive = false;
                this.angelTimer = 0;
                this.beatingActive = false;
                this.beatingTimer = 0;
                this.lamanPathState = "idle";
                this.lamanX = 3500;
                this.lamanY = 400;
                this.zoramOpeningGate = false;
                this.platesCollected = false;
                
                // Trackers to prevent duplicate triggers
                this.dialogueTriggered = 0;
                this.phase2DialogueTriggered = false;
                this.escapePhaseStarted = false;
                this.angelDialogueTriggered = false;
                this.phase3EndDialogueTriggered = false;
                this.phase4Initialized = false;
                this.phase4DialogueTriggered = false;
                this.phase6DialogueTriggered = false;
                this.phase7DialogueTriggered = false;
                this.oathDialogueTriggered = false;
                this.finishSpiritualTextShown = false;

                // Wealth chests in Lehí's house (Phase 1)
                this.wealthChests = [
                    { x: 1930, y: 465, w: 40, h: 35, collected: false },
                    { x: 2000, y: 465, w: 40, h: 35, collected: false },
                    { x: 2070, y: 465, w: 40, h: 35, collected: false }
                ];

                // Shadows (Rocks) for hiding in streets
                this.shadows = [
                    { x: 1000, y: 300, width: 200, height: 200 },
                    { x: 1800, y: 300, width: 220, height: 200 },
                    { x: 2600, y: 300, width: 240, height: 200 }
                ];

                // Layout
                this.platforms = [
                    // Palace area floor (far left)
                    { x: 0, y: 500, width: 1500, height: 100, tipo: "suelo" },
                    // Elevated platform inside palace
                    { x: 600, y: 380, width: 300, height: 30, tipo: "plataforma" },
                    { x: 1000, y: 290, width: 300, height: 30, tipo: "plataforma" },
                    // Locked gate (separating Treasury at x=480)
                    { x: 480, y: 250, width: 40, height: 250, tipo: "puerta_cerrada" },
                    // Floating canyon platform (between palace and streets)
                    { x: 1560, y: 420, width: 80, height: 30, tipo: "plataforma" },
                    // Jerusalem streets / Lehí's House floor
                    { x: 1700, y: 500, width: 1100, height: 100, tipo: "suelo" },
                    // Elevated street platforms
                    { x: 1850, y: 400, width: 250, height: 30, tipo: "plataforma" },
                    { x: 2200, y: 310, width: 300, height: 30, tipo: "plataforma" },
                    // Floating canyon platform (between streets and cave)
                    { x: 2860, y: 420, width: 80, height: 30, tipo: "plataforma" },
                    // Wilderness / Cave floor (far right)
                    { x: 3000, y: 500, width: 1000, height: 100, tipo: "suelo" }
                ];

                // Labán definition
                this.laban = { x: 700, y: 405, hp: 1, width: 65, height: 95, state: "alive" };

                // Followers
                this.family = [];
                this.positionHistory = [];
                for(let i=0; i<300; i++) {
                    this.positionHistory.push({ x: 3500, y: 400, agachado: false, jumping: false });
                }

                // Initial dialogue (Phase 0)
                game.dialogueQueue = [
                    { char: "Nefi", text: "Hemos regresado a Jerusalén desde el desierto. Debemos obtener las planchas de metal de Labán." },
                    { char: "Lamán", text: "Echemos suertes para ver quién va... ¡Ha caído sobre mí! Iré yo a la casa de Labán a pedirle las planchas." }
                ];
                game.startDialogue();
                this.lamanPathState = "waiting_dialogue";
            },

            update: function(game, gameFrame, input) {
                // Check shadow zone hiding
                let inShadow = false;
                this.shadows.forEach(s => {
                    if (game.player.x > s.x && game.player.x + game.player.width < s.x + s.width &&
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
                    if (this.alarmTimer > 200) {
                        this.alarmActive = false;
                    }
                }

                // Record history for followers (Phases 1, 2, 7)
                if (this.currentPhase === 1 || this.currentPhase === 2 || this.currentPhase === 7) {
                    this.positionHistory.unshift({
                        x: game.player.x,
                        y: game.player.y,
                        agachado: game.player.agachado,
                        jumping: game.player.jumping
                    });
                    if (this.positionHistory.length > 300) {
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

                // Phase 0: First Attempt (Cutscene Laman walks and runs back)
                if (this.currentPhase === 0) {
                    // Lock player inputs
                    game.input.izquierda = false;
                    game.input.derecha = false;
                    game.input.saltar = false;
                    game.input.atacar = false;
                    game.player.velX = 0;
                    game.player.velY = 0;
                    game.player.x = 3500;
                    game.player.y = 400;

                    // Camera overrides to follow Laman
                    this.cameraTargetX = this.lamanX - 400;

                    // Calculate Laman's jumping Y coordinate
                    this.lamanY = 400;
                    if (this.lamanPathState === "walking_left") {
                        if (this.lamanX >= 2780 && this.lamanX <= 3020) {
                            let p = Math.max(0, Math.min(1, (this.lamanX - 2800) / 200));
                            this.lamanY = 400 - Math.sin(p * Math.PI) * 85;
                        } else if (this.lamanX >= 1480 && this.lamanX <= 1720) {
                            let p = Math.max(0, Math.min(1, (this.lamanX - 1500) / 200));
                            this.lamanY = 400 - Math.sin(p * Math.PI) * 85;
                        }
                    } else if (this.lamanPathState === "running_right") {
                        if (this.lamanX >= 1480 && this.lamanX <= 1720) {
                            let p = Math.max(0, Math.min(1, (1700 - this.lamanX) / 200));
                            this.lamanY = 400 - Math.sin(p * Math.PI) * 85;
                        } else if (this.lamanX >= 2780 && this.lamanX <= 3020) {
                            let p = Math.max(0, Math.min(1, (3000 - this.lamanX) / 200));
                            this.lamanY = 400 - Math.sin(p * Math.PI) * 85;
                        }
                    }

                    if (this.lamanPathState === "waiting_dialogue" && !game.dialogueActive) {
                        this.lamanPathState = "walking_left";
                        this.lamanX = 3500;
                    }

                    if (this.lamanPathState === "walking_left") {
                        this.lamanX -= 12; // Fast cutscene walk speed
                        
                        if (this.lamanX <= 770) {
                            this.lamanX = 770;
                            this.lamanPathState = "arrived";
                            this.dialogueTriggered = 1;
                            game.dialogueQueue = [
                                { char: "Labán", text: "¿Quién eres tú y qué buscas en mi casa a estas horas?" },
                                { char: "Lamán", text: "Soy Lamán, hijo de Lehí. Vengo a pedirte las Planchas de Bronce que contienen los anales de nuestros antepasados." },
                                { char: "Labán", text: "¡¿Las Planchas de Bronce?! ¡Eres un ladrón! No te daré nada, y ahora te mataré por atrevido. ¡Guardias!" }
                            ];
                            game.startDialogue();
                        }
                    } else if (this.lamanPathState === "arrived" && !game.dialogueActive && this.dialogueTriggered === 1) {
                        this.lamanPathState = "running_right";
                    } else if (this.lamanPathState === "running_right") {
                        this.lamanX += 18; // Fast cutscene run speed
                        
                        if (this.lamanX >= 3400) {
                            this.lamanX = 3400;
                            this.lamanPathState = "returned";
                            this.dialogueTriggered = 2;
                            game.dialogueQueue = [
                                { char: "Lamán", text: "¡Es inútil! Labán es un hombre muy poderoso, comanda a cincuenta soldados y me llamó ladrón. ¡Casi me mata! Regresemos al desierto." },
                                { char: "Nefi", text: "¡Vive el Señor y vivimos nosotros, que no descenderemos hasta nuestro padre en el desierto hasta cumplir lo que el Señor ha mandado!" },
                                { char: "Nefi", text: "Vayamos a la casa de nuestro padre en Jerusalén. Recojamos nuestro oro, plata y bienes, y ofrezcámoselos a Labán para comprarle las planchas." }
                            ];
                            game.startDialogue();
                        }
                    } else if (this.lamanPathState === "returned" && !game.dialogueActive && this.dialogueTriggered === 2) {
                        this.currentPhase = 1; // Start Phase 1!
                        this.currentObjective = "Busca y recoge las 3 riquezas en la Casa de Lehí (x = 2000)";
                        this.objectiveTargetX = 2000;
                        this.objectiveTargetLabel = "Casa de Lehí";
                        this.cameraTargetX = undefined; // Return camera to player
                        this.checkpoint = { x: 3400, y: 400 };
                        game.camaraX = 2976;
                        // Setup brothers followers
                        this.family = [
                            { name: "Sam", color: "#a0522d", height: 90, offset: 35, healthy: true, jumping: false },
                            { name: "Lamán", color: "#555555", height: 94, offset: 70, healthy: true, jumping: false },
                            { name: "Lemuel", color: "#666666", height: 94, offset: 105, healthy: true, jumping: false }
                        ];
                        this.positionHistory = [];
                        for(let i=0; i<300; i++) {
                            this.positionHistory.push({ x: game.player.x, y: game.player.y, agachado: game.player.agachado, jumping: game.player.jumping });
                        }
                        game.showNotification("💰 Misión: Ve a la Casa de Lehí (en x = 2000) y recoge los 3 cofres de riquezas familiares.");
                    }
                }

                // Phase 1: Gather Gold & Silver at Lehí's House
                if (this.currentPhase === 1) {
                    this.wealthChests.forEach(c => {
                        if (!c.collected && game.collides(game.player, c)) {
                            c.collected = true;
                            window.gameAudio.playCoin();
                            game.score += 50;
                            game.showNotification("💰 Recogiste oro y plata de la Casa de Lehí.");
                        }
                    });

                    if (this.wealthChests.every(c => c.collected)) {
                        this.currentPhase = 2; // Transition to Phase 2
                        this.currentObjective = "Lleva las riquezas al Palacio de Labán (x = 750)";
                        this.objectiveTargetX = 750;
                        this.objectiveTargetLabel = "Palacio";
                        this.checkpoint = { x: 2000, y: 400 };
                        game.dialogueQueue = [
                            { char: "Nefi", text: "¡Hemos reunido todos nuestros bienes preciosos! Ahora marchemos de nuevo al palacio de Labán para ofrecerle esta gran riqueza." }
                        ];
                        game.startDialogue();
                        game.showNotification("🏛️ Misión: Lleva las riquezas a Labán en su palacio (extremo izquierdo).");
                    }
                }

                // Phase 2: Offer wealth to Laban & Escape persecution
                if (this.currentPhase === 2) {
                    if (game.player.x <= 850 && !this.phase2DialogueTriggered) {
                        this.phase2DialogueTriggered = true;
                        // Lock inputs momentarily
                        game.input.izquierda = false;
                        game.input.derecha = false;
                        game.player.velX = 0;
                        game.dialogueQueue = [
                            { char: "Nefi", text: "Labán, mira todo nuestro oro, plata y bienes preciosos. Te entregaremos todo a cambio de las Planchas de Bronce de nuestro padre." },
                            { char: "Labán", text: "¡Vaya, qué inmensa fortuna! ¡Vuestros bienes son míos! ¡Siervos, matad a estos ladrones y traedme sus riquezas!" }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase2DialogueTriggered && !game.dialogueActive && !this.escapePhaseStarted) {
                        this.escapePhaseStarted = true;
                        this.alarmActive = true;
                        this.alarmTimer = 0;
                        this.currentObjective = "¡HUYE! Escapa de los guardias de regreso a la cueva (x = 3500)";
                        this.objectiveTargetX = 3500;
                        this.objectiveTargetLabel = "Cueva";
                        // Spawn guards chasing the player
                        this.enemies = [
                            { x: 450, y: 420, type: "guard_normal", hp: 1, range: 4000, startX: 450, dir: 1, width: 50, height: 80, speed: 3.6, state: "chase" },
                            { x: 550, y: 420, type: "guard_torch", hp: 2, range: 4000, startX: 550, dir: 1, width: 50, height: 80, speed: 3.2, state: "chase" },
                            { x: 650, y: 420, type: "guard_normal", hp: 1, range: 4000, startX: 650, dir: 1, width: 50, height: 80, speed: 3.4, state: "chase" }
                        ];
                        game.showNotification("⚠️ ¡HUYE! Labán ha confiscado tus bienes. ¡Escapa de los guardias corriendo de regreso a la cueva!");
                    }

                    if (this.escapePhaseStarted) {
                        // Guards chase the player
                        this.enemies.forEach(e => {
                            if (e.hp <= 0) return;
                            e.dir = game.player.x > e.x ? 1 : -1;
                            e.x += e.speed * e.dir;
                            
                            // Collision with guard
                            if (game.player.inmune === 0 && game.collides(game.player, e)) {
                                game.playerHurt();
                            }
                        });

                        // Reach cave to escape
                        if (game.player.x >= 3350) {
                            this.alarmActive = false;
                            this.enemies = []; // Clear chasing enemies
                            this.currentPhase = 3; // Transition to Phase 3
                            this.currentObjective = "Escucha la reprensión del Ángel.";
                            this.objectiveTargetX = undefined;
                            this.objectiveTargetLabel = "";
                            this.beatingActive = true;
                            this.beatingTimer = 0;
                            game.input.izquierda = false;
                            game.input.derecha = false;
                            game.player.velX = 0;
                            game.dialogueQueue = [
                                { char: "Lamán", text: "¡Es el fin! Perdimos todo nuestro oro y casi nos matan. ¡Nefi, eres el culpable de esto!" },
                                { char: "Lemuel", text: "¡Sí! Siempre hablas de la voluntad de Dios, ¡pero solo nos traes destrucción y ruina!" }
                            ];
                            game.startDialogue();
                        }
                    }
                }

                // Phase 3: Beating & Angel Visitation
                if (this.currentPhase === 3) {
                    // Lock player controls
                    game.input.izquierda = false;
                    game.input.derecha = false;
                    game.input.saltar = false;
                    game.player.velX = 0;
                    game.player.velY = 0;

                    if (this.beatingActive) {
                        this.beatingTimer++;
                        if (this.beatingTimer % 30 === 0) {
                            window.gameAudio.playHit();
                        }

                        if (this.beatingTimer >= 120 && !game.dialogueActive && !this.angelDialogueTriggered) {
                            this.angelDialogueTriggered = true;
                            this.angelActive = true;
                            window.gameAudio.playPowerUp();
                            game.dialogueQueue = [
                                { char: "Ángel del Señor", text: "¿Por qué golpeáis a vuestro hermano menor con una vara? ¿No sabéis que el Señor lo ha escogido para ser vuestro gobernante por causa de vuestras iniquidades?" },
                                { char: "Ángel del Señor", text: "Subid de nuevo a Jerusalén. El Señor entregará a Labán en vuestras manos." }
                            ];
                            game.startDialogue();
                        }
                    }

                    if (this.angelDialogueTriggered && !game.dialogueActive && !this.phase3EndDialogueTriggered) {
                        this.phase3EndDialogueTriggered = true;
                        this.angelActive = false;
                        this.beatingActive = false;
                        game.dialogueQueue = [
                            { char: "Nefi", text: "Hermanos, subamos de nuevo a Jerusalén. El Señor es más poderoso que Labán y sus cincuenta." },
                            { char: "Lamán", text: "No entraremos a la ciudad de noche. Los guardias nos atraparán y moriremos." },
                            { char: "Nefi", text: "Yo iré solo de noche, guiado por el Espíritu, no sabiendo de antemano lo que habré de hacer. Esperadme aquí en la cueva." }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase3EndDialogueTriggered && !game.dialogueActive) {
                        this.currentPhase = 4; // Start Phase 4!
                        this.currentObjective = "Infiltrate a Jerusalén y encuentra a Labán (x = 900)";
                        this.objectiveTargetX = 900;
                        this.objectiveTargetLabel = "Labán ebrio";
                        this.checkpoint = { x: 2800, y: 400 };
                        this.family = []; // Nefi goes alone!
                        game.showNotification("🌙 Infiltración nocturna: Avanza solo hacia Jerusalén. Evita los guardias de patrulla.");
                    }
                }

                // Phase 4: Night Infiltration - Find Laban Drunk
                if (this.currentPhase === 4) {
                    if (!this.phase4Initialized) {
                        this.phase4Initialized = true;
                        // Spawn patrolling guards in streets
                        this.enemies = [
                            { x: 1300, y: 420, type: "guard_normal", hp: 1, range: 120, startX: 1300, dir: -1, width: 50, height: 80, speed: 2, state: "patrol" },
                            { x: 1900, y: 420, type: "guard_torch", hp: 2, range: 100, startX: 1900, dir: 1, width: 50, height: 80, speed: 1.5, state: "patrol" },
                            { x: 2500, y: 420, type: "guard_torch", hp: 2, range: 120, startX: 2500, dir: -1, width: 50, height: 80, speed: 1.8, state: "patrol" }
                        ];
                        // Place Labán drunk on the floor near palace
                        this.laban = { x: 900, y: 405, hp: 1, width: 65, height: 95, state: "drunk" };
                    }

                    // Avoid patrol vision detection
                    this.enemies.forEach(e => {
                        if (e.hp <= 0) return;
                        
                        // Guard gravity & col
                        if (e.velY === undefined) e.velY = 0;
                        e.velY += game.gravity;
                        e.y += e.velY;
                        
                        this.platforms.forEach(plat => {
                            if (plat.height <= 0) return;
                            if (e.x + e.width - 5 > plat.x && e.x + 5 < plat.x + plat.width &&
                                e.y + e.height >= plat.y && e.y + e.height - e.velY <= plat.y + 15) {
                                e.y = plat.y - e.height;
                                e.velY = 0;
                            }
                        });

                        // Patrol movement
                        e.x += e.speed * e.dir;
                        if (Math.abs(e.x - e.startX) > e.range) e.dir *= -1;

                        // Detection
                        if (!game.player.hidden && game.player.inmune === 0) {
                            let detected = false;
                            if (e.type === "guard_normal") {
                                let inFront = e.dir > 0 ? (game.player.x > e.x && game.player.x < e.x + 180) : (game.player.x < e.x && game.player.x > e.x - 180);
                                if (inFront && Math.abs(game.player.y - e.y) < 60) detected = true;
                            } else if (e.type === "guard_torch") {
                                let dx = (game.player.x + game.player.width/2) - (e.x + e.width/2);
                                let dy = (game.player.y + game.player.height/2) - (e.y + e.height/2);
                                if (Math.sqrt(dx*dx + dy*dy) < 150) detected = true;
                            }

                            if (detected && !this.alarmActive) {
                                this.alarmActive = true;
                                this.alarmTimer = 0;
                                window.gameAudio.playAlarm();
                                game.showNotification("⚠️ ¡Te han detectado! Escóndete en las sombras oscuras usando Abajo ▼.");
                            }
                        }

                        // Hurt player
                        if (game.player.inmune === 0 && game.collides(game.player, e)) {
                            game.playerHurt();
                        }
                    });

                    // Check if player reaches Laban drunk
                    if (game.player.x <= 960 && game.player.x >= 840 && !this.phase4DialogueTriggered) {
                        this.phase4DialogueTriggered = true;
                        game.input.izquierda = false;
                        game.input.derecha = false;
                        game.player.velX = 0;
                        game.dialogueQueue = [
                            { char: "Nefi", text: "¡Es Labán! Está tirado en el suelo, completamente ebrio con vino." },
                            { char: "Nefi", text: "He desenvainado su espada. La empuñadura es de oro puro, labrada con suma finura, y la hoja es de un acero preciosísimo." },
                            { char: "Espíritu", text: "Mátalo, porque el Señor lo ha entregado en tus manos." },
                            { char: "Nefi", text: "Nunca he derramado sangre de hombre. Deseo cumplir la ley, pero esto me estremece." },
                            { char: "Espíritu", text: "Mátalo. Es mejor que perezca un solo hombre a que una nación decline y perezca en la incredulidad." }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase4DialogueTriggered && !game.dialogueActive) {
                        this.currentPhase = 5;
                        this.currentObjective = "¡Saca la espada! Presiona X cerca de Labán (x = 900)";
                        this.objectiveTargetX = 900;
                        this.objectiveTargetLabel = "Labán ebrio";
                        game.showNotification("⚔️ Misión: Párate junto a Labán y presiona X (Atacar) para obedecer al Espíritu.");
                    }
                }

                // Phase 5: Slay Laban & Disguise
                if (this.currentPhase === 5) {
                    if (game.player.x <= 960 && game.player.x >= 840 && input.atacar) {
                        input.atacar = false;
                        this.laban.state = "dead";
                        this.disguised = true;
                        window.gameAudio.playHit();
                        window.gameAudio.playPowerUp();
                        this.currentPhase = 6; // Start Phase 6
                        this.currentObjective = "Habla con Zoram en la Tesorería (x = 550)";
                        this.objectiveTargetX = 550;
                        this.objectiveTargetLabel = "Zoram";
                        this.checkpoint = { x: 900, y: 400 };
                        game.dialogueQueue = [
                            { char: "Nefi", text: "He cortado la cabeza de Labán con su propia espada. Me he puesto su armadura, sus vestidos y me ceñí su espada de acero." },
                            { char: "Nefi", text: "Con este disfraz podré infiltrarme en la Tesorería. Los guardias pensarán que soy Labán." }
                        ];
                        game.startDialogue();
                        game.showNotification("🔑 Misión: Habla con Zoram en la entrada de la Tesorería (en x = 550) para obtener las Planchas.");
                    }
                }

                // Phase 6: Zoram & Retrieve Plates from Treasury
                if (this.currentPhase === 6) {
                    // Disguised: patrolling guards ignore Nefi!
                    this.enemies.forEach(e => {
                        // Move guards normally
                        e.x += e.speed * e.dir;
                        if (Math.abs(e.x - e.startX) > e.range) e.dir *= -1;
                    });

                    // Talk to Zoram
                    if (game.player.x <= 600 && game.player.x >= 500 && !this.phase6DialogueTriggered) {
                        this.phase6DialogueTriggered = true;
                        game.input.izquierda = false;
                        game.input.derecha = false;
                        game.player.velX = 0;
                        game.dialogueQueue = [
                            { char: "Nefi (como Labán)", text: "Zoram, trae las Planchas de Bronce de la Tesorería. Debemos llevarlas a mis hermanos mayores fuera de las murallas de la ciudad." },
                            { char: "Zoram", text: "Sí, mi señor Labán. Creí que os encontrabais reunido con los ancianos de los judíos en la sinagoga. Iré de inmediato por las planchas de metal." }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase6DialogueTriggered && !game.dialogueActive && !this.zoramOpeningGate) {
                        this.zoramOpeningGate = true;
                        this.gateOpening = true;
                        this.currentObjective = "Entra a la bóveda y recoge las Planchas (x = 150)";
                        this.objectiveTargetX = 150;
                        this.objectiveTargetLabel = "Planchas";
                        window.gameAudio.playPowerUp();
                    }

                    // Slide opening gate height
                    let gate = this.platforms[3];
                    if (gate.height > 0 && this.gateOpening) {
                        gate.height -= 3;
                        if (gate.height <= 0) {
                            gate.height = 0;
                            this.gateOpening = false;
                        }
                    }

                    // Pick up plates inside the vault
                    if (this.zoramOpeningGate && !this.platesCollected && game.player.x <= 200) {
                        this.platesCollected = true;
                        window.gameAudio.playCoin();
                        game.score += 200;
                        game.dialogueQueue = [
                            { char: "Nefi", text: "¡Tengo las Planchas de Bronce! Zoram, sígueme fuera de la ciudad con los hermanos mayores." },
                            { char: "Zoram", text: "Entendido, señor. Marchemos deprisa." }
                        ];
                        game.startDialogue();
                        this.currentPhase = 7; // Start Phase 7!
                        this.currentObjective = "Lleva las Planchas y guía a Zoram a la cueva (x = 3500)";
                        this.objectiveTargetX = 3500;
                        this.objectiveTargetLabel = "Cueva";
                        this.checkpoint = { x: 1500, y: 400 };
                        // Zoram joins as follower
                        this.family = [
                            { name: "Zoram", color: "#795548", height: 90, offset: 35, healthy: true, jumping: false }
                        ];
                        this.positionHistory = [];
                        for(let i=0; i<300; i++) {
                            this.positionHistory.push({ x: game.player.x, y: game.player.y, agachado: game.player.agachado, jumping: game.player.jumping });
                        }
                        game.showNotification("⛰️ Misión: Lleva las Planchas de Bronce y guía a Zoram de regreso a la cueva (en x = 3500).");
                    }
                }

                // Phase 7: Escape with Zoram & Oath of Friendship
                if (this.currentPhase === 7) {
                    if (game.player.x >= 3200 && !this.phase7DialogueTriggered) {
                        this.phase7DialogueTriggered = true;
                        game.input.izquierda = false;
                        game.input.derecha = false;
                        game.player.velX = 0;
                        game.dialogueQueue = [
                            { char: "Lamán", text: "¡Oh no! ¡Es Labán que viene con un guardia a matarnos! ¡Huyamos!" },
                            { char: "Nefi (alzando la voz)", text: "¡Hermanos, no temáis! ¡Soy yo, Nefi! He obtenido las planchas." },
                            { char: "Zoram (aterrado)", text: "¡¿Qué?! ¡Vosotros no sois los siervos de Labán! ¡He sido engañado! ¡Tengo que huir de regreso a la ciudad!" }
                        ];
                        game.startDialogue();
                    }

                    if (this.phase7DialogueTriggered && !game.dialogueActive && !this.oathDialogueTriggered) {
                        this.oathDialogueTriggered = true;
                        game.dialogueQueue = [
                            { char: "Nefi", text: "¡Zoram, detente! Te juro por mi vida y por el Señor que si nos escuchas y desciendes con nosotros al desierto, serás un hombre libre como nosotros y estarás a salvo." },
                            { char: "Zoram", text: "Si me juráis que seré libre, haré pacto con vosotros de descender al desierto. Seré vuestro amigo y compañero." },
                            { char: "Nefi", text: "¡Alabado sea el Señor! El pacto está hecho. Con las Planchas de Bronce y Zoram con nosotros, regresemos al desierto con nuestro padre." }
                        ];
                        game.startDialogue();
                    }

                    if (this.oathDialogueTriggered && !game.dialogueActive && !this.finishSpiritualTextShown) {
                        this.finishSpiritualTextShown = true;
                        game.completeLevel("Fui guiado por el Espíritu, no sabiendo de antemano lo que tendría que hacer.", "1 Nefi 4:6", 500);
                    }
                }

                // Pit/fall check
                if (game.player.y > 576) {
                    game.playerHurt();
                    if (game.player.fe > 0) {
                        game.player.x = this.checkpoint.x;
                        game.player.y = 400;
                        game.player.velX = 0;
                        game.player.velY = 0;
                        game.camaraX = game.player.x - 400;
                        game.camaraX = Math.max(0, Math.min(game.camaraX, 4000 - 1024));
                        
                        // Reset history
                        this.positionHistory = [];
                        for(let i=0; i<300; i++) {
                            this.positionHistory.push({ x: game.player.x, y: game.player.y, agachado: false, jumping: false });
                        }
                        this.family.forEach(member => {
                            member.x = game.player.x;
                            member.y = game.player.y;
                        });
                    }
                }
            },

            draw: function(ctx, game, gameFrame, camaraX) {
                // Background sky Jerusalem Canyon - dark night if Phase >= 4
                ctx.fillStyle = this.currentPhase >= 4 ? "#03010a" : "#0d0a1b";
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Twinkling stars
                ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                for(let i=0; i<20; i++) {
                    let starX = (i * 210 - camaraX * 0.15) % 1024;
                    if (starX < 0) starX += 1024;
                    let starY = (i * 73) % 220;
                    ctx.fillRect(starX, starY, 1.5, 1.5);
                }

                // Shadows drawing (Large rocks)
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.shadows.forEach(s => {
                    ctx.fillStyle = "rgba(12, 10, 24, 0.82)";
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
                    ctx.lineWidth = 1.5;
                    ctx.fillRect(s.x, s.y, s.width, s.height);
                    ctx.strokeRect(s.x, s.y, s.width, s.height);
                });
                ctx.restore();

                // Platforms with brick textures
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.platforms.forEach(plat => {
                    if (plat.tipo === "puerta_cerrada") {
                        if (plat.height <= 0) return;
                        
                        ctx.save();
                        // Draw massive stone arch gate frame
                        ctx.fillStyle = "#1e1e24";
                        ctx.fillRect(plat.x - 12, 250, plat.width + 24, 250);
                        ctx.strokeStyle = "#43434d";
                        ctx.lineWidth = 3;
                        ctx.strokeRect(plat.x - 12, 250, plat.width + 24, 250);
                        
                        // Sliding iron portcullis (moves UP behind frame as height decreases)
                        let currentGateHeight = plat.height;
                        ctx.fillStyle = "#37474f"; // Iron gray bars
                        
                        // Vertical bars starting from top frame (250) down to 250 + currentGateHeight
                        for (let bx = plat.x + 4; bx < plat.x + plat.width; bx += 10) {
                            ctx.fillRect(bx, 250, 4, currentGateHeight);
                        }
                        // Horizontal braces
                        ctx.fillRect(plat.x, 250 + 10, plat.width, 8);
                        if (currentGateHeight > 20) {
                            ctx.fillRect(plat.x, 250 + currentGateHeight / 2 - 4, plat.width, 8);
                        }
                        if (currentGateHeight > 15) {
                            ctx.fillRect(plat.x, 250 + currentGateHeight - 15, plat.width, 8);
                        }
                        
                        // Giant Golden Lock Plate with keyhole (attaches to bottom edge of rising gate)
                        if (currentGateHeight > 30) {
                            ctx.fillStyle = "#a0781c";
                            ctx.fillRect(plat.x + plat.width/2 - 8, 250 + currentGateHeight - 30, 16, 24);
                            ctx.fillStyle = "#ffd700";
                            ctx.beginPath();
                            ctx.arc(plat.x + plat.width/2, 250 + currentGateHeight - 18, 3, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillRect(plat.x + plat.width/2 - 1.5, 250 + currentGateHeight - 18, 3, 10);
                        }
                        ctx.restore();
                        return;
                    }
                    
                    ctx.fillStyle = plat.tipo === "suelo" ? "#19152b" : "#2f2b46";
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

                    ctx.fillStyle = "#7986cb";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5);
                });
                ctx.restore();

                // Draw Hiding Cave (Wilderness at x = 3300)
                ctx.save();
                ctx.translate(-camaraX, 0);
                ctx.fillStyle = "rgba(5, 5, 15, 0.7)";
                ctx.fillRect(3300, 380, 160, 120);
                ctx.strokeStyle = "#455a64";
                ctx.lineWidth = 3;
                ctx.strokeRect(3300, 380, 160, 120);
                ctx.fillStyle = "#80deea";
                ctx.font = "bold 11px Outfit";
                ctx.fillText("Cueva", 3360, 370);
                ctx.restore();

                // Draw Lehí's House (Middle at x = 2000)
                ctx.save();
                ctx.translate(-camaraX, 0);
                ctx.fillStyle = "#2d241e";
                ctx.fillRect(2000, 300, 180, 200);
                ctx.strokeStyle = "#5d4037";
                ctx.lineWidth = 3;
                ctx.strokeRect(2000, 300, 180, 200);
                // Windows
                ctx.fillStyle = this.currentPhase >= 4 ? "rgba(0,0,0,0.8)" : "#ffd54f";
                ctx.fillRect(2030, 340, 30, 45);
                ctx.fillRect(2120, 340, 30, 45);
                ctx.fillStyle = "#e0a96d";
                ctx.font = "bold 11px Outfit";
                ctx.fillText("Casa de Lehí", 2055, 290);
                ctx.restore();

                // Draw Jerusalem City Wall separating Street from Wilderness
                ctx.save();
                ctx.translate(-camaraX, 0);
                // Grand stone arch wall
                ctx.fillStyle = "#261c14";
                ctx.fillRect(2820, 200, 70, 300);
                ctx.strokeStyle = "#4d382d";
                ctx.lineWidth = 3;
                ctx.strokeRect(2820, 200, 70, 300);
                // Battlements
                ctx.fillStyle = "#1e1510";
                ctx.fillRect(2810, 180, 90, 20);
                // Gate arch
                ctx.fillStyle = "#0c081f";
                ctx.beginPath();
                ctx.arc(2855, 500, 35, Math.PI, 0, false);
                ctx.fill();
                ctx.fillStyle = "#ffd700";
                ctx.font = "bold 10px Outfit";
                ctx.fillText("Muralla", 2855, 170);
                ctx.restore();

                // Draw Wealth chests in Phase 1
                if (this.currentPhase === 1) {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    this.wealthChests.forEach(c => {
                        if (!c.collected) {
                            ctx.fillStyle = "#ffb300"; // gold chest
                            ctx.fillRect(c.x, c.y, c.w, c.h);
                            ctx.fillStyle = "#3e2723";
                            ctx.fillRect(c.x + c.w/2 - 4, c.y + 8, 8, 8);
                        }
                    });
                    ctx.restore();
                }

                // Draw Laman walking in Phase 0
                if (this.currentPhase === 0 && (this.lamanPathState === "walking_left" || this.lamanPathState === "running_right" || this.lamanPathState === "arrived")) {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    let walkStep = (this.lamanPathState === "arrived") ? 0 : Math.sin(gameFrame * 0.2) * 8;
                    let lx = this.lamanX;
                    let ly = this.lamanY;
                    
                    // Robe
                    ctx.fillStyle = "#555555";
                    ctx.fillRect(lx + 8, ly + 20, 24, 65);
                    // Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(lx + 20, ly + 12, 10, 0, Math.PI*2);
                    ctx.fill();
                    // Legs
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "#ffdbac";
                    ctx.beginPath();
                    if (ly < 400) {
                        // Jumping legs (bent knees)
                        ctx.moveTo(lx + 12, ly + 85);
                        ctx.lineTo(lx + 16, ly + 93);
                        ctx.lineTo(lx + 12, ly + 98);
                        ctx.moveTo(lx + 28, ly + 85);
                        ctx.lineTo(lx + 24, ly + 93);
                        ctx.lineTo(lx + 28, ly + 98);
                    } else {
                        ctx.moveTo(lx + 12, ly + 85);
                        ctx.lineTo(lx + 12 + walkStep, ly + 100);
                        ctx.moveTo(lx + 28, ly + 85);
                        ctx.lineTo(lx + 28 - walkStep, ly + 100);
                    }
                    ctx.stroke();
                    
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 9px Outfit";
                    ctx.fillText("Lamán", lx + 20, ly - 5);
                    ctx.restore();
                }

                // Draw Laban standing in Phase 0, 1, 2
                if (this.currentPhase <= 2) {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    let lx = this.laban.x;
                    let ly = this.laban.y;
                    let lw = this.laban.width;
                    let lh = this.laban.height;

                    // Red cape
                    ctx.fillStyle = "#b71c1c";
                    ctx.fillRect(lx + 5, ly + 20, lw - 10, lh - 20);

                    // Skin Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(lx + lw/2, ly + 14, 12, 0, Math.PI*2);
                    ctx.fill();

                    // Beard
                    ctx.fillStyle = "#1a0d00";
                    ctx.beginPath();
                    ctx.moveTo(lx + lw/2 - 10, ly + 18);
                    ctx.quadraticCurveTo(lx + lw/2, ly + 32, lx + lw/2 + 10, ly + 18);
                    ctx.fill();

                    // Helmet with red crest
                    ctx.fillStyle = "#ffd700";
                    ctx.beginPath();
                    ctx.arc(lx + lw/2, ly + 12, 13, Math.PI, 0, false);
                    ctx.lineTo(lx + lw/2 + 11, ly + 14);
                    ctx.lineTo(lx + lw/2 - 11, ly + 14);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.fillStyle = "#b71c1c";
                    ctx.fillRect(lx + lw/2 - 4, ly - 8, 8, 8);

                    // Eyes
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(lx + lw/2 - 6, ly + 10, 4, 3);
                    ctx.fillRect(lx + lw/2 + 2, ly + 10, 4, 3);
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(lx + lw/2 - 5, ly + 11, 2, 2);
                    ctx.fillRect(lx + lw/2 + 3, ly + 11, 2, 2);

                    // Gold Breastplate Armor
                    ctx.fillStyle = "#ffd700";
                    ctx.fillRect(lx + 10, ly + 26, lw - 20, lh - 46);
                    ctx.fillStyle = "rgba(0,0,0,0.15)";
                    ctx.fillRect(lx + 10, ly + 26, (lw - 20)*0.3, lh - 46);

                    // Tunic hem
                    ctx.fillStyle = "#d84315";
                    ctx.fillRect(lx + 8, ly + lh - 20, lw - 16, 8);

                    // Legs & Sandals
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.moveTo(lx + 16, ly + lh - 12);
                    ctx.lineTo(lx + 16, ly + lh);
                    ctx.moveTo(lx + lw - 16, ly + lh - 12);
                    ctx.lineTo(lx + lw - 16, ly + lh);
                    ctx.stroke();
                    ctx.fillStyle = "#3e2723";
                    ctx.fillRect(lx + 12, ly + lh - 3, 8, 3);
                    ctx.fillRect(lx + lw - 20, ly + lh - 3, 8, 3);

                    // Steel sword at waist
                    ctx.fillStyle = "#ffd700";
                    ctx.fillRect(lx + 5, ly + 36, 6, 8);
                    ctx.fillStyle = "#cfd8dc";
                    ctx.fillRect(lx + 7, ly + 44, 3, 30);

                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 11px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("Labán", lx + lw/2, ly - 12);
                    ctx.restore();
                }

                // Draw Laban drunk in Phase 4, 5
                if ((this.currentPhase === 4 || this.currentPhase === 5) && this.laban && this.laban.state !== "dead") {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    ctx.fillStyle = "#d84315";
                    ctx.fillRect(this.laban.x, this.laban.y + 60, this.laban.height, this.laban.width);
                    ctx.fillStyle = "#ffdbac";
                    ctx.fillRect(this.laban.x + this.laban.height - 15, this.laban.y + 60, 15, 15);
                    ctx.fillStyle = "#95a5a6";
                    ctx.font = "bold 14px Outfit";
                    ctx.fillText("Zzz...", this.laban.x + 40, this.laban.y + 40 + Math.sin(gameFrame * 0.1) * 3);
                    ctx.restore();
                }

                // Draw brothers standing in cave during night infiltration
                if (this.currentPhase >= 4) {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    let offset = 0;
                    const brothersList = [
                        { name: "Sam", color: "#a0522d" },
                        { name: "Lamán", color: "#555555" },
                        { name: "Lemuel", color: "#666666" }
                    ];
                    brothersList.forEach(b => {
                        let bx = 3400 + offset;
                        let by = 420;
                        
                        // Robe
                        ctx.fillStyle = b.color;
                        ctx.fillRect(bx + 5, by + 16, 20, 64);
                        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
                        ctx.fillRect(bx + 5, by + 16, 6, 64);

                        // Belt
                        ctx.fillStyle = b.name === "Sam" ? "#5d4037" : "#1e1e1e";
                        ctx.fillRect(bx + 4, by + 36, 22, 5);

                        // Head
                        ctx.fillStyle = "#ffdbac";
                        ctx.beginPath();
                        ctx.arc(bx + 15, by + 8, 9, 0, Math.PI*2);
                        ctx.fill();

                        // Hair & Beard
                        ctx.fillStyle = b.name === "Sam" ? "#5d4037" : "#1a0d00";
                        ctx.fillRect(bx + 6, by, 18, 4);
                        ctx.beginPath();
                        ctx.moveTo(bx + 8, by + 11);
                        ctx.quadraticCurveTo(bx + 15, by + 22, bx + 22, by + 11);
                        ctx.fill();

                        // Eyes
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(bx + 10, by + 6, 3, 3);
                        ctx.fillRect(bx + 16, by + 6, 3, 3);
                        ctx.fillStyle = "#000000";
                        ctx.fillRect(bx + 11, by + 7, 1, 1);
                        ctx.fillRect(bx + 17, by + 7, 1, 1);

                        // Legs
                        ctx.lineWidth = 4;
                        ctx.strokeStyle = "#ffdbac";
                        ctx.beginPath();
                        ctx.moveTo(bx + 10, by + 78);
                        ctx.lineTo(bx + 10, by + 80);
                        ctx.moveTo(bx + 20, by + 78);
                        ctx.lineTo(bx + 20, by + 80);
                        ctx.stroke();

                        ctx.fillStyle = "#ffffff";
                        ctx.font = "bold 9px Outfit";
                        ctx.textAlign = "center";
                        ctx.fillText(b.name, bx + 15, by - 5);
                        offset += 50;
                    });
                    ctx.restore();
                }

                // Draw Zoram standing outside Treasury in Phase 6
                if (this.currentPhase === 6 && !this.zoramOpeningGate) {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    let zx = 550;
                    let zy = 420;
                    
                    // Robe
                    ctx.fillStyle = "#795548"; // brown robes
                    ctx.fillRect(zx + 5, zy + 16, 20, 64);
                    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
                    ctx.fillRect(zx + 5, zy + 16, 6, 64);

                    // Belt
                    ctx.fillStyle = "#3e2723";
                    ctx.fillRect(zx + 4, zy + 36, 22, 5);

                    // Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(zx + 15, zy + 8, 9, 0, Math.PI*2);
                    ctx.fill();

                    // Turban
                    ctx.fillStyle = "#b0bec5";
                    ctx.fillRect(zx + 6, zy, 18, 5);
                    ctx.beginPath();
                    ctx.arc(zx + 15, zy + 1, 9, Math.PI, 0, false);
                    ctx.fill();

                    // Beard
                    ctx.fillStyle = "#78909c";
                    ctx.beginPath();
                    ctx.moveTo(zx + 8, zy + 11);
                    ctx.quadraticCurveTo(zx + 15, zy + 22, zx + 22, zy + 11);
                    ctx.fill();

                    // Eyes
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(zx + 10, zy + 6, 3, 3);
                    ctx.fillRect(zx + 16, zy + 6, 3, 3);
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(zx + 10, zy + 7, 1, 1);
                    ctx.fillRect(zx + 16, zy + 7, 1, 1);
                    
                    // Legs
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.moveTo(zx + 10, zy + 78);
                    ctx.lineTo(zx + 10, zy + 80);
                    ctx.moveTo(zx + 20, zy + 78);
                    ctx.lineTo(zx + 20, zy + 80);
                    ctx.stroke();

                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 9px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("Zoram", zx + 15, zy - 7);
                    ctx.restore();
                }

                // Draw Angel in Phase 3
                if (this.angelActive) {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    let ax = 3250;
                    let ay = 330 + Math.sin(gameFrame * 0.15) * 8;
                    
                    // Divine light shadow glow
                    ctx.shadowColor = "#fff9c4";
                    ctx.shadowBlur = 30;
                    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                    ctx.beginPath();
                    ctx.arc(ax + 20, ay + 30, 40, 0, Math.PI*2);
                    ctx.fill();
                    
                    // Robe
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(ax + 10, ay + 15, 20, 65);
                    // Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(ax + 20, ay + 5, 9, 0, Math.PI*2);
                    ctx.fill();
                    // Wings
                    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
                    ctx.beginPath();
                    ctx.ellipse(ax + 5, ay + 35, 10, 30, -0.4, 0, Math.PI*2);
                    ctx.ellipse(ax + 35, ay + 35, 10, 30, 0.4, 0, Math.PI*2);
                    ctx.fill();
                    
                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 11px Outfit";
                    ctx.fillText("ÁNGEL", ax + 20, ay - 12);
                    ctx.restore();
                }

                // Beating stick and dust effects
                if (this.beatingActive) {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    ctx.strokeStyle = "#8d6e63";
                    ctx.lineWidth = 4;
                    let angle = Math.sin(gameFrame * 0.4) * 0.7;
                    
                    // Laman beats Nefi
                    ctx.save();
                    ctx.translate(3460, 430);
                    ctx.rotate(angle);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(-20, -25);
                    ctx.stroke();
                    ctx.restore();
                    
                    // Beating dust
                    ctx.fillStyle = "rgba(238, 238, 238, 0.35)";
                    for(let i=0; i<4; i++) {
                        let px = 3450 + Math.sin(gameFrame + i) * 20;
                        let py = 460 + Math.cos(gameFrame + i) * 10;
                        ctx.beginPath();
                        ctx.arc(px, py, 5, 0, Math.PI*2);
                        ctx.fill();
                    }
                    ctx.restore();
                }

                // Draw Planchas de Bronce on pedestal inside Treasury vault (x = 150)
                if (!this.platesCollected) {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    ctx.fillStyle = "#8d6e63"; // pedestal
                    ctx.fillRect(150, 440, 45, 60);
                    ctx.fillStyle = "#ffd700"; // gold plate book
                    ctx.fillRect(155, 415, 35, 25);
                    ctx.strokeStyle = "#ff9100";
                    ctx.strokeRect(155, 415, 35, 25);
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "bold 9px Outfit";
                    ctx.fillText("Planchas", 172, 405);
                    ctx.restore();
                }

                // Patrol guards light cones during night infiltration (Phase 4)
                if (this.currentPhase === 4) {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    this.enemies.forEach(e => {
                        if (e.hp <= 0) return;
                        
                        if (e.type === "guard_normal") {
                            let coneGrad = ctx.createLinearGradient(e.x, e.y, e.x + (180 * e.dir), e.y);
                            coneGrad.addColorStop(0, "rgba(255, 235, 59, 0.22)");
                            coneGrad.addColorStop(1, "rgba(255, 235, 59, 0)");
                            ctx.fillStyle = coneGrad;
                            ctx.beginPath();
                            ctx.moveTo(e.x + e.width/2, e.y + 20);
                            ctx.lineTo(e.x + e.width/2 + (180 * e.dir), e.y - 15);
                            ctx.lineTo(e.x + e.width/2 + (180 * e.dir), e.y + 55);
                            ctx.closePath();
                            ctx.fill();
                        } else if (e.type === "guard_torch") {
                            let rGrad = ctx.createRadialGradient(e.x + e.width/2, e.y + e.height/2, 20, e.x + e.width/2, e.y + e.height/2, 140);
                            rGrad.addColorStop(0, "rgba(255, 152, 0, 0.28)");
                            rGrad.addColorStop(1, "rgba(255, 152, 0, 0)");
                            ctx.fillStyle = rGrad;
                            ctx.beginPath();
                            ctx.arc(e.x + e.width/2, e.y + e.height/2, 140, 0, Math.PI*2);
                            ctx.fill();
                        }

                        // Patrolling guards drawing
                        let bobY = Math.abs(Math.sin(gameFrame * 0.15)) * 4;
                        let walkStep = Math.sin(gameFrame * 0.15) * 8;
                        
                        // Head & face
                        ctx.fillStyle = "#ffdbac";
                        ctx.fillRect(e.x + e.width/2 - 10, e.y + 4 - bobY, 20, 16);
                        
                        // Royal Palace Armor (Gold and purple)
                        ctx.fillStyle = "#ffd700"; // Gold breastplate
                        ctx.fillRect(e.x + 8, e.y + 20 - bobY, e.width - 16, e.height - 38);
                        ctx.fillStyle = "#4a148c"; // Purple tunic
                        ctx.fillRect(e.x + 6, e.y + e.height - 18, e.width - 12, 6);

                        // Palace Helmet
                        ctx.fillStyle = "#455a64"; // Dark iron helmet
                        ctx.beginPath();
                        ctx.arc(e.x + e.width/2, e.y + 6 - bobY, 11, Math.PI, 0, false);
                        ctx.lineTo(e.x + e.width/2 + 9, e.y + 8 - bobY);
                        ctx.lineTo(e.x + e.width/2 - 9, e.y + 8 - bobY);
                        ctx.closePath();
                        ctx.fill();

                        // Legs & walk animation
                        ctx.lineWidth = 4;
                        ctx.strokeStyle = "#ffdbac";
                        ctx.beginPath();
                        ctx.moveTo(e.x + 12, e.y + e.height - 8);
                        ctx.lineTo(e.x + 12 + walkStep, e.y + e.height);
                        ctx.moveTo(e.x + e.width - 12, e.y + e.height - 8);
                        ctx.lineTo(e.x + e.width - 12 - walkStep, e.y + e.height);
                        ctx.stroke();

                        // Draw torch or weapon
                        if (e.type === "guard_torch") {
                            let tX = e.dir > 0 ? e.x + e.width + 2 : e.x - 6;
                            // Torch Stick
                            ctx.fillStyle = "#5d4037";
                            ctx.fillRect(tX, e.y + 15 - bobY, 4, 25);
                            ctx.fillStyle = "#37474f";
                            ctx.fillRect(tX - 2, e.y + 15 - bobY, 8, 4);

                            // Torch flame particles
                            for (let p = 0; p < 4; p++) {
                                let offsetSeed = p * 15 + gameFrame;
                                let pX = tX + 2 + Math.sin(offsetSeed * 0.2) * 4;
                                let pY = e.y + 10 - bobY - (offsetSeed % 12);
                                let pSize = 2 + (offsetSeed % 4);
                                let colors = ["#ff3d00", "#ff9100", "#ffea00"];
                                ctx.fillStyle = colors[p % colors.length];
                                ctx.beginPath();
                                ctx.arc(pX, pY, pSize, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        } else {
                            let spX = e.dir > 0 ? e.x + e.width - 6 : e.x + 6;
                            ctx.fillStyle = "#5d4037"; // shaft
                            ctx.fillRect(spX, e.y + 4 - bobY, 3, e.height - 4);
                            ctx.fillStyle = "#ffd700"; // gold head
                            ctx.beginPath();
                            ctx.moveTo(spX - 3, e.y + 4 - bobY);
                            ctx.lineTo(spX + 1.5, e.y - 8 - bobY);
                            ctx.lineTo(spX + 6, e.y + 4 - bobY);
                            ctx.closePath();
                            ctx.fill();
                        }
                    });
                    ctx.restore();
                }

                // Alarm flashing screen overlay
                if (this.alarmActive && Math.floor(gameFrame / 15) % 2 === 0) {
                    ctx.fillStyle = "rgba(211, 47, 47, 0.12)";
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                }

                // Draw Family Queue/Followers (Phases 1, 2, 7)
                if (this.currentPhase === 1 || this.currentPhase === 2 || this.currentPhase === 7) {
                    ctx.save();
                    ctx.translate(-camaraX, 0);
                    this.family.forEach(member => {
                        ctx.save();
                        let fH = member.agachado ? member.height * 0.55 : member.height;
                        let fY = member.y; // Correct Y position from history
                        
                        // Shadow under feet
                        ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
                        ctx.beginPath();
                        ctx.ellipse(member.x + 15, fY + fH - 2, 10, 3, 0, 0, Math.PI*2);
                        ctx.fill();

                        // Body Robe with details
                        ctx.fillStyle = member.healthy ? member.color : "#d32f2f";
                        ctx.fillRect(member.x + 6, fY + 18, 18, fH - 26); // leave 8px for legs
                        
                        // Shading on robe
                        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
                        ctx.fillRect(member.x + 6, fY + 18, 6, fH - 26);

                        // Specific sashes/belts
                        if (member.name === "Sam") {
                            ctx.fillStyle = "#5d4037"; // brown belt
                            ctx.fillRect(member.x + 5, fY + 36, 20, 4);
                        } else if (member.name === "Zoram") {
                            ctx.fillStyle = "#3e2723"; // dark leather belt
                            ctx.fillRect(member.x + 5, fY + 36, 20, 4);
                        } else {
                            ctx.fillStyle = "#1e1e1e"; // dark/grey belt for Laman/Lemuel
                            ctx.fillRect(member.x + 5, fY + 36, 20, 4);
                        }

                        // Skin Head
                        ctx.fillStyle = "#ffdbac";
                        ctx.beginPath();
                        ctx.arc(member.x + 15, fY + 10, 8, 0, Math.PI*2);
                        ctx.fill();

                        // Hair and beards
                        ctx.fillStyle = "#4e342e"; // Dark brown/black hair
                        if (member.name === "Zoram") {
                            // Turban for Zoram
                            ctx.fillStyle = "#b0bec5";
                            ctx.fillRect(member.x + 7, fY + 2, 16, 5);
                            ctx.beginPath();
                            ctx.arc(member.x + 15, fY + 3, 7, Math.PI, 0, false);
                            ctx.fill();
                            // beard
                            ctx.fillStyle = "#78909c";
                            ctx.beginPath();
                            ctx.moveTo(member.x + 10, fY + 12);
                            ctx.quadraticCurveTo(member.x + 15, fY + 22, member.x + 20, fY + 12);
                            ctx.fill();
                        } else {
                            // Brothers have hair/beard
                            ctx.fillStyle = member.name === "Sam" ? "#5d4037" : "#1a0d00"; // Sam has medium brown hair, Laman/Lemuel black
                            // hair
                            ctx.fillRect(member.x + 7, fY + 2, 16, 4);
                            // beard
                            ctx.beginPath();
                            ctx.moveTo(member.x + 9, fY + 12);
                            ctx.quadraticCurveTo(member.x + 15, fY + 24, member.x + 21, fY + 12);
                            ctx.fill();
                        }

                        // Eyes
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(member.x + 12, fY + 8, 3, 3);
                        ctx.fillRect(member.x + 16, fY + 8, 3, 3);
                        ctx.fillStyle = "#000000";
                        ctx.fillRect(member.x + 13, fY + 9, 1, 1);
                        ctx.fillRect(member.x + 17, fY + 9, 1, 1);

                        // Legs & feet animation
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = "#ffdbac";
                        let step = Math.sin(gameFrame * 0.15 + member.offset * 0.25) * 6;
                        ctx.beginPath();
                        ctx.moveTo(member.x + 10, fY + fH - 8);
                        ctx.lineTo(member.x + 10 + step, fY + fH);
                        ctx.moveTo(member.x + 20, fY + fH - 8);
                        ctx.lineTo(member.x + 20 - step, fY + fH);
                        ctx.stroke();

                        // Name label
                        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
                        ctx.font = "bold 9px Outfit";
                        ctx.textAlign = "center";
                        ctx.fillText(member.name, member.x + 15, fY - 5);
                        ctx.restore();
                    });
                    ctx.restore();
                }

                // Floating overhead target arrow (when target is on screen)
                if (this.objectiveTargetX !== undefined) {
                    let tx = this.objectiveTargetX;
                    let ty = 340; // Default height above ground level
                    
                    // Specific heights for targets
                    if (this.currentPhase === 1) {
                        // Lehi's House
                        tx = 2090;
                        ty = 230;
                    } else if (this.currentPhase === 2) {
                        // Palace / Laban
                        tx = 750;
                        ty = 330;
                    } else if (this.currentPhase === 4 || this.currentPhase === 5) {
                        // Laban drunk
                        tx = 930;
                        ty = 370;
                    } else if (this.currentPhase === 6) {
                        // Zoram / Pedestal
                        if (!this.zoramOpeningGate) {
                            tx = 565;
                            ty = 340;
                        } else {
                            tx = 172;
                            ty = 340;
                        }
                    } else if (this.currentPhase === 7) {
                        // Cave
                        tx = 3380;
                        ty = 310;
                    }

                    // Check if target is on screen
                    if (tx >= camaraX && tx <= camaraX + 1024) {
                        ctx.save();
                        ctx.translate(-camaraX, 0);
                        let pulseY = Math.sin(gameFrame * 0.15) * 6;
                        
                        // Draw animated downward gold triangle
                        ctx.fillStyle = "#ffd700";
                        ctx.strokeStyle = "#ff9100";
                        ctx.lineWidth = 2;
                        ctx.shadowColor = "#ffd700";
                        ctx.shadowBlur = 10;
                        
                        ctx.beginPath();
                        ctx.moveTo(tx, ty + pulseY);
                        ctx.lineTo(tx - 10, ty - 16 + pulseY);
                        ctx.lineTo(tx + 10, ty - 16 + pulseY);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        
                        // Text Label above the arrow
                        ctx.shadowBlur = 0;
                        ctx.fillStyle = "#ffffff";
                        ctx.font = "bold 10px Outfit";
                        ctx.textAlign = "center";
                        ctx.fillText(this.objectiveTargetLabel || "AQUÍ", tx, ty - 22 + pulseY);
                        ctx.restore();
                    }
                }
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
