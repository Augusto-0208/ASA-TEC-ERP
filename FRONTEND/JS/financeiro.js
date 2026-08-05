// ======================================================
// ASA TEC 3D ERP
// Módulo Financeiro
// Dados reais via LocalStorage
// ======================================================


// ======================================================
// CARREGAMENTO DOS DADOS
// ======================================================

let pedidos =
JSON.parse(
    localStorage.getItem("pedidos")
) || [];


let consignados =
JSON.parse(
    localStorage.getItem("consignados")
) || [];


let contasPagar =
JSON.parse(
    localStorage.getItem("contasPagar")
) || [];


let investimentos =
JSON.parse(
    localStorage.getItem("investimentos")
) || [];



// ======================================================
// FORMATAR MOEDA
// ======================================================

function formatarMoeda(valor){

    return Number(valor || 0)
    .toLocaleString(
        "pt-BR",
        {
            style:"currency",
            currency:"BRL"
        }
    );

}



// ======================================================
// FILTROS FINANCEIROS
// ======================================================

function pedidosEntregues(){

    return pedidos.filter(
        pedido =>
        pedido.status === "Entregue"
    );

}



function pedidosPendentesPagamento(){

    return pedidos.filter(
        pedido =>
        pedido.status !== "Entregue" &&
        pedido.status !== "Cancelado"
    );

}



// ======================================================
// CALCULOS
// ======================================================


function calcularReceita(){

    return pedidosEntregues()
    .reduce(
        (total,pedido)=>
        total + Number(pedido.valor || 0),
        0
    );

}



function calcularDespesas(){

    return contasPagar
    .reduce(
        (total,conta)=>
        total + Number(conta.valor || 0),
        0
    );

}



function calcularInvestimentos(){

    return investimentos
    .reduce(
        (total,item)=>
        total + Number(item.valor || 0),
        0
    );

}



function calcularContasReceber(){

    return pedidosPendentesPagamento()
    .reduce(
        (total,pedido)=>
        total + Number(pedido.valor || 0),
        0
    );

}



function calcularVencidos(){

    let hoje =
    new Date();


    return pedidos.filter(
        pedido=>{


            if(!pedido.dataEntrega)
                return false;


            let entrega =
            new Date(
                pedido.dataEntrega
            );


            return (
                entrega < hoje &&
                pedido.status !== "Entregue"
            );


        }
    ).length;

}



// ======================================================
// ATUALIZAR CARDS
// ======================================================

function atualizarResumo(){


    const receita =
    calcularReceita();


    const despesas =
    calcularDespesas();


    const investimentosTotal =
    calcularInvestimentos();


    const lucro =
    receita -
    despesas;


    document.getElementById(
        "receitaTotal"
    ).textContent =
    formatarMoeda(receita);



    document.getElementById(
        "lucroTotal"
    ).textContent =
    formatarMoeda(lucro);



    document.getElementById(
        "despesasTotal"
    ).textContent =
    formatarMoeda(despesas);



    document.getElementById(
        "receberTotal"
    ).textContent =
    formatarMoeda(
        calcularContasReceber()
    );



    document.getElementById(
        "investimentoTotal"
    ).textContent =
    formatarMoeda(
        investimentosTotal
    );



    document.getElementById(
        "vencidosTotal"
    ).textContent =
    calcularVencidos();


}



// ======================================================
// FLUXO DE CAIXA
// ======================================================

function renderFluxoCaixa(){


    const tabela =
    document.getElementById(
        "fluxoCaixaTable"
    );


    if(!tabela)
        return;


    tabela.innerHTML="";


    let movimentos=[];



    pedidosEntregues()
    .forEach(
        pedido=>{

            movimentos.push({

                data:
                pedido.data,

                tipo:
                "Entrada",

                descricao:
                `${pedido.cliente} - ${pedido.produto}`,

                valor:
                pedido.valor

            });


        }
    );



    contasPagar
    .forEach(
        conta=>{

            movimentos.push({

                data:
                conta.data || "-",

                tipo:
                "Saída",

                descricao:
                conta.descricao || "-",

                valor:
                -Number(conta.valor || 0)

            });


        }
    );



    movimentos
    .sort(
        (a,b)=>
        new Date(b.data)
        -
        new Date(a.data)
    );



    movimentos.forEach(
        item=>{


            tabela.innerHTML += `

            <tr>

                <td>${item.data}</td>

                <td>${item.tipo}</td>

                <td>${item.descricao}</td>

                <td>
                ${formatarMoeda(item.valor)}
                </td>

            </tr>

            `;


        }
    );


}



// ======================================================
// CONTAS A RECEBER
// ======================================================

function renderContasReceber(){


    const tabela =
    document.getElementById(
        "contasReceberTable"
    );


    if(!tabela)
        return;


    tabela.innerHTML="";



    pedidosPendentesPagamento()
    .forEach(
        pedido=>{


            tabela.innerHTML += `

            <tr>

            <td>
            ${pedido.cliente}
            </td>


            <td>
            ${pedido.produto}
            </td>


            <td>
            ${formatarMoeda(
                pedido.valor
            )}
            </td>


            <td>
            ${pedido.status}
            </td>


            </tr>

            `;


        }
    );


}



// ======================================================
// CONTAS A PAGAR
// ======================================================

