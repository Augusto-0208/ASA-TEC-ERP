// =========================
// THEME
// =========================

const body = document.body;

const lightThemeBtn =
  document.getElementById('lightTheme');

const darkThemeBtn =
  document.getElementById('darkTheme');

// LOAD THEME

const savedTheme =
  localStorage.getItem('theme');

if (savedTheme === 'dark') {

  body.classList.add('dark');

  darkThemeBtn.classList.add('active');

  lightThemeBtn.classList.remove('active');

}

// LIGHT

lightThemeBtn.addEventListener('click', () => {

  body.classList.remove('dark');

  localStorage.setItem('theme', 'light');

  lightThemeBtn.classList.add('active');

  darkThemeBtn.classList.remove('active');

});

// DARK

darkThemeBtn.addEventListener('click', () => {

  body.classList.add('dark');

  localStorage.setItem('theme', 'dark');

  darkThemeBtn.classList.add('active');

  lightThemeBtn.classList.remove('active');

});

// =========================
// FONT SIZE
// =========================

const fontPlus =
  document.getElementById('fontPlus');

const fontMinus =
  document.getElementById('fontMinus');

const fontSizeLabel =
  document.getElementById('fontSizeLabel');

let currentFontSize =
  Number(localStorage.getItem('fontSize')) || 16;

applyFontSize();

function applyFontSize() {

  document.documentElement.style.fontSize =
    `${currentFontSize}px`;

  fontSizeLabel.innerText =
    `${currentFontSize}px`;

  localStorage.setItem(
    'fontSize',
    currentFontSize
  );

}

// PLUS

fontPlus.addEventListener('click', () => {

  if (currentFontSize < 22) {

    currentFontSize++;

    applyFontSize();

  }

});

// MINUS

fontMinus.addEventListener('click', () => {

  if (currentFontSize > 12) {

    currentFontSize--;

    applyFontSize();

  }

});

// =========================
// EMPRESA
// =========================

const empresaForm =
  document.getElementById('empresaForm');

empresaForm.addEventListener('submit', (e) => {

  e.preventDefault();

  const empresa = {

    nome:
      document.getElementById('empresaNome').value,

    cnpj:
      document.getElementById('empresaCnpj').value,

    email:
      document.getElementById('empresaEmail').value,

    telefone:
      document.getElementById('empresaTelefone').value,

    endereco:
      document.getElementById('empresaEndereco').value

  };

  localStorage.setItem(
    'empresa',
    JSON.stringify(empresa)
  );

  alert('Dados da empresa salvos!');

});

// LOAD EMPRESA

const empresaSaved =
  JSON.parse(localStorage.getItem('empresa'));

if (empresaSaved) {

  document.getElementById('empresaNome').value =
    empresaSaved.nome || '';

  document.getElementById('empresaCnpj').value =
    empresaSaved.cnpj || '';

  document.getElementById('empresaEmail').value =
    empresaSaved.email || '';

  document.getElementById('empresaTelefone').value =
    empresaSaved.telefone || '';

  document.getElementById('empresaEndereco').value =
    empresaSaved.endereco || '';

}

// =========================
// REDES SOCIAIS
// =========================

const socialForm =
  document.getElementById('socialForm');

socialForm.addEventListener('submit', (e) => {

  e.preventDefault();

  const social = {

    instagram:
      document.getElementById('instagram').value,

    whatsapp:
      document.getElementById('whatsapp').value,

    tiktok:
      document.getElementById('tiktok').value,

    site:
      document.getElementById('site').value

  };

  localStorage.setItem(
    'social',
    JSON.stringify(social)
  );

  alert('Redes sociais salvas!');

});

// LOAD SOCIAL

const socialSaved =
  JSON.parse(localStorage.getItem('social'));

if (socialSaved) {

  document.getElementById('instagram').value =
    socialSaved.instagram || '';

  document.getElementById('whatsapp').value =
    socialSaved.whatsapp || '';

  document.getElementById('tiktok').value =
    socialSaved.tiktok || '';

  document.getElementById('site').value =
    socialSaved.site || '';

}