// public/script.js
const socket = io('https://impostor-futbol.onrender.com/'); // ¡REEMPLAZA ESTA URL CON LA TUYA!

// --- Elementos del DOM ---
const usernameScreen = document.getElementById('username-screen');
const usernameInput = document.getElementById('username-input');
const setUsernameBtn = document.getElementById('set-username-btn');

const youAreAdminMessage = document.getElementById('you-are-admin-message');
const gameInfoDisplay = document.getElementById('game-info-display');
const voteTieSection = document.getElementById('vote-tie-section');
const tieVoteOptions = document.getElementById('tie-vote-options');
const tieCandidatesInfo = document.getElementById('tie-candidates-info'); // Para mostrar quiénes empataron

const mainMenu = document.getElementById('main-menu');
const publicRoomsBtn = document.getElementById('public-rooms-btn');
const privateRoomsMenuBtn = document.getElementById('private-rooms-menu-btn');

const publicRoomsSection = document.getElementById('public-rooms-section');
const publicRoomsList = document.getElementById('public-rooms-list');
const createPublicRoomBtn = document.getElementById('create-public-room-btn');
const backToMainMenuFromPublicBtn = document.getElementById('back-to-main-menu-from-public');

const privateRoomsMenu = document.getElementById('private-rooms-menu');
const createPrivateRoomBtn = document.getElementById('create-private-room-btn');
const joinPrivateRoomInput = document.getElementById('join-private-room-input');
const joinPrivateRoomBtn = document.getElementById('join-private-room-btn');
const backToMainMenuFromPrivateBtn = document.getElementById('back-to-main-menu-from-private');

const roomLobby = document.getElementById('room-lobby');
const roomCodeDisplay = document.getElementById('room-code');
const copyInviteLinkBtn = document.getElementById('copy-invite-link-btn');
const playersInRoomList = document.getElementById('players-in-room');
const startGameBtn = document.getElementById('start-game-btn');
const leaveRoomBtn = document.getElementById('leave-room-btn');

const gameScreen = document.getElementById('game-screen');
const gameStatus = document.getElementById('game-status');
const playerRoleDisplay = document.getElementById('player-role-display');
const timerDisplay = document.getElementById('timer-display');

const clueInputSection = document.getElementById('clue-input-section');
const clueInput = document.getElementById('clue-input');
const sendClueBtn = document.getElementById('send-clue-btn');
const currentClues = document.getElementById('current-clues');

const discussionSection = document.getElementById('discussion-section');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');

const votingSection = document.getElementById('voting-section');
const votingOptions = document.getElementById('voting-options');

const resultsScreen = document.getElementById('results-screen');
const expelledPlayerInfo = document.getElementById('expelled-player-info');
const gameEndMessage = document.getElementById('game-end-message');
const backToLobbyBtn = document.getElementById('back-to-lobby-btn');
const exitGameBtn = document.getElementById('exit-game-btn');


let currentRoomId = null;
let username = '';
let timerInterval = null; // Guardará el "número" del reloj que está andando para poder apagarlo
let isAdmin = false; // Nos dirá si ESTE jugador es el administrador de la sala

// --- Funciones para cambiar de pantalla ---
function showScreen(screen) {
    usernameScreen.classList.add('hidden');
    mainMenu.classList.add('hidden');
    publicRoomsSection.classList.add('hidden');
    privateRoomsMenu.classList.add('hidden');
    roomLobby.classList.add('hidden');
    gameScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    voteTieSection.classList.add('hidden'); // Ocultar desempate (¡Nueva línea!)

    // Ocultar mensajes específicos
    youAreAdminMessage.classList.add('hidden'); // Ocultar mensaje de admin al cambiar de pantalla (¡Nueva línea!)

    screen.classList.remove('hidden'); // Muestra la pantalla que queremos
}

// --- Event Listeners ---
setUsernameBtn.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        socket.emit('set username', username);
        showScreen(mainMenu);
    } else {
        alert('Por favor, ingresa un nombre de usuario.');
    }
});

