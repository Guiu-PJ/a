import { getAllGames } from '../BDD/Firebase.js';


const divGames = document.getElementById('games');

document.addEventListener("DOMContentLoaded", async function () {
    try {
        displayGames();

        const buttonCreateGameMode = document.getElementById("createGameMode");
        if (buttonCreateGameMode) {
            buttonCreateGameMode.addEventListener("click", showDivCreateGameMode);
        }

        const buttonsubmitGameMode = document.getElementById("submitGameMode");
        if (buttonsubmitGameMode) {
            buttonsubmitGameMode.addEventListener("click", createGameMode);
        }

    } catch (error) {
        console.error('Error en la inicialización:', error);
    }
});


async function displayGames() {
    const games = await getAllGames(); // Esperar a que se resuelvan los datos
    divGames.innerHTML = ''; // Limpiar cualquier contenido previo

    if (!games || games.length === 0) { // Verificar si gameModes es null o está vacío
        divGames.textContent = 'No se encontraron partidas.';
        return;
    }

    games.forEach(game => {
        const gamesDiv = document.createElement('div');
        gamesDiv.textContent = `ID: ${game.id}, Nombre: ${game.name}`;
        gamesDiv.addEventListener('click', async () => {
            
            //window.location.href = '../index.html'; 
        });
        divGames.appendChild(gamesDiv);
    });
}
