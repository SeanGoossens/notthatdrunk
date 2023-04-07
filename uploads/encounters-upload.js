// This file grabs all the relevant columns to prepare for SQL input
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const parseEncounters = require("../wc_log/parse-encounters");
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("../config.json");
// console.log(process.env);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function encountersUpload() {
  const data = await parseEncounters("encounters");
  // console.log(data);
  for (let i = 0; i < data.fights.length; i++) {
    const encounterId = await data?.fights[i]?.encounterID; // Player name
    const fightPercentage = await data?.fights[i]?.fightPercentage; // The max item level of the character
    const endTime = await data?.fights[i]?.endTime; // Amount of potions consumed by the player
    const id = await data?.fights[i]?.id; // Amount of healthstones consumed by the player
    const kill = await data?.fights[i]?.kill; // Amount of healthstones consumed by the player
    const gameZone = await data?.fights[i]?.gameZone.name; // Amount of healthstones consumed by the player
    const reportId = await data?.code;

    const { data: responseData, error } = await supabase
      .from("encounters")
      .upsert({
        encounter_id: encounterId,
        fight_percentage: fightPercentage,
        end_time: endTime,
        fight_id: id,
        kill: kill,
        game_zone: gameZone,
        report_id: reportId,
      });
    if (error) {
      console.error(error);
    } else {
      ("Got new encounter data");
    }
  }
}
console.log("Got new encounter data");

encountersUpload();

module.exports = encountersUpload;
