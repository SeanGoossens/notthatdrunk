require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function runsByPlayer() {
  const { data: response } = await supabase
    .from("weekly_runs")
    .select("player_name"); //   .order("score", { ascending: false })
  const counts = {};
  response.forEach((item) => {
    const name = item.player_name;
    counts[name] = (counts[name] || 0) + 1;
  });

  console.log(counts);
}

runsByPlayer();

module.exports = runCount;
