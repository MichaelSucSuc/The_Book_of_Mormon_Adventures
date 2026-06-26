// Main Game Engine - Aventuras del Libro de Mormón
class GameController {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.state = "MENU"; // MENU, LOADING, JUGANDO, DIALOGO, FIN_NIVEL, FIN_MODULO, GALLERY
        this.currentModuleId = 1;
        this.currentModule = null;
        this.currentLevelIndex = 0;
        this.playerCharacter = "nefi";
        this.score = 0;
        this.totalScore = 0;
        this.gameFrame = 0;
        this.camaraX = 0;

        // Player structure
        this.player = {
            x: 150,
            y: 400,
            width: 45,
            height: 85,
            baseHeight: 85,
            speed: 8,
            velX: 0,
            velY: 0,
            jumping: false,
            grounded: false,
            agachado: false,
            atacando: false,
            ataqueCooldown: 0,
            direccion: "derecha",
            animPaso: 0,
            fe: 3,
            inmune: 0,
            hidden: false
        };

        // Environment constants
        this.gravity = 0.8;
        this.friction = 0.85;

        // Inputs
        this.input = {
            izquierda: false,
            derecha: false,
            abajo: false,
            saltar: false,
            atacar: false,
            crafting: false // Special key for building
        };

        // Dialog system
        this.dialogueQueue = [];
        this.dialogueActive = false;
        this.dialogueChar = "";
        this.dialogueText = "";
        this.dialogueIndex = 0;
        this.typewriterIndex = 0;
        this.typewriterText = "";
        this.typewriterTimer = 0;

        // Notifications
        this.notification = { text: "", timer: 0 };

        // Progress variables (All modules unlocked for testing)
        this.moduleProgress = {
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true,
            7: true,
            8: true
        };

        // Level lock status (All levels unlocked for testing)
        this.levelProgress = {
            1: [true, true, true, true],
            2: [true, true, true, true],
            3: [true, true, true, true],
            4: [true, true, true, true],
            5: [true, true, true, true],
            6: [true, true, true, true],
            7: [true, true, true, true],
            8: [true, true, true, true]
        };

        // Characters gallery data
        this.characters = [
            { id: "nefi", name: "Nefi", role: "Protagonista", desc: "Un joven fuerte y fiel que confía plenamente en el Señor. Construyó el barco y guió a su familia.", unlocked: true },
            { id: "lehi", name: "Lehí", role: "Profeta", desc: "Padre de Nefi. Guió a su familia fuera de Jerusalén siguiendo la visión de la destrucción.", unlocked: true },
            { id: "sariah", name: "Saríah", role: "Matriarca", desc: "Madre fiel de Nefi. Soportó con paciencia y fe las dificultades del desierto.", unlocked: true }
        ];

        // End of Level panel details
        this.endLevelDetails = {
            spiritualText: "",
            scriptureRef: "",
            bonusPoints: 0
        };

        this.initEvents();
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    // Adapt canvas to 16:9 strictly within dimensions
    resizeCanvas() {
        this.canvas.width = 1024;
        this.canvas.height = 576;
    }

    initEvents() {
        // Keyboard inputs
        document.addEventListener("keydown", (e) => {
            window.gameAudio.init();
            if (this.dialogueActive) {
                if (e.code === "Enter" || e.code === "KeyE") {
                    this.advanceDialogue();
                    return;
                }
            }

            if (e.code === "ArrowLeft" || e.code === "KeyA") this.input.izquierda = true;
            if (e.code === "ArrowRight" || e.code === "KeyD") this.input.derecha = true;
            if (e.code === "ArrowDown" || e.code === "KeyS") this.input.abajo = true;
            if (e.code === "KeyZ" || e.code === "Space") this.input.saltar = true;
            if (e.code === "KeyX") this.input.atacar = true;
            if (e.code === "KeyC") this.input.crafting = true;
        });

        document.addEventListener("keyup", (e) => {
            if (e.code === "ArrowLeft" || e.code === "KeyA") this.input.izquierda = false;
            if (e.code === "ArrowRight" || e.code === "KeyD") this.input.derecha = false;
            if (e.code === "ArrowDown" || e.code === "KeyS") this.input.abajo = false;
            if (e.code === "KeyZ" || e.code === "Space") this.input.saltar = false;
            if (e.code === "KeyX") this.input.atacar = false;
            if (e.code === "KeyC") this.input.crafting = false;
        });

        // Click / Touch dialogue trigger
        this.canvas.addEventListener("click", (e) => {
            window.gameAudio.init();
            if (this.dialogueActive) {
                this.advanceDialogue();
            }
        });

        // Setup mobile controls mapping
        this.bindTouchButton("btn-izq", "izquierda");
        this.bindTouchButton("btn-der", "derecha");
        this.bindTouchButton("btn-abajo", "abajo");
        this.bindTouchButton("btn-salto", "saltar");
        this.bindTouchButton("btn-ataque", "atacar");
    }

    bindTouchButton(id, actionName) {
        const btn = document.getElementById(id);
        if (!btn) return;
        
        const startHandler = (e) => {
            e.preventDefault();
            window.gameAudio.init();
            this.input[actionName] = true;
            if (actionName === "abajo") {
                // Also trigger crafting for building level
                this.input.crafting = true;
            }
        };

        const endHandler = (e) => {
            e.preventDefault();
            this.input[actionName] = false;
            if (actionName === "abajo") {
                this.input.crafting = false;
            }
        };

        btn.addEventListener("touchstart", startHandler, { passive: false });
        btn.addEventListener("touchend", endHandler, { passive: false });
        btn.addEventListener("mousedown", startHandler);
        btn.addEventListener("mouseup", endHandler);
    }

    showNotification(text) {
        this.notification.text = text;
        this.notification.timer = 180; // 3 seconds
    }

    startDialogue() {
        if (this.dialogueQueue.length > 0) {
            this.dialogueActive = true;
            this.dialogueIndex = 0;
            this.setupDialogueItem();
        }
    }

