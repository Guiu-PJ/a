class Game {
    // Constructor para inicializar el objeto
    constructor(modeId, name) {
        this.id = this.generateUniqueId();
        this.players = {};
        this.currentQuestionIndex = 0;
        this.name = name;
        this.modeId = modeId;
        this.status = "waiting";
    }

    // Método para generar un ID único para el juego
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Método para agregar un jugador al juego
    addPlayer(playerName) {
        const playerId = this.generateUniqueId();
        this.players[playerId] = { name: playerName, score: 0 };
    }

    // Método para convertir la instancia en un objeto JSON
    toJSON() {
        return {
            id: this.id,
            players: this.players,
            currentQuestionIndex: this.currentQuestionIndex,
            mode: this.mode,
            name: this.name,
            status: this.status
        };
    }
}

export default Game;
