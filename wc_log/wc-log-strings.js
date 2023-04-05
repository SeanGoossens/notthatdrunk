const getLatestReportId = require("./get-latest-report-id");

async function getQueryStrings() {
  let latestReportId = await getLatestReportId();
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
      name: "deaths",
      string: `query { reportData { report ( code: "${latestReportId}") { table ( startTime: 0, endTime: 99999999, wipeCutoff: 5) } } }`,
    },
    {
      name: "resources",
      string: `query { reportData { report ( code: "${latestReportId}") { table ( startTime: 0, endTime: 99999999) } } }`,
    },
  ];
  return queryStrings;
}

module.exports = getQueryStrings;
