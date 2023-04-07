// This file grabs all the relevant columns to prepare for SQL input

const parseEncounters = require("../wc_log/parse-encounters");
const { createClient } = require("@supabase/supabase-js");
const { LOCAL_URL, LOCAL_KEY } = require("../config.json");

const supabase = createClient(
  process.env.SUPABASE_URL || LOCAL_URL,
  process.env.SUPABASE_ANON_KEY || LOCAL_KEY
);

async function encountersUpload() {
  const data = await parseEncounters();

  for (let i = 0; i < data.length; i++) {
    const encounterId = await data[i]?.encounterID; // Player name
    const fightPercentage = await data[i]?.fightPercentage; // The max item level of the character
    const endTime = await data[i]?.endTime; // Amount of potions consumed by the player
    const id = await data[i]?.id; // Amount of healthstones consumed by the player
    const kill = await data[i]?.kill; // Amount of healthstones consumed by the player
    const gameZone = await data[i]?.gameZone.name; // Amount of healthstones consumed by the player

    const { data: responseData, error } = await supabase
      .from("encounters")
      .upsert(
        {
          encounter_id: encounterId,
          fight_percentage: fightPercentage,
          end_time: endTime,
          fight_id: id,
          kill: kill,
          game_zone: gameZone,
        },
        { onConflict: "end_time" }
      );
    if (error) {
      console.error(error);
    } else {
      ("Uploading Encounter Data");
    }
  }
}
// encountersUpload();

module.exports = encountersUpload;
