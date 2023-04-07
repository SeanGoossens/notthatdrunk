require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const databasePull = function () {
  let allDatabasePulls = {};

  return Promise.all([
    supabase
      .from("io")
      .select("*")
      .order("score", { ascending: false })
      .then((response) => {
        let playerArray = [];
        for (let i = 0; i < response["data"].length; i++) {
          let newObject = {};
          (newObject.id = i + 1),
            (newObject.playerName = response["data"][i].player_name),
            (newObject.score = response["data"][i].score),
            (newObject.role = response["data"][i].role),
            (newObject.overallRank = response["data"][i].overall_rank),
            (newObject.roleRank = response["data"][i].role_rank);
          playerArray.push(newObject);
        }
        allDatabasePulls["playerArray"] = playerArray;
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error fetching data");
      }),

    supabase
      .from("deaths")
      .select("*")
      .order("death_time", { ascending: true })
      .then((response) => {
        let deathsArray = [];
        for (let i = 0; i < response["data"].length; i++) {
          let newObject = {};
          (newObject.id = i + 1),
            (newObject.playerName = response["data"][i].player_name),
            (newObject.deathTime = response["data"][i].death_time),
            (newObject.killedBy = response["data"][i].killed_by),
            deathsArray.push(newObject);
        }
        allDatabasePulls["deathsArray"] = deathsArray;
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error fetching data");
      }),

    supabase
      .from("resources")
      .select("*")
      .order("potions", { ascending: false })
      .order("healthstones", { ascending: false })
      .order("player_name", { ascending: true })
      .then((response) => {
        let resourcesArray = [];
        for (let i = 0; i < response["data"].length; i++) {
          let newObject = {};
          (newObject.id = i + 1),
            (newObject.playerName = response["data"][i].player_name),
            (newObject.potions = response["data"][i].potions),
            (newObject.healthstones = response["data"][i].healthstones),
            resourcesArray.push(newObject);
        }
        allDatabasePulls["resourcesArray"] = resourcesArray;
      }),

    supabase
      .from("latest_log")
      .select("*")
      // .order("death_time", { ascending: true })
      .then((response) => {
        let parsesArray = [];
        for (let i = 0; i < response["data"].length; i++) {
          let newObject = {};
          (newObject.id = i + 1),
            (newObject.playerName = response["data"][i].player_name),
            (newObject.potions = response["data"][i].potions),
            (newObject.healthstones = response["data"][i].healthstones),
            parsesArray.push(newObject);
        }
        allDatabasePulls["parsesArray"] = parsesArray;
      }),

    supabase
      .from("last_pull_deaths")
      .select("*")
      // .order("death_time", { ascending: true })
      .then((response) => {
        let lastPullDeaths = [];
        for (let i = 0; i < response["data"].length; i++) {
          let newObject = {};
          (newObject.id = i + 1),
            (newObject.playerName = response["data"][i].player_name),
            (newObject.deathTime = response["data"][i].death_time),
            (newObject.killedBy = response["data"][i].killed_by),
            lastPullDeaths.push(newObject);
        }
        allDatabasePulls["lastPullDeaths"] = lastPullDeaths;
      }),

    supabase
      .from("last_pull_rankings")
      .select("*")
      .order("dps", { ascending: false })
      .then((response) => {
        let lastPullRankings = [];
        for (let i = 0; i < response["data"].length; i++) {
          let newObject = {};
          (newObject.id = i + 1),
            (newObject.playerName = response["data"][i].player_name),
            (newObject.role = response["data"][i].role),
            (newObject.encounter = response["data"][i].encounter),
            (newObject.dps = response["data"][i].dps),
            (newObject.hps = response["data"][i].hps),
            (newObject.dpsParse = response["data"][i].dps_parse),
            (newObject.healingParse = response["data"][i].healing_parse),
            lastPullRankings.push(newObject);
        }
        allDatabasePulls["lastPullRankings"] = lastPullRankings;
      }),
  ]).then(() => {
    // console.log(allDatabasePulls);
    return allDatabasePulls;
  });
};
// databasePull();

module.exports = databasePull;
