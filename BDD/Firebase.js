import { firestore } from './FirebaseConfig.js'; // Importa Firestore desde firebaseConfig
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import GameMode from '../models/GameMode.js';

///////////////////////////////GAME///////////////////////////////
// Función para guardar un juego en Firestore
    async function saveGame(game) {
        const gameData = game.toJSON(); // Convierte la instancia del juego en un objeto JSON
        const gameRef = doc(firestore, 'game', game.id); // Crea una referencia a la colección 'games' y el documento con el gameId

        try {
            await setDoc(gameRef, gameData); // Guarda el objeto JSON en Firestore
            console.log('Juego guardado con éxito!');
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
    console.log("aaaaaa");
    console.log(gameJSON);
    const gameRef = doc(firestore, 'game', gameId);
    await setDoc(gameRef, gameJSON, { merge: merge });
    console.log("bbbbbbb");
    }

    function getGameRef(gameId) {
        return doc(firestore, 'game', gameId);
    }

///////////////////////////////PLAYER///////////////////////////////
    // Función para guardar un jugador en Firestore
    async function savePlayer(player) {
        const playerData = player.toJSON(); 
        const playerRef = doc(firestore, 'player', player.id); // Crea una referencia a la colección 'players' y el documento con el playerId
    
        try {
            await setDoc(playerRef, playerData); // Guarda el objeto JSON en Firestore
            console.log('Jugador guardado con éxito!');
        } catch (error) {
            console.error('Error al guardar el jugador:', error);
        }
    }

    // Función para recuperar un jugador desde Firestore
    async function getPlayer(playerId) {
        const playerRef = doc(firestore, 'player', playerId); // Crea una referencia al documento del jugador
        try {
            const docSnap = await getDoc(playerRef); // Obtén el documento
            if (docSnap.exists()) {
                console.log('Datos del jugador:', docSnap.data());
                return docSnap.data();
            } else {
                console.log('No se encontró el jugador.');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener el jugador:', error);
            return null;
        }
    }

    ///////////////////////////////GameMode///////////////////////////////
    // Función para recuperar todos los gameMode desde Firestore
    async function getAllGameMode() {
        const gameModeRef = collection(firestore, 'gameMode'); // Referencia a la colección
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
        const questionRef = doc(firestore, 'question', question.id); // Crea una referencia a la colección 'question' y el documento con el id

        try {
            await setDoc(questionRef, questionData); // Guarda el objeto JSON en Firestore
            const gameMode = await GameMode.getById(question.modeId);
            console.log('gameMode = ' + gameMode);
            gameMode.addQuestion(question.id);
            await gameMode.save();
            console.log('Pregunta guardada con éxito!');
        } catch (error) {
            console.error('Error al guardar la pregunta:', error);
        }
    }

    async function getQuestionsByGameMode(gameModeId) {
        const questionsRef = collection(firestore, 'question'); // Referencia a la colección 'question'
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
                console.log('No se encontró la pregunta con el ID proporcionado.');
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
        const answerRef = doc(firestore, 'answer', answer.id); // Crea una referencia a la colección 'answer' y el documento con el id

        try {
            await setDoc(answerRef, answerData); // Guarda el objeto JSON en Firestore
            console.log('Respuesta guardada con éxito!');
        } catch (error) {
            console.error('Error al guardar la respuesta:', error);
        }
    }


export { saveGame, savePlayer, getPlayer, getAllGameMode, getGameById, getGameRef, saveGameState, saveQuestion, getQuestionsByGameMode, getGameModeById, saveGameModeState, saveAnswer };