    setupDialogueItem() {
        const item = this.dialogueQueue[this.dialogueIndex];
        this.dialogueChar = item.char;
        this.dialogueText = item.text;
        this.typewriterIndex = 0;
        this.typewriterText = "";
        this.typewriterTimer = 0;
        this.autoAdvanceTimer = 0; // Reset auto-advance timer
    }

    advanceDialogue() {
        if (this.typewriterIndex < this.dialogueText.length) {
            // Speed up typewriter
            this.typewriterText = this.dialogueText;
            this.typewriterIndex = this.dialogueText.length;
            this.autoAdvanceTimer = 0;
            return;
        }

        this.dialogueIndex++;
        if (this.dialogueIndex < this.dialogueQueue.length) {
            this.setupDialogueItem();
        } else {
            this.dialogueActive = false;
        }
    }

    playerHurt() {
        this.player.fe--;
        this.player.inmune = 75;
        this.player.velY = -6;
        this.player.velX = this.player.direccion === "derecha" ? -6 : 6;
        window.gameAudio.playHurt();

        if (this.player.fe <= 0) {
            // Game Over trigger
            this.state = "GAME_OVER";
            document.getElementById("touch-layout").classList.remove("active");
            
            // Contextual Game Over Quote selection
            let quote = "Confía en el Señor, Él renovará tus fuerzas.";
            if (this.currentModuleId === 1) {
                if (this.currentLevelIndex === 0) {
                    const quotes = [
                        "¡Lamán y Lemuel murmuraron tanto en el camino que te convencieron! Recuerda: la duda quita las fuerzas. ¡Inténtalo de nuevo!",
                        "¡Los guardias de Jerusalén te atraparon antes de salir al desierto! Quizás debiste agacharte o avanzar con más sigilo.",
                        "Recuerda que tu familia te sigue. ¡Debes guiarlos con paso firme por los muros y obstáculos!"
                    ];
                    quote = quotes[Math.floor(Math.random() * quotes.length)];
                } else if (this.currentLevelIndex === 1) {
                    const quotes = [
                        "Labán se despertó de su letargo y mandó a sus soldados a arrestarte. ¡Usa las sombras oscuras presionando Abajo!",
                        "¡Los perros guardianes del palacio olieron tu miedo! Intenta moverte con más sigilo.",
                        "No intentes atacar a Labán por delante, él bloqueará todos tus golpes. ¡Búscalo por la espalda!"
                    ];
                    quote = quotes[Math.floor(Math.random() * quotes.length)];
                } else if (this.currentLevelIndex === 2) {
                    const quotes = [
                        "¡Las fieras salvajes o los rayos de la tormenta dañaron tus herramientas! Refúgiate en la cueva cuando truene.",
                        "Lamán y Lemuel te apedrearon tanto que perdiste tus materiales. ¡Ahuyéntalos con tu espada antes de que ataquen!"
                    ];
                    quote = quotes[Math.floor(Math.random() * quotes.length)];
                }
            }
            
            document.getElementById("game-over-quote").innerText = `"${quote}"`;
            document.getElementById("game-over-screen").classList.add("active");
        } else {
            // Contextual Hint & Reflection when losing a life but remaining alive
            let tip = "";
            let reflection = "";
            if (this.currentModuleId === 1) {
                if (this.currentLevelIndex === 0) {
                    const tips = [
                        { t: "Pista: Agáchate con ▼ para pasar bajo los guardias en los túneles.", r: "Reflexión: 'Ir y hacer' requiere obediencia y discreción." },
                        { t: "Pista: Calcula el salto justo al borde de los fosos de Jerusalén.", r: "Reflexión: La fe es dar el paso con valor ante lo desconocido." },
                        { t: "Pista: Ahuyenta a los burlones con tu bastón de fe usando la tecla X.", r: "Reflexión: No permitas que el desánimo o las burlas apaguen tu fe." }
                    ];
                    let choice = tips[Math.floor(Math.random() * tips.length)];
                    tip = choice.t;
                    reflection = choice.r;
                } else if (this.currentLevelIndex === 1) {
                    const tips = [
                        { t: "Pista: Usa las rocas oscuras y presiona ▼ para esconderte de las patrullas.", r: "Reflexión: En los momentos de peligro, la prudencia y el sigilo son sabios." },
                        { t: "Pista: Consigue la llave en el cofre sobre la plataforma en x = 2400.", r: "Reflexión: El Señor prepara las herramientas para cumplir Sus mandatos." },
                        { t: "Pista: No ataques a Labán de frente, golpéalo por la espalda.", r: "Reflexión: La sabiduría espiritual supera al enfrentamiento directo." }
                    ];
                    let choice = tips[Math.floor(Math.random() * tips.length)];
                    tip = choice.t;
                    reflection = choice.r;
                } else if (this.currentLevelIndex === 2) {
                    const tips = [
                        { t: "Pista: Refúgiate en la cueva a la mitad de la montaña cuando truene.", r: "Reflexión: El templo y las escrituras son refugios contra las tormentas del alma." },
                        { t: "Pista: Junta madera talando árboles y metal abriendo cofres.", r: "Reflexión: Con perseverancia y esfuerzo edificarás grandes cosas." },
                        { t: "Pista: Ahuyenta a tus hermanos enojados con tu espada antes de que te tiren piedras.", r: "Reflexión: Responde con firmeza y paz ante la agresión ajena." }
                    ];
                    let choice = tips[Math.floor(Math.random() * tips.length)];
                    tip = choice.t;
                    reflection = choice.r;
                } else {
                    tip = "Pista: Evita las olas gigantes y agáchate cuando emerja el monstruo marino.";
                    reflection = "Reflexión: Clama a Dios con fe y Él apaciguará las tempestades de tu viaje.";
                }
            }
            this.showNotification(`💡 ${tip} | ✨ ${reflection}`);
        }
    }

    retryLevel() {
        document.getElementById("game-over-screen").classList.remove("active");
        this.loadLevel(this.currentLevelIndex);
    }

