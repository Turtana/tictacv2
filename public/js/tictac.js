"use strict";

// Returns whoever has won and 0 if neither
function checkThree (a, b, c) {
    if ((a === b) && (a === c)) {
        if (a === 1) {
            return 1;
        } else if (a === 2) {
            return 2;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

function checkWin (board) {

    // horizontal lines
    for (let i = 0; i < 3; i++) {
        if (checkThree(board[i][0], board[i][1], board[i][2]) !== 0) {
            return board[i][0];
        }
    }

    // vertical lines
    for (let i = 0; i < 3; i++) {
        if (checkThree(board[0][i], board[1][i], board[2][i]) !== 0) {
            return board[0][i];
        }
    }

    // diagonal lines
    if (checkThree(board[0][0], board[1][1], board[2][2]) !== 0) {
        return board[0][0];
    }
    if (checkThree(board[0][2], board[1][1], board[2][0]) !== 0) {
        return board[0][2];
    }

    // check if the board is full

    let draw = true;
    for (let i = 0; i < 3; i++) {
        for (let e = 0; e < 3; e++) {
            if (board[i][e] === 0) {
                draw = false;
            }
        }
    }
    if (draw) {
        return 3;
    }

    return 0;
}

function addMove (coordX, coordY, player) { // coordX, coordY (0-2)
    if (mainboard[coordY][coordX] === 0) {
        mainboard[coordY][coordX] = player;
        return 1;
    } else {
        return -1;
    }
}

function move (tileID) {
    let x = parseInt(tileID.slice(0,1));
    let y = parseInt(tileID.slice(1,2));
    if (addMove(y, x, activePlayer) === 1) {
        updateBoard (mainboard);
        let winCondition = checkWin(mainboard);
        if (winCondition === 1 || winCondition === 2) {
            updateInfo ("PELAAJA " + activePlayer + " VOITTAA!");
            freezeGame(true);
            return;
        } else if (winCondition === 3) {
            updateInfo ("TASAPELI!");
            freezeGame(true);
            return;
        }
        skipTurn();
    } else {
        updateInfo ("Pelaaja " + activePlayer + ", et voi asettaa tuohon")
    }
}

function reset() {
    mainboard = [[0,0,0],[0,0,0],[0,0,0]];
    updateBoard(mainboard);
    activePlayer = 1;
    updatePlayerInfo();
    freezeGame(false);
}

function updateBoard (board) {
    for (let i = 0; i < 3; i++) {
        for (let e = 0; e < 3; e++) {
            document.getElementById(i.toString() + e.toString()).innerHTML = board[i][e];
        }
    }
}

function readBoard () {
    let board = document.getElementById("bmessage").innerHTML;
    let b = board.split(",");

    return [[parseInt(b[0]),parseInt(b[1]),parseInt(b[2])],
            [parseInt(b[3]),parseInt(b[4]),parseInt(b[5])],
            [parseInt(b[6]),parseInt(b[7]),parseInt(b[8])]];
}

function freezeGame (yes) {
    for (let i = 0; i < 3; i++) {
        for (let e = 0; e < 3; e++) {
            document.getElementById(i.toString() + e.toString()).disabled = yes;
        }
    }
    document.getElementById("skip").disabled = yes;
}

function updateInfo (info) {
    document.getElementById("info").innerHTML = info;
}

function updatePlayerInfo () {
    updateInfo("Pelaajan " + activePlayer + " vuoro")
}

function skipTurn () {
    if (activePlayer == 1) {
        activePlayer = 2;
    } else {
        activePlayer = 1;
    }
    updatePlayerInfo();
}

function saveToMemory() {
    console.log("Saving current game...");

    (async () => {
        const rawResponse = await fetch('/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({board: mainboard})
        });
    })();
    console.log("Game saved.")
}



// Run these as the page starts

let mainboard = readBoard();
let activePlayer = 1;
updatePlayerInfo();

let vueboard = new Vue({
    el: '#vueboard',
    data: {
      board: mainboard
    }
})