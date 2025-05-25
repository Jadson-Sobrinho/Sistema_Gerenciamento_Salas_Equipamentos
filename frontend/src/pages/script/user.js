const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {  

    document.getElementById('user-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const payload = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            role: document.getElementById('role').value,
            phone: document.getElementById('phone').value,
            hashed_password: document.getElementById('hashed_password').value,
            is_active: true
        };

        try {
            const response = await fetch(`${API_URL}/user`, {  
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            const msgEl = document.getElementById('user-message');

            if (response.ok) {
                msgEl.style.color = 'green';
                msgEl.textContent = 'Usuário cadastrado com sucesso!';
                document.getElementById('user-form').reset();
            } else {
                msgEl.style.color = 'red';
                msgEl.textContent = result.error || 'Erro ao cadastrar usuário.';
            }
        } catch (err) {
            const msgEl = document.getElementById('user-message');
            msgEl.style.color = 'red';
            msgEl.textContent = 'Erro de conexão com o servidor.';
        }
    });
});