    loadLevel(levelIndex) {
        this.state = "LOADING";
        this.currentLevelIndex = levelIndex;
        this.player.fe = 3;
        this.player.inmune = 0;
        this.player.velX = 0;
        this.player.velY = 0;
        this.player.agachado = false;
        this.player.height = this.player.baseHeight;
        this.camaraX = 0;

        // Hide overlay divs
        document.querySelectorAll(".overlay-screen").forEach(s => s.classList.remove("active"));
        document.getElementById("touch-layout").classList.remove("active");

        // Load specific level data dynamically
        if (!this.currentModule) {
            this.currentModule = window["module" + this.currentModuleId];
        }
        const levelData = this.currentModule.levels[levelIndex];
        this.playerCharacter = levelData.characterId || "nefi";
        levelData.init(this);

        // UI trigger loading animation
        let percent = 0;
        document.getElementById("loading-quote").innerText = `"${levelData.desc}"`;
        document.getElementById("loading-ref").innerText = `NIVEL ${levelIndex + 1}: ${levelData.name.toUpperCase()}`;
        document.getElementById("loading-screen").classList.add("active");

        const loadingInt = setInterval(() => {
            percent += 4;
            document.getElementById("loading-progress").style.width = `${percent}%`;
            if (percent >= 100) {
                clearInterval(loadingInt);
                document.getElementById("loading-screen").classList.remove("active");
                
                // Open Level Introduction window
                this.state = "INTRO";
                document.getElementById("intro-title").innerText = levelData.introTitle || "INTRODUCCIÓN";
                document.getElementById("intro-text").innerText = levelData.introText || "";
                document.getElementById("intro-objective").innerText = levelData.introObjective || "";
                document.getElementById("level-intro-screen").classList.add("active");
            }
        }, 50);
    }

    completeLevel(spiritualText, scriptureRef, bonus) {
        this.state = "FIN_NIVEL";
        this.endLevelDetails.spiritualText = spiritualText;
        this.endLevelDetails.scriptureRef = scriptureRef;
        this.endLevelDetails.bonusPoints = bonus;
        this.totalScore += this.score;

        window.gameAudio.playWin();

        // Show level completed overlay
        document.getElementById("touch-layout").classList.remove("active");
        
        document.getElementById("lvl-spiritual-text").innerText = `"${spiritualText}"`;
        document.getElementById("lvl-scripture-ref").innerText = `- ${scriptureRef}`;
        document.getElementById("lvl-bonus-value").innerText = `+${bonus} PTS`;
        document.getElementById("lvl-score-value").innerText = `${this.score} PTS`;
        
        document.getElementById("level-finish-screen").classList.add("active");
    }

    loadModule(moduleId) {
        if (!this.moduleProgress[moduleId]) {
            this.showNotification("🔒 Este módulo está bloqueado.");
            return;
        }
        window.gameAudio.playSelect();
        this.currentModuleId = moduleId;
        this.currentModule = window["module" + moduleId];
        this.showLevelSelector();
    }

    showLevelSelector() {
        this.state = "LEVEL_SELECTOR";
        document.querySelectorAll(".overlay-screen").forEach(s => s.classList.remove("active"));
        document.getElementById("touch-layout").classList.remove("active");

        const container = document.getElementById("level-buttons-container");
        container.innerHTML = ""; // Clear existing

        const levels = this.currentModule.levels;
        const progress = this.levelProgress[this.currentModuleId] || [true, false, false, false];

        levels.forEach((lvl, idx) => {
            const isUnlocked = progress[idx];
            const card = document.createElement("div");
            card.className = `level-card ${isUnlocked ? "" : "locked"}`;
            
            if (isUnlocked) {
                card.onclick = () => {
                    window.gameAudio.playSelect();
                    this.loadLevel(idx);
                };
            }

            card.innerHTML = `
                <span class="level-card-number">NIVEL ${idx + 1}</span>
                <h4 class="level-card-title">${lvl.name}</h4>
                <p class="level-card-desc">${lvl.desc}</p>
                <span class="level-card-status">${isUnlocked ? "🔓 Jugar" : "🔒 Bloqueado"}</span>
            `;
            container.appendChild(card);
        });

        document.getElementById("level-selector-title").innerText = `MÓDULO ${this.currentModuleId}: ${this.currentModule.name.split("-")[0].trim().toUpperCase()}`;
        document.getElementById("level-selector-screen").classList.add("active");
    }

