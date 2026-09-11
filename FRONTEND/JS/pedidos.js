
protegerPagina();  // 👈 PRIMEIRA LINHA

// =============================================
// BLOCO 1: CONFIGURAÇÃO DA API
// =============================================
const API_URL = '/api'; // Relativo, pois front e back estão juntos

// =============================================
// BLOCO 2: DADOS LOCAIS (FALLBACK)
// =============================================
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let consignados = JSON.parse(localStorage.getItem("consignados")) || [];

// =============================================
// BLOCO 3: ELEMENTOS DOM (seus existentes)
// =============================================
const listaPedidos = document.getElementById("listaPedidos");
const listaConsignados = document.getElementById("listaConsignados");
const pesquisaPedido = document.getElementById("pesquisaPedido");
const modalPedido = document.getElementById("modalPedido");
const modalConsignado = document.getElementById("modalConsignado");
const modalDetalhesPedido = document.getElementById("modalDetalhesPedido");
const modalDetalhesConsignado = document.getElementById("modalDetalhesConsignado");

// =============================================
// BLOCO 4: BOTÕES E CAMPOS (existentes)
// =============================================
// ... mantenha todos os seus getElementById e variáveis como estão ...
// Não vou repetir tudo para não alongar, mas você deve manter.
// Apenas substitua as funções de salvamento/carregamento pelas novas abaixo.

// =============================================
// BLOCO 5: NOVAS FUNÇÕES DE COMUNICAÇÃO COM API
// =============================================

// Carregar pedidos do backend (substitui a leitura local)
async function carregarPedidos() {
  try {
    const resposta = await fetch(`${API_URL}/pedidos`);
    if (!resposta.ok) throw new Error('Erro ao carregar');
    pedidos = await resposta.json();
    // Atualiza também o localStorage (opcional, para fallback)
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    renderPedidos();
    atualizarCards();
  } catch (erro) {
    console.warn('⚠️ Usando localStorage como fallback para pedidos');
    pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    renderPedidos();
    atualizarCards();
  }
}

// Salvar novo pedido no backend
async function salvarPedido() {
  // Captura os dados do formulário (igual ao seu código original)
  const cliente = document.getElementById("pedidoCliente").value.trim();
  const produto = document.getElementById("pedidoProduto").value.trim();
  const valor = Number(document.getElementById("pedidoValor").value) || 0;
  const data = document.getElementById("pedidoData").value;
  const dataEntrega = document.getElementById("pedidoEntrega").value;
  const status = document.getElementById("pedidoStatus").value;
  const observacao = document.getElementById("pedidoObs").value;

  if (!cliente || !produto) {
    alert("Preencha cliente e produto.");
    return;
  }

  const novoPedido = {
    cliente,
    produto,
    valor,
    data: data || new Date().toISOString().split('T')[0],
    dataEntrega: dataEntrega || null,
    status,
    observacao
  };

  try {
    const resposta = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPedido)
    });
    if (!resposta.ok) throw new Error('Erro ao salvar');
    await carregarPedidos(); // recarrega a lista
    fecharModalPedido();
    limparFormularioPedido();
  } catch (erro) {
    console.error('❌ Erro ao salvar no servidor:', erro);
    // Fallback: salva localmente
    alert('Erro ao salvar no servidor. Salvando localmente.');
    pedidos.push(novoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    renderPedidos();
    atualizarCards();
    fecharModalPedido();
    limparFormularioPedido();
  }
}

// Atualizar pedido (usado no modal de edição)
async function atualizarPedidoNoBackend(id, dados) {
  try {
    const resposta = await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!resposta.ok) throw new Error('Erro ao atualizar');
    await carregarPedidos();
  } catch (erro) {
    console.error('Erro ao atualizar:', erro);
    // Fallback: atualiza localmente
    const index = pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
      pedidos[index] = { ...pedidos[index], ...dados };
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
      renderPedidos();
      atualizarCards();
    }
  }
}

// Excluir pedido
async function excluirPedidoDoBackend(id) {
  try {
    const resposta = await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'DELETE'
    });
    if (!resposta.ok) throw new Error('Erro ao excluir');
    await carregarPedidos();
  } catch (erro) {
    console.error('Erro ao excluir:', erro);
    // Fallback: exclui localmente
    pedidos = pedidos.filter(p => p.id !== id);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    renderPedidos();
    atualizarCards();
  }
}

// =============================================
// BLOCO 6: ADAPTAR AS FUNÇÕES EXISTENTES
// =============================================

// Substitua a chamada de salvarPedido no evento do botão
document.getElementById("salvarPedido")?.addEventListener("click", salvarPedido);

// Substitua a função verPedido para usar atualizarPedidoNoBackend
// e excluirPedidoDoBackend nos botões correspondentes.

// Exemplo: no seu modal de edição, o botão "Salvar Edição" deve chamar:
// await atualizarPedidoNoBackend(pedidoSelecionado, dados);
// E o botão "Excluir" deve chamar:
// await excluirPedidoDoBackend(pedidoSelecionado);

// =============================================
// BLOCO 7: INICIALIZAÇÃO
// =============================================
// Substitua a chamada inicial de render por carregarPedidos()
document.addEventListener("DOMContentLoaded", () => {
  carregarPedidos(); // agora assíncrono
  // Se você tiver consignados, mantenha a lógica local ou crie uma API depois.
});

// =============================================
// BLOCO 8: FUNÇÕES AUXILIARES (já existentes)
// =============================================
// Mantenha suas funções renderPedidos, renderConsignados, atualizarCards,
// formatarMoeda, obterClasseStatus, etc. Elas não mudam.