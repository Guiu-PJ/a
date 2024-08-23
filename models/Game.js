class Game {
    // Constructor para inicializar el objeto
    constructor(mode, questions) {
        this.gameId = this.generateUniqueId();
        this.players = {};
        this.currentQuestionIndex = 0;
        this.questions = questions;
        this.mode = mode;
        this.status = "waiting";
    }

    // M�todo para generar un ID �nico para el juego
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // M�todo para agregar un jugador al juego
    addPlayer(playerName) {
        const playerId = this.generateUniqueId();
        this.players[playerId] = { name: playerName, score: 0 };
    }

    // M�todo para mostrar la pregunta actual
    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    // M�todo para convertir la instancia en un objeto JSON
    toJSON() {
        return {
            gameId: this.gameId,
            players: this.players,
            currentQuestionIndex: this.currentQuestionIndex,
            questions: this.questions,
            mode: this.mode,
            status: this.status
        };
    }
}

export default Game;
