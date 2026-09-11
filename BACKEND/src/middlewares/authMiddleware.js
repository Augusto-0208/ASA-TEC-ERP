// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Pega o token do header "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'asa_tec_secret');
    req.usuario = decoded; // deixa o usuário disponível nas rotas
    next(); // libera a passagem
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};