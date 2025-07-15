import { ui } from './ui.js';

const game = {
    state: {
        players: [],
        characters: [],
        killer: null,
        gameStarted: false,
        currentScreen: "main-menu",
        tasks: [],
        map: {},
        player: {
            x: 400,
            y: 300,
            speed: 5,
            sanity: 100,
            inventory: [],
            isDead: false
        },
        gameTime: {
            hour: 12,
            minute: 0,
            day: 1
        },
        gameSpeed: 1000 // 1 second in real life = 1 minute in game
    },

    async init() {
        await this.loadData();
        ui.init(this);
    },

    async loadData() {
        const charactersPromise = fetch("data/characters.json").then(res => res.json());
        const tasksPromise = fetch("data/tasks.json").then(res => res.json());
        const mapPromise = fetch("data/map.json").then(res => res.json());

        const [characters, tasks, map] = await Promise.all([charactersPromise, tasksPromise, mapPromise]);

        this.state.characters = characters.map(c => ({ ...c, selected: false }));
        this.state.tasks = tasks;
        this.state.map = map;
    },

    selectCharacter(characterName) {
        const character = this.state.characters.find(c => c.name === characterName);
        if (character && !character.selected) {
            // Deselect previous character if a player changes their mind
            const playerIndex = this.state.players.findIndex(p => p.id === "player1"); // Assuming a single player for now
            if (playerIndex > -1) {
                const previousCharacter = this.state.characters.find(c => c.name === this.state.players[playerIndex].character.name);
                if (previousCharacter) {
                    previousCharacter.selected = false;
                }
                this.state.players.splice(playerIndex, 1);
            }

            character.selected = true;
            this.state.players.push({ id: "player1", character: character }); // Simplified for now
            console.log(`Player 1 selected ${characterName}.`);
            ui.updateCharacterSelection(this);
        } else if (character && character.selected) {
            console.log(`${characterName} is already selected.`);
        }
    },

    startGame() {
        if (this.state.players.length > 0) {
            this.selectKiller();
            this.assignTasks();
            this.state.gameStarted = true;
            ui.showScreen("in-game");
            // Display the "Alex Mitchell is Dead!" message
            const gameUi = document.getElementById("game-ui");
            const message = document.createElement("h2");
            message.textContent = "Alex Mitchell is Dead!";
            gameUi.appendChild(message);

            // Hide the message after a few seconds
            setTimeout(() => {
                message.style.display = "none";
            }, 5000);

            this.gameLoop();
            console.log("Game started!");
        } else {
            alert("Please select a character before starting the game.");
        }
    },

    assignTasks() {
        this.state.players.forEach(player => {
            if (player !== this.state.killer) {
                const randomTaskIndex = Math.floor(Math.random() * this.state.tasks.length);
                player.task = this.state.tasks[randomTaskIndex];
            }
        });
    },

    selectKiller() {
        const randomIndex = Math.floor(Math.random() * this.state.players.length);
        this.state.killer = this.state.players[randomIndex];
        console.log("The killer is:", this.state.killer.character.name);
    },

    murder(victim) {
        if (this.state.players.find(p => p.id === "player1") === this.state.killer) {
            victim.isDead = true;
            console.log(`${victim.character.name} has been murdered.`);
        }
    },

    reportBody(body) {
        console.log(`${body.character.name}'s body has been reported!`);
        this.callMeeting();
    },

    callMeeting() {
        console.log("A meeting has been called!");
        this.startVoting();
    },

    startVoting() {
        console.log("Voting has started!");
        // Simulate voting for now
        setTimeout(() => {
            const votes = {};
            this.state.players.forEach(player => {
                if (!player.isDead) {
                    const voteFor = this.state.players[Math.floor(Math.random() * this.state.players.length)];
                    if (votes[voteFor.character.name]) {
                        votes[voteFor.character.name]++;
                    } else {
                        votes[voteFor.character.name] = 1;
                    }
                }
            });
            console.log("Votes:", votes);
            this.handleVotingResult(votes);
        }, 5000);
    },

    handleVotingResult(votes) {
        let maxVotes = 0;
        let votedPlayer = null;
        for (const playerName in votes) {
            if (votes[playerName] > maxVotes) {
                maxVotes = votes[playerName];
                votedPlayer = this.state.players.find(p => p.character.name === playerName);
            }
        }

        if (votedPlayer) {
            console.log(`${votedPlayer.character.name} has been voted out.`);
            if (votedPlayer === this.state.killer) {
                console.log("The survivors win!");
                // End game
            } else {
                console.log("The killer is still at large.");
                votedPlayer.isDead = true;
            }
        } else {
            console.log("No one was voted out.");
        }
    },

    gameLoop() {
        this.updateGameTime();
        this.updateSanity();
        ui.updateGameClock(this);
        ui.updateSanity(this);
        ui.updateInventory(this);
        ui.updateTasks(this);
        ui.draw(this);
        setTimeout(() => this.gameLoop(), this.state.gameSpeed);
    },

    updateSanity() {
        // For now, sanity decreases when the player is alone.
        // This will be expanded later to include proximity to other players.
        if (this.state.players.length <= 1) {
            this.state.player.sanity -= 0.1;
            if (this.state.player.sanity < 0) {
                this.state.player.sanity = 0;
            }
        }
    },

    updateGameTime() {
        this.state.gameTime.minute++;
        if (this.state.gameTime.minute >= 60) {
            this.state.gameTime.minute = 0;
            this.state.gameTime.hour++;
        }
        if (this.state.gameTime.hour >= 24) {
            this.state.gameTime.hour = 0;
            this.state.gameTime.day++;
        }

        // Mandatory meetings
        if ((this.state.gameTime.hour === 18 || this.state.gameTime.hour === 0 || this.state.gameTime.hour === 6) && this.state.gameTime.minute === 0) {
            console.log("Mandatory meeting time!");
            this.callMeeting();
        }
        if (this.state.gameTime.hour === 12 && this.state.gameTime.minute === 0 && this.state.gameTime.day > 1) {
            console.log("Final meeting time!");
            this.callMeeting();
        }
    }
};

export { game };
