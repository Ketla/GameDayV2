document.addEventListener('DOMContentLoaded', function() {
  const playerInputForm = document.getElementById('playerInputForm');
  const playerList = document.getElementById('playerList');
  let players = JSON.parse(localStorage.getItem('players')) || []; // Load players from local storage or initialize as empty array

  // Display players initially in case there are any in local storage
  displayPlayers();

  playerInputForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const playerName = document.getElementById('playerName').value;
      const eloRating = 1000; // Fixed ELO rating

      const newId = generateUniquePlayerId();

      // Create a new player object
      const newPlayer = {
        id: newId,
        name: playerName,
        rating: eloRating,
        afk: false,
        goalie: false,
        assists: 0,
        goals: 0,
        totalGoals: 0,
        totalAssists: 0,
        matchesPlayed: 0,
        draws: 0,
        wins: 0,
        losses: 0
      };

      // Add the new player to the array
      players.push(newPlayer);

      // Save players array to local storage
      localStorage.setItem('players', JSON.stringify(players));

      // Update the display
      displayPlayers();
      

      // Clear input field
      document.getElementById('playerName').value = '';

      console.log(players);
  });

  function displayPlayers() {
    const playerItems = players.map((player, index) =>
        `<li class="player-item">
            ${player.name}
            <button class="delete-btn" data-index="${index}">Delete</button>
            <input type="checkbox" class="afk-checkbox" data-index="${index}" ${player.afk ? 'checked' : ''}>
            <label for="afk-checkbox-${index}">AFK</label>
            <input type="checkbox" class="goalie-checkbox" data-index="${index}" ${player.goalie ? 'checked' : ''}>
            <label for="goalie-checkbox-${index}">Goalie</label>
        </li>`
    ).join('');

    playerList.innerHTML = `<ul class="player-list-ul">${playerItems}</ul>`;
    attachEventListeners();
    updateFooter();
}

function attachEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const afkCheckboxes = document.querySelectorAll('.afk-checkbox');
    const goalieCheckboxes = document.querySelectorAll('.goalie-checkbox');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            deletePlayer(this.getAttribute('data-index'));
        });
    });

    afkCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            toggleAFKStatus(this.getAttribute('data-index'));
        });
    });

    goalieCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            toggleGoalieStatus(this.getAttribute('data-index'));
        });
    });
}

function toggleAFKStatus(index) {
    players[index].afk = !players[index].afk;
    localStorage.setItem('players', JSON.stringify(players));
    console.log(players);
}

function toggleGoalieStatus(index) {
    players[index].goalie = !players[index].goalie;
    localStorage.setItem('players', JSON.stringify(players));
    console.log(players);
}


function deletePlayer(index) {
    let isConfirmed = confirm('Are you sure you want to delete this player?');

    if (isConfirmed) {
        players.splice(index, 1);
        localStorage.setItem('players', JSON.stringify(players));
        displayPlayers();
    }
}


function updateFooter() {
    const totalPlayersElement = document.getElementById('totalPlayers');
    totalPlayersElement.textContent = `Total Players: ${players.length}`;
}

const startGameButton = document.getElementById('startGameButton');

// Check if the button state is saved in localStorage
if (localStorage.getItem('buttonText')) {
    startGameButton.textContent = localStorage.getItem('buttonText');
}

startGameButton.addEventListener('click', function() {
    // Count the number of players who are goalies
    const numberOfGoalies = players.filter(player => player.goalie === true).length;

    if (players.length < 2) {
        alert('You need at least 2 players to start the game.');
    } else if (numberOfGoalies >= 3) {
        alert('The game cannot start with more than 2 goalies.');
    } else {
        this.textContent = 'Continue Game';
        localStorage.setItem('buttonText', 'Continue Game'); // Save the new button text to localStorage
        window.location.href = 'game.html'; // Navigate to the game page
    }
});



const clearLocalStorageButton = document.getElementById('clearLocalStorageButton');

clearLocalStorageButton.addEventListener('click', () => {
    let isConfirmed = confirm('Are you sure you want to clear local storage?');

    if (isConfirmed) {
        localStorage.removeItem('players');
        localStorage.removeItem('buttonText');
        localStorage.removeItem('team1');
        localStorage.removeItem('team2');
        localStorage.removeItem('matchFormat'); 
        playerList.innerHTML = "";
        location.reload();
    } 
    console.log(players);
});

//ID CREATION
function generateUniquePlayerId() {
    let newId;
    do {
      newId = Math.floor(Math.random() * 100001);
    } while (playerExistsWithId(newId));
    return newId;
  }
  
  function playerExistsWithId(id) {
    // Check if a player with the same ID already exists in your player list
    return players.some(player => player.id === id);
  }


});

