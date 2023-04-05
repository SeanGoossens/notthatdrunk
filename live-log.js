const getLatestReportId = require("./wc_log/get-latest-report-id");
const deathsUpload = require("./deaths-upload");
const resourceUpload = require("./resource-upload");
const rankingUpload = require("./ranking-upload");

const { createClient } = require("@supabase/supabase-js");
const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL || LOCAL_URL,
  process.env.SUPABASE_ANON_KEY || LOCAL_KEY
);

async function deleteAllRows() {
  const { resources, resourcesError } = await supabase
    .from("resources")
    .delete()
    .neq("player_name", "DELETE");
  if (resourcesError) {
    console.error(resourcesError);
  } else {
    console.log(`Deleted all rows from resources`);
  }
  const { deaths, deathsError } = await supabase
    .from("deaths")
    .delete()
    .neq("player_name", "DELETE");
  if (deathsError) {
    console.error(deathsError);
  } else {
    console.log(`Deleted all rows from deaths`);
  }
  const { ranking, rankingError } = await supabase
    .from("latest_log")
    .delete()
    .neq("player_name", "DELETE");
  if (rankingError) {
    console.error(rankingError);
  } else {
    console.log(`Deleted all rows from latest_log`);
  }
}

// deleteAllRows();
setInterval(async function () {
  const newestLog = await getLatestReportId();
  const { data, error } = await supabase
    .from("latest_log")
    .select("report_id")
    .limit(1);
  if (error) {
    console.error(error);
    return;
  }
  const newLogCheck = data[0].report_id == newestLog;
  if (newLogCheck) {
    console.log("No new log.");
  } else {
    await deleteAllRows();
    await deathsUpload();
    await resourceUpload();
    await rankingUpload();
    console.log("Deleted old databases, updated databases with new log");
  }
  // Code to run every 30 seconds goes here
}, 300000);
