
// ======================================
// STORAGE
// ======================================

let produtos =
  JSON.parse(
    localStorage.getItem('produtos')
  ) || [];

// ======================================
// ELEMENTOS
// ======================================

const listaProdutos =
  document.getElementById(
    'listaProdutos'
  );

const formProduto =
  document.getElementById(
    'formProduto'
  );

const buscarProduto =
  document.getElementById(
    'buscarProduto'
  );

const perfilProduto =
  document.getElementById(
    'perfilProduto'
  );

const modalProduto =
  document.getElementById(
    'modalProduto'
  );

// ======================================
// FORMATAR MOEDA
// ======================================

function moeda(valor){

  return Number(valor || 0)
    .toLocaleString(
      'pt-BR',
      {
        style:'currency',
        currency:'BRL'
      }
    );

}

// ======================================
// ATUALIZAR RESUMO
// ======================================

function atualizarResumo(){

  document.getElementById(
    'totalProdutos'
  ).textContent =
    produtos.length;

  let valorEstoque = 0;
  let somaVenda = 0;
  let somaCusto = 0;

  produtos.forEach(produto=>{

    valorEstoque +=
      Number(produto.precoVenda || 0);

    somaVenda +=
      Number(produto.precoVenda || 0);

    somaCusto +=
      Number(produto.precoCusto || 0);

  });

  document.getElementById(
    'valorEstoque'
  ).textContent =
    moeda(valorEstoque);

  document.getElementById(
    'precoMedio'
  ).textContent =
    produtos.length
      ? moeda(
          somaVenda /
          produtos.length
        )
      : 'R$ 0,00';

  document.getElementById(
    'custoMedio'
  ).textContent =
    produtos.length
      ? moeda(
          somaCusto /
          produtos.length
        )
      : 'R$ 0,00';

}

// ======================================
// RENDER PRODUTOS
// ======================================

function renderProdutos(){

  listaProdutos.innerHTML = '';

  const termo =
    buscarProduto.value
      .toLowerCase();

  const filtrados =
    produtos.filter(produto =>
      produto.nome
        .toLowerCase()
        .includes(termo)
    );

  filtrados.forEach(produto=>{

    const card =
      document.createElement('div');

    card.classList.add(
      'produto-card'
    );

    card.innerHTML = `

      <img
        src="${produto.foto}"
        class="produto-foto"
      >

      <h3>
        ${produto.nome}
      </h3>

      <p>
        Material:
        ${produto.material || '-'}
      </p>

      <div class="produto-preco">

        ${moeda(
          produto.precoVenda
        )}

      </div>

      <button
        class="btn-detalhes"
        onclick="abrirProduto(${produto.id})"
      >

        Ver Detalhes

      </button>

    `;

    listaProdutos.appendChild(
      card
    );

  });

  atualizarResumo();

}

// ======================================
// NOVO PRODUTO
// ======================================

formProduto.addEventListener(
  'submit',
  function(e){

    e.preventDefault();

    const foto =
      document.getElementById(
        'fotoProduto'
      ).files[0];

    function salvar(
      fotoBase64=''
    ){

      const produto = {

        id: Date.now(),

        nome:
          document.getElementById(
            'nomeProduto'
          ).value,

        precoVenda:
          document.getElementById(
            'precoVenda'
          ).value,

        precoCusto:
          document.getElementById(
            'precoCusto'
          ).value,

        material:
          document.getElementById(
            'material'
          ).value,

        linkStl:
          document.getElementById(
            'linkStl'
          ).value,

        descricao:
          document.getElementById(
            'descricaoProduto'
          ).value,

        foto:
          fotoBase64 ||

          'https://cdn-icons-png.flaticon.com/512/679/679720.png'

      };

      produtos.push(produto);

      localStorage.setItem(
        'produtos',
        JSON.stringify(produtos)
      );

      formProduto.reset();

      fecharNovoProduto();

      renderProdutos();

    }

    if(foto){

      const reader =
        new FileReader();

      reader.onload =
        function(){

          salvar(
            reader.result
          );

        };

      reader.readAsDataURL(
        foto
      );

    }else{

      salvar();

    }

  }
);

// ======================================
// ABRIR PRODUTO
// ======================================

function abrirProduto(id){

  const produto =
    produtos.find(
      p => p.id === id
    );

  if(!produto){
    return;
  }

  perfilProduto.innerHTML = `

    <div class="perfil-topo">

      <img
        src="${produto.foto}"
        class="perfil-foto"
      >

      <div class="perfil-info">

        <h2>
          ${produto.nome}
        </h2>

        <p>
          Material:
          ${produto.material || '-'}
        </p>

        <p>
          Venda:
          ${moeda(produto.precoVenda)}
        </p>

        <p>
          Custo:
          ${moeda(produto.precoCusto)}
        </p>

        ${
          produto.linkStl
          ?
          `
          <a
            href="${produto.linkStl}"
            target="_blank"
            class="perfil-link"
          >
            Abrir STL
          </a>
          `
          :
          ''
        }

      </div>

    </div>

    <div class="perfil-grid">

      <div class="perfil-card">

        <h3>
          Informações
        </h3>

        <div class="input-group">

          <label>
            Nome
          </label>

          <input
            type="text"
            id="editNome"
            value="${produto.nome}"
          >

        </div>

        <div class="input-group">

          <label>
            Material
          </label>

          <input
            type="text"
            id="editMaterial"
            value="${produto.material || ''}"
          >

        </div>

        <div class="input-group">

          <label>
            Link STL
          </label>

          <input
            type="text"
            id="editLink"
            value="${produto.linkStl || ''}"
          >

        </div>

      </div>

      <div class="perfil-card">

        <h3>
          Valores
        </h3>

        <div class="input-group">

          <label>
            Preço Venda
          </label>

          <input
            type="number"
            step="0.01"
            id="editVenda"
            value="${produto.precoVenda}"
          >

        </div>

        <div class="input-group">

          <label>
            Preço Custo
          </label>

          <input
            type="number"
            step="0.01"
            id="editCusto"
            value="${produto.precoCusto}"
          >

        </div>

        <div class="input-group">

          <label>
            Nova Foto
          </label>

          <input
            type="file"
            id="editFoto"
            accept="image/*"
          >

        </div>

      </div>

    </div>

    <div class="perfil-card">

      <h3>
        Descrição
      </h3>

      <textarea
        id="editDescricao"
      >${produto.descricao || ''}</textarea>

    </div>

    <div class="perfil-actions">

      <button
        class="btn-primary"
        onclick="salvarProduto(${produto.id})"
      >
        Salvar Alterações
      </button>

      <button
        class="btn-danger"
        onclick="excluirProduto(${produto.id})"
      >
        Excluir Produto
      </button>

    </div>

  `;

  modalProduto.style.display =
    'flex';

}

// ======================================
// SALVAR EDIÇÃO
// ======================================

function salvarProduto(id){

  const produto =
    produtos.find(
      p => p.id === id
    );

  if(!produto){
    return;
  }

  produto.nome =
    document.getElementById(
      'editNome'
    ).value;

  produto.material =
    document.getElementById(
      'editMaterial'
    ).value;

  produto.linkStl =
    document.getElementById(
      'editLink'
    ).value;

  produto.precoVenda =
    document.getElementById(
      'editVenda'
    ).value;

  produto.precoCusto =
    document.getElementById(
      'editCusto'
    ).value;

  produto.descricao =
    document.getElementById(
      'editDescricao'
    ).value;

  const novaFoto =
    document.getElementById(
      'editFoto'
    ).files[0];

  if(novaFoto){

    const reader =
      new FileReader();

    reader.onload =
      function(){

        produto.foto =
          reader.result;

        finalizarEdicao();

      };

    reader.readAsDataURL(
      novaFoto
    );

  }else{

    finalizarEdicao();

  }

}

// ======================================
// FINALIZAR EDIÇÃO
// ======================================

function finalizarEdicao(){

  localStorage.setItem(
    'produtos',
    JSON.stringify(produtos)
  );

  renderProdutos();

  fecharModalProduto();

}

// ======================================
// EXCLUIR PRODUTO
// ======================================

function excluirProduto(id){

  const confirmar =
    confirm(
      'Deseja realmente excluir este produto?'
    );

  if(!confirmar){
    return;
  }

  produtos =
    produtos.filter(
      produto =>
      produto.id !== id
    );

  localStorage.setItem(
    'produtos',
    JSON.stringify(produtos)
  );

  fecharModalProduto();

  renderProdutos();

}

// ======================================
// MODAL NOVO PRODUTO
// ======================================

function abrirNovoProduto(){

  const modal =
    document.getElementById(
      'modalNovoProduto'
    );

  modal.style.display =
    'flex';

}

function fecharNovoProduto(){

  const modal =
    document.getElementById(
      'modalNovoProduto'
    );

  modal.style.display =
    'none';

}

// ======================================
// MODAL PERFIL
// ======================================

function fecharModalProduto(){

  modalProduto.style.display =
    'none';

}

// ======================================
// FECHAR CLICANDO FORA
// ======================================

window.addEventListener(
  'click',
  function(event){

    const modalCadastro =
      document.getElementById(
        'modalNovoProduto'
      );

    if(
      event.target === modalCadastro
    ){

      fecharNovoProduto();

    }

    if(
      event.target === modalProduto
    ){

      fecharModalProduto();

    }

  }
);

// ======================================
// BUSCA
// ======================================

buscarProduto.addEventListener(
  'input',
  renderProdutos
);

// ======================================
// ENTER NA BUSCA
// ======================================

buscarProduto.addEventListener(
  'keyup',
  function(){

    renderProdutos();

  }
);

// ======================================
// RENDER INICIAL
// ======================================

renderProdutos();

// ======================================
// DEBUG
// ======================================

console.log(
  'Produtos carregados:',
  produtos.length
);

// ======================================
// UTIL
// ======================================

function limparProdutos(){

  localStorage.removeItem(
    'produtos'
  );

  produtos = [];

  renderProdutos();

}

// ======================================
// UTIL TESTE
// ======================================

function criarProdutoTeste(){

  produtos.push({

    id: Date.now(),

    nome: 'Suporte para Controle',

    precoVenda: 39.90,

    precoCusto: 12.50,

    material: 'PLA',

    linkStl:
      'https://makerworld.com',

    descricao:
      'Produto de teste',

    foto:
      'https://cdn-icons-png.flaticon.com/512/679/679720.png'

  });

  localStorage.setItem(
    'produtos',
    JSON.stringify(produtos)
  );

  renderProdutos();

}

