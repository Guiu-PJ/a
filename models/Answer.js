import { answerGameIdAndQuestionIdFirebase, answerGameIdFirebase } from '../BDD/Firebase.js';

class Answer{
    constructor(playerId, gameId, questionId, questionTxt, answer) {
        this.id = this.generateUniqueId();
        this.playerId = playerId;
        this.gameId = gameId;
        this.questionId = questionId;
        this.questionTxt = questionTxt;
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
            questionTxt: this.questionTxt,
            answer: this.answer,
        };
    }

    static async getByGameAndQuestion(gameId, questionId) {
        try {
            const querySnapshot = await answerGameIdAndQuestionIdFirebase(gameId, questionId);
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push(doc.data());  // Recoger los datos de cada documento y a�adirlos al array
            });
            return results;  // Devolver los resultados como un array
        } catch (error) {
            console.error("Error fetching documents: ", error);
            return [];
        }
    }

    static async getByGame(gameId) {
        try {
            const querySnapshot = await answerGameIdFirebase(gameId);
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push(doc.data());  // Recoger los datos de cada documento y a�adirlos al array
            });
            return results;  // Devolver los resultados como un array
        } catch (error) {
            console.error("Error fetching documents: ", error);
            return [];
        }
    }

}

export default Answer;