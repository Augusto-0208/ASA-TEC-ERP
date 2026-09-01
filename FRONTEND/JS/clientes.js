// ============================================================
// BLOCO CLIENTES
// ============================================================
let db = getDatabase();
let clientes = db.clientes || [];
let pedidos = db.pedidos || [];

// BLOCO ELEMENTOS
const listaClientes = document.getElementById('listaClientes');
const buscarCliente = document.getElementById('buscarCliente');
const ordenarClientes = document.getElementById('ordenarClientes');
const filtroTime = document.getElementById('filtroTime');
const modalCliente = document.getElementById('modalCliente');
const perfilCliente = document.getElementById('perfilCliente');

function formatarMoeda(valor) { return Number(valor||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function fotoPadrao() { return 'assets/user.png'; }

// BLOCO ATUALIZAR RESUMO
function atualizarResumo() {
  const totalClientes = clientes.filter(c => c.tipo === 'cliente' || !c.tipo).length;
  const totalRevendedores = clientes.filter(c => c.tipo === 'revendedor').length;
  const totalLojas = clientes.filter(c => c.tipo === 'loja').length;
  let valorTotal = 0;
  clientes.forEach(cli => {
    pedidos.filter(p => p.cliente === cli.nome).forEach(p => valorTotal += Number(p.valor||0));
  });
  document.getElementById('totalClientes').textContent = totalClientes;
  document.getElementById('totalRevendedores').textContent = totalRevendedores;
  document.getElementById('totalLojas').textContent = totalLojas;
  document.getElementById('valorVendido').textContent = formatarMoeda(valorTotal);
}

// BLOCO RENDER CLIENTES
function renderClientes() {
  listaClientes.innerHTML = '';
  let lista = [...clientes];
  const termo = buscarCliente.value.toLowerCase();
  const time = filtroTime.value;
  lista = lista.filter(c => c.nome.toLowerCase().includes(termo));
  if (time !== 'todos') {
    lista = lista.filter(c => (c.tipo || 'cliente') === time);
  }
  // Ordenação
  if (ordenarClientes.value === 'nome') lista.sort((a,b) => a.nome.localeCompare(b.nome));
  else if (ordenarClientes.value === 'valor') {
    lista.sort((a,b) => {
      const totalA = pedidos.filter(p => p.cliente === a.nome).reduce((s,p) => s+Number(p.valor||0),0);
      const totalB = pedidos.filter(p => p.cliente === b.nome).reduce((s,p) => s+Number(p.valor||0),0);
      return totalB - totalA;
    });
  } else if (ordenarClientes.value === 'pedidos') {
    lista.sort((a,b) => {
      const qtdA = pedidos.filter(p => p.cliente === a.nome).length;
      const qtdB = pedidos.filter(p => p.cliente === b.nome).length;
      return qtdB - qtdA;
    });
  }
  lista.forEach(cliente => {
    const total = pedidos.filter(p => p.cliente === cliente.nome).reduce((s,p) => s+Number(p.valor||0),0);
    const qtd = pedidos.filter(p => p.cliente === cliente.nome).length;
    const tipoTexto = cliente.tipo === 'revendedor' ? 'Revendedor' : cliente.tipo === 'loja' ? 'Loja Parceira' : 'Cliente';
    const card = document.createElement('div');
    card.className = 'cliente-card';
    card.innerHTML = `
      <div class="cliente-top">
        <img src="${cliente.foto || fotoPadrao()}" class="cliente-foto">
        <div class="cliente-info"><h3>${cliente.nome}</h3><span>${tipoTexto}</span></div>
      </div>
      <div class="cliente-dados">
        <p>📞 ${cliente.telefone || '-'}</p>
        <p>📧 ${cliente.email || '-'}</p>
        <p>📸 @${cliente.instagram || '-'}</p>
      </div>
      <div class="cliente-stats">
        <div class="stat-box"><span>Pedidos</span><strong>${qtd}</strong></div>
        <div class="stat-box"><span>Comprado</span><strong>${formatarMoeda(total)}</strong></div>
      </div>
      <div class="cliente-actions">
        <button class="btn-ver-perfil" onclick="abrirPerfil(${clientes.indexOf(cliente)})">Ver Perfil</button>
      </div>
    `;
    listaClientes.appendChild(card);
  });
  atualizarResumo();
}

// BLOCO FILTROS
buscarCliente.addEventListener('input', renderClientes);
ordenarClientes.addEventListener('change', renderClientes);
filtroTime.addEventListener('change', renderClientes);

// BLOCO MODAL NOVO CLIENTE
function abrirNovoCliente() { document.getElementById('modalNovoCliente').classList.add('active'); }
function fecharNovoCliente() { document.getElementById('modalNovoCliente').classList.remove('active'); }
document.getElementById('formCliente')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const fotoInput = document.getElementById('foto');
  const reader = new FileReader();
  reader.onload = function() {
    const novoCliente = {
      nome: document.getElementById('nome').value,
      telefone: document.getElementById('telefone').value,
      email: document.getElementById('email').value,
      instagram: document.getElementById('instagram').value,
      endereco: document.getElementById('endereco').value,
      tipo: document.getElementById('tipoCadastro').value,
      observacoes: document.getElementById('observacoes').value,
      foto: reader.result || fotoPadrao()
    };
    clientes.push(novoCliente);
    db.clientes = clientes;
    saveDatabase(db);
    fecharNovoCliente();
    renderClientes();
  };
  if (fotoInput.files && fotoInput.files[0]) reader.readAsDataURL(fotoInput.files[0]);
  else reader.result = fotoPadrao();
});

