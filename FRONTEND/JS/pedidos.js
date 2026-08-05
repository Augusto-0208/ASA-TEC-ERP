// ======================================
// STORAGE
// ======================================

let pedidos =
JSON.parse(
localStorage.getItem("pedidos")
) || [];

let consignados =
JSON.parse(
localStorage.getItem("consignados")
) || [];

// ======================================
// ELEMENTOS
// ======================================

const listaPedidos =
document.getElementById(
"listaPedidos"
);

const listaConsignados =
document.getElementById(
"listaConsignados"
);

const pesquisaPedido =
document.getElementById(
"pesquisaPedido"
);

const modalPedido =
document.getElementById(
"modalPedido"
);

const modalConsignado =
document.getElementById(
"modalConsignado"
);

const modalDetalhesPedido =
document.getElementById(
"modalDetalhesPedido"
);

const modalDetalhesConsignado =
document.getElementById(
"modalDetalhesConsignado"
);

// ======================================
// BOTÕES
// ======================================

const btnNovoPedido =
document.getElementById(
"btnNovoPedido"
);

const btnNovoConsignado =
document.getElementById(
"btnNovoConsignado"
);

const btnSalvarPedido =
document.getElementById(
"salvarPedido"
);

const btnSalvarConsignado =
document.getElementById(
"salvarConsignado"
);

// ======================================
// CAMPOS PEDIDO
// ======================================

const pedidoCliente =
document.getElementById(
"pedidoCliente"
);

const pedidoProduto =
document.getElementById(
"pedidoProduto"
);

const pedidoValor =
document.getElementById(
"pedidoValor"
);

const pedidoData =
document.getElementById(
"pedidoData"
);

const pedidoEntrega =
document.getElementById(
"pedidoEntrega"
);

const pedidoStatus =
document.getElementById(
"pedidoStatus"
);

const pedidoObs =
document.getElementById(
"pedidoObs"
);

// ======================================
// CAMPOS CONSIGNADO
// ======================================

const consCliente =
document.getElementById(
"consCliente"
);

const consEntrega =
document.getElementById(
"consEntrega"
);

const consAcerto =
document.getElementById(
"consAcerto"
);

const consStatus =
document.getElementById(
"consStatus"
);

// ======================================
// MODAIS
// ======================================

function abrirModalPedido() {

modalPedido.classList.add(
"active"
);

}

function fecharModalPedido() {

modalPedido.classList.remove(
"active"
);

}

function abrirModalConsignado() {

modalConsignado.classList.add(
"active"
);

}

function fecharModalConsignado() {

modalConsignado.classList.remove(
"active"
);

}

function fecharDetalhesPedido() {

modalDetalhesPedido.classList.remove(
"active"
);

}

function fecharDetalhesConsignado() {

modalDetalhesConsignado.classList.remove(
"active"
);

}

// ======================================
// EVENTOS
// ======================================

btnNovoPedido?.addEventListener(
"click",
abrirModalPedido
);

btnNovoConsignado?.addEventListener(
"click",
abrirModalConsignado
);

// ======================================
// STORAGE FUNCTIONS
// ======================================

function salvarPedidosStorage() {

  localStorage.setItem(
    "pedidos",
    JSON.stringify(pedidos)
  );

}

function salvarConsignadosStorage() {

  localStorage.setItem(
    "consignados",
    JSON.stringify(consignados)
  );

}

// ======================================
// LIMPAR FORM PEDIDO
// ======================================

function limparFormularioPedido() {

  pedidoCliente.value = "";
  pedidoProduto.value = "";
  pedidoValor.value = "";
  pedidoData.value = "";
  pedidoEntrega.value = "";
  pedidoStatus.value = "Pendente";
  pedidoObs.value = "";

  const foto =
    document.getElementById(
      "pedidoFotoProduto"
    );

  if (foto) {

    foto.value = "";

  }

}

// ======================================
// LIMPAR FORM CONSIGNADO
// ======================================

function limparFormularioConsignado() {

  consCliente.value = "";
  consEntrega.value = "";
  consAcerto.value = "";
  consStatus.value = "Aberto";

  const listaItens =
    document.getElementById(
      "listaItensConsignado"
    );

  if (listaItens) {

    listaItens.innerHTML = "";

  }

}

// ======================================
// GERAR ID
// ======================================

function gerarId() {

  return Date.now();

}

// ======================================
// SALVAR PEDIDO
// ======================================

