// blue player input is 1
// red player input is 2
// let board = [
//   [0, 1, 2, 3, 4, 5, 6],
//   [7, 8, 9, 10, 11, 12, 13],
//   [14, 15, 16, 17, 18, 19, 20],
//   [21, 22, 23, 24, 25, 26, 27],
//   [28, 29, 30, 31, 32, 33, 34],
//   [35, 36, 37, 38, 39, 40, 41]
// ]; 

let board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

let currentPlayer = 'blue';
let currentValue = 'X';
let playMode = 'HUMAN';
let gameMode = 'HUMAN';
const winString1 = 'XXXX';
const winString2 = 'YYYY';
let moveCount = 1;
let boardCopy = [];
let iComp = 0;
let jComp = 0;

// function setInitValues(currentPlayer, currentValue, gameMode, playMode) {
//   console.log(currentPlayer, currentValue, gameMode, playMode);
//   currentPlayer = currentPlayer;
//   currentValue = currentValue;
//   gameMode = gameMode;
//   playMode = playMode;
// }

function nextMoveOptions(board) {
  let nextMoves = [];
  let maxVal = 6;

  let xIdx = 0;
  let yIdx = 0;
  board.forEach(function (boardRow) {
    boardCopy = boardCopy.concat(boardRow);
  });
  let newBoardCopy = [];
  newBoardCopy = newBoardCopy.concat(boardCopy);

  for (let i = 0; i < 7; i++) {
    let column = [];
    let delta = Math.floor(boardCopy.length / maxVal);
    for (let i = 0; i < boardCopy.length; i = i + delta) {
      column.push(boardCopy[i]);
      newBoardCopy.splice(newBoardCopy.indexOf(boardCopy[i]), 1);
    }
    boardCopy = [];
    boardCopy = boardCopy.concat(newBoardCopy);
    xIdx = column.indexOf('X');
    yIdx = column.indexOf('Y');
    if (xIdx == -1 && yIdx == -1) {
      nextMoves = nextMoves.concat(column[column.length - 1]);
    } else if (xIdx > 0 && yIdx > 0) {
      if (xIdx > yIdx) {
        nextMoves = nextMoves.concat(column[yIdx - 1]);
      } else {
        nextMoves = nextMoves.concat(column[xIdx - 1]);
      }
    } else if (xIdx < yIdx) {
      nextMoves = nextMoves.concat(column[yIdx - 1]);
    } else if (yIdx < xIdx) {
      nextMoves = nextMoves.concat(column[xIdx - 1]);
    }
  }
  return nextMoves;
}
function checkPlayMode(event, iPos, jPos) {

  if (playMode === 'AI') {
    startTurnAI();
  } else {
    startTurnHuman(event, iPos, jPos)
  }
}

function startTurnHuman(event, iPos, jPos) {
  console.log('starthuman');
  dropToBottom(iPos, board);
  checkStatus(winString1, winString2, 4, true);
  //nextMoveOptions();
  changePlayer();
  if (playMode == 'AI') {
    startTurnAI();
  }
}

