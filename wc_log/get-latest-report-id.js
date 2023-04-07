// const { AUTH_V1 } = require("../config.json");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const ntdURL = `https://www.warcraftlogs.com:443/v1/reports/guild/Not%20That%20Drunk/emerald-dream/US?api_key=${process.env.AUTH_V1}`;

async function getLatestReportId() {
  const ntdReports = await fetch(ntdURL);

  let reportsResponse = await ntdReports.json();
  let reportId = [];
  for (let i = 0; i < reportsResponse.length; i++) {
    if (reportsResponse[i].owner == "Ogzuss") {
      reportId.push(reportsResponse[i].id);
      reportId = reportId[0];
      // reportId = "gKbH8WFLf9kyGTJn"; // for testing
      // console.log(reportId);
      return reportId;
    }
  }
}
// getLatestReportId();

module.exports = getLatestReportId;
