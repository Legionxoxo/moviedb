const pkg = require("pg");
const {
    PG_IP,
    PG_PASSWORD,
    PG_PORT,
    PG_DATABASE,
    PG_USER,
} = require("../data/env");
const { Pool } = pkg;

const pool = new Pool({
    user: PG_USER,
    password: PG_PASSWORD,
    host: PG_IP,
    port: parseInt(PG_PORT || ""),
    database: PG_DATABASE,
});

pool.connect()
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.error("Connection error", err.stack));

module.exports = pool;
