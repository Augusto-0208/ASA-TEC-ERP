// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../database/connection');

// ============================================================
// ROTA: POST /api/auth/login
// Body esperado: { usuario: "GUILHERME", senha: "ADMIN" }
//              ou { email: "admin@asatec3d.com", senha: "admin123" }
// ============================================================
router.post('/login', async (req, res) => {
    // Aceita tanto 'usuario' (frontend) quanto 'email' (postman)
    const loginInput = req.body.usuario || req.body.email;
    const senha = req.body.senha;

    // 1️⃣ Validação básica
    if (!loginInput || !senha) {
        return res.status(400).json({ erro: 'Usuário/Email e senha são obrigatórios.' });
    }

    try {
        // 2️⃣ Obtém a conexão com o SQL Server
        const pool = await getConnection();

        // 3️⃣ Busca o usuário por Nome OU Email
        const result = await pool.request()
            .input('login', loginInput)
            .query(`
                SELECT IdUsuario, Nome, Email, SenhaHash
                FROM Usuarios
                WHERE Nome = @login OR Email = @login
            `);

        // 4️⃣ Usuário não encontrado
        if (result.recordset.length === 0) {
            return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
        }

        const user = result.recordset[0];

        // 5️⃣ Verifica se o hash é válido (evita erro com 'ALTERAR_NO_BACKEND')
        if (!user.SenhaHash || user.SenhaHash === 'ALTERAR_NO_BACKEND') {
            return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
        }

        // 6️⃣ Compara a senha enviada com o hash do banco
        const senhaValida = await bcrypt.compare(senha, user.SenhaHash);

        if (!senhaValida) {
            return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
        }

        // 7️⃣ Gera o token JWT
        const token = jwt.sign(
            { id: user.IdUsuario, nome: user.Nome, email: user.Email },
            process.env.JWT_SECRET || 'asa_tec_secret',
            { expiresIn: '8h' }
        );

        // 8️⃣ Retorna sucesso
        return res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token: token,
            usuario: {
                id: user.IdUsuario,
                nome: user.Nome,
                email: user.Email
            }
        });

    } catch (error) {
        console.error('❌ Erro no login:', error);
        return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
});

module.exports = router;