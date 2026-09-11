// backend/src/models/clienteModel.js
// BLOCO: MODELO DE ACESSO A DADOS - CLIENTES
const { getConnection, sql } = require('../database/connection');

class ClienteModel {
  // LISTAR TODOS OS CLIENTES
  static async listar() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        IdCliente AS id,
        Nome AS nome,
        Telefone AS telefone,
        Email AS email,
        Instagram AS instagram,
        Endereco AS endereco,
        Foto AS foto,
        Observacao AS observacao,
        Ativo AS ativo,
        DataCadastro AS dataCadastro
      FROM Clientes
      WHERE Ativo = 1
      ORDER BY Nome
    `);
    return result.recordset;
  }

  // BUSCAR CLIENTE POR ID
  static async buscarPorId(id) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          IdCliente AS id,
          Nome AS nome,
          Telefone AS telefone,
          Email AS email,
          Instagram AS instagram,
          Endereco AS endereco,
          Foto AS foto,
          Observacao AS observacao,
          Ativo AS ativo,
          DataCadastro AS dataCadastro
        FROM Clientes
        WHERE IdCliente = @id
      `);
    return result.recordset[0];
  }

  // CRIAR NOVO CLIENTE
  static async criar(dados) {
    const pool = await getConnection();
    // dados esperados: { nome, telefone, email, instagram, endereco, foto, observacao }
    const result = await pool.request()
      .input('nome', sql.VarChar(150), dados.nome)
      .input('telefone', sql.VarChar(30), dados.telefone || '')
      .input('email', sql.VarChar(150), dados.email || '')
      .input('instagram', sql.VarChar(150), dados.instagram || '')
      .input('endereco', sql.VarChar(250), dados.endereco || '')
      .input('foto', sql.VarChar(250), dados.foto || '')
      .input('observacao', sql.VarChar(sql.MAX), dados.observacao || '')
      .query(`
        INSERT INTO Clientes (Nome, Telefone, Email, Instagram, Endereco, Foto, Observacao)
        VALUES (@nome, @telefone, @email, @instagram, @endereco, @foto, @observacao);
        SELECT SCOPE_IDENTITY() AS Id;
      `);
    const idCliente = result.recordset[0].Id;
    return await ClienteModel.buscarPorId(idCliente);
  }

  // ATUALIZAR CLIENTE
  static async atualizar(id, dados) {
    const pool = await getConnection();
    const campos = [];
    const request = pool.request().input('id', sql.Int, id);

    if (dados.nome) {
      campos.push('Nome = @nome');
      request.input('nome', sql.VarChar(150), dados.nome);
    }
    if (dados.telefone !== undefined) {
      campos.push('Telefone = @telefone');
      request.input('telefone', sql.VarChar(30), dados.telefone);
    }
    if (dados.email !== undefined) {
      campos.push('Email = @email');
      request.input('email', sql.VarChar(150), dados.email);
    }
    if (dados.instagram !== undefined) {
      campos.push('Instagram = @instagram');
      request.input('instagram', sql.VarChar(150), dados.instagram);
    }
    if (dados.endereco !== undefined) {
      campos.push('Endereco = @endereco');
      request.input('endereco', sql.VarChar(250), dados.endereco);
    }
    if (dados.foto !== undefined) {
      campos.push('Foto = @foto');
      request.input('foto', sql.VarChar(250), dados.foto);
    }
    if (dados.observacao !== undefined) {
      campos.push('Observacao = @observacao');
      request.input('observacao', sql.VarChar(sql.MAX), dados.observacao);
    }
    if (dados.ativo !== undefined) {
      campos.push('Ativo = @ativo');
      request.input('ativo', sql.Bit, dados.ativo);
    }

    if (campos.length === 0) return await ClienteModel.buscarPorId(id);

    const query = `UPDATE Clientes SET ${campos.join(', ')} WHERE IdCliente = @id`;
    await request.query(query);
    return await ClienteModel.buscarPorId(id);
  }

  // EXCLUIR CLIENTE (desativar, não deletar fisicamente)
  static async excluir(id) {
    const pool = await getConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE Clientes SET Ativo = 0 WHERE IdCliente = @id');
    return true;
  }
}

module.exports = ClienteModel;