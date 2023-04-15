const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const wclData = require("./wc-logs");

async function parseLastPullRankings() {
  const dpsData = await wclData("dpsLastPull");
  const healingData = await wclData("hpsLastPull");
  const healthstones = await wclData("healthstones");
  // console.log(healthstones);
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
      let usedHealthstone = false;
      if (healthstones.includes(tank.name)) {
        usedHealthstone = true;
      }
      newEncounter.parses.dps.tanks.push({
        name: tank.name,
        class: tank.class,
        spec: tank.spec,
        amount: tank.amount,
        bracketPercent: tank.bracketPercent,
        rankPercent: tank.rankPercent,
        usedHealthstone: usedHealthstone,
      });
    }
    for (let x = 0; x < dpsData[i].roles.healers.characters.length; x++) {
      const healer = dpsData[i].roles.healers.characters[x];
      let usedHealthstone = false;
      if (healthstones.includes(healer.name)) {
        usedHealthstone = true;
      }
      newEncounter.parses.dps.healers.push({
        name: healer.name,
        class: healer.class,
        spec: healer.spec,
        amount: healer.amount,
        bracketPercent: healer.bracketPercent,
        rankPercent: healer.rankPercent,
        usedHealthstone: usedHealthstone,
      });
    }
    for (let x = 0; x < dpsData[i].roles.dps.characters.length; x++) {
      const dps = dpsData[i].roles.dps.characters[x];
      let usedHealthstone = false;
      if (healthstones.includes(dps.name)) {
        usedHealthstone = true;
      }
      newEncounter.parses.dps.dps.push({
        name: dps.name,
        class: dps.class,
        spec: dps.spec,
        amount: dps.amount,
        bracketPercent: dps.bracketPercent,
        rankPercent: dps.rankPercent,
        usedHealthstone: usedHealthstone,
      });
    }
    for (let x = 0; x < healingData[i].roles.tanks.characters.length; x++) {
      const tank = healingData[i].roles.tanks.characters[x];
      let usedHealthstone = false;
      if (healthstones.includes(tank.name)) {
        usedHealthstone = true;
      }
      newEncounter.parses.healing.tanks.push({
        name: tank.name,
        class: tank.class,
        spec: tank.spec,
        amount: tank.amount,
        bracketPercent: tank.bracketPercent,
        rankPercent: tank.rankPercent,
        usedHealthstone: usedHealthstone,
      });
    }
    for (let x = 0; x < healingData[i].roles.healers.characters.length; x++) {
      const healer = healingData[i].roles.healers.characters[x];
      let usedHealthstone = false;
      if (healthstones.includes(healer.name)) {
        usedHealthstone = true;
      }
      newEncounter.parses.healing.healers.push({
        name: healer.name,
        class: healer.class,
        spec: healer.spec,
        amount: healer.amount,
        bracketPercent: healer.bracketPercent,
        rankPercent: healer.rankPercent,
        usedHealthstone: usedHealthstone,
      });
    }
    for (let x = 0; x < healingData[i].roles.dps.characters.length; x++) {
      const dps = healingData[i].roles.dps.characters[x];
      let usedHealthstone = false;
      if (healthstones.includes(dps.name)) {
        usedHealthstone = true;
      }
      newEncounter.parses.healing.dps.push({
        name: dps.name,
        class: dps.class,
        spec: dps.spec,
        amount: dps.amount,
        bracketPercent: dps.bracketPercent,
        rankPercent: dps.rankPercent,
        usedHealthstone: usedHealthstone,
      });
    }
    encounters.push(newEncounter);
  }
  // console.log(encounters[0].parses.dps.dps);
  return encounters;
}

// parseLastPullRankings();

module.exports = parseLastPullRankings;
