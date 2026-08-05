/* =====================================================
   ASA TEC 3D ERP

   SCRIPT 04
   RELACIONAMENTOS
   INDICES
   VIEWS

   DATABASE:
   ASATECERP

   ===================================================== */


USE ASATECERP;
GO



/* =====================================================
   FOREIGN KEY
   CLIENTES -> PEDIDOS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Pedidos_Clientes'
)
BEGIN

ALTER TABLE Pedidos

ADD CONSTRAINT FK_Pedidos_Clientes

FOREIGN KEY(IdCliente)

REFERENCES Clientes(IdCliente);


PRINT 'FK Pedidos Clientes criada';

END

GO





/* =====================================================
   PRODUTOS -> CATEGORIA
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Produtos_Categoria'
)
BEGIN

ALTER TABLE Produtos

ADD CONSTRAINT FK_Produtos_Categoria

FOREIGN KEY(IdCategoria)

REFERENCES CategoriasProduto(IdCategoria);


PRINT 'FK Produtos Categoria criada';

END

GO





/* =====================================================
   ESTOQUE -> PRODUTOS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Estoque_Produto'
)
BEGIN

ALTER TABLE EstoqueMovimentos

ADD CONSTRAINT FK_Estoque_Produto

FOREIGN KEY(IdProduto)

REFERENCES Produtos(IdProduto);


PRINT 'FK Estoque Produto criada';

END

GO





/* =====================================================
   PEDIDO ITENS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_PedidoItens_Pedido'
)
BEGIN


ALTER TABLE PedidoItens

ADD CONSTRAINT FK_PedidoItens_Pedido

FOREIGN KEY(IdPedido)

REFERENCES Pedidos(IdPedido);


END

GO



IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_PedidoItens_Produto'
)
BEGIN


ALTER TABLE PedidoItens

ADD CONSTRAINT FK_PedidoItens_Produto

FOREIGN KEY(IdProduto)

REFERENCES Produtos(IdProduto);


END

GO





/* =====================================================
   HISTORICO PEDIDO
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Historico_Pedido'
)
BEGIN


ALTER TABLE PedidoHistorico

ADD CONSTRAINT FK_Historico_Pedido

FOREIGN KEY(IdPedido)

REFERENCES Pedidos(IdPedido);


END

GO





/* =====================================================
   PRODUÇÃO
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Producao_Pedido'
)
BEGIN


ALTER TABLE Producao

ADD CONSTRAINT FK_Producao_Pedido

FOREIGN KEY(IdPedido)

REFERENCES Pedidos(IdPedido);


END

GO





/* =====================================================
   FINANCEIRO
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_ContaReceber_Pedido'
)
BEGIN


ALTER TABLE ContasReceber

ADD CONSTRAINT FK_ContaReceber_Pedido

FOREIGN KEY(IdPedido)

REFERENCES Pedidos(IdPedido);


END

GO



IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_ContaReceber_Cliente'
)
BEGIN


ALTER TABLE ContasReceber

ADD CONSTRAINT FK_ContaReceber_Cliente

FOREIGN KEY(IdCliente)

REFERENCES Clientes(IdCliente);


END

GO





/* =====================================================
   CONSIGNADOS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_Consignado_Cliente'
)
BEGIN


ALTER TABLE Consignados

ADD CONSTRAINT FK_Consignado_Cliente

FOREIGN KEY(IdCliente)

REFERENCES Clientes(IdCliente);


END

GO



IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_ConsignadoItem_Consignado'
)
BEGIN


ALTER TABLE ConsignadoItens

ADD CONSTRAINT FK_ConsignadoItem_Consignado

FOREIGN KEY(IdConsignado)

REFERENCES Consignados(IdConsignado);


END

GO





/* =====================================================
   INDICES DE PERFORMANCE
   ===================================================== */


CREATE INDEX IX_Clientes_Nome

ON Clientes(Nome);

GO


CREATE INDEX IX_Produtos_Nome

ON Produtos(Nome);

GO


CREATE INDEX IX_Pedidos_Status

ON Pedidos(Status);

GO


CREATE INDEX IX_Pedidos_DataEntrega

ON Pedidos(DataEntrega);

GO


CREATE INDEX IX_FluxoCaixa_Data

ON FluxoCaixa(DataMovimento);

GO


CREATE INDEX IX_ContasReceber_Status

ON ContasReceber(Status);

GO


CREATE INDEX IX_ContasPagar_Status

ON ContasPagar(Status);

GO





/* =====================================================
   VIEW DASHBOARD
   ===================================================== */


IF OBJECT_ID('VW_Dashboard_Resumo','V') IS NOT NULL

DROP VIEW VW_Dashboard_Resumo;

GO


CREATE VIEW VW_Dashboard_Resumo

AS

SELECT

    COUNT(*) AS TotalPedidos,

    SUM(ValorTotal) AS ValorPedidos,


    SUM
    (
        CASE
        WHEN Status = 'Entregue'
        THEN 1
        ELSE 0
        END
    ) AS PedidosEntregues


FROM Pedidos;

GO





/* =====================================================
   VIEW FINANCEIRO
   ===================================================== */


IF OBJECT_ID('VW_Financeiro_Resumo','V') IS NOT NULL

DROP VIEW VW_Financeiro_Resumo;

GO


CREATE VIEW VW_Financeiro_Resumo

AS


SELECT

(
SELECT ISNULL(SUM(Valor),0)
FROM ContasReceber
WHERE Status='Pago'
)

AS Receita,


(
SELECT ISNULL(SUM(Valor),0)
FROM ContasPagar
WHERE Status='Pago'
)

AS Despesas,


(
SELECT ISNULL(SUM(Valor),0)
FROM Investimentos
)

AS Investimentos;

GO





/* =====================================================
   VIEW PEDIDOS CLIENTES
   ===================================================== */


IF OBJECT_ID('VW_Pedidos_Clientes','V') IS NOT NULL

DROP VIEW VW_Pedidos_Clientes;

GO



CREATE VIEW VW_Pedidos_Clientes

AS


SELECT


P.IdPedido,

C.Nome AS Cliente,


P.DataPedido,

P.DataEntrega,

P.Status,

P.ValorTotal


FROM Pedidos P


INNER JOIN Clientes C

ON C.IdCliente = P.IdCliente;


GO