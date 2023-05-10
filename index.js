require("dotenv").config();
const express = require("express");
const app = express();
const databasePull = require("./database.js");
const runCount = require("./run-count.js");
const runsPerPlayer = require("./runs-per-player.js");
const rioUpdate = require("./cron_jobs/guild-members-update.js");
const honoraryMembers = require("./cron_jobs/honorary-members-update.js");
const weeklyRuns = require("./cron_jobs/weekly-runs.js");
const weeklyReset = require("./cron_jobs/weekly-reset.js");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

app.set("view engine", "ejs");

const pagesPath = path.join(__dirname, "views", "pages");
fs.readdir(pagesPath, (err, files) => {
  if (err) {
    throw err;
  }

  console.log("Found the following files in the pages directory:");
  console.log(files);

  files.forEach((file) => {
    const fileName = path.basename(file, ".ejs");
    console.log(`Generating route for ${fileName}`);

    // Change the route to match the desired URL
    app.get(`/${fileName === "index" ? "" : fileName}`, (req, res) => {
      console.log(`Rendering ${file}`);
      res.render(`pages/${fileName}`, {
        cache: false,
      });
    });
  });
});

let dataUpdateInterval;

function updateData() {
  databasePull().then((allDatabasePulls) => {
    app.locals.playerArray = allDatabasePulls.playerArray;
    app.locals.deathsArray = allDatabasePulls.deathsArray;
    app.locals.resourcesArray = allDatabasePulls.resourcesArray;
    app.locals.lastPullRankings = allDatabasePulls.lastPullRankings;
    app.locals.lastPullDeaths = allDatabasePulls.lastPullDeaths;
    app.locals.lastPullEncounter = allDatabasePulls.lastPullEncounter;
    app.locals.weeklyRuns = allDatabasePulls.weeklyRuns;
    app.locals.progress = allDatabasePulls.progress;

    // console.log(allDatabasePulls.weeklyRuns);
    // console.log("Data updated");
  });
  runCount().then((runCount) => {
    app.locals.runCount = runCount;
  });
  runsPerPlayer().then((runsPerPlayer) => {
    app.locals.runsPerPlayer = runsPerPlayer;
  });
}
updateData();

dataUpdateInterval = setInterval(updateData, 60000);

var http = require("http");
setInterval(function () {
  http.get("http://www.notthatdrunk.com");
}, 300000);

// Stop the data update interval when the server is stopped
process.on("SIGINT", () => {
  clearInterval(dataUpdateInterval);
  process.exit();
});

app.use(express.static(__dirname + "/dist"));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // cron.schedule("0 */1 * * *", () => {
  //   //Every 3 hours
  //   rioUpdate();
  // });

  cron.schedule("30 * * * *", () => {
    //Every 2 hours
    rioUpdate();
    console.log("Updated guild members");
    honoraryMembers();
    console.log("Updated honorary members");
    weeklyRuns();
    console.log("Updated weekly runs");
  });

  cron.schedule(
    "0 9 * * 2",
    () => {
      //Resets with server maintenance every Tuesday
      weeklyReset();
    },
    {
      scheduled: true,
      timezone: "America/Boise",
    }
  );
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

module.exports = app;
