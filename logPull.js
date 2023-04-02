const wclData = require("./wcLogs");

async function parseLog() {
  const logData = await wclData("dps");
  //   console.log(logData[0].roles.tanks.characters[0].rankPercent);
  let encounters = [];
  for (let i = 0; i < logData.length; i++) {
    let newEncounter = {
      name: logData[i].encounter.name,
      kill: logData[i].kill,
      deaths: logData[i].deaths,
      parses: {
        tanks: [],
      },
    };
    for (let x = 0; x < logData[i].roles.tanks.characters.length; x++) {
      const tank = logData[i].roles.tanks.characters[x];
      newEncounter.parses.tanks.push({
        name: tank.name,
        rankPercent: tank.rankPercent,
      });
    }
    encounters.push(newEncounter);
  }
  console.log(encounters[0].parses);
}

parseLog();
