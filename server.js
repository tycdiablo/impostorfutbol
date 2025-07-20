// server.js
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- Configuración de la Base de Datos (ejemplo con MongoDB) ---
const uri = "mongodb+srv://elbananas2010:kimoncha@impostorfutbol.w4ayo7w.mongodb.net/?retryWrites=true&w=majority&appName=impostorfutbol"; // Reemplaza con tu URI de MongoDB Atlas
const client = new MongoClient(uri);

let playersDB; // Aquí almacenaremos la colección de jugadores

async function connectDB() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB Atlas");
        const database = client.db("impostorFootballDB"); // Nombre de tu base de datos
        playersDB = database.collection("players"); // Nombre de tu colección de jugadores

        // Opcional: Cargar jugadores si la colección está vacía (solo para prueba)
        const count = await playersDB.countDocuments();
        if (count === 0) {
            console.log("Cargando jugadores de ejemplo...");
            const samplePlayers = [
                { name: "Lionel Messi" },
                { name: "Cristiano Ronaldo" },
                { name: "Diego Maradona" },
                { name: "Pelé" },
                { name: "Neymar Jr." },
                { name: "Kylian Mbappé" },
                { name: "Erling Haaland" },
                { name: "Zinedine Zidane" },
                { name: "Ronaldo Nazário" },
                { name: "Ronaldinho Gaúcho" },
                { name: "Franz Beckenbauer" },
                { name: "Johan Cruyff" },
                { name: "Alfredo Di Stéfano" },
                { name: "George Best" },
                { name: "Lev Yashin" },
                { name: "Garrincha" },
                { name: "Roberto Baggio" },
                { name: "Paolo Maldini" },
                { name: "Zlatan Ibrahimović" },
                { name: "Manuel Neuer" },
                { name: "Sergio Ramos" },
                { name: "Luka Modrić" },
                { name: "Karim Benzema" },
                { name: "Mohamed Salah" },
                { name: "Virgil van Dijk" },
                { name: "Harry Kane" },
                { name: "Kevin De Bruyne" },
                { name: "Robert Lewandowski" },
                { name: "Antoine Griezmann" },
                { name: "Eden Hazard" },
                { name: "Gareth Bale" },
                { name: "Luis Suárez" },
                { name: "Gerard Piqué" },
                { name: "Toni Kroos" },
                { name: "Casemiro" },
                { name: "Marco Reus" },
                { name: "Sadio Mané" },
                { name: "Son Heung-min" },
                { name: "Bernardo Silva" },
                { name: "Bruno Fernandes" },
                { name: "Kai Havertz" },
                { name: "Jadon Sancho" },
                { name: "Phil Foden" },
                { name: "Jude Bellingham" },
                { name: "Pedri" },
                { name: "Gavi" },
                { name: "Jamal Musiala" },
                { name: "Vinicius Jr." },
                { name: "Rodrygo" },
                { name: "Federico Valverde" },
                { name: "Lautaro Martínez" },
                { name: "Julián Álvarez" },
                { name: "Enzo Fernández" },
                { name: "Richarlison" },
                { name: "Gabriel Jesus" },
                { name: "Casemiro" },
                { name: "Rúben Dias" },
                { name: "João Cancelo" },
                { name: "Rodri" },
                { name: "Alphonso Davies" },
                { name: "Joshua Kimmich" },
                { name: "Leroy Sané" },
                { name: "Serge Gnabry" },
                { name: "Leon Goretzka" },
                { name: "Niklas Süle" },
                { name: "Marc-André ter Stegen" },
                { name: "Jan Oblak" },
                { name: "Thibaut Courtois" },
                { name: "Allison Becker" },
                { name: "Ederson" },
                { name: "Gianluigi Donnarumma" },
                { name: "Achraf Hakimi" },
                { name: "Theo Hernández" },
                { name: "Joško Gvardiol" },
                { name: "Ronald Araújo" },
                { name: "Eder Militão" },
                { name: "William Saliba" },
                { name: "Gabriel Magalhães" },
                { name: "Lisandro Martínez" },
                { name: "Raphaël Varane" },
                { name: "Presnel Kimpembe" },
                { name: "Milan Škriniar" },
                { name: "Matthijs de Ligt" },
                { name: "Dayot Upamecano" },
                { name: "Antonio Rüdiger" },
                { name: "David Alaba" },
                { name: "Jules Koundé" },
                { name: "Aymeric Laporte" },
                { name: "Kalidou Koulibaly" },
                { name: "Pierre-Emerick Aubameyang" },
                { name: "Romelu Lukaku" },
                { name: "Dusan Vlahović" },
                { name: "Victor Osimhen" },
                { name: "Rafael Leão" },
                { name: "Khvicha Kvaratskhelia" },
                { name: "Christopher Nkunku" },
                { name: "Julian Brandt" },
                { name: "Florian Wirtz" },
                { name: "Jeremie Frimpong" },
                { name: "Jamal Musiala" },
                { name: "Karim Adeyemi" },
                { name: "Youssoufa Moukoko" },
                { name: "Benjamin Sesko" },
                { name: "Gavi" },
                { name: "Pedri" },
                { name: "Ansu Fati" },
                { name: "Ferran Torres" },
                { name: "Raphinha" },
                { name: "Ousmane Dembélé" },
                { name: "Jules Koundé" },
                { name: "Andreas Christensen" },
                { name: "Franck Kessié" },
                { name: "Robert Lewandowski" },
                { name: "Jordi Alba" },
                { name: "Sergio Busquets" },
                { name: "Marc-André ter Stegen" },
                { name: "Ronald Araújo" },
                { name: "Jules Koundé" },
                { name: "Andreas Christensen" },
                { name: "Alejandro Balde" },
                { name: "Frenkie de Jong" },
                { name: "Gavi" },
                { name: "Pedri" },
                { name: "Sergi Roberto" },
                { name: "Ferran Torres" },
                { name: "Raphinha" },
                { name: "Ansu Fati" },
                { name: "Ousmane Dembélé" },
                { name: "Robert Lewandowski" },
                { name: "Karim Benzema" },
                { name: "Vinicius Jr." },
                { name: "Rodrygo" },
                { name: "Federico Valverde" },
                { name: "Luka Modrić" },
                { name: "Toni Kroos" },
                { name: "Casemiro" },
                { name: "Eduardo Camavinga" },
                { name: "Aurélien Tchouaméni" },
                { name: "David Alaba" },
                { name: "Eder Militão" },
                { name: "Antonio Rüdiger" },
                { name: "Dani Carvajal" },
                { name: "Ferland Mendy" },
                { name: "Thibaut Courtois" }
            ];
            await playersDB.insertMany(samplePlayers);
            console.log("Jugadores de ejemplo cargados.");
        }
    } catch (err) {
        console.error("Error al conectar a MongoDB:", err);
    }
}

