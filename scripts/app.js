import Player from '../models/Player.js';
import { savePlayer } from '../BDD/Firebase.js';


document.getElementById('createUser').addEventListener('click', createUser);

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


