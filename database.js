const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_AUTH;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
