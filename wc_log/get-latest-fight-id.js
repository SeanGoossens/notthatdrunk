// This file grabs all the relevant columns to prepare for SQL input
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("../config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function getLatestFightId() {
  // Remove non-raid logs
  const { encounters, encountersError } = await supabase
    .from("encounters")
    .delete()
    .neq("game_zone", "Aberrus, the Shadowed Crucible");

  const { data: data, error } = await supabase
    .from("encounters")
    .select("*")
    .eq("kill", true)
    .gt("encounter_id", 0)
    .order("fight_id", { ascending: false })
    .limit(2);
  if (error) {
    console.error(error);
  } else {
    // let fightId = data[0]?.fight_id;
    // console.log(data);
    return data;
  }
}

// getLatestFightId();

module.exports = getLatestFightId;
