const ui = {
    init(game) {
        // Main Menu
        const playBtn = document.getElementById("play-btn");
        playBtn.addEventListener("click", () => this.showScreen("character-selection"));

        // Character Selection
        this.updateCharacterSelection(game);
        const startGameBtn = document.getElementById("start-game-btn");
        startGameBtn.addEventListener("click", () => game.startGame());

        const canvas = document.getElementById("game-canvas");
        canvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            console.log("Right-click interaction at:", e.offsetX, e.offsetY);
            // Add interaction logic here
        });
    },

    showScreen(screenId) {
        const screens = document.querySelectorAll(".screen");
        screens.forEach(screen => {
            screen.style.display = screen.id === screenId ? "flex" : "none";
        });
    },

    updateCharacterSelection(game) {
        const charactersDiv = document.getElementById("characters");
        charactersDiv.innerHTML = "";
        game.state.characters.forEach(character => {
            const charDiv = document.createElement("div");
            charDiv.textContent = character.name;
            charDiv.className = "character-option";
            if (character.selected) {
                charDiv.classList.add("selected");
            }
            charDiv.addEventListener("click", () => game.selectCharacter(character.name));
            charactersDiv.appendChild(charDiv);
        });
    },

    updateGameClock(game) {
        const gameUi = document.getElementById("game-ui");
        let clockDiv = document.getElementById("game-clock");
        if (!clockDiv) {
            clockDiv = document.createElement("div");
            clockDiv.id = "game-clock";
            gameUi.appendChild(clockDiv);
        }
        const hour = String(game.state.gameTime.hour).padStart(2, '0');
        const minute = String(game.state.gameTime.minute).padStart(2, '0');
        clockDiv.textContent = `Time: ${hour}:${minute}`;
    },

    updateSanity(game) {
        const gameUi = document.getElementById("game-ui");
        let sanityDiv = document.getElementById("sanity-display");
        if (!sanityDiv) {
            sanityDiv = document.createElement("div");
            sanityDiv.id = "sanity-display";
            gameUi.appendChild(sanityDiv);
        }
        sanityDiv.textContent = `Sanity: ${Math.round(game.state.player.sanity)}`;
    },

    updateInventory(game) {
        const gameUi = document.getElementById("game-ui");
        let inventoryDiv = document.getElementById("inventory-display");
        if (!inventoryDiv) {
            inventoryDiv = document.createElement("div");
            inventoryDiv.id = "inventory-display";
            gameUi.appendChild(inventoryDiv);
        }
        inventoryDiv.innerHTML = "Inventory: ";
        game.state.player.inventory.forEach(item => {
            const itemSpan = document.createElement("span");
            itemSpan.textContent = item.name;
            inventoryDiv.appendChild(itemSpan);
        });
    },

    updateTasks(game) {
        const gameUi = document.getElementById("game-ui");
        let tasksDiv = document.getElementById("tasks-display");
        if (!tasksDiv) {
            tasksDiv = document.createElement("div");
            tasksDiv.id = "tasks-display";
            gameUi.appendChild(tasksDiv);
        }
        const player = game.state.players.find(p => p.id === "player1");
        if (player && player.task) {
            tasksDiv.textContent = `Task: ${player.task.name}`;
        } else {
            tasksDiv.textContent = "Task: None";
        }
    },

    draw(game) {
        const canvas = document.getElementById("game-canvas");
        const ctx = canvas.getContext("2d");

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw players
        game.state.players.forEach(player => {
            if (!player.isDead) {
                ctx.fillStyle = "white";
                ctx.beginPath();
                // This will need to be updated to draw each player at their own x,y coordinates
                // For now, it just draws the main player
                ctx.arc(game.state.player.x, game.state.player.y, 10, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
};

export { ui };
