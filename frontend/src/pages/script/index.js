
const API_URL = 'http://localhost:3000';

function startCountdownFromToken(token) {
    const decoded = jwt_decode(token);
    const exp = decoded.exp; // Tempo de expiração em segundos (Unix timestamp)
    const countdownEl = document.getElementById('countdown').querySelector('p');

    function updateCountdown() {
    const now = Math.floor(Date.now() / 1000);
    const remaining = exp - now;

    if (remaining <= 0) {
        countdownEl.textContent = 'Expirado';
        clearInterval(interval);
        logout();
        return;
    }

    const hours = Math.floor(remaining / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((remaining % 3600) / 60).toString().padStart(2, '0');
    const seconds = (remaining % 60).toString().padStart(2, '0');

    countdownEl.textContent = `${hours}:${minutes}:${seconds}`;
    
    }

    updateCountdown(); // primeira chamada imediata
    const interval = setInterval(updateCountdown, 1000);
}

function formatarDataHoraUTC(isoString) {
  const ano = isoString.substring(0, 4);
  const mes = isoString.substring(5, 7);
  const dia = isoString.substring(8, 10);
  const hora = isoString.substring(11, 13);
  const minuto = isoString.substring(14, 16);
  return `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
}


document.addEventListener('DOMContentLoaded', async function() {
    console.log('Página carregada com sucesso.');

    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    async function getUserInfo() {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar informações do usuario.');
            }
            const userInfo = await response.json();

            if (userInfo.role === 'Admin') {
                document.querySelectorAll('.admin-link').forEach(element => {
                    element.style.display = 'block';
                });
                
            }               

            /*console.log(userInfo.name);*/

            const userName = document.getElementById('summary-title_menu');
            const userRule = document.getElementById('user-rule');

            /*console.log(userName);*/

            userName.innerText = userInfo.name;
            userRule.innerText = userInfo.role;         

            return userInfo;
        } catch (error) {
            console.error('Erro ao carregar informações do usuario:', error);
            logout();
        }
    }

    getUserInfo();

    if (token) {
        startCountdownFromToken(token);
    }

    const form = document.getElementById('formBusca');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // impede o reload da página
    const termoBusca = document.getElementById('campoBusca').value.trim();

    console.log(termoBusca);
    
    if (!termoBusca) {
      alert('Digite um nome para buscar!');
      return;
    }

    buscarRecurso(termoBusca);
  });

  function buscarRecurso(nome) {
    console.log('Buscando recurso:', nome);
    fetch(`${API_URL}/room/${nome}`)
      .then(response => response.json())
      .then(data => {
        atualizarConteudoPrincipal(data);
        console.log(data);
      })
      .catch(err => console.error('Erro na busca:', err));
  }

  function atualizarConteudoPrincipal(recurso) {
  const main = document.getElementById('conteudoPrincipal');

    const horarios = recurso.unavailable_hours.length > 0
    ? recurso.unavailable_hours.map(h => {
        const inicio = formatarDataHoraUTC(h.start);
        const fim = formatarDataHoraUTC(h.end);
        return `<li>${inicio} → ${fim}</li>`;
        }).join('')
    : '<li>Nenhum horário indisponível</li>';

  main.innerHTML = `
    <h1>${recurso.name}</h1>

    <div class="card">
      <h2>Detalhes da Sala</h2>
      <p><strong>Número:</strong> ${recurso.room_number}</p>
      <p><strong>Módulo:</strong> ${recurso.module}</p>
      <p><strong>Andar:</strong> ${recurso.floor}</p>
      <p><strong>Capacidade:</strong> ${recurso.capacity} pessoas</p>
      <p><strong>Status:</strong> ${recurso.status}</p>
      <p><strong>Tags:</strong> ${recurso.tags.join(', ')}</p>

      <h3>Horários Reservados</h3>
      <ul>${horarios}</ul>

      <a class="action-btn" href="reserve.html">
        <i class="fas fa-calendar-alt"></i> Agendar Sala
      </a>

      <p style="margin-top: 16px;"><a href="#" onclick="window.location.reload()">← Voltar ao início</a></p>
    </div>
  `;
}

});


async function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/frontend/src/pages/login.html';
}