// ============================================================
// BLOCO RELATÓRIOS - ASA TEC 3D
// ============================================================
let db = getDatabase();
let pedidos = db.pedidos || [];
let clientes = db.clientes || [];
let consignados = db.consignados || [];

// BLOCO ELEMENTOS
const tabs = document.querySelectorAll('.tab');
const tabela = document.getElementById('tabelaRelatorio');
const cabecalho = document.getElementById('cabecalhoTabela');
const titulo = document.getElementById('tituloTabela');
const totalRegistros = document.getElementById('totalRegistros');
const valorTotal = document.getElementById('valorTotal');
const totalClientesRel = document.getElementById('totalClientes');

const dataInicial = document.getElementById('dataInicial');
const dataFinal = document.getElementById('dataFinal');
const filtroStatus = document.getElementById('filtroStatus');
const filtroCliente = document.getElementById('filtroCliente');

let relatorioAtual = 'vendas';

// BLOCO FUNÇÕES AUXILIARES
function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function obterClasseStatus(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('entreg')) return 'status-entregue';
  if (s.includes('cancel')) return 'status-cancelado';
  if (s.includes('pronto')) return 'status-pronto';
  return 'status-pendente';
}

// BLOCO APLICAR FILTROS
function aplicarFiltros(lista) {
  return lista.filter(item => {
    let passa = true;

    if (dataInicial.value) {
      passa = new Date(item.data) >= new Date(dataInicial.value);
    }
    if (dataFinal.value) {
      passa = passa && new Date(item.data) <= new Date(dataFinal.value);
    }
    if (filtroStatus.value) {
      passa = passa && item.status === filtroStatus.value;
    }
    if (filtroCliente.value) {
      passa = passa && JSON.stringify(item).toLowerCase().includes(filtroCliente.value.toLowerCase());
    }
    return passa;
  });
}

// BLOCO ATUALIZAR RESUMO
function atualizarResumo(lista) {
  totalRegistros.textContent = lista.length;
  const total = lista.reduce((s, item) => s + Number(item.valor || 0), 0);
  valorTotal.textContent = formatarMoeda(total);
  const clientesSet = new Set(lista.map(item => item.cliente).filter(Boolean));
  totalClientesRel.textContent = clientesSet.size;
}

// ============================================================
// BLOCO GERAR RELATÓRIOS
// ============================================================

// BLOCO VENDAS
function gerarVendas() {
  titulo.textContent = 'Relatório de Vendas';
  cabecalho.innerHTML = `
    <tr>
      <th>Data</th>
      <th>Cliente</th>
      <th>Produto</th>
      <th>Valor</th>
      <th>Status</th>
    </tr>
  `;
  const dados = aplicarFiltros(pedidos);
  tabela.innerHTML = '';
  if (dados.length === 0) {
    tabela.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-light);">Nenhum registro encontrado.</td></tr>';
  } else {
    dados.forEach(p => {
      tabela.innerHTML += `
        <tr>
          <td>${p.data || '-'}</td>
          <td>${p.cliente || '-'}</td>
          <td>${p.produto || '-'}</td>
          <td>${formatarMoeda(p.valor)}</td>
          <td><span class="status ${obterClasseStatus(p.status)}">${p.status}</span></td>
        </tr>
      `;
    });
  }
  atualizarResumo(dados);
}

// BLOCO FINANCEIRO
function gerarFinanceiro() {
  titulo.textContent = 'Relatório Financeiro';
  cabecalho.innerHTML = `
    <tr>
      <th>Status</th>
      <th>Quantidade</th>
      <th>Total</th>
    </tr>
  `;
  const dados = aplicarFiltros(pedidos);
  const agrupado = {};
  dados.forEach(p => {
    if (!agrupado[p.status]) agrupado[p.status] = { qtd: 0, valor: 0 };
    agrupado[p.status].qtd++;
    agrupado[p.status].valor += Number(p.valor || 0);
  });
  tabela.innerHTML = '';
  if (Object.keys(agrupado).length === 0) {
    tabela.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:40px;color:var(--text-light);">Nenhum registro encontrado.</td></tr>';
  } else {
    Object.keys(agrupado).forEach(status => {
      tabela.innerHTML += `
        <tr>
          <td>${status}</td>
          <td>${agrupado[status].qtd}</td>
          <td>${formatarMoeda(agrupado[status].valor)}</td>
        </tr>
      `;
    });
  }
  atualizarResumo(dados);
}

