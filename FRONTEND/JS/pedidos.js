// ============================================================
// BLOCO PEDIDOS - ASA TEC 3D
// ============================================================
let db = getDatabase();
let pedidos = db.pedidos || [];
let consignados = db.consignados || [];

// BLOCO ELEMENTOS
const listaPedidos = document.getElementById('listaPedidos');
const listaConsignados = document.getElementById('listaConsignados');
const pesquisaPedido = document.getElementById('pesquisaPedido');
const modalPedido = document.getElementById('modalPedido');
const modalConsignado = document.getElementById('modalConsignado');
const modalDetalhesPedido = document.getElementById('modalDetalhesPedido');
const modalDetalhesConsignado = document.getElementById('modalDetalhesConsignado');

const btnNovoPedido = document.getElementById('btnNovoPedido');
const btnNovoConsignado = document.getElementById('btnNovoConsignado');
const btnSalvarPedido = document.getElementById('salvarPedido');
const btnSalvarConsignado = document.getElementById('salvarConsignado');

// BLOCO DATALISTS
function preencherDatalists() {
  const clientes = db.clientes || [];
  const produtos = db.produtos || [];
  const listaClientes = document.getElementById('listaClientes');
  const listaProdutos = document.getElementById('listaProdutos');
  const listaClientesCons = document.getElementById('listaClientesCons');
  if (listaClientes) {
    listaClientes.innerHTML = clientes.map(c => `<option value="${c.nome}">`).join('');
  }
  if (listaProdutos) {
    listaProdutos.innerHTML = produtos.map(p => `<option value="${p.nome}" data-preco="${p.precoVenda}" data-foto="${p.foto}">`).join('');
  }
  if (listaClientesCons) {
    listaClientesCons.innerHTML = clientes.map(c => `<option value="${c.nome}">`).join('');
  }
}
preencherDatalists();

// BLOCO AUTO PREENCHER VALOR E FOTO
const pedidoProdutoInput = document.getElementById('pedidoProduto');
const pedidoValorInput = document.getElementById('pedidoValor');
const pedidoFotoInput = document.getElementById('pedidoFotoProduto');
if (pedidoProdutoInput) {
  pedidoProdutoInput.addEventListener('input', function() {
    const nome = this.value;
    const produto = (db.produtos || []).find(p => p.nome === nome);
    if (produto) {
      pedidoValorInput.value = produto.precoVenda || 0;
      if (produto.foto) {
        // Exibir a foto em algum lugar? Podemos criar um preview.
        // Simplesmente armazenamos em um atributo para uso posterior.
        pedidoFotoInput.dataset.foto = produto.foto;
      }
    } else {
      pedidoValorInput.value = '';
    }
  });
}

// BLOCO MODAIS
function abrirModalPedido() { modalPedido.classList.add('active'); }
function fecharModalPedido() { modalPedido.classList.remove('active'); }
function abrirModalConsignado() { modalConsignado.classList.add('active'); }
function fecharModalConsignado() { modalConsignado.classList.remove('active'); }
function fecharDetalhesPedido() { modalDetalhesPedido.classList.remove('active'); }
function fecharDetalhesConsignado() { modalDetalhesConsignado.classList.remove('active'); }

btnNovoPedido?.addEventListener('click', abrirModalPedido);
btnNovoConsignado?.addEventListener('click', abrirModalConsignado);

