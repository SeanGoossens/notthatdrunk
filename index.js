require("dotenv").config();
const express = require("express");
const app = express();
app.disable("view cache");
app.set("view cache", false);
const databasePull = require("./database.js");
const rioUpdate = require("./cron_jobs/guild-members-update.js");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

app.set("view engine", "ejs");

// checkLogId();
// Save for react
setInterval(async function updateData() {
  databasePull().then((allDatabasePulls) => {
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
            playerArray: allDatabasePulls.playerArray,
            deathsArray: allDatabasePulls.deathsArray,
            resourcesArray: allDatabasePulls.resourcesArray,
            lastPullRankings: allDatabasePulls.lastPullRankings,
            lastPullDeaths: allDatabasePulls.lastPullDeaths,
            cache: false,
          });
        });
      });
    });
    console.log("Refreshing data");
  });
}, 60000);

databasePull().then((allDatabasePulls) => {
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
          playerArray: allDatabasePulls.playerArray,
          deathsArray: allDatabasePulls.deathsArray,
          resourcesArray: allDatabasePulls.resourcesArray,
          lastPullRankings: allDatabasePulls.lastPullRankings,
          lastPullDeaths: allDatabasePulls.lastPullDeaths,
          cache: false,
        });
      });
    });
  });
  console.log("Refreshing data");
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