publicRoomsBtn.addEventListener('click', () => {
    showScreen(publicRoomsSection);
    socket.emit('get public rooms'); // Solicitar salas públicas al servidor
});

privateRoomsMenuBtn.addEventListener('click', () => {
    showScreen(privateRoomsMenu);
});

createPrivateRoomBtn.addEventListener('click', () => {
    socket.emit('create private room');
    isAdmin = true; // El que crea la sala es el administrador
});

joinPrivateRoomBtn.addEventListener('click', () => {
    const roomId = joinPrivateRoomInput.value.trim().toUpperCase();
    if (roomId) {
        socket.emit('join private room', roomId);
    } else {
        alert('Ingresa un código de sala.');
    }
});

// En public/script.js
chatInput.addEventListener('keypress', function(event) {
    // Verifica si la tecla presionada es 'Enter'
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita el comportamiento predeterminado
        sendChatBtn.click(); // Simula un clic en el botón de enviar chat
    }
});

// En public/script.js
clueInput.addEventListener('keypress', function(event) {
    // Verifica si la tecla presionada es 'Enter'
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita el comportamiento predeterminado
        sendClueBtn.click(); // Simula un clic en el botón de enviar pista
    }
});

// En public/script.js, en algún lugar accesible después de definir usernameInput y joinGameBtn
usernameInput.addEventListener('keypress', function(event) {
    // Verifica si la tecla presionada es 'Enter' (código 13 o 'Enter')
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita el comportamiento predeterminado (ej. enviar un formulario)
        joinGameBtn.click(); // Simula un clic en el botón "Jugar"
    }
});

createPublicRoomBtn.addEventListener('click', () => {
    socket.emit('create public room');
    isAdmin = true;
});

startGameBtn.addEventListener('click', () => {
    socket.emit('start game');
});

leaveRoomBtn.addEventListener('click', () => {
    socket.emit('disconnect'); // Esto disparará la lógica de desconexión en el servidor
    showScreen(mainMenu);
    currentRoomId = null;
    startGameBtn.disabled = true;
    isAdmin = false;
});

backToMainMenuFromPublicBtn.addEventListener('click', () => {
    showScreen(mainMenu);
});

backToMainMenuFromPrivateBtn.addEventListener('click', () => {
    showScreen(mainMenu);
});

sendClueBtn.addEventListener('click', () => {
    const clue = clueInput.value.trim();
    if (clue) {
        socket.emit('send clue', clue);
        clueInput.value = '';
        sendClueBtn.disabled = true; // Deshabilitar después de enviar la pista
    }
});

sendChatBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        socket.emit('chat message', message);
        chatInput.value = '';
    }
});

