/* =====================================================
   ASA TEC 3D ERP
   BANCO DE DADOS SQL SERVER EXPRESS

   DATABASE EXISTENTE:
   ASATECERP

   SCRIPT 01
   CONFIGURAÇÕES INICIAIS
   ===================================================== */


USE ASATECERP;
GO



/* =====================================================
   CONFIGURAÇÕES GERAIS DO ERP
   ===================================================== */

IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'Configuracoes'
)
BEGIN

CREATE TABLE Configuracoes
(

    IdConfiguracao INT IDENTITY(1,1)
        CONSTRAINT PK_Configuracoes
        PRIMARY KEY,


    Chave VARCHAR(100)
        NOT NULL,


    Valor VARCHAR(MAX),


    DataAlteracao DATETIME
        DEFAULT GETDATE()

);

PRINT 'Tabela Configuracoes criada';

END
ELSE
BEGIN

PRINT 'Tabela Configuracoes já existe';

END
GO





/* =====================================================
   USUÁRIOS DO SISTEMA
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'Usuarios'
)
BEGIN


CREATE TABLE Usuarios
(

    IdUsuario INT IDENTITY(1,1)
        CONSTRAINT PK_Usuarios
        PRIMARY KEY,


    Nome VARCHAR(100)
        NOT NULL,


    Email VARCHAR(150)
        NOT NULL
        UNIQUE,


    SenhaHash VARCHAR(255)
        NOT NULL,


    Perfil VARCHAR(30)
        NOT NULL,


    Ativo BIT
        DEFAULT 1,


    DataCadastro DATETIME
        DEFAULT GETDATE()

);


PRINT 'Tabela Usuarios criada';


END
ELSE
BEGIN

PRINT 'Tabela Usuarios já existe';

END
GO





/* =====================================================
   AUDITORIA DO SISTEMA
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM sys.tables
    WHERE name = 'Auditoria'
)
BEGIN


CREATE TABLE Auditoria
(

    IdAuditoria INT IDENTITY(1,1)
        CONSTRAINT PK_Auditoria
        PRIMARY KEY,


    Usuario VARCHAR(100),


    Acao VARCHAR(100),


    Tabela VARCHAR(100),


    Registro INT,


    Data DATETIME
        DEFAULT GETDATE()

);


PRINT 'Tabela Auditoria criada';


END
ELSE
BEGIN

PRINT 'Tabela Auditoria já existe';

END
GO