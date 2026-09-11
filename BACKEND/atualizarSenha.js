// backend/atualizarSenha.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { getConnection } = require('./src/database/connection');

(async () => {
    const hash = await bcrypt.hash('ADMIN', 10);
    const pool = await getConnection();

    await pool.request()
        .input('hash', hash)
        .input('nome', 'GUILHERME')
        .query('UPDATE Usuarios SET SenhaHash = @hash WHERE Nome = @nome');

    console.log('✅ Senha do GUILHERME atualizada para "ADMIN"');
    process.exit();
})();