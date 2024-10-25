class TypeGameMode {
    // Constructor para inicializar el objeto
    constructor(name) {
        this.id = this.generateUniqueId();
        this.name = name;
    }

    // M�todo para generar un ID �nico para el juego
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

}