// backend/src/server.js
// BLOCO 1: IMPORTAÇÕES
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getConnection } = require('./database/connection');

const app = express();

// BLOCO 2: MIDDLEWARES
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// BLOCO 3: SERVIR ARQUIVOS ESTÁTICOS (FRONTEND)
app.use(express.static(path.join(__dirname, '../../frontend')));

// BLOCO 4: ROTAS DA API
const pedidoRoutes = require('./routes/pedidoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const authRoutes = require('./routes/authRoutes'); // 👈 ROTA DE LOGIN
const authMiddleware = require('./middlewares/authMiddleware'); // 👈 MIDDLEWARE JWT

// 🔍 Middleware de debug para clientes
app.use('/api/clientes', (req, res, next) => {
  console.log('✅ ROTA /api/clientes FOI ACIONADA!');
  next();
});

// 🔍 Middleware de debug para pedidos
app.use('/api/pedidos', (req, res, next) => {
  console.log('✅ ROTA /api/pedidos FOI ACIONADA!');
  next();
});

// 🔍 Middleware de debug para autenticação
app.use('/api/auth', (req, res, next) => {
  console.log('✅ ROTA /api/auth FOI ACIONADA!');
  next();
});

// BLOCO 5: REGISTRO DAS ROTAS

// 🔓 Rota pública — login (não exige token)
app.use('/api/auth', authRoutes);

// 🔒 Rotas protegidas — exigem token JWT válido
app.use('/api/pedidos', authMiddleware, pedidoRoutes);
app.use('/api/clientes', authMiddleware, clienteRoutes);

// BLOCO 6: INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📁 Frontend disponível em http://localhost:${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
  console.log(`🔐 Login disponível em http://localhost:${PORT}/api/auth/login`);
  console.log(`🛡️  Rotas protegidas: /api/clientes e /api/pedidos`);

  try {
    await getConnection();
    console.log('✅ Conexão com SQL Server OK');
  } catch (err) {
    console.error('❌ Falha no banco:', err);
  }
});

// Mantém o processo vivo e escutando erros do servidor
server.on('error', (err) => {
  console.error('❌ Erro no servidor HTTP:', err);
});

// Keep-alive
setInterval(() => {
  // console.log('Keep-alive...');
}, 1000 * 60 * 60);