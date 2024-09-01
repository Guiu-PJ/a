import { getAllGameMode, saveQuestion } from '../BDD/Firebase.js';
import Question from '../models/Question.js';

//const text = document.getElementById('a').addEventListener('click', createGame);

//text = getAllGameMode();



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
            await createQuestion(gameMode.id);
            //window.location.href = '../index.html'; 
        });
        container.appendChild(gameModeDiv);
    });
}

async function createQuestion(gameModeId) {

    const question = prompt('Ingrese la pregunta:');

    if (question) {
        // Crear una nueva instancia de Game con el nombre ingresado
        const newQuestion = new Question(question, gameModeId);

        // Guardar nueva partida en Firestore
        saveQuestion(newQuestion)
            .then(() => {
                alert('¡Pregunta creada y guardada con éxito!');
            })
            .catch(error => {
                console.error('Error al guardar la pregunta:', error);
                alert('Error al crear la pregunta.');
            });
    } else {
        alert('La pregunta no puede estar vacía.');
    }
}

// Llamar a la función para obtener y mostrar los jugadores cuando se cargue la página
document.addEventListener('DOMContentLoaded', displayGameModes());