function salvarPedido() {

  const novoPedido = {

    id: gerarId(),

    cliente:
      pedidoCliente.value.trim(),

    produto:
      pedidoProduto.value.trim(),

    valor:
      Number(
        pedidoValor.value || 0
      ),

    data:
      pedidoData.value,

    dataEntrega:
      pedidoEntrega.value,

    status:
      pedidoStatus.value,

    observacao:
      pedidoObs.value,

    fotoCliente:
      "../img/default-user.png",

    fotoProduto:
      "../img/default-product.png"

  };

  if (
    !novoPedido.cliente ||
    !novoPedido.produto
  ) {

    alert(
      "Preencha cliente e produto."
    );

    return;

  }

  pedidos.push(
    novoPedido
  );

  salvarPedidosStorage();

  limparFormularioPedido();

  fecharModalPedido();

  renderPedidos();

  atualizarCards();

}

// ======================================
// EVENTO SALVAR PEDIDO
// ======================================

btnSalvarPedido?.addEventListener(
  "click",
  salvarPedido
);

// ======================================
// ITENS CONSIGNADOS
// ======================================

let itensConsignado = [];

// ======================================
// ADICIONAR ITEM
// ======================================

function adicionarItemConsignado() {

  const listaItens =
    document.getElementById(
      "listaItensConsignado"
    );

  if (!listaItens) return;

  const idLinha =
    Date.now();

  listaItens.insertAdjacentHTML(
    "beforeend",
    `

    <div
      class="item-consignado"
      data-id="${idLinha}"
    >

      <input
        type="text"
        placeholder="Produto"
        class="item-produto"
      >

      <input
        type="number"
        placeholder="Qtd"
        class="item-qtd"
      >

      <input
        type="number"
        placeholder="Valor Unit."
        class="item-valor"
      >

      <button
        type="button"
        class="btn-danger remover-item"
      >

        Remover

      </button>

    </div>

    `
  );

}

// ======================================
// BOTÃO NOVO ITEM
// ======================================

document
.getElementById(
  "btnAdicionarItem"
)
?.addEventListener(
  "click",
  adicionarItemConsignado
);

// ======================================
// REMOVER ITEM
// ======================================

document.addEventListener(
  "click",
  (e) => {

    if (
      e.target.classList.contains(
        "remover-item"
      )
    ) {

      e.target
      .closest(
        ".item-consignado"
      )
      ?.remove();

    }

  }
);

// ======================================
// CAPTURAR ITENS
// ======================================

function capturarItensConsignado() {

  const itens = [];

  document
    .querySelectorAll(
      ".item-consignado"
    )
    .forEach((linha) => {

      itens.push({

        produto:

          linha.querySelector(
            ".item-produto"
          )?.value || "",

        quantidade:

          Number(
            linha.querySelector(
              ".item-qtd"
            )?.value || 0
          ),

        valorUnitario:

          Number(
            linha.querySelector(
              ".item-valor"
            )?.value || 0
          )

      });

    });

  return itens;

}

// ======================================
// SALVAR CONSIGNADO
// ======================================

function salvarConsignado() {

  const novoConsignado = {

    id: gerarId(),

    cliente:
      consCliente.value.trim(),

    dataEntrega:
      consEntrega.value,

    dataAcerto:
      consAcerto.value,

    status:
      consStatus.value,

    fotoCliente:
      "../img/default-user.png",

    itens:
      capturarItensConsignado()

  };

  if (
    !novoConsignado.cliente
  ) {

    alert(
      "Informe o cliente."
    );

    return;

  }

  consignados.push(
    novoConsignado
  );

  salvarConsignadosStorage();

  limparFormularioConsignado();

  fecharModalConsignado();

  renderConsignados();

  atualizarCards();

}

// ======================================
// EVENTO SALVAR CONSIGNADO
// ======================================

btnSalvarConsignado?.addEventListener(
  "click",
  salvarConsignado
);

// ======================================
// FORMATAR MOEDA
// ======================================

function formatarMoeda(valor) {

  return Number(valor || 0)
    .toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );

}

// ======================================
// CLASSE STATUS
// ======================================

function obterClasseStatus(status) {

  const s =
    (status || "")
    .toLowerCase();

  if (s.includes("pendente"))
    return "status-pendente";

  if (s.includes("model"))
    return "status-modelagem";

  if (s.includes("imprim"))
    return "status-imprimindo";

  if (s.includes("pós") ||
      s.includes("pos"))
    return "status-pos";

  if (s.includes("pronto"))
    return "status-pronto";

  if (s.includes("entreg"))
    return "status-entregue";

  if (s.includes("cancel"))
    return "status-cancelado";

  return "status-pendente";

}

