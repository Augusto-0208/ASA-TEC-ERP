
protegerPagina();  // 👈 PRIMEIRA LINHA

// ============================================================
// BLOCO 1: CONFIGURAÇÃO DA API
// ============================================================
// 🔥 IMPORTANTE: se você abre o frontend em http://localhost:5500,
// use a URL absoluta com a porta do backend (3000):
const API_URL = 'http://localhost:3000/api';
// Se você abre o frontend pelo próprio Node (http://localhost:3000),
// use apenas '/api'.

// ============================================================
// BLOCO 2: DADOS (FALLBACK LOCAL)
// ============================================================
let db = getDatabase();
let clientes = db.clientes || [];
let pedidos = db.pedidos || [];

// ============================================================
// BLOCO 3: ELEMENTOS DOM
// ============================================================
const listaClientes = document.getElementById('listaClientes');
const buscarCliente = document.getElementById('buscarCliente');
const ordenarClientes = document.getElementById('ordenarClientes');
const filtroTime = document.getElementById('filtroTime');
const modalCliente = document.getElementById('modalCliente');
const perfilCliente = document.getElementById('perfilCliente');

function formatarMoeda(valor) { return Number(valor||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function fotoPadrao() { return 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }

// ============================================================
// BLOCO 4: CARREGAR CLIENTES DA API
// ============================================================
async function carregarClientes() {
  try {
    console.log('📡 Buscando clientes da API...');
    const resposta = await fetch(`${API_URL}/clientes`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    console.log('✅ Clientes carregados:', dados);
    clientes = dados;
    db.clientes = clientes;
    saveDatabase(db);
    renderClientes();
    atualizarResumo();
  } catch (erro) {
    console.warn('⚠️ API indisponível, usando localStorage');
    clientes = db.clientes || [];
    renderClientes();
    atualizarResumo();
  }
}

// ============================================================
// BLOCO 5: SALVAR CLIENTE NO BACKEND
// ============================================================
async function salvarClienteNoBackend(dados) {
  try {
    console.log('📤 Enviando cliente para API:', dados);
    const resposta = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const resultado = await resposta.json();
    console.log('✅ Cliente criado:', resultado);
    return resultado;
  } catch (erro) {
    console.error('❌ Erro no POST:', erro);
    return null;
  }
}

// ============================================================
// BLOCO 6: ATUALIZAR RESUMO (CARDS)
// ============================================================
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

// ============================================================
// BLOCO 7: RENDER CLIENTES
// ============================================================
function renderClientes() {
  listaClientes.innerHTML = '';
  let lista = [...clientes];
  const termo = buscarCliente.value.toLowerCase();
  const time = filtroTime.value;
  lista = lista.filter(c => c.nome.toLowerCase().includes(termo));
  if (time !== 'todos') {
    lista = lista.filter(c => (c.tipo || 'cliente') === time);
  }
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

// ============================================================
// BLOCO 8: FILTROS
// ============================================================
buscarCliente.addEventListener('input', renderClientes);
ordenarClientes.addEventListener('change', renderClientes);
filtroTime.addEventListener('change', renderClientes);

// ============================================================
// BLOCO 9: MODAL NOVO CLIENTE
// ============================================================
function abrirNovoCliente() { document.getElementById('modalNovoCliente').classList.add('active'); }
function fecharNovoCliente() { document.getElementById('modalNovoCliente').classList.remove('active'); }

const formCliente = document.getElementById('formCliente');
if (formCliente) {
  formCliente.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome')?.value || '';
    const telefone = document.getElementById('telefone')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const instagram = document.getElementById('instagram')?.value || '';
    const endereco = document.getElementById('endereco')?.value || '';
    const tipo = document.getElementById('tipoCadastro')?.value || 'cliente';
    const observacoes = document.getElementById('observacoes')?.value || '';
    const fotoInput = document.getElementById('foto');

    async function finalizar(fotoBase64) {
      const dados = { nome, telefone, email, instagram, endereco, tipo, observacoes, foto: fotoBase64 || fotoPadrao() };
      const resultado = await salvarClienteNoBackend(dados);
      if (resultado) {
        await carregarClientes();
        alert('✅ Cliente cadastrado no banco!');
      } else {
        // fallback
        clientes.push(dados);
        db.clientes = clientes;
        saveDatabase(db);
        renderClientes();
        alert('⚠️ Salvo localmente (fallback)');
      }
      formCliente.reset();
      fecharNovoCliente();
    }

    if (fotoInput && fotoInput.files && fotoInput.files[0]) {
      const reader = new FileReader();
      reader.onload = e => finalizar(e.target.result);
      reader.readAsDataURL(fotoInput.files[0]);
    } else {
      finalizar(null);
    }
  });
}

// ============================================================
// BLOCO 10: PERFIL E EDIÇÃO (resumido)
// ============================================================
function abrirPerfil(index) {
  const cliente = clientes[index];
  if (!cliente) return;
  const pedidosCliente = pedidos.filter(p => p.cliente === cliente.nome);
  const totalComprado = pedidosCliente.reduce((s,p) => s + Number(p.valor||0), 0);
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
      <button class="btn-salvar" data-index="${index}"><i class="fa-solid fa-floppy-disk"></i> Salvar</button>
    </div>
    <div class="perfil-grid">
      <div class="perfil-card">
        <h3>Informações</h3>
        <div class="input-group"><label>Nome</label><input type="text" id="editNome" value="${cliente.nome}"></div>
        <div class="input-group"><label>Telefone</label><input type="text" id="editTelefone" value="${cliente.telefone || ''}"></div>
        <div class="input-group"><label>Email</label><input type="email" id="editEmail" value="${cliente.email || ''}"></div>
        <div class="input-group"><label>Instagram</label><input type="text" id="editInstagram" value="${cliente.instagram || ''}"></div>
        <div class="input-group"><label>Endereço</label><input type="text" id="editEndereco" value="${cliente.endereco || ''}"></div>
        <div class="input-group"><label>Tipo</label><select id="editTipo">
          <option value="cliente" ${cliente.tipo==='cliente'||!cliente.tipo?'selected':''}>Cliente</option>
          <option value="revendedor" ${cliente.tipo==='revendedor'?'selected':''}>Revendedor</option>
          <option value="loja" ${cliente.tipo==='loja'?'selected':''}>Loja Parceira</option>
        </select></div>
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
  document.querySelector('.btn-salvar')?.addEventListener('click', function() {
    const idx = parseInt(this.dataset.index);
    salvarEdicao(idx);
  });
  modalCliente.classList.add('active');
}

async function salvarEdicao(index) {
  const cliente = clientes[index];
  if (!cliente) return;
  const dados = {
    nome: document.getElementById('editNome').value,
    telefone: document.getElementById('editTelefone').value,
    email: document.getElementById('editEmail').value,
    instagram: document.getElementById('editInstagram').value,
    endereco: document.getElementById('editEndereco').value,
    tipo: document.getElementById('editTipo').value,
    observacao: document.getElementById('editObservacoes').value
  };
  const fotoInput = document.getElementById('editFoto');
  if (fotoInput && fotoInput.files && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = async function(e) {
      dados.foto = e.target.result;
      await finalizarAtualizacao(index, dados);
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    await finalizarAtualizacao(index, dados);
  }
}

async function finalizarAtualizacao(index, dados) {
  const cliente = clientes[index];
  const id = cliente.id;
  if (!id) {
    Object.assign(cliente, dados);
    db.clientes = clientes;
    saveDatabase(db);
    renderClientes();
    fecharModal();
    return;
  }
  try {
    const resposta = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!resposta.ok) throw new Error('Erro ao atualizar');
    await carregarClientes();
    fecharModal();
    alert('✅ Cliente atualizado!');
  } catch (erro) {
    console.error(erro);
    Object.assign(cliente, dados);
    db.clientes = clientes;
    saveDatabase(db);
    renderClientes();
    fecharModal();
    alert('⚠️ Atualizado localmente (fallback)');
  }
}

function fecharModal() { modalCliente.classList.remove('active'); }

// ============================================================
// BLOCO 11: INIT
// ============================================================
carregarClientes();