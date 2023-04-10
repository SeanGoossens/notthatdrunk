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
    .limit(40);
  //   console.log(data);
  let members = [];
  for (i = 0; i < data.length; i++) {
    let rioURL = `https://raider.io/api/v1/characters/profile?region=us&realm=emerald%20dream&name=${data[i].player_name}&fields=mythic_plus_weekly_highest_level_runs`;
    //   console.log(rioURL);
    let rioRequest = await fetch(rioURL);
    let rioResponse = await rioRequest.json();
    // console.log(rioResponse);
    for (
      x = 0;
      x < rioResponse?.mythic_plus_weekly_highest_level_runs.length;
      x++
    ) {
      let character = {
        name: rioResponse.name,
        dungeons:
          rioResponse?.mythic_plus_weekly_highest_level_runs[x]?.dungeon,
        keyLevel:
          rioResponse?.mythic_plus_weekly_highest_level_runs[x]?.mythic_level,
        date: rioResponse?.mythic_plus_weekly_highest_level_runs[x]
          ?.completed_at,
        keyUpgrade:
          rioResponse?.mythic_plus_weekly_highest_level_runs[x]
            ?.num_keystone_upgrades,
        score: rioResponse?.mythic_plus_weekly_highest_level_runs[x]?.score,
        url: rioResponse?.mythic_plus_weekly_highest_level_runs[x]?.url,
      };
      //   console.log(character);
      members.push(character);
    }
  }
  //   console.log(members);
}

dungeonRuns();

module.exports = dungeonRuns;
