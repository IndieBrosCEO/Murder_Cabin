import { game } from './game.js';
import { network } from './network.js';
import './player.js';

network.connect();
game.init();
