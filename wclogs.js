var request = require("request");
const { WCLOGS_AUTH } = require("./config.json");
const getQueryStrings = require("./wc_log_templates/wcLogStrings");

async function wclData() {
  let allQueryStrings = await getQueryStrings();

  function findString(string) {
    return string.name === "hps";
  }

  let queryString = allQueryStrings.find(findString).string;

  var options = {
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
  request(options, async function (error, response) {
    if (error) throw new Error(error);
    token = await JSON.parse(response.body).access_token;
    var options = {
      method: "POST",
      url: "https://www.warcraftlogs.com/api/v2/client",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: queryString,
        variables: {},
      }),
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      const log = JSON.parse(response.body);
      console.log(log.data.reportData.report.rankings.data);
    });
  });
}
wclData();
