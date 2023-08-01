const cells = document.querySelectorAll('.box');
let cellArr = [...cells];
let currentPlayer = "X";
let gameStatus = "inProgress";

const trackCells = () => ({
    1: cells[0].innerHTML,
    2: cells[1].innerHTML,
    3: cells[2].innerHTML,
    4: cells[3].innerHTML,
    5: cells[4].innerHTML,
    6: cells[5].innerHTML,
    7: cells[6].innerHTML,
    8: cells[7].innerHTML,
    9: cells[8].innerHTML,
});

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

const board = ['', '', '', '', '', '', '', '', ''];



function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWin() {

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameStatus = `${board[a]} Won`;
            cellArr[a].classList.add("winning-cell");
            cellArr[b].classList.add("winning-cell");
            cellArr[c].classList.add("winning-cell");
            setTimeout(() => {
                alert(gameStatus);
                endGame();
            }, 2000)
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
}


function makeMove(cellIndex) {
    if (board[cellIndex] === '') {
        board[cellIndex] = currentPlayer;
        cellArr[cellIndex].innerHTML = currentPlayer;

        if (checkWin()) {
            setTimeout(() => {
                endGame();
            }, 3000)
        } else if (checkDraw()) {

            endGame();

        } else {
            switchPlayer();
        }
    }
}



cellArr.forEach((cell, index) => {
    cell.addEventListener('click', () => makeMove(index));
});


let XW = document.getElementById('XW')
XW.innerHTML = parseInt(XW.innerHTML) + 1
// Number(document.getElementById('XW').textContent) +1