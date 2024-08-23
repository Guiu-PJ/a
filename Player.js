class Player {
    // Constructor para inicializar el objeto
    constructor(name) {
        this.playerId = this.generateUniqueId();
        this.name = name;
    }

    // Método para generar un ID único para el jugador
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Método para convertir la instancia en un objeto JSON
    toJSON() {
        return {
            playerId: this.playerId,
            name: this.name
        };
    }
}

export default Player;