function renderContasPagar(){


    const tabela =
    document.getElementById(
        "contasPagarTable"
    );


    if(!tabela)
        return;


    tabela.innerHTML="";



    contasPagar
    .forEach(
        conta=>{


            tabela.innerHTML +=`

            <tr>

            <td>
            ${conta.descricao || "-"}
            </td>


            <td>
            ${conta.categoria || "-"}
            </td>


            <td>
            ${formatarMoeda(
                conta.valor
            )}
            </td>


            <td>
            ${conta.vencimento || "-"}
            </td>


            </tr>

            `;


        }
    );


}



// ======================================================
// CONSIGNADOS
// ======================================================

function renderConsignados(){


    const tabela =
    document.getElementById(
        "consignadosTable"
    );


    if(!tabela)
        return;


    tabela.innerHTML="";



    consignados
    .forEach(
        item=>{


            let valor=0;


            item.itens?.forEach(
                produto=>{

                    valor +=
                    Number(
                        produto.quantidade || 0
                    )
                    *
                    Number(
                        produto.valorUnitario || 0
                    );

                }
            );



            tabela.innerHTML +=`

            <tr>

            <td>
            ${item.cliente}
            </td>


            <td>
            ${item.itens?.length || 0} itens
            </td>


            <td>
            ${formatarMoeda(valor)}
            </td>


            <td>
            ${item.status}
            </td>


            </tr>

            `;


        }
    );


}



// ======================================================
// INVESTIMENTOS
// ======================================================

function renderInvestimentos(){


    const grid =
    document.getElementById(
        "investimentosGrid"
    );


    if(!grid)
        return;


    grid.innerHTML="";


    investimentos
    .forEach(
        item=>{


            grid.innerHTML +=`

            <div class="panel">

            <h4>
            ${item.nome || "Investimento"}
            </h4>

            <strong>
            ${formatarMoeda(
                item.valor
            )}
            </strong>

            </div>

            `;


        }
    );


}



// ======================================================
// GRÁFICOS
// ======================================================

function gerarGraficos(){


    if(typeof Chart === "undefined")
        return;



    const receita =
    calcularReceita();



    const despesas =
    calcularDespesas();



    new Chart(
        document.getElementById(
            "graficoReceita"
        ),
        {

        type:"bar",

        data:{

            labels:[
                "Receita",
                "Despesas"
            ],

            datasets:[{

                data:[
                    receita,
                    despesas
                ]

            }]

        }

    });



    let status=[];


    pedidos.forEach(
        p=>{

            status[p.status] =
            (status[p.status] || 0)+1;

        }
    );



    new Chart(

        document.getElementById(
            "graficoPedidos"
        ),

        {

        type:"doughnut",

        data:{

            labels:
            Object.keys(status),

            datasets:[{

                data:
                Object.values(status)

            }]

        }

    });


}



// ======================================================
// INICIAR
// ======================================================

function iniciarFinanceiro(){


    atualizarResumo();

    renderFluxoCaixa();

    renderContasReceber();

    renderContasPagar();

    renderConsignados();

    renderInvestimentos();

    gerarGraficos();


}

// ======================================================
// MODAL CONTAS
// ======================================================


const modalConta =
document.getElementById(
"modalConta"
);


document
.getElementById(
"novaConta"
)
?.addEventListener(
"click",
()=>{

modalConta.classList.add(
"active"
);

});



document
.getElementById(
"fecharConta"
)
?.addEventListener(
"click",
()=>{

modalConta.classList.remove(
"active"
);

});



document
.getElementById(
"salvarConta"
)
?.addEventListener(
"click",
()=>{


const novaConta = {


id:
Date.now(),


descricao:
document.getElementById(
"contaDescricao"
).value,


categoria:
document.getElementById(
"contaCategoria"
).value,


valor:
Number(
document.getElementById(
"contaValor"
).value
),


vencimento:
document.getElementById(
"contaVencimento"
).value


};



contasPagar.push(
novaConta
);



localStorage.setItem(
"contasPagar",
JSON.stringify(
contasPagar
)
);



modalConta.classList.remove(
"active"
);



renderContasPagar();

atualizarResumo();


});

// ======================================================
// INVESTIMENTOS
// ======================================================


const modalInvestimento =
document.getElementById(
"modalInvestimento"
);



document
.getElementById(
"novoInvestimento"
)
?.addEventListener(
"click",
()=>{

modalInvestimento.classList.add(
"active"
);

});




document
.getElementById(
"fecharInvestimento"
)
?.addEventListener(
"click",
()=>{

modalInvestimento.classList.remove(
"active"
);

});





document
.getElementById(
"salvarInvestimento"
)
?.addEventListener(
"click",
()=>{


const novo = {


id:
Date.now(),


nome:
document.getElementById(
"investimentoNome"
).value,


valor:
Number(
document.getElementById(
"investimentoValor"
).value
),


data:
document.getElementById(
"investimentoData"
).value


};



investimentos.push(
novo
);



localStorage.setItem(
"investimentos",
JSON.stringify(
investimentos
)
);



modalInvestimento.classList.remove(
"active"
);



renderInvestimentos();

atualizarResumo();


});


document.addEventListener(
    "DOMContentLoaded",
    iniciarFinanceiro
);