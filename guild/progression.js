const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("../config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function progression() {
  let progURL =
    "https://raider.io/api/v1/guilds/profile?region=us&realm=emerald-dream&name=Not%20That%20Drunk&fields=raid_progression";

  let progRequest = await fetch(progURL);
  let progResponse = await progRequest.json();
  let raid = progResponse.raid_progression;
  const result = Object.entries(raid).find(([key, _]) =>
    key.startsWith("aberrus")
  );
  const progress = result[1];
  return progress;
}

module.exports = progression;