// BLOCO SALVAR PEDIDO
function salvarPedido() {
  const cliente = document.getElementById('pedidoCliente').value.trim();
  const produto = document.getElementById('pedidoProduto').value.trim();
  const valor = Number(document.getElementById('pedidoValor').value || 0);
  const data = document.getElementById('pedidoData').value;
  const entrega = document.getElementById('pedidoEntrega').value;
  const status = document.getElementById('pedidoStatus').value;
  const obs = document.getElementById('pedidoObs').value;
  const fotoInput = document.getElementById('pedidoFotoProduto');
  let fotoProduto = fotoInput.dataset.foto || 'assets/default-product.png';
  if (fotoInput.files && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      fotoProduto = e.target.result;
      finalizarSalvarPedido(cliente, produto, valor, data, entrega, status, obs, fotoProduto);
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    finalizarSalvarPedido(cliente, produto, valor, data, entrega, status, obs, fotoProduto);
  }
}
function finalizarSalvarPedido(cliente, produto, valor, data, entrega, status, obs, fotoProduto) {
  if (!cliente || !produto) { alert('Preencha cliente e produto.'); return; }
  const novoPedido = {
    id: gerarId(),
    cliente,
    produto,
    valor,
    data,
    dataEntrega: entrega,
    status,
    observacao: obs,
    fotoCliente: 'assets/user.png',
    fotoProduto
  };
  pedidos.push(novoPedido);
  db.pedidos = pedidos;
  saveDatabase(db);
  fecharModalPedido();
  renderPedidos();
  atualizarCards();
  // Limpar campos
  document.getElementById('pedidoCliente').value = '';
  document.getElementById('pedidoProduto').value = '';
  document.getElementById('pedidoValor').value = '';
  document.getElementById('pedidoFotoProduto').value = '';
}
btnSalvarPedido?.addEventListener('click', salvarPedido);

// BLOCO SALVAR CONSIGNADO
function salvarConsignado() {
  const cliente = document.getElementById('consCliente').value.trim();
  const entrega = document.getElementById('consEntrega').value;
  const acerto = document.getElementById('consAcerto').value;
  const status = document.getElementById('consStatus').value;
  if (!cliente) { alert('Informe o cliente.'); return; }
  // Capturar itens
  const itens = [];
  document.querySelectorAll('.item-consignado').forEach(linha => {
    const produto = linha.querySelector('.item-produto')?.value || '';
    const qtd = Number(linha.querySelector('.item-qtd')?.value || 0);
    const valorUnit = Number(linha.querySelector('.item-valor')?.value || 0);
    if (produto) itens.push({ produto, quantidade: qtd, valorUnitario: valorUnit });
  });
  const novoConsignado = {
    id: gerarId(),
    cliente,
    dataEntrega: entrega,
    dataAcerto: acerto,
    status,
    fotoCliente: 'assets/user.png',
    itens
  };
  consignados.push(novoConsignado);
  db.consignados = consignados;
  saveDatabase(db);
  fecharModalConsignado();
  renderConsignados();
  atualizarCards();
}
btnSalvarConsignado?.addEventListener('click', salvarConsignado);

// BLOCO ADICIONAR ITEM CONSIGNADO (campos maiores)
document.getElementById('btnAdicionarItem')?.addEventListener('click', function() {
  const container = document.getElementById('listaItensConsignado');
  const div = document.createElement('div');
  div.className = 'item-consignado';
  div.innerHTML = `
    <input type="text" class="item-produto" placeholder="Produto">
    <input type="number" class="item-qtd" placeholder="Qtd">
    <input type="number" class="item-valor" placeholder="Valor Unit.">
    <button type="button" class="btn-danger remover-item">Remover</button>
  `;
  container.appendChild(div);
});
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('remover-item')) {
    e.target.closest('.item-consignado')?.remove();
  }
});

