import { getGameById, getQuestionsByGameMode, getGameRef, saveAnswer } from '../BDD/Firebase.js';
import Game from '../models/Game.js';
import { onSnapshot, updateDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import Answer from '../models/Answer.js'
import { increment } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';


let questions = [], currentQuestionIndex = null, answers = [];
const gameId = sessionStorage.getItem('gameId');
let game, gameDoc, gameRef, numPlayers = 0;
const container = document.getElementById('a');
const containerAnswers = document.getElementById('divRespuestas');
const txtCountAnswers = document.getElementById("countAnswers");

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
            buttonNextQuestion.addEventListener("click", handleNextQuestion);
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
            console.log('1');
            container.innerHTML = '';
            sessionStorage.setItem('modeId', game.modeId);
            numPlayers = Object.keys(game.players).length;
            console.log('2');
            let playersArray;
            const storedOrder = sessionStorage.getItem('playersOrder');
            if (storedOrder) {
                // Recuperar el orden almacenado
                playersArray = JSON.parse(storedOrder);
                if (playersArray.length === 0 || true) {
                    playersArray = Object.values(game.players).sort((a, b) => {
                        return a.name.localeCompare(b.name); // Orden inicial alfabético
                    });
                    sessionStorage.setItem('playersOrder', JSON.stringify(playersArray));
                    console.log('8');
                }
                console.log('3');
            } else {
                // Generar el orden inicial y almacenarlo
                playersArray = Object.values(game.players).sort((a, b) => {
                    return a.name.localeCompare(b.name); // Orden inicial alfabético
                });
                sessionStorage.setItem('playersOrder', JSON.stringify(playersArray));
                console.log('4');
            }

            for (const player of playersArray) {
                const playerDiv = document.createElement('div');
                playerDiv.textContent = `${player.name}`;
                console.log('5');
                if (sessionStorage.getItem('playerName') === "admin") {
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Borrar';
                    deleteButton.id = 'btnBorrar';
                    console.log('6');
                    deleteButton.addEventListener('click', async () => {
                        console.log(`Botón del jugador ${player.name} presionado`);
                        game.removePlayer(player.name);
                        await game.save(false);
                    });
                    playerDiv.appendChild(deleteButton);
                }
                console.log('7');
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
            sessionStorage.setItem('questions', JSON.stringify(questions));
            console.log("Preguntas: ", questions);
            // Empezar el juego mostrando la primera pregunta si existe
            if (questions.length > 0) {
                sessionStorage.setItem('currentQuestionIndex', 0)
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
        console.log("question -> " + question);
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
        answerButton.textContent = "Cerrar";
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


function setupSnapshotListener() {
    console.log("Configurando el listener de snapshots.");
    if (gameRef) {
        onSnapshot(gameRef, async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const newQuestionIndex = parseInt(data.currentQuestionIndex, 10);
                const newGameStatus = data.status;
                //await reloadGame();

                console.log("Snapshot recibido. newQuestionIndex:", newQuestionIndex, "currentQuestionIndex:", currentQuestionIndex);

                if (newGameStatus !== game.status) {
                    game.status = newGameStatus;
                    console.log("Estado del juego actualizado:", newGameStatus);

                    if (newGameStatus === "inGame") {
                        await reloadGame();
                        console.log("El juego ha comenzado.");
                        await startGame();
                    }
                }

                currentQuestionIndex = sessionStorage.getItem('currentQuestionIndex')
                if (newQuestionIndex != currentQuestionIndex) {
                    console.log("newQuestionIndex -> " + newQuestionIndex + " currentQuestionIndex -> " + currentQuestionIndex);
                    currentQuestionIndex = parseInt(newQuestionIndex, 10);
                    sessionStorage.setItem('currentQuestionIndex', currentQuestionIndex)
                    console.log("aaaaaaaaaa -> " + sessionStorage.getItem('currentQuestionIndex'));
                    nextQuestion(currentQuestionIndex);
                    sessionStorage.setItem('resp', 0);
                }

                if (game.status == "inGame") {
                    await reloadGame();
                    txtCountAnswers.textContent = game.cont + "/" + Object.keys(data.players).length + (sessionStorage.getItem('resp') == 1 ? " -- Has respondido" : "");
                    if (!questions || questions.length === 0)
                        questions = JSON.parse(sessionStorage.getItem('questions'));
                    

                    console.log(JSON.parse(sessionStorage.getItem('questions')));
                    const question = questions[game.currentQuestionIndex];
                    showQuestion(question);

                }

                console.log("jugadores: " + Object.keys(data.players).length + " -> " + numPlayers);
                if (Object.keys(data.players).length != numPlayers) {
                    console.log("actualizar jugadores");
                    await reloadGame();
                    displayPlayersInGame();
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
            const newIndex = parseInt(currentQuestionIndex, 10)  + 1;
            await updateDoc(gameRef, { currentQuestionIndex: newIndex, cont: 0 });
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
    console.log("question -> " + currentQuestionIndex);
    container.innerHTML = '';
    const questionDiv = document.createElement('div');
    questionDiv.textContent = question.question;
    questionDiv.style.fontWeight = 'bold';
    questionDiv.style.fontSize = '24px';
    container.appendChild(questionDiv);

    if (game != null) {
        const gameData = game;
        let playersArray;

        // Recuperar el orden almacenado
        const storedOrder = sessionStorage.getItem('playersOrder');
        if (storedOrder || true) {
            playersArray = JSON.parse(storedOrder);

            playersArray = Object.values(gameData.players).sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        } else {
            // Si no hay un orden almacenado, crearlo y guardarlo
            playersArray = Object.values(gameData.players).sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            sessionStorage.setItem('playersOrder', JSON.stringify(playersArray));
        }

        // Mostrar los botones de los jugadores en el orden determinado
        if (sessionStorage.getItem('playerName') != "admin") {
            for (const player of playersArray) {
                const playerButton = document.createElement('button');
                playerButton.textContent = player.name;

                playerButton.addEventListener('click', () => handlePlayerButtonClick(player, question));

                container.appendChild(playerButton);
            }
        }
    }
}

async function handlePlayerButtonClick(player, question) {
    console.log(sessionStorage.getItem('resp'));
    if (sessionStorage.getItem('resp') == 0) {
        await reloadGame();
        console.log("Jugador seleccionado: " + player.name);
        let playerId = sessionStorage.getItem('playerId') || "admin";
        sessionStorage.setItem('resp', 1);

        // Incrementar el contador de manera atómica
        try {
            await updateDoc(gameRef, { cont: increment(1) });
        } catch (error) {
            console.error('Error al incrementar el contador:', error);
        }

        // Guardar la respuesta
        const answer = new Answer(playerId, gameDoc.id, question.id, question.question, player.name);
        saveAnswer(answer)
            .then(() => {
                alert('¡Answer creada y guardada con éxito!');
            })
            .catch(error => {
                console.error('Error al guardar la respuesta:', error);
                alert('Error al crear la respuesta.');
            });
    }
}

async function reloadGame() {
    //gameDoc = await getGameById(gameId);
    game = await Game.getById(gameId);
}
