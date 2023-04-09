const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("../config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function dungeonRuns() {
  const { data, error } = await supabase
    .from("io")
    .select("player_name")
    .order("score", { ascending: false })
    .limit(20);
  console.log(data);

  for (i = 0; i < data.length; i++) {
    let rioURL = `https://raider.io/api/v1/characters/profile?region=us&realm=emerald%20dream&name=${data[i].player_name}&fields=mythic_plus_weekly_highest_level_runs`;
    let rioRequest = await fetch(rioURL);
    let rioResponse = await rioRequest.json();
    console.log(rioResponse);
  }
}

dungeonRuns();

module.exports = dungeonRuns;
