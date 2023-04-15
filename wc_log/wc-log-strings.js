const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const getLatestReportId = require("./get-latest-report-id");
const getLatestFightId = require("./get-latest-fight-id");

async function getQueryStrings() {
  let latestReportId = await getLatestReportId();
  let latestFightId = await getLatestFightId();
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
      string: `query { reportData { report ( code: "${latestReportId}") { table ( startTime: 0, endTime: 9999999999, wipeCutoff: 5, fightIDs: [${latestFightId}]) } } }`,
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
      name: "test",
      string: `query { reportData { report ( code: "${latestReportId}") { events ( startTime: 0, endTime: 999999, dataType: 'healing' )  } } }`,
      code: latestReportId,
    },
  ];
  // console.log(queryStrings);
  return queryStrings;
}
// getQueryStrings();

module.exports = getQueryStrings;
