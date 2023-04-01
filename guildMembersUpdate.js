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

  const healerPop = 888272; // Hard coding this since it's not in the API. As of 3/31/2023
  const tankPop = 890322; // Hard coding this since it's not in the API. As of 3/31/2023
  const dpsPop = 2669414; // Hard coding this since it's not in the API. As of 3/31/2023
  const totalPop = healerPop + tankPop + dpsPop;

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
    
    try {
      let getScore = `${character["baseUrl"]}&fields=mythic_plus_scores`;
      let rioRequest = await fetch(getScore);
      let scoreResponse = await rioRequest.json();
      character["score"] = scoreResponse.mythic_plus_scores.all;

      let getRank = `${character["baseUrl"]}&fields=mythic_plus_ranks`;
      let rankRequest = await fetch(getRank);
      let rankResponse = await rankRequest.json();
      
      character["dps"] = rankResponse.mythic_plus_ranks?.dps?.world ?? 0;
      character["healer"] = rankResponse.mythic_plus_ranks?.healer?.world ?? 0;
      character["tank"] = rankResponse.mythic_plus_ranks?.tank?.world ?? 0;
    
    
      function positiveMin(arr) {
        let min;
        arr.forEach(function(x) {
          if (x <= 0) return;
          if (!min || (x < min)) min = x;
        });
        return min;
      }

      
   
      character["dpsPercentile"] =
        Math.round((character["dps"] / dpsPop) * 100 * 100) / 100;
        character["healerPercentile"] =
        Math.round((character["healer"] / healerPop) * 100 * 100) / 100;
        character["tankPercentile"] =
        Math.round((character["tank"] / tankPop) * 100 * 100) / 100;

        const charArray = [character["dpsPercentile"],character["healerPercentile"],character["tankPercentile"]];
        character["roleRank"] = positiveMin(charArray) ?? 0;

        if(character["roleRank"] > 100) {
          character["roleRank"] = 0;
        }
      
      // character["roleRank"] = 
      //   rankResponse.mythic_plus_ranks[character["role"]].world;
      character["overallRank"] = rankResponse.mythic_plus_ranks.overall.world;
      character["overallPercentile"] =
        Math.round((character["overallRank"] / totalPop) * 100 * 100) / 100;

      } catch (error) {
        console.error(error);
        continue;
      }
      // console.log(character)
    

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
        tank_percentile: character.tankPercentile
        
      })
      .eq("player_name", character.playerName)
      .select();

    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  }
}

guildMembers();
