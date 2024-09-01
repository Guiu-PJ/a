class Question {
    // Constructor para inicializar el objeto
    constructor(question, modeId) {
        this.id = this.generateUniqueId();
        this.question = question;
        this.modeId = modeId;
    }

    // M�todo para generar un ID �nico para el juego
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // M�todo para convertir la instancia en un objeto JSON
    toJSON() {
        return {
            id: this.id,
            question: this.question,
            modeId: this.modeId,
        };
    }
}

export default Question;