copyInviteLinkBtn.addEventListener('click', () => {
    const inviteLink = window.location.origin + `?room=${currentRoomId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
        alert('¡Enlace de invitación copiado al portapapeles!');
    }).catch(err => {
        console.error('Error al copiar el enlace:', err);
    });
});

backToLobbyBtn.addEventListener('click', () => {
    if (isAdmin) {
        socket.emit('back to lobby request'); // Solo el admin puede pedir al director resetear la sala
    } else {
        // Si un jugador no-admin llega aquí, lo saca al menú principal
        showScreen(mainMenu);
        currentRoomId = null;
        startGameBtn.disabled = true;
        isAdmin = false;
    }
});

exitGameBtn.addEventListener('click', () => {
    socket.emit('disconnect');
    showScreen(mainMenu);
    currentRoomId = null;
    startGameBtn.disabled = true;
    isAdmin = false;
    // Resetear UI del juego
    playerRoleDisplay.className = '';
    playerRoleDisplay.textContent = '';
    timerDisplay.textContent = '';
    clueInputSection.classList.add('hidden');
    currentClues.innerHTML = '';
    discussionSection.classList.add('hidden');
    chatMessages.innerHTML = '';
    votingSection.classList.add('hidden');
    votingOptions.innerHTML = '';
    resultsScreen.classList.add('hidden');
    gameStatus.textContent = 'Esperando que el juego comience...';
});


// --- Manejo de eventos de Socket.IO ---

socket.on('room created', (data) => {
    currentRoomId = data.roomId;
    roomCodeDisplay.textContent = data.roomId;
    showScreen(roomLobby);
    updatePlayersList(data.players);
    isAdmin = (data.players[0].id === socket.id); // Verifica si eres el admin (el primero en la lista)
// Habilita el botón de empezar juego solo si hay 3 o más jugadores Y eres el admin
startGameBtn.disabled = (players.length < 3 || !isAdmin);
});

socket.on('joined room', (data) => {
    currentRoomId = data.roomId;
    roomCodeDisplay.textContent = data.roomId;
    showScreen(roomLobby);
    updatePlayersList(data.players);
    // Verificar si el que se unió es el admin (el primero en la lista)
    isAdmin = (data.players[0].id === socket.id);
    startGameBtn.disabled = (data.players.length < 3 || !isAdmin);
});

socket.on('join room error', (message) => {
    alert(`Error al unirse a la sala: ${message}`);
});

socket.on('update room players', (players) => {
    updatePlayersList(players);
    startGameBtn.disabled = (players.length < 3 || !isAdmin); // Solo el admin puede habilitar
});

function updatePlayersList(players) {
    playersInRoomList.innerHTML = ''; // Limpia la lista actual
    players.forEach(p => { // Para cada jugador en la lista
        const li = document.createElement('li'); // Crea un elemento de lista (como un punto en la lista)
        let status = ''; // Para añadir información extra
        if (p.id === socket.id) status += ' (Tú)'; // Si es el jugador actual, dice "(Tú)"
        // El primer jugador en la lista de la sala siempre será el administrador.
        // Aunque ahora lo controlamos con 'isAdmin', esto asegura que se vea el "(Admin)"
        if (p.id === (players[0] ? players[0].id : null)) status += ' (Admin)';
        if (p.eliminated) status += ' (Eliminado/Desconectado)'; // ¡NUEVO! Si está eliminado, lo muestra

        li.textContent = p.username + status; // Pone el nombre y el estado
        playersInRoomList.appendChild(li); // Añade el elemento a la lista visible
    });

    // Muestra u oculta el mensaje de "¡Eres el administrador!"
    if (isAdmin) {
        youAreAdminMessage.classList.remove('hidden'); // Lo muestra
    } else {
        youAreAdminMessage.classList.add('hidden'); // Lo oculta
    }
}

socket.on('game starting', (message) => {
    showScreen(gameScreen);
    gameStatus.textContent = message;
    playerRoleDisplay.textContent = '';
    playerRoleDisplay.className = '';
    clueInputSection.classList.add('hidden');
    discussionSection.classList.add('hidden');
    votingSection.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    currentClues.innerHTML = '';
    chatMessages.innerHTML = '';
});

socket.on('phase timer', (data) => {
    let timeLeft = data.duration; // Tiempo que queda
    // Muestra la fase y el tiempo restante
    gameInfoDisplay.textContent = `Fase: ${data.phase.replace('-', ' ').toUpperCase()}. Tiempo restante: ${timeLeft}s`;

    if (timerInterval) clearInterval(timerInterval); // Si ya había un reloj, lo apaga

    // Inicia un nuevo reloj que cada segundo resta 1 y actualiza la pantalla
    timerInterval = setInterval(() => {
        timeLeft--;
        gameInfoDisplay.textContent = `Fase: ${data.phase.replace('-', ' ').toUpperCase()}. Tiempo restante: ${timeLeft}s`;
        if (timeLeft <= 0) { // Cuando el tiempo se agota
            clearInterval(timerInterval); // Apaga el reloj
            timerInterval = null; // Reinicia la variable del reloj
            gameInfoDisplay.textContent = `¡Fase ${data.phase.replace('-', ' ').toUpperCase()} terminada!`;
        }
    }, 1000); // Cada 1000 milisegundos (1 segundo)
});

socket.on('start clue giving', () => {
    clueInputSection.classList.remove('hidden'); // Muestra la caja para escribir la pista
    sendClueBtn.disabled = true; // Deshabilita el botón "Enviar Pista" por ahora (hasta que sea tu turno)
    clueInput.value = ''; // Limpia la caja de texto
    currentClues.innerHTML = ''; // Limpia las pistas mostradas de rondas anteriores
    discussionSection.classList.add('hidden'); // Oculta la discusión
    votingSection.classList.add('hidden'); // Oculta la votación
    voteTieSection.classList.add('hidden'); // Oculta el desempate
    resultsScreen.classList.add('hidden'); // Oculta los resultados
    gameStatus.textContent = '¡Es hora de dar pistas!'; // Mensaje de estado
    gameInfoDisplay.textContent = 'Esperando tu turno para dar pista...'; // Mensaje informativo
});

// Este evento te dice a TI si es tu turno de dar pista
socket.on('your turn for clue', (playerId) => {
    if (playerId === socket.id) { // Si el ID que te envía el servidor es el tuyo
        sendClueBtn.disabled = false; // Habilita el botón "Enviar Pista"
        gameInfoDisplay.textContent = '¡Es TU TURNO! Da tu pista (1 o 2 palabras).'; // Mensaje para ti
    } else {
        sendClueBtn.disabled = true; // Deshabilita el botón (no es tu turno)
        // Puedes añadir lógica aquí para mostrar de quién es el turno
    }
});

socket.on('game started', (data) => {
    gameStatus.textContent = '¡El juego ha comenzado!';
    if (data.role === 'impostor') {
        playerRoleDisplay.textContent = 'IMPOSTOR';
        playerRoleDisplay.classList.add('impostor-bg');
    } else {
        playerRoleDisplay.textContent = data.target;
        playerRoleDisplay.classList.add('player-bg');
    }

    // IMPORTANTE: Aquí NO debe haber ningún setInterval para el temporizador.
    // El servidor (server.js) ahora enviará el evento 'phase timer'
    // para controlar y mostrar el temporizador de cada fase.

    showScreen(gameScreen); // Asegúrate de que esta línea esté presente
});

    // Temporizador de 12 segundos para pensar
    let timeLeft = 12;
    timerDisplay.textContent = `Tiempo para pensar: ${timeLeft}s`;
    const countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Tiempo para pensar: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerDisplay.textContent = '¡A dar pistas!';
        }
    }, 1000);
;

socket.on('start clue giving', () => {
    clueInputSection.classList.remove('hidden');
    sendClueBtn.disabled = false;
    clueInput.value = '';
    timerDisplay.textContent = ''; // Limpiar el temporizador de pensar
    gameStatus.textContent = '¡Es hora de dar pistas!';
});

socket.on('start discussion', (clues) => {
    clueInputSection.classList.add('hidden'); // Oculta la sección de pistas
    discussionSection.classList.remove('hidden'); // Muestra la sección de discusión y chat
    gameStatus.textContent = '¡Hora de discutir!'; // Mensaje de estado
    chatMessages.innerHTML = ''; // Limpia el chat anterior
    gameInfoDisplay.textContent = '¡Discusión en curso! (1.5 minutos)'; // Mensaje informativo

    // Muestra todas las pistas dadas al inicio de la discusión
    const pCluesIntro = document.createElement('p');
    pCluesIntro.innerHTML = '<strong>--- Pistas dadas: ---</strong>';
    chatMessages.appendChild(pCluesIntro);
    clues.forEach(c => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${c.username}:</strong> ${c.clue}`;
        chatMessages.appendChild(p);
    });
    const pChatIntro = document.createElement('p');
    pChatIntro.innerHTML = '<strong>--- Chat de discusión: ---</strong>';
    chatMessages.appendChild(pChatIntro);

    chatMessages.scrollTop = chatMessages.scrollHeight; // Mueve el chat al final
});

