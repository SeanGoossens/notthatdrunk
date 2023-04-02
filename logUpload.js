// This file grabs all the relevant columns to prepare for SQL input

const parseLog = require("./parseLog");

async function sanitize() {
  const grabData = await parseLog();
  console.log(grabData);
}

sanitize();
