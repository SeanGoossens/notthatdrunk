require("dotenv").config();
const databasePull = require("./database.js");

async function runCount() {
  let data = await databasePull();
  let weeklyRuns = data.weeklyRuns;
  let tuesdayCounter = 0;
  let wednesdayCounter = 0;
  let thursdayCounter = 0;
  let fridayCounter = 0;
  let saturdayCounter = 0;
  let sundayCounter = 0;
  let mondayCounter = 0;
  for (i = 0; i < weeklyRuns.length; i++) {
    switch (weeklyRuns[i].date) {
      case "Tuesday":
        tuesdayCounter++;
        break;
      case "Wednesday":
        wednesdayCounter++;
        break;
      case "Thursday":
        thursdayCounter++;
        break;
      case "Friday":
        fridayCounter++;
        break;
      case "Saturday":
        saturdayCounter++;
        break;
      case "Sunday":
        sundayCounter++;
        break;
      case "Monday":
        mondayCounter++;
        break;
      default:
        // Do nothing
        break;
    }
  }
  let runCount = {
    tuesday: tuesdayCounter,
    wednesday: wednesdayCounter,
    thursday: thursdayCounter,
    friday: fridayCounter,
    saturday: saturdayCounter,
    sunday: sundayCounter,
    monday: mondayCounter,
    total:
      tuesdayCounter +
      wednesdayCounter +
      thursdayCounter +
      fridayCounter +
      saturdayCounter +
      sundayCounter +
      mondayCounter,
  };
  return runCount;
  //   console.log(runCount);
}

// runCount();

module.exports = runCount;