connectDB();

// --- Servir archivos estáticos ---
app.use(express.static('public'));

// --- Lógica de las salas y el juego ---
const rooms = {}; // Objeto para almacenar la información de las salas

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // --- Manejo del nombre de usuario ---
    socket.on('set username', (username) => {
        socket.username = username;
        console.log(`Usuario ${socket.id} se identificó como: ${username}`);
    });

    // --- Crear Sala Privada ---
    socket.on('create private room', () => {
        const roomId = Math.random().toString(36).substring(2, 9).toUpperCase(); // Genera un código aleatorio
        rooms[roomId] = {
    id: roomId,
    players: [{ id: socket.id, username: socket.username }],
    isPrivate: true, // o false para salas públicas
    gameStarted: false, // ¿El juego ya empezó? (Falso al inicio)
    adminId: socket.id, // El jugador que creó la sala es el "admin"
    currentRound: null, // Aquí guardaremos los detalles de la ronda actual (quién es el impostor, jugador objetivo, pistas, etc.)
    gameTimer: null, // Un reloj para todo el juego (si lo hubiera, aunque no lo usaremos directamente en este ejemplo)
    phaseTimer: null // Un reloj para cada FASE del juego (pensar, dar pista, discutir, votar)
};
        socket.join(roomId);
        socket.roomId = roomId;
        io.to(socket.id).emit('room created', { roomId: roomId, players: rooms[roomId].players });
        io.to(socket.id).emit('update room players', rooms[roomId].players);
        console.log(`Sala privada creada: ${roomId} por ${socket.username}`);
    });

    // --- Unirse a Sala Privada ---
    socket.on('join private room', (roomId) => {
        if (rooms[roomId] && rooms[roomId].isPrivate && rooms[roomId].players.length < 15) {
            socket.join(roomId);
            socket.roomId = roomId;
            rooms[roomId].players.push({ id: socket.id, username: socket.username });
            io.to(socket.id).emit('joined room', { roomId: roomId, players: rooms[roomId].players });
            io.to(roomId).emit('update room players', rooms[roomId].players); // Notifica a todos en la sala
            console.log(`${socket.username} se unió a la sala privada: ${roomId}`);
        } else {
            io.to(socket.id).emit('join room error', 'Sala no encontrada, llena o no es privada.');
        }
    });

    // --- Crear Sala Pública ---
    socket.on('create public room', () => {
        const roomId = Math.random().toString(36).substring(2, 9).toUpperCase();
        rooms[roomId] = {
    id: roomId,
    players: [{ id: socket.id, username: socket.username }],
    isPrivate: true, // o false para salas públicas
    gameStarted: false, // ¿El juego ya empezó? (Falso al inicio)
    adminId: socket.id, // El jugador que creó la sala es el "admin"
    currentRound: null, // Aquí guardaremos los detalles de la ronda actual (quién es el impostor, jugador objetivo, pistas, etc.)
    gameTimer: null, // Un reloj para todo el juego (si lo hubiera, aunque no lo usaremos directamente en este ejemplo)
    phaseTimer: null // Un reloj para cada FASE del juego (pensar, dar pista, discutir, votar)
};
        socket.join(roomId);
        socket.roomId = roomId;
        io.to(socket.id).emit('room created', { roomId: roomId, players: rooms[roomId].players });
        io.to(socket.id).emit('update room players', rooms[roomId].players);
        // Notificar a todos sobre la nueva sala pública (esto necesitaría una emisión global)
        io.emit('public rooms updated', getPublicRooms());
        console.log(`Sala pública creada: ${roomId} por ${socket.username}`);
    });

    // --- Unirse a Sala Pública ---
    socket.on('join public room', (roomId) => {
        if (rooms[roomId] && !rooms[roomId].isPrivate && rooms[roomId].players.length < 15) {
            socket.join(roomId);
            socket.roomId = roomId;
            rooms[roomId].players.push({ id: socket.id, username: socket.username });
            io.to(socket.id).emit('joined room', { roomId: roomId, players: rooms[roomId].players });
            io.to(roomId).emit('update room players', rooms[roomId].players); // Notifica a todos en la sala
            console.log(`${socket.username} se unió a la sala pública: ${roomId}`);
        } else {
            io.to(socket.id).emit('join room error', 'Sala no encontrada, llena o no es pública.');
        }
    });

    // --- Obtener Salas Públicas ---
    socket.on('get public rooms', () => {
        io.to(socket.id).emit('public rooms list', getPublicRooms());
    });

// --- Funciones de Lógica de Fases del Juego (Como el "Libro de Reglas" del director) ---

// Función para iniciar un temporizador de una fase
function startPhaseTimer(roomId, phaseName, durationSeconds, onTimerEnd) {
    const room = rooms[roomId]; // Obtiene la sala
    if (!room) return; // Si la sala no existe, no hace nada

    if (room.phaseTimer) {
        clearTimeout(room.phaseTimer); // Si ya hay un reloj andando, lo apaga
    }

    // Le avisa a todos los jugadores en la sala que ha empezado una nueva fase y cuánto dura
    io.to(roomId).emit('phase timer', { phase: phaseName, duration: durationSeconds });

    // Establece un nuevo reloj. Cuando el tiempo termine, ejecuta la función `onTimerEnd`
    room.phaseTimer = setTimeout(() => {
        onTimerEnd();
    }, durationSeconds * 1000); // Convierte segundos a milisegundos
}

// Función para iniciar la fase de DAR PISTAS
function startClueGivingPhase(roomId) {
    const room = rooms[roomId];
    if (!room || !room.gameStarted) return; // Si no hay sala o no hay juego, salir

    room.currentRound.phase = 'clue-giving'; // Marca la fase actual
    room.currentRound.clues = []; // Reinicia la lista de pistas para esta ronda
    room.currentRound.currentPlayerTurnIndex = 0; // El turno de dar pista empieza con el primer jugador

    io.to(roomId).emit('start clue giving'); // Avisa a los jugadores que es hora de dar pistas
    sendNextClueTurn(roomId); // Llama a la función para ver a quién le toca dar la primera pista
}

