// ============================================================
// BLOCO DOCUMENTOS - ASA TEC 3D
// ============================================================

// BLOCO DATABASE
let db = getDatabase();
let documentos = db.documentos || [];
let clientes = db.clientes || [];

// BLOCO ELEMENTOS
const listaDocumentos = document.getElementById('listaDocumentos');
const filtroCliente = document.getElementById('filtroDocCliente');
const modalDocumento = document.getElementById('modalDocumento');
const formDocumento = document.getElementById('formDocumento');

// BLOCO POPULAR DATALIST E FILTRO DE CLIENTES
function popularClientes() {
  const datalist = document.getElementById('listaClientesDoc');
  const filtro = document.getElementById('filtroDocCliente');
  
  // Limpar
  datalist.innerHTML = '';
  filtro.innerHTML = '<option value="">Todos os clientes</option>';

  // Adicionar clientes
  clientes.forEach(c => {
    const nome = c.nome || c;
    datalist.innerHTML += `<option value="${nome}">`;
    filtro.innerHTML += `<option value="${nome}">${nome}</option>`;
  });
}
popularClientes();

// BLOCO RENDER DOCUMENTOS
function renderDocumentos() {
  listaDocumentos.innerHTML = '';
  const filtro = filtroCliente.value;
  const lista = filtro ? documentos.filter(d => d.cliente === filtro) : documentos;

  if (lista.length === 0) {
    listaDocumentos.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-file-circle-plus"></i>
        <h3>Nenhum documento encontrado</h3>
        <p>Cadastre contratos, arquivos e documentos dos clientes.</p>
      </div>
    `;
    return;
  }

  lista.forEach((doc, idx) => {
    const indexOriginal = documentos.indexOf(doc);
    const icon = doc.tipo === 'pdf' ? 'fa-file-pdf' : 
                 doc.tipo === 'doc' || doc.tipo === 'docx' ? 'fa-file-word' :
                 doc.tipo === 'png' || doc.tipo === 'jpg' || doc.tipo === 'jpeg' ? 'fa-file-image' :
                 'fa-file-lines';

    listaDocumentos.innerHTML += `
      <div class="documento-card">
        <div class="doc-header">
          <i class="fa-regular ${icon}"></i>
          <h4>${doc.titulo}</h4>
        </div>
        <div class="doc-body">
          <p><i class="fa-regular fa-user"></i> ${doc.cliente}</p>
          <p><i class="fa-regular fa-calendar"></i> ${doc.data || 'Sem data'}</p>
          <p><i class="fa-regular fa-file"></i> ${doc.nomeArquivo || 'Arquivo'}</p>
        </div>
        <div class="doc-actions">
          <a href="${doc.url}" target="_blank" class="btn-primary" style="display:inline-flex; align-items:center; gap:8px;">
            <i class="fa-regular fa-eye"></i> Visualizar
          </a>
          <button class="btn-danger" onclick="excluirDocumento(${indexOriginal})">
            <i class="fa-regular fa-trash-can"></i> Excluir
          </button>
        </div>
      </div>
    `;
  });
}

// BLOCO ABRIR / FECHAR MODAL
function abrirModalDocumento() {
  formDocumento.reset();
  modalDocumento.classList.add('active');
}

function fecharModalDocumento() {
  modalDocumento.classList.remove('active');
}

// BLOCO SALVAR DOCUMENTO
formDocumento.addEventListener('submit', function(e) {
  e.preventDefault();

  const cliente = document.getElementById('docCliente').value.trim();
  const titulo = document.getElementById('docTitulo').value.trim();
  const data = document.getElementById('docData').value;
  const arquivoInput = document.getElementById('docArquivo');

  if (!cliente || !titulo || !arquivoInput.files.length) {
    alert('Preencha todos os campos e selecione um arquivo.');
    return;
  }

  const arquivo = arquivoInput.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const base64 = reader.result;
    const nomeArquivo = arquivo.name;
    const extensao = nomeArquivo.split('.').pop().toLowerCase();

    const novoDoc = {
      id: Date.now(),
      cliente: cliente,
      titulo: titulo,
      data: data,
      url: base64,
      nomeArquivo: nomeArquivo,
      tipo: extensao
    };

    documentos.push(novoDoc);
    db.documentos = documentos;
    saveDatabase(db);

    fecharModalDocumento();
    renderDocumentos();
    
    // Atualizar clientes se for novo
    if (!clientes.some(c => (c.nome || c) === cliente)) {
      clientes.push({ nome: cliente });
      db.clientes = clientes;
      saveDatabase(db);
      popularClientes();
    }
  };

  reader.readAsDataURL(arquivo);
});

// BLOCO EXCLUIR DOCUMENTO
function excluirDocumento(index) {
  if (!confirm('Deseja realmente excluir este documento?')) return;
  documentos.splice(index, 1);
  db.documentos = documentos;
  saveDatabase(db);
  renderDocumentos();
}

// BLOCO EVENTO FILTRO
filtroCliente.addEventListener('change', renderDocumentos);

// BLOCO FECHAR MODAL CLICANDO FORA
modalDocumento.addEventListener('click', function(e) {
  if (e.target === modalDocumento) fecharModalDocumento();
});

// BLOCO TECLA ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modalDocumento.classList.contains('active')) {
    fecharModalDocumento();
  }
});

// BLOCO INIT
renderDocumentos();