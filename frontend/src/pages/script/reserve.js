// reserve.js
const API_URL = 'http://localhost:3000';
let allResources = [];

// Pega o token do usuário e inicializa userId
const token = localStorage.getItem('authToken');
let currentUserId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Decodifica o JWT para extrair userId (campo sub)
  if (token) {
    try {
      const [, base64Payload] = token.split('.');
      const payload = JSON.parse(atob(base64Payload));
      // Ajuste conforme o campo usado no payload do seu JWT
      currentUserId = payload.sub || payload.userId || payload.id;
      console.log('Current User ID:', currentUserId);
    } catch (e) {
      console.error('Não foi possível decodificar o token JWT:', e);
    }
  }

  const typeSelect = document.getElementById('resource_type');
  const resourceSelect = document.getElementById('resource_id');
  const statusInput = document.getElementById('status');
  const hoursTextarea = document.getElementById('unavailable_hours');

  function populateSelect(selectEl, items, placeholder) {
    selectEl.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = placeholder;
    ph.disabled = true;
    ph.selected = true;
    selectEl.appendChild(ph);
    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item._id || item.id;
      opt.textContent = item.name || item.type;
      selectEl.appendChild(opt);
    });
  }

  // Busca recursos disponíveis
  fetch(`${API_URL}/room`)
    .then(res => res.json())
    .then(data => {
      allResources = data;
    })
    .catch(err => {
      resourceSelect.innerHTML = '<option value="">Erro ao carregar recursos</option>';
      console.error('Erro ao buscar recursos:', err);
    });

  // Filtra recursos por tipo
  typeSelect.addEventListener('change', () => {
    const filtered = allResources.filter(r => r.type === typeSelect.value);
    populateSelect(resourceSelect, filtered, 'Selecione um recurso');
    statusInput.value = '';
    hoursTextarea.value = '';
  });

  // Preenche detalhes do recurso selecionado
  resourceSelect.addEventListener('change', () => {
    const resource = allResources.find(r => (r._id || r.id) === resourceSelect.value);
    if (resource) {
      statusInput.value = resource.status || '';
      hoursTextarea.value = Array.isArray(resource.unavailable_hours)
        ? resource.unavailable_hours
          .map(interval => `${new Date(interval.start).toLocaleString()} - ${new Date(interval.end).toLocaleString()}`)
          .join('\n')
        : '';
    } else {
      statusInput.value = '';
      hoursTextarea.value = '';
    }
  });

  // Submissão do formulário de reserva
  document.getElementById('reserva-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (!currentUserId) {
      alert('Usuário não autenticado!');
      return;
    }

    const payload = {
      user_id:       currentUserId,
      resource_type: typeSelect.value,
      resource_id:   resourceSelect.value,
      start_at:      new Date(document.getElementById('start_at').value).toISOString(),
      end_at:        new Date(document.getElementById('end_at').value).toISOString()
    };

    try {
      const response = await fetch(`${API_URL}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const msgEl = document.getElementById('message');

      if (response.ok) {
        msgEl.style.color = 'green';
        msgEl.textContent = 'Reserva cadastrada com sucesso!';
        //this.reset();
        statusInput.value = '';
        hoursTextarea.value = '';
      } else {
        msgEl.style.color = 'red';
        msgEl.textContent = result.message;
      }
    } catch (error) {
      const msgEl = document.getElementById('message');
      msgEl.style.color = 'red';
      msgEl.textContent = 'Erro de conexão com o servidor.';
    }
  });
});
