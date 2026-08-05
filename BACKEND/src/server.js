require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { conectarBanco } = require("./database/connection");

const clientesRoutes = require("./routes/clientesRoutes");


const app = express();


// ==============================
// CONFIGURAÇÕES
// ==============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ==============================
// TESTE API
// ==============================

app.get("/", (req, res) => {

    res.json({
        sistema: "ASA TEC ERP",
        status: "API ONLINE"
    });

});


// ==============================
// ROTAS DA API
// ==============================

app.use(
    "/api/clientes",
    clientesRoutes
);


// ==============================
// TRATAMENTO DE ERROS
// ==============================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        erro: "Erro interno do servidor",
        detalhe: err.message
    });

});


// ==============================
// INICIALIZAÇÃO DO SERVIDOR
// ==============================

const PORTA = process.env.PORT || 3000;


async function iniciarServidor() {

    try {

        await conectarBanco();


        app.listen(PORTA, () => {

            console.log("--------------------------------");
            console.log("🚀 ASA TEC ERP API iniciada");
            console.log(`🌐 Porta: ${PORTA}`);
            console.log(`📡 http://localhost:${PORTA}`);
            console.log("--------------------------------");

        });


    } catch (erro) {

        console.error(
            "❌ Não foi possível iniciar o servidor:",
            erro.message
        );

        process.exit(1);

    }

}


iniciarServidor();