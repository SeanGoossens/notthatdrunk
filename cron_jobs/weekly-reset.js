const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function weeklyReset() {
  const { encounters, encountersError } = await supabase
    .from("weekly_runs")
    .delete()
    .neq("url", "DELETE");
}

// weeklyReset();

module.exports = weeklyReset;
