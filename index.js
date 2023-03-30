const express = require("express");
const app = express();
const databasePull = require("./database.js");
app.set("view engine", "ejs");

databasePull().then((playerData) => {
  app.get("/", function (req, res) {
    var playerName = playerData["player"];
    var playerScore = playerData["score"];
    var playerRole = playerData["role"];

    res.render("pages/foundation", {
      playerName: playerName,
      playerScore: playerScore,
      playerRole: playerRole,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("pages/about");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
