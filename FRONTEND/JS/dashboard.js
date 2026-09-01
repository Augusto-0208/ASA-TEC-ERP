// ============================================================
// BLOCO DASHBOARD
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  const db = getDatabase();
  const pedidos = db.pedidos || [];
  const clientes = db.clientes || [];
  const consignados = db.consignados || [];
  const investimentos = db.investimentos || [];
  const contasPagar = db.contasPagar || [];

  // BLOCO CARDS
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  let vendasMes = 0;
  let pedidosAtivos = 0;
  pedidos.forEach(p => {
    if (p.status === 'Entregue' || p.status === 'Cancelado') return;
    pedidosAtivos++;
    if (p.data) {
      const d = new Date(p.data);
      if (d.getMonth() === mesAtual && d.getFullYear() === anoAtual) {
        vendasMes += Number(p.valor || 0);
      }
    }
  });
  document.getElementById('vendasMes').textContent = formatarMoeda(vendasMes);
  document.getElementById('pedidosAtivos').textContent = pedidosAtivos;
  document.getElementById('totalConsignados').textContent = consignados.length;

  const totalInvest = investimentos.reduce((acc, i) => acc + Number(i.valor || 0), 0);
  document.getElementById('totalInvestimentos').textContent = formatarMoeda(totalInvest);

  // BLOCO CLIENTE DO MÊS
  const mapaClientes = {};
  pedidos.forEach(p => {
    if (!p.cliente) return;
    if (!mapaClientes[p.cliente]) mapaClientes[p.cliente] = 0;
    mapaClientes[p.cliente] += Number(p.valor || 0);
  });
  const ranking = Object.keys(mapaClientes).map(nome => ({ nome, total: mapaClientes[nome] }));
  ranking.sort((a,b) => b.total - a.total);
  const top = ranking.length ? ranking[0] : null;
  const containerClienteMes = document.getElementById('clienteMes');
  if (top) {
    const foto = clientes.find(c => c.nome === top.nome)?.foto || 'assets/user.png';
    containerClienteMes.innerHTML = `
      <div class="cliente-mes-card">
        <img src="${foto}" class="cliente-mes-foto">
        <p>Cliente que mais comprou</p>
        <h2>${top.nome}</h2>
        <strong>${formatarMoeda(top.total)}</strong>
      </div>
    `;
  } else {
    containerClienteMes.innerHTML = '<p>Nenhum cliente com compras.</p>';
  }

  // BLOCO CLIENTES VIP (top 3)
  const containerVip = document.getElementById('clientesVip');
  containerVip.innerHTML = '';
  ranking.slice(0,3).forEach((cliente, idx) => {
    const foto = clientes.find(c => c.nome === cliente.nome)?.foto || 'assets/user.png';
    containerVip.innerHTML += `
      <div class="vip-item">
        <div class="vip-left">
          <img src="${foto}" class="vip-foto">
          <div class="vip-info">
            <strong>${idx+1}º ${cliente.nome}</strong>
            <span>Cliente VIP</span>
          </div>
        </div>
        <div class="vip-valor">${formatarMoeda(cliente.total)}</div>
      </div>
    `;
  });

  // BLOCO PRÓXIMAS ENTREGAS
  const containerEntregas = document.getElementById('ultimosPedidos');
  containerEntregas.innerHTML = '';
  const proximasEntregas = pedidos
    .filter(p => p.dataEntrega && p.status !== 'Entregue' && p.status !== 'Cancelado')
    .sort((a,b) => new Date(a.dataEntrega) - new Date(b.dataEntrega))
    .slice(0,10);
  proximasEntregas.forEach(p => {
    const foto = clientes.find(c => c.nome === p.cliente)?.foto || 'assets/user.png';
    containerEntregas.innerHTML += `
      <div class="pedido-recente">
        <img src="${foto}">
        <div class="pedido-recente-info">
          <strong>${p.cliente}</strong>
          <span>${p.produto} - ${p.dataEntrega}</span>
        </div>
        <span class="status ${p.status === 'Pronto' ? 'status-pronto' : 'status-pendente'}">${p.status}</span>
      </div>
    `;
  });
  if (!containerEntregas.innerHTML) containerEntregas.innerHTML = '<p>Nenhuma entrega próxima.</p>';

  // BLOCO PRÓXIMOS ACERTOS
  const containerAcertos = document.getElementById('proximosAcertos');
  containerAcertos.innerHTML = '';
  const proximosAcertos = consignados
    .filter(c => c.dataAcerto)
    .sort((a,b) => new Date(a.dataAcerto) - new Date(b.dataAcerto))
    .slice(0,10);
  proximosAcertos.forEach(c => {
    const foto = clientes.find(cl => cl.nome === c.cliente)?.foto || 'assets/user.png';
    containerAcertos.innerHTML += `
      <div class="acerto-item">
        <div class="acerto-cliente">
          <img src="${foto}">
          <div class="acerto-info">
            <strong>${c.cliente}</strong>
            <span>${c.itens?.length || 0} itens</span>
          </div>
        </div>
        <div class="acerto-data">${c.dataAcerto}</div>
      </div>
    `;
  });
  if (!containerAcertos.innerHTML) containerAcertos.innerHTML = '<p>Nenhum acerto agendado.</p>';

  // BLOCO ÚLTIMOS PEDIDOS (lista)
  const containerUltimos = document.getElementById('ultimosPedidosLista');
  containerUltimos.innerHTML = '';
  const ultimos = pedidos.sort((a,b) => new Date(b.data) - new Date(a.data)).slice(0,10);
  ultimos.forEach(p => {
    const foto = clientes.find(c => c.nome === p.cliente)?.foto || 'assets/user.png';
    containerUltimos.innerHTML += `
      <div class="pedido-recente">
        <img src="${foto}">
        <div class="pedido-recente-info">
          <strong>${p.cliente}</strong>
          <span>${p.produto} - ${p.data || 'Sem data'}</span>
        </div>
        <span class="status ${p.status === 'Entregue' ? 'status-entregue' : 'status-pendente'}">${p.status}</span>
      </div>
    `;
  });
});