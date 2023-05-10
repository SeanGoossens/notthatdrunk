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

async function rioUpdate() {
  let membersURL =
    "https://raider.io/api/v1/guilds/profile?region=us&realm=emerald-dream&name=Not%20That%20Drunk&fields=members";

  let memberRequest = await fetch(membersURL);
  let memberResponse = await memberRequest.json();
  // console.log(memberResponse);
  let members = [];
  for (i = 0; i < memberResponse.members.length; i++) {
    let character = {
      baseUrl: `https://raider.io/api/v1/characters/profile?region=us&realm=Emerald%20Dream&name=${memberResponse.members[i].character.name}`,
    };
    character["playerName"] = memberResponse.members[i].character.name;
    character["race"] = memberResponse.members[i].character.race;
    character["wowClass"] = memberResponse.members[i].character.class;
    character["spec"] = memberResponse.members[i].character.active_spec_name;
    character["role"] = memberResponse.members[i].character.active_spec_role;
    character["gender"] = memberResponse.members[i].character.gender;
    character["faction"] = memberResponse.members[i].character.faction;
    character["achievementPoints"] =
      memberResponse.members[i].character.achievement_points;
    character["honorableKills"] =
      memberResponse.members[i].character.honorable_kills;
    character["url"] = memberResponse.members[i].character.profile_url;
    members.push(character);
  }
  // console.log(members);

  const healerPop = 960943; // Hard coding this since it's not in the API. As of 3/31/2023
  const tankPop = 958786; // Hard coding this since it's not in the API. As of 3/31/2023
  const dpsPop = 2889089; // Hard coding this since it's not in the API. As of 3/31/2023
  const totalPop = 3712686;

  for (let i = 0; i < members.length; i++) {
    let character = {
      baseUrl: `https://raider.io/api/v1/characters/profile?region=us&realm=Emerald%20Dream&name=${members[i].playerName}`,
      playerName: members[i].playerName,
      race: members[i].race,
      wowClass: members[i].wowClass,
      spec: members[i].spec,
      role: members[i].role,
      gender: members[i].gender,
      faction: members[i].faction,
      achievementPoints: members[i].achievementPoints,
      honorableKills: members[i].honorableKills,
      url: members[i].url,
    };

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
      character["score"] = scoreResponse?.mythic_plus_scores?.all;
      // console.log(character.score);

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
      character["overallRank"] =
        rankResponse?.mythic_plus_ranks?.overall?.world;
      character["overallPercentile"] =
        Math.round((character["overallRank"] / totalPop) * 100 * 100) / 100;
    } catch (error) {
      console.error(error);
      continue;
    }
    // console.log(character)

    const { data, error } = await supabase.from("io").upsert(
      {
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
      },
      { onConflict: "player_name" }
    );
    // .eq("player_name", character.playerName)
    // .select();

    if (error) {
      console.error(error);
    } else {
      // console.log(`Updated ${character.playerName}.`);
    }
  }
}

rioUpdate();

module.exports = rioUpdate;
