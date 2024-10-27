import { saveGamemode, getAllGameMode, saveGame } from '../BDD/Firebase.js';
import Game from '../models/Game.js'
import GameMode from '../models/GameMode.js'


const divCreateGameMode = document.getElementById('divCreateGameMode');
const spinnerCreateGameMode = document.getElementById('spinnerCreateGameMode');
const opciones = ["Quien mas probable"];
document.addEventListener("DOMContentLoaded", async function () {
        try {
            displayGameModes();

            const buttonCreateGameMode = document.getElementById("createGameMode");
            if (buttonCreateGameMode) {
                buttonCreateGameMode.addEventListener("click", showDivCreateGameMode);
            }

            const buttonsubmitGameMode = document.getElementById("submitGameMode");
            if (buttonsubmitGameMode) {
                buttonsubmitGameMode.addEventListener("click", createGameMode);
            }

        } catch (error) {
            console.error('Error en la inicialización:', error);
        }
});

async function displayGameModes() {
    const gameModes = await getAllGameMode(); // Esperar a que se resuelvan los datos
    const container = document.getElementById('a'); // Obtener el elemento <p> donde se mostrará la lista
    container.innerHTML = ''; // Limpiar cualquier contenido previo

    if (!gameModes || gameModes.length === 0) { // Verificar si gameModes es null o está vacío
        container.textContent = 'No se encontraron gameModes.';
        return;
    }

    gameModes.forEach(gameMode => {
        const gameModeDiv = document.createElement('div');
        gameModeDiv.textContent = `ID: ${gameMode.id}, Nombre: ${gameMode.name}, Mode: ${gameMode.mode}`;
         gameModeDiv.addEventListener('click', async () => {
            await createGame(gameMode.id);
            //window.location.href = '../index.html'; 
        });
        container.appendChild(gameModeDiv);
    });
    }

function showDivCreateGameMode() {
    spinnerCreateGameMode.innerHTML = "";

    opciones.forEach(opcion => {
        const nuevaOpcion = document.createElement("option");
        nuevaOpcion.value = opcion;
        nuevaOpcion.textContent = opcion;
        spinnerCreateGameMode.appendChild(nuevaOpcion);
    });

    divCreateGameMode.style.display = 'block';
}

async function createGame(gameModeId) {

    const gameName = prompt('Ingrese el nombre de la partida:');
    
    if (gameName) {
        // Crear una nueva instancia de Game con el nombre ingresado
        const newGame = new Game(gameModeId, gameName);

        // Guardar nueva partida en Firestore
        saveGame(newGame)
            .then(() => {
                alert('¡Game creado y guardado con éxito!');
            })
            .catch(error => {
                console.error('Error al guardar la partida:', error);
                alert('Error al crear la partida.');
            });
    } else {
        alert('El nombre de la partida no puede estar vacío.');
    }
}

async function createGameMode() {

    const nameGameMode = document.getElementById('nameInput').value;
    const typeGamemode = document.getElementById('spinnerCreateGameMode').value;

    if (nameGameMode && typeGamemode) {
        // Crear una nueva instancia de Game con el nombre ingresado
        const newGameMode = new GameMode(nameGameMode, typeGamemode);

        // Guardar nueva partida en Firestore
        saveGamemode(newGameMode)
            .then(() => {
                alert('¡GameMode creado y guardado con éxito!');
            })
            .catch(error => {
                console.error('Error al guardar el gameMode:', error);
                alert('Error al crear el gameMode.');
            });
    } else {
        alert('El nombre y/o el tipo no pueden estar vacios.');
    }
}


