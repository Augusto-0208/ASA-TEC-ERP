// ======================================
// ASA TEC ERP
// RELATÓRIOS
// ======================================


// ======================================
// STORAGE
// ======================================


let pedidos =
JSON.parse(
localStorage.getItem("pedidos")
) || [];


let clientes =
JSON.parse(
localStorage.getItem("clientes")
) || [];


let consignados =
JSON.parse(
localStorage.getItem("consignados")
) || [];



// ======================================
// ESTADO
// ======================================


let relatorioAtual = "vendas";

let dadosRelatorio = [];




// ======================================
// ELEMENTOS
// ======================================


const tabs =
document.querySelectorAll(
".tab"
);


const tabela =
document.getElementById(
"tabelaRelatorio"
);


const cabecalho =
document.getElementById(
"cabecalhoTabela"
);


const titulo =
document.getElementById(
"tituloTabela"
);


const totalRegistros =
document.getElementById(
"totalRegistros"
);


const valorTotal =
document.getElementById(
"valorTotal"
);


const totalClientes =
document.getElementById(
"totalClientes"
);




// FILTROS


const dataInicial =
document.getElementById(
"dataInicial"
);


const dataFinal =
document.getElementById(
"dataFinal"
);


const filtroStatus =
document.getElementById(
"filtroStatus"
);


const filtroCliente =
document.getElementById(
"filtroCliente"
);




// ======================================
// MOEDA
// ======================================


function moeda(valor){

return Number(valor || 0)
.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL"
}
);

}




// ======================================
// STATUS
// ======================================


function classeStatus(status){

let s =
(status || "")
.toLowerCase();


if(s.includes("entreg"))
return "status-entregue";


if(s.includes("cancel"))
return "status-cancelado";


return "status-pendente";

}




// ======================================
// ALTERAR ABA
// ======================================


tabs.forEach(tab=>{


tab.addEventListener(
"click",
()=>{


tabs.forEach(
t=>t.classList.remove(
"active"
)
);



tab.classList.add(
"active"
);



relatorioAtual =
tab.dataset.relatorio;



carregarRelatorio();



});


});





// ======================================
// FILTROS
// ======================================


document
.getElementById(
"btnFiltrar"
)
?.addEventListener(
"click",
()=>{


carregarRelatorio();


});





// ======================================
// FILTRO BASE
// ======================================


function aplicarFiltros(lista){


return lista.filter(item=>{


let passa = true;



if(
dataInicial.value
){

passa =
new Date(
item.data
)
>=
new Date(
dataInicial.value
);

}



if(
dataFinal.value
){

passa =
passa &&
new Date(
item.data
)
<=
new Date(
dataFinal.value
);

}



if(
filtroStatus.value
){

passa =
passa &&
item.status ===
filtroStatus.value;

}



if(
filtroCliente.value
){

passa =
passa &&
JSON.stringify(item)
.toLowerCase()
.includes(
filtroCliente.value
.toLowerCase()
);

}



return passa;


});


}





// ======================================
// RELATÓRIO VENDAS
// ======================================


function gerarVendas(){


dadosRelatorio =
aplicarFiltros(
pedidos
);



titulo.innerHTML =
"Relatório de Vendas";



cabecalho.innerHTML = `

<tr>

<th>Data</th>

<th>Cliente</th>

<th>Produto</th>

<th>Valor</th>

<th>Status</th>

</tr>

`;



tabela.innerHTML="";



dadosRelatorio.forEach(
(p)=>{


tabela.innerHTML += `

<tr>

<td>
${p.data || "-"}
</td>


<td>
${p.cliente || "-"}
</td>


<td>
${p.produto || "-"}
</td>


<td>
${moeda(p.valor)}
</td>


<td>

<span class="status ${classeStatus(p.status)}">

${p.status}

</span>

</td>


</tr>

`;

});


atualizarResumo(
dadosRelatorio
);



}




// ======================================
// FINANCEIRO
// ======================================


function gerarFinanceiro(){


dadosRelatorio =
pedidos;



titulo.innerHTML =
"Relatório Financeiro";



cabecalho.innerHTML = `

<tr>

<th>Status</th>

<th>Quantidade</th>

<th>Total</th>

</tr>

`;



let agrupado={};



pedidos.forEach(p=>{


if(!agrupado[p.status]){


agrupado[p.status]={
qtd:0,
valor:0
};


}



agrupado[p.status].qtd++;


agrupado[p.status].valor +=
Number(p.valor || 0);



});



tabela.innerHTML="";



Object.keys(agrupado)
.forEach(status=>{


let item =
agrupado[status];


tabela.innerHTML += `

<tr>

<td>
${status}
</td>


<td>
${item.qtd}
</td>


<td>
${moeda(item.valor)}
</td>


</tr>

`;


});


atualizarResumo(
pedidos
);



}