function dropToBottom(iPos, board) {
  for (let j = board.length - 1; j > 0; j--) {

    //if ((board[j][iPos] !== 'X') && (board[j][iPos] !== 'Y')) {
    if (board[j][iPos] == '0') {
      board[j][iPos] = currentValue;
      updateBoard(j, iPos);
      return -1;
    }
  }
}
function checkStatus(str1, str2, len, isEndGame) {
  if (horizontalWin(str1, str2, isEndGame, len)) {
    return true;
  } else if (verticalWin(str1, str2, isEndGame, len)) {
    return true;
  } else if (diagonalWin(str1, str2, isEndGame, len)) {
    return true;
  }
  return false;
}
function diagonalWin(str1, str2, isEndGame, len) {
  // bottom-right
  let rowString = '';
  let count = 0;

  for (let i = 0; i < board[0].length; i++) {
    let iNew = i;
    for (let j = board.length - 1; j >= 0; j--) {
      if ((count < len) && (iNew < board[0].length)) { // -1
        rowString = rowString.concat(board[j][iNew]);
        count++;
      }
      if ((count == len) && hasWin(rowString, str1, str2, len)) {
        if (isEndGame) { endGame(); }
        iComp = iNew;
        jComp = j;
        return true;
      }
      iNew++;
    }
    rowString = '';
    count = 0;
  }
  // MUST FINISH!!
  //bottom-left
  for (let i = board[0].length - 1; i >= 0; i--) {
    let iNew = i;
    for (let j = board.length - 1; j >= 0; j--) {
      if ((count < len) && (iNew >= 0)) {
        rowString = rowString.concat(board[j][iNew]);
        count++;
      }
      if ((count == len) && hasWin(rowString, str1, str2)) {
        if (isEndGame) { endGame(); }
        iComp = iNew;
        jComp = j;
        return true;
      }
      iNew--;
    }
    rowString = '';
    count = 0;
  }
}
function hasWin(rowString, str1, str2, len) {
  let re1 = new RegExp(str1);
  let re2 = new RegExp(str2);
  let idx = 0;

  if (re1.test(rowString) == false) { // player 1 = no win
    if (re2.test(rowString) !== false) { // player 2 = win
      idx = re2.exec(rowString).index;
      iComp = rowString.charAt(idx);
      //if (iComp == 'X' || iComp == 'Y') {
      if (iComp == '0') {
        iComp = idx + len - 1;
      }
      return true;
    }
  } else { //player 1 = won
    iComp = re1.exec(rowString).index;
    return true;
  }

  // if (rowString.match(str1) == null) { // player 1 = no win
  //   if (rowString.match(str2) !== null) { // player 2 = win
  //     iComp = rowString.match(str2);
  //     return true;
  //   }
  // } else { //player 1 = won
  //   return true;
  // }
  return false;
}
function verticalWin(str1, str2, isEndGame, len) {
  for (let i = 0; i < board[0].length; i++) {
    let rowString = '';
    for (let j = board.length - 1; j >= 0; j--) {
      rowString = rowString.concat(board[j][i]);
    }

    if (hasWin(rowString, str1, str2, len)) {
      if (isEndGame) { endGame(); }
      iComp = i;
      jComp = j;
      return true;
    }
    rowString = '';
  }
}
function horizontalWin(str1, str2, isEndGame, len) {
  for (let j = board.length - 1; j >= 0; j--) {
    let rowString = board[j].join('');

    if (hasWin(rowString, str1, str2, len)) {
      if (isEndGame) { endGame(); }

      jComp = j;
      return true;
    }
    rowString = '';
  }
}

function endGame() {
  console.log('win');
  setTimeout(() => {
    document.querySelector(".win-text").innerText = "Winner!";
    document.querySelector(".win").style = "block";
    document.querySelector(".circle-box").style.display = "none";
  }, 2000);
}
function changePlayer() {
  moveCount++
  if (currentPlayer === 'blue') {
    currentPlayer = 'red';
    currentValue = 'Y';
  } else {
    currentPlayer = 'blue';
    currentValue = 'X';
  }
  if (gameMode == 'AI') {
    if (playMode === 'AI') {
      playMode = 'HUMAN';
    } else {
      playMode = 'AI';
    }
  }
}
function updateBoard(yPos, xPos) {
  let id = yPos + '-' + xPos;
  document.getElementById(id).classList.add('circle-' + currentPlayer);
  //document.querySelector('#' + id).classList.add('circle-red');
}

