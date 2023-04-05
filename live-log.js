const getLatestReportId = require("./wc_log/get-latest-report-id");
const deathsUpload = require("./deaths-upload");
const resourceUpload = require("./resource-upload");
const rankingUpload = require("./ranking-upload");
const wclData = require("./wc_log/wc-logs");

const { createClient } = require("@supabase/supabase-js");
const { LOCAL_URL, LOCAL_KEY } = require("./config.json");

const supabase = createClient(
  process.env.SUPABASE_URL || LOCAL_URL,
  process.env.SUPABASE_ANON_KEY || LOCAL_KEY
);

// Function to delete all rows from the respective tables if there's a new log, or if the log has new updates
async function deleteAllRows() {
  // Delete from resources table
  const { resources, resourcesError } = await supabase
    .from("resources")
    .delete()
    .neq("player_name", "DELETE");
  if (resourcesError) {
    console.error(resourcesError);
  } else {
    console.log(`Deleted all rows from resources`);
  }

  // Delete from deaths table
  const { deaths, deathsError } = await supabase
    .from("deaths")
    .delete()
    .neq("player_name", "DELETE");
  if (deathsError) {
    console.error(deathsError);
  } else {
    console.log(`Deleted all rows from deaths`);
  }

  // Delete from ranking table
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

setInterval(async function () {
  const newestLog = await getLatestReportId(); // Pulls the latest log ID from WCL User Ogzuss
  // Pulls the current cached report ID and log time from the database
  const { data, error } = await supabase
    .from("latest_log")
    .select("report_id, log_time")
    .limit(1);
  if (error) {
    console.error(error);
    return;
  }

  const newLogCheck = data[0].report_id == newestLog; // Returns true if there's no new logs
  const time = await wclData("time"); // Pulls the current runtime from the log
  const newUpdateCheck = data[0].log_time == time; // Returns true if the log runtime matches the log_time column in the database

  if (newLogCheck) {
    // Check for new log
    console.log("No new log - checking time");
    if (newUpdateCheck) {
      // If no new log, check for new time within the log
      console.log("Log time is the same - no updates.");
    } else {
      // This runs if a new time is detected
      await deleteAllRows();
      await deathsUpload();
      await resourceUpload();
      await rankingUpload();
      console.log("Deleted old databases, updated databases with new log");
    }
  } else {
    // This runs if a new log is detected
    await deleteAllRows();
    await deathsUpload();
    await resourceUpload();
    await rankingUpload();
    console.log("Deleted old databases, updated databases with new log");
  }
}, 300000); // This runs every 5 minutes
