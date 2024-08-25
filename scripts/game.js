import { getGameById } from '../BDD/Firebase.js';

async function displayPlayersInGame() {
    const gameId = sessionStorage.getItem('gameId');
    const playerName = sessionStorage.getItem('playerName');
    
    if (gameId) {
        const gameDoc = await getGameById(gameId);

        if (gameDoc != null) {
            const gameData = gameDoc.data();
            const container = document.getElementById('a'); 
            container.innerHTML = ''; 

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

document.addEventListener('DOMContentLoaded', displayPlayersInGame());