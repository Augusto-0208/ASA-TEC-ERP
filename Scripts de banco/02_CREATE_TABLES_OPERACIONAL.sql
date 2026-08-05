/* =====================================================
   ASA TEC 3D ERP

   SCRIPT 02
   ESTRUTURA OPERACIONAL

   DATABASE:
   ASATECERP

   ===================================================== */


USE ASATECERP;
GO



/* =====================================================
   CLIENTES
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'Clientes'
)
BEGIN


CREATE TABLE Clientes
(

    IdCliente INT IDENTITY(1,1)
        CONSTRAINT PK_Clientes
        PRIMARY KEY,


    Nome VARCHAR(150)
        NOT NULL,


    Telefone VARCHAR(30),


    Email VARCHAR(150),


    Instagram VARCHAR(150),


    Endereco VARCHAR(250),


    Foto VARCHAR(250),


    Observacao VARCHAR(MAX),


    DataCadastro DATETIME
        DEFAULT GETDATE(),


    Ativo BIT
        DEFAULT 1

);


PRINT 'Tabela Clientes criada';


END
ELSE
BEGIN

PRINT 'Tabela Clientes já existe';

END

GO





/* =====================================================
   CATEGORIAS DE PRODUTOS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'CategoriasProduto'
)
BEGIN


CREATE TABLE CategoriasProduto
(

    IdCategoria INT IDENTITY(1,1)
        CONSTRAINT PK_CategoriasProduto
        PRIMARY KEY,


    Nome VARCHAR(100)
        NOT NULL,


    Descricao VARCHAR(250),


    Ativo BIT
        DEFAULT 1

);


PRINT 'Tabela CategoriasProduto criada';


END

GO





/* =====================================================
   PRODUTOS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'Produtos'
)
BEGIN


CREATE TABLE Produtos
(

    IdProduto INT IDENTITY(1,1)
        CONSTRAINT PK_Produtos
        PRIMARY KEY,


    IdCategoria INT,


    Nome VARCHAR(150)
        NOT NULL,


    Material VARCHAR(50),


    Cor VARCHAR(50),


    Peso DECIMAL(10,3),


    Custo DECIMAL(10,2),


    PrecoVenda DECIMAL(10,2),


    EstoqueAtual DECIMAL(10,3)
        DEFAULT 0,


    EstoqueMinimo DECIMAL(10,3)
        DEFAULT 0,


    Imagem VARCHAR(250),


    Descricao VARCHAR(MAX),


    DataCadastro DATETIME
        DEFAULT GETDATE(),


    Ativo BIT
        DEFAULT 1

);


PRINT 'Tabela Produtos criada';


END

GO





/* =====================================================
   MOVIMENTAÇÃO DE ESTOQUE
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'EstoqueMovimentos'
)
BEGIN


CREATE TABLE EstoqueMovimentos
(

    IdMovimento INT IDENTITY(1,1)
        CONSTRAINT PK_EstoqueMovimentos
        PRIMARY KEY,


    IdProduto INT
        NOT NULL,


    Tipo VARCHAR(20)
        NOT NULL,


    Quantidade DECIMAL(10,3)
        NOT NULL,


    Motivo VARCHAR(250),


    Usuario VARCHAR(100),


    DataMovimento DATETIME
        DEFAULT GETDATE()

);


PRINT 'Tabela EstoqueMovimentos criada';


END

GO





/* =====================================================
   PEDIDOS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'Pedidos'
)
BEGIN


CREATE TABLE Pedidos
(

    IdPedido INT IDENTITY(1,1)
        CONSTRAINT PK_Pedidos
        PRIMARY KEY,


    IdCliente INT
        NOT NULL,


    DataPedido DATE
        DEFAULT GETDATE(),


    DataEntrega DATE,


    Status VARCHAR(50)
        DEFAULT 'Pendente',


    ValorTotal DECIMAL(10,2)
        DEFAULT 0,


    Observacao VARCHAR(MAX),


    DataCadastro DATETIME
        DEFAULT GETDATE()

);


PRINT 'Tabela Pedidos criada';


END

GO





/* =====================================================
   ITENS DO PEDIDO
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'PedidoItens'
)
BEGIN


CREATE TABLE PedidoItens
(

    IdItem INT IDENTITY(1,1)
        CONSTRAINT PK_PedidoItens
        PRIMARY KEY,


    IdPedido INT
        NOT NULL,


    IdProduto INT,


    DescricaoProduto VARCHAR(150),


    Quantidade INT
        DEFAULT 1,


    ValorUnitario DECIMAL(10,2),


    ValorTotal DECIMAL(10,2)


);


PRINT 'Tabela PedidoItens criada';


END

GO





/* =====================================================
   HISTÓRICO DO PEDIDO
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'PedidoHistorico'
)
BEGIN


CREATE TABLE PedidoHistorico
(

    IdHistorico INT IDENTITY(1,1)
        CONSTRAINT PK_PedidoHistorico
        PRIMARY KEY,


    IdPedido INT
        NOT NULL,


    StatusAnterior VARCHAR(50),


    StatusNovo VARCHAR(50),


    Usuario VARCHAR(100),


    DataAlteracao DATETIME
        DEFAULT GETDATE()

);


PRINT 'Tabela PedidoHistorico criada';


END

GO





/* =====================================================
   PRODUÇÃO
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'Producao'
)
BEGIN


CREATE TABLE Producao
(

    IdProducao INT IDENTITY(1,1)
        CONSTRAINT PK_Producao
        PRIMARY KEY,


    IdPedido INT
        NOT NULL,


    Etapa VARCHAR(50),


    Inicio DATETIME,


    Fim DATETIME,


    Responsavel VARCHAR(100),


    Observacao VARCHAR(MAX)

);


PRINT 'Tabela Producao criada';


END

GO