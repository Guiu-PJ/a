import { firestore } from './firebaseConfig'; // Importa Firestore desde firebaseConfig
import { doc, setDoc, getDoc } from '../node_modules/firebase/firestore';

///////////////////////////////GAME///////////////////////////////
// Función para guardar un juego en Firestore
    async function saveGame(game) {
        const gameData = game.toJSON(); // Convierte la instancia del juego en un objeto JSON
        const gameRef = doc(firestore, 'games', game.gameId); // Crea una referencia a la colección 'games' y el documento con el gameId
    
        try {
            await setDoc(gameRef, gameData); // Guarda el objeto JSON en Firestore
            console.log('Juego guardado con éxito!');
        } catch (error) {
            console.error('Error al guardar el juego:', error);
        }
    }

///////////////////////////////PLAYER///////////////////////////////
    // Función para guardar un jugador en Firestore
    async function savePlayer(player) {
        const playerData = player.toJSON(); 
        const playerRef = doc(firestore, 'players', player.playerId); // Crea una referencia a la colección 'players' y el documento con el playerId
    
        try {
            await setDoc(playerRef, playerData); // Guarda el objeto JSON en Firestore
            console.log('Jugador guardado con éxito!');
        } catch (error) {
            console.error('Error al guardar el jugador:', error);
        }
    }

    // Función para recuperar un jugador desde Firestore
    async function getPlayer(playerId) {
        const playerRef = doc(firestore, 'players', playerId); // Crea una referencia al documento del jugador
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

export { saveGame, savePlayer, getPlayer };

