const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const databasePull = function () {
  return supabase
    .from("io")
    .select("*")
    .then((response) => {
      let playerData = {
        player: response["data"][0].player_name,
        score: response["data"][0].score,
        role: response["data"][0].role,
      };
      //   playerData.push(response["data"][0].id);
      return playerData;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data");
    });
};

module.exports = databasePull;
