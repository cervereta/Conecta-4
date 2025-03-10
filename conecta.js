// Variables del juego
let currentPlayer = 'red'; // Comienza el jugador rojo
const board = Array(6).fill().map(() => Array(7).fill(null)); // Tablero 6x7 vacío
let winningCells = []; // Guardar las celdas ganadoras

// Función para inicializar el juego
function initGame() {
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        cell.addEventListener('click', handleClick);
        cell.style.cursor = 'pointer';
    });
    updatePlayerIndicator(); // Actualizar indicador de turno al iniciar
}

// Manejar el clic en una celda
function handleClick(event) {
    const cell = event.target;
    const col = Array.from(cell.parentNode.children).indexOf(cell); // Obtener columna
    const row = dropPiece(col); // Encontrar fila disponible
    
    if (row !== -1) { // Si hay espacio en la columna
        const targetCell = document.querySelectorAll('tr')[row].children[col];
        targetCell.style.backgroundColor = currentPlayer;
        board[row][col] = currentPlayer;
        
        if (checkWin(row, col)) {
            highlightWinningMove(); // Resaltar jugada ganadora
            showWinnerAnnouncement(`¡El jugador ${currentPlayer === 'red' ? 'Rojo' : 'Azul'} ha ganado!`);
            setTimeout(resetGame, 3000); // Reiniciar tras 3 segundos
            return;
        }
        
        if (isBoardFull()) {
            showWinnerAnnouncement('¡Empate!');
            setTimeout(resetGame, 3000);
            return;
        }
        
        currentPlayer = currentPlayer === 'red' ? 'blue' : 'red';
        updatePlayerIndicator(); // Actualizar indicador de turno
    }
}

// Encontrar la fila más baja disponible en una columna
function dropPiece(col) {
    for (let row = 5; row >= 0; row--) {
        if (!board[row][col]) {
            return row;
        }
    }
    return -1; // Columna llena
}

// Comprobar si hay victoria y guardar las celdas ganadoras
function checkWin(row, col) {
    const directions = [
        [0, 1],  // Horizontal
        [1, 0],  // Vertical
        [1, 1],  // Diagonal \
        [1, -1]  // Diagonal /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1;
        let cells = [[row, col]]; // Guardar celdas de la línea ganadora
        
        // Dirección positiva
        for (let i = 1; i < 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            if (isValidCell(newRow, newCol) && board[newRow][newCol] === currentPlayer) {
                count++;
                cells.push([newRow, newCol]);
            } else {
                break;
            }
        }
        // Dirección negativa
        for (let i = 1; i < 4; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            if (isValidCell(newRow, newCol) && board[newRow][newCol] === currentPlayer) {
                count++;
                cells.push([newRow, newCol]);
            } else {
                break;
            }
        }
        if (count >= 4) {
            winningCells = cells; // Guardar las celdas ganadoras
            return true;
        }
    }
    return false;
}

// Verificar si la celda es válida
function isValidCell(row, col) {
    return row >= 0 && row < 6 && col >= 0 && col < 7;
}

// Verificar si el tablero está lleno
function isBoardFull() {
    return board.every(row => row.every(cell => cell !== null));
}

// Reiniciar el juego
function resetGame() {
    board.forEach(row => row.fill(null));
    document.querySelectorAll('td').forEach(cell => {
        cell.style.backgroundColor = 'white';
        cell.classList.remove('winning-cell'); // Quitar clase de ganador
    });
    currentPlayer = 'red';
    winningCells = [];
    updatePlayerIndicator();
    document.getElementById('winner-announcement')?.remove(); // Eliminar anuncio
}

// Actualizar el indicador de turno
function updatePlayerIndicator() {
    const redButton = document.getElementById('red-player');
    const blueButton = document.getElementById('blue-player');
    redButton.classList.toggle('active', currentPlayer === 'red');
    blueButton.classList.toggle('active', currentPlayer === 'blue');
}

// Resaltar la jugada ganadora
function highlightWinningMove() {
    winningCells.forEach(([row, col]) => {
        const cell = document.querySelectorAll('tr')[row].children[col];
        cell.classList.add('winning-cell');
    });
}

// Mostrar anuncio vistoso del ganador
function showWinnerAnnouncement(message) {
    const announcement = document.createElement('div');
    announcement.id = 'winner-announcement';
    announcement.textContent = message;
    announcement.style.position = 'fixed';
    announcement.style.top = '50%';
    announcement.style.left = '50%';
    announcement.style.transform = 'translate(-50%, -50%)';
    announcement.style.backgroundColor = currentPlayer === 'red' ? '#ff4444' : '#4444ff';
    announcement.style.color = 'white';
    announcement.style.padding = '20px 40px';
    announcement.style.fontSize = '2em';
    announcement.style.borderRadius = '10px';
    announcement.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    announcement.style.zIndex = '1000';
    announcement.style.animation = 'pulse 1s infinite';
    document.body.appendChild(announcement);
}

// Iniciar el juego cuando la página cargue
window.addEventListener('load', initGame);