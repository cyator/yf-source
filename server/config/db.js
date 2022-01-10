require('dotenv').config;
const { Pool } = require('pg');

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;

const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;

const pool = new Pool({
	connectionString,
});

module.exports = pool;
