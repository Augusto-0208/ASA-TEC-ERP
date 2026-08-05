// ======================================
// DASHBOARD JS - ASA TEC 3D
// ======================================

// ======================================
// STORAGE
// ======================================

const pedidos =
  JSON.parse(
    localStorage.getItem("pedidos")
  ) || [];

const clientes =
  JSON.parse(
    localStorage.getItem("clientes")
  ) || [];

const consignados =
  JSON.parse(
    localStorage.getItem("consignados")
  ) || [];

// ======================================
// DATA ATUAL
// ======================================

const hoje = new Date();

const mesAtual = hoje.getMonth();

const anoAtual = hoje.getFullYear();

// ======================================
// STATUS VÁLIDOS
// ======================================

const statusVenda = [
  "Pago",
  "Entregue",
  "Concluído",
  "Concluido",
  "Finalizado"
];

// ======================================
// ELEMENTOS
// ======================================

const vendasMesEl =
  document.getElementById("vendasMes");

const pedidosAtivosEl =
  document.getElementById("pedidosAtivos");

const totalConsignadosEl =
  document.getElementById("totalConsignados");

const clientesVipEl =
  document.getElementById("clientesVip");

const vendasMensaisEl =
  document.getElementById("vendasMensais");

const clienteMesEl =
  document.getElementById("clienteMes");

const ultimosPedidosEl =
  document.getElementById("ultimosPedidos");

const impressoesProducaoEl =
  document.getElementById("impressoesProducao");

const proximosAcertosEl =
  document.getElementById("proximosAcertos");

// ======================================
// UTIL
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

function formatarData(data) {

  if (!data) return "-";

  try {

    return new Date(data)
      .toLocaleDateString("pt-BR");

  } catch {

    return "-";

  }

}

function obterFotoCliente(nomeCliente) {

  const cliente = clientes.find(

    (c) =>
      c.nome === nomeCliente

  );

  if (
    cliente &&
    cliente.foto
  ) {

    return cliente.foto;

  }

  return "img/user.png";

}

function pedidoEhVenda(pedido) {

  return statusVenda.includes(
    pedido.status
  );

}

// ======================================
// VENDAS MÊS
// ======================================

function calcularVendasMes() {

  let total = 0;

  pedidos.forEach((pedido) => {

    if (
      !pedido.data ||
      !pedidoEhVenda(pedido)
    ) {
      return;
    }

    const dataPedido =
      new Date(pedido.data);

    const mesmoMes =
      dataPedido.getMonth() === mesAtual;

    const mesmoAno =
      dataPedido.getFullYear() === anoAtual;

    if (
      mesmoMes &&
      mesmoAno
    ) {

      total += Number(
        pedido.valor || 0
      );

    }

  });

  return total;

}

// ======================================
// PEDIDOS ATIVOS
// ======================================

function calcularPedidosAtivos() {

  return pedidos.filter(
    (pedido) =>
      pedido.status !== "Entregue"
  ).length;

}

// ======================================
// CONSIGNADOS
// ======================================

function calcularTotalConsignados() {

  return consignados.length;

}

// ======================================
// RANKING CLIENTES
// ======================================

function gerarRankingClientes() {

  const mapa = {};

  pedidos.forEach((pedido) => {

    if (
      !pedidoEhVenda(pedido)
    ) {
      return;
    }

    const cliente =
      pedido.cliente || "Sem Nome";

    const valor =
      Number(
        pedido.valor || 0
      );

    if (!mapa[cliente]) {

      mapa[cliente] = {

        nome: cliente,

        total: 0

      };

    }

    mapa[cliente].total += valor;

  });

  return Object.values(mapa)
    .sort(
      (a, b) =>
        b.total - a.total
    );

}

// ======================================
// CLIENTE DO MÊS
// ======================================

function renderClienteMes() {

  if (!clienteMesEl) return;

  const ranking =
    gerarRankingClientes();

  const elegiveis =
    ranking.filter(

      (cliente) =>
        cliente.total >= 100

    );

  if (
    elegiveis.length === 0
  ) {

    clienteMesEl.innerHTML = `

      <div class="cliente-mes-card">

        <p>
          Nenhum cliente elegível
        </p>

      </div>

    `;

    return;

  }

  const cliente =
    elegiveis[0];

  const foto =
    obterFotoCliente(
      cliente.nome
    );

  clienteMesEl.innerHTML = `

    <div class="cliente-mes-card">

      <img
        src="${foto}"
        class="cliente-mes-foto"
        alt="${cliente.nome}"
      >

      <p>
        Cliente que mais comprou
      </p>

      <h2>
        ${cliente.nome}
      </h2>

      <strong>
        ${formatarMoeda(
          cliente.total
        )}
      </strong>

    </div>

  `;

}

