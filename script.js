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

let aimodBtn = document.getElementById('cb3-8');
let aichance = false;
let aiWon = false;

let dontMoveNExt = false

let winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

let board = [cellArr[0].innerHTML, cellArr[1].innerHTML, cellArr[2].innerHTML, cellArr[3].innerHTML, cellArr[4].innerHTML, cellArr[5].innerHTML, cellArr[6].innerHTML, cellArr[7].innerHTML, cellArr[8].innerHTML]

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    playerIndicator.textContent = currentPlayer
}

function checkWin() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

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
    if (!aichance) {
        if (aimodBtn.checked) {
            aichance = true
        }
        if (cellArr[cellIndex] && board[cellIndex] === '' && gameStatus !== 'X Won' && gameStatus !== 'O Won' && e.target.innerHTML =='') {
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
                    makeAIMove(); // Trigger AI move when AI mode is enabled
                }
            }
        }
    } else if (aiWon && aichance && dontMoveNExt && aimodBtn.checked) {
        aiWon = false;
        dontMoveNExt = false;
        aichance = false;
        const emptyCells = '12345678';
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        makeMove(emptyCells[randomIndex]);
        // let currentboard = [cellArr[0].innerHTML, cellArr[1].innerHTML, cellArr[2].innerHTML, cellArr[3].innerHTML, cellArr[4].innerHTML, cellArr[5].innerHTML, cellArr[6].innerHTML, cellArr[7].innerHTML, cellArr[8].innerHTML]
        let extraMove = currentPlayer === 'X' ? 'O' : 'X';
        let extramoveBox = board.indexOf(extraMove)
        if (extramoveBox !== '') {
            board[extraMove] = '';
            // cellArr[extramoveBox].innerHTML = '';
        }
        switchPlayer()
        return;
    } else if (aichance && !dontMoveNExt && aimodBtn.checked) {
        aichance = false
        aiWon = false
        dontMoveNExt = false
        if (cellArr[cellIndex] && board[cellIndex] === '' && gameStatus !== 'X Won' && gameStatus !== 'O Won') {
            board[cellIndex] = currentPlayer;
            // cellArr[cellIndex].innerHTML = currentPlayer;

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


let extraMove;
function makeFirstAIMove() {
    aichance = false
    const emptyCells = '12345678';
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    makeMove(emptyCells[randomIndex]);
    // let currentboard = [cellArr[0].innerHTML, cellArr[1].innerHTML, cellArr[2].innerHTML, cellArr[3].innerHTML, cellArr[4].innerHTML, cellArr[5].innerHTML, cellArr[6].innerHTML, cellArr[7].innerHTML, cellArr[8].innerHTML]
    let extraMove = currentPlayer === 'X' ? 'O' : 'X';
    let extramoveBox = board.indexOf(extraMove)
    if (extramoveBox !== '') {
        board[extraMove] = '';
        // cellArr[extramoveBox].innerHTML = '';
    }
    switchPlayer()
}

function makeAIMove() {
    if (aimodBtn.checked && aichance) {
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
        if (aichance) {
            // dontMoveNExt = false;
            // aichance = false;
            const emptyCells = board.map((cell, index) => (cell === '' ? index : -1)).filter(cellIndex => cellIndex !== -1);
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            makeMove(emptyCells[randomIndex]);
        } else {
            return;
            // dontMoveNExt = false;
            // const emptyCells = board.map((cell, index) => (cell === '' ? index : -1)).filter(cellIndex => cellIndex !== -1);
            // const randomIndex = Math.floor(Math.random() * emptyCells.length);
            // makeMove(emptyCells[randomIndex]);
        }
    }

}


cellArr.forEach((cell, index) => {
    cell.addEventListener('click', () => makeMove(index));
});

function reset() {
    endGame();
    currentPlayer = currentPlayer === 'O' ? 'X' : 'X'
    playerIndicator.textContent = currentPlayer;
    aiWon = false;
    aichance = false;
    dontMoveNExt = false;
}
document.getElementById('reset').addEventListener('click', reset)

playerIndicator.textContent = currentPlayer;

aimodBtn.addEventListener('click', reset);

let deferredPrompt;
const customInstallPrompt = document.getElementById('custom-install-prompt');
const installButton = document.getElementById('installButton');

// Check if the app is running in standalone mode
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

// Check if the app has been installed
const isAppInstalled = localStorage.getItem('isAppInstalled') === 'true';

window.addEventListener('beforeinstallprompt', function (event) {
    // Prevent the default browser prompt
    event.preventDefault();
    // Save the event for later use
    deferredPrompt = event;

    // Hide the custom install prompt if the app is installed or running in standalone mode
    if (isAppInstalled || isStandalone) {
        customInstallPrompt.style.display = 'none';
    } else {
        customInstallPrompt.style.display = 'block';
    }
});

function installApp() {
    // Trigger the deferred prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then(function (choiceResult) {
        // Reset the deferred prompt variable
        deferredPrompt = null;

        // Optionally, you can handle the user's choice here
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
            // Set the app installation flag in localStorage
            localStorage.setItem('isAppInstalled', 'true');
            // Hide the custom install prompt
            customInstallPrompt.style.display = 'none';
        } else {
            console.log('User dismissed the install prompt');
        }
    });
}