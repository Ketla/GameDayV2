document.addEventListener("DOMContentLoaded", function() {
  // Retrieve and parse the players array from local storage
  const players = JSON.parse(localStorage.getItem('players'));

  // Check if players data is available
  if (!players) {
    console.error('No players data found in local storage.');
    return;
  }

  // Calculate score for each player
  players.forEach(player => {
    player.score = player.wins * 3 + player.draws;
  });

  // Sort players by score, then wins, then draws, then goals, and finally total assists
  players.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    if (b.draws !== a.draws) {
      return b.draws - a.draws;
    }
    if (b.totalGoals !== a.totalGoals) {
      return b.totalGoals - a.totalGoals;
    }
    return b.totalAssists - a.totalAssists;
  });

  // Select the scorecard table element
  const scorecardTable = document.getElementById('scorecard');

  // Add rows for each player in the scorecard table
  players.forEach((player, index) => {
    let row = scorecardTable.insertRow();
    row.innerHTML = `
      <td><strong>${index + 1}.</strong></td>
      <td>${player.name}</td>
      <td>${player.score}</td>
      <td>${player.wins}</td>
      <td>${player.draws}</td>
      <td>${player.losses}</td>
      <td>${player.totalGoals}</td>
      <td>${player.totalAssists}</td>
      <td>${player.matchesPlayed}</td>
    `;

    // Apply a light grey background color to every second row
    if (index % 2 === 0) {
      row.style.backgroundColor = "#f2f2f2";
    }
  });

  // Function to calculate ranks with ties
  function calculateRanks(players, primaryMetric, secondaryMetric) {
    let rank = 1;
    let lastMetricValue = null;
    let lastSecondaryMetricValue = null;
    let rankCounter = 1;

    return players.map(player => {
      if (player[primaryMetric] === lastMetricValue && player[secondaryMetric] === lastSecondaryMetricValue) {
        rankCounter++;
      } else {
        rank = rankCounter;
        rankCounter++;
        lastMetricValue = player[primaryMetric];
        lastSecondaryMetricValue = player[secondaryMetric];
      }
      return { ...player, rank };
    });
  }

  // Sort and rank players for goal and assist tables
  const sortedForGoals = players.slice().sort((a, b) => b.totalGoals - a.totalGoals || b.totalAssists - a.totalAssists);
  const sortedForAssists = players.slice().sort((a, b) => b.totalAssists - a.totalAssists || b.totalGoals - a.totalGoals);

  const topGoalScorersWithRanks = calculateRanks(sortedForGoals, 'totalGoals', 'totalAssists');
  const topAssistProvidersWithRanks = calculateRanks(sortedForAssists, 'totalAssists', 'totalGoals');

  // Function to update the table rows for top scorers and assists
  function updateTable(tableId, players) {
    const table = document.getElementById(tableId);
    players.forEach(player => {
      let row = table.insertRow();
      let tiebreakerMetric = tableId === 'topGoalScorersTable' ? player.totalAssists : player.totalGoals;
      let primaryMetric = tableId === 'topGoalScorersTable' ? player.totalGoals : player.totalAssists;
      
      row.innerHTML = `
        <td>${player.rank}</td>
        <td>${player.name}</td>
        <td>${primaryMetric}</td>
        <td>${tiebreakerMetric}</td>
      `;
    });
  }

  // Update tables for top goal scorers and assist providers
  updateTable('topGoalScorersTable', topGoalScorersWithRanks);
  updateTable('topAssistsTable', topAssistProvidersWithRanks);
});