socket.on('new clue', (data) => {
    const li = document.createElement('li');
    li.textContent = `${data.username}: ${data.clue}`;
    currentClues.appendChild(li); // Añade la pista a la lista
});

socket.on('start voting', (players) => {
    discussionSection.classList.add('hidden'); // Oculta la discusión
    votingSection.classList.remove('hidden'); // Muestra la sección de votación
    voteTieSection.classList.add('hidden'); // Asegura que el desempate esté oculto
    gameStatus.textContent = '¡Es hora de votar!'; // Mensaje de estado
    gameInfoDisplay.textContent = 'Vota por quién crees que es el impostor (30 segundos).'; // Mensaje informativo
    votingOptions.innerHTML = ''; // Limpia los botones de votación anteriores

    players.forEach(p => { // Para cada jugador al que se puede votar
        if (p.id !== socket.id) { // No te puedes votar a ti mismo
            const button = document.createElement('button'); // Crea un botón
            button.textContent = `Votar a ${p.username}`; // Texto del botón
            button.onclick = () => { // Cuando hagas clic en el botón
                socket.emit('cast vote', p.id); // Le dice al director por quién votaste
                // Después de votar, deshabilita todos los botones de voto para que no votes de nuevo
                Array.from(votingOptions.children).forEach(btn => btn.disabled = true);
            };
            votingOptions.appendChild(button); // Añade el botón a la pantalla
        }
    });
});

