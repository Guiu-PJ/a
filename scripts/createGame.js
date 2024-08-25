import { getAllGameMode, saveGame } from '../BDD/Firebase.js';
import Game from '../models/Game.js'

//const text = document.getElementById('a').addEventListener('click', createGame);

//text = getAllGameMode();



async function displayGameModes() {
    const gameModes = await getAllGameMode(); // Esperar a que se resuelvan los datos
    const container = document.getElementById('a'); // Obtener el elemento <p> donde se mostrar� la lista
    container.innerHTML = ''; // Limpiar cualquier contenido previo

    if (!gameModes || gameModes.length === 0) { // Verificar si gameModes es null o est� vac�o
        container.textContent = 'No se encontraron gameModes.';
        return;
    }

    gameModes.forEach(gameMode => {
        const gameModeDiv = document.createElement('div');
        gameModeDiv.textContent = `ID: ${gameMode.id}, Nombre: ${gameMode.name}, Mode: ${gameMode.mode}`;
         gameModeDiv.addEventListener('click', async () => {
            await createGame(gameMode.id);
            window.location.href = '../index.html'; 
        });
        container.appendChild(gameModeDiv);
    });
}

async function createGame(gameModeId) {

    const gameName = prompt('Ingrese el nombre de la partida:');
    
    if (gameName) {
        // Crear una nueva instancia de Game con el nombre ingresado
        const newGame = new Game(gameModeId, gameName);

        // Guardar nueva partida en Firestore
        saveGame(newGame)
            .then(() => {
                alert('�Game creado y guardado con �xito!');
            })
            .catch(error => {
                console.error('Error al guardar la partida:', error);
                alert('Error al crear la partida.');
            });
    } else {
        alert('El nombre de la partida no puede estar vac�o.');
    }
}


// Llamar a la funci�n para obtener y mostrar los jugadores cuando se cargue la p�gina
document.addEventListener('DOMContentLoaded', displayGameModes());