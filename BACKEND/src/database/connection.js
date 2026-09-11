// backend/src/database/connection.js
// BLOCO: CONEXÃO COM SQL SERVER
const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool = null;

async function getConnection() {
  if (pool) return pool;
  try {
    pool = await sql.connect(config);
    console.log('✅ Conectado ao SQL Server');
    return pool;
  } catch (err) {
    console.error('❌ Erro ao conectar:', err);
    throw err;
  }
}

module.exports = { getConnection, sql };