
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


document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada com sucesso.');

    const token = localStorage.getItem('authToken');

    async function getUserName() {
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

            /*console.log(userInfo.name);*/

            const userName = document.getElementById('summary-title_menu');

            /*console.log(userName);*/

            userName.innerText = userInfo.name;

        } catch (error) {
            console.error('Erro ao carregar informações do usuario:', error);
        }
    }

    getUserName();

    if (token) {
        startCountdownFromToken(token);
    }

});


async function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/frontend/src/pages/login.html';
}