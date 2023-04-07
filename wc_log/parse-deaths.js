const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const wclData = require("./wc-logs");

async function parseDeaths() {
  const deathData = await wclData("deaths");
  //   console.log(deathData);
  let encounters = [];
  for (let i = 0; i < deathData.length; i++) {
    let newEncounter = {
      name: deathData[i].name,
      time: deathData[i].deathTime,
      ability: deathData[i]?.ability?.name,
    };
    encounters.push(newEncounter);
  }
  //   console.log(encounters);
  return encounters;
}
// parseDeaths();

module.exports = parseDeaths;