// ======================================
// RENDER PEDIDOS
// ======================================

function renderPedidos(filtro = "") {

  if (!listaPedidos) return;

  listaPedidos.innerHTML = "";

  const pedidosFiltrados =
    pedidos.filter((pedido) => {

      const texto =
        `${pedido.cliente}
         ${pedido.produto}
         ${pedido.status}`
        .toLowerCase();

      return texto.includes(
        filtro.toLowerCase()
      );

    });

  if (
    pedidosFiltrados.length === 0
  ) {

    listaPedidos.innerHTML = `

      <div class="empty-state">

        Nenhum pedido encontrado.

      </div>

    `;

    return;

  }

  pedidosFiltrados
    .sort((a, b) => {

      return new Date(
        a.dataEntrega || 0
      ) - new Date(
        b.dataEntrega || 0
      );

    });

  pedidosFiltrados.forEach(
    (pedido) => {

      listaPedidos.insertAdjacentHTML(
        "beforeend",

        `
        <div class="pedido-card">

          <div class="card-top">

            <img
              src="${
                pedido.fotoCliente ||
                "../img/default-user.png"
              }"
              class="cliente-foto"
            >

            <div class="card-info">

              <h4>
                ${pedido.cliente}
              </h4>

              <span>
                ${pedido.produto}
              </span>

            </div>

          </div>

          <div class="card-body">

            <div class="card-item">

              <span class="card-label">
                Entrega
              </span>

              <strong>
                ${
                  pedido.dataEntrega ||
                  "-"
                }
              </strong>

            </div>

            <div class="card-item">

              <span class="card-label">
                Valor
              </span>

              <strong>
                ${formatarMoeda(
                  pedido.valor
                )}
              </strong>

            </div>

            <div class="card-item">

              <span
                class="status ${obterClasseStatus(
                  pedido.status
                )}"
              >

                ${pedido.status}

              </span>

            </div>

          </div>

          <div class="card-footer">

            <button
              class="btn-primary"
              onclick="verPedido(${pedido.id})"
            >

              Ver Detalhes

            </button>

          </div>

        </div>
        `

      );

    });

}

// ======================================
// RENDER CONSIGNADOS
// ======================================

function renderConsignados(
  filtro = ""
) {

  if (!listaConsignados)
    return;

  listaConsignados.innerHTML =
    "";

  const filtrados =
    consignados.filter(
      (item) => {

        const texto =
          `${item.cliente}
           ${item.status}`
          .toLowerCase();

        return texto.includes(
          filtro.toLowerCase()
        );

      }
    );

  if (
    filtrados.length === 0
  ) {

    listaConsignados.innerHTML = `

      <div class="empty-state">

        Nenhum consignado encontrado.

      </div>

    `;

    return;

  }

  filtrados.forEach(
    (consignado) => {

      listaConsignados
      .insertAdjacentHTML(

        "beforeend",

        `
        <div class="pedido-card">

          <div class="card-top">

            <img
              src="${
                consignado.fotoCliente ||
                "../img/default-user.png"
              }"
              class="cliente-foto"
            >

            <div class="card-info">

              <h4>
                ${consignado.cliente}
              </h4>

              <span>
                Consignado
              </span>

            </div>

          </div>

          <div class="card-body">

            <div class="card-item">

              <span class="card-label">
                Acerto
              </span>

              <strong>
                ${
                  consignado.dataAcerto ||
                  "-"
                }
              </strong>

            </div>

            <div class="card-item">

              <span
                class="status status-pronto"
              >

                ${
                  consignado.status
                }

              </span>

            </div>

          </div>

          <div class="card-footer">

            <button
              class="btn-primary"
              onclick="verConsignado(${consignado.id})"
            >

              Ver Detalhes

            </button>

          </div>

        </div>
        `

      );

    });

}

// ======================================
// DETALHES PEDIDO
// ======================================

