// ============================================================
// BLOCO FINANCEIRO - ASA TEC 3D
// ============================================================
let db = getDatabase();
let pedidos = db.pedidos || [];
let contasPagar = db.contasPagar || [];
let investimentos = db.investimentos || [];
let consignados = db.consignados || [];

// BLOCO FORMATAR MOEDA
function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// BLOCO ATUALIZAR CARDS RESUMO
function atualizarResumo() {
  const receita = pedidos.filter(p => p.status === 'Entregue').reduce((s, p) => s + Number(p.valor || 0), 0);
  const despesas = contasPagar.reduce((s, c) => s + Number(c.valor || 0), 0);
  const investTotal = investimentos.reduce((s, i) => s + Number(i.valor || 0), 0);
  const lucro = receita - despesas - investTotal;
  const aReceber = pedidos.filter(p => p.status !== 'Entregue' && p.status !== 'Cancelado').reduce((s, p) => s + Number(p.valor || 0), 0);
  const vencidos = pedidos.filter(p => p.dataEntrega && new Date(p.dataEntrega) < new Date() && p.status !== 'Entregue' && p.status !== 'Cancelado').length;

  document.getElementById('receitaTotal').textContent = formatarMoeda(receita);
  document.getElementById('lucroTotal').textContent = formatarMoeda(lucro);
  document.getElementById('despesasTotal').textContent = formatarMoeda(despesas);
  document.getElementById('receberTotal').textContent = formatarMoeda(aReceber);
  document.getElementById('investimentoTotal').textContent = formatarMoeda(investTotal);
  document.getElementById('vencidosTotal').textContent = vencidos;
}

// BLOCO FLUXO DE CAIXA
function renderFluxoCaixa() {
  const tbody = document.getElementById('fluxoCaixaTable');
  tbody.innerHTML = '';
  const movimentos = [];

  pedidos.filter(p => p.status === 'Entregue').forEach(p => {
    movimentos.push({
      data: p.data || '-',
      tipo: 'Entrada',
      descricao: `${p.cliente} - ${p.produto}`,
      valor: Number(p.valor || 0)
    });
  });

  contasPagar.forEach(c => {
    movimentos.push({
      data: c.vencimento || '-',
      tipo: 'Saída',
      descricao: c.descricao || '-',
      valor: -Number(c.valor || 0)
    });
  });

  investimentos.forEach(i => {
    movimentos.push({
      data: i.data || '-',
      tipo: 'Investimento',
      descricao: i.nome || 'Investimento',
      valor: -Number(i.valor || 0)
    });
  });

  movimentos.sort((a, b) => new Date(b.data) - new Date(a.data));

  if (movimentos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-light);">Nenhum movimento registrado.</td></tr>';
    return;
  }

  movimentos.forEach(m => {
    tbody.innerHTML += `
      <tr>
        <td>${m.data}</td>
        <td>${m.tipo}</td>
        <td>${m.descricao}</td>
        <td style="${m.valor < 0 ? 'color:#dc2626;' : 'color:#16a34a;'}">${formatarMoeda(m.valor)}</td>
      </tr>
    `;
  });
}

// BLOCO CONTAS A RECEBER
function renderContasReceber() {
  const tbody = document.getElementById('contasReceberTable');
  tbody.innerHTML = '';
  const pendentes = pedidos.filter(p => p.status !== 'Entregue' && p.status !== 'Cancelado');

  if (pendentes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-light);">Nenhuma conta a receber.</td></tr>';
    return;
  }

  pendentes.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.cliente || '-'}</td>
        <td>${p.produto || '-'}</td>
        <td>${formatarMoeda(p.valor)}</td>
        <td><span class="status status-pendente">${p.status}</span></td>
      </tr>
    `;
  });
}

// BLOCO CONTAS A PAGAR
function renderContasPagar() {
  const tbody = document.getElementById('contasPagarTable');
  tbody.innerHTML = '';

  if (contasPagar.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-light);">Nenhuma conta a pagar.</td></tr>';
    return;
  }

  contasPagar.forEach((conta, idx) => {
    tbody.innerHTML += `
      <tr>
        <td>${conta.descricao || '-'}</td>
        <td>${conta.categoria || '-'}</td>
        <td>${formatarMoeda(conta.valor)}</td>
        <td>${conta.vencimento || '-'}</td>
        <td>
          <button class="btn-excluir" onclick="excluirConta(${idx})" title="Excluir">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

function excluirConta(idx) {
  if (!confirm('Excluir esta conta?')) return;
  contasPagar.splice(idx, 1);
  db.contasPagar = contasPagar;
  saveDatabase(db);
  renderContasPagar();
  atualizarResumo();
  renderFluxoCaixa();
}

