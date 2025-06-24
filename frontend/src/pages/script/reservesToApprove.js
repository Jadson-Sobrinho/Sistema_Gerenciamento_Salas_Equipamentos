const API_URL = 'http://localhost:3000/reserve';

document.addEventListener('DOMContentLoaded', () => {

  async function reservesToApprove() {
    try {
      const response = await fetch(`${API_URL}/approve`);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }
      const reservas = await response.json();  // array de objetos

      const container = document.getElementById('reservesContainer');
      container.innerHTML = ''; // limpa tudo antes

      if (!Array.isArray(reservas) || reservas.length === 0) {
        container.innerHTML = '<p>Não há reservas pendentes para aprovar.</p>';
        return;
      }

      reservas.forEach(reserva => {
        const tabela = document.createElement('table');
        tabela.style.borderCollapse = 'collapse';
        tabela.style.marginBottom = '12px';
        tabela.style.width = '100%';
        tabela.style.border = '1px solid #ccc';

        function novaLinha(label, valor) {
          const tr = document.createElement('tr');
          const th = document.createElement('th');
          th.textContent = label;
          th.style.textAlign = 'left';
          th.style.padding = '4px 8px';
          const td = document.createElement('td');
          td.textContent = valor;
          td.style.padding = '4px 8px';
          tr.appendChild(th);
          tr.appendChild(td);
          return tr;
        }

        function formatarData(isoString) {
          const date = new Date(isoString);
          const options = {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          };
          return date.toLocaleString('pt-BR', options);
        }

        tabela.appendChild(novaLinha('Usuário', reserva.user_id.name));
        tabela.appendChild(novaLinha('Recurso', reserva.resource_id.name));
        tabela.appendChild(novaLinha('Início', formatarData(reserva.start_at)));
        tabela.appendChild(novaLinha('Fim', formatarData(reserva.end_at)));
        tabela.appendChild(novaLinha('Status',reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)));
        tabela.appendChild(novaLinha('Alerta', reserva.alert ? 'Sim' : 'Não'));
        tabela.appendChild(novaLinha('Criado em', formatarData(reserva.created_at)));
        tabela.appendChild(novaLinha('Atualizado em', formatarData(reserva.updated_at)));

        const botoesDiv = document.createElement('div');
        botoesDiv.classList.add('buttons');

        const botaoDeferir = document.createElement('button');
        botaoDeferir.textContent = 'Deferir';
        botaoDeferir.classList.add('deferir');

        botaoDeferir.addEventListener('click', async() => {
          await alterarStatusReserva(reserva._id, reserva.resource_id, reserva.start_at, reserva.end_at, 'aprovada');
        });

        const botaoIndeferir = document.createElement('button');
        botaoIndeferir.textContent = 'Indeferir';
        botaoIndeferir.classList.add('indeferir');

        botaoIndeferir.addEventListener('click', async() => {
          await alterarStatusReserva(reserva._id, reserva.resource_id, reserva.start_at, reserva.end_at, 'rejeitada');
        });

        botoesDiv.appendChild(botaoDeferir);
        botoesDiv.appendChild(botaoIndeferir);

        // Adiciona tabela e botões ao container
        container.appendChild(tabela);
        container.appendChild(botoesDiv);
      });

    } catch (error) {
      console.error('Erro ao buscar as reservas:', error);
      document.getElementById('reservesContainer').innerHTML =
        '<p>Ocorreu um erro ao carregar as reservas.</p>';
    }
  }

  // Função para alterar o status da reserva
  async function alterarStatusReserva(reserva_id, resource_id, start_at, end_at, novoStatus) {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`${API_URL}/${reserva_id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({resource_id, start_at, end_at, status: novoStatus })
      });

      if (!response.ok) {
        throw new Error(`Erro ao alterar status: ${response.statusText}`);
      }

      alert(`Reserva ${novoStatus}!`);
      reservesToApprove();  // Atualiza a lista
      

    } catch (error) {
      console.error('Erro ao alterar status da reserva:', error);
      alert('Erro ao alterar status da reserva.');
    }
  }

  // Chama a função para carregar as reservas
  reservesToApprove();
});