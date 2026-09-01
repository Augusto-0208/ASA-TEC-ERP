// ============================================================
// BLOCO PRODUÇÃO - KANBAN
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  const db = getDatabase();
  const pedidos = db.pedidos || [];

  // BLOCO MAPEAMENTO DAS COLUNAS
  const columns = {
    orcamento: document.getElementById('orcamento'),
    desenvolvimento: document.getElementById('desenvolvimento'),
    producao: document.getElementById('producao'),
    pronto: document.getElementById('pronto'),
    entregue: document.getElementById('entregue'),
    receber: document.getElementById('receber')
  };

  // BLOCO NORMALIZAÇÃO DE STATUS (mapeia qualquer variação)
  function normalizarStatus(status) {
    if (!status) return 'orcamento';
    const s = status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    if (s.includes('orcamento') || s.includes('orc')) return 'orcamento';
    if (s.includes('desenvolvimento') || s.includes('desenv') || s.includes('modelagem')) return 'desenvolvimento';
    if (s.includes('producao') || s.includes('imprimindo') || s.includes('impressao')) return 'producao';
    if (s.includes('pronto') || s.includes('concluido') || s.includes('finalizado')) return 'pronto';
    if (s.includes('entregue') || s.includes('entreg')) return 'entregue';
    if (s.includes('receber') || s.includes('pagamento') || s.includes('fatura')) return 'receber';
    return 'orcamento';
  }

  // BLOCO LIMPAR COLUNAS
  Object.values(columns).forEach(col => {
    if (col) col.innerHTML = '';
  });

  // BLOCO FILTRAR APENAS PEDIDOS (exclui consignados se houver)
  const pedidosVenda = pedidos.filter(p => p.tipo !== 'consignado');

  if (pedidosVenda.length === 0) {
    // Mensagem em cada coluna
    Object.keys(columns).forEach(key => {
      if (columns[key]) {
        columns[key].innerHTML = `<div class="empty-message">Nenhum pedido nesta etapa</div>`;
      }
    });
    return;
  }

  // BLOCO DISTRIBUIR PEDIDOS
  let count = 0;
  pedidosVenda.forEach(pedido => {
    const status = normalizarStatus(pedido.status);
    const col = columns[status];
    if (!col) return;

    const card = document.createElement('div');
    card.className = `card ${status}`;
    card.innerHTML = `
      <strong>${pedido.cliente || 'Cliente'}</strong>
      <p>${pedido.produto || 'Produto'}</p>
      <p class="card-valor">${formatarMoeda(pedido.valor)}</p>
      ${pedido.dataEntrega ? `<p style="font-size:12px; color:var(--text-light);">Entrega: ${pedido.dataEntrega}</p>` : ''}
    `;
    col.appendChild(card);
    count++;
  });

  // BLOCO SE ALGUMA COLUNA FICOU VAZIA, EXIBIR MENSAGEM
  Object.keys(columns).forEach(key => {
    const col = columns[key];
    if (col && col.children.length === 0) {
      col.innerHTML = `<div class="empty-message">Nenhum pedido nesta etapa</div>`;
    }
  });

  // BLOCO ATUALIZAR CONTADOR NO TÍTULO DAS COLUNAS (opcional)
  document.querySelectorAll('.kanban-column').forEach(col => {
    const countEl = col.querySelector('.card-count');
    if (countEl) {
      const total = col.querySelectorAll('.card').length;
      countEl.textContent = total;
    }
  });
});

// BLOCO FUNÇÃO AUXILIAR (caso não esteja no escopo global)
function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}