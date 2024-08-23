class GameMode {
    // Constructor para inicializar el objeto
    constructor(name, mode) {
        this.id = this.generateUniqueId();
        this.name = name;
        this.mode = mode;
    }

    // Método para generar un ID único para el juego
    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }