// ======================================
// ASA TEC 3D - ESTOQUE
// ======================================

// ======================================
// DATABASE
// ======================================

let database = getDatabase();

if (!database.estoque) {
  database.estoque = [];
}

// ======================================
// ELEMENTOS
// ======================================

const estoqueTable =
  document.getElementById(
    'estoqueTable'
  );

const estoqueForm =
  document.getElementById(
    'estoqueForm'
  );

const buscarItem =
  document.getElementById(
    'buscarItem'
  );

const baixoEstoqueList =
  document.getElementById(
    'baixoEstoqueList'
  );

const emFaltaList =
  document.getElementById(
    'emFaltaList'
  );

// ======================================
// MODAL
// ======================================

function abrirModalItem() {

  document
    .getElementById(
      'modalItem'
    )
    .classList.add(
      'active'
    );

}

function fecharModalItem() {

  document
    .getElementById(
      'modalItem'
    )
    .classList.remove(
      'active'
    );

}

// ======================================
// STATUS
// ======================================

function getStatusClass(
  status
) {

  if (
    status === 'Disponível'
  ) {

    return 'disponivel';

  }

  if (
    status === 'Baixo Estoque'
  ) {

    return 'baixo';

  }

  if (
    status === 'Em Falta'
  ) {

    return 'falta';

  }

  return '';

}

// ======================================
// RESUMO
// ======================================

function atualizarResumo() {

  database = getDatabase();

  const totalItens =
    database.estoque.length;

  const disponiveis =
    database.estoque.filter(
      item =>
        item.disponibilidade ===
        'Disponível'
    ).length;

  const baixo =
    database.estoque.filter(
      item =>
        item.disponibilidade ===
        'Baixo Estoque'
    ).length;

  const falta =
    database.estoque.filter(
      item =>
        item.disponibilidade ===
        'Em Falta'
    ).length;

  document.getElementById(
    'totalItens'
  ).textContent =
    totalItens;

  document.getElementById(
    'totalDisponivel'
  ).textContent =
    disponiveis;

  document.getElementById(
    'totalBaixo'
  ).textContent =
    baixo;

  document.getElementById(
    'totalFalta'
  ).textContent =
    falta;

}

// ======================================
// ALERTAS
// ======================================

function renderAlertas() {

  baixoEstoqueList.innerHTML =
    '';

  emFaltaList.innerHTML =
    '';

  database.estoque.forEach(
    (item) => {

      if (
        item.disponibilidade ===
        'Baixo Estoque'
      ) {

        baixoEstoqueList.innerHTML += `

          <div class="alert-item">

            <strong>

              ${item.material}
              -
              ${item.cor}

            </strong>

            Quantidade:
            ${item.quantidade}

          </div>

        `;

      }

      if (
        item.disponibilidade ===
        'Em Falta'
      ) {

        emFaltaList.innerHTML += `

          <div class="alert-item">

            <strong>

              ${item.material}
              -
              ${item.cor}

            </strong>

            Produto indisponível

          </div>

        `;

      }

    }
  );

  if (
    baixoEstoqueList.innerHTML ===
    ''
  ) {

    baixoEstoqueList.innerHTML = `

      <div class="alert-item">

        Nenhum item com
        baixo estoque.

      </div>

    `;

  }

  if (
    emFaltaList.innerHTML === ''
  ) {

    emFaltaList.innerHTML = `

      <div class="alert-item">

        Nenhum item
        em falta.

      </div>

    `;

  }

}

// ======================================
// RENDER ESTOQUE
// ======================================

