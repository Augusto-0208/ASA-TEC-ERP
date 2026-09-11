// backend/src/controllers/clientesController.js
// BLOCO: CONTROLLER DE CLIENTES
const ClienteModel = require('../models/clienteModel');

// LISTAR TODOS
exports.listarClientes = async (req, res) => {
  try {
    const clientes = await ClienteModel.listar();
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ erro: 'Erro ao listar clientes' });
  }
};

// BUSCAR POR ID
exports.buscarCliente = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
    const cliente = await ClienteModel.buscarPorId(id);
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ erro: 'Erro ao buscar cliente' });
  }
};

// CRIAR NOVO CLIENTE
exports.criarCliente = async (req, res) => {
  try {
    const dados = req.body;
    if (!dados.nome) return res.status(400).json({ erro: 'Nome é obrigatório' });
    const novo = await ClienteModel.criar(dados);
    res.status(201).json(novo);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ erro: 'Erro ao criar cliente' });
  }
};

// ATUALIZAR CLIENTE
exports.atualizarCliente = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
    const dados = req.body;
    const atualizado = await ClienteModel.atualizar(id, dados);
    if (!atualizado) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json(atualizado);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
};

// EXCLUIR (DESATIVAR) CLIENTE
exports.excluirCliente = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
    await ClienteModel.excluir(id);
    res.json({ mensagem: 'Cliente desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ erro: 'Erro ao excluir cliente' });
  }
};