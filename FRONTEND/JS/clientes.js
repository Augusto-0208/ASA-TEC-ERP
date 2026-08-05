// ======================================
// STORAGE
// ======================================

let clientes =
  JSON.parse(
    localStorage.getItem("clientes")
  ) || [];

const pedidos =
  JSON.parse(
    localStorage.getItem("pedidos")
  ) || [];

// ======================================
// ELEMENTOS
// ======================================

const formCliente =
  document.getElementById(
    "formCliente"
  );

const listaClientes =
  document.getElementById(
    "listaClientes"
  );

const buscarCliente =
  document.getElementById(
    "buscarCliente"
  );

const ordenarClientes =
  document.getElementById(
    "ordenarClientes"
  );

const modalCliente =
  document.getElementById(
    "modalCliente"
  );

const perfilCliente =
  document.getElementById(
    "perfilCliente"
  );

// ======================================
// UTIL
// ======================================

function moeda(valor) {

  return Number(valor || 0)
    .toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );

}

function fotoPadrao() {

  return "https://cdn-icons-png.flaticon.com/512/149/149071.png";

}

// ======================================
// PEDIDOS CLIENTE
// ======================================

function pedidosCliente(nome) {

  return pedidos.filter(
    pedido =>
      pedido.cliente === nome
  );

}

function totalComprado(nome) {

  let total = 0;

  pedidosCliente(nome)
    .forEach((pedido) => {

      total += Number(
        pedido.valor || 0
      );

    });

  return total;

}

// ======================================
// CARDS SUPERIORES
// ======================================

function atualizarResumo() {

  const totalClientes =
    clientes.filter(
      c =>
        c.tipo === "cliente"
    ).length;

  const totalRevendedores =
    clientes.filter(
      c =>
        c.tipo === "revendedor"
    ).length;

  const totalLojas =
    clientes.filter(
      c =>
        c.tipo === "loja"
    ).length;

  let valorTotal = 0;

  clientes.forEach(
    cliente => {

      valorTotal +=
        totalComprado(
          cliente.nome
        );

    }
  );

  document.getElementById(
    "totalClientes"
  ).textContent =
    totalClientes;

  document.getElementById(
    "totalRevendedores"
  ).textContent =
    totalRevendedores;

  document.getElementById(
    "totalLojas"
  ).textContent =
    totalLojas;

  document.getElementById(
    "valorVendido"
  ).textContent =
    moeda(valorTotal);

}

// ======================================
// RENDER CLIENTES
// ======================================

function renderClientes() {

  listaClientes.innerHTML = "";

  let lista =
    [...clientes];

  const termo =
    buscarCliente.value
      .toLowerCase();

  lista =
    lista.filter(
      cliente =>
        cliente.nome
          .toLowerCase()
          .includes(termo)
    );

  // ======================================
  // ORDENAÇÃO
  // ======================================

  if (
    ordenarClientes.value ===
    "nome"
  ) {

    lista.sort(
      (a, b) =>
        a.nome.localeCompare(
          b.nome
        )
    );

  }

  if (
    ordenarClientes.value ===
    "valor"
  ) {

    lista.sort(
      (a, b) =>
        totalComprado(
          b.nome
        ) -
        totalComprado(
          a.nome
        )
    );

  }

  if (
    ordenarClientes.value ===
    "pedidos"
  ) {

    lista.sort(
      (a, b) =>
        pedidosCliente(
          b.nome
        ).length -
        pedidosCliente(
          a.nome
        ).length
    );

  }

  // ======================================
  // CARDS
  // ======================================

  lista.forEach(
    cliente => {

      const card =
        document.createElement(
          "div"
        );

      const total =
        totalComprado(
          cliente.nome
        );

      const quantidadePedidos =
        pedidosCliente(
          cliente.nome
        ).length;

      let tipoTexto =
        "Cliente";

      if (
        cliente.tipo ===
        "revendedor"
      ) {

        tipoTexto =
          "Revendedor";

      }

      if (
        cliente.tipo ===
        "loja"
      ) {

        tipoTexto =
          "Loja Parceira";

      }

      card.className =
        "cliente-card";

      card.innerHTML = `

        <div class="cliente-top">

          <img
            src="${
              cliente.foto ||
              fotoPadrao()
            }"
            class="cliente-foto"
          >

          <div class="cliente-info">

            <h3>
              ${cliente.nome}
            </h3>

            <span>
              ${tipoTexto}
            </span>

          </div>

        </div>

        <div class="cliente-dados">

          <p>
            📞 ${
              cliente.telefone ||
              "-"
            }
          </p>

          <p>
            📧 ${
              cliente.email ||
              "-"
            }
          </p>

          <p>
            📸 @${
              cliente.instagram ||
              "-"
            }
          </p>

        </div>

        <div class="cliente-stats">

          <div class="stat-box">

            <span>
              Pedidos
            </span>

            <strong>
              ${quantidadePedidos}
            </strong>

          </div>

          <div class="stat-box">

            <span>
              Comprado
            </span>

            <strong>
              ${moeda(total)}
            </strong>

          </div>

        </div>

        <div class="cliente-actions">

          <button
            class="btn-ver-perfil"
            onclick="abrirPerfil(${clientes.indexOf(cliente)})"
          >

            Ver Perfil

          </button>

        </div>

      `;

      listaClientes
        .appendChild(card);

    }
  );

  atualizarResumo();

}

