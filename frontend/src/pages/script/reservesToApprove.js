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

      // Cria uma tabela (ou um <div> “card”) PARA CADA reserva
      reservas.forEach(reserva => {
        // Exemplo usando uma tabela pequena para cada reserva:
        const tabela = document.createElement('table');
        tabela.style.borderCollapse = 'collapse';
        tabela.style.marginBottom = '12px';
        tabela.style.width = '100%';

        // Função auxiliar para criar uma linha na tabela
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

        // Formata datas
        function formatarData(isoString) {
          const date = new Date(isoString);
          const options = {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          };
          return date.toLocaleString('pt-BR', options);
        }

        // Monta as linhas dessa reserva
        tabela.appendChild(novaLinha('ID da Reserva', reserva._id));
        tabela.appendChild(novaLinha('ID do Usuário', reserva.user_id));
        tabela.appendChild(novaLinha('ID do Recurso', reserva.resource_id));
        tabela.appendChild(novaLinha('Início', formatarData(reserva.start_at)));
        tabela.appendChild(novaLinha('Fim', formatarData(reserva.end_at)));
        tabela.appendChild(novaLinha(
          'Status',
          reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)
        ));
        tabela.appendChild(novaLinha('Aprovado', reserva.approval ? 'Sim' : 'Não'));
        tabela.appendChild(novaLinha('Alerta', reserva.alert ? 'Sim' : 'Não'));
        tabela.appendChild(novaLinha('Cancelada', reserva.cancelled ? 'Sim' : 'Não'));
        tabela.appendChild(novaLinha('Criado em', formatarData(reserva.created_at)));
        tabela.appendChild(novaLinha('Atualizado em', formatarData(reserva.updated_at)));

        // Por fim, adiciona essa tabela ao container
        container.appendChild(tabela);
      });

    } catch (error) {
      console.error('Erro ao buscar as reservas:', error);
      document.getElementById('reservesContainer').innerHTML =
        '<p>Ocorreu um erro ao carregar as reservas.</p>';
    }
  }

  // Lembre-se de chamar a função:
  reservesToApprove();
});