var request = require("request");
var code = "gKbH8WFLf9kyGTJn";
var guildId = 566479;
var options = {
  method: "POST",
  url: "https://www.warcraftlogs.com/oauth/token",
  headers: {
    Authorization:
      "Basic OThkNDdiN2UtMjE4OS00ZGMxLWI5YWEtMmYxZmZjN2EzNTQzOkxpV2g1dnVyNkxqMXZjVk1yVTR5TUZxQWxlYjUzN3Q2WXZOUGJBcFI=",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  form: {
    grant_type: "client_credentials",
  },
};
request(options, async function (error, response) {
  if (error) throw new Error(error);
  token = await JSON.parse(response.body).access_token;
  let zoneRanking = 1693;
  var options = {
    method: "POST",
    url: "https://www.warcraftlogs.com/api/v2/client",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query 
      { reportData {
        report(code: "${code}") {
          rankings(
            compare: Parses
            fightIDs: 21
          )
        }
      }
      }`,
      variables: {},
    }),
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    const log = JSON.parse(response.body);

    console.log(log.data.reportData.report.rankings.data);
  });
});
