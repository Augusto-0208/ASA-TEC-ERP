// backend/src/controllers/pedidoController.js
// BLOCO: CONTROLLER DE PEDIDOS
const PedidoModel = require('../models/pedidoModel');

exports.listar = async (req, res) => {
  try {
    const pedidos = await PedidoModel.listar();
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar pedidos' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
    const pedido = await PedidoModel.buscarPorId(id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar pedido' });
  }
};

exports.criar = async (req, res) => {
  try {
    const dados = req.body;
    if (!dados.cliente) return res.status(400).json({ erro: 'Cliente é obrigatório' });
    const novo = await PedidoModel.criar(dados);
    res.status(201).json(novo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar pedido' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
    const dados = req.body;
    const atualizado = await PedidoModel.atualizar(id, dados);
    if (!atualizado) return res.status(404).json({ erro: 'Pedido não encontrado' });
    res.json(atualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar pedido' });
  }
};

exports.excluir = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
    await PedidoModel.excluir(id);
    res.json({ mensagem: 'Pedido excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir pedido' });
  }
};