// ======================================
// NOVO CLIENTE
// ======================================

formCliente.addEventListener(
  "submit",
  function(e) {

    e.preventDefault();

    const arquivo =
      document.getElementById(
        "foto"
      ).files[0];

    function salvar(
      foto = ""
    ) {

      const cliente = {

        nome:
          document.getElementById(
            "nome"
          ).value,

        telefone:
          document.getElementById(
            "telefone"
          ).value,

        email:
          document.getElementById(
            "email"
          ).value,

        instagram:
          document.getElementById(
            "instagram"
          ).value,

        endereco:
          document.getElementById(
            "endereco"
          ).value,

        empresa:
          document.getElementById(
            "empresa"
          ).value,

        tipo:
          document.getElementById(
            "tipoCadastro"
          ).value,

        comissao:
          document.getElementById(
            "comissao"
          ).value,

        proximoAcerto:
          document.getElementById(
            "proximoAcerto"
          ).value,

        observacoes:
          document.getElementById(
            "observacoes"
          ).value,

        foto:
          foto ||
          fotoPadrao()

      };

      clientes.push(
        cliente
      );

      localStorage.setItem(
        "clientes",
        JSON.stringify(
          clientes
        )
      );

      formCliente.reset();

      fecharNovoCliente();

      renderClientes();

    }

    if (arquivo) {

      const reader =
        new FileReader();

      reader.onload =
        function() {

          salvar(
            reader.result
          );

        };

      reader.readAsDataURL(
        arquivo
      );

    }

    else {

      salvar();

    }

  }
);

// ======================================
// PERFIL CLIENTE
// ======================================

function abrirPerfil(index) {

  const cliente = clientes[index];

  const pedidosCliente = pedidos.filter(
    pedido => pedido.cliente === cliente.nome
  );

  const totalComprado = pedidosCliente.reduce(
    (total, pedido) =>
      total + Number(pedido.valor || 0),
    0
  );

  let ultimoPedido = '-';

  if (pedidosCliente.length > 0) {

    const ultimo =
      pedidosCliente[pedidosCliente.length - 1];

    ultimoPedido =
      ultimo.data || '-';

  }

  let historico = '';

  pedidosCliente.forEach((pedido) => {

    historico += `

      <div class="historico-item">

        <div class="historico-info">

          <strong>
            ${pedido.produto || 'Produto'}
          </strong>

          <span>
            ${pedido.status || 'Sem status'}
          </span>

        </div>

        <strong>
          R$ ${Number(
            pedido.valor || 0
          ).toFixed(2)}
        </strong>

      </div>

    `;

  });

  perfilCliente.innerHTML = `

    <div class="perfil-header">

      <div
        style="
        display:flex;
        align-items:center;
        gap:20px;
        "
      >

        <img
          src="${cliente.foto}"
          class="perfil-foto"
        >

        <div>

          <h2>
            ${cliente.nome}
          </h2>

          <p>
            ${formatarTipo(cliente.tipo)}
          </p>

        </div>

      </div>

      <button
        class="btn-salvar"
        onclick="salvarEdicao(${index})"
      >

        <i class="fa-solid fa-floppy-disk"></i>

        Salvar Alterações

      </button>

    </div>

    <div class="perfil-grid">

      <div class="perfil-card">

        <h3>
          Informações do Cliente
        </h3>

        <div class="input-group">

          <label>Nome</label>

          <input
            type="text"
            id="editNome"
            value="${cliente.nome}"
          >

        </div>

        <div class="input-group">

          <label>Telefone</label>

          <input
            type="text"
            id="editTelefone"
            value="${cliente.telefone || ''}"
          >

        </div>

        <div class="input-group">

          <label>Email</label>

          <input
            type="email"
            id="editEmail"
            value="${cliente.email || ''}"
          >

        </div>

        <div class="input-group">

          <label>Instagram</label>

          <input
            type="text"
            id="editInstagram"
            value="${cliente.instagram || ''}"
          >

        </div>

        <div class="input-group">

          <label>Endereço</label>

          <input
            type="text"
            id="editEndereco"
            value="${cliente.endereco || ''}"
          >

        </div>

        <div class="input-group">

          <label>Empresa</label>

          <input
            type="text"
            id="editEmpresa"
            value="${cliente.empresa || ''}"
          >

        </div>

        <div class="input-group">

          <label>Tipo</label>

          <select id="editTipo">

            <option
              value="cliente"
              ${
                cliente.tipo === 'cliente'
                  ? 'selected'
                  : ''
              }
            >
              Cliente
            </option>

            <option
              value="revendedor"
              ${
                cliente.tipo === 'revendedor'
                  ? 'selected'
                  : ''
              }
            >
              Revendedor
            </option>

            <option
              value="loja"
              ${
                cliente.tipo === 'loja'
                  ? 'selected'
                  : ''
              }
            >
              Loja Parceira
            </option>

          </select>

        </div>

        <div class="input-group">

          <label>Comissão (%)</label>

          <input
            type="number"
            id="editComissao"
            value="${cliente.comissao || ''}"
          >

        </div>

        <div class="input-group">

          <label>Próximo Acerto</label>

          <input
            type="date"
            id="editProximoAcerto"
            value="${cliente.proximoAcerto || ''}"
          >

        </div>

        <div class="input-group">

          <label>Foto / Logo</label>

          <input
            type="file"
            id="editFoto"
            accept="image/*"
          >

        </div>

        <div class="input-group">

          <label>Observações</label>

          <textarea
            id="editObservacoes"
          >${cliente.observacoes || ''}</textarea>

        </div>

      </div>

      <div class="perfil-card">

        <h3>
          Métricas
        </h3>

        <div class="cliente-stats">

          <div class="stat-box">

            <span>
              Total Comprado
            </span>

            <strong>
              R$ ${totalComprado.toFixed(2)}
            </strong>

          </div>

          <div class="stat-box">

            <span>
              Pedidos
            </span>

            <strong>
              ${pedidosCliente.length}
            </strong>

          </div>

          <div class="stat-box">

            <span>
              Último Pedido
            </span>

            <strong>
              ${ultimoPedido}
            </strong>

          </div>

          <div class="stat-box">

            <span>
              Comissão
            </span>

            <strong>
              ${cliente.comissao || 0}%
            </strong>

          </div>

        </div>

      </div>

    </div>

    <div class="perfil-card">

      <h3>
        Histórico de Pedidos
      </h3>

      <div class="historico-lista">

        ${
          historico ||
          '<p>Nenhum pedido encontrado.</p>'
        }

      </div>

    </div>

  `;

  modalCliente.classList.add(
    'active'
  );

}

