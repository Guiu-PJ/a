import { getAllGameMode } from '../BDD/Firebase.js';

//const text = document.getElementById('a').addEventListener('click', createGame);

//text = getAllGameMode();



function displayGameModes() {
    const gameModes = getAllGameMode();
    const gameModesListElement = document.getElementById('a'); // Obtener el elemento <p> donde se mostrará la lista
    gameModesListElement.innerHTML = ''; // Limpiar cualquier contenido previo

    if (gameModes.length === 0) {
        gameModesListElement.textContent = 'No se encontraron gameModes.';
        return;
    }

    // Construir el contenido a mostrar
    const gameModesTexts = gameModes.map(gameMode => `ID: ${gameMode.id}, Nombre: ${gameMode.name}, Mode: ${gameMode.mode}`); // Ajusta esto según la estructura de tu documento
    gameModesListElement.innerHTML = gameModesTexts.join('<br>'); // Unir todos los jugadores con una línea nueva
}

// Llamar a la función para obtener y mostrar los jugadores cuando se cargue la página
document.addEventListener('DOMContentLoaded', getAllGameMode);