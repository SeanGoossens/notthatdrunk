// const { WCLOGS_AUTH } = require("../config.json");
require("dotenv").config();
const util = require("util");
const request = util.promisify(require("request"));
const getLatestReportId = require("./get-latest-report-id");

async function encounters() {
  let latestReportId = await getLatestReportId();
  const options = {
    method: "POST",
    url: "https://www.warcraftlogs.com/oauth/token",
    headers: {
      Authorization: `Basic ${process.env.WCLOGS_AUTH}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "client_credentials",
    },
  };
  const response = await request(options);
  const token = JSON.parse(response.body).access_token;
  const options2 = {
    method: "POST",
    url: "https://www.warcraftlogs.com/api/v2/client",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query { reportData { report ( code: "${latestReportId}") { fights { encounterID, fightPercentage, endTime, id, kill, gameZone { name } }  } } }`,
    }),
  };
  const response2 = await request(options2);
  const log = JSON.parse(response2.body);
  const data = log?.data?.reportData?.report?.fights;
  // console.log(data);
  return data;
}
// encounters();

module.exports = encounters;
