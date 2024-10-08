class Player {
    // Constructor para inicializar el objeto
    constructor(name) {
        this.id = this.generateUniqueId();
        this.name = name;
    }

    // M�todo para generar un ID �nico para el jugador
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // M�todo para convertir la instancia en un objeto JSON
    toJSON() {
        return {
            id: this.id,
            name: this.name
        };
    }
}

export default Player;