const express = require("express");
const app = express();
const databasePull = require("./database.js");
const databaseUpdate = require("./scheduledUpdate.js");
const cron = require("node-cron");
app.set("view engine", "ejs");

databasePull().then((playerArray) => {
  app.get("/", function (req, res) {
    res.render("pages/foundation", {
      playerArray: playerArray,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("pages/about");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  cron.schedule("0 * * * *", () => {
    databaseUpdate();
  });
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