function verPedido(id) {

  const pedido =
    pedidos.find(
      p => p.id === id
    );

  if (!pedido) return;

  const conteudo =
    document.getElementById(
      "conteudoDetalhesPedido"
    );

  if (!conteudo) return;

  conteudo.innerHTML = `

    <div class="detalhes-grid">

      <div>

        <img
          src="${
            pedido.fotoCliente ||
            "../img/default-user.png"
          }"
          class="detalhes-foto"
        >

      </div>

      <div class="detalhes-info">

        <h3>
          ${pedido.cliente}
        </h3>

        <p>
          Produto:
          ${pedido.produto}
        </p>

        <p>
          Valor:
          ${formatarMoeda(
            pedido.valor
          )}
        </p>

        <p>
          Pedido:
          ${pedido.data}
        </p>

        <p>
          Entrega:
          ${pedido.dataEntrega}
        </p>

        <p>
          Status:
          ${pedido.status}
        </p>

      </div>

    </div>

  `;

  modalDetalhesPedido
  ?.classList.add(
    "active"
  );

}

// ======================================
// DETALHES CONSIGNADO
// ======================================

function verConsignado(id) {

  const item =
    consignados.find(
      c => c.id === id
    );

  if (!item) return;

  const conteudo =
    document.getElementById(
      "conteudoDetalhesConsignado"
    );

  if (!conteudo) return;

  conteudo.innerHTML = `

    <div class="detalhes-grid">

      <div>

        <img
          src="${
            item.fotoCliente ||
            "../img/default-user.png"
          }"
          class="detalhes-foto"
        >

      </div>

      <div class="detalhes-info">

        <h3>
          ${item.cliente}
        </h3>

        <p>
          Entrega:
          ${item.dataEntrega}
        </p>

        <p>
          Acerto:
          ${item.dataAcerto}
        </p>

        <p>
          Status:
          ${item.status}
        </p>

        <p>
          Itens:
          ${item.itens?.length || 0}
        </p>

      </div>

    </div>

  `;

  modalDetalhesConsignado
  ?.classList.add(
    "active"
  );

}

// ======================================
// CARDS RESUMO
// ======================================

function atualizarCards() {

  const ativos =
    pedidos.filter(
      p =>
      p.status !== "Entregue"
    ).length;

  const entregues =
    pedidos.filter(
      p =>
      p.status === "Entregue"
    ).length;

  const valor =
    pedidos.reduce(
      (acc, p) =>
      acc + Number(
        p.valor || 0
      ),
      0
    );

  document.getElementById(
    "cardPedidosAtivos"
  ).textContent = ativos;

  document.getElementById(
    "cardPedidosEntregues"
  ).textContent = entregues;

  document.getElementById(
    "cardConsignados"
  ).textContent =
    consignados.length;

  document.getElementById(
    "cardValorProducao"
  ).textContent =
    formatarMoeda(valor);

}

// ======================================
// PESQUISA GLOBAL
// ======================================

pesquisaPedido
?.addEventListener(
  "input",
  function () {

    const valor =
      this.value;

    renderPedidos(valor);

    renderConsignados(valor);

  }
);

// ======================================
// INIT
// ======================================

function iniciarPedidos() {

  renderPedidos();

  renderConsignados();

  atualizarCards();

}

document.addEventListener(
  "DOMContentLoaded",
  iniciarPedidos
);

// ======================================
// ID EM EDIÇÃO
// ======================================

let pedidoSelecionado = null;
let consignadoSelecionado = null;

// ======================================
// ABRIR DETALHES PEDIDO
// ======================================

function verPedido(id) {

const pedido =
pedidos.find(
p => p.id === id
);

if (!pedido) return;

pedidoSelecionado = id;

document
.getElementById(
"conteudoDetalhesPedido"
).innerHTML = `

<div class="form-group">

  <label>Cliente</label>

  <input
    type="text"
    id="editCliente"
    value="${pedido.cliente || ''}"
  >

</div>

<div class="form-group">

  <label>Produto</label>

  <input
    type="text"
    id="editProduto"
    value="${pedido.produto || ''}"
  >

</div>

<div class="form-group">

  <label>Valor</label>

  <input
    type="number"
    id="editValor"
    value="${pedido.valor || 0}"
  >

</div>

<div class="form-group">

  <label>Status</label>

  <select id="editStatus">

    <option ${pedido.status === "Pendente" ? "selected" : ""}>
    Pendente
    </option>

    <option ${pedido.status === "Modelagem" ? "selected" : ""}>
    Modelagem
    </option>

    <option ${pedido.status === "Imprimindo" ? "selected" : ""}>
    Imprimindo
    </option>

    <option ${pedido.status === "Pós-processo" ? "selected" : ""}>
    Pós-processo
    </option>

    <option ${pedido.status === "Pronto" ? "selected" : ""}>
    Pronto
    </option>

    <option ${pedido.status === "Entregue" ? "selected" : ""}>
    Entregue
    </option>

  </select>

</div>

<div class="form-group">

  <label>Data Pedido</label>

  <input
    type="date"
    id="editDataPedido"
    value="${pedido.data || ''}"
  >

</div>

<div class="form-group">

  <label>Data Entrega</label>

  <input
    type="date"
    id="editEntrega"
    value="${pedido.dataEntrega || ''}"
  >

</div>

`;

modalDetalhesPedido
.classList.add(
"active"
);

}

