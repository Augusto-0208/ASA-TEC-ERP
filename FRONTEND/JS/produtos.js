// ============================================================
// BLOCO PRODUTOS
// ============================================================
let db = getDatabase();
let produtos = db.produtos || [];

const listaProdutos = document.getElementById('listaProdutos');
const buscarProduto = document.getElementById('buscarProduto');
const modalProduto = document.getElementById('modalProduto');
const perfilProduto = document.getElementById('perfilProduto');

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProdutos() {
  listaProdutos.innerHTML = '';
  const termo = buscarProduto.value.toLowerCase().trim();
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
  
  if (filtrados.length === 0) {
    listaProdutos.innerHTML = '<p style="text-align:center; padding:40px; color:var(--text-light);">Nenhum produto encontrado.</p>';
    return;
  }

  filtrados.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.innerHTML = `
      <img src="${produto.foto || '../assets/default-product.png'}" class="produto-foto" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>Material: ${produto.material || '-'}</p>
      <div class="produto-preco">${formatarMoeda(produto.precoVenda)}</div>
      <button class="btn-detalhes" onclick="abrirProduto(${produto.id})">Ver Detalhes</button>
    `;
    listaProdutos.appendChild(card);
  });
}

buscarProduto.addEventListener('input', renderProdutos);

// BLOCO NOVO PRODUTO
function abrirNovoProduto() {
  document.getElementById('modalNovoProduto').style.display = 'flex';
}
function fecharNovoProduto() {
  document.getElementById('modalNovoProduto').style.display = 'none';
}

document.getElementById('formProduto').addEventListener('submit', function(e) {
  e.preventDefault();
  const fotoInput = document.getElementById('fotoProduto');
  const reader = new FileReader();
  reader.onload = function() {
    const novo = {
      id: Date.now(),
      nome: document.getElementById('nomeProduto').value,
      precoVenda: Number(document.getElementById('precoVenda').value),
      precoCusto: Number(document.getElementById('precoCusto').value),
      material: document.getElementById('material').value,
      linkStl: document.getElementById('linkStl').value,
      descricao: document.getElementById('descricaoProduto').value,
      foto: reader.result || '../assets/default-product.png'
    };
    produtos.push(novo);
    db.produtos = produtos;
    saveDatabase(db);
    fecharNovoProduto();
    renderProdutos();
    this.reset();
  };
  if (fotoInput.files && fotoInput.files[0]) {
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    reader.result = '../assets/default-product.png';
    reader.onload();
  }
});

// BLOCO PERFIL PRODUTO
function abrirProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
  
  perfilProduto.innerHTML = `
    <div style="padding:25px;">
      <div class="perfil-topo">
        <img src="${produto.foto || '../assets/default-product.png'}" class="perfil-foto">
        <div class="perfil-info">
          <h2>${produto.nome}</h2>
          <p>Material: ${produto.material || '-'}</p>
          <p>Venda: ${formatarMoeda(produto.precoVenda)}</p>
          <p>Custo: ${formatarMoeda(produto.precoCusto)}</p>
          ${produto.linkStl ? `<a href="${produto.linkStl}" target="_blank" class="perfil-link">Abrir STL</a>` : ''}
        </div>
      </div>
      <div class="perfil-grid">
        <div class="perfil-card">
          <h3>Informações</h3>
          <div class="input-group"><label>Nome</label><input type="text" id="editNomeProd" value="${produto.nome}"></div>
          <div class="input-group"><label>Material</label><input type="text" id="editMaterialProd" value="${produto.material || ''}"></div>
          <div class="input-group"><label>Link STL</label><input type="text" id="editLinkProd" value="${produto.linkStl || ''}"></div>
        </div>
        <div class="perfil-card">
          <h3>Valores</h3>
          <div class="input-group"><label>Preço Venda</label><input type="number" step="0.01" id="editVendaProd" value="${produto.precoVenda}"></div>
          <div class="input-group"><label>Preço Custo</label><input type="number" step="0.01" id="editCustoProd" value="${produto.precoCusto}"></div>
          <div class="input-group"><label>Nova Foto</label><input type="file" id="editFotoProd" accept="image/*"></div>
        </div>
      </div>
      <div class="perfil-card">
        <h3>Descrição</h3>
        <textarea id="editDescProd" rows="3">${produto.descricao || ''}</textarea>
      </div>
      <div class="perfil-actions">
        <button class="btn-primary" onclick="salvarProduto(${produto.id})">Salvar</button>
        <button class="btn-danger" onclick="excluirProduto(${produto.id})">Excluir</button>
      </div>
    </div>
  `;
  modalProduto.style.display = 'flex';
}

function salvarProduto(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
  
  produto.nome = document.getElementById('editNomeProd').value;
  produto.material = document.getElementById('editMaterialProd').value;
  produto.linkStl = document.getElementById('editLinkProd').value;
  produto.precoVenda = Number(document.getElementById('editVendaProd').value);
  produto.precoCusto = Number(document.getElementById('editCustoProd').value);
  produto.descricao = document.getElementById('editDescProd').value;
  
  const fotoInput = document.getElementById('editFotoProd');
  if (fotoInput.files && fotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function() {
      produto.foto = reader.result;
      finalizarEdicao();
    };
    reader.readAsDataURL(fotoInput.files[0]);
  } else {
    finalizarEdicao();
  }
  
  function finalizarEdicao() {
    db.produtos = produtos;
    saveDatabase(db);
    renderProdutos();
    fecharModalProduto();
  }
}

function excluirProduto(id) {
  if (!confirm('Excluir este produto?')) return;
  produtos = produtos.filter(p => p.id !== id);
  db.produtos = produtos;
  saveDatabase(db);
  renderProdutos();
  fecharModalProduto();
}

function fecharModalProduto() {
  modalProduto.style.display = 'none';
}

// Fechar modais clicando fora
window.addEventListener('click', function(e) {
  const modalNovo = document.getElementById('modalNovoProduto');
  if (e.target === modalNovo) fecharNovoProduto();
  if (e.target === modalProduto) fecharModalProduto();
});

// BLOCO INIT
renderProdutos();