// BLOCO RENDER PEDIDOS
function renderPedidos(filtro = '') {
  listaPedidos.innerHTML = '';
  const filtrados = pedidos.filter(p => {
    const texto = `${p.cliente} ${p.produto} ${p.status}`.toLowerCase();
    return texto.includes(filtro.toLowerCase());
  });
  if (filtrados.length === 0) {
    listaPedidos.innerHTML = '<div class="empty-state">Nenhum pedido encontrado.</div>';
    return;
  }
  filtrados.sort((a,b) => new Date(a.dataEntrega || 0) - new Date(b.dataEntrega || 0));
  filtrados.forEach(p => {
    listaPedidos.innerHTML += `
      <div class="pedido-card">
        <div class="card-top">
          <img src="${p.fotoCliente || 'assets/user.png'}" class="cliente-foto">
          <div class="card-info"><h4>${p.cliente}</h4><span>${p.produto}</span></div>
        </div>
        <div class="card-body">
          <div class="card-item"><span class="card-label">Entrega</span><strong>${p.dataEntrega || '-'}</strong></div>
          <div class="card-item"><span class="card-label">Valor</span><strong>${formatarMoeda(p.valor)}</strong></div>
          <div class="card-item"><span class="status ${obterClasseStatus(p.status)}">${p.status}</span></div>
        </div>
        <div class="card-footer">
          <button class="btn-primary" onclick="verPedido(${p.id})">Ver Detalhes</button>
        </div>
      </div>
    `;
  });
}

function obterClasseStatus(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('pendente')) return 'status-pendente';
  if (s.includes('model')) return 'status-modelagem';
  if (s.includes('imprim')) return 'status-imprimindo';
  if (s.includes('pós') || s.includes('pos')) return 'status-pos';
  if (s.includes('pronto')) return 'status-pronto';
  if (s.includes('entreg')) return 'status-entregue';
  if (s.includes('cancel')) return 'status-cancelado';
  return 'status-pendente';
}

// BLOCO RENDER CONSIGNADOS
function renderConsignados(filtro = '') {
  listaConsignados.innerHTML = '';
  const filtrados = consignados.filter(c => {
    const texto = `${c.cliente} ${c.status}`.toLowerCase();
    return texto.includes(filtro.toLowerCase());
  });
  if (filtrados.length === 0) {
    listaConsignados.innerHTML = '<div class="empty-state">Nenhum consignado encontrado.</div>';
    return;
  }
  filtrados.forEach(c => {
    listaConsignados.innerHTML += `
      <div class="pedido-card">
        <div class="card-top">
          <img src="${c.fotoCliente || 'assets/user.png'}" class="cliente-foto">
          <div class="card-info"><h4>${c.cliente}</h4><span>Consignado</span></div>
        </div>
        <div class="card-body">
          <div class="card-item"><span class="card-label">Acerto</span><strong>${c.dataAcerto || '-'}</strong></div>
          <div class="card-item"><span class="status status-pronto">${c.status}</span></div>
        </div>
        <div class="card-footer">
          <button class="btn-primary" onclick="verConsignado(${c.id})">Ver Detalhes</button>
        </div>
      </div>
    `;
  });
}

// BLOCO ATUALIZAR CARDS (sem Valor Produção)
function atualizarCards() {
  const ativos = pedidos.filter(p => p.status !== 'Entregue' && p.status !== 'Cancelado').length;
  const entregues = pedidos.filter(p => p.status === 'Entregue').length;
  document.getElementById('cardPedidosAtivos').textContent = ativos;
  document.getElementById('cardPedidosEntregues').textContent = entregues;
  document.getElementById('cardConsignados').textContent = consignados.length;
}

// BLOCO PESQUISA
pesquisaPedido?.addEventListener('input', function() {
  const valor = this.value;
  renderPedidos(valor);
  renderConsignados(valor);
});

