// This file grabs all the relevant columns to prepare for SQL input

const { createClient } = require("@supabase/supabase-js");
const { LOCAL_URL, LOCAL_KEY } = require("../config.json");

const supabase = createClient(
  process.env.SUPABASE_URL || LOCAL_URL,
  process.env.SUPABASE_ANON_KEY || LOCAL_KEY
);

async function getLatestFightId() {
  const { data: data, error } = await supabase
    .from("encounters")
    .select("fight_id")
    .order("fight_id", { ascending: false })
    .limit(1);
  if (error) {
    console.error(error);
  } else {
    let fightId = data[0].fight_id;
    return fightId;
  }
}

// getLatestFightId();

module.exports = getLatestFightId;
