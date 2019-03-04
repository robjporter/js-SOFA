const dbPath = __dirname + "/data/sofa.db";
const sqlite3 = require("sqlite3").verbose();
const Store = require("openrecord");
const store = new Store({
  type: "sqlite3",
  file: dbPath,
  autoLoad: true,
  models: [require("../server/models/user.js")]
});

async function start() {
  await store.ready();
}

function finished() {
  store.close(finished);
  console.log("DB Closed");
}

start().then(finished);
