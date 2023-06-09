// const { WCLOGS_AUTH } = require("../config.json");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const getQueryStrings = require("./wc-log-strings");
const util = require("util");
const request = util.promisify(require("request"));

async function wclData(lookupString) {
  const allQueryStrings = await getQueryStrings();
  const stringLookup = lookupString;
  function findString(string) {
    return string.name === stringLookup;
  }

  const queryString = allQueryStrings.find(findString).string;

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
  // console.log(token);
  const options2 = {
    method: "POST",
    url: "https://www.warcraftlogs.com/api/v2/client",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: queryString,
    }),
  };
  const response2 = await request(options2);
  const log = JSON.parse(response2.body);
  if (
    lookupString == "hps" ||
    lookupString == "dps" ||
    lookupString == "hpsLastPull" ||
    lookupString == "dpsLastPull"
  ) {
    const data = log?.data?.reportData?.report?.rankings?.data;
    // console.log(data);
    return data;
  } else if (lookupString == "resources") {
    const data = log?.data?.reportData?.report?.table?.data?.playerDetails;
    // console.log(data);
    return data;
  } else if (lookupString == "deaths" || lookupString == "deathsLastPull") {
    const data = log?.data?.reportData?.report?.table?.data?.deathEvents;
    // console.log(data);
    return data;
  } else if (lookupString == "time") {
    const data = log?.data?.reportData?.report?.table?.data?.totalTime;
    // console.log(data);
    return data;
  } else if (lookupString == "last") {
    const data = log?.data?.reportData?.report?.fights;
    // console.log(data);
    return data;
  } else if (lookupString == "healthstones") {
    const data = log?.data?.reportData?.report?.events?.data;
    const sourceNames = data.map((data) => data.source.name);
    return sourceNames;
  }
}
// wclData("dpsLastPull");

module.exports = wclData;
