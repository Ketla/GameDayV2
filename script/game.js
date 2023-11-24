document.addEventListener('DOMContentLoaded', function() {
  // Retrieve players array from localStorage
  let players = JSON.parse(localStorage.getItem('players')) || [];

  // Now you can use the players array for game logic
  console.log(players); // Example: Log the players to the console
  // Additional game logic goes here

  document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = 'index.html';
    
});

const allPlayers = JSON.parse(localStorage.getItem('players')) || [];
const activePlayers = allPlayers.filter(player => !player.afk);
const afkPlayers = allPlayers.filter(player => player.afk);

const matchFormatSelect = document.getElementById('matchFormatSelect');
const playersPlayingSpan = document.getElementById('playersPlaying');
const playersBenchedSpan = document.getElementById('playersBenched');
const afkPlayersSpan = document.getElementById('afkPlayers');

function populateMatchFormats(playerCount) {
  const savedFormat = localStorage.getItem('matchFormat');  
  matchFormatSelect.innerHTML = '';
    for (let i = 1; i <= playerCount / 2; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i}v${i}`;
        matchFormatSelect.appendChild(option);

        // Set the option as selected if it matches the saved format
        if (i.toString() === savedFormat) {
          option.selected = true;
      }
  }

  // If no format was previously saved, select the last option
  if (!savedFormat) {
      matchFormatSelect.value = Math.floor(playerCount / 2);
  }
}

function updateMatchInfo() {
  const format = parseInt(matchFormatSelect.value, 10);
  const totalPlayers = format * 2;
  const playersBenched = activePlayers.length - totalPlayers;

  playersPlayingSpan.textContent = totalPlayers;
  playersBenchedSpan.textContent = Math.max(playersBenched, 0);
  
  // Display '0' if there are no AFK players, otherwise list their names
  afkPlayersSpan.textContent = afkPlayers.length === 0 ? '0' : afkPlayers.map(player => player.name).join(', ');
}

matchFormatSelect.addEventListener('change', function() {
    localStorage.setItem('matchFormat', matchFormatSelect.value);
});

populateMatchFormats(activePlayers.length);
matchFormatSelect.addEventListener('change', updateMatchInfo);

updateMatchInfo();

});

document.getElementById('goLiveButton').addEventListener('click', function() {
  const selectedMatchFormat = matchFormatSelect.value;
  localStorage.setItem('matchFormat', selectedMatchFormat); // Where selectedMatchFormat is the chosen format
  window.location.href = 'live.html';
});


