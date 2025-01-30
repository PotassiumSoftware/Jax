const { Pool } = require("pg");
const fs = require("fs");
const config = require("../../config.json");

const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.name,
  password: config.database.password,
  port: config.database.port
});

module.exports = { pool };
