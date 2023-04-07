// This file grabs all the relevant columns to prepare for SQL input

const parseDeaths = require("../wc_log/parse-deaths");
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("../config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function deathsUpload() {
  const data = await parseDeaths();
  //   console.log(data);
  for (let i = 0; i < data.length; i++) {
    const player = await data[i]?.name;
    const deathTime = ((await data[i]?.time) / 60000).toFixed(2);
    const ability = await data[i]?.ability;

    const { data: responseData, error } = await supabase.from("deaths").upsert({
      player_name: player,
      death_time: deathTime,
      killed_by: ability,
    });
    if (error) {
      console.error(error);
    } else {
      ("Uploading Death Data");
    }
  }
}

module.exports = deathsUpload;