socket.on('vote tie', (data) => {
    votingSection.classList.add('hidden'); // Oculta la votación normal
    voteTieSection.classList.remove('hidden'); // Muestra la sección de desempate
    gameStatus.textContent = '¡Votación empatada!'; // Mensaje de estado
    gameInfoDisplay.textContent = 'Hay un empate. Si lo deseas, cambia tu voto (20 segundos).'; // Mensaje informativo

    // Muestra quiénes son los candidatos que empataron
    const candidateNames = data.candidates.map(id => data.currentPlayers.find(p => p.id === id)?.username || 'Desconocido');
    tieCandidatesInfo.textContent = `Candidatos empatados: ${candidateNames.join(', ')}.`;

    tieVoteOptions.innerHTML = ''; // Limpia opciones anteriores
    data.currentPlayers.forEach(p => { // Para cada jugador (puedes volver a votar por cualquiera)
        if (p.id !== socket.id) { // No te puedes votar a ti mismo
            const button = document.createElement('button');
            button.textContent = `Cambiar voto a ${p.username}`;
            button.onclick = () => {
                socket.emit('change vote', p.id); // Le dice al director que cambiaste tu voto
                // Deshabilita los botones de desempate después de cambiar voto
                Array.from(tieVoteOptions.children).forEach(btn => btn.disabled = true);
            };
            tieVoteOptions.appendChild(button);
        }
    });
});

// Este evento avisa si alguien cambió su voto durante el desempate
socket.on('vote changed', (data) => {
    const changedVoter = playersInRoomList.querySelector(`li[data-player-id="${data.voterId}"]`)?.textContent.split(' ')[0] || 'Alguien';
    const newVoteTarget = playersInRoomList.querySelector(`li[data-player-id="${data.newVote}"]`)?.textContent.split(' ')[0] || 'Alguien';
    const p = document.createElement('p');
    p.style.fontStyle = 'italic';
    p.textContent = `${changedVoter} cambió su voto a ${newVoteTarget}.`;
    chatMessages.appendChild(p); // Muestra el mensaje en el chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('vote results', (data) => {
    votingSection.classList.add('hidden'); // Oculta la votación
    voteTieSection.classList.add('hidden'); // Asegura que el desempate esté oculto
    resultsScreen.classList.remove('hidden'); // Muestra la pantalla de resultados
    gameInfoDisplay.textContent = ''; // Limpia la información de la fase
    gameStatus.textContent = 'Resultados de la votación:'; // Mensaje de estado

    let message = `El jugador expulsado es: <strong>${data.expelledPlayer}</strong>.`;
    if (data.impostorRevealed) {
        message += `<br>¡Era el **IMPOSTOR**!`; // Si era el impostor
        expelledPlayerInfo.style.color = 'lightgreen'; // Mensaje en verde
    } else {
        message += `<br>¡No era el impostor!`; // Si no era el impostor
        expelledPlayerInfo.style.color = 'red'; // Mensaje en rojo
    }
    expelledPlayerInfo.innerHTML = message;

    // Oculta los botones de volver/salir hasta que el director decida si el juego terminó o continúa
    backToLobbyBtn.classList.add('hidden');
    exitGameBtn.classList.add('hidden');
});

