import { getGameModeById, saveGameModeState } from '../BDD/Firebase.js';
class GameMode {
    // Constructor para inicializar el objeto
    constructor(name, mode) {
        this.id = this.generateUniqueId();
        this.name = name;
        this.mode = mode;
        this.questions = {};
    }

    // M�todo para generar un ID �nico para el juego
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // M�todo para agregar un preguntas al modo de juego
    addQuestion(questionId) {
        sessionStorage.setItem('questionId', questionId);
        this.questions[questionId] = { id: questionId };
    }

    // M�todo para convertir la instancia en un objeto JSON
    toJSON() {
        return {
            id: this.id,
            mode: this.mode,
            name: this.name,
            questions: this.questions,
        };
    }

    static async getById(modeId) {

        const modeDoc = await getGameModeById(modeId);

        if (modeDoc != null) {
            const modeData = modeDoc.data();
            const gameMode = new GameMode(modeData.name, modeData.mode);
            gameMode.id = modeId;
            gameMode.name = modeData.name;
            gameMode.questions = modeData.questions || {};
            gameMode.mode = modeData.mode;
            console.log("mode = " + gameMode);
            return gameMode;
        } else {
            return null;
        }
    }

    async save() {
        await saveGameModeState(this.id, this.toJSON());
    }

}

export default GameMode;