// Función para ver a quién le toca dar la siguiente pista
function sendNextClueTurn(roomId) {
    const room = rooms[roomId];
    if (!room || !room.gameStarted || room.currentRound.phase !== 'clue-giving') return;

    // Filtra los jugadores para solo ver los que NO han sido eliminados/desconectados
    const playersInRoom = room.players.filter(p => !p.eliminated);
    if (playersInRoom.length === 0) { // Si no quedan jugadores activos, el juego termina
         console.log(`No quedan jugadores en la sala ${roomId}. Terminando juego.`);
         endGame(roomId, 'impostor', 'Todos los jugadores fueron eliminados o se desconectaron.');
         return;
    }

    let currentPlayerTurn = playersInRoom[room.currentRound.currentPlayerTurnIndex];

    // Esto es para SALTAR a los jugadores que se desconectaron o fueron eliminados y no pueden dar pista
    while (!currentPlayerTurn || room.players.find(p => p.id === currentPlayerTurn.id && p.eliminated)) {
        room.currentRound.currentPlayerTurnIndex = (room.currentRound.currentPlayerTurnIndex + 1) % playersInRoom.length;
        currentPlayerTurn = playersInRoom[room.currentRound.currentPlayerTurnIndex];
        // Si dimos una vuelta completa y no todos dieron su pista (porque alguien se fue), pasamos a discusión
        if (room.currentRound.currentPlayerTurnIndex === 0 && room.currentRound.clues.length >= playersInRoom.length) {
            console.log(`Todos dieron sus pistas o se saltaron en ${roomId}. Pasando a discusión.`);
            startDiscussionPhase(roomId);
            return;
        }
    }

    io.to(roomId).emit('your turn for clue', currentPlayerTurn.id); // Le dice SOLO a ese jugador que es su turno
    console.log(`Turno de pista en sala ${roomId}: ${currentPlayerTurn.username}`);

    // Inicia un temporizador para que el jugador dé su pista (ej. 30 segundos)
    startPhaseTimer(roomId, 'clue-turn', 30, () => {
        // Si el tiempo se agota y no dio pista, se salta su turno
        console.log(`${currentPlayerTurn.username} no dio pista a tiempo en ${roomId}.`);
        room.currentRound.clues.push({ playerId: currentPlayerTurn.id, username: currentPlayerTurn.username, clue: '[No dio pista]' }); // Añade una pista "vacía"
        io.to(roomId).emit('new clue', { username: currentPlayerTurn.username, clue: '[No dio pista]' }); // Avisa a todos
        room.currentRound.currentPlayerTurnIndex = (room.currentRound.currentPlayerTurnIndex + 1) % playersInRoom.length; // Pasa al siguiente
        sendNextClueTurn(roomId); // Llama de nuevo para ver a quién le toca
    });
}

// Función para iniciar la fase de DISCUSIÓN
function startDiscussionPhase(roomId) {
    const room = rooms[roomId];
    if (!room || !room.gameStarted) return;

    room.currentRound.phase = 'discussion'; // Marca la fase
    io.to(roomId).emit('start discussion', room.currentRound.clues); // Avisa a todos y les envía todas las pistas
    console.log(`Iniciando discusión en sala ${roomId}`);

    startPhaseTimer(roomId, 'discussion', 45, () => { // 1.5 minutos (90 segundos) para discutir
        startVotingPhase(roomId); // Cuando termina, pasa a votar
    });
}

// Función para iniciar la fase de VOTACIÓN
function startVotingPhase(roomId) {
    const room = rooms[roomId];
    if (!room || !room.gameStarted) return;

    room.currentRound.phase = 'voting'; // Marca la fase
    room.currentRound.votes = {}; // Reinicia los votos para esta ronda
    const playersToVote = room.players.filter(p => !p.eliminated); // Solo votan y son votados los jugadores activos
    io.to(roomId).emit('start voting', playersToVote.map(p => ({ id: p.id, username: p.username }))); // Avisa a todos a quiénes pueden votar
    console.log(`Iniciando votación en sala ${roomId}`);

    startPhaseTimer(roomId, 'voting', 30, () => { // 30 segundos para votar
        handleVotes(roomId); // Cuando termina el tiempo, cuenta los votos
    });
}

// Función para CONTAR y PROCESAR los votos
async function handleVotes(roomId) {
    const room = rooms[roomId];
    if (!room || !room.gameStarted || (room.currentRound.phase !== 'voting' && room.currentRound.phase !== 'tie-breaker')) return;

    const voteCounts = {}; // Aquí guardaremos cuántos votos tiene cada jugador
    let totalVotesCast = 0; // Total de votos emitidos
    room.players.forEach(player => {
        if (!player.eliminated && room.currentRound.votes[player.id]) { // Solo cuenta votos de jugadores activos
            const votedId = room.currentRound.votes[player.id];
            voteCounts[votedId] = (voteCounts[votedId] || 0) + 1; // Suma un voto
            totalVotesCast++;
        }
    });

    let maxVotes = 0;
    let candidates = []; // Quiénes tienen la mayor cantidad de votos
    for (const playerId in voteCounts) {
        if (voteCounts[playerId] > maxVotes) {
            maxVotes = voteCounts[playerId];
            candidates = [playerId]; // Este es el nuevo líder
        } else if (voteCounts[playerId] === maxVotes) {
            candidates.push(playerId); // Hay un empate, añade a este candidato
        }
    }

    if (candidates.length > 1) { // ¡Hay un EMPATE!
        room.currentRound.phase = 'tie-breaker'; // Nueva fase: desempate
        // Avisa a los jugadores sobre el empate y quiénes son los candidatos
        const activePlayers = room.players.filter(p => !p.eliminated);
        io.to(roomId).emit('vote tie', { candidates, voteCounts, currentPlayers: activePlayers.map(p => ({id: p.id, username: p.username})) });
        console.log(`Empate en votación en sala ${roomId}: ${candidates.map(id => room.players.find(p => p.id === id)?.username || 'Desconocido').join(', ')}`);

        // Inicia un temporizador para que cambien su voto en el desempate
        startPhaseTimer(roomId, 'tie-breaker', 20, () => { // 20 segundos para desempate
            console.log(`Tiempo de desempate terminado en ${roomId}. Expulsando al primer candidato.`);
            processExpulsion(roomId, candidates[0]); // Si no cambian, se expulsa al primero de la lista empatada
        });

    } else if (candidates.length === 1) { // No hay empate, un único ganador de la votación
        processExpulsion(roomId, candidates[0]); // Procesa la expulsión de ese jugador
    } else { // Nadie votó o no hay candidatos válidos (raro, pero posible)
        io.to(roomId).emit('game continues', 'No hubo votos suficientes. El juego continúa.');
        room.currentRound.phase = 'clue-giving'; // Vuelve a la fase de dar pistas
        room.currentRound.clues = []; // Reinicia las pistas
        room.currentRound.votes = {}; // Reinicia los votos
        startClueGivingPhase(roomId); // Empieza de nuevo la fase de pistas
    }
}

