const { WCLOGS_AUTH } = require("../config.json");
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
      Authorization: `Basic ${WCLOGS_AUTH}`,
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
      query: queryString,
    }),
  };
  const response2 = await request(options2);
  const log = JSON.parse(response2.body);
  if (lookupString == "hps" || lookupString == "dps") {
    const data = log?.data?.reportData?.report?.rankings?.data;
    // console.log(data);
    return data;
  } else if (lookupString == "resources") {
    const data = log?.data?.reportData?.report?.table?.data?.playerDetails;
    // console.log(data);
    return data;
  } else if (lookupString == "deaths") {
    const data = log?.data?.reportData?.report?.table?.data?.deathEvents;
    // console.log(data);
    return data;
  } else if (lookupString == "time") {
    const data = log?.data?.reportData?.report?.table?.data?.totalTime;
    // console.log(data);
    return data;
  }
}
// wclData("time");

module.exports = wclData;
