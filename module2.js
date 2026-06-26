// Module 2: 2 Nephi - The Division and the Law
const module2 = {
    id: 2,
    name: "2 Nefi - La división y la ley",
    libros: ["2 Nefi"],
    personajes: ["Nefi", "Sam", "Jacob", "José", "Zoram"],
    enseñanzas: ["Albedrío", "Oposición", "Templo de Nefi", "Doctrina de Cristo"],
    unlocked: false,
    levels: [
        // LEVEL 1: Fleeing Lamán and Lemuel's threats (Stealth & Escort)
        {
            id: 1,
            name: "La Advertencia de Huir al Desierto",
            desc: "Escapa de las amenazas de tus hermanos lamanitas y guía a tu familia a salvo en la noche.",
            maxScroll: 3200,
            
            // Level introduction data
            introTitle: "Advertencia de Huir",
            introText: "Tras llegar a la tierra prometida, surgen graves tensiones. Lamán y Lemuel, llenos de ira, acusan a Nefi de querer gobernarlos y conspiran para quitarle la vida. El Señor advierte a Nefi en una revelación que huya de nuevo al desierto junto con todos los que crean en las amonestaciones de Dios. Escapa sigilosamente en la noche y guía a tu familia.",
            introObjective: "Guía a Sam, Jacob, José y Zoram por el cañón sin ser detectado por las patrullas lamanitas.",

            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;
                
                this.checkpoint = { x: 150, y: 400 };
                this.alarmActive = false;
                this.alarmTimer = 0;

                // Tutorials
                this.tutorials = [
                    { x: 200, text: "Usa ◀ ▶ para guiar a tu familia. ¡Ellos te siguen de cerca!", triggered: false },
                    { x: 600, text: "Mantén Abajo ▼ en las rocas oscuras para ocultarte en las sombras.", triggered: false },
                    { x: 1000, text: "Evita los guardias de antorchas. Su rango de luz te detectará instantáneamente.", triggered: false }
                ];

                // Family configuration
                this.family = [
                    { name: "Sam", color: "#a0522d", height: 90, offset: 35, healthy: true, jumping: false },
                    { name: "Jacob", color: "#9c27b0", height: 85, offset: 70, healthy: true, jumping: false },
                    { name: "José", color: "#00acc1", height: 80, offset: 105, healthy: true, jumping: false },
                    { name: "Zoram", color: "#795548", height: 90, offset: 140, healthy: true, jumping: false }
                ];

                this.positionHistory = [];
                for(let i=0; i<300; i++) {
                    this.positionHistory.push({ x: 150, y: 400, agachado: false, jumping: false });
                }

                // Shadows (Rocks)
                this.shadows = [
                    { x: 450, y: 300, width: 220, height: 200 },
                    { x: 1100, y: 300, width: 250, height: 200 },
                    { x: 1850, y: 300, width: 260, height: 200 },
                    { x: 2550, y: 300, width: 230, height: 200 }
                ];

                // Layout
                this.platforms = [
                    { x: 0, y: 500, width: 1400, height: 100, tipo: "suelo" },
                    { x: 550, y: 420, width: 150, height: 80, tipo: "bloque" },
                    { x: 920, y: 390, width: 200, height: 30, tipo: "plataforma" },
                    // Gap/Pit
                    { x: 1650, y: 500, width: 1600, height: 100, tipo: "suelo" },
                    { x: 1950, y: 410, width: 200, height: 90, tipo: "bloque" },
                    { x: 2350, y: 380, width: 220, height: 30, tipo: "plataforma" }
                ];

                this.monedas = [
                    { x: 380, y: 450, collected: false },
                    { x: 980, y: 330, collected: false },
                    { x: 1300, y: 450, collected: false },
                    { x: 1800, y: 450, collected: false },
                    { x: 2450, y: 320, collected: false }
                ];

                this.enemies = [
                    { x: 780, y: 420, type: "guard_torch", hp: 1, range: 120, startX: 780, dir: -1, width: 50, height: 80, speed: 2.2, state: "patrol" },
                    { x: 1200, y: 420, type: "guard_torch", hp: 1, range: 90, startX: 1200, dir: 1, width: 50, height: 80, speed: 1.8, state: "patrol" },
                    { x: 2100, y: 420, type: "guard_torch", hp: 1, range: 130, startX: 2100, dir: -1, width: 50, height: 80, speed: 2.5, state: "patrol" },
                    { x: 2700, y: 420, type: "guard_torch", hp: 1, range: 100, startX: 2700, dir: 1, width: 50, height: 80, speed: 2.0, state: "patrol" }
                ];

                game.dialogueQueue = [
                    { char: "Nefi", text: "Mis hermanos Lamán y Lemuel buscan quitarme la vida. El Señor me ha advertido que huya con mi familia al desierto." },
                    { char: "Sam", text: "Te seguiremos, Nefi. El Señor te ha elegido por maestro y jefe sobre nosotros." },
                    { char: "Nefi", text: "Caminemos con cuidado. Si nos detectan con sus antorchas, debemos correr al refugio de las rocas oscuras." }
                ];
                game.startDialogue();

                this.middleDialogueTriggered = false;
                this.finishTextShown = false;
            },

            update: function(game, gameFrame, input) {
                // Family position tracking
                this.positionHistory.unshift({
                    x: game.player.x,
                    y: game.player.y,
                    agachado: game.player.agachado,
                    jumping: game.player.jumping
                });
                if (this.positionHistory.length > 300) {
                    this.positionHistory.pop();
                }

                // Update family member sprites positions
                this.family.forEach(member => {
                    const posIndex = member.offset;
                    const histPos = this.positionHistory[posIndex] || this.positionHistory[this.positionHistory.length - 1];
                    member.x = histPos.x;
                    member.y = histPos.y;
                    member.agachado = histPos.agachado;
                    member.jumping = histPos.jumping;
                });

                // Detect shadow zone hiding
                let inShadow = false;
                this.shadows.forEach(s => {
                    if (game.player.x > s.x && game.player.x + game.player.width < s.x + s.width &&
                        game.player.y + game.player.height > s.y && game.player.y < s.y + s.height) {
                        inShadow = true;
                    }
                });
                game.player.hidden = inShadow && input.abajo && game.player.grounded;

                // Middle dialogue warning - quiet moments only
                if (!this.middleDialogueTriggered && game.player.x > 1500 && game.player.grounded && Math.abs(game.player.velX) < 2) {
                    this.middleDialogueTriggered = true;
                    game.dialogueQueue = [
                        { char: "Jacob", text: "Nefi, he escuchado los gritos de los lamanitas a lo lejos. No se detendrán en sus amenazas." },
                        { char: "Nefi", text: "Confiemos en Dios. Él nos guiará por el desierto hasta que estemos fuera de su alcance." }
                    ];
                    game.startDialogue();
                }

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

                // Update tutorials
                this.tutorials.forEach(t => {
                    if (!t.triggered && game.player.x >= t.x) {
                        t.triggered = true;
                        game.showNotification(t.text);
                    }
                });

                // Update guards patrol & vision detection
                this.enemies.forEach(e => {
                    if (e.hp <= 0) return;

                    // Move guards
                    e.x += e.speed * (this.alarmActive ? 1.6 : 1.0) * e.dir;
                    if (Math.abs(e.x - e.startX) > e.range) {
                        e.dir *= -1;
                    }

                    // Detection logic: torch cone
                    if (!game.player.hidden && game.player.inmune === 0) {
                        let dx = (game.player.x + game.player.width/2) - (e.x + e.width/2);
                        let dy = (game.player.y + game.player.height/2) - (e.y + e.height/2);
                        let dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < 155) {
                            if (!this.alarmActive) {
                                this.alarmActive = true;
                                this.alarmTimer = 0;
                                window.gameAudio.playAlarm();
                                game.showNotification("⚠️ ¡La guardia lamanita te ha divisado! ¡Mantente a cubierto!");
                            }
                        }
                    }

                    // Hurt player
                    if (game.player.inmune === 0 && game.collides(game.player, e)) {
                        game.playerHurt();
                    }

                    // Sword strike
                    if (game.player.atacando && game.player.ataqueCooldown === 15) {
                        let swordX = game.player.direccion === "derecha" ? game.player.x + game.player.width : game.player.x - 50;
                        let hitBox = { x: swordX, y: game.player.y, width: 50, height: game.player.height };
                        if (game.collides(hitBox, e)) {
                            e.hp--;
                            window.gameAudio.playHit();
                            if (e.hp <= 0) {
                                game.score += 80;
                                game.showNotification("⚔️ Guardia neutralizado.");
                            }
                        }
                    }
                });

                // Coins pickup
                this.monedas.forEach(m => {
                    if (!m.collected && game.collides(game.player, { x: m.x - 10, y: m.y - 10, width: 20, height: 20 })) {
                        m.collected = true;
                        game.score += 15;
                        window.gameAudio.playCoin();
                    }
                });

                // Pit/fall check
                if (game.player.y > 576) {
                    game.player.x = this.checkpoint.x;
                    game.player.y = 400;
                    game.playerHurt();
                }

                // Level completion
                if (game.player.x > 3000 && !game.dialogueActive && !this.finishTextShown) {
                    this.finishTextShown = true;
                    // Check family health bonus
                    let healthyCount = this.family.filter(m => m.healthy).length;
                    let bonus = healthyCount * 120;
                    game.score += bonus;
                    game.completeLevel("Y aconteció que todos los que quisieron venir conmigo fueron los que creían en las amonestaciones y revelaciones de Dios.", "2 Nefi 5:6", bonus);
                }
            },

            draw: function(ctx, game, gameFrame, camaraX) {
                // Sky Night Canyon
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#03020b");
                grad.addColorStop(0.6, "#0b081e");
                grad.addColorStop(1, "#180d29");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Star details
                ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
                for(let i=0; i<12; i++) {
                    let starX = (i * 270 - camaraX * 0.15) % 1024;
                    if (starX < 0) starX += 1024;
                    ctx.fillRect(starX, (i * 87) % 220, 2, 2);
                }

                // Dark mountains/cliffs parallax silhouettes
                ctx.fillStyle = "#070414";
                for (let i = 0; i < 10; i++) {
                    let cliffX = (i * 350 - camaraX * 0.35);
                    ctx.beginPath();
                    ctx.moveTo(cliffX, 576);
                    ctx.lineTo(cliffX + 150, 180 + (i % 2) * 50);
                    ctx.lineTo(cliffX + 300, 576);
                    ctx.closePath();
                    ctx.fill();
                }

                // Shadow zones (dark rocks)
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.shadows.forEach(s => {
                    // Draw large rock outlines
                    ctx.fillStyle = "rgba(10, 8, 26, 0.85)";
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                    ctx.lineWidth = 2;
                    ctx.fillRect(s.x, s.y, s.width, s.height);
                    ctx.strokeRect(s.x, s.y, s.width, s.height);
                    
                    // Draw grass/shrub layers
                    ctx.fillStyle = "#1b1437";
                    ctx.fillRect(s.x + 10, s.y + s.height - 12, s.width - 20, 12);
                });
                ctx.restore();

                // Platforms with brick textures
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.platforms.forEach(plat => {
                    ctx.fillStyle = plat.tipo === "suelo" ? "#140e24" : "#251b3c";
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

                    ctx.fillStyle = "#00bfff";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5); // neon cyan top
                });
                ctx.restore();

                // Coins
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.monedas.forEach(m => {
                    if (!m.collected) {
                        ctx.fillStyle = "#ffd700";
                        ctx.beginPath();
                        ctx.arc(m.x, m.y + Math.sin(gameFrame * 0.1) * 3, 7, 0, Math.PI*2);
                        ctx.fill();
                        ctx.strokeStyle = "#ff9100";
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
                ctx.restore();

                // Draw Family followers
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.family.forEach(member => {
                    ctx.save();
                    let fH = member.agachado ? member.height * 0.55 : member.height;
                    let fY = member.y;

                    // Body robe
                    ctx.fillStyle = member.healthy ? member.color : "#d32f2f";
                    ctx.fillRect(member.x + 8, fY + 20, 24, fH - 20);

                    // Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(member.x + 20, fY + 12, 10, 0, Math.PI*2);
                    ctx.fill();

                    // Label tag
                    ctx.fillStyle = "rgba(255,255,255,0.7)";
                    ctx.font = "bold 9px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText(member.name, member.x + 20, fY - 5);
                    ctx.restore();
                });
                ctx.restore();

                // Alarm layout overlay
                if (this.alarmActive && Math.floor(gameFrame / 15) % 2 === 0) {
                    ctx.fillStyle = "rgba(211, 47, 47, 0.15)";
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                }

                // Guards & Light cones
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.enemies.forEach(e => {
                    if (e.hp <= 0) return;
                    
                    // Light cone drawing (glowing radial gradient)
                    let cone = ctx.createRadialGradient(e.x + e.width/2, e.y + 35, 10, e.x + e.width/2, e.y + 35, 150);
                    cone.addColorStop(0, "rgba(255, 193, 7, 0.35)");
                    cone.addColorStop(1, "rgba(255, 193, 7, 0)");
                    ctx.fillStyle = cone;
                    ctx.beginPath();
                    ctx.arc(e.x + e.width/2, e.y + 35, 150, 0, Math.PI*2);
                    ctx.fill();

                    // Guard body representation
                    ctx.fillStyle = "#4a148c"; // Lamanite purple robes
                    ctx.fillRect(e.x, e.y, e.width, e.height);

                    // Head/Arm
                    ctx.fillStyle = "#ffdbac";
                    ctx.fillRect(e.x + 12, e.y, e.width - 24, 15);
                    
                    // Torch stick and dynamic fire particles
                    let tX = e.dir > 0 ? e.x + e.width + 2 : e.x - 6;
                    ctx.fillStyle = "#5d4037"; // Stick
                    ctx.fillRect(tX, e.y + 18, 4, 15);
                    ctx.fillStyle = "#37474f"; // metal cup
                    ctx.fillRect(tX - 2, e.y + 16, 8, 3);

                    // Dynamic flame particles
                    for (let p = 0; p < 4; p++) {
                        let offsetSeed = p * 15 + gameFrame;
                        let pX = tX + 2 + Math.sin(offsetSeed * 0.2) * 4;
                        let pY = e.y + 12 - (offsetSeed % 12);
                        let pSize = 2 + (offsetSeed % 4);
                        let colors = ["#ff3d00", "#ff9100", "#ffea00"];
                        ctx.fillStyle = colors[p % colors.length];
                        ctx.beginPath();
                        ctx.arc(pX, pY, pSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                ctx.restore();
            }
        },

        // LEVEL 2: Build Temple and Swords (Gathering & Crafting)
        {
            id: 2,
            name: "Fundando la Tierra de Nefi y el Templo",
            desc: "Cosecha madera de cedro, pica vetas de metal y erige un hermoso templo al Señor.",
            maxScroll: 3000,
            
            // Level introduction data
            introTitle: "Edificando un Templo al Señor",
            introText: "Nefi y su pueblo se establecen en un nuevo lugar al que llaman la Tierra de Nefi. Para adorar al Señor y guardar Sus mandamientos, Nefi decide edificar un templo a semejanza del templo de Salomón, utilizando los abundantes recursos de la región. José le asiste para reunir cedros de los montes y valiosos metales.",
            introObjective: "Recolecta madera de cedro y vetas de metal, y construye las 4 fases del templo.",

            init: function(game) {
                game.player.x = 150;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;

                // Materials inventory
                this.woodCount = 0;
                this.oreCount = 0;
                this.maxWood = 10;
                this.maxOre = 10;
                
                this.buildProgress = 0; // 0 to 4 phases: 1: Foundations, 2: Walls, 3: Pillars, 4: Finished

                // Gather resources points
                this.trees = [
                    { x: 380, y: 380, w: 50, h: 120, hp: 3, woodDropped: false },
                    { x: 750, y: 380, w: 55, h: 120, hp: 3, woodDropped: false },
                    { x: 1350, y: 380, w: 50, h: 120, hp: 3, woodDropped: false }
                ];

                this.orePoints = [
                    { x: 1050, y: 300, w: 40, h: 40, hp: 3, oreDropped: false },
                    { x: 1800, y: 280, w: 40, h: 40, hp: 3, oreDropped: false },
                    { x: 2150, y: 440, w: 40, h: 40, hp: 3, oreDropped: false }
                ];

                this.droppedItems = []; // Contains { x, y, type, collected }

                // Floating platforms
                this.platforms = [
                    { x: 0, y: 500, width: 950, height: 100, tipo: "suelo" },
                    // Elevated quarry stepping stones
                    { x: 950, y: 360, width: 150, height: 140, tipo: "bloque" },
                    { x: 1180, y: 380, width: 120, height: 120, tipo: "bloque" },
                    // Gap/Pit
                    { x: 1450, y: 500, width: 1550, height: 100, tipo: "suelo" },
                    { x: 1750, y: 340, width: 140, height: 160, tipo: "bloque" }
                ];

                this.enemies = [
                    { x: 500, y: 460, type: "wolf", hp: 1, dir: -1, width: 45, height: 40, speed: 4.2 },
                    { x: 1600, y: 460, type: "bear", hp: 2, dir: -1, width: 55, height: 60, speed: 2.3 },
                    { x: 2200, y: 460, type: "wolf", hp: 1, dir: 1, width: 45, height: 40, speed: 4.8 }
                ];

                game.dialogueQueue = [
                    { char: "Nefi", text: "Hemos fundado la Tierra de Nefi. Edificaremos un hermoso templo para adorar a Dios, a semejanza del templo de Salomón." },
                    { char: "José", text: "Yo te ayudaré a reunir materiales de la naturaleza. Cedros de los montes y metal de las canteras." },
                    { char: "Nefi", text: "Golpea los árboles y las rocas con tu espada para recolectar, y presiona C en el solar sagrado para construir." }
                ];
                game.startDialogue();

                this.finishTextShown = false;
            },

            update: function(game, gameFrame, input) {
                // Enemies wolves/bears AI movement
                this.enemies.forEach(e => {
                    if (e.hp <= 0) return;

                    e.x += e.speed * e.dir;
                    // Boundary bouncing
                    if (e.type === "wolf") {
                        if (e.x < 50 || e.x > 2800) e.dir *= -1;
                    } else {
                        if (e.x < 1450 || e.x > 2200) e.dir *= -1;
                    }

                    // Hurt player
                    if (game.player.inmune === 0 && game.collides(game.player, e)) {
                        game.playerHurt();
                    }

                    // Attack enemy
                    if (game.player.atacando && game.player.ataqueCooldown === 15) {
                        let swordX = game.player.direccion === "derecha" ? game.player.x + game.player.width : game.player.x - 50;
                        let hitBox = { x: swordX, y: game.player.y, width: 50, height: game.player.height };
                        if (game.collides(hitBox, e)) {
                            e.hp--;
                            window.gameAudio.playHit();
                            if (e.hp <= 0) {
                                game.score += 40;
                                game.showNotification("🐾 Bestia ahuyentada.");
                            }
                        }
                    }
                });

                // Harvest Wood
                this.trees.forEach(t => {
                    if (t.woodDropped) return;

                    if (game.player.atacando && game.player.ataqueCooldown === 15) {
                        let swordX = game.player.direccion === "derecha" ? game.player.x + game.player.width : game.player.x - 50;
                        let hitBox = { x: swordX, y: game.player.y, width: 50, height: game.player.height };
                        if (game.collides(hitBox, { x: t.x, y: t.y, width: t.w, height: t.h })) {
                            t.hp--;
                            window.gameAudio.playHit();
                            if (t.hp <= 0) {
                                t.woodDropped = true;
                                this.droppedItems.push({ x: t.x + 15, y: 460, type: "wood", collected: false });
                                game.showNotification("🌲 ¡Madera de cedro obtenida!");
                            }
                        }
                    }
                });

                // Harvest Ore
                this.orePoints.forEach(o => {
                    if (o.oreDropped) return;

                    if (game.player.atacando && game.player.ataqueCooldown === 15) {
                        let swordX = game.player.direccion === "derecha" ? game.player.x + game.player.width : game.player.x - 50;
                        let hitBox = { x: swordX, y: game.player.y, width: 50, height: game.player.height };
                        if (game.collides(hitBox, { x: o.x, y: o.y, width: o.w, height: o.h })) {
                            o.hp--;
                            window.gameAudio.playHit();
                            if (o.hp <= 0) {
                                o.oreDropped = true;
                                this.droppedItems.push({ x: o.x + 10, y: o.y + 10, type: "ore", collected: false });
                                game.showNotification("💎 ¡Mineral precioso extraído!");
                            }
                        }
                    }
                });

                // Collect dropped items
                this.droppedItems.forEach(item => {
                    if (!item.collected && game.collides(game.player, { x: item.x - 20, y: item.y - 20, width: 40, height: 40 })) {
                        item.collected = true;
                        window.gameAudio.playCoin();
                        if (item.type === "wood") {
                            this.woodCount = Math.min(this.maxWood, this.woodCount + 2);
                        } else if (item.type === "ore") {
                            this.oreCount = Math.min(this.maxOre, this.oreCount + 2);
                        }
                    }
                });

                // Crafting / Building at the Temple Site
                if (game.player.x > 2350 && input.crafting) {
                    input.crafting = false; // Reset key trigger
                    
                    if (this.buildProgress >= 4) {
                        game.showNotification("⛪ El templo del Señor ya está terminado.");
                        return;
                    }

                    if (this.woodCount >= 2 && this.oreCount >= 2) {
                        this.woodCount -= 2;
                        this.oreCount -= 2;
                        this.buildProgress++;
                        window.gameAudio.playPowerUp();
                        game.score += 200;
                        
                        game.showNotification(`🔨 ¡Fase del templo ${this.buildProgress}/4 edificada!`);

                        if (this.buildProgress === 4) {
                            game.dialogueQueue = [
                                { char: "Nefi", text: "¡Gloria al Señor! Hemos forjado espadas de acero y terminado la construcción del Templo en la Tierra de Nefi." }
                            ];
                            game.startDialogue();
                        }
                    } else {
                        game.showNotification("❌ Insuficiente material. Requiere 2 de Madera y 2 de Mineral.");
                    }
                }

                // Pit fall check
                if (game.player.y > 576) {
                    game.player.x = 150;
                    game.player.y = 400;
                    game.playerHurt();
                }

                // Level victory
                if (this.buildProgress === 4 && !game.dialogueActive && !this.finishTextShown) {
                    this.finishTextShown = true;
                    let bonus = (this.woodCount + this.oreCount) * 60;
                    game.score += bonus;
                    game.completeLevel("Y yo, Nefi, edifiqué un templo; y lo construí a semejanza del templo de Salomón.", "2 Nefi 5:16", bonus);
                }
            },

            draw: function(ctx, game, gameFrame, camaraX) {
                // Sky Sunset transition
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#2c1c38");
                grad.addColorStop(0.5, "#d84315");
                grad.addColorStop(1, "#ffe082");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Clouds
                ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
                for (let i = 0; i < 5; i++) {
                    let cx = (i * 400 - camaraX * 0.2) % 1200;
                    ctx.beginPath();
                    ctx.arc(cx, 100, 60, 0, Math.PI*2);
                    ctx.arc(cx + 60, 90, 75, 0, Math.PI*2);
                    ctx.arc(cx + 120, 100, 60, 0, Math.PI*2);
                    ctx.closePath();
                    ctx.fill();
                }

                // Draw Platforms with brick textures
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.platforms.forEach(plat => {
                    ctx.fillStyle = plat.tipo === "suelo" ? "#3e2723" : "#4e342e";
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

                    ctx.fillStyle = "#ffd700";
                    ctx.fillRect(plat.x, plat.y, plat.width, 5); // gold top hem
                });
                ctx.restore();

                // Draw Trees
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.trees.forEach(t => {
                    if (t.woodDropped) {
                        ctx.fillStyle = "#2e1c0c"; // Stump
                        ctx.fillRect(t.x + 18, 470, 14, 30);
                    } else {
                        // Wood Cedars trunk
                        ctx.fillStyle = "#5d4037";
                        ctx.fillRect(t.x + 15, t.y + 40, 20, 80);
                        // Green triangular pine top
                        ctx.fillStyle = "#1b5e20";
                        ctx.beginPath();
                        ctx.moveTo(t.x + 25, t.y);
                        ctx.lineTo(t.x - 10, t.y + 60);
                        ctx.lineTo(t.x + 60, t.y + 60);
                        ctx.closePath();
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(t.x + 25, t.y + 30);
                        ctx.lineTo(t.x - 20, t.y + 90);
                        ctx.lineTo(t.x + 70, t.y + 90);
                        ctx.closePath();
                        ctx.fill();
                    }
                });
                ctx.restore();

                // Draw Mineral Vains
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.orePoints.forEach(o => {
                    if (o.oreDropped) return;
                    ctx.fillStyle = "#455a64"; // Gray stone rock
                    ctx.fillRect(o.x, o.y, o.w, o.h);
                    ctx.fillStyle = "#ffd700"; // Glowing gold points
                    ctx.fillRect(o.x + 8, o.y + 10, 8, 8);
                    ctx.fillRect(o.x + 22, o.y + 20, 10, 8);
                });
                ctx.restore();

                // Draw Dropped items
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.droppedItems.forEach(item => {
                    if (item.collected) return;
                    
                    if (item.type === "wood") {
                        ctx.fillStyle = "#a1887f";
                        ctx.fillRect(item.x, item.y, 25, 12);
                    } else {
                        ctx.fillStyle = "#ffd700";
                        ctx.beginPath();
                        ctx.arc(item.x, item.y, 8, 0, Math.PI*2);
                        ctx.fill();
                    }
                });
                ctx.restore();

                // Enemies
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.enemies.forEach(e => {
                    if (e.hp <= 0) return;
                    
                    ctx.fillStyle = e.type === "wolf" ? "#546e7a" : "#3e2723";
                    ctx.fillRect(e.x, e.y, e.width, e.height);
                    ctx.fillStyle = "#d32f2f"; // glowing beast eyes
                    ctx.fillRect(e.x + (e.dir > 0 ? e.width - 6 : 2), e.y + 8, 4, 4);
                });
                ctx.restore();

                // Draw Temple Blueprint & Construction Stages
                ctx.save();
                ctx.translate(-camaraX, 0);
                let bx = 2450;
                let by = 280;
                
                // Temple Outline frame
                ctx.strokeStyle = "rgba(255,255,255,0.18)";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(bx, by, 320, 220);

                // Stage 1: Foundations (Marble steps)
                if (this.buildProgress >= 1) {
                    ctx.fillStyle = "#eceff1";
                    ctx.fillRect(bx + 10, by + 190, 300, 30);
                    ctx.fillRect(bx + 30, by + 165, 260, 25);
                }
                // Stage 2: Columns (Solomon-style pillars)
                if (this.buildProgress >= 2) {
                    ctx.fillStyle = "#ffd700"; // Gold pillars
                    ctx.fillRect(bx + 50, by + 50, 18, 115);
                    ctx.fillRect(bx + 110, by + 50, 18, 115);
                    ctx.fillRect(bx + 190, by + 50, 18, 115);
                    ctx.fillRect(bx + 250, by + 50, 18, 115);
                }
                // Stage 3: Roof Architecture
                if (this.buildProgress >= 3) {
                    ctx.fillStyle = "#b0bec5";
                    ctx.beginPath();
                    ctx.moveTo(bx + 30, by + 50);
                    ctx.lineTo(bx + 160, by + 5);
                    ctx.lineTo(bx + 290, by + 50);
                    ctx.closePath();
                    ctx.fill();
                }
                // Stage 4: Holy of Holies Golden Veil & Finished highlights
                if (this.buildProgress >= 4) {
                    ctx.fillStyle = "rgba(255, 235, 59, 0.4)";
                    ctx.fillRect(bx + 75, by + 65, 170, 100); // glowing interior
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "italic 11px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("TEMPLO DE NEFI", bx + 160, by - 15);
                }
                ctx.restore();

                // GATHERING HUD PANEL
                ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                ctx.fillRect(400, 20, 224, 45);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 11px Outfit";
                ctx.fillText(`Cedro: ${this.woodCount}/${this.maxWood} 🌲`, 415, 45);
                ctx.fillText(`Metal: ${this.oreCount}/${this.maxOre} 💎`, 520, 45);

                // Builder instruction prompt
                if (game.player.x > 2350 && this.buildProgress < 4) {
                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 13px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("Presiona C (o pulsa abajo) para EDIFICAR el Templo", 2610 - camaraX, by - 30);
                }
            }
        },

        // LEVEL 3: Jacob's Sermon (Defend Jacob & Gather Isaiah Scrolls)
        {
            id: 3,
            name: "El Sermón de Jacob: Oposición en Todas las Cosas",
            desc: "Defiende a tu hermano Jacob mientras enseña la ley, y recupera los pergaminos sagrados de Isaías.",
            maxScroll: 1024,
            
            // Level introduction data
            introTitle: "El Sermón de Jacob",
            introText: "Jacob es consagrado por Nefi como sacerdote y enseña al pueblo verdades eternas sobre el albedrío, la caída y la redención del Salvador. Sin embargo, guerreros lamanitas hostiles intentan irrumpir y perturbar el sermón. Defiende las gradas del templo y recupera los sagrados pergaminos de Isaías que caigan durante la revuelta.",
            introObjective: "Defiende a Jacob de los invasores y recupera al menos 3 pergaminos de Isaías antes de agotarse el tiempo.",

            init: function(game) {
                game.player.x = 250;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;

                this.timer = 50; // 50 seconds
                this.ticker = 0;

                this.scrollsCollected = 0;
                this.scrollsTarget = 3;

                // Jacob's placement
                this.jacobObj = { x: 512, y: 400, width: 45, height: 95, healthy: true, flash: 0 };
                
                // Falling script scrolls
                this.scrolls = [];
                
                // Platforms (Temple stairs & pulpit)
                this.platforms = [
                    { x: 100, y: 495, width: 824, height: 80, tipo: "suelo" },
                    // Elevated Pulpit platform in temple center
                    { x: 440, y: 430, width: 144, height: 70, tipo: "plataforma" }
                ];

                this.enemies = []; // Spawns dynamically
                this.finishTextShown = false;

                game.dialogueQueue = [
                    { char: "Jacob", text: "Porque es preciso que haya una oposición en todas las cosas. De lo contrario, no se podría realizar la justicia." },
                    { char: "Nefi", text: "¡Jacob! Los guerreros lamanitas hostiles se acercan para irrumpir en el sermón. ¡Yo defenderé las gradas!" },
                    { char: "Jacob", text: "Recupera los rollos de las escrituras de Isaías que caigan durante la agitación, pues son de valor eterno para nuestros hijos." }
                ];
                game.startDialogue();
            },

            update: function(game, gameFrame, input) {
                // Ticker countdown seconds
                this.ticker++;
                if (this.ticker >= 60) {
                    this.ticker = 0;
                    this.timer--;
                    if (this.timer < 0) this.timer = 0;
                }

                // Jacob flash animation cooldown
                if (this.jacobObj.flash > 0) this.jacobObj.flash--;

                // Dynamic scroll spawn from sky every 4 seconds
                if (gameFrame % 220 === 0 && this.scrolls.length < 3) {
                    this.scrolls.push({
                        x: 200 + Math.random() * 624,
                        y: -30,
                        velY: 2.2,
                        width: 25,
                        height: 25,
                        collected: false
                    });
                }

                // Update falling scrolls
                this.scrolls.forEach((sc, idx) => {
                    if (sc.collected) return;
                    sc.y += sc.velY;
                    if (sc.y > 500) {
                        sc.y = 475; // rest on floor
                        sc.velY = 0;
                    }

                    // Collision player pick
                    if (game.collides(game.player, sc)) {
                        sc.collected = true;
                        this.scrollsCollected++;
                        game.score += 100;
                        window.gameAudio.playCoin();
                        game.showNotification("📜 ¡Escrituras de Isaías recuperadas!");
                    }
                });

                // Spawn hostile Lamanite soldiers
                let spawnRate = this.timer < 20 ? 100 : 150;
                if (gameFrame % spawnRate === 0 && this.enemies.length < 4) {
                    let side = Math.random() > 0.5 ? 1 : -1;
                    this.enemies.push({
                        x: side > 0 ? -60 : 1084,
                        y: 420,
                        width: 50,
                        height: 80,
                        dir: -side,
                        hp: 1,
                        speed: 2.8
                    });
                }

                // Update Enemies
                this.enemies.forEach((e, idx) => {
                    if (e.hp <= 0) return;

                    // Walk towards temple center (Jacob)
                    let tx = this.jacobObj.x;
                    e.dir = e.x < tx ? 1 : -1;
                    e.x += e.speed * e.dir;

                    // Collide Jacob (attack preacher)
                    if (this.jacobObj.flash === 0 && game.collides(e, { x: this.jacobObj.x, y: this.jacobObj.y, width: this.jacobObj.width, height: this.jacobObj.height })) {
                        this.jacobObj.flash = 30;
                        window.gameAudio.playHurt();
                        game.score = Math.max(0, game.score - 100);
                        game.showNotification("💥 ¡Jacob ha sido interrumpido! Repele a los invasores.");
                        e.hp = 0; // dies on hit
                        // Push back player
                        game.playerHurt();
                    }

                    // Collide Player
                    if (game.player.inmune === 0 && game.collides(game.player, e)) {
                        game.playerHurt();
                    }

                    // Sword swing hit enemy
                    if (game.player.atacando && game.player.ataqueCooldown === 15) {
                        let swordX = game.player.direccion === "derecha" ? game.player.x + game.player.width : game.player.x - 50;
                        let hitBox = { x: swordX, y: game.player.y, width: 50, height: game.player.height };
                        if (game.collides(hitBox, e)) {
                            e.hp--;
                            window.gameAudio.playHit();
                            if (e.hp <= 0) {
                                game.score += 50;
                            }
                        }
                    }
                });

                // Check level completion
                if (this.timer <= 0 && !game.dialogueActive && !this.finishTextShown) {
                    this.finishTextShown = true;
                    let scrollsBonus = this.scrollsCollected * 150;
                    game.score += scrollsBonus;
                    
                    if (this.scrollsCollected >= this.scrollsTarget) {
                        game.completeLevel("Es preciso que haya una oposición en todas las cosas... Existen, pues, las cosas para actuar.", "2 Nefi 2:11, 26", scrollsBonus);
                    } else {
                        // Restart warning if not enough scrolls
                        game.showNotification("❌ No lograste recuperar suficientes pergaminos de Isaías. Reintentando...");
                        setTimeout(() => {
                            game.loadLevel(this.id - 1);
                        }, 2000);
                    }
                }
            },

            draw: function(ctx, game, gameFrame, camaraX) {
                // Background temple columns interior
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#080b1e");
                grad.addColorStop(0.7, "#141738");
                grad.addColorStop(1, "#251c4a");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Golden temple pillars in background
                ctx.fillStyle = "rgba(255, 215, 0, 0.08)";
                for (let i = 0; i < 6; i++) {
                    ctx.fillRect(80 + i * 180, 50, 30, 450);
                }

                // Platforms with brick textures
                this.platforms.forEach(plat => {
                    ctx.fillStyle = "#4a3c31"; // Carved stone
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

                    ctx.fillStyle = "#ffd700";
                    ctx.fillRect(plat.x, plat.y, plat.width, 6);
                });

                // Pulpit design details
                ctx.fillStyle = "#ffd700";
                ctx.fillRect(492, 445, 40, 50);

                // Draw Jacob Preacher
                ctx.save();
                if (this.jacobObj.flash > 0 && Math.floor(gameFrame / 4) % 2 === 0) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                    ctx.fillRect(this.jacobObj.x, this.jacobObj.y, this.jacobObj.width, this.jacobObj.height);
                } else {
                    // Jacob in white-purple priests robes
                    ctx.fillStyle = "#f5f5f5";
                    ctx.fillRect(this.jacobObj.x + 8, this.jacobObj.y + 20, 28, this.jacobObj.height - 20);
                    ctx.fillStyle = "#9c27b0";
                    ctx.fillRect(this.jacobObj.x + 8, this.jacobObj.y + 20, 4, this.jacobObj.height - 20);
                    ctx.fillRect(this.jacobObj.x + 32, this.jacobObj.y + 20, 4, this.jacobObj.height - 20);

                    // Head
                    ctx.fillStyle = "#ffdbac";
                    ctx.beginPath();
                    ctx.arc(this.jacobObj.x + 22, this.jacobObj.y + 12, 10, 0, Math.PI*2);
                    ctx.fill();

                    // Preacher label tag
                    ctx.fillStyle = "#ffd700";
                    ctx.font = "bold 9px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("JACOB", this.jacobObj.x + 22, this.jacobObj.y - 12);
                    
                    // Speech text floating (excerpts)
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "italic 10px Outfit";
                    if (gameFrame % 200 < 100) {
                        ctx.fillText('"Oposición en todas las cosas"', this.jacobObj.x + 22, this.jacobObj.y - 28);
                    } else {
                        ctx.fillText('"Los hombres son para que tengan gozo"', this.jacobObj.x + 22, this.jacobObj.y - 28);
                    }
                }
                ctx.restore();

                // Draw Scrolls
                this.scrolls.forEach(sc => {
                    if (sc.collected) return;
                    ctx.fillStyle = "#ffe082";
                    ctx.strokeStyle = "#ffb300";
                    ctx.lineWidth = 1.5;
                    ctx.fillRect(sc.x, sc.y, sc.width, sc.height);
                    ctx.strokeRect(sc.x, sc.y, sc.width, sc.height);
                    // scroll ribbon
                    ctx.fillStyle = "#d32f2f";
                    ctx.fillRect(sc.x + 10, sc.y, 5, sc.height);
                });

                // Enemies
                this.enemies.forEach(e => {
                    if (e.hp <= 0) return;
                    ctx.fillStyle = "#7f0000"; // Hostile Lamanites
                    ctx.fillRect(e.x, e.y, e.width, e.height);
                    ctx.fillStyle = "#ffdbac";
                    ctx.fillRect(e.x + 12, e.y, e.width - 24, 15);
                    ctx.fillStyle = "#263238"; // weapon shield
                    ctx.fillRect(e.x + (e.dir > 0 ? e.width - 4 : -8), e.y + 25, 12, 35);
                });

                // SERMON SCREEN HUD
                ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                ctx.fillRect(400, 20, 224, 45);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 11px Outfit";
                ctx.fillText(`Tiempo: ${this.timer} SEG ⏳`, 415, 45);
                ctx.fillText(`Escritos: ${this.scrollsCollected}/${this.scrollsTarget} 📜`, 520, 45);
            }
        },

        // LEVEL 4: The Strait and Narrow Path (Precision Platformer)
        {
            id: 4,
            name: "La Doctrina de Cristo: El Camino Estrecho y Angosto",
            desc: "Avanza por la senda de luz resplandeciente, esquiva las tentaciones de las tinieblas y alcanza la vida eterna.",
            maxScroll: 3000,
            
            // Level introduction data
            introTitle: "La Doctrina de Cristo",
            introText: "Nefi escribe sus últimas palabras en las planchas menores. Presenta una hermosa metáfora sobre el camino estrecho y angosto que conduce a la vida eterna. En esta senda de luz, debes avanzar con fe inquebrantable, deleitándote en la palabra de Cristo, y resister los dardos encendidos y las nieblas de tinieblas del adversario.",
            introObjective: "Sigue la senda dorada, esquiva los dardos de tentación y alcanza el Árbol de la Vida.",

            init: function(game) {
                game.player.x = 120;
                game.player.y = 400;
                game.score = 0;
                game.player.fe = 3;

                this.checkpoint = { x: 120, y: 400 };

                // Moving hazards: flaming arrows
                this.projectiles = [];

                // Mists of darkness clouds (hazard zones)
                this.clouds = [
                    { x: 650, y: 150, radius: 45, angle: 0, speed: 0.03 },
                    { x: 1300, y: 220, radius: 50, angle: Math.PI, speed: 0.02 },
                    { x: 1950, y: 160, radius: 45, angle: 0, speed: 0.04 }
                ];

                // Glowing golden platforms path
                this.platforms = [
                    { x: 0, y: 500, width: 350, height: 100, tipo: "suelo" },
                    // Steps going up and down
                    { x: 450, y: 420, width: 140, height: 20, tipo: "plataforma" },
                    { x: 680, y: 340, width: 140, height: 20, tipo: "plataforma" },
                    { x: 920, y: 270, width: 150, height: 20, tipo: "plataforma" },
                    { x: 1180, y: 340, width: 140, height: 20, tipo: "plataforma" },
                    { x: 1400, y: 410, width: 150, height: 20, tipo: "plataforma" },
                    { x: 1680, y: 330, width: 160, height: 20, tipo: "plataforma" },
                    { x: 1950, y: 250, width: 150, height: 20, tipo: "plataforma" },
                    { x: 2200, y: 350, width: 130, height: 20, tipo: "plataforma" },
                    // Final gate floor
                    { x: 2450, y: 480, width: 550, height: 120, tipo: "suelo" }
                ];

                this.monedas = [
                    { x: 520, y: 370, collected: false },
                    { x: 750, y: 290, collected: false },
                    { x: 990, y: 220, collected: false },
                    { x: 1470, y: 360, collected: false },
                    { x: 2020, y: 200, collected: false }
                ];

                this.enemies = []; // No standard ground enemies here, pure environmental hazards
                this.finishTextShown = false;

                game.dialogueQueue = [
                    { char: "Nefi", text: "Y ahora bien, mis amados hermanos, después de haber entrado en este estrecho y angosto camino..." },
                    { char: "Nefi", text: "Quisiera preguntar si ya se ha hecho todo. He aquí, os digo que no; porque no habéis llegado sino por la palabra de Cristo." },
                    { char: "Nefi", text: "Por tanto, debéis seguir adelante con firmeza en Cristo, deleitándoos en su palabra, y perseverar hasta el fin." }
                ];
                game.startDialogue();
            },

            update: function(game, gameFrame, input) {
                // Shoot horizontal temptation arrows from off-screen every 2 seconds
                if (gameFrame % 120 === 0) {
                    let side = Math.random() > 0.5 ? 1 : -1;
                    this.projectiles.push({
                        x: side > 0 ? game.player.x - 450 : game.player.x + 450,
                        y: 100 + Math.random() * 300,
                        velX: side * 6,
                        width: 25,
                        height: 6
                    });
                }

                // Update projectiles
                this.projectiles.forEach((p, idx) => {
                    p.x += p.velX;
                    // remove distant
                    if (Math.abs(p.x - game.player.x) > 600) {
                        this.projectiles.splice(idx, 1);
                        return;
                    }

                    // Collide player
                    if (game.player.inmune === 0 && game.collides(game.player, { x: p.x, y: p.y, width: p.width, height: p.height })) {
                        game.playerHurt();
                        this.projectiles.splice(idx, 1);
                        game.showNotification("🔥 ¡Una flecha encendida de tentación te ha golpeado!");
                    }
                });

                // Update darkness mist clouds (oscillate vertically)
                this.clouds.forEach(c => {
                    c.angle += c.speed;
                    c.yOsc = c.y + Math.sin(c.angle) * 60;

                    // Check circle-rect collision
                    let dx = (game.player.x + game.player.width/2) - c.x;
                    let dy = (game.player.y + game.player.height/2) - c.yOsc;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < c.radius + 15) {
                        // Slow down player and drain points
                        game.player.velX *= 0.5;
                        if (gameFrame % 30 === 0) {
                            game.score = Math.max(0, game.score - 10);
                            game.showNotification("🌫️ La niebla de tinieblas confunde tu camino.");
                        }
                    }
                });

                // Coin collection
                this.monedas.forEach(m => {
                    if (!m.collected && game.collides(game.player, { x: m.x - 10, y: m.y - 10, width: 20, height: 20 })) {
                        m.collected = true;
                        game.score += 50;
                        window.gameAudio.playCoin();
                    }
                });

                // Pit falls check (crucial in this high platform level)
                if (game.player.y > 576) {
                    game.player.x = this.checkpoint.x;
                    game.player.y = 300;
                    game.player.velX = 0;
                    game.player.velY = 0;
                    game.playerHurt();
                }

                // Update checkpoints on solid ground steps
                this.platforms.forEach(plat => {
                    if (plat.tipo === "plataforma" || plat.tipo === "suelo") {
                        if (game.player.grounded && game.player.x > plat.x && game.player.x < plat.x + plat.width - 20) {
                            this.checkpoint.x = game.player.x;
                            this.checkpoint.y = game.player.y;
                        }
                    }
                });

                // Level completion (reaching the Portal of Life at the end)
                if (game.player.x > 2650 && !game.dialogueActive && !this.finishTextShown) {
                    this.finishTextShown = true;
                    let finalBonus = game.player.fe * 200;
                    game.score += finalBonus;
                    game.completeLevel("Debéis seguir adelante con firmeza en Cristo, teniendo un fulgor perfecto de esperanza.", "2 Nefi 31:20", finalBonus);
                }
            },

            draw: function(ctx, game, gameFrame, camaraX) {
                // Background deep cosmos representation (spiritual glow)
                let grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                grad.addColorStop(0, "#01010a");
                grad.addColorStop(0.5, "#0b0518");
                grad.addColorStop(1, "#180c2c");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Starry sky
                ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                for(let i=0; i<15; i++) {
                    let sx = (i * 190 - camaraX * 0.1) % 1024;
                    if (sx < 0) sx += 1024;
                    ctx.fillRect(sx, (i * 93) % 400, 2, 2);
                }

                // Draw Path platforms (Glowing golden paths with paved brick road textures)
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.platforms.forEach(plat => {
                    // Shadow gold glow
                    ctx.shadowColor = "#ffd700";
                    ctx.shadowBlur = 15;
                    ctx.fillStyle = "#ffd700";
                    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                    
                    // Draw path brick textures
                    ctx.save();
                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
                    ctx.lineWidth = 1;
                    let brickW = 20;
                    let brickH = 10;
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

                    // inner core line
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(plat.x, plat.y, plat.width, 3);
                });
                ctx.restore();

                // Draw Coins
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.monedas.forEach(m => {
                    if (m.collected) return;
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowColor = "#00bfff";
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(m.x, m.y + Math.sin(gameFrame*0.1)*3, 8, 0, Math.PI*2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                });
                ctx.restore();

                // Draw Temptation projectiles
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.projectiles.forEach(p => {
                    ctx.fillStyle = "#ff5722"; // Fiery red
                    ctx.fillRect(p.x, p.y, p.width, p.height);
                    // Flame tip spark
                    ctx.fillStyle = "#ffd700";
                    ctx.fillRect(p.x + (p.velX > 0 ? p.width : -4), p.y - 2, 4, p.height + 4);
                });
                ctx.restore();

                // Draw Mist clouds
                ctx.save();
                ctx.translate(-camaraX, 0);
                this.clouds.forEach(c => {
                    let y = c.yOsc;
                    
                    // Draw multiple translucent dark circles representing cloud structure
                    ctx.fillStyle = "rgba(42, 34, 61, 0.45)";
                    ctx.beginPath();
                    ctx.arc(c.x, y, c.radius, 0, Math.PI*2);
                    ctx.arc(c.x - 20, y + 10, c.radius * 0.8, 0, Math.PI*2);
                    ctx.arc(c.x + 20, y - 10, c.radius * 0.8, 0, Math.PI*2);
                    ctx.fill();

                    // Cloud warnings text
                    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
                    ctx.font = "bold 9px Outfit";
                    ctx.textAlign = "center";
                    ctx.fillText("TINIEBLAS", c.x, y + 4);
                });
                ctx.restore();

                // Draw Portal of Life (Tree of Life mockup at the end of the level)
                ctx.save();
                ctx.translate(-camaraX, 0);
                let px = 2700;
                let py = 480;

                // Tree trunk
                ctx.fillStyle = "#4e342e";
                ctx.fillRect(px - 10, py - 110, 20, 110);

                // Glowing Tree canopy
                ctx.shadowColor = "#ffffff";
                ctx.shadowBlur = 25;
                ctx.fillStyle = "rgba(255,255,255,0.95)";
                ctx.beginPath();
                ctx.arc(px, py - 140, 50, 0, Math.PI*2);
                ctx.arc(px - 35, py - 120, 40, 0, Math.PI*2);
                ctx.arc(px + 35, py - 120, 40, 0, Math.PI*2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Glowing white fruit elements
                ctx.fillStyle = "#ffd700";
                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    ctx.arc(px + Math.sin(i * 1.05) * 30, py - 130 + Math.cos(i * 1.05) * 20, 6, 0, Math.PI*2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }
    ]
};

window.module2 = module2;