// BLOCO INVESTIMENTOS
function renderInvestimentos() {
  const grid = document.getElementById('investimentosGrid');
  grid.innerHTML = '';

  if (investimentos.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:20px; color:var(--text-light);">Nenhum investimento registrado.</p>';
    return;
  }

  investimentos.forEach((inv, idx) => {
    grid.innerHTML += `
      <div class="investimento-item">
        <div class="inv-info">
          <strong>${inv.nome || 'Investimento'}</strong>
          <span>${inv.data || '-'}</span>
        </div>
        <div class="inv-valor">${formatarMoeda(inv.valor)}</div>
        <button class="btn-excluir" onclick="excluirInvestimento(${idx})" title="Excluir">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  });
}

function excluirInvestimento(idx) {
  if (!confirm('Excluir este investimento?')) return;
  investimentos.splice(idx, 1);
  db.investimentos = investimentos;
  saveDatabase(db);
  renderInvestimentos();
  atualizarResumo();
  renderFluxoCaixa();
}

// BLOCO CONSIGNADOS
function renderConsignados() {
  const tbody = document.getElementById('consignadosTable');
  tbody.innerHTML = '';

  if (consignados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px; color:var(--text-light);">Nenhum consignado pendente.</td></tr>';
    return;
  }

  consignados.forEach(c => {
    const valor = (c.itens || []).reduce((s, item) => s + (item.quantidade || 0) * (item.valorUnitario || 0), 0);
    tbody.innerHTML += `
      <tr>
        <td>${c.cliente || '-'}</td>
        <td>${c.itens?.length || 0} itens</td>
        <td>${formatarMoeda(valor)}</td>
        <td><span class="status status-pendente">${c.status || 'Aberto'}</span></td>
      </tr>
    `;
  });
}

// BLOCO GRÁFICOS (Chart.js)
function renderGraficos() {
  if (typeof Chart === 'undefined') return;

  const receita = pedidos.filter(p => p.status === 'Entregue').reduce((s, p) => s + Number(p.valor || 0), 0);
  const despesas = contasPagar.reduce((s, c) => s + Number(c.valor || 0), 0);

  // Gráfico Receita x Despesas
  const ctx1 = document.getElementById('graficoReceita');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Receita', 'Despesas'],
        datasets: [{
          data: [receita, despesas],
          backgroundColor: ['#16a34a', '#ef4444'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) { return 'R$ ' + value.toFixed(0); }
            }
          }
        }
      }
    });
  }

  // Gráfico Status dos Pedidos
  const ctx2 = document.getElementById('graficoPedidos');
  if (ctx2) {
    const statusMap = {};
    pedidos.forEach(p => {
      statusMap[p.status] = (statusMap[p.status] || 0) + 1;
    });
    const labels = Object.keys(statusMap);
    const data = Object.values(statusMap);
    const cores = ['#2563eb', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: cores.slice(0, data.length),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 15, usePointStyle: true }
          }
        }
      }
    });
  }
}

// BLOCO MODAL CONTAS
const modalConta = document.getElementById('modalConta');
document.getElementById('novaConta').addEventListener('click', () => {
  modalConta.classList.add('active');
  document.getElementById('contaDescricao').value = '';
  document.getElementById('contaCategoria').value = '';
  document.getElementById('contaValor').value = '';
  document.getElementById('contaVencimento').value = '';
});
document.getElementById('fecharConta').addEventListener('click', () => {
  modalConta.classList.remove('active');
});
document.getElementById('salvarConta').addEventListener('click', () => {
  const nova = {
    descricao: document.getElementById('contaDescricao').value,
    categoria: document.getElementById('contaCategoria').value,
    valor: Number(document.getElementById('contaValor').value) || 0,
    vencimento: document.getElementById('contaVencimento').value
  };
  if (!nova.descricao || nova.valor <= 0) {
    alert('Preencha a descrição e um valor válido.');
    return;
  }
  contasPagar.push(nova);
  db.contasPagar = contasPagar;
  saveDatabase(db);
  modalConta.classList.remove('active');
  renderContasPagar();
  atualizarResumo();
  renderFluxoCaixa();
  renderGraficos();
});

// BLOCO MODAL INVESTIMENTOS
const modalInvestimento = document.getElementById('modalInvestimento');
document.getElementById('novoInvestimento').addEventListener('click', () => {
  modalInvestimento.classList.add('active');
  document.getElementById('investimentoNome').value = '';
  document.getElementById('investimentoValor').value = '';
  document.getElementById('investimentoData').value = '';
});
document.getElementById('fecharInvestimento').addEventListener('click', () => {
  modalInvestimento.classList.remove('active');
});
document.getElementById('salvarInvestimento').addEventListener('click', () => {
  const novo = {
    nome: document.getElementById('investimentoNome').value,
    valor: Number(document.getElementById('investimentoValor').value) || 0,
    data: document.getElementById('investimentoData').value
  };
  if (!novo.nome || novo.valor <= 0) {
    alert('Preencha o nome e um valor válido.');
    return;
  }
  investimentos.push(novo);
  db.investimentos = investimentos;
  saveDatabase(db);
  modalInvestimento.classList.remove('active');
  renderInvestimentos();
  atualizarResumo();
  renderFluxoCaixa();
  renderGraficos();
});

// BLOCO FECHAR MODAIS CLICANDO FORA
modalConta.addEventListener('click', function(e) {
  if (e.target === modalConta) modalConta.classList.remove('active');
});
modalInvestimento.addEventListener('click', function(e) {
  if (e.target === modalInvestimento) modalInvestimento.classList.remove('active');
});

// BLOCO INIT
function initFinanceiro() {
  atualizarResumo();
  renderFluxoCaixa();
  renderContasReceber();
  renderContasPagar();
  renderInvestimentos();
  renderConsignados();
  renderGraficos();
}

document.addEventListener('DOMContentLoaded', initFinanceiro);