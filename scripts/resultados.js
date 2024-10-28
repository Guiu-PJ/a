import { getAllGames } from '../BDD/Firebase.js';
import Answer from '../models/Answer.js'


const divGames = document.getElementById('games');
const containerAnswers = document.getElementById('divRespuestas');
let answers = [];
let count = 0;

document.addEventListener("DOMContentLoaded", async function () {
    try {
        displayGames();


    } catch (error) {
        console.error('Error en la inicialización:', error);
    }
});


async function displayGames() {
    const games = await getAllGames(); // Esperar a que se resuelvan los datos
    divGames.innerHTML = ''; // Limpiar cualquier contenido previo

    if (!games || games.length === 0) { // Verificar si gams es null o está vacío
        divGames.textContent = 'No se encontraron partidas.';
        return;
    }

    games.forEach(game => {
        const gamesDiv = document.createElement('div');
        gamesDiv.textContent = `ID: ${game.id}, Nombre: ${game.name}`;
        gamesDiv.addEventListener('click', async () => {
            showAllAnswers(game.id);
            //window.location.href = '../index.html'; 
        });
        divGames.appendChild(gamesDiv);
    });
}


async function showAllAnswers(gameId) {
    showDivAnswers();
    answers = await Answer.getByGame(gameId);
    showAnswers(count);
    console.log(answers);
}


function showDivAnswers() {
    containerAnswers.style.display = 'block';
    containerAnswers.innerHTML = '';
    const answerButton = document.createElement('button');
    answerButton.textContent = "Cerrar";
    answerButton.addEventListener('click', () => {
        document.getElementById('divRespuestas').style.display = 'none';
    });
    containerAnswers.appendChild(answerButton);

    nextAnswerButton.addEventListener('click', () => {
    });
    containerAnswers.appendChild(nextAnswerButton);

    preAnswerButton.addEventListener('click', () => {
    });
    containerAnswers.appendChild(preAnswerButton);
    
}


async function showAnswers(count) {
    let answerCount = {}; // Objeto para contar las respuestas

    // Primero contamos cuántas veces aparece cada respuesta
    answers.forEach((answer) => {
        if (answer.answer) {
            if (answerCount[answer.answer]) {
                answerCount[answer.answer]++;
            } else {
                answerCount[answer.answer] = 1;
            }
        }
    });

    // Mostramos las respuestas con su respectivo contador
    for (const [answerText, count] of Object.entries(answerCount)) {
        const answerDiv = document.createElement('div');
        if (count > 1) {
            answerDiv.textContent = `respuesta: ${answerText} x${count}`;
        } else {
            answerDiv.textContent = `respuesta: ${answerText}`;
        }
        answerDiv.id = answerText;
        containerAnswers.appendChild(answerDiv);
    }
}