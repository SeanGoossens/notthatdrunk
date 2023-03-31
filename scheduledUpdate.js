const { createClient } = require("@supabase/supabase-js");
const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL || LOCAL_URL,
  process.env.SUPABASE_ANON_KEY || LOCAL_KEY
);

async function rioPull(players) {
  let cutoffsURL =
    "https://raider.io/api/v1/mythic-plus/season-cutoffs?season=season-df-1&region=us";

  let cutoffRequest = await fetch(cutoffsURL);
  let cutoffResponse = await cutoffRequest.json();

  const totalPop = cutoffResponse.cutoffs.p999.all.totalPopulationCount;
  const healerPop = 857967; // Hard coding this since it's not in the API. As of 3/24/2023
  const tankPop = 861250; // Hard coding this since it's not in the API. As of 3/24/2023
  const dpsPop = 2359480; // Hard coding this since it's not in the API. As of 3/24/2023
  let specPop = 0;

  for (let i = 0; i < players.length; i++) {
    const character = {
      baseUrl: `https://raider.io/api/v1/characters/profile?region=us&realm=Emerald%20Dream&name=${players[i].playerName}`,
      id: players[i].id,
      playerName: players[i].playerName,
      role: players[i].role,
    };
    let getScore = `${character["baseUrl"]}&fields=mythic_plus_scores`;
    let rioRequest = await fetch(getScore);
    let scoreResponse = await rioRequest.json();
    character["score"] = scoreResponse.mythic_plus_scores.all;

    switch (character["role"]) {
      case "dps":
        specPop = dpsPop;
      case "healer":
        specPop = healerPop;
      case "tank":
        specPop = tankPop;
    }

    let getRank = `${character["baseUrl"]}&fields=mythic_plus_ranks`;
    let rankRequest = await fetch(getRank);
    let rankResponse = await rankRequest.json();

    character["roleRank"] =
      rankResponse.mythic_plus_ranks[character["role"]].world;
    character["overallRank"] = rankResponse.mythic_plus_ranks.overall.world;
    character["rolePercentile"] =
      Math.round((character["roleRank"] / specPop) * 100 * 100) / 100;
    character["overallPercentile"] =
      Math.round((character["overallRank"] / totalPop) * 100 * 100) / 100;
    // console.log(character);
    const { data, error } = await supabase
      .from("io")
      .update({
        player_name: character.playerName,
        score: character.score,
        overall_rank: character.overallPercentile,
        role_rank: character.rolePercentile,
      })
      .eq("player_name", character.playerName)
      .select();

    if (error) {
      console.error(error);
    } else {
      console.log(data);
      players[i] = data[0];
    }
  }
}

const databaseUpdate = function () {
  return supabase
    .from("io")
    .select("*")
    .order("score", { ascending: false })
    .then((response) => {
      let playerArray = [];
      for (let i = 0; i < response["data"].length; i++) {
        let newObject = {};
        (newObject.id = i),
          (newObject.playerName = response["data"][i].player_name),
          (newObject.score = response["data"][i].score),
          (newObject.role = response["data"][i].role),
          (newObject.overallRank = response["data"][i].overall_rank),
          (newObject.roleRank = response["data"][i].role_rank);
        playerArray.push(newObject);
      }
      //   playerData.push(response["data"][0].id);
      rioPull(playerArray);
      //   return playerArray;
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
// databasePull();

module.exports = databaseUpdate;
