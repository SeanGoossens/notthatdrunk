// This file grabs all the relevant columns to prepare for SQL input

const parseLog = require("./wc_log/parse-log");
const { createClient } = require("@supabase/supabase-js");
const { LOCAL_URL, LOCAL_KEY } = require("./config.json");
const getLatestReportId = require("./wc_log/get-latest-report-id");
const wclData = require("./wc_log/wc-logs");

const supabase = createClient(
  process.env.SUPABASE_URL || LOCAL_URL,
  process.env.SUPABASE_ANON_KEY || LOCAL_KEY
);

async function rankingUpload() {
  const test = await parseLog();
  const time = await wclData("time");
  let latestReportId = await getLatestReportId();
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
        const reportId = latestReportId;

        const { data, error } = await supabase.from("latest_log").upsert({
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
          report_id: reportId,
          log_time: time,
        });
        if (error) {
          console.error(error);
        } else {
          ("Uploading Tank Rankings");
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
        const reportId = latestReportId;

        const { data, error } = await supabase.from("latest_log").upsert({
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
          report_id: reportId,
          log_time: time,
        });
        if (error) {
          console.error(error);
        } else {
          ("Uploading Healer Rankings");
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
        const reportId = latestReportId;

        const { data, error } = await supabase.from("latest_log").upsert({
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
          report_id: reportId,
          log_time: time,
        });
        if (error) {
          console.error(error);
        } else {
          ("Uploading DPS Rankings");
        }
      }
    }
  }

  insertTanks();
  insertHealers();
  insertDps();
}

module.exports = rankingUpload;
