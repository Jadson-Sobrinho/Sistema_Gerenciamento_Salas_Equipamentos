const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('reserva-table-body');

  async function carregarReservas() {
    tbody.innerHTML = `<tr><td colspan="8">Carregando...</td></tr>`;

    try {
      const response = await fetch(`${API_URL}/reserve`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar reservas.');
      }

      const reservas = await response.json();

      if (reservas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">Nenhuma reserva encontrada.</td></tr>`;
        return;
      }

      tbody.innerHTML = '';

      reservas.forEach(reserva => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${reserva.resource_id}</td>
          <td>${new Date(reserva.start_at).toLocaleString()}</td>
          <td>${new Date(reserva.end_at).toLocaleString()}</td>
          <td>${reserva.status}</td>
          <td>${reserva.approval ? 'Sim' : 'Não'}</td>
          <td>${reserva.cancelled ? 'Sim' : 'Não'}</td>
          <td>${new Date(reserva.created_at).toLocaleString()}</td>
          <td>${new Date(reserva.updated_at).toLocaleString()}</td>
        `;

        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
      tbody.innerHTML = `<tr><td colspan="8">Erro ao carregar reservas.</td></tr>`;
    }
  }

  carregarReservas();
});