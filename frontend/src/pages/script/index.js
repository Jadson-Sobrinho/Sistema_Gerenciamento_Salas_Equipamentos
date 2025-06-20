
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


document.addEventListener('DOMContentLoaded', async function() {
    console.log('Página carregada com sucesso.');

    const token = localStorage.getItem('authToken');

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

            /*console.log(userInfo.name);*/

            const userName = document.getElementById('summary-title_menu');
            const userRule = document.getElementById('user-rule');

            /*console.log(userName);*/

            userName.innerText = userInfo.name;
            userRule.innerText = userInfo.role;

            return userInfo;
        } catch (error) {
            console.error('Erro ao carregar informações do usuario:', error);
        }
    }

    getUserInfo();

    if (token) {
        startCountdownFromToken(token);
    }

    const userInfo = await getUserInfo();
    if (userInfo.role === 'Aluno') {
        document.querySelectorAll('.admin-link').forEach(element => {
            element.style.display = 'none';
        });
        
    }
});


async function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/frontend/src/pages/login.html';
}