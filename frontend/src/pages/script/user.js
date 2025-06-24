const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('user-form');
  const msgEl = document.getElementById('user-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // limpa mensagem prévia
    msgEl.textContent = '';

    // coleta valores do form
    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      role: document.getElementById('role').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      hashed_password: document.getElementById('hashed_password').value
    };

    try {
      const response = await fetch(`/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (response.ok) {
        msgEl.style.color = 'green';
        msgEl.textContent = 'Usuário cadastrado com sucesso!';
        form.reset();
      } else {
        msgEl.style.color = 'red';
        msgEl.textContent = result.error || 'Erro ao cadastrar usuário.';
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      msgEl.style.color = 'red';
      msgEl.textContent = 'Erro de conexão com o servidor.';
    }

  });
});