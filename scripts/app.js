import Player from '../models/Player.js';
import Game from '../models/Game.js'
import { savePlayer } from '../BDD/Firebase.js';

document.getElementById('createUser').addEventListener('click', createUser);
document.getElementById('joinGame').addEventListener('click', joinGame);

// Función para manejar la creación del usuario
function createUser() {

    const playerName = prompt('Ingrese el nombre del usuario:');
    
    if (playerName) {
        // Crear una nueva instancia de Player con el nombre ingresado
        const newPlayer = new Player(playerName);
        
        // Guardar el nuevo jugador en Firestore
        savePlayer(newPlayer)
            .then(() => {
                alert('¡Usuario creado y guardado con éxito!');
            })
            .catch(error => {
                console.error('Error al guardar el jugador:', error);
                alert('Error al crear el usuario.');
            });
    } else {
        alert('El nombre del usuario no puede estar vacío.');
    }
}

async function joinGame() {
    const gameId = prompt('Ingrese el ID de la partida:');

    if (gameId) {
        try {
            const game = await Game.getById(gameId);
            if (game != null) {
                const playerName = prompt('Ingrese su nombre para mostrar en el juego:');
                if (playerName) {
                    // Almacenar gameId y playerName en sessionStorage
                    sessionStorage.setItem('gameId', gameId);
                    sessionStorage.setItem('playerName', playerName);
                    if (playerName != "admin") {
                    game.addPlayer(playerName);
                    await game.save();
                    }   

                    window.location.href = 'views/game.html';
                } else {
                    alert('El nombre no puede estar vacío.');
                }
            } else {
                alert('ID de la partida no válido. Inténtalo de nuevo.');
            }
        } catch (error) {
            alert('Hubo un problema al unirse a la partida. Por favor, intenta de nuevo.');
            console.error('Error al unirse a la partida:', error);
        }
    } else {
        alert('El ID de la partida no puede estar vacío.');
    }
}