socket.on('vote results', (data) => {
    votingSection.classList.add('hidden'); // Oculta la votación
    voteTieSection.classList.add('hidden'); // Asegura que el desempate esté oculto
    resultsScreen.classList.remove('hidden'); // Muestra la pantalla de resultados
    gameInfoDisplay.textContent = ''; // Limpia la información de la fase
    gameStatus.textContent = 'Resultados de la votación:'; // Mensaje de estado

    let message = `El jugador expulsado es: <strong>${data.expelledPlayer}</strong>.`;
    if (data.impostorRevealed) {
        message += `<br>¡Era el **IMPOSTOR**!`; // Si era el impostor
        expelledPlayerInfo.style.color = 'lightgreen'; // Mensaje en verde
    } else {
        message += `<br>¡No era el impostor!`; // Si no era el impostor
        expelledPlayerInfo.style.color = 'red'; // Mensaje en rojo
    }
    expelledPlayerInfo.innerHTML = message;

    // Oculta los botones de volver/salir hasta que el director decida si el juego terminó o continúa
    backToLobbyBtn.classList.add('hidden');
    exitGameBtn.classList.add('hidden');
});

socket.on('game over', (data) => {
    gameStatus.textContent = '¡Juego Terminado!'; // Mensaje de estado
    gameEndMessage.innerHTML = `<strong>${data.message}</strong>`; // Mensaje de victoria/derrota
    gameEndMessage.style.color = data.winner === 'players' ? 'lightgreen' : 'gold'; // Colores según el ganador

    backToLobbyBtn.classList.remove('hidden'); // Muestra el botón de volver al lobby
    exitGameBtn.classList.remove('hidden'); // Muestra el botón de salir del juego
    // El botón de volver al lobby sólo lo verá el admin (se gestiona al volver al lobby)
    if (!isAdmin) {
         backToLobbyBtn.classList.add('hidden'); // Si no eres admin, lo ocultamos para ti
    }
});

socket.on('game continues', (message) => {
    resultsScreen.classList.add('hidden'); // Oculta los resultados
    clueInputSection.classList.add('hidden'); // Oculta la sección de pistas (se mostrará cuando sea el turno)
    discussionSection.classList.add('hidden'); // Oculta la discusión
    votingSection.classList.add('hidden'); // Oculta la votación
    voteTieSection.classList.add('hidden'); // Oculta el desempate
    gameStatus.textContent = message; // Muestra el mensaje de que el juego continúa
    currentClues.innerHTML = ''; // Limpia las pistas
    chatMessages.innerHTML = ''; // Limpia el chat
    gameInfoDisplay.textContent = 'Comienza una nueva ronda de pistas.'; // Mensaje informativo
    // El director (servidor) mandará 'start clue giving' y 'your turn for clue' para la nueva ronda
});

socket.on('player eliminated', (username) => {
    const p = document.createElement('p');
    p.style.fontStyle = 'italic';
    p.style.color = 'orange';
    p.textContent = `${username} ha sido eliminado o se ha desconectado.`;
    chatMessages.appendChild(p); // Muestra un mensaje en el chat
    chatMessages.scrollTop = chatMessages.scrollHeight; // Mueve el chat al final
});

