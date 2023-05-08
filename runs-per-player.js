require("dotenv").config();
const databasePull = require("./database.js");

async function countRunsPerPlayer() {
  let data = await databasePull();
  let weeklyRuns = data.weeklyRuns;
  let runCountByPlayer = {};

  for (let i = 0; i < weeklyRuns.length; i++) {
    let playerName = weeklyRuns[i].playerName;

    // If the player doesn't exist in the runCountByPlayer object, add them with a total of 0 runs
    if (!runCountByPlayer[playerName]) {
      runCountByPlayer[playerName] = 0;
    }

    // Increment the run count for the player
    runCountByPlayer[playerName]++;
  }

  // console.log(runCountByPlayer);
  return runCountByPlayer;
}

// countRunsPerPlayer();

module.exports = countRunsPerPlayer;