// ======================================
// CLIENTES
// ======================================


function gerarClientes(){



titulo.innerHTML =
"Relatório de Clientes";



cabecalho.innerHTML=`

<tr>

<th>Cliente</th>

<th>Pedidos</th>

<th>Total Comprado</th>

</tr>

`;



tabela.innerHTML="";



clientes.forEach(cliente=>{


let pedidosCliente =
pedidos.filter(
p=>
p.cliente ===
(cliente.nome || cliente)
);



let total =
pedidosCliente.reduce(
(a,b)=>
a+
Number(
b.valor||0
),
0
);



tabela.innerHTML+=`

<tr>

<td>
${cliente.nome || cliente}
</td>


<td>
${pedidosCliente.length}
</td>


<td>
${moeda(total)}
</td>


</tr>

`;



});



dadosRelatorio =
clientes;



atualizarResumo(
clientes
);



}






// ======================================
// PRODUÇÃO
// ======================================


function gerarProducao(){


titulo.innerHTML =
"Relatório de Produção";



cabecalho.innerHTML=`

<tr>

<th>Produto</th>

<th>Quantidade</th>

<th>Status</th>

</tr>

`;



tabela.innerHTML="";



let produtos={};



pedidos.forEach(p=>{


if(!produtos[p.produto]){


produtos[p.produto]={
qtd:0,
status:p.status
};


}


produtos[p.produto].qtd++;


});



Object.keys(produtos)
.forEach(nome=>{


tabela.innerHTML +=`

<tr>

<td>
${nome}
</td>


<td>
${produtos[nome].qtd}
</td>


<td>
${produtos[nome].status}
</td>


</tr>


`;



});


atualizarResumo(
pedidos
);


}





// ======================================
// CONSIGNADOS
// ======================================


function gerarConsignados(){



titulo.innerHTML =
"Relatório de Consignados";



cabecalho.innerHTML=`

<tr>

<th>Cliente</th>

<th>Entrega</th>

<th>Status</th>

</tr>

`;



tabela.innerHTML="";



consignados.forEach(c=>{


tabela.innerHTML+=`

<tr>

<td>
${c.cliente}
</td>


<td>
${c.dataEntrega || "-"}
</td>


<td>
${c.status}
</td>


</tr>

`;



});



dadosRelatorio =
consignados;



atualizarResumo(
consignados
);



}




// ======================================
// CONTROLE
// ======================================


function carregarRelatorio(){


switch(relatorioAtual){


case "vendas":

gerarVendas();

break;


case "financeiro":

gerarFinanceiro();

break;


case "clientes":

gerarClientes();

break;


case "producao":

gerarProducao();

break;


case "consignados":

gerarConsignados();

break;


}


}





// ======================================
// RESUMO
// ======================================


function atualizarResumo(lista){



totalRegistros.innerHTML =
lista.length;



valorTotal.innerHTML =
moeda(
lista.reduce(
(a,b)=>
a+
Number(
b.valor || 0
),
0
)
);



totalClientes.innerHTML =
new Set(
lista.map(
x=>x.cliente
)
).size;



}




// ======================================
// EXPORTAR EXCEL
// ======================================


document
.getElementById(
"exportarExcel"
)
?.addEventListener(
"click",
()=>{


let tabelaHTML =
document.querySelector(
"table"
);



let workbook =
XLSX.utils.table_to_book(
tabelaHTML
);



XLSX.writeFile(
workbook,
"ASA_TEC_Relatorio.xlsx"
);



});






// ======================================
// EXPORTAR PDF
// ======================================


document
.getElementById(
"exportarPDF"
)
?.addEventListener(
"click",
()=>{


const {jsPDF} =
window.jspdf;



let doc =
new jsPDF();



doc.text(
"ASA TEC 3D - Relatorio",
10,
10
);



doc.autoTable({
html:"table"
});



doc.save(
"ASA_TEC_Relatorio.pdf"
);



});





// ======================================
// START
// ======================================


document.addEventListener(
"DOMContentLoaded",
()=>{


carregarRelatorio();


});