// ======================================
// SALVAR EDIÇÃO PEDIDO
// ======================================

document
.getElementById(
"btnSalvarEdicaoPedido"
)
?.addEventListener(
"click",
() => {

const pedido =
  pedidos.find(
    p =>
    p.id === pedidoSelecionado
  );

if (!pedido) return;

pedido.cliente =
  document.getElementById(
    "editCliente"
  ).value;

pedido.produto =
  document.getElementById(
    "editProduto"
  ).value;

pedido.valor =
  Number(
    document.getElementById(
      "editValor"
    ).value
  );

pedido.status =
  document.getElementById(
    "editStatus"
  ).value;

pedido.data =
  document.getElementById(
    "editDataPedido"
  ).value;

pedido.dataEntrega =
  document.getElementById(
    "editEntrega"
  ).value;

salvarPedidosStorage();

renderPedidos();

atualizarCards();

fecharDetalhesPedido();

}
);

// ======================================
// EXCLUIR PEDIDO
// ======================================

document
.getElementById(
"btnExcluirPedido"
)
?.addEventListener(
"click",
() => {

const pedido =
  pedidos.find(
    p =>
    p.id === pedidoSelecionado
  );

if (!pedido) return;

if (
  pedido.status === "Entregue"
) {

  alert(
    "Pedido entregue não pode ser excluído."
  );

  return;

}

pedidos =
  pedidos.filter(
    p =>
    p.id !== pedidoSelecionado
  );

salvarPedidosStorage();

renderPedidos();

atualizarCards();

fecharDetalhesPedido();

}
);

// ======================================
// ABRIR DETALHES CONSIGNADO
// ======================================

function verConsignado(id) {

const consignado =
consignados.find(
c => c.id === id
);

if (!consignado) return;

consignadoSelecionado = id;

document
.getElementById(
"conteudoDetalhesConsignado"
).innerHTML = `

<div class="form-group">

  <label>Cliente</label>

  <input
    type="text"
    id="editConsCliente"
    value="${consignado.cliente || ''}"
  >

</div>

<div class="form-group">

  <label>Status</label>

  <input
    type="text"
    id="editConsStatus"
    value="${consignado.status || ''}"
  >

</div>

<div class="form-group">

  <label>Entrega</label>

  <input
    type="date"
    id="editConsEntrega"
    value="${consignado.dataEntrega || ''}"
  >

</div>

<div class="form-group">

  <label>Acerto</label>

  <input
    type="date"
    id="editConsAcerto"
    value="${consignado.dataAcerto || ''}"
  >

</div>

`;

modalDetalhesConsignado
.classList.add(
"active"
);

}

// ======================================
// SALVAR CONSIGNADO
// ======================================

document
.getElementById(
"btnSalvarEdicaoConsignado"
)
?.addEventListener(
"click",
() => {

const consignado =
  consignados.find(
    c =>
    c.id === consignadoSelecionado
  );

if (!consignado) return;

consignado.cliente =
  document.getElementById(
    "editConsCliente"
  ).value;

consignado.status =
  document.getElementById(
    "editConsStatus"
  ).value;

consignado.dataEntrega =
  document.getElementById(
    "editConsEntrega"
  ).value;

consignado.dataAcerto =
  document.getElementById(
    "editConsAcerto"
  ).value;

salvarConsignadosStorage();

renderConsignados();

atualizarCards();

fecharDetalhesConsignado();

}
);

// ======================================
// EXCLUIR CONSIGNADO
// ======================================

document
.getElementById(
"btnExcluirConsignado"
)
?.addEventListener(
"click",
() => {

consignados =
  consignados.filter(
    c =>
    c.id !== consignadoSelecionado
  );

salvarConsignadosStorage();

renderConsignados();

atualizarCards();

fecharDetalhesConsignado();

}
);
