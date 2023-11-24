document.addEventListener('DOMContentLoaded', () => {
  
    document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = 'game.html';
});
  
  // Retrieve total goals from localStorage
  const team1Goals = parseInt(localStorage.getItem('team1Goals'), 10);
  const team2Goals = parseInt(localStorage.getItem('team2Goals'), 10);

  // Retrieve and display player stats
  const players = JSON.parse(localStorage.getItem('players')) || [];
  const team1 = JSON.parse(localStorage.getItem('team1')) || [];
  const team2 = JSON.parse(localStorage.getItem('team2')) || [];
  const playerStatsList = document.getElementById('playerStats');

  players.forEach((player, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${player.name} - Wins: ${player.wins}, Draws: ${player.draws}, Goals: ${player.totalGoals}, Assists: ${player.totalAssists}, Losses: ${player.losses} MP: ${player.matchesPlayed}`;
    playerStatsList.appendChild(li);
  });
  
  

  console.log(team1);
  console.log(team2);

  // Optionally, clear the localStorage if it's no longer needed
  // localStorage.removeItem('matchResult');
  // localStorage.removeItem('players');

  document.getElementById('randomizeNewMatchButton').addEventListener('click', function() {
    // Instead of modifying team1 and team2 directly, clear them in localStorage

    // Redirect to game.html
    window.location.href = 'game.html';
});

document.getElementById('goToScoreCardButton').addEventListener('click', function() {
  window.location.href = 'scorecard.html';
});


});




