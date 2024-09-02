import { getGameById, getQuestionsByGameMode, getGameRef } from '../BDD/Firebase.js';
import { onSnapshot, updateDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

let preguntas = [], currentQuestionIndex = null;
const gameId = sessionStorage.getItem('gameId');
let game, gameRef;
const container = document.getElementById('a');
let adminStartGame = false;

document.addEventListener("DOMContentLoaded", async function () {
    try {
        game = await getGameById(gameId);
        gameRef = await getGameRef(gameId);

        if (game) {
            displayPlayersInGame();
            setupSnapshotListener();
        } else {
            console.error('No se pudo obtener la partida.');
        }

        const buttonStartGame = document.getElementById("startGame");
        if (buttonStartGame) {
            buttonStartGame.addEventListener("click", () => updateGameStatus("inGame"));
        }

        const buttonNextQuestion = document.getElementById("nextQuestion");
        if (buttonNextQuestion) {
            buttonNextQuestion.addEventListener("click",handleNextQuestion);
        }
    } catch (error) {
        console.error('Error en la inicialización:', error);
    }
});

async function preparingGame() {
    try {
        adminStartGame = true;
        console.log("Preparando el juego, adminStartGame:", adminStartGame);
        if (gameRef) {
            await updateDoc(gameRef, { status: "inGame" });
        }
    } catch (error) {
        console.error('Error preparando el juego:', error);
    }
}

async function displayPlayersInGame() {
    try {
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
    } catch (error) {
        console.error('Error mostrando los jugadores:', error);
    }
}

if (sessionStorage.getItem('playerName') === "admin") {
    document.getElementById('divAdmin').style.display = 'block';
} else {
    document.getElementById('divAdmin').style.display = 'none';
}

async function startGame() {
    try {
        const modeId = sessionStorage.getItem('modeId');

        if (modeId) {
            preguntas = await getQuestionsByGameMode(modeId);
            console.log("Preguntas: ", preguntas);
            // Empezar el juego mostrando la primera pregunta si existe
            if (preguntas.length > 0) {
                nextQuestion(0);
            } else {
                alert('No hay preguntas disponibles para este modo de juego.');
            }
        } else {
            alert('ID de partida no proporcionado.');
        }
    } catch (error) {
        console.error('Error iniciando el juego:', error);
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
    console.log("Configurando el listener de snapshots.");
    if (gameRef) {
        onSnapshot(gameRef, async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const newQuestionIndex = data.currentQuestionIndex;
                const newGameStatus = data.status;

                console.log("Snapshot recibido. newQuestionIndex:", newQuestionIndex, "currentQuestionIndex:", currentQuestionIndex);

                if (newGameStatus !== game.status) {
                    game.status = newGameStatus;
                    console.log("Estado del juego actualizado:", newGameStatus);

                    if (newGameStatus === "inGame") {
                        console.log("El juego ha comenzado.");
                        await startGame();
                    }
                }

                if (newQuestionIndex !== currentQuestionIndex) {
                    currentQuestionIndex = newQuestionIndex
                    nextQuestion(currentQuestionIndex);
                }
            }
        }, (error) => {
            console.error('Error en el snapshot listener:', error);
        });
    }
}

async function handleNextQuestion() {
    
    try {
        if (currentQuestionIndex !== null && currentQuestionIndex < preguntas.length - 1) {
            const newIndex = currentQuestionIndex + 1;
            await updateDoc(gameRef, { currentQuestionIndex: newIndex });
        } else {
            console.log('No hay más preguntas o el índice actual es nulo.');
        }
    } catch (error) {
        console.error('Error manejando la siguiente pregunta:', error);
    }
    
}

async function updateGameStatus(newStatus) {
    try {
        if (gameRef) {
            await updateDoc(gameRef, { status: newStatus });
        }
    } catch (error) {
        console.error('Error actualizando el estado del juego:', error);
    }
}

function showQuestion(question) {
    container.innerHTML = '';
    const questionDiv = document.createElement('div');
    questionDiv.textContent = "Pregunta: " + question;
    container.appendChild(questionDiv);
}