// Esta función maneja el VOTO de un jugador
socket.on('cast vote', (votedPlayerId) => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    // Solo permite votar si el juego está iniciado y en fase de votación
    if (!room || !room.gameStarted || room.currentRound.phase !== 'voting') {
        io.to(socket.id).emit('game error', 'No es el momento de votar.');
        return;
    }
    // Solo puede votar si no se ha votado a sí mismo
    if (votedPlayerId === socket.id) {
        io.to(socket.id).emit('game error', 'No puedes votarte a ti mismo.');
        return;
    }

    room.currentRound.votes[socket.id] = votedPlayerId; // Guarda el voto del jugador actual
    console.log(`${socket.username} votó por ${votedPlayerId} en sala ${roomId}`);

    // Comprueba si todos los jugadores activos ya votaron para avanzar rápidamente
    const activePlayers = room.players.filter(p => !p.eliminated);
    const votesCounted = Object.keys(room.currentRound.votes).length;

    if (votesCounted === activePlayers.length) {
        // Si el temporizador de la fase de votación está activo, lo apaga
        if (room.phaseTimer) {
            clearTimeout(room.phaseTimer);
            room.phaseTimer = null;
        }
        handleVotes(roomId); // Procesa los votos inmediatamente
    }
});

// Nuevo evento: un jugador CAMBIA su voto en caso de desempate
socket.on('change vote', (newVotedPlayerId) => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    // Solo permite cambiar el voto si el juego está iniciado y en fase de desempate
    if (!room || !room.gameStarted || room.currentRound.phase !== 'tie-breaker') return;

    // Si se vota a sí mismo, no hacer nada
    if (newVotedPlayerId === socket.id) {
        io.to(socket.id).emit('game error', 'No puedes votarte a ti mismo.');
        return;
    }

    room.currentRound.votes[socket.id] = newVotedPlayerId; // Actualiza el voto
    io.to(roomId).emit('vote changed', { voterId: socket.id, newVote: newVotedPlayerId }); // Avisa a todos
    console.log(`${socket.username} cambió su voto a ${newVotedPlayerId} en sala ${roomId}`);

    // Re-evaluar los votos inmediatamente después de un cambio de voto
    handleVotes(roomId);
});

// Función para PROCESAR la expulsión de un jugador
function processExpulsion(roomId, expelledPlayerId) {
    const room = rooms[roomId];
    if (!room) return;

    const expelledPlayer = room.players.find(p => p.id === expelledPlayerId);
    if (!expelledPlayer) {
        // Si el jugador ya no existe (ej. se desconectó), el juego continúa
        io.to(roomId).emit('game continues', 'El jugador a expulsar ya no está. El juego continúa.');
        room.currentRound.phase = 'clue-giving';
        room.currentRound.clues = [];
        room.currentRound.votes = {};
        startClueGivingPhase(roomId);
        return;
    }

    // Marca al jugador como "eliminado"
    room.players.forEach(p => {
        if (p.id === expelledPlayerId) {
            p.eliminated = true;
        }
    });

    // Avisa a todos quién fue expulsado
    io.to(roomId).emit('vote results', { expelledPlayer: expelledPlayer.username, expelledPlayerId: expelledPlayerId, impostorRevealed: false });

    // VERIFICA si el expulsado era el impostor
    if (expelledPlayerId === room.currentRound.impostorId) {
        // ¡Jugadores ganan!
        endGame(roomId, 'players', `¡El impostor era ${expelledPlayer.username}! ¡Los jugadores ganaron!`);
    } else {
        console.log(`El jugador expulsado ${expelledPlayer.username} NO era el impostor en ${roomId}.`);
        // El impostor no fue expulsado, el juego continúa
        const activePlayers = room.players.filter(p => !p.eliminated); // Jugadores que quedan
        const activeImpostors = activePlayers.filter(p => p.id === room.currentRound.impostorId); // Impostores que quedan (solo 1)

        // Si el número de impostores (1) es igual o mayor al número de jugadores normales restantes
        // (Es decir, si quedan 1 impostor y 1 jugador normal, el impostor gana)
        if (activeImpostors.length >= activePlayers.length - activeImpostors.length) {
            // ¡Impostor gana!
            endGame(roomId, 'impostor', `¡El impostor ${room.players.find(p => p.id === room.currentRound.impostorId).username} ha ganado!`);
        } else {
            // El juego continúa, porque el impostor no ha sido descubierto y no es mayoría
            io.to(roomId).emit('game continues', `El jugador expulsado ${expelledPlayer.username} NO era el impostor. ¡El juego continúa!`);
            room.currentRound.phase = 'clue-giving'; // Vuelve a la fase de dar pistas
            room.currentRound.clues = []; // Reinicia las pistas
            room.currentRound.votes = {}; // Reinicia los votos
            startClueGivingPhase(roomId); // Empieza una nueva ronda de pistas
        }
    }
}

// Función para FINALIZAR el juego
function endGame(roomId, winner, message) {
    const room = rooms[roomId];
    if (!room) return;

    if (room.phaseTimer) clearTimeout(room.phaseTimer); // Apaga el reloj de fase
    if (room.gameTimer) clearTimeout(room.gameTimer); // Apaga el reloj de juego (si lo usáramos)

    room.gameStarted = false; // Marca el juego como no iniciado
    const impostorUsername = room.players.find(p => p.id === room.currentRound.impostorId)?.username || 'Desconocido';
    io.to(roomId).emit('game over', { winner: winner, message: message, impostorRevealed: impostorUsername }); // Avisa a todos que el juego terminó y quién ganó
    console.log(`Juego terminado en ${roomId}: ${message}`);

    // Resetea la sala para que puedan jugar otra partida sin salir
    room.currentRound = null; // Borra la información de la ronda
    room.players.forEach(p => p.eliminated = false); // Todos vuelven a estar "activos"
}

// El administrador puede pedir volver al lobby DESPUÉS de un juego
socket.on('back to lobby request', () => {
    const roomId = socket.roomId;
    const room = rooms[roomId];
    // Solo el admin puede hacer esto y solo si el juego NO está en curso
    if (room && room.adminId === socket.id && !room.gameStarted) {
        resetRoomToLobby(roomId);
    }
});

// Función para RESETEAR la sala al estado de lobby
function resetRoomToLobby(roomId) {
    const room = rooms[roomId];
    if (room) {
        if (room.phaseTimer) clearTimeout(room.phaseTimer);
        if (room.gameTimer) clearTimeout(room.gameTimer);
        room.gameStarted = false; // El juego no ha empezado
        room.currentRound = null; // No hay ronda en curso
        room.players.forEach(p => p.eliminated = false); // Asegura que nadie esté eliminado
        io.to(roomId).emit('back to lobby', { adminId: room.adminId }); // Avisa a todos que vuelven al lobby
        console.log(`Sala ${roomId} reseteada al lobby.`);
    }
}

    function getPublicRooms() {
        return Object.values(rooms).filter(room => !room.isPrivate && !room.gameStarted).map(room => ({
            id: room.id,
            playersCount: room.players.length,
            // Podrías añadir más info si quieres
        }));
    }

    // --- Empezar Juego (solo para el creador de la sala) ---
