const {client, createTables} = require('./db');

const init = async()=> {
console.log("Connecting the database")
await client.connect();
console.log("Connected to the database");
await createTables();
console.log("Tables created");
  }
  init();