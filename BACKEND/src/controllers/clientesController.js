const { conectarBanco, sql } = require("../database/connection");


// LISTAR CLIENTES
async function listarClientes(req, res) {

    try {

        const banco = await conectarBanco();

        const resultado = await banco.request()
            .query(`
                SELECT *
                FROM Clientes
                WHERE Ativo = 1
                ORDER BY Nome
            `);

        res.json(resultado.recordset);

    } catch (erro) {

        res.status(500).json({
            erro: "Erro ao listar clientes",
            detalhe: erro.message
        });

    }
}


// BUSCAR POR ID
async function buscarCliente(req,res){

    try {

        const banco = await conectarBanco();

        const resultado = await banco.request()
            .input(
                "IdCliente",
                sql.Int,
                req.params.id
            )
            .query(`
                SELECT *
                FROM Clientes
                WHERE IdCliente = @IdCliente
            `);


        if(resultado.recordset.length === 0){
            return res.status(404).json({
                mensagem:"Cliente não encontrado"
            });
        }


        res.json(resultado.recordset[0]);


    } catch(erro){

        res.status(500).json({
            erro:"Erro ao buscar cliente",
            detalhe:erro.message
        });

    }
}



// CRIAR CLIENTE
async function criarCliente(req,res){

    try {

        const {
            Nome,
            Telefone,
            Email,
            Instagram,
            Endereco,
            Foto,
            Observacao
        } = req.body;


        const banco = await conectarBanco();


        const resultado = await banco.request()

            .input("Nome",sql.VarChar,Nome)
            .input("Telefone",sql.VarChar,Telefone)
            .input("Email",sql.VarChar,Email)
            .input("Instagram",sql.VarChar,Instagram)
            .input("Endereco",sql.VarChar,Endereco)
            .input("Foto",sql.VarChar,Foto)
            .input("Observacao",sql.VarChar,Observacao)

            .query(`

                INSERT INTO Clientes
                (
                    Nome,
                    Telefone,
                    Email,
                    Instagram,
                    Endereco,
                    Foto,
                    Observacao,
                    DataCadastro,
                    Ativo
                )

                OUTPUT INSERTED.*

                VALUES
                (
                    @Nome,
                    @Telefone,
                    @Email,
                    @Instagram,
                    @Endereco,
                    @Foto,
                    @Observacao,
                    GETDATE(),
                    1
                )

            `);


        res.status(201).json(resultado.recordset[0]);


    }catch(erro){

        res.status(500).json({
            erro:"Erro ao criar cliente",
            detalhe:erro.message
        });

    }

}



// DESATIVAR CLIENTE
async function excluirCliente(req,res){

    try {

        const banco = await conectarBanco();


        await banco.request()

        .input(
            "IdCliente",
            sql.Int,
            req.params.id
        )

        .query(`

            UPDATE Clientes
            SET Ativo = 0
            WHERE IdCliente = @IdCliente

        `);


        res.json({
            mensagem:"Cliente desativado com sucesso"
        });


    }catch(erro){

        res.status(500).json({
            erro:"Erro ao desativar cliente",
            detalhe:erro.message
        });

    }

}


module.exports = {
    listarClientes,
    buscarCliente,
    criarCliente,
    excluirCliente
};