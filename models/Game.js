import { getGameById, saveGameState} from '../BDD/Firebase.js';

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
            modeId: this.modeId,
            name: this.name,
            status: this.status
        };
    }

    static async getById(gameId) {
        
        const gameDoc = await getGameById(gameId);

        if (gameDoc != null) {
            const gameData = gameDoc.data();
            const game = new Game(gameData.modeId, gameData.name);
            game.id = gameId;
            game.name = gameData.name;
            game.players = gameData.players || {};
            game.currentQuestionIndex = gameData.currentQuestionIndex;
            game.status = gameData.status;
            return game;
        } else {
            return null;
        }
    }

    async save() {
        await saveGameState(this.id, this.toJSON());
    }

}

export default Game;
