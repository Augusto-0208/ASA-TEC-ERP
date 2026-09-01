// ============================================================
// BLOCO CONFIGURAÇÕES - ASA TEC 3D
// ============================================================

// BLOCO TEMA
const body = document.body;
const lightBtn = document.getElementById('lightTheme');
const darkBtn = document.getElementById('darkTheme');

function aplicarTema(theme) {
  if (theme === 'dark') {
    body.classList.add('dark');
    darkBtn.classList.add('active');
    lightBtn.classList.remove('active');
  } else {
    body.classList.remove('dark');
    lightBtn.classList.add('active');
    darkBtn.classList.remove('active');
  }
  localStorage.setItem('theme', theme);
}

// Carregar tema salvo
const savedTheme = localStorage.getItem('theme') || 'light';
aplicarTema(savedTheme);

lightBtn.addEventListener('click', () => aplicarTema('light'));
darkBtn.addEventListener('click', () => aplicarTema('dark'));

// BLOCO FONTE
const fontPlus = document.getElementById('fontPlus');
const fontMinus = document.getElementById('fontMinus');
const fontSizeLabel = document.getElementById('fontSizeLabel');

let currentFontSize = Number(localStorage.getItem('fontSize')) || 16;

function aplicarFonte(tamanho) {
  document.documentElement.style.fontSize = tamanho + 'px';
  fontSizeLabel.textContent = tamanho + 'px';
  localStorage.setItem('fontSize', tamanho);
}

aplicarFonte(currentFontSize);

fontPlus.addEventListener('click', () => {
  if (currentFontSize < 22) {
    currentFontSize++;
    aplicarFonte(currentFontSize);
  }
});

fontMinus.addEventListener('click', () => {
  if (currentFontSize > 12) {
    currentFontSize--;
    aplicarFonte(currentFontSize);
  }
});

// BLOCO DADOS DA EMPRESA
const empresaForm = document.getElementById('empresaForm');

empresaForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const empresa = {
    nome: document.getElementById('empresaNome').value,
    cnpj: document.getElementById('empresaCnpj').value,
    email: document.getElementById('empresaEmail').value,
    telefone: document.getElementById('empresaTelefone').value,
    endereco: document.getElementById('empresaEndereco').value
  };
  localStorage.setItem('empresa', JSON.stringify(empresa));
  alert('Dados da empresa salvos com sucesso!');
});

// Carregar dados da empresa salvos
const empresaSaved = JSON.parse(localStorage.getItem('empresa'));
if (empresaSaved) {
  document.getElementById('empresaNome').value = empresaSaved.nome || '';
  document.getElementById('empresaCnpj').value = empresaSaved.cnpj || '';
  document.getElementById('empresaEmail').value = empresaSaved.email || '';
  document.getElementById('empresaTelefone').value = empresaSaved.telefone || '';
  document.getElementById('empresaEndereco').value = empresaSaved.endereco || '';
}

// BLOCO REDES SOCIAIS
const socialForm = document.getElementById('socialForm');

socialForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const social = {
    instagram: document.getElementById('instagram').value,
    whatsapp: document.getElementById('whatsapp').value,
    tiktok: document.getElementById('tiktok').value,
    site: document.getElementById('site').value
  };
  localStorage.setItem('social', JSON.stringify(social));
  alert('Redes sociais salvas com sucesso!');
});

// Carregar redes sociais salvas
const socialSaved = JSON.parse(localStorage.getItem('social'));
if (socialSaved) {
  document.getElementById('instagram').value = socialSaved.instagram || '';
  document.getElementById('whatsapp').value = socialSaved.whatsapp || '';
  document.getElementById('tiktok').value = socialSaved.tiktok || '';
  document.getElementById('site').value = socialSaved.site || '';
}

// BLOCO ATUALIZAR LINKS SOCIAIS NA SIDEBAR (opcional)
function atualizarLinksSociais() {
  const socialData = JSON.parse(localStorage.getItem('social'));
  if (socialData) {
    const instaLink = document.querySelector('.instagram-link');
    const whatsLink = document.querySelector('.whatsapp-link');
    if (instaLink && socialData.instagram) {
      instaLink.href = socialData.instagram;
    }
    if (whatsLink && socialData.whatsapp) {
      whatsLink.href = socialData.whatsapp;
    }
  }
}
atualizarLinksSociais();