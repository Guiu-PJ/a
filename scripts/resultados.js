import { getAllGames } from '../BDD/Firebase.js';
import Answer from '../models/Answer.js'


const divGames = document.getElementById('games');
const containerAnswers = document.getElementById('divRespuestas');
let answers = [], questionsIds = [];
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
    questionsIds = [...new Set(answers.map(answer => answer.questionId))];
    console.log(questionsIds);
    console.log(answers);
    showAnswers(count);
}


function showDivAnswers() {
    containerAnswers.style.display = 'block';
    containerAnswers.innerHTML = '';

    const preAnswerButton = document.createElement('button');
    preAnswerButton.textContent = "Anterior";
    preAnswerButton.addEventListener('click', () => {
        preAnswers();
    });
    containerAnswers.appendChild(preAnswerButton);

    const answerButton = document.createElement('button');
    answerButton.textContent = "Cerrar";
    answerButton.addEventListener('click', () => {
        document.getElementById('divRespuestas').style.display = 'none';
        count = 0;
    });
    containerAnswers.appendChild(answerButton);

    const nextAnswerButton = document.createElement('button');
    nextAnswerButton.textContent = "Siguiente";
    nextAnswerButton.addEventListener('click', () => {
        nextAnswers();
    });
    containerAnswers.appendChild(nextAnswerButton);
}


async function showAnswers(count) {
    const filtredAnswersbyQuestionId = getAnswersByQuestionId(count);
    let answerCount = {}; // Objeto para contar las respuestas

    // Primero contamos cuántas veces aparece cada respuesta
    filtredAnswersbyQuestionId.forEach((answer) => {
        if (answer.answer) {
            if (answerCount[answer.answer]) {
                answerCount[answer.answer]++;
            } else {
                answerCount[answer.answer] = 1;
            }
        }
    });

    const questionDiv = document.createElement('div');
    questionDiv.textContent = `Pregunta: ${answers[0].questionTxt}`;
    questionDiv.classList.add("miniTitle");
    containerAnswers.appendChild(questionDiv);

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

function getAnswersByQuestionId(count) {
    if (count >= 0 && count < questionsIds.length) {
        const questionId = questionsIds[count]; 

        return answers.filter(respuesta => respuesta.questionId === questionId);;
    } else {
        console.error("Indice fuera de rango.");
        return [];
    }
}

function nextAnswers() {
    showDivAnswers();
    count = count + 1;
    showAnswers(count);
}
function preAnswers() {
    showDivAnswers();
    count = count - 1;
    showAnswers(count);
}

