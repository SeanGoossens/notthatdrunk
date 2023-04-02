const getLatestReportId = require("../getLatestReportId");

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
  ];
  return queryStrings;
}

module.exports = getQueryStrings;