// ======================================
// TOP 3 VIP
// ======================================

const foto =
  obterFotoCliente(
    cliente.nome
  );

clientesVipEl.innerHTML += `

<div class="vip-item">

  <div class="vip-left">

    <img
      src="${foto}"
      class="vip-foto"
    >

    <div class="vip-info">

      <strong>

        ${index + 1}º
        ${cliente.nome}

      </strong>

      <span>

        Cliente VIP

      </span>

    </div>

  </div>

  <div class="vip-valor">

    ${formatarMoeda(cliente.total)}

  </div>

</div>

`;

// ======================================
// VENDAS MENSAIS
// ======================================

function renderVendasMensais() {

  if (!vendasMensaisEl) return;

  vendasMensaisEl.innerHTML = "";

  const meses = [

    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez"

  ];

  meses.forEach(
    (mes, indice) => {

      let total = 0;

      pedidos.forEach(
        (pedido) => {

          if (
            !pedido.data ||
            !pedidoEhVenda(
              pedido
            )
          ) {
            return;
          }

          const data =
            new Date(
              pedido.data
            );

          if (

            data.getMonth() === indice &&
            data.getFullYear() === anoAtual

          ) {

            total += Number(
              pedido.valor || 0
            );

          }

        }
      );

      vendasMensaisEl.innerHTML += `

        <div class="mes-item">

          <span>
            ${mes}
          </span>

          <strong>

            ${formatarMoeda(total)}

          </strong>

        </div>

      `;

    }
  );

}

// ======================================
// PRÓXIMAS ENTREGAS
// ======================================

function renderProximosAcertos() {

  if (!proximosAcertosEl) return;

  proximosAcertosEl.innerHTML = "";

  const lista = [...consignados]

    .filter(

      item => item.dataAcerto

    )

    .sort(

      (a, b) =>

        new Date(a.dataAcerto) -
        new Date(b.dataAcerto)

    )

    .slice(0, 10);

  if (lista.length === 0) {

    proximosAcertosEl.innerHTML = `

      <p>
        Nenhum acerto encontrado.
      </p>

    `;

    return;

  }

  lista.forEach(item => {

    const foto =
      obterFotoCliente(
        item.cliente
      );

    proximosAcertosEl.innerHTML += `

      <div class="acerto-item">

        <div class="acerto-cliente">

          <img
            src="${foto}"
          >

          <div class="acerto-info">

            <strong>

              ${item.cliente}

            </strong>

            <span>

              ${item.itens?.length || 0}
              itens

            </span>

          </div>

        </div>

        <div class="acerto-data">

          ${formatarData(
            item.dataAcerto
          )}

        </div>

      </div>

    `;

  });

}

// ======================================
// PRODUÇÃO
// ======================================

function renderProducao() {

  if (
    !impressoesProducaoEl
  ) {
    return;
  }

  impressoesProducaoEl.innerHTML =
    "";

  const producao =
    pedidos.filter(

      (pedido) =>
        pedido.status ===
        "Em Produção"

    );

  if (
    producao.length === 0
  ) {

    impressoesProducaoEl.innerHTML = `

      <p>
        Nenhuma impressão em produção.
      </p>

    `;

    return;

  }

  producao.forEach(
    (pedido) => {

      impressoesProducaoEl.innerHTML += `

        <div class="pedido-recente">

          <div>

            <strong>

              ${pedido.cliente}

            </strong>

            <span>

              ${pedido.produto || "-"}

            </span>

          </div>

          <span>

            ${pedido.status}

          </span>

        </div>

      `;

    }
  );

}

// ======================================
// CARDS
// ======================================

function renderCards() {

  if (vendasMesEl) {

    vendasMesEl.textContent =
      formatarMoeda(
        calcularVendasMes()
      );

  }

  if (pedidosAtivosEl) {

    pedidosAtivosEl.textContent =
      calcularPedidosAtivos();

  }

  if (
    totalConsignadosEl
  ) {

    totalConsignadosEl.textContent =
      calcularTotalConsignados();

  }

}

// ======================================
// INIT
// ======================================

function iniciarDashboard() {

  renderCards();

  renderClienteMes();

  renderClientesVip();

  renderVendasMensais();

  renderProximasEntregas();

  renderProximosAcertos();

  renderProducao();

}

// ======================================
// START
// ======================================

document.addEventListener(
  "DOMContentLoaded",
  iniciarDashboard
);