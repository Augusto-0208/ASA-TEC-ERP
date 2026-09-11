// ============================================================
// BLOCO LOGIN - Integrado com API do backend
// ============================================================
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Pega os valores dos inputs
  const usuario = document.getElementById('loginUser').value.trim();
  const senha = document.getElementById('loginPass').value.trim();

  // Elemento onde será exibida a mensagem de erro
  const erroDiv = document.getElementById('loginError');

  // Esconde erro anterior
  if (erroDiv) erroDiv.style.display = 'none';

  // Validação básica
  if (!usuario || !senha) {
    if (erroDiv) {
      erroDiv.textContent = 'Preencha usuário e senha.';
      erroDiv.style.display = 'block';
    }
    return;
  }

  try {
    // 🔗 Chama a API de login
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario: usuario,   // 👈 backend aceita "usuario" ou "email"
        senha: senha
      })
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Login bem-sucedido
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redireciona para a página principal
      window.location.href = '../index.html';
    } else {
      // ❌ Credenciais inválidas
      if (erroDiv) {
        erroDiv.textContent = data.erro || 'Usuário ou senha incorretos.';
        erroDiv.style.display = 'block';
      }
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    if (erroDiv) {
      erroDiv.textContent = 'Erro ao conectar com o servidor.';
      erroDiv.style.display = 'block';
    }
  }
});