import { renderer } from './renderer.js';

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

    draw(game) {
        renderer.draw(game);
    }
};

export { ui };
