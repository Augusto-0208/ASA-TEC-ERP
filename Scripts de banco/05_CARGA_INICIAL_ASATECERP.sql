/* =====================================================
   ASA TEC 3D ERP

   SCRIPT 05
   CARGA INICIAL DO SISTEMA

   DATABASE:
   ASATECERP

   ===================================================== */


USE ASATECERP;
GO



/* =====================================================
   USUARIO ADMINISTRADOR INICIAL
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM Usuarios
    WHERE Email = 'admin@asatec3d.com'
)

BEGIN


INSERT INTO Usuarios
(

    Nome,

    Email,

    SenhaHash,

    Perfil

)

VALUES
(

    'Administrador ASA TEC',

    'admin@asatec3d.com',

    'ALTERAR_NO_BACKEND',

    'ADMIN'

);


PRINT 'Usuário administrador criado';


END

GO





/* =====================================================
   CONFIGURAÇÕES EMPRESA
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM Configuracoes
    WHERE Chave='empresa_nome'
)

BEGIN


INSERT INTO Configuracoes
(
    Chave,
    Valor
)

VALUES

('empresa_nome',
 'ASA TEC 3D'),


('empresa_descricao',
 'ERP Impressão 3D'),


('tema',
 'claro'),


('moeda',
 'BRL'),


('instagram',
 ''),


('whatsapp',
 ''),


('site',
 '');



PRINT 'Configurações iniciais criadas';


END

GO





/* =====================================================
   CATEGORIAS PRODUTOS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM CategoriasProduto
)

BEGIN


INSERT INTO CategoriasProduto

(
 Nome,
 Descricao
)

VALUES

(
 'Filamentos',
 'Materiais para impressão 3D'
),


(
 'Peças Impressas',
 'Produtos fabricados em impressão 3D'
),


(
 'Projetos Personalizados',
 'Modelos desenvolvidos sob demanda'
),


(
 'Acessórios',
 'Itens complementares'
);



PRINT 'Categorias criadas';


END

GO





/* =====================================================
   CONFIGURAÇÃO DE STATUS DOS PEDIDOS
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM Configuracoes
    WHERE Chave='status_pedidos'
)

BEGIN


INSERT INTO Configuracoes
(
Chave,
Valor
)

VALUES

(
'status_pedidos',
'Pendente;Modelagem;Imprimindo;Pós-processo;Pronto;Entregue;Cancelado'
);


END

GO





/* =====================================================
   STATUS FINANCEIRO
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM Configuracoes
    WHERE Chave='status_financeiro'
)

BEGIN


INSERT INTO Configuracoes
(
Chave,
Valor
)

VALUES

(
'status_financeiro',
'Aberto;Pago;Vencido;Cancelado'
);


END

GO





/* =====================================================
   STATUS CONSIGNADO
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM Configuracoes
    WHERE Chave='status_consignado'
)

BEGIN


INSERT INTO Configuracoes
(
Chave,
Valor
)

VALUES

(
'status_consignado',
'Aberto;Parcial;Finalizado;Cancelado'
);


END

GO





/* =====================================================
   PARAMETROS DO SISTEMA
   ===================================================== */


IF NOT EXISTS
(
    SELECT 1
    FROM Configuracoes
    WHERE Chave='versao'
)

BEGIN


INSERT INTO Configuracoes
(
Chave,
Valor
)

VALUES

(
'versao',
'1.0'
),


(
'empresa_modulo',
'ERP Impressão 3D'
),


(
'backup_automatico',
'SIM'
);



END

GO