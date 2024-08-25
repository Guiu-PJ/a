async function displayPlayersInGame() {
    const gameId = sessionStorage.getItem('gameId');
    const playerName = sessionStorage.getItem('playerName');
    
    if (gameId) {
        const gameRef = doc(firestore, 'game', gameId);
        const gameDoc = await getDoc(gameRef);

        if (gameDoc.exists()) {
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