// This file grabs all the relevant columns to prepare for SQL input
require("dotenv").config();
const parseLog = require("../wc_log/parse-last-pull-rankings");
const { createClient } = require("@supabase/supabase-js");
// const { LOCAL_URL, LOCAL_KEY } = require("../config.json");
const getLatestReportId = require("../wc_log/get-latest-report-id");
const wclData = require("../wc_log/wc-logs");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function lastPullRankingUpload() {
  const logs = await parseLog();
  const time = await wclData("time"); // To pass the current log time for the live-log.js function
  let latestReportId = await getLatestReportId(); // To pass the current report ID for the live-log.js function
  async function insertTanks() {
    for (let i = 0; i < logs.length; i++) {
      for (let x = 0; x < logs[i]?.parses?.dps?.tanks.length; x++) {
        const player = await logs[i]?.parses?.dps?.tanks[x]?.name;
        const role = "Tank";
        const encounter = await logs[i]?.name;
        const playerClass = await logs[i]?.parses?.dps?.tanks[x]?.class;
        const spec = await logs[i]?.parses?.dps?.tanks[x]?.spec;
        const dps = await Math.round(logs[i]?.parses?.dps?.tanks[x]?.amount);
        const hps = await Math.round(
          logs[i]?.parses?.healing?.tanks[x]?.amount
        );
        const dpsParse = await logs[i]?.parses?.dps?.tanks[x]?.rankPercent;
        const healingParse = await logs[i]?.parses?.healing?.tanks[x]
          ?.rankPercent;
        const dpsilvlParse = await logs[i]?.parses?.dps?.tanks[x]
          ?.bracketPercent;
        const healingilvlParse = await logs[i]?.parses?.healing?.tanks[x]
          .bracketPercent;
        const reportId = latestReportId;

        const { data, error } = await supabase
          .from("last_pull_rankings")
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
    for (let i = 0; i < logs.length; i++) {
      for (let x = 0; x < logs[i]?.parses?.dps?.healers.length; x++) {
        const player = await logs[i]?.parses?.dps?.healers[x]?.name;
        const role = "Healer";
        const encounter = await logs[i]?.name;
        const playerClass = await logs[i]?.parses?.dps?.healers[x]?.class;
        const spec = await logs[i]?.parses?.dps?.healers[x]?.spec;
        const dps = await Math.round(logs[i]?.parses?.dps?.healers[x]?.amount);
        const hps = await Math.round(
          logs[i]?.parses?.healing?.healers[x]?.amount
        );
        const dpsParse = await logs[i]?.parses?.dps?.healers[x]?.rankPercent;
        const healingParse = await logs[i]?.parses?.healing?.healers[x]
          ?.rankPercent;
        const dpsilvlParse = await logs[i]?.parses?.dps?.healers[x]
          ?.bracketPercent;
        const healingilvlParse = await logs[i]?.parses?.healing?.healers[x]
          .bracketPercent;
        const reportId = latestReportId;

        const { data, error } = await supabase
          .from("last_pull_rankings")
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
    for (let i = 0; i < logs.length; i++) {
      for (let x = 0; x < logs[i]?.parses?.dps?.dps.length; x++) {
        const player = await logs[i]?.parses?.dps?.dps[x]?.name;
        const role = "DPS";
        const encounter = await logs[i]?.name;
        const playerClass = await logs[i]?.parses?.dps?.dps[x]?.class;
        const spec = await logs[i]?.parses?.dps?.dps[x]?.spec;
        const dps = await Math.round(logs[i]?.parses?.dps?.dps[x]?.amount);
        const hps = await Math.round(logs[i]?.parses?.healing?.dps[x]?.amount);
        const dpsParse = await logs[i]?.parses?.dps?.dps[x]?.rankPercent;
        const healingParse = await logs[i]?.parses?.healing?.dps[x]
          ?.rankPercent;
        const dpsilvlParse = await logs[i]?.parses?.dps?.dps[x]?.bracketPercent;
        const healingilvlParse = await logs[i]?.parses?.healing?.dps[x]
          .bracketPercent;
        const reportId = latestReportId;

        const { data, error } = await supabase
          .from("last_pull_rankings")
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

// rankingUpload();

module.exports = lastPullRankingUpload;
