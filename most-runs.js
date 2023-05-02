require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function runCount() {
  supabase
    .from("weekly_runs")
    .select("player_name", { count: "exact" }) //   .order("score", { ascending: false })
    // .limit(10)
    .then((response) => {
      console.log(response);
    });
}

runCount();

module.exports = runCount;
