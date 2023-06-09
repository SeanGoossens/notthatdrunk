// This file grabs all the relevant columns to prepare for SQL input
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const parseResources = require("../wc_log/parse-resources");
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("../config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function resourceUpload() {
  const data = await parseResources();

  for (let i = 0; i < data.length; i++) {
    const player = await data[i]?.name; // Player name
    const ilvl = await data[i]?.ilvl; // The max item level of the character
    const potions = await data[i]?.potions; // Amount of potions consumed by the player
    const healthstones = await data[i]?.healthstones; // Amount of healthstones consumed by the player

    const { data: responseData, error } = await supabase
      .from("resources")
      .upsert({
        player_name: player,
        ilvl: ilvl,
        potions: potions,
        healthstones: healthstones,
      });
    if (error) {
      console.error(error);
    } else {
      ("Uploading Resource Data");
    }
  }
}
// resourceUpload();

module.exports = resourceUpload;
