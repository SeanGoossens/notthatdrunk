const { createClient } = require("@supabase/supabase-js");
const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL || LOCAL_URL,
  process.env.SUPABASE_ANON_KEY || LOCAL_KEY
);

const databasePull = function () {
  return supabase
    .from("io")
    .select("*")
    .then((response) => {
      let playerArray = [];
      for (let i = 0; i < response["data"].length; i++) {
        let newObject = {};
        (newObject.id = i),
          (newObject.playerName = response["data"][i].player_name),
          (newObject.score = response["data"][i].score),
          (newObject.role = response["data"][i].role);
        playerArray.push(newObject);
      }
      //   playerData.push(response["data"][0].id);
      console.log(playerArray);
      return playerArray;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data");
    });
};
// let playerData = {
//     player: response["data"][0].player_name,
//     score: response["data"][0].score,
//     role: response["data"][0].role,
//   };

module.exports = databasePull;
