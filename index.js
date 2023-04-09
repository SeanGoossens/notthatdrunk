require("dotenv").config();
const express = require("express");
const app = express();
const databasePull = require("./database.js");
const rioUpdate = require("./cron_jobs/guild-members-update.js");
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
    app.locals.progress = allDatabasePulls.progress;
    // console.log(app.locals.lastPullEncounter);
    console.log("Data updated");
  });
}
updateData();

dataUpdateInterval = setInterval(updateData, 60000);

// Stop the data update interval when the server is stopped
process.on("SIGINT", () => {
  clearInterval(dataUpdateInterval);
  process.exit();
});

app.use(express.static(__dirname + "/dist"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  cron.schedule("55 * * * *", () => {
    //55 minutes after the hour, to allow for processing before it's pulled on the hour
    rioUpdate();
  });
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

module.exports = app;