    startLevelGameplay() {
        window.gameAudio.playSelect();
        document.getElementById("level-intro-screen").classList.remove("active");
        this.state = "JUGANDO";
        // Show touch controls on mobile/touch layout
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.getElementById("touch-layout").classList.add("active");
        }
    }

    nextLevel() {
        document.getElementById("level-finish-screen").classList.remove("active");
        const nextIndex = this.currentLevelIndex + 1;
        if (!this.currentModule) {
            this.currentModule = window["module" + this.currentModuleId];
        }
        if (nextIndex < this.currentModule.levels.length) {
            // Unlock next level in progress
            if (this.levelProgress[this.currentModuleId]) {
                this.levelProgress[this.currentModuleId][nextIndex] = true;
            }
            this.loadLevel(nextIndex);
        } else {
            // Module completed!
            this.completeModule();
        }
    }

    completeModule() {
        this.state = "FIN_MODULO";
        window.gameAudio.playWin();

        // Unlock next module
        const nextModuleId = this.currentModuleId + 1;
        if (nextModuleId <= 8) {
            this.moduleProgress[nextModuleId] = true;
        }

        document.getElementById("mod-total-score").innerText = `${this.totalScore} PUNTOS`;
        document.getElementById("module-finish-screen").classList.add("active");
    }

    restartModule() {
        document.getElementById("module-finish-screen").classList.remove("active");
        this.showLevelSelector();
    }

    showMenu() {
        this.state = "MENU";
        document.querySelectorAll(".overlay-screen").forEach(s => s.classList.remove("active"));
        document.getElementById("touch-layout").classList.remove("active");
        
        // Refresh lock icons on menu cards dynamically
        for (let mId = 2; mId <= 8; mId++) {
            const card = document.getElementById("card-mod-" + mId);
            if (card) {
                const badge = card.querySelector(".status-badge");
                if (this.moduleProgress[mId]) {
                    card.classList.remove("locked");
                    if (badge) {
                        badge.className = "status-badge unlocked";
                        badge.innerText = "Desbloqueado";
                    }
                } else {
                    card.classList.add("locked");
                    if (badge) {
                        badge.className = "status-badge locked-badge";
                        badge.innerText = "🔒 Bloqueado";
                    }
                }
            }
        }

        // Refresh Jacob card in gallery based on Module 2 unlock
        const jacobCard = document.getElementById("card-char-jacob");
        if (jacobCard) {
            if (this.moduleProgress[2]) {
                jacobCard.classList.remove("locked");
                const avatar = jacobCard.querySelector(".char-avatar-container");
                if (avatar) {
                    avatar.className = "char-avatar-container";
                    avatar.style.borderColor = "#9c27b0";
                    avatar.innerText = "✍️";
                }
                const label = jacobCard.querySelector("p");
                if (label) {
                    label.style.color = "#9c27b0";
                }
            } else {
                jacobCard.classList.add("locked");
                const avatar = jacobCard.querySelector(".char-avatar-container");
                if (avatar) {
                    avatar.className = "char-avatar-container locked-char";
                    avatar.style.borderColor = "#9e9e9e";
                    avatar.innerText = "🔒";
                }
                const label = jacobCard.querySelector("p");
                if (label) {
                    label.style.color = "#9e9e9e";
                }
            }
        }

        document.getElementById("main-menu").classList.add("active");
    }

    showGallery() {
        document.querySelectorAll(".overlay-screen").forEach(s => s.classList.remove("active"));
        document.getElementById("char-gallery").classList.add("active");
    }

    update() {
        this.gameFrame++;

        if (this.state === "JUGANDO") {
            this.updatePhysics();

            // Typewriter & Auto-Advance effect inside dialogues
            if (this.dialogueActive) {
                this.typewriterTimer++;
                if (this.typewriterTimer % 2 === 0 && this.typewriterIndex < this.dialogueText.length) {
                    this.typewriterText += this.dialogueText.charAt(this.typewriterIndex);
                    this.typewriterIndex++;
                    window.gameAudio.playDialogueBlip();
                }

                // Auto-advance logic: wait after typewriter finishes
                if (this.typewriterIndex >= this.dialogueText.length) {
                    this.autoAdvanceTimer = (this.autoAdvanceTimer || 0) + 1;
                    if (this.autoAdvanceTimer > 180) { // ~3 seconds at 60fps
                        this.advanceDialogue();
                    }
                } else {
                    this.autoAdvanceTimer = 0;
                }
            }

            // Update level specific code
            if (!this.currentModule) {
                this.currentModule = window["module" + this.currentModuleId];
            }
            const lvl = this.currentModule.levels[this.currentLevelIndex];
            lvl.update(this, this.gameFrame, this.input);

            // Cooldowns
            if (this.player.inmune > 0) this.player.inmune--;
            if (this.player.ataqueCooldown > 0) {
                this.player.ataqueCooldown--;
                if (this.player.ataqueCooldown < 5) this.player.atacando = false;
            }

            // Notifications
            if (this.notification.timer > 0) {
                this.notification.timer--;
            }
        }

        this.render();
        requestAnimationFrame(() => this.update());
    }

    updatePhysics() {
        // Crouch
        if (this.input.abajo) {
            if (!this.player.agachado) {
                this.player.y += this.player.baseHeight * 0.45;
                this.player.agachado = true;
            }
            this.player.height = this.player.baseHeight * 0.55;
        } else {
            if (this.player.agachado) {
                this.player.y -= this.player.baseHeight * 0.45;
                this.player.agachado = false;
            }
            this.player.height = this.player.baseHeight;
        }

        // Horizontal run - tight acceleration
        let currentSpeed = this.player.agachado ? this.player.speed * 0.4 : this.player.speed;
        let accel = this.player.agachado ? 0.4 : 1.2;

        if (this.input.derecha) {
            if (this.player.velX < currentSpeed) this.player.velX += accel;
            this.player.direccion = "derecha";
            this.player.animPaso += 0.25;
        }
        if (this.input.izquierda) {
            if (this.player.velX > -currentSpeed) this.player.velX -= accel;
            this.player.direccion = "izquierda";
            this.player.animPaso += 0.25;
        }

        // Jump with variable height control
        if (this.input.saltar && !this.player.jumping && this.player.grounded && !this.player.agachado) {
            this.player.jumping = true;
            this.player.grounded = false;
            this.player.velY = -15.5; // Jump power
            window.gameAudio.playJump();
        } else if (!this.input.saltar && this.player.velY < -3) {
            this.player.velY = -3; // cut vertical speed early when button is released
        }

        // Attack
        if (this.input.atacar && this.player.ataqueCooldown === 0) {
            this.player.atacando = true;
            this.player.ataqueCooldown = 20; // total animation frames
            window.gameAudio.playAttack();
        }

        // Apply environment physics (Tight responsive sliding)
        if (!this.input.derecha && !this.input.izquierda) {
            this.player.velX *= this.friction; // apply standard friction when sliding
        } else {
            this.player.velX *= 0.95; // low drag when actively accelerating
        }
        this.player.velY += this.gravity;
        
        this.player.x += this.player.velX;
        this.player.y += this.player.velY;

        // Level boundary clamps
        if (!this.currentModule) {
            this.currentModule = window["module" + this.currentModuleId];
        }
        const lvl = this.currentModule.levels[this.currentLevelIndex];
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > lvl.maxScroll - this.player.width) this.player.x = lvl.maxScroll - this.player.width;

        // Collisions with layout platforms
        this.player.grounded = false;
        lvl.platforms.forEach(plat => {
            if (plat.height <= 0) return; // cleared elements

            // Floor landing collision
            if (this.player.x + this.player.width - 10 > plat.x && this.player.x + 10 < plat.x + plat.width &&
                this.player.y + this.player.height >= plat.y && this.player.y + this.player.height - this.player.velY <= plat.y + 15) {
                this.player.y = plat.y - this.player.height;
                this.player.jumping = false;
                this.player.grounded = true;
                this.player.velY = 0;
            }

            // Wall horizontal blocks
            if (plat.tipo === "bloque" || plat.tipo === "muro" || plat.tipo === "puerta_cerrada") {
                if (this.player.x + this.player.width > plat.x && this.player.x < plat.x + plat.width &&
                    this.player.y + this.player.height > plat.y + 10 && this.player.y < plat.y + plat.height) {
                    if (this.player.velX > 0) this.player.x = plat.x - this.player.width;
                    if (this.player.velX < 0) this.player.x = plat.x + plat.width;
                }
            }
        });

        // Smooth camera track
        let targetCamX = this.player.x - 400;
        if (lvl && lvl.cameraTargetX !== undefined) {
            targetCamX = lvl.cameraTargetX;
        }
        this.camaraX += (targetCamX - this.camaraX) * 0.08;
        this.camaraX = Math.max(0, Math.min(this.camaraX, lvl.maxScroll - 1024));
    }

    collides(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === "JUGANDO") {
            if (!this.currentModule) {
                this.currentModule = window["module" + this.currentModuleId];
            }
            const lvl = this.currentModule.levels[this.currentLevelIndex];
            
            // Draw Level backgrounds/platforms
            lvl.draw(this.ctx, this, this.gameFrame, this.camaraX);

            // Draw player sprite
            if (this.player.inmune === 0 || Math.floor(this.gameFrame / 4) % 2 === 0) {
                this.drawPlayerSprite(this.player.x - this.camaraX, this.player.y, this.player.width, this.player.height);
            }

            // Draw Dialogue Box
            if (this.dialogueActive) {
                this.drawDialogueBox();
            }

            // Draw HUD (Score and Faith)
            if (!this.dialogueActive) {
                this.drawHUD();
            }

            // Draw Notification popups
            if (this.notification.timer > 0) {
                this.drawNotificationBox();
            }
        }
    }

    drawPlayerSprite(x, y, w, h) {
        if (this.playerCharacter === "lehi") {
            this.drawLehiSprite(x, y, w, h);
        } else {
            this.drawNefiSprite(x, y, w, h);
        }
    }

    drawNefiSprite(x, y, w, h) {
        this.ctx.save();
        
        let isLabanDisguise = false;
        if (this.currentModuleId === 1 && this.currentLevelIndex === 1 && this.currentModule && this.currentModule.levels[1] && this.currentModule.levels[1].disguised) {
            isLabanDisguise = true;
        }

        let bodyH, cabRad, cabY, torY, legsH;

        if (this.player.agachado) {
            cabRad = 11;
            cabY = y + cabRad;
            torY = cabY + cabRad;
            legsH = 5;
            bodyH = h - 22 - legsH; // fits exactly in h (46.75)
        } else {
            bodyH = h * 0.65;
            cabRad = 12;
            cabY = y + cabRad;
            torY = cabY + cabRad;
            legsH = 15;
        }

        if (isLabanDisguise) {
            // Laban red/orange robe
            this.ctx.fillStyle = "#d84315";
            this.ctx.fillRect(x + 8, torY, w - 16, bodyH);
            
            // Gold chest armor plate
            this.ctx.fillStyle = "#ffd700";
            this.ctx.fillRect(x + 10, torY + 4, w - 20, bodyH * 0.6);
            
            // Skin Head
            this.ctx.fillStyle = "#ffdbac";
            this.ctx.beginPath();
            this.ctx.arc(x + w/2, cabY, cabRad, 0, Math.PI*2);
            this.ctx.fill();
            
            // Eyes
            let eyeOffset = this.player.direccion === "derecha" ? 4 : -7;
            this.ctx.fillStyle = "#ffffff";
            this.ctx.fillRect(x + w/2 + eyeOffset, cabY - 3, 5, 4);
            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(x + w/2 + eyeOffset + (this.player.direccion === "derecha" ? 2 : 0), cabY - 2, 2, 2);
            
            // Legs walk
            this.ctx.lineWidth = 5;
            this.ctx.strokeStyle = "#ffdbac";
            let step = Math.sin(this.player.animPaso) * 12;
            if (this.player.jumping) {
                this.ctx.strokeRect(x + 12, torY + bodyH, 3, 6);
                this.ctx.strokeRect(x + w - 15, torY + bodyH, 3, 6);
            } else if (this.player.agachado) {
                this.ctx.fillStyle = "#ffdbac";
                this.ctx.fillRect(x + 8, torY + bodyH, w - 16, legsH);
            } else {
                this.ctx.beginPath();
                this.ctx.moveTo(x + 12, torY + bodyH);
                this.ctx.lineTo(x + 12 + step, torY + bodyH + 15);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x + w - 12, torY + bodyH);
                this.ctx.lineTo(x + w - 12 - step, torY + bodyH + 15);
                this.ctx.stroke();
            }

            // Draw Laban's steel sword in hand
            this.ctx.fillStyle = "#ffd700"; // gold hilt
            let swX = this.player.direccion === "derecha" ? x + w - 6 : x;
            this.ctx.fillRect(swX, torY + 4, 5, 45); // sword
            
            this.ctx.restore();
            return;
        }

        if (this.player.agachado) {
            cabRad = 11;
            cabY = y + cabRad;
            torY = cabY + cabRad;
            legsH = 5;
            bodyH = h - 22 - legsH; // fits exactly in h (46.75)
        } else {
            bodyH = h * 0.65;
            cabRad = 12;
            cabY = y + cabRad;
            torY = cabY + cabRad;
            legsH = 15;
        }

        // Robe (Blue with dark shading on the back side)
        this.ctx.fillStyle = this.player.hidden ? "rgba(10, 102, 208, 0.4)" : "#0a66d0";
        this.ctx.fillRect(x + 8, torY, w - 16, bodyH);
        
        // Robe shading/shadow
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        if (this.player.direccion === "derecha") {
            this.ctx.fillRect(x + 8, torY, (w - 16) * 0.35, bodyH);
        } else {
            this.ctx.fillRect(x + 8 + (w - 16) * 0.65, torY, (w - 16) * 0.35, bodyH);
        }

        // Gold hem
        this.ctx.fillStyle = "#ffd700";
        this.ctx.fillRect(x + 8, torY + bodyH - (this.player.agachado ? 4 : 12), w - 16, this.player.agachado ? 2 : 4);

        // Leather belt with gold buckle
        this.ctx.fillStyle = "#3e2723";
        this.ctx.fillRect(x + 6, torY + bodyH * 0.4, w - 12, this.player.agachado ? 3 : 6);
        this.ctx.fillStyle = "#ffd700";
        this.ctx.fillRect(x + w/2 - (this.player.agachado ? 3 : 4), torY + bodyH * 0.4 - 1, this.player.agachado ? 6 : 8, this.player.agachado ? 5 : 8);

        // Skin (Head)
        this.ctx.fillStyle = "#ffdbac";
        this.ctx.beginPath();
        this.ctx.arc(x + w/2, cabY, cabRad, 0, Math.PI*2);
        this.ctx.fill();

        // Hair / Bandana (Red scarf)
        this.ctx.fillStyle = "#4e342e";
        this.ctx.fillRect(x + w/2 - 12, cabY - 12, 24, this.player.agachado ? 6 : 8);
        this.ctx.fillStyle = "#d32f2f";
        this.ctx.fillRect(x + w/2 - 12, cabY - 5, 24, this.player.agachado ? 2 : 3);

        // Polished Eyes (White outer, black pupil)
        let eyeOffset = this.player.direccion === "derecha" ? (this.player.agachado ? 3 : 4) : (this.player.agachado ? -6 : -7);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(x + w/2 + eyeOffset, cabY - 3, 5, 4);
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(x + w/2 + eyeOffset + (this.player.direccion === "derecha" ? 2 : 0), cabY - 2, 2, 2);

        // Legs / walk animation
        this.ctx.lineWidth = this.player.agachado ? 3 : 5;
        this.ctx.strokeStyle = "#ffdbac";
        let step = Math.sin(this.player.animPaso) * 12;
        if (this.player.jumping) {
            this.ctx.strokeRect(x + 12, torY + bodyH, 3, 6);
            this.ctx.strokeRect(x + w - 15, torY + bodyH, 3, 6);
            // Sandals
            this.ctx.fillStyle = "#4e342e";
            this.ctx.fillRect(x + 10, torY + bodyH + 4, 7, 3);
            this.ctx.fillRect(x + w - 17, torY + bodyH + 4, 7, 3);
        } else if (this.player.agachado) {
            this.ctx.fillStyle = "#ffdbac";
            this.ctx.fillRect(x + 8, torY + bodyH, w - 16, legsH);
        } else {
            // left leg
            this.ctx.beginPath();
            this.ctx.moveTo(x + 12, torY + bodyH);
            this.ctx.lineTo(x + 12 + step, torY + bodyH + 15);
            this.ctx.stroke();
            // right leg
            this.ctx.beginPath();
            this.ctx.moveTo(x + w - 12, torY + bodyH);
            this.ctx.lineTo(x + w - 12 - step, torY + bodyH + 15);
            this.ctx.stroke();
            
            // Sandals
            this.ctx.fillStyle = "#4e342e";
            this.ctx.fillRect(x + 9 + step, torY + bodyH + 13, 8, 3);
            this.ctx.fillRect(x + w - 15 - step, torY + bodyH + 13, 8, 3);
        }

        // Sword attacking drawing
        if (this.player.atacando) {
            this.ctx.fillStyle = "#e0e0e0";
            this.ctx.strokeStyle = "#90a4ae";
            this.ctx.lineWidth = 2;
            
            if (this.player.direccion === "derecha") {
                // arm
                this.ctx.fillStyle = "#ffdbac";
                this.ctx.fillRect(x + w - 4, torY + 10, 15, 6);
                // steel blade
                this.ctx.fillStyle = "#e0e0e0";
                this.ctx.fillRect(x + w + 10, torY - 18, 6, 42);
                this.ctx.strokeRect(x + w + 10, torY - 18, 6, 42);
                // gold hilt
                this.ctx.fillStyle = "#ffd700";
                this.ctx.fillRect(x + w + 7, torY + 2, 12, 4);
            } else {
                // arm
                this.ctx.fillStyle = "#ffdbac";
                this.ctx.fillRect(x - 11, torY + 10, 15, 6);
                // steel blade
                this.ctx.fillStyle = "#e0e0e0";
                this.ctx.fillRect(x - 16, torY - 18, 6, 42);
                this.ctx.strokeRect(x - 16, torY - 18, 6, 42);
                // gold hilt
                this.ctx.fillStyle = "#ffd700";
                this.ctx.fillRect(x - 19, torY + 2, 12, 4);
            }
        } else {
            // standard arms swing
            let armOffset = Math.cos(this.player.animPaso) * 3;
            this.ctx.strokeStyle = this.player.hidden ? "rgba(10, 102, 208, 0.4)" : "#0a66d0";
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 6, torY + 8);
            this.ctx.lineTo(x + 2 + armOffset, torY + 22);
            this.ctx.moveTo(x + w - 6, torY + 8);
            this.ctx.lineTo(x + w - 2 - armOffset, torY + 22);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawLehiSprite(x, y, w, h) {
        this.ctx.save();
        let bodyH, cabRad, cabY, torY, legsH;

        if (this.player.agachado) {
            cabRad = 11;
            cabY = y + cabRad;
            torY = cabY + cabRad;
            legsH = 5;
            bodyH = h - 22 - legsH; // fits exactly in h (46.75)
        } else {
            bodyH = h * 0.65;
            cabRad = 12;
            cabY = y + cabRad;
            torY = cabY + cabRad;
            legsH = 15;
        }

        // Patriarch robe (Tan/beige with brown details)
        this.ctx.fillStyle = this.player.hidden ? "rgba(236, 239, 241, 0.4)" : "#eceff1";
        this.ctx.fillRect(x + 8, torY, w - 16, bodyH);
        
        // Robe shading
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        if (this.player.direccion === "derecha") {
            this.ctx.fillRect(x + 8, torY, (w - 16) * 0.35, bodyH);
        } else {
            this.ctx.fillRect(x + 8 + (w - 16) * 0.65, torY, (w - 16) * 0.35, bodyH);
        }

        // Brown girdle/sash
        this.ctx.fillStyle = "#8d6e63";
        this.ctx.fillRect(x + 8, torY + bodyH - (this.player.agachado ? 5 : 14), w - 16, this.player.agachado ? 3 : 5);
        this.ctx.fillStyle = "#5d4037";
        this.ctx.fillRect(x + 6, torY + bodyH * 0.4, w - 12, this.player.agachado ? 4 : 7);

        // Skin (Head)
        this.ctx.fillStyle = "#ffdbac";
        this.ctx.beginPath();
        this.ctx.arc(x + w/2, cabY, cabRad, 0, Math.PI*2);
        this.ctx.fill();

        // Long grey patriarch hair
        this.ctx.fillStyle = "#cfd8dc";
        this.ctx.fillRect(x + w/2 - 13, cabY - 11, 26, this.player.agachado ? 10 : 12);
        this.ctx.beginPath();
        this.ctx.arc(x + w/2 - 10, cabY, this.player.agachado ? 4 : 5, 0, Math.PI*2);
        this.ctx.arc(x + w/2 + 10, cabY, this.player.agachado ? 4 : 5, 0, Math.PI*2);
        this.ctx.fill();

        // Prominent white beard covering the chest
        this.ctx.fillStyle = "#ffffff";
        this.ctx.beginPath();
        this.ctx.moveTo(x + w/2 - 10, cabY + 4);
        this.ctx.quadraticCurveTo(x + w/2, cabY + (this.player.agachado ? 20 : 38), x + w/2 + 10, cabY + 4);
        this.ctx.closePath();
        this.ctx.fill();

        // Polished Eyes
        let eyeOffset = this.player.direccion === "derecha" ? (this.player.agachado ? 3 : 4) : (this.player.agachado ? -6 : -7);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(x + w/2 + eyeOffset, cabY - 3, 5, 4);
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(x + w/2 + eyeOffset + (this.player.direccion === "derecha" ? 2 : 0), cabY - 2, 2, 2);

        // Legs / walk animation
        this.ctx.lineWidth = this.player.agachado ? 3 : 5;
        this.ctx.strokeStyle = "#ffdbac";
        let step = Math.sin(this.player.animPaso) * 12;
        if (this.player.jumping) {
            this.ctx.strokeRect(x + 12, torY + bodyH, 3, 6);
            this.ctx.strokeRect(x + w - 15, torY + bodyH, 3, 6);
            // Sandals
            this.ctx.fillStyle = "#5d4037";
            this.ctx.fillRect(x + 10, torY + bodyH + 4, 7, 3);
            this.ctx.fillRect(x + w - 17, torY + bodyH + 4, 7, 3);
        } else if (this.player.agachado) {
            this.ctx.fillStyle = "#ffdbac";
            this.ctx.fillRect(x + 8, torY + bodyH, w - 16, legsH);
        } else {
            // left leg
            this.ctx.beginPath();
            this.ctx.moveTo(x + 12, torY + bodyH);
            this.ctx.lineTo(x + 12 + step, torY + bodyH + 15);
            this.ctx.stroke();
            // right leg
            this.ctx.beginPath();
            this.ctx.moveTo(x + w - 12, torY + bodyH);
            this.ctx.lineTo(x + w - 12 - step, torY + bodyH + 15);
            this.ctx.stroke();
            
            // Sandals
            this.ctx.fillStyle = "#5d4037";
            this.ctx.fillRect(x + 9 + step, torY + bodyH + 13, 8, 3);
            this.ctx.fillRect(x + w - 15 - step, torY + bodyH + 13, 8, 3);
        }

        // Wooden Staff Attacking/Prayer wave drawing
        if (this.player.atacando) {
            // Attack animation draws staff raised up high
            this.ctx.save();
            this.ctx.fillStyle = "#8d6e63"; // wood staff
            this.ctx.strokeStyle = "#5d4037";
            this.ctx.lineWidth = 1;

            let stX = this.player.direccion === "derecha" ? x + w + 4 : x - 12;
            let stY = torY - 18;

            // draw staff wood bar
            this.ctx.fillRect(stX, stY, 6, 60);
            this.ctx.strokeRect(stX, stY, 6, 60);

            // Glowing shockwave of faith / divine halo
            this.ctx.shadowColor = "#ffd700";
            this.ctx.shadowBlur = 25;
            this.ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
            this.ctx.beginPath();
            this.ctx.arc(stX + 3, stY + 5, 30, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        } else {
            // Hold staff normally in hand
            this.ctx.fillStyle = "#8d6e63";
            let stX = this.player.direccion === "derecha" ? x + w - 6 : x;
            let staffH = this.player.agachado ? 20 : 45;
            this.ctx.fillRect(stX, torY + 4, 5, staffH);
            
            // standard arms swing
            let armOffset = Math.cos(this.player.animPaso) * 3;
            this.ctx.strokeStyle = this.player.hidden ? "rgba(236, 239, 241, 0.4)" : "#eceff1";
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 6, torY + 8);
            this.ctx.lineTo(x + 2 + armOffset, torY + 22);
            this.ctx.moveTo(x + w - 6, torY + 8);
            this.ctx.lineTo(x + w - 2 - armOffset, torY + 22);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawDialogueBox() {
        this.ctx.save();
        
        // Translucent glass panel with subtle shadow glow at the top (y=20 to y=140)
        this.ctx.shadowColor = "rgba(255, 215, 0, 0.15)";
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = "rgba(12, 8, 31, 0.75)";
        this.ctx.strokeStyle = "#ffd700";
        this.ctx.lineWidth = 2.5;
        this.ctx.fillRect(80, 20, 864, 120);
        this.ctx.strokeRect(80, 20, 864, 120);

        // Reset shadow for inner elements
        this.ctx.shadowBlur = 0;

        // Circular Avatar Frame
        this.ctx.fillStyle = "#161030";
        this.ctx.strokeStyle = "#ffd700";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(150, 75, 34, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Emoji inside avatar circle
        this.ctx.font = "30px Outfit";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        
        let avatarEmoji = "💬";
        let charLower = this.dialogueChar.toLowerCase();
        if (charLower.includes("lehi") || charLower.includes("lehí")) avatarEmoji = "🧔";
        else if (charLower.includes("nefi")) avatarEmoji = "🛡️";
        else if (charLower.includes("saríah") || charLower.includes("sariah")) avatarEmoji = "🧕";
        else if (charLower.includes("sam")) avatarEmoji = "🧔";
        else if (charLower.includes("lamán") || charLower.includes("laman")) avatarEmoji = "😡";
        else if (charLower.includes("lemuel")) avatarEmoji = "😤";
        else if (charLower.includes("jacob")) avatarEmoji = "✍️";
        else if (charLower.includes("josé") || charLower.includes("jose")) avatarEmoji = "👦";
        else if (charLower.includes("zoram")) avatarEmoji = "🔑";
        else if (charLower.includes("capitán") || charLower.includes("capitan")) avatarEmoji = "💂";
        
        this.ctx.fillText(avatarEmoji, 150, 72);

        // Character name label under avatar inside the box
        this.ctx.fillStyle = "#ffd700";
        this.ctx.font = "bold 11px Outfit";
        this.ctx.fillText(this.dialogueChar.toUpperCase(), 150, 124);

        // Dialogue text (starts at y=52, fits in 120px tall box)
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "14px Outfit";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "alphabetic";
        
        // Wrap text
        let words = this.typewriterText.split(" ");
        let line = "";
        let y = 52;
        words.forEach(word => {
            let testLine = line + word + " ";
            let metrics = this.ctx.measureText(testLine);
            if (metrics.width > 680) {
                this.ctx.fillText(line, 215, y);
                line = word + " ";
                y += 24;
            } else {
                line = testLine;
            }
        });
        this.ctx.fillText(line, 215, y);

        // Advance dialogue hint
        this.ctx.fillStyle = "#b8b3d0";
        this.ctx.font = "italic 10px Outfit";
        this.ctx.textAlign = "right";
        this.ctx.fillText("Presiona Enter / E, o Clic para avanzar ➔", 920, 124);

        this.ctx.restore();
    }

    drawHUD() {
        this.ctx.save();
        if (!this.currentModule) {
            this.currentModule = window["module" + this.currentModuleId];
        }
        const lvl = this.currentModule.levels[this.currentLevelIndex];
        
        // Score/Faith HUD wrapper
        this.ctx.fillStyle = "rgba(12, 8, 31, 0.75)";
        this.ctx.strokeStyle = "rgba(255,255,255,0.08)";
        this.ctx.lineWidth = 1;
        this.ctx.fillRect(20, 20, 310, 45);
        this.ctx.strokeRect(20, 20, 310, 45);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "bold 13px Outfit";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`PUNTOS: ${this.score}`, 35, 47);

        let hearts = "";
        for(let i=0; i<this.player.fe; i++) hearts += "❤️ ";
        this.ctx.fillText(`FE: ${hearts}`, 160, 47);

        // Persistent Objective HUD Banner
        if (lvl && lvl.currentObjective) {
            this.ctx.fillStyle = "rgba(12, 8, 31, 0.85)";
            this.ctx.strokeStyle = "rgba(255, 215, 0, 0.25)";
            this.ctx.lineWidth = 1.5;
            this.ctx.fillRect(630, 20, 374, 45);
            this.ctx.strokeRect(630, 20, 374, 45);

            this.ctx.fillStyle = "#ffd700";
            this.ctx.font = "bold 9px Outfit";
            this.ctx.fillText("OBJETIVO ACTIVO", 645, 34);

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "11px Outfit";
            this.ctx.fillText(lvl.currentObjective, 645, 49);
        }

        // Floating Objective Guidance Arrow
        if (lvl && lvl.objectiveTargetX !== undefined) {
            let targetX = lvl.objectiveTargetX;
            let label = lvl.objectiveTargetLabel || "Objetivo";
            let camX = this.camaraX;
            let screenW = 1024;
            
            let pulse = Math.sin(this.gameFrame * 0.1) * 5;
            
            if (targetX > camX + screenW) {
                // Point Right
                this.ctx.fillStyle = "#ffd700";
                this.ctx.font = "bold 11px Outfit";
                this.ctx.textAlign = "right";
                this.ctx.fillText(`${label} ➔`, 990 - pulse, 288);
            } else if (targetX < camX) {
                // Point Left
                this.ctx.fillStyle = "#ffd700";
                this.ctx.font = "bold 11px Outfit";
                this.ctx.textAlign = "left";
                this.ctx.fillText(`⬅ ${label}`, 35 + pulse, 288);
            }
        }

        this.ctx.restore();
    }

    drawNotificationBox() {
        this.ctx.save();
        this.ctx.fillStyle = "rgba(12, 8, 31, 0.9)";
        this.ctx.strokeStyle = "#00bfff";
        this.ctx.lineWidth = 1.5;
        this.ctx.fillRect(112, 80, 800, 52);
        this.ctx.strokeRect(112, 80, 800, 52);

        this.ctx.textAlign = "center";
        if (this.notification.text.includes("|")) {
            let parts = this.notification.text.split("|");
            
            // Draw Pista line
            this.ctx.fillStyle = "#ffe082"; // soft yellow/gold
            this.ctx.font = "bold 11px Outfit";
            this.ctx.fillText(parts[0].trim(), 512, 101);
            
            // Draw Reflexión line
            this.ctx.fillStyle = "#e0f7fa"; // soft cyan/white
            this.ctx.font = "italic 11px Outfit";
            this.ctx.fillText(parts[1].trim(), 512, 121);
        } else {
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 12px Outfit";
            this.ctx.fillText(this.notification.text, 512, 111);
        }
        
        this.ctx.restore();
    }
}

// Global initialization
window.addEventListener("load", () => {
    const game = new GameController();
    window.game = game;
    game.showMenu();
    game.update();
});
