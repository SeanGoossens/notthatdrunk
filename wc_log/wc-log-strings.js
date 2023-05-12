const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const getLatestReportId = require("./get-latest-report-id");
const getLatestFightId = require("./get-latest-fight-id");

async function getQueryStrings() {
  let latestReportId = await getLatestReportId();
  // console.log(latestReportId);
  let encounterData = await getLatestFightId();
  // console.log(encounterData);
  let latestFightId = encounterData[0]?.fight_id;
  let endTime = encounterData[0]?.end_time;
  let startTime = encounterData[1]?.end_time;

  let queryStrings = [
    {
      name: "hps",
      string: `query { reportData { report ( code: "${latestReportId}") { rankings ( playerMetric: hps ) } } }`,
      code: latestReportId,
    },
    {
      name: "dps",
      string: `query { reportData { report ( code: "${latestReportId}") { rankings ( playerMetric: dps ) } } }`,
      code: latestReportId,
    },
    {
      name: "hpsLastPull",
      string: `query { reportData { report ( code: "${latestReportId}") { rankings ( playerMetric: hps, fightIDs: [${latestFightId}]) } } }`,
      code: latestReportId,
    },
    {
      name: "dpsLastPull",
      string: `query { reportData { report ( code: "${latestReportId}") { rankings ( playerMetric: dps, fightIDs: [${latestFightId}]) } } }`,
      code: latestReportId,
    },
    {
      name: "deaths",
      string: `query { reportData { report ( code: "${latestReportId}") { table ( startTime: 0, endTime: 9999999999, wipeCutoff: 5) } } }`,
      code: latestReportId,
    },
    {
      name: "deathsLastPull",
      string: `query { reportData { report ( code: "${latestReportId}") { table ( ${startTime}, endTime:${endTime}, wipeCutoff: 5, fightIDs: [${latestFightId}]) } } }`,
      code: latestReportId,
    },
    {
      name: "resources",
      string: `query { reportData { report ( code: "${latestReportId}") { zone { name}, table ( startTime: 0, endTime: 9999999999) } } }`,
      code: latestReportId,
    },
    {
      name: "time",
      string: `query { reportData { report ( code: "${latestReportId}") { table ( startTime: 0, endTime: 9999999999) } } }`,
      code: latestReportId,
    },
    {
      name: "last",
      string: `query { reportData { report ( code: "${latestReportId}") { fights { encounterID, fightPercentage, endTime, id, kill }  } } }`,
      code: latestReportId,
    },
    {
      name: "encounters",
      string: `query { reportData { report ( code: "${latestReportId}") { code, fights { encounterID, fightPercentage, endTime, id, kill, gameZone { name } }  } } }`,
      code: latestReportId,
    },
    {
      name: "wipe",
      string: `query { reportData { report ( code: "${latestReportId}") { code, fights { encounterID, fightPercentage, endTime, id, kill, gameZone { name } }  } } }`,
      code: latestReportId,
    },
    {
      name: "healthstones",
      string: `query { reportData { report ( code: "${latestReportId}") { events(startTime: ${startTime}, endTime:${endTime}, dataType:Healing, abilityID: 6262, hostilityType: Friendlies, useActorIDs: false) {data}  } } }`,
      code: latestReportId,
    },
  ];
  // console.log(queryStrings);
  return queryStrings;
}
// getQueryStrings();

// Working string for healthstone usage.
// query { reportData { report ( code: "gKbH8WFLf9kyGTJn") { events(startTime: 0, endTime:99999999, dataType:Healing, abilityID: 6262, hostilityType: Friendlies) {data}  } } }

module.exports = getQueryStrings;
