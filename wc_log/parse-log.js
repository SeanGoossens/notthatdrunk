const wclData = require("./wc-logs");

async function parseLog() {
  const dpsData = await wclData("dps");
  const healingData = await wclData("hps");
  let encounters = [];
  for (let i = 0; i < dpsData.length; i++) {
    let newEncounter = {
      name: dpsData[i].encounter.name,
      kill: dpsData[i].kill,
      deaths: dpsData[i].deaths,
      parses: {
        dps: {
          tanks: [],
          healers: [],
          dps: [],
        },
        healing: {
          tanks: [],
          healers: [],
          dps: [],
        },
      },
    };
    for (let x = 0; x < dpsData[i].roles.tanks.characters.length; x++) {
      const tank = dpsData[i].roles.tanks.characters[x];
      newEncounter.parses.dps.tanks.push({
        name: tank.name,
        class: tank.class,
        spec: tank.spec,
        amount: tank.amount,
        bracketPercent: tank.bracketPercent,
        rankPercent: tank.rankPercent,
      });
    }
    for (let x = 0; x < dpsData[i].roles.healers.characters.length; x++) {
      const healer = dpsData[i].roles.healers.characters[x];
      newEncounter.parses.dps.healers.push({
        name: healer.name,
        class: healer.class,
        spec: healer.spec,
        amount: healer.amount,
        bracketPercent: healer.bracketPercent,
        rankPercent: healer.rankPercent,
      });
    }
    for (let x = 0; x < dpsData[i].roles.dps.characters.length; x++) {
      const dps = dpsData[i].roles.dps.characters[x];
      newEncounter.parses.dps.dps.push({
        name: dps.name,
        class: dps.class,
        spec: dps.spec,
        amount: dps.amount,
        bracketPercent: dps.bracketPercent,
        rankPercent: dps.rankPercent,
      });
    }
    for (let x = 0; x < healingData[i].roles.tanks.characters.length; x++) {
      const tank = healingData[i].roles.tanks.characters[x];
      newEncounter.parses.healing.tanks.push({
        name: tank.name,
        class: tank.class,
        spec: tank.spec,
        amount: tank.amount,
        bracketPercent: tank.bracketPercent,
        rankPercent: tank.rankPercent,
      });
    }
    for (let x = 0; x < healingData[i].roles.healers.characters.length; x++) {
      const healer = healingData[i].roles.healers.characters[x];
      newEncounter.parses.healing.healers.push({
        name: healer.name,
        class: healer.class,
        spec: healer.spec,
        amount: healer.amount,
        bracketPercent: healer.bracketPercent,
        rankPercent: healer.rankPercent,
      });
    }
    for (let x = 0; x < healingData[i].roles.dps.characters.length; x++) {
      const dps = healingData[i].roles.dps.characters[x];
      newEncounter.parses.healing.dps.push({
        name: dps.name,
        class: dps.class,
        spec: dps.spec,
        amount: dps.amount,
        bracketPercent: dps.bracketPercent,
        rankPercent: dps.rankPercent,
      });
    }
    encounters.push(newEncounter);
  }
  console.log(encounters);
  return encounters;
}
parseLog();

module.exports = parseLog;
