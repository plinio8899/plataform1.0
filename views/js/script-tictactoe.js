// Tres en Raya - Lógica del juego
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gamePoints = 0;
let drawCount = 0;
const MAX_DRAWS_BEFORE_LOSS = 3;

// Combinaciones ganadoras
const winningConditions = [
    [0, 1, 2], // fila superior
    [3, 4, 5], // fila media
    [6, 7, 8], // fila inferior
    [0, 3, 6], // columna izquierda
    [1, 4, 7], // columna media
    [2, 5, 8], // columna derecha
    [0, 4, 8], // diagonal
    [2, 4, 6]  // diagonal inversa
];

// Elementos del DOM
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const drawCounter = document.getElementById('draw-counter');
const resultOverlay = document.getElementById('result-overlay');
const resultTitle = document.getElementById('result-title');
const resultPoints = document.getElementById('result-points');
const restartBtn = document.getElementById('restart-btn');
const savePointsBtn = document.getElementById('save-points-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const backBtn = document.getElementById('back-btn');

// Inicializar juego
function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gamePoints = 0;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
        cell.disabled = false;
    });
    
    statusDisplay.textContent = 'Tu turno';
    resultOverlay.classList.remove('show');
    updateDrawCounter();
}

// Actualizar contador de empates
function updateDrawCounter() {
    if (drawCount > 0) {
        drawCounter.textContent = `Empates: ${drawCount}/${MAX_DRAWS_BEFORE_LOSS}`;
    } else {
        drawCounter.textContent = '';
    }
}

// Manejar clic en celda
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Verificar si la celda ya está ocupada o el juego terminó
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Movimiento del jugador
    makeMove(clickedCellIndex, 'X');

    // Verificar victoria o empate
    if (checkWin('X')) {
        endGame('win');
        return;
    }

    if (checkDraw()) {
        handleDraw();
        return;
    }

    // Turno de la máquina
    gameActive = false;
    statusDisplay.textContent = 'Turno de la máquina...';
    
    setTimeout(() => {
        machineMove();
        gameActive = true;
    }, 500);
}

// Realizar movimiento
function makeMove(index, player) {
    board[index] = player;
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
}

// Movimiento de la máquina (estrategia simple)
function machineMove() {
    // Primero, intentar ganar
    let move = findWinningMove('O');
    
    // Si no puede ganar, bloquear al jugador
    if (move === -1) {
        move = findWinningMove('X');
    }
    
    // Si no hay que bloquear, tomar el centro si está libre
    if (move === -1 && board[4] === '') {
        move = 4;
    }
    
    // Si el centro no está libre, tomar una esquina libre
    if (move === -1) {
        const corners = [0, 2, 6, 8];
        move = findRandomMove(corners);
    }
    
    // Si no hay esquinas, tomar cualquier celda libre
    if (move === -1) {
        const availableCells = board.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
        move = availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    if (move !== -1) {
        makeMove(move, 'O');
        
        if (checkWin('O')) {
            endGame('lose');
            return;
        }

        if (checkDraw()) {
            handleDraw();
            return;
        }

        statusDisplay.textContent = 'Tu turno';
    }
}

// Encontrar movimiento ganador
function findWinningMove(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === '') {
            return c;
        }
        if (board[a] === player && board[c] === player && board[b] === '') {
            return b;
        }
        if (board[b] === player && board[c] === player && board[a] === '') {
            return a;
        }
    }
    return -1;
}

// Movimiento aleatorio en posiciones dadas
function findRandomMove(positions) {
    const available = positions.filter(pos => board[pos] === '');
    if (available.length > 0) {
        return available[Math.floor(Math.random() * available.length)];
    }
    return -1;
}

// Verificar victoria
function checkWin(player) {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return board[index] === player;
        });
    });
}

// Verificar empate
function checkDraw() {
    return board.every(cell => {
        return cell !== '';
    });
}

// Manejar empate
function handleDraw() {
    drawCount++;
    updateDrawCounter();
    
    if (drawCount >= MAX_DRAWS_BEFORE_LOSS) {
        // 3 empates = pérdida de intento
        endGame('drawLimitReached');
    } else {
        // Mostrar opciones para continuar o guardar puntos
        endGame('draw');
    }
}

// Terminar juego
function endGame(result) {
    gameActive = false;
    
    // Deshabilitar todas las celdas
    cells.forEach(cell => {
        cell.disabled = true;
    });
    
    switch (result) {
        case 'win':
            gamePoints = 10;
            resultTitle.textContent = '¡Ganaste!';
            resultTitle.style.color = '#27ae60';
            resultPoints.textContent = '+10 puntos';
            statusDisplay.textContent = '¡Victoria!';
            playAgainBtn.style.display = 'block';
            backBtn.style.display = 'none';
            break;
        case 'draw':
            gamePoints = 3;
            resultTitle.textContent = '¡Empate!';
            resultTitle.style.color = '#f39c12';
            resultPoints.textContent = `+3 puntos (${drawCount}/${MAX_DRAWS_BEFORE_LOSS} empates)`;
            statusDisplay.textContent = 'Empate';
            playAgainBtn.style.display = 'block';
            backBtn.style.display = 'none';
            break;
        case 'drawLimitReached':
            gamePoints = 0;
            resultTitle.textContent = '¡Empate x3!';
            resultTitle.style.color = '#e74c3c';
            resultPoints.textContent = '+0 puntos - Intento perdido';
            statusDisplay.textContent = '3 Empates = Derrota';
            playAgainBtn.style.display = 'none';
            backBtn.style.display = 'block';
            break;
        case 'lose':
            gamePoints = 0;
            resultTitle.textContent = '¡Perdiste!';
            resultTitle.style.color = '#e74c3c';
            resultPoints.textContent = '+0 puntos - Intento perdido';
            statusDisplay.textContent = 'Derrota';
            playAgainBtn.style.display = 'none';
            backBtn.style.display = 'block';
            break;
    }

    setTimeout(() => {
        resultOverlay.classList.add('show');
    }, 300);
}

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', () => {
    drawCount = 0;
    initGame();
});

playAgainBtn.addEventListener('click', () => {
    initGame();
});

savePointsBtn.addEventListener('click', () => {
    // Redirigir a guardar puntos
    window.location.href = `/dashboard/gamepoints?id=${getUserId()}&points=${gamePoints}&gameId=3`;
});

backBtn.addEventListener('click', () => {
    // Redirigir a guardar 0 puntos (gastar intento)
    window.location.href = `/dashboard/gamepoints?id=${getUserId()}&points=0&gameId=3`;
});

// Obtener ID del usuario de la URL
function getUserId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

// Iniciar juego
initGame();
