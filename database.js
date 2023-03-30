const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://hvxjdgqkvuzoabdavzbs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eGpkZ3FrdnV6b2FiZGF2emJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MDE1NDQwNCwiZXhwIjoxOTk1NzMwNDA0fQ.jP2V9qTzbHtABbaRfoc56k1X0Dof9qlS5n5AElWR0Ms"
);

const databasePull = function () {
  return supabase
    .from("io")
    .select("*")
    .then((response) => {
      let playerData = {
        player: response["data"][0].player_name,
        score: response["data"][0].score,
        role: response["data"][0].role,
      };
      //   playerData.push(response["data"][0].id);
      return playerData;
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error fetching data");
    });
};

module.exports = databasePull;
