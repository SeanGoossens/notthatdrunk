// This is to update the supabase with all Not That Drunk members
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("../config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const currentDate = new Date();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();
const year = currentDate.getFullYear();
const formattedDate = `${month}/${day}/${year}`;
// console.log(formattedDate);

async function updateHonoraryMembers() {
  let playerNames = ["stattpaladin", "chaceley"]; // Replace with the names of the players you want to fetch data for

  for (let i = 0; i < playerNames.length; i++) {
    let playerURL = "";
    switch (playerNames[i]) {
      case "chaceley":
        playerURL = `https://raider.io/api/v1/characters/profile?region=us&realm=mal-ganis&name=chaceley`;
        break;
      default:
        playerURL = `https://raider.io/api/v1/characters/profile?region=us&realm=Emerald%20Dream&name=${playerNames[i]}`;
        break;
    }

    let playerRequest = await fetch(playerURL);
    let playerResponse = await playerRequest.json();
    let character = {
      baseUrl: playerURL,
      playerName: playerResponse.name,
      race: playerResponse.race,
      wowClass: playerResponse.class,
      spec: playerResponse.active_spec_name,
      role: playerResponse.active_spec_role,
      gender: playerResponse.gender,
      faction: playerResponse.faction,
      achievementPoints: playerResponse.achievement_points,
      honorableKills: playerResponse.honorable_kills,
      url: playerResponse.profile_url,
    };
    // console.log(character);
    //Normalize the role format
    switch (character["role"]) {
      case "DPS":
        character["role"] = "dps";
        break;
      case "HEALING":
        character["role"] = "healer";
        break;
      case "TANK":
        character["role"] = "tank";
        break;
    }

    //Error handling for invalid characters
    try {
      let getScore = `${character["baseUrl"]}&fields=mythic_plus_scores`;
      let rioRequest = await fetch(getScore);
      let scoreResponse = await rioRequest.json();
      //   console.log(scoreResponse);
      character["score"] = scoreResponse.mythic_plus_scores.all;

      let getRank = `${character["baseUrl"]}&fields=mythic_plus_ranks`;
      let rankRequest = await fetch(getRank);
      let rankResponse = await rankRequest.json();

      character["dps"] = rankResponse.mythic_plus_ranks?.dps?.world ?? 0;
      character["healer"] = rankResponse.mythic_plus_ranks?.healer?.world ?? 0;
      character["tank"] = rankResponse.mythic_plus_ranks?.tank?.world ?? 0;

      //To select the smallest number (the player's assumed main)
      function positiveMin(arr) {
        let min;
        arr.forEach(function (x) {
          if (x <= 0) return;
          if (!min || x < min) min = x;
        });
        return min;
      }

      const healerPop = 960943; // Hard coding this since it's not in the API. As of 3/31/2023
      const tankPop = 958786; // Hard coding this since it's not in the API. As of 3/31/2023
      const dpsPop = 2889089; // Hard coding this since it's not in the API. As of 3/31/2023
      const totalPop = 3712686;

      character["dpsPercentile"] =
        Math.round((character["dps"] / dpsPop) * 100 * 100) / 100;
      character["healerPercentile"] =
        Math.round((character["healer"] / healerPop) * 100 * 100) / 100;
      character["tankPercentile"] =
        Math.round((character["tank"] / tankPop) * 100 * 100) / 100;

      const charArray = [
        character["dpsPercentile"],
        character["healerPercentile"],
        character["tankPercentile"],
      ];

      character["roleRank"] = positiveMin(charArray) ?? 0; //Set to zero if undefined

      if (character["roleRank"] > 100) {
        character["roleRank"] = 0;
      }

      // character["roleRank"] =
      //   rankResponse.mythic_plus_ranks[character["role"]].world;
      character["overallRank"] = rankResponse.mythic_plus_ranks.overall.world;
      character["overallPercentile"] =
        Math.round((character["overallRank"] / totalPop) * 100 * 100) / 100;
      //   console.log(character);
      const { data, error } = await supabase
        .from("io")
        .update({
          player_name: character.playerName,
          score: character.score,
          overall_rank: character.overallPercentile,
          role_rank: character.roleRank,
          race: character.race,
          class: character.wowClass,
          spec: character.spec,
          role: character.role,
          gender: character.gender,
          faction: character.faction,
          achievement_points: character.achievementPoints,
          dps_percentile: character.dpsPercentile,
          healer_percentile: character.healerPercentile,
          tank_percentile: character.tankPercentile,
          url: character.url,
          last_updated: formattedDate,
        })
        .eq("player_name", character.playerName)
        .select();

      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(`Error fetching data for ${playerNames[i]}`, error);
      continue;
    }
  }
}
//   console.log(character);

updateHonoraryMembers();

module.exports = updateHonoraryMembers;