function generateBoard() {
  for (let i = 0; i < 6; i++) {
    let circleRow = document.createElement('div');
    circleRow.setAttribute('class', 'circle-row');
    for (let j = 0; j < 7; j++) {
      let circle = document.createElement('div');
      circle.setAttribute('class', 'circle');
      circle.setAttribute('id', i + '-' + j);
      circle.addEventListener('click', (event) => {
        checkPlayMode(event, j, i)
      });
      circleRow.appendChild(circle);
    }
    document.querySelector('.circle-box').appendChild(circleRow);
  }
}
let winPatterns = ['[0-9]XXX', 'XXX[0-9]'];
let deffPatterns = ['[0-9]YYY', 'YYY[0-9]', 'YY[0-9]', '[0-9]YY']
//1. check if AI has a winning move
//2. if not, play defensive
function startTurnAI() {
  let allMovesThisTurn = [];
  let hasWinPatterns = false;

  // Control the center moves
  if ((board[5][3]) == '0') {
    board[5][3] = currentValue;
    updateBoard(5, 3);
  } else if ((board[5][4]) == '0') {
    board[5][4] = currentValue;
    updateBoard(5, 4);
  } else if ((board[5][2]) == '0') {
    board[5][2] = currentValue;
    updateBoard(5, 2);
  } else {
    for (let i = 0; i < winPatterns.length; i = i + 2) {
      if (checkStatus(winPatterns[i], winPatterns[++i], 4, false)) {
        board[jComp][iComp] = currentValue;
        updateBoard(jComp, iComp);
        hasWinPatterns = true;
      }
    }

    if (!hasWinPatterns) {
      for (let i = 0; i < deffPatterns.length; i = i + 2) {
        let len = deffPatterns[i].length;
        let temp = i;

        if (checkStatus(deffPatterns[i], deffPatterns[++temp], len, false)) {
          board[jComp][iComp] = currentValue;
          updateBoard(jComp, iComp);
          hasWinPatterns = true;
        }
      }
    }

    if (!hasWinPatterns) {
      // AI Part
      // availableMoves = nextMoveOptions(board);
      // console.log(availableMoves);
      // for (let i = 0; i < availableMoves.length; i++) {
      //   let moveTested = boardCopy[availableMoves[i]];
      //   boardCopy[availableMoves[i]] = 'X';
      //   recall();

    }
  }

  checkStatus(winString1, winString2, 4, true);
  changePlayer();
}





//let offPatterns = ['[0-9]XXX[0-9]', 'XX'];
// to be commented?
// if (checkStatus('0111', '1110', false, 4)) { //Offensive Move
//   return -1;
// } else if (checkStatus('1011', '1101', false, 4)) {
//   return -1;
// }
// else { //Defensive Move
//   if (checkStatus('0222', '2220', false, 4)) { //Offensive Move
//     return -1;
//   } else if (checkStatus('2022', '2202', false, 4)) {
//     return -1;
//   } else if (checkStatus('022', '220', false, 3)) {
//     return -1;
//   } else if (checkStatus('202', '220', false, 3)) {
//     return -1;
//   } else {
//     let idx = Math.round(Math.random() * 7);
//     dropToBottom(idx, board);
//   }
// }



function checkPatterns(str) {
  let re = new RegExp(str);
  if (re.test(str) == null) { // no match
    return flase;
  } else { // match
    return true;
  }
}
function isSlotAvailable(jPos, iPos) {
  if (board[jPos][iPos] == '0') {
    return true;
  }
  return false;
}

function recall() {
  availableMoves = [];
  availableMoves = nextMoveOptions(boardCopy);
  console.log(availableMoves);
  // for (let i = 0; i < availableMoves.length; i++) {
  //   boardCopy[availableMoves[i]] = 'X';
  // }
  //(counter == 2) ? break : recall();
  // if (counter == 2) {
  //   break;
  // } else {
  //   recall();
  // }
}

generateBoard();

// application start

// hide the board
document.querySelector(".circle-box").style.display = "none";

document.querySelector(".against-ai").addEventListener("click", () => {
  document.querySelector(".player-choice").style.display = "none";
  document.querySelector(".circle-box").style.display = "block";
  //setInitValues('blue', 'X', 'AI', 'AI');
});

document.querySelector(".against-player").addEventListener("click", () => {
  document.querySelector(".player-choice").style.display = "none";
  document.querySelector(".circle-box").style.display = "block";
  //setInitValues('red', 'Y', 'HUMAN', 'HUMAN');

});
document.querySelector(".try-again").addEventListener("click", () => {
  window.location.reload();
});