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

    // M�todo para generar un ID �nico para el juego
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // M�todo para agregar un jugador al juego
    addPlayer(playerName) {
        const playerId = this.generateUniqueId();
        this.players[playerId] = { name: playerName, score: 0 };
    }

    // M�todo para convertir la instancia en un objeto JSON
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
        const gameRef = doc(firestore, 'game', gameId);
        const gameDoc = await getDoc(gameRef);

        if (gameDoc.exists()) {
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
        const gameRef = doc(firestore, 'game', this.id);
        await setDoc(gameRef, this.toJSON(), { merge: true });
    }

}

export default Game;
