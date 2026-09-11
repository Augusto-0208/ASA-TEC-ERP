// backend/src/models/pedidoModel.js
// BLOCO: MODELO DE ACESSO A DADOS - PEDIDOS
const { getConnection, sql } = require('../database/connection');

class PedidoModel {
  // LISTAR TODOS OS PEDIDOS (com nome do cliente)
  static async listar() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        P.IdPedido AS id,
        P.IdCliente,
        C.Nome AS cliente,
        P.DataPedido AS data,
        P.DataEntrega AS dataEntrega,
        P.Status AS status,
        P.ValorTotal AS valor,
        P.Observacao AS observacao,
        '' AS fotoCliente,
        '' AS fotoProduto
      FROM Pedidos P
      INNER JOIN Clientes C ON C.IdCliente = P.IdCliente
      ORDER BY P.DataPedido DESC
    `);
    return result.recordset;
  }

  // BUSCAR PEDIDO POR ID
  static async buscarPorId(id) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          P.IdPedido AS id,
          P.IdCliente,
          C.Nome AS cliente,
          P.DataPedido AS data,
          P.DataEntrega AS dataEntrega,
          P.Status AS status,
          P.ValorTotal AS valor,
          P.Observacao AS observacao
        FROM Pedidos P
        INNER JOIN Clientes C ON C.IdCliente = P.IdCliente
        WHERE P.IdPedido = @id
      `);
    return result.recordset[0];
  }

  // CRIAR NOVO PEDIDO
  static async criar(dados) {
    const pool = await getConnection();
    // dados esperados: { cliente, produto, valor, data, dataEntrega, status, observacao }
    // Busca ou cria o cliente
    let idCliente;
    const clienteQuery = await pool.request()
      .input('nome', sql.VarChar(150), dados.cliente)
      .query('SELECT IdCliente FROM Clientes WHERE Nome = @nome');
    
    if (clienteQuery.recordset.length === 0) {
      const insertCliente = await pool.request()
        .input('nome', sql.VarChar(150), dados.cliente)
        .query(`
          INSERT INTO Clientes (Nome) VALUES (@nome);
          SELECT SCOPE_IDENTITY() AS Id;
        `);
      idCliente = insertCliente.recordset[0].Id;
    } else {
      idCliente = clienteQuery.recordset[0].IdCliente;
    }

    // Inserir pedido
    const result = await pool.request()
      .input('idCliente', sql.Int, idCliente)
      .input('dataPedido', sql.Date, dados.data || new Date().toISOString().split('T')[0])
      .input('dataEntrega', sql.Date, dados.dataEntrega || null)
      .input('status', sql.VarChar(50), dados.status || 'Pendente')
      .input('valorTotal', sql.Decimal(10,2), dados.valor || 0)
      .input('observacao', sql.VarChar(sql.MAX), dados.observacao || '')
      .query(`
        INSERT INTO Pedidos (IdCliente, DataPedido, DataEntrega, Status, ValorTotal, Observacao)
        VALUES (@idCliente, @dataPedido, @dataEntrega, @status, @valorTotal, @observacao);
        SELECT SCOPE_IDENTITY() AS Id;
      `);
    
    const idPedido = result.recordset[0].Id;

    // Se houver produto, adicionar como item (opcional)
    if (dados.produto) {
      await pool.request()
        .input('idPedido', sql.Int, idPedido)
        .input('descricao', sql.VarChar(150), dados.produto)
        .input('quantidade', sql.Int, 1)
        .input('valorUnitario', sql.Decimal(10,2), dados.valor || 0)
        .input('valorTotal', sql.Decimal(10,2), dados.valor || 0)
        .query(`
          INSERT INTO PedidoItens (IdPedido, DescricaoProduto, Quantidade, ValorUnitario, ValorTotal)
          VALUES (@idPedido, @descricao, @quantidade, @valorUnitario, @valorTotal)
        `);
    }

    // Retornar o pedido criado
    return await PedidoModel.buscarPorId(idPedido);
  }

  // ATUALIZAR PEDIDO
  static async atualizar(id, dados) {
    const pool = await getConnection();
    const campos = [];
    const request = pool.request().input('id', sql.Int, id);
    
    if (dados.status) {
      campos.push('Status = @status');
      request.input('status', sql.VarChar(50), dados.status);
    }
    if (dados.dataEntrega) {
      campos.push('DataEntrega = @dataEntrega');
      request.input('dataEntrega', sql.Date, dados.dataEntrega);
    }
    if (dados.valor !== undefined) {
      campos.push('ValorTotal = @valor');
      request.input('valor', sql.Decimal(10,2), dados.valor);
    }
    if (dados.observacao !== undefined) {
      campos.push('Observacao = @observacao');
      request.input('observacao', sql.VarChar(sql.MAX), dados.observacao);
    }
    // Não atualizamos cliente aqui (para simplificar)

    if (campos.length === 0) return await PedidoModel.buscarPorId(id);

    const query = `UPDATE Pedidos SET ${campos.join(', ')} WHERE IdPedido = @id`;
    await request.query(query);
    return await PedidoModel.buscarPorId(id);
  }

  // EXCLUIR PEDIDO (e itens)
  static async excluir(id) {
    const pool = await getConnection();
    await pool.request().input('id', sql.Int, id).query('DELETE FROM PedidoItens WHERE IdPedido = @id');
    await pool.request().input('id', sql.Int, id).query('DELETE FROM Pedidos WHERE IdPedido = @id');
    return true;
  }
}

module.exports = PedidoModel;