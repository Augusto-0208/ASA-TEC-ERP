require("dotenv").config();

console.log(process.env.DB_SERVER);
console.log(process.env.DB_USER);
console.log(process.env.DB_DATABASE);


const sql = require("mssql");

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,

    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool;

async function conectarBanco() {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log("✅ Banco SQL Server conectado");
        }

        return pool;

    } catch (erro) {
        console.error("❌ Erro ao conectar no banco:", erro);
        throw erro;
    }
}

module.exports = {
    sql,
    conectarBanco
};