socket.on('game terminated', (message) => {
    alert(message); // Muestra una alerta simple
    showScreen(mainMenu); // Regresa a la pantalla del menú principal
    currentRoomId = null; // Reinicia la sala actual
    startGameBtn.disabled = true; // Deshabilita el botón de empezar juego
    isAdmin = false; // Ya no eres admin
    // Reinicia todos los elementos visuales del juego para que estén listos para una nueva partida
    playerRoleDisplay.className = '';
    playerRoleDisplay.textContent = '';
    timerDisplay.textContent = '';
    clueInputSection.classList.add('hidden');
    currentClues.innerHTML = '';
    discussionSection.classList.add('hidden');
    chatMessages.innerHTML = '';
    votingSection.classList.add('hidden');
    votingOptions.innerHTML = '';
    resultsScreen.classList.add('hidden');
    gameStatus.textContent = 'Esperando que el juego comience...';
});

socket.on('start discussion', (clues) => {
    clueInputSection.classList.add('hidden');
    discussionSection.classList.remove('hidden');
    gameStatus.textContent = '¡Hora de discutir! (1.5 minutos)';
    chatMessages.innerHTML = ''; // Limpiar chat anterior
    clues.forEach(c => { // Mostrar todas las pistas dadas
        const li = document.createElement('li');
        li.textContent = `${c.username} dio la pista: "${c.clue}"`;
        chatMessages.appendChild(li);
    });
    // Puedes implementar un temporizador aquí también
});

socket.on('chat message', (data) => {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('start voting', (players) => {
    discussionSection.classList.add('hidden');
    votingSection.classList.remove('hidden');
    gameStatus.textContent = '¡Es hora de votar! (30 segundos)';
    votingOptions.innerHTML = '';

    players.forEach(p => {
        if (p.id !== socket.id) { // No te puedes votar a ti mismo
            const button = document.createElement('button');
            button.textContent = `Votar a ${p.username}`;
            button.onclick = () => {
                socket.emit('cast vote', p.id);
                // Deshabilitar botones de voto después de votar
                Array.from(votingOptions.children).forEach(btn => btn.disabled = true);
            };
            votingOptions.appendChild(button);
        }
    });
    // Puedes implementar un temporizador de votación aquí
});

socket.on('vote results', (data) => {
    votingSection.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    expelledPlayerInfo.textContent = `Jugador expulsado: ${data.expelledPlayer}`;
    // Mostrar recuento de votos si lo envías desde el servidor
    console.log("Recuento de votos:", data.voteCounts);
});

socket.on('game over', (data) => {
    gameEndMessage.textContent = `Juego Terminado. ¡Los ${data.winner === 'players' ? 'jugadores' : 'impostores'} ganaron! El impostor era: ${data.impostorRevealed}`;
    backToLobbyBtn.classList.remove('hidden');
    exitGameBtn.classList.remove('hidden');
    gameStatus.textContent = 'Juego finalizado.';
});

socket.on('game continues', (message) => {
    resultsScreen.classList.add('hidden');
    clueInputSection.classList.remove('hidden'); // Volver a la fase de pistas
    gameStatus.textContent = message;
    currentClues.innerHTML = ''; // Limpiar pistas para la nueva ronda
    sendClueBtn.disabled = false;
});

socket.on('vote tie', (data) => {
    // Lógica para que un jugador cambie su voto si hay empate.
    // Esto es más complejo y requeriría una fase adicional en el juego
    // Por ahora, solo se muestra un mensaje o el servidor decide cómo proceder.
    alert(`¡Empate en la votación! Candidatos: ${data.candidates.map(id => {
        const player = playersInRoomList.querySelector(`[data-player-id="${id}"]`); // Necesitarías un data-attribute en el li
        return player ? player.textContent.replace('(Tú)', '').trim() : 'Jugador Desconocido';
    }).join(', ')}. El juego continuará.`);
    // Opcionalmente: forzar un cambio de voto por parte del admin o de forma aleatoria
});

socket.on('back to lobby', (data) => {
    showScreen(roomLobby); // Muestra la pantalla del lobby
    gameStatus.textContent = 'Esperando que el juego comience...';
    playerRoleDisplay.className = '';
    playerRoleDisplay.textContent = '';
    gameInfoDisplay.textContent = ''; // Limpia información de juego
    timerDisplay.textContent = '';
    clueInputSection.classList.add('hidden');
    currentClues.innerHTML = '';
    discussionSection.classList.add('hidden');
    chatMessages.innerHTML = '';
    votingSection.classList.add('hidden');
    votingOptions.innerHTML = '';
    voteTieSection.classList.add('hidden'); // Oculta el desempate
    resultsScreen.classList.add('hidden');

    // Si el director te dice que eres el admin, habilita el botón y muestra el mensaje
    if (data.adminId === socket.id) {
        isAdmin = true;
        startGameBtn.disabled = (playersInRoomList.children.length < 3); // Revisa si hay suficientes jugadores
        youAreAdminMessage.classList.remove('hidden'); // Muestra el mensaje de admin
    } else {
        isAdmin = false;
        startGameBtn.disabled = true;
        youAreAdminMessage.classList.add('hidden'); // Oculta el mensaje
    }
    socket.emit('get public rooms'); // Refresca la lista de salas públicas
});

socket.on('you are admin', () => {
    isAdmin = true; // Te marca como admin
    startGameBtn.disabled = (playersInRoomList.children.length < 3); // Habilita el botón si hay suficientes
    alert('¡Eres el nuevo administrador de la sala!');
    youAreAdminMessage.classList.remove('hidden'); // Muestra el mensaje
});

socket.on('game error', (message) => {
    alert(`Error del juego: ${message}`);
});

socket.on('public rooms list', (rooms) => {
    publicRoomsList.innerHTML = '';
    if (rooms.length === 0) {
        publicRoomsList.innerHTML = '<p>No hay salas públicas disponibles. ¡Crea una!</p>';
    } else {
        rooms.forEach(room => {
            const div = document.createElement('div');
            div.innerHTML = `Sala ${room.id} (${room.playersCount}/15 jugadores) <button data-room-id="${room.id}" class="join-public-room-btn">Unirse</button>`;
            publicRoomsList.appendChild(div);
        });
        document.querySelectorAll('.join-public-room-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const roomId = event.target.dataset.roomId;
                socket.emit('join public room', roomId);
            });
        });
    }
});

