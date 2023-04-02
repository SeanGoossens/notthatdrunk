// This file grabs all the relevant columns to prepare for SQL input

const parseLog = require("./parseLog");
const { createClient } = require("@supabase/supabase-js");
const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL || LOCAL_URL,
  process.env.SUPABASE_ANON_KEY || LOCAL_KEY
);

async function insertData() {
  const test = await parseLog();
  async function insertTanks() {
    for (let i = 0; i < test.length; i++) {
      for (let x = 0; x < test[i]?.parses?.dps?.tanks.length; x++) {
        const player = await test[i]?.parses?.dps?.tanks[x]?.name;
        const role = "Tank";
        const encounter = await test[i]?.name;
        const playerClass = await test[i]?.parses?.dps?.tanks[x]?.class;
        const spec = await test[i]?.parses?.dps?.tanks[x]?.spec;
        const dps = await test[i]?.parses?.dps?.tanks[x]?.amount;
        const hps = await test[i]?.parses?.healing?.tanks[x]?.amount;
        const dpsParse = await test[i]?.parses?.dps?.tanks[x]?.rankPercent;
        const healingParse = await test[i]?.parses?.healing?.tanks[x]
          ?.rankPercent;
        const dpsilvlParse = await test[i]?.parses?.dps?.tanks[x]
          ?.bracketPercent;
        const healingilvlParse = await test[i]?.parses?.healing?.tanks[x]
          .bracketPercent;

        const { data, error } = await supabase
          .from("latest_log")
          .upsert({
            player_name: player,
            role: role,
            encounter: encounter,
            class: playerClass,
            spec: spec,
            dps: dps,
            hps: hps,
            dps_parse: dpsParse,
            healing_parse: healingParse,
            dps_ilvl_parse: dpsilvlParse,
            healing_ilvl_parse: healingilvlParse,
          })
          .select();
        if (error) {
          console.error(error);
        } else {
          console.log(data);
        }
      }
    }
  }
  async function insertHealers() {
    for (let i = 0; i < test.length; i++) {
      for (let x = 0; x < test[i]?.parses?.dps?.healers.length; x++) {
        const player = await test[i]?.parses?.dps?.healers[x]?.name;
        const role = "Healer";
        const encounter = await test[i]?.name;
        const playerClass = await test[i]?.parses?.dps?.healers[x]?.class;
        const spec = await test[i]?.parses?.dps?.healers[x]?.spec;
        const dps = await test[i]?.parses?.dps?.healers[x]?.amount;
        const hps = await test[i]?.parses?.healing?.healers[x]?.amount;
        const dpsParse = await test[i]?.parses?.dps?.healers[x]?.rankPercent;
        const healingParse = await test[i]?.parses?.healing?.healers[x]
          ?.rankPercent;
        const dpsilvlParse = await test[i]?.parses?.dps?.healers[x]
          ?.bracketPercent;
        const healingilvlParse = await test[i]?.parses?.healing?.healers[x]
          .bracketPercent;

        const { data, error } = await supabase
          .from("latest_log")
          .upsert({
            player_name: player,
            role: role,
            encounter: encounter,
            class: playerClass,
            spec: spec,
            dps: dps,
            hps: hps,
            dps_parse: dpsParse,
            healing_parse: healingParse,
            dps_ilvl_parse: dpsilvlParse,
            healing_ilvl_parse: healingilvlParse,
          })
          .select();
        if (error) {
          console.error(error);
        } else {
          console.log(data);
        }
      }
    }
  }
  async function insertDps() {
    for (let i = 0; i < test.length; i++) {
      for (let x = 0; x < test[i]?.parses?.dps?.dps.length; x++) {
        const player = await test[i]?.parses?.dps?.dps[x]?.name;
        const role = "DPS";
        const encounter = await test[i]?.name;
        const playerClass = await test[i]?.parses?.dps?.dps[x]?.class;
        const spec = await test[i]?.parses?.dps?.dps[x]?.spec;
        const dps = await test[i]?.parses?.dps?.dps[x]?.amount;
        const hps = await test[i]?.parses?.healing?.dps[x]?.amount;
        const dpsParse = await test[i]?.parses?.dps?.dps[x]?.rankPercent;
        const healingParse = await test[i]?.parses?.healing?.dps[x]
          ?.rankPercent;
        const dpsilvlParse = await test[i]?.parses?.dps?.dps[x]?.bracketPercent;
        const healingilvlParse = await test[i]?.parses?.healing?.dps[x]
          .bracketPercent;

        const { data, error } = await supabase
          .from("latest_log")
          .upsert({
            player_name: player,
            role: role,
            encounter: encounter,
            class: playerClass,
            spec: spec,
            dps: dps,
            hps: hps,
            dps_parse: dpsParse,
            healing_parse: healingParse,
            dps_ilvl_parse: dpsilvlParse,
            healing_ilvl_parse: healingilvlParse,
          })
          .select();
        if (error) {
          console.error(error);
        } else {
          console.log(data);
        }
      }
    }
  }

  insertTanks();
  insertHealers();
  insertDps();
}

insertData();