// BLOCO PERFIL CLIENTE (removidos empresa, comissão, próximo acerto)
function abrirPerfil(index) {
  const cliente = clientes[index];
  const pedidosCliente = pedidos.filter(p => p.cliente === cliente.nome);
  const totalComprado = pedidosCliente.reduce((s,p) => s+Number(p.valor||0),0);
  let historico = pedidosCliente.map(p => `
    <div class="historico-item">
      <div class="historico-info"><strong>${p.produto}</strong><span>${p.status}</span></div>
      <strong>${formatarMoeda(p.valor)}</strong>
    </div>
  `).join('');
  perfilCliente.innerHTML = `
    <div class="perfil-header">
      <div style="display:flex;align-items:center;gap:20px;">
        <img src="${cliente.foto || fotoPadrao()}" class="perfil-foto">
        <div><h2>${cliente.nome}</h2><p>${cliente.tipo || 'Cliente'}</p></div>
      </div>
      <button class="btn-salvar" onclick="salvarEdicao(${index})"><i class="fa-solid fa-floppy-disk"></i> Salvar</button>
    </div>
    <div class="perfil-grid">
      <div class="perfil-card">
        <h3>Informações</h3>
        <div class="input-group"><label>Nome</label><input type="text" id="editNome" value="${cliente.nome}"></div>
        <div class="input-group"><label>Telefone</label><input type="text" id="editTelefone" value="${cliente.telefone || ''}"></div>
        <div class="input-group"><label>Email</label><input type="email" id="editEmail" value="${cliente.email || ''}"></div>
        <div class="input-group"><label>Instagram</label><input type="text" id="editInstagram" value="${cliente.instagram || ''}"></div>
        <div class="input-group"><label>Endereço</label><input type="text" id="editEndereco" value="${cliente.endereco || ''}"></div>
        <div class="input-group"><label>Tipo</label>
          <select id="editTipo">
            <option value="cliente" ${cliente.tipo==='cliente'||!cliente.tipo?'selected':''}>Cliente</option>
            <option value="revendedor" ${cliente.tipo==='revendedor'?'selected':''}>Revendedor</option>
            <option value="loja" ${cliente.tipo==='loja'?'selected':''}>Loja Parceira</option>
          </select>
        </div>
        <div class="input-group"><label>Observações</label><textarea id="editObservacoes">${cliente.observacoes || ''}</textarea></div>
        <div class="input-group"><label>Foto</label><input type="file" id="editFoto" accept="image/*"></div>
      </div>
      <div class="perfil-card">
        <h3>Métricas</h3>
        <div class="cliente-stats">
          <div class="stat-box"><span>Total Comprado</span><strong>${formatarMoeda(totalComprado)}</strong></div>
          <div class="stat-box"><span>Pedidos</span><strong>${pedidosCliente.length}</strong></div>
          <div class="stat-box"><span>Último Pedido</span><strong>${pedidosCliente.length ? pedidosCliente[pedidosCliente.length-1].data || '-' : '-'}</strong></div>
        </div>
      </div>
    </div>
    <div class="perfil-card"><h3>Histórico de Pedidos</h3><div class="historico-lista">${historico || '<p>Nenhum pedido.</p>'}</div></div>
  `;
  modalCliente.classList.add('active');
}

function salvarEdicao(index) {
  const cliente = clientes[index];
  cliente.nome = document.getElementById('editNome').value;
  cliente.telefone = document.getElementById('editTelefone').value;
  cliente.email = document.getElementById('editEmail').value;
  cliente.instagram = document.getElementById('editInstagram').value;
  cliente.endereco = document.getElementById('editEndereco').value;
  cliente.tipo = document.getElementById('editTipo').value;
  cliente.observacoes = document.getElementById('editObservacoes').value;
  const fotoInput = document.getElementById('editFoto');
  if (fotoInput.files && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function() {
      cliente.foto = reader.result;
      finalizarEdicao();
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    finalizarEdicao();
  }
  function finalizarEdicao() {
    db.clientes = clientes;
    saveDatabase(db);
    renderClientes();
    fecharModal();
  }
}

function fecharModal() { modalCliente.classList.remove('active'); }

// BLOCO INIT
renderClientes();