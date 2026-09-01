// ============================================================
// BLOCO DATABASE - ASA TEC 3D
// ============================================================
function getDatabase() {
  const db = localStorage.getItem('asaTecDatabase');
  if (db) return JSON.parse(db);
  const initial = {
    pedidos: [],
    clientes: [],
    produtos: [],
    estoque: [],
    financeiro: [],
    investimentos: [],
    contasPagar: [],
    documentos: [],
    consignados: []
  };
  localStorage.setItem('asaTecDatabase', JSON.stringify(initial));
  return initial;
}

function saveDatabase(db) {
  localStorage.setItem('asaTecDatabase', JSON.stringify(db));
}

// BLOCO FUNÇÕES AUXILIARES
function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

function gerarId() {
  return Date.now();
}