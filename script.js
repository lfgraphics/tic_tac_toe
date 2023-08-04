// defining variables
const cells = document.querySelectorAll('.box');
let cellArr = [...cells];

let currentPlayer = "X";
let playerIndicator = document.getElementById('player');

let gameStatus = "inProgress";

let XWinStatus = document.getElementById('XW');
let OWinStatus = document.getElementById('OW');
let DrawStatus = document.getElementById('Draw');

let audioBtn = document.getElementById('audioBtn');

let sfx = new Audio('clap.wav');

let click = new Audio('click.mp3');


// aimode special variables
let aimodBtn = document.getElementById('cb3-8');
let extraMove;

// flags to check for ai have to move or not
let aichance = false;
let aiWon = false;
let dontMoveNExt = false

let winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

// board to check and make moves on the cells
let board = [cellArr[0].innerHTML, cellArr[1].innerHTML, cellArr[2].innerHTML, cellArr[3].innerHTML, cellArr[4].innerHTML, cellArr[5].innerHTML, cellArr[6].innerHTML, cellArr[7].innerHTML, cellArr[8].innerHTML]

// functions stratrup 
playerIndicator.textContent = currentPlayer;

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    playerIndicator.textContent = currentPlayer
}

function checkWin() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        // check this move was made by ai (ai winig or not) ai is not winig means player is winig so makeit win
        if (!aichance && !aimodBtn.checked) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameStatus = `${board[a]} Won`;
                cellArr[a].classList.add("winning-cell");
                cellArr[b].classList.add("winning-cell");
                cellArr[c].classList.add("winning-cell");

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

        // the player is losing and ai is winig so meke it defeat
        else if (!aichance) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameStatus = `${board[a]} Won`;
                cellArr[a].classList.add("losing-cell");
                cellArr[b].classList.add("losing-cell");
                cellArr[c].classList.add("losing-cell");

                if (gameStatus === 'X Won') {
                    XWinStatus.innerHTML = parseInt(XWinStatus.innerHTML) + 1;
                } else if (gameStatus === 'O Won') {
                    OWinStatus.innerHTML = parseInt(OWinStatus.innerHTML) + 1;
                } else if (gameStatus === 'Draw') {
                    DrawStatus.innerHTML = parseInt(DrawStatus.innerHTML) + 1;
                }

                setTimeout(() => {
                    endGame();
                }, 2000);
                return true;
            }
        }

        // this else if could be exta we have to check btw this isnot related to makeMove() so it's not responsible for blank cell bug
        else if (aichance) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameStatus = `${board[a]} Won`;
                cellArr[a].classList.add("winning-cell");
                cellArr[b].classList.add("winning-cell");
                cellArr[c].classList.add("winning-cell");
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
        cell.classList.remove("losing-cell");
    });
    board.fill('');
    gameStatus = "inProgress";
    aichance = false
    aiWon = false
}

function makeMove(cellIndex, e) {
    // taking e to try to debug empty cell with updated array an unupdated flags and player etc but it didn't resolved
    if (!aichance) {
        if (aimodBtn.checked) {
            aichance = true
        }
        if (cellArr[cellIndex] && board[cellIndex] === '' && gameStatus !== 'X Won' && gameStatus !== 'O Won' && e.target.innerHTML == '') {
            cellArr[cellIndex].innerHTML = currentPlayer;
            board[cellIndex] = currentPlayer;

            if (!audioBtn.checked) {
                click.play();
            }

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
                    makeAIMove();
                }
            }
        }
    } else if (aiWon && aichance && dontMoveNExt && aimodBtn.checked) {
        aiWon = false;
        dontMoveNExt = false;
        aichance = false;

        const emptyCells = '012345678';
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        makeMove(emptyCells[randomIndex]);

        let extraMove = currentPlayer === 'X' ? 'O' : 'X';
        let extramoveBox = board.indexOf(extraMove)
        if (extramoveBox !== '') {
            board[extraMove] = '';
        }
        switchPlayer()
        return;
    } else if (aichance && !dontMoveNExt && aimodBtn.checked) {
        aichance = false
        aiWon = false
        dontMoveNExt = false
        if (cellArr[cellIndex] && board[cellIndex] === '' && gameStatus !== 'X Won' && gameStatus !== 'O Won') {
            board[cellIndex] = currentPlayer;
            if (checkWin()) {
                setTimeout(() => {
                    endGame();
                }, 3000);
                setTimeout(() => {
                    makeFirstAIMove();
                }, 3100);
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

function makeFirstAIMove() {
    aichance = false
    const emptyCells = '012345678';
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    makeMove(emptyCells[randomIndex]);

    // there was an issure withe the AI move ai wasmaking to moves so I tried to prevent/ undo that extra move and this worked
    let extraMove = currentPlayer === 'X' ? 'O' : 'X';
    let extramoveBox = board.indexOf(extraMove)
    if (extramoveBox !== '') {
        board[extraMove] = '';
    }
    switchPlayer()
}

function makeAIMove() {
    if (aimodBtn.checked && aichance) {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            // first checking if AI can win by it's move if yes, so make move to win
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

        // if not then check if physical player can win, so try to block his win
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
        // if neither found then make a random move
        if (aichance) {
            const emptyCells = board.map((cell, index) => (cell === '' ? index : -1)).filter(cellIndex => cellIndex !== -1);
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            makeMove(emptyCells[randomIndex]);
        } else {
            return;
        }
    }

}

function reset() {
    endGame();
    currentPlayer = currentPlayer === 'O' ? 'X' : 'X'
    playerIndicator.textContent = currentPlayer;
    aiWon = false;
    aichance = false;
    dontMoveNExt = false;
}

// adding evenListeners and function calls

cellArr.forEach((cell, index) => {
    cell.addEventListener('click', () => makeMove(index));
});

document.getElementById('reset').addEventListener('click', reset)

aimodBtn.addEventListener('click', reset);


// installation of wpa
let deferredPrompt;
const customInstallPrompt = document.getElementById('custom-install-prompt');
const installButton = document.getElementById('installButton');

const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

const isAppInstalled = localStorage.getItem('isAppInstalled') === 'true';

window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredPrompt = event;
    if (isAppInstalled || isStandalone) {
        customInstallPrompt.style.display = 'none';
    } else {
        customInstallPrompt.style.display = 'block';
    }
});

function installApp() {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function (choiceResult) {
        deferredPrompt = null;
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
            localStorage.setItem('isAppInstalled', 'true');
            customInstallPrompt.style.display = 'none';
        } else {
            console.log('User dismissed the install prompt');
        }
    });
}