socket.on('start game', async () => { // ESTE ES EL INICIO DE 'start game'
        const roomId = socket.roomId; // Obtiene la sala de este jugador
        // Comprueba si la sala existe, si el juego no ha empezado y si el que pide es el admin
        if (roomId && rooms[roomId] && rooms[roomId].adminId === socket.id) {
            if (rooms[roomId].players.length >= 3) { // Necesitas al menos 3 jugadores
                if (rooms[roomId].gameStarted) { // Si ya empezó, no hacer nada
                    io.to(socket.id).emit('game error', 'El juego ya ha comenzado en esta sala.');
                    return;
                }

                rooms[roomId].gameStarted = true; // Marca la sala como "juego iniciado"
                io.to(roomId).emit('game starting', 'El juego comenzará en breve...'); // Avisa a todos en la sala

                try {
                    // Guarda una copia de los jugadores actuales en la sala
                    const currentPlayersInRoom = rooms[roomId].players.slice();

                    // CUENTA los jugadores totales en tu "archivador central" (MongoDB)
                    const totalPlayersInDB = await playersDB.countDocuments();
                    if (totalPlayersInDB === 0) {
                        io.to(roomId).emit('game error', 'No hay jugadores disponibles en la base de datos.');
                        rooms[roomId].gameStarted = false; // Permite reiniciar el juego
                        return;
                    }

                    // Elige un jugador objetivo ALEATORIO de tu lista de 1000 jugadores
                    const randomIndex = Math.floor(Math.random() * totalPlayersInDB);
                    const selectedPlayer = await playersDB.findOne({}, { skip: randomIndex });

                    // Elige un impostor ALEATORIO de los jugadores que están en la sala
                    const impostorIndex = Math.floor(Math.random() * currentPlayersInRoom.length);
                    const impostorPlayerId = currentPlayersInRoom[impostorIndex].id; // Guarda el ID del impostor

                    // Aquí guardamos toda la información de la RONDA actual dentro de la sala
                    rooms[roomId].currentRound = {
                        targetPlayer: selectedPlayer.name, // El nombre del futbolista objetivo
                        impostorId: impostorPlayerId, // El ID del impostor
                        clues: [], // Una lista vacía donde se guardarán las pistas que den los jugadores
                        votes: {}, // Un objeto donde se guardarán los votos de los jugadores
                        phase: 'thinking', // La fase actual del juego: 'thinking', 'clue-giving', etc.
                        currentPlayerTurnIndex: 0 // Un número que nos dice a qué jugador le toca dar la pista
                    };

                    console.log(`Juego iniciado en ${roomId}. Jugador objetivo: ${selectedPlayer.name}, Impostor: ${currentPlayersInRoom[impostorIndex].username}`);

                    // ENVÍA los roles a cada jugador. Cada uno solo ve su rol.
                    currentPlayersInRoom.forEach(p => {
                        if (p.id === rooms[roomId].currentRound.impostorId) {
                            // Si es el impostor, le decimos que es el 'impostor'
                            io.to(p.id).emit('game started', { role: 'impostor' });
                        } else {
                            // Si es jugador normal, le decimos que es 'player' y cuál es el 'target' (el futbolista objetivo)
                            io.to(p.id).emit('game started', { role: 'player', target: selectedPlayer.name });
                        }
                    });

                    // Inicia el primer reloj: el de "pensar" (12 segundos)
                    // Cuando el tiempo se agote, llamará a la función `startClueGivingPhase`
                    startPhaseTimer(roomId, 'thinking', 12, () => {
                        startClueGivingPhase(roomId);
                    });

                } catch (err) { // ESTA ES LA LÍNEA 675 QUE MENCIONAS
                    console.error("Error al iniciar juego o seleccionar jugador:", err);
                    io.to(roomId).emit('game error', 'No se pudo iniciar el juego. Intenta de nuevo.');
                    rooms[roomId].gameStarted = false; // Permite reiniciar
                }
            } else {
                io.to(socket.id).emit('game error', 'Se necesitan al menos 3 jugadores para empezar el juego.');
            }
        } else {
            io.to(socket.id).emit('game error', 'No eres el creador de la sala o la sala no existe.');
        }
    }); // ESTE ES EL FINAL DE 'start game'

    // --- Lógica para Pistas (ejemplo) ---
    socket.on('send clue', (clue) => {
        const roomId = socket.roomId;
        const room = rooms[roomId];

        // Verifica que sea el momento de dar pistas y que el juego esté activo
        if (!room || !room.gameStarted || room.currentRound.phase !== 'clue-giving') {
            io.to(socket.id).emit('game error', 'No es el momento de dar pistas.');
            return;
        }

        // Encuentra a quién le toca el turno actual
        const activePlayers = room.players.filter(p => !p.eliminated); // Jugadores activos
        const currentPlayerTurn = activePlayers[room.currentRound.currentPlayerTurnIndex];

        // Verifica si es el turno de ESTE jugador
        if (currentPlayerTurn && currentPlayerTurn.id === socket.id) {
            const trimmedClue = clue.trim(); // Quita espacios extra al inicio y final
            // Divide la pista en palabras y filtra las que estén vacías
            const words = trimmedClue.split(/\s+/).filter(word => word.length > 0);

            // VALIDA la pista: debe tener entre 1 y 2 palabras
            if (words.length >= 1 && words.length <= 2) {
                // Si el reloj de pista estaba andando, lo apaga porque la pista ya se dio
                if (room.phaseTimer) {
                    clearTimeout(room.phaseTimer);
                    room.phaseTimer = null;
                }

                room.currentRound.clues.push({ playerId: socket.id, username: socket.username, clue: trimmedClue }); // Guarda la pista
                io.to(roomId).emit('new clue', { username: socket.username, clue: trimmedClue }); // Avisa a todos que hay una nueva pista
                console.log(`Pista de ${socket.username} en sala ${roomId}: "${trimmedClue}"`);

                // Avanza al siguiente jugador o pasa a la siguiente fase
                if (room.currentRound.clues.length < activePlayers.length) { // Si aún faltan pistas por dar
                    room.currentRound.currentPlayerTurnIndex = (room.currentRound.currentPlayerTurnIndex + 1) % activePlayers.length; // Pasa al siguiente turno
                    sendNextClueTurn(roomId); // Llama a la función para dar el siguiente turno
                } else {
                    // Todos han dado su pista, ¡hora de discutir!
                    startDiscussionPhase(roomId);
                }
            } else {
                // Si la pista no es válida
                io.to(socket.id).emit('game error', 'Tu pista debe ser de 1 o 2 palabras.');
            }
        } else {
            // Si no era su turno
            io.to(socket.id).emit('game error', 'No es tu turno de dar pista.');
        }
    });


    // --- Lógica para Chat ---
    socket.on('chat message', (msg) => {
        const roomId = socket.roomId;
        if (roomId && rooms[roomId] && rooms[roomId].currentRound.phase === 'discussion') {
            io.to(roomId).emit('chat message', { username: socket.username, message: msg });
        }
    });

    // Esta función maneja el VOTO de un jugador
    socket.on('cast vote', (votedPlayerId) => {
        const roomId = socket.roomId;
        const room = rooms[roomId];
        // Solo permite votar si el juego está iniciado y en fase de votación
        if (!room || !room.gameStarted || room.currentRound.phase !== 'voting') {
            io.to(socket.id).emit('game error', 'No es el momento de votar.');
            return;
        }
        // Solo puede votar si no se ha votado a sí mismo
        if (votedPlayerId === socket.id) {
            io.to(socket.id).emit('game error', 'No puedes votarte a ti mismo.');
            return;
        }

        room.currentRound.votes[socket.id] = votedPlayerId; // Guarda el voto del jugador actual
        console.log(`${socket.username} votó por ${votedPlayerId} en sala ${roomId}`);

        // Comprueba si todos los jugadores activos ya votaron para avanzar rápidamente
        const activePlayers = room.players.filter(p => !p.eliminated);
        const votesCast = Object.keys(room.currentRound.votes); // Votos que se han emitido
        const votesCounted = votesCast.filter(voterId => activePlayers.some(p => p.id === voterId)).length; // Cuántos votos de jugadores activos

        if (votesCounted === activePlayers.length) {
            // Si el temporizador de la fase de votación está activo, lo apaga
            if (room.phaseTimer) {
                clearTimeout(room.phaseTimer);
                room.phaseTimer = null;
            }
            handleVotes(roomId); // Procesa los votos inmediatamente
        }
    });

    // Nuevo evento: un jugador CAMBIA su voto en caso de desempate
    socket.on('change vote', (newVotedPlayerId) => {
        const roomId = socket.roomId;
        const room = rooms[roomId];
        // Solo permite cambiar el voto si el juego está iniciado y en fase de desempate
        if (!room || !room.gameStarted || room.currentRound.phase !== 'tie-breaker') {
            io.to(socket.id).emit('game error', 'No es el momento de cambiar el voto.');
            return;
        }

        // Si se vota a sí mismo, no hacer nada
        if (newVotedPlayerId === socket.id) {
            io.to(socket.id).emit('game error', 'No puedes votarte a ti mismo.');
            return;
        }

        room.currentRound.votes[socket.id] = newVotedPlayerId; // Actualiza el voto
        io.to(roomId).emit('vote changed', { voterId: socket.id, newVote: newVotedPlayerId }); // Avisa a todos
        console.log(`${socket.username} cambió su voto a ${newVotedPlayerId} en sala ${roomId}`);

        // Re-evaluar los votos inmediatamente después de un cambio de voto
        handleVotes(roomId);
    });

    // --- Funciones de Lógica de Fases del Juego (Como el "Libro de Reglas" del director) ---

    // Función para iniciar un temporizador de una fase
    function startPhaseTimer(roomId, phaseName, durationSeconds, onTimerEnd) {
        const room = rooms[roomId]; // Obtiene la sala
        if (!room) return; // Si la sala no existe, no hace nada

        if (room.phaseTimer) {
            clearTimeout(room.phaseTimer); // Si ya hay un reloj andando, lo apaga
        }

        // Le avisa a todos los jugadores en la sala que ha empezado una nueva fase y cuánto dura
        io.to(roomId).emit('phase timer', { phase: phaseName, duration: durationSeconds });

        // Establece un nuevo reloj. Cuando el tiempo termine, ejecuta la función `onTimerEnd`
        room.phaseTimer = setTimeout(() => {
            onTimerEnd();
        }, durationSeconds * 1000); // Convierte segundos a milisegundos
    }

    // Función para iniciar la fase de DAR PISTAS
    function startClueGivingPhase(roomId) {
        const room = rooms[roomId];
        if (!room || !room.gameStarted) return; // Si no hay sala o no hay juego, salir

        room.currentRound.phase = 'clue-giving'; // Marca la fase actual
        room.currentRound.clues = []; // Reinicia la lista de pistas para esta ronda
        room.currentRound.currentPlayerTurnIndex = 0; // El turno de dar pista empieza con el primer jugador

        io.to(roomId).emit('start clue giving'); // Avisa a los jugadores que es hora de dar pistas
        sendNextClueTurn(roomId); // Llama a la función para ver a quién le toca dar la primera pista
    }

    // Función para ver a quién le toca dar la siguiente pista
    function sendNextClueTurn(roomId) {
        const room = rooms[roomId];
        if (!room || !room.gameStarted || room.currentRound.phase !== 'clue-giving') return;

        // Filtra los jugadores para solo ver los que NO han sido eliminados/desconectados
        const playersInRoom = room.players.filter(p => !p.eliminated);
        if (playersInRoom.length === 0) { // Si no quedan jugadores activos, el juego termina
             console.log(`No quedan jugadores en la sala ${roomId}. Terminando juego.`);
             endGame(roomId, 'impostor', 'Todos los jugadores fueron eliminados o se desconectaron.');
             return;
        }

        let currentPlayerTurn = playersInRoom[room.currentRound.currentPlayerTurnIndex];

        // Esto es para SALTAR a los jugadores que se desconectaron o fueron eliminados y no pueden dar pista
        while (!currentPlayerTurn || (currentPlayerTurn && room.players.find(p => p.id === currentPlayerTurn.id && p.eliminated))) {
            room.currentRound.currentPlayerTurnIndex = (room.currentRound.currentPlayerTurnIndex + 1) % playersInRoom.length;
            currentPlayerTurn = playersInRoom[room.currentRound.currentPlayerTurnIndex];
            // Si dimos una vuelta completa y no todos dieron su pista (porque alguien se fue), pasamos a discusión
            if (room.currentRound.currentPlayerTurnIndex === 0 && room.currentRound.clues.length >= playersInRoom.length) {
                console.log(`Todos dieron sus pistas o se saltaron en ${roomId}. Pasando a discusión.`);
                startDiscussionPhase(roomId);
                return;
            }
        }

        io.to(roomId).emit('your turn for clue', currentPlayerTurn.id); // Le dice SOLO a ese jugador que es su turno
        console.log(`Turno de pista en sala ${roomId}: ${currentPlayerTurn.username}`);

        // Inicia un temporizador para que el jugador dé su pista (ej. 30 segundos)
        startPhaseTimer(roomId, 'clue-turn', 30, () => {
            // Si el tiempo se agota y no dio pista, se salta su turno
            console.log(`${currentPlayerTurn.username} no dio pista a tiempo en ${roomId}.`);
            room.currentRound.clues.push({ playerId: currentPlayerTurn.id, username: currentPlayerTurn.username, clue: '[No dio pista]' }); // Añade una pista "vacía"
            io.to(roomId).emit('new clue', { username: currentPlayerTurn.username, clue: '[No dio pista]' }); // Avisa a todos
            room.currentRound.currentPlayerTurnIndex = (room.currentRound.currentPlayerTurnIndex + 1) % playersInRoom.length; // Pasa al siguiente
            sendNextClueTurn(roomId); // Llama de nuevo para ver a quién le toca
        });
    }

    // Función para iniciar la fase de DISCUSIÓN
    function startDiscussionPhase(roomId) {
        const room = rooms[roomId];
        if (!room || !room.gameStarted) return;

        room.currentRound.phase = 'discussion'; // Marca la fase
        io.to(roomId).emit('start discussion', room.currentRound.clues); // Avisa a todos y les envía todas las pistas
        console.log(`Iniciando discusión en sala ${roomId}`);

        startPhaseTimer(roomId, 'discussion', 90, () => { // 1.5 minutos (90 segundos) para discutir
            startVotingPhase(roomId); // Cuando termina, pasa a votar
        });
    }

    // Función para iniciar la fase de VOTACIÓN
    function startVotingPhase(roomId) {
        const room = rooms[roomId];
        if (!room || !room.gameStarted) return;

        room.currentRound.phase = 'voting'; // Marca la fase
        room.currentRound.votes = {}; // Reinicia los votos para esta ronda
        const playersToVote = room.players.filter(p => !p.eliminated); // Solo votan y son votados los jugadores activos
        io.to(roomId).emit('start voting', playersToVote.map(p => ({ id: p.id, username: p.username }))); // Avisa a todos a quiénes pueden votar
        console.log(`Iniciando votación en sala ${roomId}`);

        startPhaseTimer(roomId, 'voting', 30, () => { // 30 segundos para votar
            handleVotes(roomId); // Cuando termina el tiempo, cuenta los votos
        });
    }

    // Función para CONTAR y PROCESAR los votos
    async function handleVotes(roomId) {
        const room = rooms[roomId];
        if (!room || !room.gameStarted || (room.currentRound.phase !== 'voting' && room.currentRound.phase !== 'tie-breaker')) return;

        const voteCounts = {}; // Aquí guardaremos cuántos votos tiene cada jugador
        let totalVotesCast = 0; // Total de votos emitidos
        room.players.forEach(player => {
            if (!player.eliminated && room.currentRound.votes[player.id]) { // Solo cuenta votos de jugadores activos
                const votedId = room.currentRound.votes[player.id];
                voteCounts[votedId] = (voteCounts[votedId] || 0) + 1; // Suma un voto
                totalVotesCast++;
            }
        });

        let maxVotes = 0;
        let candidates = []; // Quiénes tienen la mayor cantidad de votos
        for (const playerId in voteCounts) {
            if (voteCounts[playerId] > maxVotes) {
                maxVotes = voteCounts[playerId];
                candidates = [playerId]; // Este es el nuevo líder
            } else if (voteCounts[playerId] === maxVotes) {
                candidates.push(playerId); // Hay un empate, añade a este candidato
            }
        }

        if (candidates.length > 1) { // ¡Hay un EMPATE!
            room.currentRound.phase = 'tie-breaker'; // Nueva fase: desempate
            // Avisa a los jugadores sobre el empate y quiénes son los candidatos
            const activePlayers = room.players.filter(p => !p.eliminated);
            io.to(roomId).emit('vote tie', { candidates, voteCounts, currentPlayers: activePlayers.map(p => ({id: p.id, username: p.username})) });
            console.log(`Empate en votación en sala ${roomId}: ${candidates.map(id => room.players.find(p => p.id === id)?.username || 'Desconocido').join(', ')}`);

            // Inicia un temporizador para que cambien su voto en el desempate
            startPhaseTimer(roomId, 'tie-breaker', 20, () => { // 20 segundos para desempate
                console.log(`Tiempo de desempate terminado en ${roomId}. Expulsando al primer candidato.`);
                processExpulsion(roomId, candidates[0]); // Si no cambian, se expulsa al primero de la lista empatada
            });

        } else if (candidates.length === 1) { // No hay empate, un único ganador de la votación
            processExpulsion(roomId, candidates[0]); // Procesa la expulsión de ese jugador
        } else { // Nadie votó o no hay candidatos válidos (raro, pero posible)
            io.to(roomId).emit('game continues', 'No hubo votos suficientes. El juego continúa.');
            room.currentRound.phase = 'clue-giving'; // Vuelve a la fase de dar pistas
            room.currentRound.clues = []; // Reinicia las pistas
            room.currentRound.votes = {}; // Reinicia los votos
            startClueGivingPhase(roomId); // Empieza de nuevo la fase de pistas
        }
    }


    // Función para PROCESAR la expulsión de un jugador
    function processExpulsion(roomId, expelledPlayerId) {
        const room = rooms[roomId];
        if (!room) return;

        const expelledPlayer = room.players.find(p => p.id === expelledPlayerId);
        if (!expelledPlayer) {
            // Si el jugador ya no existe (ej. se desconectó), el juego continúa
            io.to(roomId).emit('game continues', 'El jugador a expulsar ya no está. El juego continúa.');
            room.currentRound.phase = 'clue-giving';
            room.currentRound.clues = [];
            room.currentRound.votes = {};
            startClueGivingPhase(roomId);
            return;
        }

        // Marca al jugador como "eliminado"
        room.players.forEach(p => {
            if (p.id === expelledPlayerId) {
                p.eliminated = true;
            }
        });

        // Avisa a todos quién fue expulsado
        io.to(roomId).emit('vote results', { expelledPlayer: expelledPlayer.username, expelledPlayerId: expelledPlayerId, impostorRevealed: false });

        // VERIFICA si el expulsado era el impostor
        if (expelledPlayerId === room.currentRound.impostorId) { // Aquí usas impostorId
            // ¡Jugadores ganan!
            endGame(roomId, 'players', `¡El impostor era ${expelledPlayer.username}! ¡Los jugadores ganaron!`);
        } else {
            console.log(`El jugador expulsado ${expelledPlayer.username} NO era el impostor en ${roomId}.`);
            // El impostor no fue expulsado, el juego continúa
            const activePlayers = room.players.filter(p => !p.eliminated); // Jugadores que quedan
            const activeImpostors = activePlayers.filter(p => p.id === room.currentRound.impostorId); // Impostores que quedan (solo 1)

            // Si el número de impostores (1) es igual o mayor al número de jugadores normales restantes
            // (Es decir, si quedan 1 impostor y 1 jugador normal, el impostor gana)
            if (activeImpostors.length >= activePlayers.length - activeImpostors.length) {
                // ¡Impostor gana!
                endGame(roomId, 'impostor', `¡El impostor ${room.players.find(p => p.id === room.currentRound.impostorId).username} ha ganado!`);
            } else {
                // El juego continúa, porque el impostor no ha sido descubierto y no es mayoría
                io.to(roomId).emit('game continues', `El jugador expulsado ${expelledPlayer.username} NO era el impostor. ¡El juego continúa!`);
                room.currentRound.phase = 'clue-giving'; // Vuelve a la fase de dar pistas
                room.currentRound.clues = []; // Reinicia las pistas
                room.currentRound.votes = {}; // Reinicia los votos
                startClueGivingPhase(roomId); // Empieza una nueva ronda de pistas
            }
        }
    }

    // Función para FINALIZAR el juego
    function endGame(roomId, winner, message) {
        const room = rooms[roomId];
        if (!room) return;

        if (room.phaseTimer) clearTimeout(room.phaseTimer); // Apaga el reloj de fase
        if (room.gameTimer) clearTimeout(room.gameTimer); // Apaga el reloj de juego (si lo usáramos)

        room.gameStarted = false; // Marca el juego como no iniciado
        const impostorUsername = room.players.find(p => p.id === room.currentRound.impostorId)?.username || 'Desconocido';
        io.to(roomId).emit('game over', { winner: winner, message: message, impostorRevealed: impostorUsername }); // Avisa a todos que el juego terminó y quién ganó
        console.log(`Juego terminado en ${roomId}: ${message}`);

        // Resetea la sala para que puedan jugar otra partida sin salir
        room.currentRound = null; // Borra la información de la ronda
        room.players.forEach(p => p.eliminated = false); // Todos vuelven a estar "activos"
    }

    // El administrador puede pedir volver al lobby DESPUÉS de un juego
    socket.on('back to lobby request', () => {
        const roomId = socket.roomId;
        const room = rooms[roomId];
        // Solo el admin puede hacer esto y solo si el juego NO está en curso
        if (room && room.adminId === socket.id && !room.gameStarted) {
            resetRoomToLobby(roomId);
        }
    });

    // Función para RESETEAR la sala al estado de lobby
    function resetRoomToLobby(roomId) {
        const room = rooms[roomId];
        if (room) {
            if (room.phaseTimer) clearTimeout(room.phaseTimer);
            if (room.gameTimer) clearTimeout(room.gameTimer);
            room.gameStarted = false; // El juego no ha empezado
            room.currentRound = null; // No hay ronda en curso
            room.players.forEach(p => p.eliminated = false); // Asegura que nadie esté eliminado
            io.to(roomId).emit('back to lobby', { adminId: room.adminId }); // Avisa a todos que vuelven al lobby
            console.log(`Sala ${roomId} reseteada al lobby.`);
        }
    }


    // --- Desconexión de usuario ---
    socket.on('disconnect', () => {
        // Dentro de socket.on('disconnect', ...)
        console.log(`Usuario desconectado: ${socket.id}`);
        // Busca la sala de donde se desconectó el jugador
        for (const roomId in rooms) {
            const room = rooms[roomId];
            const playerIndex = room.players.findIndex(p => p.id === socket.id); // Busca al jugador en la sala
            if (playerIndex !== -1) { // Si el jugador fue encontrado en esta sala
                // Si el juego está en curso, NO lo saca de la lista, sino que lo marca como "eliminado"
                if (room.gameStarted) {
                    room.players[playerIndex].eliminated = true; // Marca al jugador como eliminado
                    io.to(roomId).emit('player eliminated', room.players[playerIndex].username); // Avisa a los demás que se fue
                    console.log(`${socket.username} se desconectó y fue marcado como eliminado en juego en ${roomId}`);

                    // Después de que alguien se va en juego, el director verifica si el juego debe terminar
                    const activePlayers = room.players.filter(p => !p.eliminated); // ¿Cuántos jugadores quedan activos?
                    const activeImpostors = activePlayers.filter(p => p.id === room.currentRound.impostorId); // ¿Cuántos impostores quedan activos? (solo 1)

                    if (activePlayers.length < 3) { // Si quedan menos de 3 jugadores, el juego se termina
                        io.to(roomId).emit('game terminated', 'El juego ha terminado debido a pocos jugadores.');
                        endGame(roomId, 'impostor', `Juego terminado. El impostor ${room.players.find(p => p.id === room.currentRound.impostorId).username} gana porque quedan pocos jugadores.`);
                        // delete rooms[roomId]; // No borramos la sala aquí para que pueda regresar al lobby después de un game over
                        return; // Sal de la función, ya terminamos
                    }
                    // Si el número de impostores es igual o mayor al de jugadores normales (el impostor es mayoría)
                    if (activeImpostors.length >= activePlayers.length - activeImpostors.length) {
                        endGame(roomId, 'impostor', `¡El impostor ${room.players.find(p => p.id === room.currentRound.impostorId).username} ha ganado porque es mayoría!`);
                        return; // Sal de la función
                    }

                    // Si era el turno del jugador desconectado de dar pista, pasamos al siguiente
                    if (room.currentRound && room.currentRound.phase === 'clue-giving' && room.players[room.currentRound.currentPlayerTurnIndex].id === socket.id) {
                        if (room.phaseTimer) {
                            clearTimeout(room.phaseTimer); // Apaga el reloj actual
                            room.phaseTimer = null;
                        }
                        room.currentRound.currentPlayerTurnIndex = (room.currentRound.currentPlayerTurnIndex + 1) % activePlayers.length; // Pasa al siguiente turno
                        sendNextClueTurn(roomId); // Llama para el siguiente turno
                    }

                    // Actualiza la lista de jugadores para todos, mostrando quién está "eliminado"
                    io.to(roomId).emit('update room players', room.players.map(p => ({ id: p.id, username: p.username, eliminated: p.eliminated })));

                } else { // Si el juego NO ha empezado, simplemente lo saca del lobby (el escenario de espera)
                    room.players.splice(playerIndex, 1); // Lo quita de la lista de jugadores de la sala
                    io.to(roomId).emit('update room players', room.players); // Avisa a todos que la lista de jugadores cambió
                    console.log(`${socket.username} abandonó la sala ${roomId}`);

                    // Si la sala se queda vacía, el director la cierra
                    if (room.players.length === 0) {
                        delete rooms[roomId];
                        console.log(`Sala ${roomId} eliminada por estar vacía.`);
                    }
                    // Si el que se fue era el admin, el primer jugador que queda se convierte en el nuevo admin
                    else if (room.adminId === socket.id) {
                        room.adminId = room.players[0].id; // El primer jugador es el nuevo admin
                        io.to(room.adminId).emit('you are admin'); // Le avisa al nuevo admin
                        console.log(`Nuevo admin de sala ${roomId}: ${room.players[0].username}`);
                    }
                }
                break; // ¡Importante! Sal del bucle for, ya encontramos y procesamos la desconexión
            }
        }
        io.emit('public rooms updated', getPublicRooms()); // Actualiza la lista de salas públicas para todos
    });
}); // <--- Esta es la llave y paréntesis que cierra el io.on('connection', ...)

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});