socket.on('public rooms updated', (rooms) => {
    // Si estás en la pantalla de salas públicas, actualízalas
    if (!publicRoomsSection.classList.contains('hidden')) {
        publicRoomsList.innerHTML = '';
        if (rooms.length === 0) {
            publicRoomsList.innerHTML = '<p>No hay salas públicas disponibles. ¡Crea una!</p>';
        } else {
            rooms.forEach(room => {
                const div = document.createElement('div');
                div.innerHTML = `Sala ${room.id} (${room.playersCount}/15 jugadores) <button data-room-id="${room.id}" class="join-public-room-btn">Unirse</button>`;
                publicRoomsList.appendChild(div);
            });
            document.querySelectorAll('.join-public-room-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const roomId = event.target.dataset.roomId;
                    socket.emit('join public room', roomId);
                });
            });
        }
    }
});


// Lógica para unirse a sala por URL (opcional)
const urlParams = new URLSearchParams(window.location.search);
const roomParam = urlParams.get('room');
if (roomParam) {
    // Si hay un parámetro de sala en la URL, mostrar pantalla de nombre de usuario primero
    // y luego intentar unirse a la sala automáticamente
    // Esto requeriría que el setUsernameBtn alerte al usuario que se unirá a la sala X
    // y luego emita 'join private room' después de establecer el username.
    // Por simplicidad en este ejemplo, no se implementa la lógica completa de URL de invitación.
}

// Iniciar en la pantalla de nombre de usuario
showScreen(usernameScreen);