const wclData = require("./wc-logs");

async function parseResources() {
  const resources = await wclData("resources");
  // console.log(resources.tanks);
  let encounters = [];

  // Resources
  for (let x = 0; x < resources.healers.length; x++) {
    let newEncounter = {};
    const healer = resources.healers[x];

    (newEncounter["name"] = healer.name),
      (newEncounter["ilvl"] = healer.maxItemLevel),
      (newEncounter["potions"] = healer.potionUse),
      (newEncounter["healthstones"] = healer.healthstoneUse);
    encounters.push(newEncounter);
    // console.log(encounters);
  }
  for (let x = 0; x < resources.dps.length; x++) {
    let newEncounter = {};
    const dps = resources.dps[x];

    (newEncounter["name"] = dps.name),
      (newEncounter["ilvl"] = dps.maxItemLevel),
      (newEncounter["potions"] = dps.potionUse),
      (newEncounter["healthstones"] = dps.healthstoneUse);
    encounters.push(newEncounter);
    // console.log(encounters);
  }
  for (let x = 0; x < resources.tanks.length; x++) {
    let newEncounter = {};
    const tank = resources.tanks[x];

    (newEncounter["name"] = tank.name),
      (newEncounter["ilvl"] = tank.maxItemLevel),
      (newEncounter["potions"] = tank.potionUse),
      (newEncounter["healthstones"] = tank.healthstoneUse);
    encounters.push(newEncounter);
    // console.log(encounters);
  }

  // console.log(encounters);
  return encounters;
}
// parseResources();

module.exports = parseResources;
