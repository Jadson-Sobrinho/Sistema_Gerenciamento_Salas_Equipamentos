const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada com sucesso.');

    async function getUserName() {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('authToken')
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

});


async function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/frontend/src/pages/login.html';
}