// BLOCO DETALHES PEDIDO (ver/editar)
function verPedido(id) {
  const pedido = pedidos.find(p => p.id === id);
  if (!pedido) return;
  const conteudo = document.getElementById('conteudoDetalhesPedido');
  conteudo.innerHTML = `
    <div style="padding:25px; display:grid; grid-template-columns:1fr 1fr; gap:20px;">
      <div><img src="${pedido.fotoProduto || 'assets/default-product.png'}" style="width:100%; border-radius:16px;"></div>
      <div>
        <div class="form-group"><label>Cliente</label><input type="text" id="editCliente" value="${pedido.cliente}"></div>
        <div class="form-group"><label>Produto</label><input type="text" id="editProduto" value="${pedido.produto}"></div>
        <div class="form-group"><label>Valor</label><input type="number" step="0.01" id="editValor" value="${pedido.valor}"></div>
        <div class="form-group"><label>Status</label>
          <select id="editStatus">
            ${['Pendente','Modelagem','Imprimindo','Pós-processo','Pronto','Entregue','Cancelado'].map(s =>
              `<option ${pedido.status===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Data Pedido</label><input type="date" id="editDataPedido" value="${pedido.data || ''}"></div>
        <div class="form-group"><label>Data Entrega</label><input type="date" id="editEntrega" value="${pedido.dataEntrega || ''}"></div>
      </div>
    </div>
  `;
  modalDetalhesPedido.classList.add('active');
  // Salvar edição
  document.getElementById('btnSalvarEdicaoPedido').onclick = function() {
    pedido.cliente = document.getElementById('editCliente').value;
    pedido.produto = document.getElementById('editProduto').value;
    pedido.valor = Number(document.getElementById('editValor').value);
    pedido.status = document.getElementById('editStatus').value;
    pedido.data = document.getElementById('editDataPedido').value;
    pedido.dataEntrega = document.getElementById('editEntrega').value;
    db.pedidos = pedidos;
    saveDatabase(db);
    renderPedidos();
    atualizarCards();
    fecharDetalhesPedido();
  };
  document.getElementById('btnExcluirPedido').onclick = function() {
    if (pedido.status === 'Entregue') { alert('Pedido entregue não pode ser excluído.'); return; }
    if (!confirm('Excluir este pedido?')) return;
    pedidos = pedidos.filter(p => p.id !== id);
    db.pedidos = pedidos;
    saveDatabase(db);
    renderPedidos();
    atualizarCards();
    fecharDetalhesPedido();
  };
}

function verConsignado(id) {
  const consignado = consignados.find(c => c.id === id);
  if (!consignado) return;
  const conteudo = document.getElementById('conteudoDetalhesConsignado');
  conteudo.innerHTML = `
    <div style="padding:25px; display:grid; grid-template-columns:1fr 1fr; gap:20px;">
      <div><img src="${consignado.fotoCliente || 'assets/user.png'}" style="width:100%; border-radius:16px;"></div>
      <div>
        <div class="form-group"><label>Cliente</label><input type="text" id="editConsCliente" value="${consignado.cliente}"></div>
        <div class="form-group"><label>Status</label><input type="text" id="editConsStatus" value="${consignado.status}"></div>
        <div class="form-group"><label>Entrega</label><input type="date" id="editConsEntrega" value="${consignado.dataEntrega || ''}"></div>
        <div class="form-group"><label>Acerto</label><input type="date" id="editConsAcerto" value="${consignado.dataAcerto || ''}"></div>
      </div>
    </div>
  `;
  modalDetalhesConsignado.classList.add('active');
  document.getElementById('btnSalvarEdicaoConsignado').onclick = function() {
    consignado.cliente = document.getElementById('editConsCliente').value;
    consignado.status = document.getElementById('editConsStatus').value;
    consignado.dataEntrega = document.getElementById('editConsEntrega').value;
    consignado.dataAcerto = document.getElementById('editConsAcerto').value;
    db.consignados = consignados;
    saveDatabase(db);
    renderConsignados();
    atualizarCards();
    fecharDetalhesConsignado();
  };
  document.getElementById('btnExcluirConsignado').onclick = function() {
    if (!confirm('Excluir este consignado?')) return;
    consignados = consignados.filter(c => c.id !== id);
    db.consignados = consignados;
    saveDatabase(db);
    renderConsignados();
    atualizarCards();
    fecharDetalhesConsignado();
  };
}

// BLOCO INIT
renderPedidos();
renderConsignados();
atualizarCards();