const { AUTH_V1 } = require("../config.json");
const ntdURL = `https://www.warcraftlogs.com:443/v1/reports/guild/Not%20That%20Drunk/emerald-dream/US?api_key=${AUTH_V1}`;

async function getLatestReportId() {
  const ntdReports = await fetch(ntdURL);
  let reportsResponse = await ntdReports.json();
  let reportId = [];
  for (let i = 0; i < reportsResponse.length; i++) {
    if (reportsResponse[i].owner == "Ogzuss") {
      reportId.push(reportsResponse[i].id);
      reportId = reportId[0];
      // reportId = "v8rpmxKTQdNDAzf4"; // for testing
      return reportId;
    }
  }
}

module.exports = getLatestReportId;
