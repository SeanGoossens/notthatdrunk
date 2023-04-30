// Pulls weekly dungeon runs to populate the weekly runs chart

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("../config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function weeklyRuns() {
  const { data, error } = await supabase
    .from("io")
    .select("player_name")
    .order("score", { ascending: false })
    .limit(50);
  // console.log(data);
  for (i = 0; i < data.length; i++) {
    let rioURL = `https://raider.io/api/v1/characters/profile?region=us&realm=emerald%20dream&name=${data[i].player_name}&fields=mythic_plus_weekly_highest_level_runs`;
    //   console.log(rioURL);
    let rioRequest = await fetch(rioURL);
    let rioResponse = await rioRequest.json();
    console.log(rioResponse);
    for (
      x = 0;
      x < rioResponse?.mythic_plus_weekly_highest_level_runs.length;
      x++
    ) {
      const weekdayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dateString =
        rioResponse?.mythic_plus_weekly_highest_level_runs[x]?.completed_at;
      const date = new Date(dateString);
      const dayOfWeek = date.getDay();
      const weekdayText = weekdayNames[dayOfWeek];

      let character = {
        name: rioResponse.name,
        dungeon: rioResponse?.mythic_plus_weekly_highest_level_runs[x]?.dungeon,
        shortName:
          rioResponse?.mythic_plus_weekly_highest_level_runs[x]?.short_name,
        keyLevel:
          rioResponse?.mythic_plus_weekly_highest_level_runs[x]?.mythic_level,
        date: weekdayText,
        keyUpgrade:
          rioResponse?.mythic_plus_weekly_highest_level_runs[x]
            ?.num_keystone_upgrades,
        score: rioResponse?.mythic_plus_weekly_highest_level_runs[x]?.score,
        url: rioResponse?.mythic_plus_weekly_highest_level_runs[x]?.url,
      };
      //   console.log(character);
      const { data, error } = await supabase.from("weekly_runs").upsert(
        {
          player_name: character.name,
          dungeon: character.dungeon,
          short_name: character.shortName,
          key_level: character.keyLevel,
          date: character.date,
          key_upgrade: character.keyUpgrade,
          score: character.score,
          url: character.url,
        },
        { onConflict: "url" }
      );
      // members.push(character);
    }
  }
  console.log(`Weekly runs updated.`);
}

// weeklyRuns();

module.exports = weeklyRuns;
