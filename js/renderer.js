const renderer = {
    init(game) {
        this.uiCanvas = document.createElement('canvas');
        this.uiCanvas.id = 'ui-canvas';
        this.uiCanvas.width = 800;
        this.uiCanvas.height = 600;
        document.getElementById('game-container').appendChild(this.uiCanvas);
    },

    draw(game) {
        const canvas = document.getElementById("game-canvas");
        const ctx = canvas.getContext("2d");
        const art = game.state.art;
        const map = game.state.map;
        const player = game.state.player;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "16px monospace";
        ctx.fillStyle = "white";

        // Draw map
        if (map.tiles) {
            map.tiles.forEach((row, y) => {
                row.forEach((tile, x) => {
                    const char = tile === 1 ? art.tiles.wall : art.tiles.floor;
                    ctx.fillText(char, x * 16, y * 16);
                });
            });
        }

        // Draw player
        const playerArt = art.characters.player;
        playerArt.forEach((line, y) => {
            ctx.fillText(line, player.x, player.y + y * 16);
        });
    },

    drawUi(game) {
        const ctx = this.uiCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
        ctx.font = "16px monospace";
        ctx.fillStyle = "white";

        if (game.state.currentScreen === "main-menu") {
            ctx.fillText("Murder Mystery", 350, 200);
            ctx.fillText("[Play]", 375, 250);
        } else if (game.state.currentScreen === "character-selection") {
            ctx.fillText("Choose Your Character", 325, 100);
            game.state.characters.forEach((character, index) => {
                let text = `[${character.name}]`;
                if (character.selected) {
                    text = `> ${text} <`;
                }
                ctx.fillText(text, 350, 150 + index * 20);
            });
            ctx.fillText("[Start Game]", 350, 400);
        }
    }
};

export { renderer };
