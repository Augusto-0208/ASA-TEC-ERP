// ============================================================
// BLOCO ESTOQUE - ASA TEC 3D
// ============================================================
let db = getDatabase();
let estoque = db.estoque || [];

const estoqueTable = document.getElementById('estoqueTable');
const buscarItem = document.getElementById('buscarItem');
const modalItem = document.getElementById('modalItem');
const estoqueForm = document.getElementById('estoqueForm');
const modalItemTitle = document.getElementById('modalItemTitle');
const btnSalvarTexto = document.getElementById('btnSalvarTexto');

let editandoId = null;

// BLOCO RENDER ESTOQUE
function renderEstoque() {
  estoqueTable.innerHTML = '';
  const termo = buscarItem.value.toLowerCase().trim();
  const filtrados = estoque.filter(item =>
    item.material.toLowerCase().includes(termo) ||
    item.cor.toLowerCase().includes(termo) ||
    item.modelo.toLowerCase().includes(termo) ||
    item.fornecedor.toLowerCase().includes(termo)
  );

  if (filtrados.length === 0) {
    estoqueTable.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:40px; color:var(--text-light);">
          Nenhum item encontrado.
        </td>
      </tr>
    `;
  } else {
    filtrados.forEach((item, idx) => {
      const indexOriginal = estoque.indexOf(item);
      const statusClass = item.disponibilidade === 'Disponível' ? 'disponivel' :
                         item.disponibilidade === 'Baixo Estoque' ? 'baixo' : 'falta';
      estoqueTable.innerHTML += `
        <tr>
          <td><strong>${item.material}</strong></td>
          <td>${item.cor}</td>
          <td>${item.modelo}</td>
          <td>${item.fornecedor}</td>
          <td>${item.quantidade}</td>
          <td>${item.valorRolo ? 'R$ ' + Number(item.valorRolo).toFixed(2) : '-'}</td>
          <td><span class="status ${statusClass}">${item.disponibilidade}</span></td>
          <td>
            <div class="acoes">
              <button class="btn-icon btn-edit" onclick="editarItem(${indexOriginal})" title="Editar">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-icon btn-delete" onclick="excluirItem(${indexOriginal})" title="Excluir">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
  }

  // Atualizar resumo
  const totalItens = estoque.length;
  const disponiveis = estoque.filter(i => i.disponibilidade === 'Disponível').length;
  const baixo = estoque.filter(i => i.disponibilidade === 'Baixo Estoque').length;
  const falta = estoque.filter(i => i.disponibilidade === 'Em Falta').length;

  document.getElementById('totalItens').textContent = totalItens;
  document.getElementById('totalDisponivel').textContent = disponiveis;
  document.getElementById('totalBaixo').textContent = baixo;
  document.getElementById('totalFalta').textContent = falta;

  // Atualizar alertas
  renderAlertas();
}

// BLOCO ALERTAS (baixo estoque / em falta)
function renderAlertas() {
  const baixoList = document.getElementById('baixoEstoqueList');
  const faltaList = document.getElementById('emFaltaList');
  baixoList.innerHTML = '';
  faltaList.innerHTML = '';

  const baixoItens = estoque.filter(i => i.disponibilidade === 'Baixo Estoque');
  const faltaItens = estoque.filter(i => i.disponibilidade === 'Em Falta');

  if (baixoItens.length === 0) {
    baixoList.innerHTML = '<div class="alert-item">Nenhum item com baixo estoque.</div>';
  } else {
    baixoItens.forEach(item => {
      baixoList.innerHTML += `
        <div class="alert-item" style="border-left-color: #f59e0b;">
          <strong>${item.material} - ${item.cor}</strong>
          <span class="alert-qtd">Quantidade: ${item.quantidade}</span>
        </div>
      `;
    });
  }

  if (faltaItens.length === 0) {
    faltaList.innerHTML = '<div class="alert-item">Nenhum item em falta.</div>';
  } else {
    faltaItens.forEach(item => {
      faltaList.innerHTML += `
        <div class="alert-item" style="border-left-color: #ef4444;">
          <strong>${item.material} - ${item.cor}</strong>
          <span class="alert-qtd">Indisponível</span>
        </div>
      `;
    });
  }
}

// BLOCO ABRIR MODAL (novo)
function abrirModalItem() {
  editandoId = null;
  modalItemTitle.textContent = 'Novo Item';
  btnSalvarTexto.textContent = 'Salvar Item';
  estoqueForm.reset();
  document.getElementById('disponibilidade').value = 'Disponível';
  modalItem.classList.add('active');
}

// BLOCO FECHAR MODAL
function fecharModalItem() {
  modalItem.classList.remove('active');
  editandoId = null;
}

// BLOCO EDITAR ITEM
function editarItem(index) {
  const item = estoque[index];
  editandoId = index;
  modalItemTitle.textContent = 'Editar Item';
  btnSalvarTexto.textContent = 'Atualizar Item';

  document.getElementById('material').value = item.material;
  document.getElementById('cor').value = item.cor;
  document.getElementById('modelo').value = item.modelo;
  document.getElementById('fornecedor').value = item.fornecedor;
  document.getElementById('quantidade').value = item.quantidade;
  document.getElementById('valorRolo').value = item.valorRolo || '';
  document.getElementById('disponibilidade').value = item.disponibilidade;

  modalItem.classList.add('active');
}

// BLOCO EXCLUIR ITEM
function excluirItem(index) {
  if (!confirm('Deseja realmente excluir este item do estoque?')) return;
  estoque.splice(index, 1);
  db.estoque = estoque;
  saveDatabase(db);
  renderEstoque();
}

// BLOCO SALVAR ITEM (submit do form)
estoqueForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const novoItem = {
    material: document.getElementById('material').value.trim(),
    cor: document.getElementById('cor').value.trim(),
    modelo: document.getElementById('modelo').value.trim(),
    fornecedor: document.getElementById('fornecedor').value.trim(),
    quantidade: Number(document.getElementById('quantidade').value) || 0,
    valorRolo: Number(document.getElementById('valorRolo').value) || 0,
    disponibilidade: document.getElementById('disponibilidade').value
  };

  // Validação básica
  if (!novoItem.material || !novoItem.cor || !novoItem.modelo || !novoItem.fornecedor) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  if (editandoId !== null) {
    // Edição
    estoque[editandoId] = novoItem;
  } else {
    // Novo
    estoque.push(novoItem);
  }

  db.estoque = estoque;
  saveDatabase(db);
  fecharModalItem();
  renderEstoque();
});

// BLOCO BUSCA
buscarItem.addEventListener('input', renderEstoque);

// BLOCO FECHAR MODAL CLICANDO FORA
modalItem.addEventListener('click', function(e) {
  if (e.target === modalItem) fecharModalItem();
});

// BLOCO TECLA ESC PARA FECHAR
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modalItem.classList.contains('active')) {
    fecharModalItem();
  }
});

// BLOCO INIT
renderEstoque();