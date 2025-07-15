import { game } from './game.js';

const keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function handleMovement() {
    const player = game.state.player;
    const killer = game.state.killer;

    if (keys["w"]) player.y -= player.speed;
    if (keys["s"]) player.y += player.speed;
    if (keys["a"]) player.x -= player.speed;
    if (keys["d"]) player.x += player.speed;

    if (killer && killer.draggedBody) {
        killer.draggedBody.x = killer.x;
        killer.draggedBody.y = killer.y;
    }
}

setInterval(handleMovement, 16); // 60fps
