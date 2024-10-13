
class Answer{
    constructor(playerId, gameId, questionId, answer) {
        this.id = this.generateUniqueId();
        this.playerId = playerId;
        this.gameId = gameId;
        this.questionId = questionId;
        this.answer = answer;
    }

    // M�todo para generar un ID �nico para el juego
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // M�todo para convertir la instancia en un objeto JSON
    toJSON() {
        return {
            id: this.id,
            playerId: this.playerId,
            gameId: this.gameId,
            questionId: this.questionId,
            answer: this.answer,
        };
    }

}

export default Answer;