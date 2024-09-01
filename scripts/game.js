import { getGameById, getQuestionsByGameMode, getGameRef } from '../BDD/Firebase.js';
import { onSnapshot, updateDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

let preguntas = [], currentQuestionIndex = null;
const gameId = sessionStorage.getItem('gameId');
let game, gameRef;
const container = document.getElementById('a');
let adminStartGame = false;

document.addEventListener("DOMContentLoaded", async function () {
    game = await getGameById(gameId);
    gameRef = await getGameRef(gameId);
    if (game) {
        displayPlayersInGame();
        setupSnapshotListener();
    }

    const buttonStartGame = document.getElementById("startGame");
    if (buttonStartGame) {
        buttonStartGame.addEventListener("click", preparingGame);
    }

    const buttonNextQuestion = document.getElementById("nextQuestion");
    if (buttonNextQuestion) {
        buttonNextQuestion.addEventListener("click", handleNextQuestion);
    }
});

async function preparingGame() {
    adminStartGame = true;
    if (gameRef) {
        await updateDoc(gameRef, {
            currentQuestionIndex: 0
        });
    }
}

async function displayPlayersInGame() {
    if (game != null) {
        const gameDoc = game;
        if (gameDoc.exists()) {
            const gameData = gameDoc.data();
            container.innerHTML = '';
            sessionStorage.setItem('modeId', gameData.modeId);

            for (const playerId in gameData.players) {
                const playerDiv = document.createElement('div');
                playerDiv.textContent = `Jugador: ${gameData.players[playerId].name}`;
                container.appendChild(playerDiv);
            }
        } else {
            alert('No se encontró la partida.');
        }
    } else {
        alert('ID de partida no proporcionado.');
    }
}

if (sessionStorage.getItem('playerName') === "admin") {
    document.getElementById('divAdmin').style.display = 'block';
} else {
    document.getElementById('divAdmin').style.display = 'none';
}

async function startGame() {
    const modeId = sessionStorage.getItem('modeId');

    if (modeId) {
        preguntas = await getQuestionsByGameMode(modeId);
        console.log("a " + preguntas);
        // Empezar el juego mostrando la primera pregunta si existe
        if (preguntas.length > 0) {
            nextQuestion(0);
        } else {
            alert('No hay preguntas disponibles para este modo de juego.');
        }
    } else {
        alert('ID de partida no proporcionado.');
        return null;
    }
}

function nextQuestion(index) {
    if (index >= 0 && index < preguntas.length) {
        const pregunta = preguntas[index];
        showQuestion(pregunta.question);
        console.log("Mostrando pregunta: " + pregunta.question);
    } else {
        console.log('No hay más preguntas.');
    }
}

function setupSnapshotListener() {
    if (gameRef) {
        onSnapshot(gameRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const newQuestionIndex = data.currentQuestionIndex;

                if (newQuestionIndex !== currentQuestionIndex) {
                    currentQuestionIndex = newQuestionIndex;
                    nextQuestion(currentQuestionIndex);
                }

                if (data.status === "waiting" && adminStartGame) {
                    startGame();
                    updateGameStatus("inGame");
                }
            }
        });
    }
}

async function handleNextQuestion() {
    if (currentQuestionIndex !== null && currentQuestionIndex < preguntas.length - 1) {
        const newIndex = currentQuestionIndex + 1;

        await updateDoc(gameRef, {
            currentQuestionIndex: newIndex
        });
    } else {
        console.log('No hay más preguntas o el índice actual es nulo.');
    }
}

async function updateGameStatus(newStatus) {
    if (gameRef) {
        await updateDoc(gameRef, {
            status: newStatus
        });
    }
}

function showQuestion(question) {
    container.innerHTML = '';
    const questionDiv = document.createElement('div');
    questionDiv.textContent = "Pregunta: " + question;
    container.appendChild(questionDiv);
}
