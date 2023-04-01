// This is to update the supabase with all Not That Drunk members

const { createClient } = require("@supabase/supabase-js");
const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL || LOCAL_URL,
  process.env.SUPABASE_ANON_KEY || LOCAL_KEY
);

async function guildMembers() {
  let membersURL =
    "https://raider.io/api/v1/guilds/profile?region=us&realm=emerald-dream&name=Not%20That%20Drunk&fields=members";

  let memberRequest = await fetch(membersURL);
  let memberResponse = await memberRequest.json();
  console.log(memberResponse.members[0]);
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
    members.push(character);
  }
  // console.log(members);

  let cutoffsURL =
    "https://raider.io/api/v1/mythic-plus/season-cutoffs?season=season-df-1&region=us";

  let cutoffRequest = await fetch(cutoffsURL);
  let cutoffResponse = await cutoffRequest.json();

  const totalPop = cutoffResponse.cutoffs.p999.all.totalPopulationCount;
  const healerPop = 857967; // Hard coding this since it's not in the API. As of 3/24/2023
  const tankPop = 861250; // Hard coding this since it's not in the API. As of 3/24/2023
  const dpsPop = 2359480; // Hard coding this since it's not in the API. As of 3/24/2023
  let specPop = 0;

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
    };

    
      let getScore = `${character["baseUrl"]}&fields=mythic_plus_scores`;
      let rioRequest = await fetch(getScore);
      let scoreResponse = await rioRequest.json();
      character["score"] = scoreResponse.mythic_plus_scores.all;

      switch (character["role"]) {
        case "DPS":
          specPop = dpsPop;
          character["role"] = "dps";
          break;
        case "HEALING":
          specPop = healerPop;
          character["role"] = "healer";
          break;
        case "TANK":
          specPop = tankPop;
          character["role"] = "tank";
          break;
      }

      let getRank = `${character["baseUrl"]}&fields=mythic_plus_ranks`;
      let rankRequest = await fetch(getRank);
      let rankResponse = await rankRequest.json();

      character["dps"] = 0;
      character["healer"] = 0;
      character["tank"] = 0;

      try { 
      character["dps"] = rankResponse.mythic_plus_ranks.dps.world;
    } catch (error) {
      console.log(`${character["playerName"]} does not have a dps rank`);
      continue;
    }
    try { 
      character["healer"] = rankResponse.mythic_plus_ranks.healer.world;
    } catch (error) {
      console.log(`${character["playerName"]} does not have a healer rank`);
      continue;
    }
    try { 
      character["tank"] = rankResponse.mythic_plus_ranks.tank.world;
    } catch (error) {
      console.log(`${character["playerName"]} does not have a tank rank`);
      continue;
    }
    const charArray = [character["dps"],character["healer"],character["tank"]];

      if (character["dps"] < character["healer"] && character["dps"] < character["tank"] && character["dps"] != 0) {
        character["roleRank"] = character["dps"];
      } else if (character["healer"] < character["dps"] && character["healer"] < character["tank"] && character["healer"] != 0) {
        character["roleRank"] = character ["healer"];
      } else if (character["tank"] < character["healer"] && character["tank"] < character["dps"] && character["tank"] != 0) {
        character["roleRank"] = character["tank"];
      } else {
        character["roleRank"] = 0
      }
    
      
    console.log(character);

      
      // character["roleRank"] = 
      //   rankResponse.mythic_plus_ranks[character["role"]].world;
      character["overallRank"] = rankResponse.mythic_plus_ranks.overall.world;
      character["rolePercentile"] =
        Math.round((character["roleRank"] / specPop) * 100 * 100) / 100;
      character["overallPercentile"] =
        Math.round((character["overallRank"] / totalPop) * 100 * 100) / 100;
    

    // const { data, error } = await supabase
    //   .from("io")
    //   .update({
    //     player_name: character.playerName,
    //     score: character.score,
    //     overall_rank: character.overallPercentile,
    //     role_rank: character.rolePercentile,
    //     race: character.race,
    //     class: character.wowClass,
    //     spec: character.spec,
    //     role: character.role,
    //     gender: character.gender,
    //     faction: character.faction,
    //     achievement_points: character.achievementPoints,
    //     honorable_kills: character.honorableKills,
    //   })
    //   .eq("player_name", character.playerName)
    //   .select();

    // if (error) {
    //   console.error(error);
    // } else {
    //   console.log(data);
    // }
  }
}

guildMembers();