// BLOCO CLIENTES (com última compra)
function gerarClientes() {
  titulo.textContent = 'Relatório de Clientes';
  cabecalho.innerHTML = `
    <tr>
      <th>Cliente</th>
      <th>Pedidos</th>
      <th>Total Comprado</th>
      <th>Última Compra</th>
    </tr>
  `;
  const dados = clientes.map(cliente => {
    const pedidosCliente = pedidos.filter(p => p.cliente === (cliente.nome || cliente));
    const total = pedidosCliente.reduce((s, p) => s + Number(p.valor || 0), 0);
    const ultima = pedidosCliente.length ? pedidosCliente.sort((a, b) => new Date(b.data) - new Date(a.data))[0].data : '-';
    return { nome: cliente.nome || cliente, pedidos: pedidosCliente.length, total, ultima };
  });
  tabela.innerHTML = '';
  if (dados.length === 0) {
    tabela.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:40px;color:var(--text-light);">Nenhum cliente encontrado.</td></tr>';
  } else {
    dados.forEach(c => {
      tabela.innerHTML += `
        <tr>
          <td>${c.nome}</td>
          <td>${c.pedidos}</td>
          <td>${formatarMoeda(c.total)}</td>
          <td>${c.ultima}</td>
        </tr>
      `;
    });
  }
  atualizarResumo(dados);
}

// BLOCO PRODUÇÃO
function gerarProducao() {
  titulo.textContent = 'Relatório de Produção';
  cabecalho.innerHTML = `
    <tr>
      <th>Produto</th>
      <th>Quantidade</th>
      <th>Status</th>
    </tr>
  `;
  const dados = aplicarFiltros(pedidos);
  const agrupado = {};
  dados.forEach(p => {
    if (!agrupado[p.produto]) agrupado[p.produto] = { qtd: 0, status: p.status };
    agrupado[p.produto].qtd++;
  });
  tabela.innerHTML = '';
  if (Object.keys(agrupado).length === 0) {
    tabela.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:40px;color:var(--text-light);">Nenhum registro encontrado.</td></tr>';
  } else {
    Object.keys(agrupado).forEach(nome => {
      tabela.innerHTML += `
        <tr>
          <td>${nome}</td>
          <td>${agrupado[nome].qtd}</td>
          <td>${agrupado[nome].status}</td>
        </tr>
      `;
    });
  }
  atualizarResumo(dados);
}

// BLOCO CONSIGNADOS
function gerarConsignados() {
  titulo.textContent = 'Relatório de Consignados';
  cabecalho.innerHTML = `
    <tr>
      <th>Cliente</th>
      <th>Entrega</th>
      <th>Status</th>
    </tr>
  `;
  const dados = consignados;
  tabela.innerHTML = '';
  if (dados.length === 0) {
    tabela.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:40px;color:var(--text-light);">Nenhum consignado encontrado.</td></tr>';
  } else {
    dados.forEach(c => {
      tabela.innerHTML += `
        <tr>
          <td>${c.cliente}</td>
          <td>${c.dataEntrega || '-'}</td>
          <td>${c.status}</td>
        </tr>
      `;
    });
  }
  atualizarResumo(dados);
}

// BLOCO CARREGAR RELATÓRIO (switch)
function carregarRelatorio() {
  switch (relatorioAtual) {
    case 'vendas': gerarVendas(); break;
    case 'financeiro': gerarFinanceiro(); break;
    case 'clientes': gerarClientes(); break;
    case 'producao': gerarProducao(); break;
    case 'consignados': gerarConsignados(); break;
    default: gerarVendas();
  }
}

// BLOCO EVENTOS DAS ABAS
tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    relatorioAtual = this.dataset.relatorio;
    carregarRelatorio();
  });
});

// BLOCO BOTÃO FILTRAR
document.getElementById('btnFiltrar').addEventListener('click', carregarRelatorio);

// BLOCO EXPORTAÇÃO EXCEL
document.getElementById('exportarExcel').addEventListener('click', function() {
  const wb = XLSX.utils.table_to_book(document.querySelector('table'));
  XLSX.writeFile(wb, 'ASA_TEC_Relatorio.xlsx');
});

// BLOCO EXPORTAÇÃO PDF
document.getElementById('exportarPDF').addEventListener('click', function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape');
  doc.text('ASA TEC 3D - Relatório', 14, 16);
  doc.autoTable({ html: 'table', startY: 22 });
  doc.save('ASA_TEC_Relatorio.pdf');
});

// BLOCO INIT
carregarRelatorio();