function renderEstoque() {

  database = getDatabase();

  if (!database.estoque) {

    database.estoque = [];

  }

  estoqueTable.innerHTML = '';

  let itensFiltrados =
    [...database.estoque];

  // ======================================
  // BUSCA
  // ======================================

  const termo =
    buscarItem.value
    .toLowerCase()
    .trim();

  if (termo !== '') {

    itensFiltrados =
      itensFiltrados.filter(
        item =>

          item.material
            .toLowerCase()
            .includes(termo)

          ||

          item.cor
            .toLowerCase()
            .includes(termo)

          ||

          item.modelo
            .toLowerCase()
            .includes(termo)

          ||

          item.fornecedor
            .toLowerCase()
            .includes(termo)

      );

  }

  // ======================================
  // SEM ITENS
  // ======================================

  if (
    itensFiltrados.length === 0
  ) {

    estoqueTable.innerHTML = `

      <tr>

        <td
          colspan="7"
          style="
            text-align:center;
            padding:40px;
          "
        >

          Nenhum item encontrado

        </td>

      </tr>

    `;

    return;

  }

  // ======================================
  // LOOP TABELA
  // ======================================

  itensFiltrados.forEach(
    (item) => {

      const indexOriginal =
        database.estoque.indexOf(
          item
        );

      estoqueTable.innerHTML += `

        <tr>

          <td>

            ${item.material}

          </td>

          <td>

            ${item.cor}

          </td>

          <td>

            ${item.modelo}

          </td>

          <td>

            ${item.fornecedor}

          </td>

          <td>

            ${item.quantidade}

          </td>

          <td>

            <span
              class="
                status
                ${getStatusClass(
                  item.disponibilidade
                )}
              "
            >

              ${item.disponibilidade}

            </span>

          </td>

          <td>

            <div class="actions">

              <button
                class="
                  btn-icon
                  btn-delete
                "
                onclick="
                  excluirItem(
                    ${indexOriginal}
                  )
                "
                title="Excluir"
              >

                <i class="
                  fa-solid
                  fa-trash
                "></i>

              </button>

            </div>

          </td>

        </tr>

      `;

    }
  );

  atualizarResumo();

  renderAlertas();

}

// ======================================
// EXCLUIR ITEM
// ======================================

function excluirItem(index) {

  const confirmar =
    confirm(

      'Deseja realmente excluir este item do estoque?'

    );

  if (!confirmar) {

    return;

  }

  database =
    getDatabase();

  database.estoque.splice(
    index,
    1
  );

  saveDatabase(
    database
  );

  renderEstoque();

}

// ======================================
// SALVAR ITEM
// ======================================

estoqueForm.addEventListener(
  'submit',
  (e) => {

    e.preventDefault();

    database =
      getDatabase();

    if (!database.estoque) {

      database.estoque = [];

    }

    const novoItem = {

      material:
        document
          .getElementById(
            'material'
          )
          .value,

      cor:
        document
          .getElementById(
            'cor'
          )
          .value,

      modelo:
        document
          .getElementById(
            'modelo'
          )
          .value,

      fornecedor:
        document
          .getElementById(
            'fornecedor'
          )
          .value,

      quantidade:
        Number(
          document
            .getElementById(
              'quantidade'
            )
            .value
        ),

      disponibilidade:
        document
          .getElementById(
            'disponibilidade'
          )
          .value

    };

    database.estoque.push(
      novoItem
    );

    saveDatabase(
      database
    );

    estoqueForm.reset();

    fecharModalItem();

    renderEstoque();

  }
);

// ======================================
// BUSCA
// ======================================

if (buscarItem) {

  buscarItem.addEventListener(
    'input',
    renderEstoque
  );

}

// ======================================
// FECHAR MODAL AO CLICAR FORA
// ======================================

const modalItem =
  document.getElementById(
    'modalItem'
  );

if (modalItem) {

  modalItem.addEventListener(
    'click',
    (e) => {

      if (
        e.target === modalItem
      ) {

        fecharModalItem();

      }

    }
  );

}

// ======================================
// TECLA ESC
// ======================================

document.addEventListener(
  'keydown',
  (e) => {

    if (
      e.key === 'Escape'
    ) {

      fecharModalItem();

    }

  }
);

// ======================================
// INIT
// ======================================

renderEstoque();

atualizarResumo();

renderAlertas();