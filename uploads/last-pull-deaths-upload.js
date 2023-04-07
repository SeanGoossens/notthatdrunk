// This file grabs all the relevant columns to prepare for SQL input
const wclData = require("../wc_log/wc-logs");
const { createClient } = require("@supabase/supabase-js");
const { LOCAL_URL, LOCAL_KEY } = require("../config.json");

const supabase = createClient(
  process.env.SUPABASE_URL || LOCAL_URL,
  process.env.SUPABASE_ANON_KEY || LOCAL_KEY
);

async function lastPullDeathsUpload() {
  const data = await wclData("deathsLastPull");
  //   console.log(data);
  for (let i = 0; i < data.length; i++) {
    const player = await data[i]?.name;
    const deathTime = ((await data[i]?.deathTime) / 60000).toFixed(2);
    const ability = await data[i]?.ability?.name;

    const { data: responseData, error } = await supabase
      .from("last_pull_deaths")
      .upsert({
        player_name: player,
        death_time: deathTime,
        killed_by: ability,
      });
  }
  console.log("Uploaded last log death data");
}

// lastPullDeathsUpload();
module.exports = lastPullDeathsUpload;
