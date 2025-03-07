// Variables del juego
let currentPlayer = 'red'; // Comienza el jugador rojo
const board = Array(6).fill().map(() => Array(7).fill(null)); // Tablero 6x7 vacío

// Función para inicializar el juego
function initGame() {
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        cell.addEventListener('click', handleClick);
        cell.style.cursor = 'pointer';
    });
}

// Manejar el clic en una celda
function handleClick(event) {
    const cell = event.target;
    const col = Array.from(cell.parentNode.children).indexOf(cell); // Obtener columna
    const row = dropPiece(col); // Encontrar fila disponible
    
    if (row !== -1) { // Si hay espacio en la columna
        // Actualizar la celda visual correspondiente (la más baja disponible)
        const targetCell = document.querySelectorAll('tr')[row].children[col];
        targetCell.style.backgroundColor = currentPlayer;
        board[row][col] = currentPlayer; // Actualizar tablero lógico
        
        if (checkWin(row, col)) {
            setTimeout(() => alert(`¡El jugador ${currentPlayer === 'red' ? 'Rojo' : 'Azul'} ha ganado!`), 100);
            resetGame();
            return;
        }
        
        if (isBoardFull()) {
            setTimeout(() => alert('¡Empate!'), 100);
            resetGame();
            return;
        }
        
        // Cambiar turno
        currentPlayer = currentPlayer === 'red' ? 'blue' : 'red';
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

// Comprobar si hay victoria
function checkWin(row, col) {
    const directions = [
        [0, 1],  // Horizontal
        [1, 0],  // Vertical
        [1, 1],  // Diagonal \
        [1, -1]  // Diagonal /
    ];
    
    for (let [dx, dy] of directions) {
        let count = 1;
        // Contar en dirección positiva
        for (let i = 1; i < 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            if (isValidCell(newRow, newCol) && board[newRow][newCol] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        // Contar en dirección negativa
        for (let i = 1; i < 4; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            if (isValidCell(newRow, newCol) && board[newRow][newCol] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 4) return true;
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
    });
    currentPlayer = 'red';
}

// Iniciar el juego cuando la página cargue
window.addEventListener('load', initGame);