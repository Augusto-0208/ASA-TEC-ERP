// frontend/js/api.js
// ============================================================
// INTERCEPTOR GLOBAL DE FETCH
// Adiciona automaticamente o token JWT em toda requisição
// e trata expiração (401) redirecionando para o login.
// ============================================================

(function () {
  const fetchOriginal = window.fetch;

  window.fetch = async function (url, options = {}) {
    const token = localStorage.getItem('token');

    // Se tem token, adiciona o header Authorization
    if (token) {
      options.headers = {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`
      };
    }

    try {
      const response = await fetchOriginal(url, options);

      // Se o token expirou ou é inválido → volta para o login
      if (response.status === 401) {
        console.warn('⚠️ Token expirado ou inválido. Redirecionando para o login...');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('loggedIn');

        // Evita loop se já estiver na página de login
        if (!window.location.pathname.includes('login')) {
          window.location.href = '/login/login.html';
        }
      }

      return response;
    } catch (error) {
      console.error('❌ Erro na requisição:', error);
      throw error;
    }
  };
})();

// ============================================================
// FUNÇÕES AUXILIARES DE AUTENTICAÇÃO
// ============================================================

// Verifica se o usuário está logado
function estaLogado() {
  return !!localStorage.getItem('token');
}

// Retorna o usuário logado (objeto) ou null
function getUsuarioLogado() {
  const user = localStorage.getItem('usuario');
  return user ? JSON.parse(user) : null;
}

// Faz logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('loggedIn');
  window.location.href = '/login/login.html';
}

// Protege páginas internas (chame no topo de cada página restrita)
function protegerPagina() {
  if (!estaLogado()) {
    window.location.href = '/login/login.html';
  }
}