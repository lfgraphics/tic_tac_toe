const cells = document.querySelectorAll('.box');
let cellArr = [...cells];

let currentPlayer = "X";
let playerIndicator = document.getElementById('player');

let gameStatus = "inProgress";

let XWinStatus = document.getElementById('XW');
let OWinStatus = document.getElementById('OW');
let DrawStatus = document.getElementById('Draw');

let audioBtn = document.getElementById('audioBtn');
let sfx = new Audio('clap.wav')

let aimodBtn = document.getElementById('cb3-8');
let aichance = false;
let aiWon = false;

let dontMoveNExt = false

let winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

let board = ['', '', '', '', '', '', '', '', ''];

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    playerIndicator.textContent = currentPlayer
}

function checkWin() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameStatus = `${board[a]} Won`;
            cellArr[a].classList.add("winning-cell");
            cellArr[b].classList.add("winning-cell");
            cellArr[c].classList.add("winning-cell");

            console.log(gameStatus);

            if (gameStatus === 'X Won') {
                XWinStatus.innerHTML = parseInt(XWinStatus.innerHTML) + 1;
            } else if (gameStatus === 'O Won') {
                OWinStatus.innerHTML = parseInt(OWinStatus.innerHTML) + 1;
            } else if (gameStatus === 'Draw') {
                DrawStatus.innerHTML = parseInt(DrawStatus.innerHTML) + 1;
            }

            if (!audioBtn.checked) {
                sfx.play();
            }

            setTimeout(() => {
                endGame();
            }, 2000);
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function endGame() {
    cellArr.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove("winning-cell");
    });
    board.fill('');
    gameStatus = "inProgress";
    aichance = false
    aiWon = false
}

function makeMove(cellIndex) {
    if (!aichance) {
        aichance = true
        if (cellArr[cellIndex] && board[cellIndex] === '' && gameStatus !== 'X Won' && gameStatus !== 'O Won') {
            board[cellIndex] = currentPlayer;
            cellArr[cellIndex].innerHTML = currentPlayer;

            if (checkWin()) {
                setTimeout(() => {
                    endGame();
                }, 3000);
            } else if (checkDraw()) {
                gameStatus = 'Draw';
                DrawStatus.innerHTML = parseInt(DrawStatus.innerHTML) + 1;
                endGame();
            } else {
                switchPlayer();
                if (aimodBtn.checked || aichance) {
                    makeAIMove(); // Trigger AI move when AI mode is enabled
                }
            }
        }
    } else if (aiWon && aichance && dontMoveNExt) {
        dontMoveNExt = false;
        const emptyCells = board.map((cell, index) => (cell === '' ? index : -1)).filter(cellIndex => cellIndex !== -1);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        makeMove(emptyCells[randomIndex]);
        return;
    } else if (aichance && !dontMoveNExt) {
        aichance = false
        aiWon = false
        dontMoveNExt = false
        if (cellArr[cellIndex] && board[cellIndex] === '' && gameStatus !== 'X Won' && gameStatus !== 'O Won') {
            board[cellIndex] = currentPlayer;
            cellArr[cellIndex].innerHTML = currentPlayer;

            if (checkWin()) {
                setTimeout(() => {
                    endGame();
                }, 3000);
                setTimeout(() => {
                    // endGame();
                    makeAIMove()
                    aiWon = true;
                    aichance = true;
                    dontMoveNExt = true;
                }, 3500);
            } else if (checkDraw()) {
                gameStatus = 'Draw';
                DrawStatus.innerHTML = parseInt(DrawStatus.innerHTML) + 1;
                endGame();
            } else {
                switchPlayer();
            }
        }
    }
}

function makeAIMove() {
    // Step 1: Check for winning moves for AI
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            board[a] === currentPlayer &&
            board[a] === board[b] &&
            board[c] === ''
        ) {
            makeMove(c);
            aichance = false;
            return;
        } else if (
            board[a] === currentPlayer &&
            board[a] === board[c] &&
            board[b] === ''
        ) {
            makeMove(b);
            aichance = false;
            return;
        } else if (
            board[b] === currentPlayer &&
            board[b] === board[c] &&
            board[a] === ''
        ) {
            makeMove(a);
            aichance = false;
            return;
        }
    }

    // Step 2: Check for blocking opponent's winning moves
    const opponentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            board[a] === opponentPlayer &&
            board[a] === board[b] &&
            board[c] === ''
        ) {
            makeMove(c);
            return;
        } else if (
            board[a] === opponentPlayer &&
            board[a] === board[c] &&
            board[b] === ''
        ) {
            makeMove(b);
            return;
        } else if (
            board[b] === opponentPlayer &&
            board[b] === board[c] &&
            board[a] === ''
        ) {
            makeMove(a);
            return;
        }
    }

    // Step 3: Make a random move
    if (dontMoveNExt && aichance) {
        dontMoveNExt = false;
        aichance = false;
        const emptyCells = board.map((cell, index) => (cell === '' ? index : -1)).filter(cellIndex => cellIndex !== -1);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        makeMove(emptyCells[randomIndex]);
    } else {
        dontMoveNExt = false;
        const emptyCells = board.map((cell, index) => (cell === '' ? index : -1)).filter(cellIndex => cellIndex !== -1);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        makeMove(emptyCells[randomIndex]);
    }

}


cellArr.forEach((cell, index) => {
    cell.addEventListener('click', () => makeMove(index));
});

function reset(){
    endGame();
    currentPlayer = currentPlayer === 'O' ? 'X' : 'X'
    playerIndicator.textContent = currentPlayer;
    aiWon = false;
    aichance = false;
    dontMoveNExt = false;
}
document.getElementById('reset').addEventListener('click', reset)

playerIndicator.textContent = currentPlayer;

aimodBtn.addEventListener('click', reset)