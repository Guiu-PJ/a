import { getGameById, getQuestionsByGameMode, getGameRef, saveAnswer } from '../BDD/Firebase.js';
import Game from '../models/Game.js';
import { onSnapshot, updateDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import Answer from '../models/Answer.js'

let questions = [], currentQuestionIndex = null, answers = [];
const gameId = sessionStorage.getItem('gameId');
let game, gameDoc, gameRef, resp = 0, numPlayers = 0;
const container = document.getElementById('a');
const containerAnswers = document.getElementById('divRespuestas');

document.addEventListener("DOMContentLoaded", async function () {
    try {
        game = await Game.getById(gameId);
        gameDoc = await getGameById(gameId);
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

        const buttonShowAnswers = document.getElementById("answers");
        if (buttonShowAnswers) {
            buttonShowAnswers.addEventListener("click", showAnswers);
        }

    } catch (error) {
        console.error('Error en la inicialización:', error);
    }
});

async function displayPlayersInGame() {
    try {
        if (game != null) {
            container.innerHTML = '';
            sessionStorage.setItem('modeId', game.modeId);
            numPlayers = Object.keys(game.players).length;
            console.log(game.players);
            for (const playerId in game.players) {
                const playerDiv = document.createElement('div');
                playerDiv.textContent = `Jugador: ${game.players[playerId].name}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.id = 'divAdmin';

                deleteButton.addEventListener('click', async () => {
                    console.log(`Botón del jugador ${game.players[playerId].name} presionado`);
                    console.log(game);
                    game.removePlayer(game.players[playerId].name);
                    console.log(game);
                    await game.save(false);
                });

                playerDiv.appendChild(deleteButton);

                container.appendChild(playerDiv);
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
            questions = await getQuestionsByGameMode(modeId);
            console.log("Preguntas: ", questions);
            // Empezar el juego mostrando la primera pregunta si existe
            if (questions.length > 0) {
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
    if (index >= 0 && index < questions.length) {
        const question = questions[index];
        showQuestion(question);
        console.log("Mostrando pregunta: " + question.question);
    } else {
        console.log('No hay más preguntas.');
    }
}
async function getAnswers() {
    if ((sessionStorage.getItem('playerName') === "admin")) {
        document.getElementById('divRespuestas').style.display = 'block';
        console.log(questions);
        answers = await Answer.getByGameAndQuestion(game.id, questions[currentQuestionIndex].id);
        console.log("respuestas = ", answers);
        return answers;
    }
}

async function showAnswers() {
    let answers = await getAnswers();
    let answerCount = {}; // Objeto para contar las respuestas
    containerAnswers.innerHTML = '';
    if ((sessionStorage.getItem('playerName') === "admin")) {
        const answerButton = document.createElement('button');
        answerButton.textContent = "Borrar";
        answerButton.addEventListener('click', () => {
            document.getElementById('divRespuestas').style.display = 'none';
        });
        containerAnswers.appendChild(answerButton);
    }
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

    // Luego mostramos las respuestas con su respectivo contador
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
                        await reloadGameDoc();
                        console.log("El juego ha comenzado.");
                        await startGame();
                    }
                }

                console.log("jugadores: " + Object.keys(data.players).length + " -> " + numPlayers);
                if (Object.keys(data.players).length != numPlayers) {
                    console.log("actualizar jugadores");
                    await reloadGameDoc();
                    displayPlayersInGame();
                }

                if (newQuestionIndex !== currentQuestionIndex) {
                    currentQuestionIndex = newQuestionIndex
                    nextQuestion(currentQuestionIndex);
                    resp = 0;
                }
            }
        }, (error) => {
            console.error('Error en el snapshot listener:', error);
        });
    }
}

async function handleNextQuestion() {
    
    try {
        if (currentQuestionIndex !== null && currentQuestionIndex < questions.length - 1) {
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

async function showQuestion(question) {
    container.innerHTML = '';
    const questionDiv = document.createElement('div');
    questionDiv.textContent = "Pregunta: " + question.question;
    container.appendChild(questionDiv);
    if (game != null) {
        const gameData = game;
        for (const playerId in gameData.players) {
            const playerButton = document.createElement('button');
            playerButton.textContent = gameData.players[playerId].name;

            playerButton.addEventListener('click', () => handlePlayerButtonClick(gameData.players[playerId], question));

            container.appendChild(playerButton);
        }
        }
    }

async function handlePlayerButtonClick(player, question) {
    if (resp == 0) {
        console.log("Jugador seleccionado: " + player.name);
        let playerId = sessionStorage.getItem('playerId') || "admin";
        resp = 1;
        const answer = new Answer(playerId, gameDoc.id, question.id, question.question, player.name);
        saveAnswer(answer)
        .then(() => {
            alert('¡Answer creada y guardada con éxito!');
        })
            .catch(error => {
                console.error('Error al guardar la pregunta:', error);
                alert('Error al crear la pregunta.');
            });
    }

}

async function reloadGameDoc() {
    //gameDoc = await getGameById(gameId);
    game = await Game.getById(gameId);
}
