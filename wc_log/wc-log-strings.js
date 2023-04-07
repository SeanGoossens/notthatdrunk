require("dotenv").config();
const getLatestReportId = require("./get-latest-report-id");
const getLatestFightId = require("./get-latest-fight-id");

async function getQueryStrings() {
  let latestReportId = await getLatestReportId();
  let latestFightId = await getLatestFightId();
  let queryStrings = [
    {
      name: "hps",
      string: `query { reportData { report ( code: "${latestReportId}") { rankings ( playerMetric: hps ) } } }`,
    },
    {
      name: "dps",
      string: `query { reportData { report ( code: "${latestReportId}") { rankings ( playerMetric: dps ) } } }`,
    },
    {
      name: "hpsLastPull",
      string: `query { reportData { report ( code: "${latestReportId}") { rankings ( playerMetric: hps, fightIDs: [${latestFightId}]) } } }`,
    },
    {
      name: "dpsLastPull",
      string: `query { reportData { report ( code: "${latestReportId}") { rankings ( playerMetric: dps, fightIDs: [${latestFightId}]) } } }`,
    },
    {
      name: "deaths",
      string: `query { reportData { report ( code: "${latestReportId}") { table ( startTime: 0, endTime: 9999999999, wipeCutoff: 5) } } }`,
    },
    {
      name: "deathsLastPull",
      string: `query { reportData { report ( code: "${latestReportId}") { table ( startTime: 0, endTime: 9999999999, wipeCutoff: 5, fightIDs: [${latestFightId}]) } } }`,
    },
    {
      name: "resources",
      string: `query { reportData { report ( code: "${latestReportId}") { zone { name}, table ( startTime: 0, endTime: 9999999999, fightIDs: [${latestFightId}]) } } }`,
    },
    {
      name: "time",
      string: `query { reportData { report ( code: "${latestReportId}") { table ( startTime: 0, endTime: 9999999999) } } }`,
    },
    {
      name: "last",
      string: `query { reportData { report ( code: "${latestReportId}") { fights { encounterID, fightPercentage, endTime, id, kill }  } } }`,
    },
  ];
  return queryStrings;
}

module.exports = getQueryStrings;
