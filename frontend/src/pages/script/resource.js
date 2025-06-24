const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('authToken');

document.addEventListener('DOMContentLoaded', () => {    
    
   
    document.getElementById('room-form').addEventListener('submit', async function(event) {
    event.preventDefault();

        const payload = {
            name: document.getElementById('name').value,
            room_number: document.getElementById('room_number').value,
            type: document.getElementById('type').value,
            capacity: parseInt(document.getElementById('capacity').value, 10),
            tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
            module: document.getElementById('module').value,
            floor: parseInt(document.getElementById('floor').value, 10),
            status: document.getElementById('status').value,
            unavailable_hours: document.getElementById('unavailable_hours').value.split(',').map(h => h.trim()).filter(h => h),
            description: document.getElementById('description').value
        };

        try {
            const response = await fetch(`/room`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            const msgEl = document.getElementById('room-message');

            if (response.ok) {
                msgEl.style.color = 'green';
                msgEl.textContent = 'Sala cadastrada com sucesso!';
                this.reset();
            } else {
                msgEl.style.color = 'red';
                msgEl.textContent = result.error || 'Erro ao cadastrar sala.';
            }
        } catch (err) {
            const msgEl = document.getElementById('room-message');
            msgEl.style.color = 'red';
            msgEl.textContent = 'Erro de conexão com o servidor.';
        }
    });
});