document.addEventListener('DOMContentLoaded', function() {

  const players = JSON.parse(localStorage.getItem('players')) || [];
  const activePlayers = players.filter(player => !player.afk);
  const matchFormat = parseInt(localStorage.getItem('matchFormat'), 10);

console.log(activePlayers);
console.log(matchFormat);

// Define the team size based on the match format
const teamSize = matchFormat;

  // Clear existing teams before randomizing
  let team1 = [];
  let team2 = [];

  // Reset players stats before starting a new game
  resetPlayerStats(players);

  // Randomize teams for the match
  const randomizedTeams = randomizeTeams(activePlayers, teamSize);
  team1 = randomizedTeams.team1;
  team2 = randomizedTeams.team2;

  // Optionally, save the new teams to localStorage
  localStorage.setItem('team1', JSON.stringify(team1));
  localStorage.setItem('team2', JSON.stringify(team2));

displayTeams();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function randomizeTeams(activePlayers, teamSize) {
  // Shuffle players to randomize the order
  shuffleArray(activePlayers);

  // Sort players by the number of matches they have played (ascending order)
  const playersSortedByMatches = activePlayers.sort((a, b) => a.matchesPlayed - b.matchesPlayed);

  // Select the first set of players based on team size
  const selectedPlayers = playersSortedByMatches.slice(0, teamSize * 2);

  // Now sort these selected players by their score
  const calculatePlayerScore = player => player.wins * 3 + player.draws;
  const playersByScore = selectedPlayers.sort((a, b) => calculatePlayerScore(b) - calculatePlayerScore(a));

  let team1 = [], team2 = [];
  let team1Score = 0, team2Score = 0;
  let goalies = playersByScore.filter(player => player.goalie);

  // Distribute goalies first
  goalies.forEach(goalie => {
    let goalieScore = calculatePlayerScore(goalie);
    if ((team1.length < teamSize && team1Score <= team2Score) || team2.length === teamSize) {
      team1.push(goalie);
      team1Score += goalieScore;
    } else {
      team2.push(goalie);
      team2Score += goalieScore;
    }
  });

  // Assign non-goalie players
  playersByScore.forEach(player => {
    if (!player.goalie) {
      let playerScore = calculatePlayerScore(player);
      if ((team1.length < teamSize && team1Score <= team2Score) || team2.length === teamSize) {
        team1.push(player);
        team1Score += playerScore;
      } else {
        team2.push(player);
        team2Score += playerScore;
      }
    }
  });

  return { team1, team2 };
}



// Function to display teams
function displayTeams() {
  displayTeam(team1, "team1-list");
  displayTeam(team2, "team2-list");
}

function displayTeam(teamPlayers, teamListElementId) {
  const teamListElement = document.getElementById(teamListElementId);

  const playersHTML = teamPlayers.map(teamPlayer => {
    return `
      <li>
        <span><strong>${teamPlayer.name}</strong></span>
        <span>GOALS:<input class="input-goals" data-player-id="${teamPlayer.id}" type="number" value="${teamPlayer.goals}"></span>
        <span>ASSISTS:<input class="input-assists" data-player-id="${teamPlayer.id}" type="number" value="${teamPlayer.assists}"></span>
      </li>
    `;
  }).join('');

  teamListElement.innerHTML = playersHTML;

  teamPlayers.forEach(teamPlayer => {
    const goalInput = document.querySelector(`.input-goals[data-player-id="${teamPlayer.id}"]`);
    goalInput.addEventListener('input', () => {
      // Update player's goals on input
      teamPlayer.goals = parseInt(goalInput.value, 10) || 0;
      // Update the total goals display
      updateTotalGoalsDisplay();
    });
  });

}

function saveMatchData(teamListElementId, teamArray) {
  // Get the team list element by its ID
  const teamListElement = document.getElementById(teamListElementId);
  // Get all the list items within the team list
  const playerListItems = teamListElement.querySelectorAll('li');

  playerListItems.forEach(item => {
    // Retrieve the player's ID stored in the data attribute
    const playerId = item.querySelector('.input-goals').getAttribute('data-player-id');
    // Extract the new goals and assists values from the input fields
    const newGoals = item.querySelector('.input-goals').value;
    const newAssists = item.querySelector('.input-assists').value;

    // Find the player object in the teamArray using the ID
    const player = teamArray.find(p => p.id.toString() === playerId);
    if (player) {
      // Update the player's goals and assists with the new values
      player.goals = parseInt(newGoals, 10) || player.goals; // Fallback to existing value if input is not a number
      player.assists = parseInt(newAssists, 10) || player.assists; // Fallback to existing value if input is not a number
    }
  });
}

function updateMainDatabase(team1, team2) {
  // Calculate total goals for each team
  let team1Goals = team1.reduce((total, player) => total + player.goals, 0);
  let team2Goals = team2.reduce((total, player) => total + player.goals, 0);

  // Function to update individual player stats
  function updatePlayerStats(player, outcome) {
    player.matchesPlayed += 1;
    if (outcome === 'win') player.wins += 1;
    if (outcome === 'loss') player.losses += 1;
    if (outcome === 'draw') player.draws += 1;

    // Update total goals and assists
    player.totalGoals += player.goals;
    player.totalAssists += player.assists;
  }

  // Determine match outcome and update player records accordingly
  if (team1Goals > team2Goals) {
    // Team 1 wins
    team1.forEach(player => updatePlayerStats(player, 'win'));
    team2.forEach(player => updatePlayerStats(player, 'loss'));
  } else if (team2Goals > team1Goals) {
    // Team 2 wins
    team1.forEach(player => updatePlayerStats(player, 'loss'));
    team2.forEach(player => updatePlayerStats(player, 'win'));
  } else {
    // It's a draw
    [...team1, ...team2].forEach(player => updatePlayerStats(player, 'draw'));
  }

  // Finally, update the main 'players' array with the new stats from team1 and team2
  [...team1, ...team2].forEach(teamPlayer => {
    const playerIndex = players.findIndex(p => p.id === teamPlayer.id);
    if (playerIndex !== -1) {
      players[playerIndex] = {...players[playerIndex], ...teamPlayer};
    }
  });
}

function resetPlayerStats(players) {
  players.forEach(player => {
    player.goals = 0;
    player.assists = 0;
    // Reset other game-specific stats as needed
  });
}

function updateTotalGoalsDisplay() {
  const team1TotalGoalsElement = document.getElementById('team1TotalGoals');
  const team2TotalGoalsElement = document.getElementById('team2TotalGoals');
  const team1TotalGoals = team1.reduce((total, player) => total + player.goals, 0);
  const team2TotalGoals = team2.reduce((total, player) => total + player.goals, 0);
  team1TotalGoalsElement.textContent = team1TotalGoals;
  team2TotalGoalsElement.textContent = team2TotalGoals;
}

document.getElementById('endMatchButton').addEventListener('click', function() {
  // Calculate and store total goals for each team before confirmation
  const team1Goals = team1.reduce((total, player) => total + player.goals, 0);
  const team2Goals = team2.reduce((total, player) => total + player.goals, 0);

  // Construct the confirmation message with match result
  const confirmationMessage = `Are you sure the result is correct? (check with ref)\n\nMatch Result:\nTeam 1 (Red) - ${team1Goals} : ${team2Goals} - Team 2 (Yellow)`;

  let isConfirmed = confirm(confirmationMessage);

  if (isConfirmed) {
      saveMatchData('team1-list', team1);
      saveMatchData('team2-list', team2);

      updateMainDatabase(team1, team2);

      // Store the calculated total goals
      localStorage.setItem('team1Goals', team1Goals);
      localStorage.setItem('team2Goals', team2Goals);

      const sortedPlayers = [...players].sort((a, b) => {
          if (b.wins - a.wins !== 0) {
              return b.wins - a.wins;
          } 
          if (b.draws - a.draws !== 0) {
              return b.draws - a.draws;
          }
          if (b.goals - a.goals !== 0) {
              return b.totalGoals - a.totalGoals;
          }
          return b.totalAssists - a.totalAssists;
      });

      localStorage.setItem('players', JSON.stringify(sortedPlayers));

      // Save teams to localStorage
      localStorage.setItem('team1', JSON.stringify(team1));
      localStorage.setItem('team2', JSON.stringify(team2));

      window.location.href = 'scoreboard.html';
  }
});

document.getElementById('backButton').addEventListener('click', function() {
  window.location.href = 'game.html';
});

document.getElementById('goToScoreboardButton').addEventListener('click', function() {
      window.location.href = 'scoreboard.html';
  });

});