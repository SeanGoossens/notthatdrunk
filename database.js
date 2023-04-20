require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const progression = require("./guild/progression.js");
// const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const databasePull = async function () {
  let progress = await progression();
  let allDatabasePulls = {};
  allDatabasePulls["progress"] = progress;
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
            (newObject.roleRank = response["data"][i].role_rank),
            (newObject.url = response["data"][i].url);
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
            (newObject.reportId = response["data"][i].report_id),
            (newObject.role = response["data"][i].role),
            (newObject.encounter = response["data"][i].encounter),
            (newObject.dps = response["data"][i].dps),
            (newObject.hps = response["data"][i].hps),
            (newObject.dpsParse = response["data"][i].dps_parse),
            (newObject.healingParse = response["data"][i].healing_parse),
            (newObject.usedHealthstone = response["data"][i].used_healthstone),
            lastPullRankings.push(newObject);
        }
        allDatabasePulls["lastPullRankings"] = lastPullRankings;
      }),

    supabase
      .from("encounters")
      .select("*")
      .gt("encounter_id", 0)
      .order("fight_id", { ascending: false })
      .limit(1)
      .then((response) => {
        let lastPullEncounter = [];
        for (let i = 0; i < response["data"].length; i++) {
          let newObject = {};
          (newObject.id = i + 1),
            (newObject.kill = response["data"][i].kill),
            (newObject.fightPercentage = response["data"][i].fight_percentage),
            lastPullEncounter.push(newObject);
        }
        allDatabasePulls["lastPullEncounter"] = lastPullEncounter;
      }),

    supabase
      .from("weekly_runs")
      .select("*")
      .order("score", { ascending: false })
      .limit(10)
      .then((response) => {
        let weeklyRuns = [];
        for (let i = 0; i < response["data"].length; i++) {
          let newObject = {};
          (newObject.id = i + 1),
            (newObject.playerName = response["data"][i].player_name),
            (newObject.dungeon = response["data"][i].dungeon),
            (newObject.shortName = response["data"][i].short_name),
            (newObject.keyUpgrade = response["data"][i].key_upgrade),
            (newObject.keyLevel = response["data"][i].key_level),
            (newObject.date = response["data"][i].date),
            (newObject.url = response["data"][i].url),
            weeklyRuns.push(newObject);
        }
        allDatabasePulls["weeklyRuns"] = weeklyRuns;
      }),
  ]).then(() => {
    // console.log(allDatabasePulls.progress);
    return allDatabasePulls;
  });
};
// databasePull();

module.exports = databasePull;
