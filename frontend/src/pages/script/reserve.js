const API_URL = 'http://localhost:3000';
let allResources = [];

document.addEventListener('DOMContentLoaded', () => {
  const typeSelect = document.getElementById('resource_type');
  const resourceSelect = document.getElementById('resource_id');
  const statusInput = document.getElementById('status');
  const hoursTextarea = document.getElementById('available_hours');

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

  // Fetch resources
  fetch(`${API_URL}/room`)
    .then(res => res.json())
    .then(data => {
      allResources = data;
    })
    .catch(err => {
      resourceSelect.innerHTML = '<option value="">Erro ao carregar recursos</option>';
      console.error('Erro ao buscar recursos:', err);
    });

  // On type change, filter options and clear details
  typeSelect.addEventListener('change', () => {
    const selectedType = typeSelect.value;
    const filtered = allResources.filter(r => r.type === selectedType);
    populateSelect(resourceSelect, filtered, 'Selecione um recurso');
    // Clear status and hours
    statusInput.value = '';
    hoursTextarea.value = '';
  });

  // On resource select change, fill status and available_hours
  resourceSelect.addEventListener('change', () => {
    const selectedId = resourceSelect.value;
    const resource = allResources.find(r => (r._id || r.id) === selectedId);
    if (resource) {
      statusInput.value = resource.status || '';
      hoursTextarea.value = Array.isArray(resource.available_hours)
        ? resource.available_hours.join('\n')
        : '';
    } else {
      statusInput.value = '';
      hoursTextarea.value = '';
    }
  });

  // Form submission
  document.getElementById('reserva-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const payload = {
      user_id: document.getElementById('user_id').value,
      resource_type: typeSelect.value,
      resource_id: resourceSelect.value,
      start_at: new Date(document.getElementById('start_at').value).toISOString(),
      end_at: new Date(document.getElementById('end_at').value).toISOString()
    };

    try {
      const response = await fetch(`${API_URL}/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const msgEl = document.getElementById('message');

      if (response.ok) {
        msgEl.style.color = 'green';
        msgEl.textContent = 'Reserva cadastrada com sucesso!';
        this.reset();
        // Clear details
        statusInput.value = '';
        hoursTextarea.value = '';
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
});