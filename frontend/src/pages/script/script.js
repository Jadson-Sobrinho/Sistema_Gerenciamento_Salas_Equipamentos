const API_URL = 'http://localhost:3000';

    document.getElementById('reserva-form').addEventListener('submit', async function(event) {
      event.preventDefault();
      const payload = {
        user_id: document.getElementById('user_id').value,
        resource_id: document.getElementById('resource_id').value,
        start_at: new Date(document.getElementById('start_at').value).toISOString(),
        end_at: new Date(document.getElementById('end_at').value).toISOString()
      };

      try {
        const response = await fetch(`${API_URL}/reserve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        const msgEl = document.getElementById('message');

        if (response.ok) {
          msgEl.style.color = 'green';
          msgEl.textContent = 'Reserva cadastrada com sucesso!';
          document.getElementById('reserva-form').reset();
        } else {
          msgEl.style.color = 'red';
          msgEl.textContent = result.error || 'Erro ao cadastrar reserva.';
        }
      } catch (error) {
        const msgEl = document.getElementById('message');
        msgEl.style.color = 'red';
        msgEl.textContent = 'Erro de conexão com o servidor.';
      }
    });