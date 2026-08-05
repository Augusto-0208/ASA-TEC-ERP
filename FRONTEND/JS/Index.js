// =========================
// BOTÃO NOVO PEDIDO
// =========================

const btnNovoPedidoDashboard =
  document.getElementById(
    'btnNovoPedidoDashboard'
  );

btnNovoPedidoDashboard.addEventListener(
  'click',
  () => {

    window.location.href =
      'pages/pedidos.html';

  }
);