// ======================================
// SALVAR EDIÇÃO
// ======================================

function salvarEdicao(index) {

  const cliente = clientes[index];

  cliente.nome =
    document.getElementById(
      'editNome'
    ).value;

  cliente.telefone =
    document.getElementById(
      'editTelefone'
    ).value;

  cliente.email =
    document.getElementById(
      'editEmail'
    ).value;

  cliente.instagram =
    document.getElementById(
      'editInstagram'
    ).value;

  cliente.endereco =
    document.getElementById(
      'editEndereco'
    ).value;

  cliente.empresa =
    document.getElementById(
      'editEmpresa'
    ).value;

  cliente.tipo =
    document.getElementById(
      'editTipo'
    ).value;

  cliente.comissao =
    document.getElementById(
      'editComissao'
    ).value;

  cliente.proximoAcerto =
    document.getElementById(
      'editProximoAcerto'
    ).value;

  cliente.observacoes =
    document.getElementById(
      'editObservacoes'
    ).value;

  const novaFoto =
    document.getElementById(
      'editFoto'
    ).files[0];

  if (novaFoto) {

    const reader =
      new FileReader();

    reader.onload = () => {

      cliente.foto =
        reader.result;

      finalizarEdicao();

    };

    reader.readAsDataURL(
      novaFoto
    );

  }

  else {

    finalizarEdicao();

  }

  function finalizarEdicao() {

    localStorage.setItem(
      'clientes',
      JSON.stringify(clientes)
    );

    atualizarResumo();

    renderClientes();

    fecharModal();

  }

}

// ======================================
// FECHAR PERFIL
// ======================================

function fecharModal() {

  modalCliente.classList.remove(
    'active'
  );

}

// ======================================
// EVENTOS
// ======================================

buscarCliente.addEventListener(
  'input',
  renderClientes
);

ordenarClientes.addEventListener(
  'change',
  renderClientes
);

// ======================================
// INIT
// ======================================

atualizarResumo();
renderClientes();

// ======================================
// MODAL NOVO CLIENTE
// ======================================

function abrirNovoCliente() {

  document
    .getElementById('modalNovoCliente')
    .classList.add('active');

}

function fecharNovoCliente() {

  document
    .getElementById('modalNovoCliente')
    .classList.remove('active');

}

// ======================================
// FORMATAÇÃO MONETÁRIA
// ======================================

function formatarMoeda(valor) {

  return Number(valor || 0)
    .toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }
    );

}

// ======================================
// FORMATAR TIPO
// ======================================

function formatarTipo(tipo) {

  switch(tipo) {

    case 'cliente':
      return 'Cliente';

    case 'revendedor':
      return 'Revendedor';

    case 'loja':
      return 'Loja Parceira';

    default:
      return 'Cliente';

  }

}