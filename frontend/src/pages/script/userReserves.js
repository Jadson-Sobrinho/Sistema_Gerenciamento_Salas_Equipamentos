const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('reserva-table-body');

  async function cancelarReserva(reserva_id, resource_id, start_at, end_at) {
    const confirmar = confirm('Tem certeza que deseja cancelar esta reserva?');

    if (!confirmar) return;

    try {
      const response = await fetch(`${API_URL}/reserve/${reserva_id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
          'Content-type': 'application/json'
        },
        body: JSON.stringify({resource_id, start_at, end_at})
      });

        if (!response.ok) {
          throw new Error('Erro ao buscar reservas.');
        }

        alert("Reserva Cancelada com sucesso!");

        location.reload();
    } catch(error) {
      console.error('Erro ao cancelar reserva:', error);
      alert("Erro ao cancelar reserva");
    }

  }


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
          <td>${reserva.resource_id.name}</td>
          <td>${new Date(reserva.start_at).toLocaleString()}</td>
          <td>${new Date(reserva.end_at).toLocaleString()}</td>
          <td>${reserva.status}</td>
          <td>${new Date(reserva.created_at).toLocaleString()}</td>
          <td>${new Date(reserva.updated_at).toLocaleString()}</td>
        `;
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.onclick = () => {
          cancelarReserva(reserva._id, reserva.resource_id, reserva.start_at, reserva.end_at);
        }

        // Cria a célula <td> e adiciona o botão nela
        const td = document.createElement('td');
        td.appendChild(cancelBtn);

        // Adiciona a célula à linha
        tr.appendChild(td);

        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
      tbody.innerHTML = `<tr><td colspan="8">Erro ao carregar reservas.</td></tr>`;
    }
  }

  carregarReservas();
});