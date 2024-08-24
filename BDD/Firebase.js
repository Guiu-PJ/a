import { firestore } from './FirebaseConfig.js'; // Importa Firestore desde firebaseConfig
import { collection, doc, setDoc, getDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

///////////////////////////////GAME///////////////////////////////
// Funci�n para guardar un juego en Firestore
    async function saveGame(game) {
        const gameData = game.toJSON(); // Convierte la instancia del juego en un objeto JSON
        const gameRef = doc(firestore, 'games', game.gameId); // Crea una referencia a la colecci�n 'games' y el documento con el gameId
    
        try {
            await setDoc(gameRef, gameData); // Guarda el objeto JSON en Firestore
            console.log('Juego guardado con �xito!');
        } catch (error) {
            console.error('Error al guardar el juego:', error);
        }
    }

///////////////////////////////PLAYER///////////////////////////////
    // Funci�n para guardar un jugador en Firestore
    async function savePlayer(player) {
        const playerData = player.toJSON(); 
        const playerRef = doc(firestore, 'player', player.playerId); // Crea una referencia a la colecci�n 'players' y el documento con el playerId
    
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
        } catch (error) {
            console.error('Error al obtener los datos de los gamemode:', error);
            return null;
        }
    }


export { saveGame, savePlayer, getPlayer, getAllGameMode };

