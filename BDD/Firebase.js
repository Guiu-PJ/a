import { firestore } from './FirebaseConfig.js'; // Importa Firestore desde firebaseConfig
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import GameMode from '../models/GameMode.js';

///////////////////////////////GAME///////////////////////////////
// Funci�n para guardar un juego en Firestore
    async function saveGame(game) {
        const gameData = game.toJSON(); // Convierte la instancia del juego en un objeto JSON
        const gameRef = doc(firestore, 'game', game.id); // Crea una referencia a la colecci�n 'games' y el documento con el gameId

        try {
            await setDoc(gameRef, gameData); // Guarda el objeto JSON en Firestore
            console.log('Juego guardado con �xito!');
        } catch (error) {
            console.error('Error al guardar el juego:', error);
        }
    }

    async function getGameById(gameId){
        const gameRef = doc(firestore, 'game', gameId);
        const gameDoc = await getDoc(gameRef);

        if(gameDoc.exists()){
            return gameDoc;
        }else{
            return null;
        }
    }

async function saveGameState(gameId, gameJSON, merge) {
    console.log(gameJSON);
    const gameRef = doc(firestore, 'game', gameId);
    await setDoc(gameRef, gameJSON, { merge: merge });
    }

    function getGameRef(gameId) {
        return doc(firestore, 'game', gameId);
    }

///////////////////////////////PLAYER///////////////////////////////
    // Funci�n para guardar un jugador en Firestore
    async function savePlayer(player) {
        const playerData = player.toJSON(); 
        const playerRef = doc(firestore, 'player', player.id); // Crea una referencia a la colecci�n 'players' y el documento con el playerId
    
        try {
            await setDoc(playerRef, playerData); // Guarda el objeto JSON en Firestore
            console.log('Jugador guardado con �xito!');
        } catch (error) {
            console.error('Error al guardar el jugador:', error);
        }
    }

    // Funci�n para recuperar un jugador desde Firestore
    async function getPlayer(playerId) {
        const playerRef = doc(firestore, 'player', playerId); // Crea una referencia al documento del jugador
        try {
            const docSnap = await getDoc(playerRef); // Obt�n el documento
            if (docSnap.exists()) {
                console.log('Datos del jugador:', docSnap.data());
                return docSnap.data();
            } else {
                console.log('No se encontr� el jugador.');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener el jugador:', error);
            return null;
        }
    }

    ///////////////////////////////GameMode///////////////////////////////

    async function saveGamemode(gameMode) {
        const gameModeData = gameMode.toJSON(); // Convierte la instancia del juego en un objeto JSON
        const gameModeRef = doc(firestore, 'gameMode', gameMode.id); // Crea una referencia a la colecci�n 'gameMode' y el documento con el gameModeId

        try {
            await setDoc(gameModeRef, gameModeData); // Guarda el objeto JSON en Firestore
            console.log('Modo de juego guardado con �xito!');
        } catch (error) {
            console.error('Error al guardar el modo de juego:', error);
        }
    }
    // Funci�n para recuperar todos los gameMode desde Firestore

    async function getAllGameMode() {
        const gameModeRef = collection(firestore, 'gameMode'); // Referencia a la colecci�n
        try {
            const querySnapshot = await getDocs(gameModeRef); 
            const gameModes = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                gameModes.push({id: doc.id, name: data.name, mode: data.mode})
            });
            console.log('Datos de los gamemode: ', gameModes);
            return gameModes;
        } catch (error) {
            console.error('Error al obtener los datos de los gamemode:', error);
            return null;
        }
    }
    async function getGameModeById(modeId) {
    console.log(modeId);
        const modeRef = doc(firestore, 'gameMode', modeId);
        const modeDoc = await getDoc(modeRef);

        if (modeDoc.exists()) {
            return modeDoc;
        } else {
            return null;
        }
    }

    async function saveGameModeState(gameModeId, gameModeJSON) {
        const gameModeRef = doc(firestore, 'gameMode', gameModeId);
        await setDoc(gameModeRef, gameModeJSON, { merge: true });
    }

///////////////////////////////Question///////////////////////////////

    async function saveQuestion(question) {
        const questionData = question.toJSON();
        const questionRef = doc(firestore, 'question', question.id); // Crea una referencia a la colecci�n 'question' y el documento con el id

        try {
            await setDoc(questionRef, questionData); // Guarda el objeto JSON en Firestore
            const gameMode = await GameMode.getById(question.modeId);
            console.log('gameMode = ' + gameMode);
            gameMode.addQuestion(question.id);
            await gameMode.save();
            console.log('Pregunta guardada con �xito!');
        } catch (error) {
            console.error('Error al guardar la pregunta:', error);
        }
    }

    async function getQuestionsByGameMode(gameModeId) {
        const questionsRef = collection(firestore, 'question'); // Referencia a la colecci�n 'question'
        console.log(gameModeId);
        try {
            // Filtrar las preguntas por el campo modeId
            const q = query(questionsRef, where('modeId', '==', gameModeId));

            // Ejecutar la consulta
            const querySnapshot = await getDocs(q);

            // Almacenar los datos de las preguntas
            const questions = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                questions.push({ id: doc.id, question: data.question });
            });

            console.log('Preguntas filtradas por modeId:', questions);
            return questions;
        } catch (error) {
            console.error('Error al obtener las preguntas por modeId:', error);
            return null;
        }
    }

    async function getQuestionById(questionId) {
        const questionRef = doc(firestore, 'question', questionId);
        try {
            const questionDoc = await getDoc(questionRef);
            if (questionDoc.exists()) {
                const questionData = questionDoc.data();
                return { id: questionDoc.id, question: questionData.question };
            } else {
                console.log('No se encontr� la pregunta con el ID proporcionado.');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener la pregunta:', error);
            return null;
        }
    }

///////////////////////////////Answer///////////////////////////////
async function saveAnswer(answer) {
        const answerData = answer.toJSON(); // Convierte la instancia del juego en un objeto JSON
        const answerRef = doc(firestore, 'answer', answer.id); // Crea una referencia a la colecci�n 'answer' y el documento con el id

        try {
            await setDoc(answerRef, answerData); // Guarda el objeto JSON en Firestore
            console.log('Respuesta guardada con �xito!');
        } catch (error) {
            console.error('Error al guardar la respuesta:', error);
        }
}

    async function answerGameIdAndQuestionIdFirebase(gameId, questionId) {
        try {
            const answersRef = collection(firestore, 'answer');  // Referencia a la colecci�n "answers"
            const q = query(answersRef, where("gameId", "==", gameId), where("questionId", "==", questionId));
            return getDocs(q);
        } catch (error) {
            console.error('Error al realizar la consulta de answer:', error);
        }
    }


export { saveGame, savePlayer, getPlayer, saveGamemode, getAllGameMode, getGameById, getGameRef, saveGameState, saveQuestion, getQuestionsByGameMode, getGameModeById, saveGameModeState, saveAnswer, answerGameIdAndQuestionIdFirebase };

