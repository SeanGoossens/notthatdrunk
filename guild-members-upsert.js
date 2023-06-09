// This is to update the supabase with all Not That Drunk members

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function guildMembers() {
  let membersURL =
    "https://raider.io/api/v1/guilds/profile?region=us&realm=emerald-dream&name=Not%20That%20Drunk&fields=members";

  let memberRequest = await fetch(membersURL);
  let memberResponse = await memberRequest.json();
  let players = [];
  for (i = 0; i < memberResponse.members.length; i++) {
    players.push(memberResponse.members[i].character.name);
  }

  /**
   * Filter array items based on search criteria (query)
   */
  for (let i = 0; i < players.length; i++) {
    const character = {
      baseUrl: `https://raider.io/api/v1/characters/profile?region=us&realm=Emerald%20Dream&name=${players[i]}`,
      playerName: players[i],
    };

    let getScore = `${character["baseUrl"]}&fields=mythic_plus_scores`;
    // console.log(getScore);
    let rioRequest = await fetch(getScore);
    let scoreResponse = await rioRequest.json();

    character["score"] = scoreResponse?.mythic_plus_scores.all;

    const { data, error } = await supabase
      .from("io")
      .upsert(
        {
          player_name: character.playerName,
          score: character.score,
        },
        { onConflict: "player_name" }
      )
      .select();

    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  }
}

guildMembers();
