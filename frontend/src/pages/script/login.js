const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const msgEl = document.getElementById('login-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obter dados do formulário
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Limpar mensagens anteriores
    msgEl.textContent = '';

    try {
      // Enviar requisição para o endpoint de login
      const response = await fetch(`/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok) {
        // Se autenticar com sucesso
        msgEl.style.color = 'green';
        msgEl.textContent = 'Login realizado com sucesso! Redirecionando...';

        // Armazenar token 
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        }

        // Redirecionar para dashboard ou outra página
        setTimeout(() => {
          window.location.href = '/index-form';
        }, 1000);
      } else {
        // Exibir erro
        msgEl.style.color = 'red';
        msgEl.textContent = result.error || 'Falha no login. Verifique seus dados.';
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      msgEl.style.color = 'red';
      msgEl.textContent = 'Erro de conexão com o servidor.';
    }
  });
});
