// ============================================================
// BLOCO LOGIN
// ============================================================
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;
  // Credenciais fixas (pode ser substituído por validação com localStorage)
  if (user === 'admin' && pass === '1234') {
    localStorage.setItem('loggedIn', 'true');
    window.location.href = '../index.html';
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
});