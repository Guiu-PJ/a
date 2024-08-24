import { getAllGameMode } from '../BDD/Firebase.js';

//const text = document.getElementById('a').addEventListener('click', createGame);

//text = getAllGameMode();



async function displayGameModes() {
    const gameModes = await getAllGameMode(); // Esperar a que se resuelvan los datos
    const gameModesListElement = document.getElementById('a'); // Obtener el elemento <p> donde se mostrará la lista
    gameModesListElement.innerHTML = ''; // Limpiar cualquier contenido previo

    if (!gameModes || gameModes.length === 0) { // Verificar si gameModes es null o está vacío
        gameModesListElement.textContent = 'No se encontraron gameModes.';
        return;
    }

    gameModes.forEach(gamemOde => {
        const gameModeDiv = document.createElement('div');
        gameModeDiv.textContent = `ID: ${gameMode.id}, Nombre: ${gameMode.name}, Mode: ${gameMode.mode}`;
        container.appendChild(gameModeDiv);
    });
}

// Llamar a la función para obtener y mostrar los jugadores cuando se cargue la página
document.addEventListener('DOMContentLoaded', displayGameModes());