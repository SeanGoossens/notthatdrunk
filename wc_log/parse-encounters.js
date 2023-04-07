// const { WCLOGS_AUTH } = require("../config.json");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const util = require("util");
const request = util.promisify(require("request"));
const getQueryStrings = require("./wc-log-strings");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function encounters(lookupString) {
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
  const code = log?.data?.reportData?.report?.code;
  const fights = log?.data?.reportData?.report?.fights;
  const data = {
    code: code,
    fights: fights,
  };

  const { encountersTable, encountersError } = await supabase
    .from("encounters")
    .delete()
    .neq("report_id", data.code);

  if (encountersError) {
    console.error(encountersError);
  } else {
    console.log("Deleted Encounters");
  }
  // console.log(data);
  return data;
}
// encounters("encounters");

module.exports = encounters;
