/* =====================================================
   ASA TEC 3D ERP

   SCRIPT 03
   FINANCEIRO E CONSIGNADOS

   DATABASE:
   ASATECERP

   ===================================================== */


USE ASATECERP;
GO



/* =====================================================
   CONTAS A RECEBER
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'ContasReceber'
)
BEGIN


CREATE TABLE ContasReceber
(

    IdContaReceber INT IDENTITY(1,1)
        CONSTRAINT PK_ContasReceber
        PRIMARY KEY,


    IdPedido INT,


    IdCliente INT,


    Descricao VARCHAR(250),


    Valor DECIMAL(10,2)
        NOT NULL,


    Vencimento DATE,


    DataPagamento DATE,


    Status VARCHAR(30)
        DEFAULT 'Aberto',


    Observacao VARCHAR(MAX),


    DataCadastro DATETIME
        DEFAULT GETDATE()

);


PRINT 'Tabela ContasReceber criada';


END

GO





/* =====================================================
   CONTAS A PAGAR
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'ContasPagar'
)
BEGIN


CREATE TABLE ContasPagar
(

    IdContaPagar INT IDENTITY(1,1)
        CONSTRAINT PK_ContasPagar
        PRIMARY KEY,


    Descricao VARCHAR(250)
        NOT NULL,


    Categoria VARCHAR(100),


    Fornecedor VARCHAR(150),


    Valor DECIMAL(10,2)
        NOT NULL,


    Vencimento DATE,


    DataPagamento DATE,


    Status VARCHAR(30)
        DEFAULT 'Aberto',


    Observacao VARCHAR(MAX),


    DataCadastro DATETIME
        DEFAULT GETDATE()

);


PRINT 'Tabela ContasPagar criada';


END

GO





/* =====================================================
   INVESTIMENTOS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'Investimentos'
)
BEGIN


CREATE TABLE Investimentos
(

    IdInvestimento INT IDENTITY(1,1)
        CONSTRAINT PK_Investimentos
        PRIMARY KEY,


    Descricao VARCHAR(250)
        NOT NULL,


    Categoria VARCHAR(100),


    Valor DECIMAL(10,2)
        NOT NULL,


    DataInvestimento DATE,


    FormaPagamento VARCHAR(50),


    Observacao VARCHAR(MAX),


    DataCadastro DATETIME
        DEFAULT GETDATE()

);


PRINT 'Tabela Investimentos criada';


END

GO





/* =====================================================
   FLUXO DE CAIXA
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'FluxoCaixa'
)
BEGIN


CREATE TABLE FluxoCaixa
(

    IdFluxo INT IDENTITY(1,1)
        CONSTRAINT PK_FluxoCaixa
        PRIMARY KEY,


    Tipo VARCHAR(20)
        NOT NULL,


    Origem VARCHAR(50),


    IdOrigem INT,


    Descricao VARCHAR(250),


    Valor DECIMAL(10,2)
        NOT NULL,


    DataMovimento DATE
        DEFAULT GETDATE(),


    Usuario VARCHAR(100),


    Observacao VARCHAR(MAX)

);


PRINT 'Tabela FluxoCaixa criada';


END

GO





/* =====================================================
   CONSIGNADOS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'Consignados'
)
BEGIN


CREATE TABLE Consignados
(

    IdConsignado INT IDENTITY(1,1)
        CONSTRAINT PK_Consignados
        PRIMARY KEY,


    IdCliente INT
        NOT NULL,


    DataEntrega DATE,


    DataAcerto DATE,


    Status VARCHAR(30)
        DEFAULT 'Aberto',


    Observacao VARCHAR(MAX),


    DataCadastro DATETIME
        DEFAULT GETDATE()

);


PRINT 'Tabela Consignados criada';


END

GO





/* =====================================================
   ITENS DO CONSIGNADO
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'ConsignadoItens'
)
BEGIN


CREATE TABLE ConsignadoItens
(

    IdItemConsignado INT IDENTITY(1,1)
        CONSTRAINT PK_ConsignadoItens
        PRIMARY KEY,


    IdConsignado INT
        NOT NULL,


    IdProduto INT,


    ProdutoDescricao VARCHAR(150),


    Quantidade INT
        DEFAULT 1,


    ValorUnitario DECIMAL(10,2),


    QuantidadeVendida INT
        DEFAULT 0,


    QuantidadeDevolvida INT
        DEFAULT 0


);


PRINT 'Tabela ConsignadoItens criada';


END

GO