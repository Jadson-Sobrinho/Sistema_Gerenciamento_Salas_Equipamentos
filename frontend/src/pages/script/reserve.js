// --- INÍCIO DO CÓDIGO CORRIGIDO ---

const API_URL = 'http://localhost:3000';

let allResources = [];

// Pega o token do usuário e inicializa userId
const token = localStorage.getItem('authToken');
let currentUserId = null;

// --- VARIÁVEIS DE ESTADO ---
let dataAtualCalendario = new Date(); // Controla o mês/ano exibido no calendário
let dataSelecionada = null; // Armazena a data completa (YYYY-MM-DD) selecionada

document.addEventListener('DOMContentLoaded', () => {
    // Decodifica o JWT para extrair userId
    if (token) {
        try {
            const [, base64Payload] = token.split('.');
            const payload = JSON.parse(atob(base64Payload));
            currentUserId = payload.sub || payload.userId || payload.id;
            console.log('ID do Usuário Atual:', currentUserId);
        } catch (e) {
            console.error('Não foi possível decodificar o token JWT:', e);
        }
    }

    // --- REFERÊNCIAS AOS ELEMENTOS DO DOM ---
    const typeSelect = document.getElementById('resource_type');
    const resourceSelect = document.getElementById('resource_id');
    const statusInput = document.getElementById('status');
    const mesAnoAtualEl = document.getElementById('mes-ano-atual');
    const calendarioCorpo = document.getElementById('calendario-corpo');
    const btnMesAnterior = document.getElementById('mes-anterior');
    const btnMesSeguinte = document.getElementById('mes-seguinte');
    const calendarioContainer = document.getElementById('calendario-container');
    const timelineBar = document.getElementById('timeline-bar');
    const startTimeInput = document.getElementById('start_time');
    const endTimeInput = document.getElementById('end_time');
    const reservaForm = document.getElementById('reserva-form');

    // Função auxiliar para popular <select>
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

    // Busca todos os recursos ao carregar a página
    fetch(`${API_URL}/room`)
        .then(res => res.json())
        .then(data => {
            allResources = data;
        })
        .catch(err => {
            console.error('Erro ao buscar recursos:', err);
        });

    // --- FUNÇÕES DO CALENDÁRIO E DA TIMELINE ---

    /**
     * Busca os dias que já possuem reservas para um determinado recurso e mês/ano.
     */
    async function buscarDiasComReserva(recursoId, ano, mes) {
        if (!recursoId) return [];

        try {
            const response = await fetch(`${API_URL}/reserve/${recursoId}?ano=${ano}&mes=${mes + 1}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                console.error(`Falha ao buscar reservas mensais. Status: ${response.status}`);
                throw new Error('Falha ao buscar reservas.');
            }

            const reservas = await response.json();
            // O seu console.log aqui foi muito útil para encontrar o problema!
            console.log('Reservas do mês recebidas da API:', reservas);

            // --- A CORREÇÃO ESTÁ AQUI ---
            const dias = [...new Set(reservas.map(r => {
                // Alterado de r.start_at para r.start
                const dataReserva = new Date(r.start); 
                return dataReserva.getUTCDate();
            }))];
            
            console.log('Dias com reserva extraídos:', dias);
            return dias;

        } catch (error) {
            console.error('Erro em buscarDiasComReserva:', error);
            return [];
        }
    }

    /**
     * Busca as reservas para um dia específico e atualiza a timeline visual.
     */
async function atualizarTimelineDeHorarios(data, recursoId) {
    const timelineBar = document.getElementById('timeline-bar');
    
    // Limpa apenas a barra da timeline
    timelineBar.innerHTML = '';


    if (!data || !recursoId) return;

    try {
        // A chamada à API continua a mesma
        const res = await fetch(`${API_URL}/reserve/${recursoId}/data?data=${data}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Falha ao buscar horários do dia.');
        
        const reservasDoDia = await res.json();
        console.log(`Reservas para o dia ${data}:`, reservasDoDia);

        reservasDoDia.forEach(reserva => {
            const inicio = new Date(reserva.start);
            const fim = new Date(reserva.end);

            // Explicação: Usamos getUTCHours() e getUTCMinutes() para pegar a hora "pura",
            // sem conversão de fuso. A função .padStart(2, '0') garante que a hora
            // sempre tenha dois dígitos (ex: '09' em vez de '9').
            const inicioFmt = `${String(inicio.getUTCHours()).padStart(2, '0')}:${String(inicio.getUTCMinutes()).padStart(2, '0')}`;
            const fimFmt = `${String(fim.getUTCHours()).padStart(2, '0')}:${String(fim.getUTCMinutes()).padStart(2, '0')}`;

            // Explicação: Da mesma forma, usamos os métodos UTC para calcular a posição
            // do bloco na timeline, garantindo que o cálculo corresponde à hora exibida.
            const minutoDoDiaInicio = inicio.getUTCHours() * 60 + inicio.getUTCMinutes();
            const minutoDoDiaFim = fim.getUTCHours() * 60 + fim.getUTCMinutes();

            // O resto do seu código para criar e adicionar o bloco continua igual
            const minutoInicialTimeline = 8 * 60;
            const totalMinutosTimeline = 10 * 60;
            
            const topPct = ((minutoDoDiaInicio - minutoInicialTimeline) / totalMinutosTimeline) * 100;
            const heightPct = ((minutoDoDiaFim - minutoDoDiaInicio) / totalMinutosTimeline) * 100;

            const bloco = document.createElement('div');
            bloco.className = 'bloco-indisponivel';
            bloco.style.top = `${topPct}%`;
            bloco.style.height = `${heightPct}%`;
            
            bloco.textContent = `${inicioFmt} - ${fimFmt}`;
            bloco.title = `Reservado de ${inicioFmt} às ${fimFmt}`;

            timelineBar.appendChild(bloco);
        });

    } catch (error) {
        console.error('Erro em atualizarTimelineDeHorarios:', error);
    }
}
    /**
     * Lida com o clique em um dia do calendário.
     */
    function selecionarDia(evento) {
        const diaAnterior = document.querySelector('.dia-calendario.selecionado');
        if (diaAnterior) diaAnterior.classList.remove('selecionado');

        const diaClicado = evento.target;
        diaClicado.classList.add('selecionado');
        
        const dia = diaClicado.dataset.dia;
        const mes = dataAtualCalendario.getMonth();
        const ano = dataAtualCalendario.getFullYear();
        
        dataSelecionada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        
        // Atualiza a timeline com os dados do dia selecionado
        atualizarTimelineDeHorarios(dataSelecionada, resourceSelect.value);
    }

    /**
     * Renderiza o calendário para o mês e ano atuais.
     */
    async function renderizarCalendario() {
        const ano = dataAtualCalendario.getFullYear();
        const mes = dataAtualCalendario.getMonth();
        mesAnoAtualEl.textContent = `${dataAtualCalendario.toLocaleString('pt-BR', { month: 'long' })} de ${ano}`;
        calendarioCorpo.innerHTML = '';

        const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
        const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();
        
        // Busca os dias com reserva para o recurso e mês/ano atuais
        const diasComReserva = await buscarDiasComReserva(resourceSelect.value, ano, mes);

        for (let i = 0; i < primeiroDiaDoMes; i++) {
            calendarioCorpo.innerHTML += `<div class="dia-calendario outro-mes"></div>`;
        }
        for (let dia = 1; dia <= ultimoDiaDoMes; dia++) {
            let classes = 'dia-calendario';
            const hoje = new Date();
            if (dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) classes += ' hoje';
            
            // A classe 'com-reserva' será adicionada se o dia estiver na lista retornada pela API
            if (diasComReserva.includes(dia)) classes += ' com-reserva';
            
            if (dataSelecionada === `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`) {
                classes += ' selecionado';
            }

            calendarioCorpo.innerHTML += `<div class="${classes}" data-dia="${dia}">${dia}</div>`;
        }
        document.querySelectorAll('.dia-calendario:not(.outro-mes)').forEach(diaEl => {
            diaEl.addEventListener('click', selecionarDia);
        });
    }


    typeSelect.addEventListener('change', () => {
        const filtered = allResources.filter(r => r.type === typeSelect.value);
        populateSelect(resourceSelect, filtered, 'Selecione um recurso');
        statusInput.value = '';
        calendarioContainer.style.display = 'none';
        timelineBar.innerHTML = '';
        dataSelecionada = null;
    });

    resourceSelect.addEventListener('change', () => {
        const resource = allResources.find(r => (r._id || r.id) === resourceSelect.value);
        if (resource) {
            statusInput.value = resource.status || '';
            calendarioContainer.style.display = 'block';
            dataSelecionada = null;
            timelineBar.innerHTML = '';
            renderizarCalendario();
        } else {
            statusInput.value = '';
            calendarioContainer.style.display = 'none';
        }
    });

    btnMesAnterior.addEventListener('click', () => {
        dataAtualCalendario.setMonth(dataAtualCalendario.getMonth() - 1);
        renderizarCalendario();
    });

    btnMesSeguinte.addEventListener('click', () => {
        dataAtualCalendario.setMonth(dataAtualCalendario.getMonth() + 1);
        renderizarCalendario();
    });

    reservaForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        if (!currentUserId || !dataSelecionada || !startTimeInput.value || !endTimeInput.value) {
            alert('Por favor, autentique-se, selecione um dia e preencha os horários.');
            return;
        }

        const start_at_iso = `${dataSelecionada}T${startTimeInput.value}:00.000Z`;
        const end_at_iso = `${dataSelecionada}T${endTimeInput.value}:00.000Z`;
        
        const payload = {
            user_id: currentUserId,
            resource_type: typeSelect.value,
            resource_id: resourceSelect.value,
            start_at: start_at_iso,
            end_at: end_at_iso
        };

        try {
            const response = await fetch(`${API_URL}/reserve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const msgEl = document.getElementById('message');

            if (response.ok) {
                msgEl.style.color = 'green';
                msgEl.textContent = 'Reserva cadastrada com sucesso!';
                startTimeInput.value = '';
                endTimeInput.value = '';
                // Re-renderiza tudo para mostrar o novo estado
                atualizarTimelineDeHorarios(dataSelecionada, resourceSelect.value);
                renderizarCalendario();
            } else {
                msgEl.style.color = 'red';
                msgEl.textContent = `Erro: ${result.message || 'Não foi possível fazer a reserva.'}`;
            }
        } catch (error) {
            const msgEl = document.getElementById('message');
            msgEl.style.color = 'red';
            msgEl.textContent = 'Erro de conexão com o servidor.';
        }
    });
    
    calendarioContainer.style.display = 'none';
});
