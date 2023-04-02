const fetch = require("node-fetch");

const { WCLOGS_CLIENT, WCLOGS_SECRET } = require("./config.json");

async function apiFetch(wc_uri, auth_token) {
  var myHeaders = new fetch.Headers();
  if (auth_token == null) {
    let credentials = Buffer.from(`${WCLOGS_CLIENT}:${WCLOGS_SECRET}`);

    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials.toString("base64")}`,
      },
      redirect: "follow",
    };
  } else {
    var requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + auth_token,
      },
      redirect: "follow",
    };
  }

  var response = await fetch(wc_uri, requestOptions);
  var wcResponse = await response.text();
  // console.log(blizzResponse);

  return new Promise((resolve) => {
    resolve(wcResponse);
  });
}

module.exports = apiFetch;
