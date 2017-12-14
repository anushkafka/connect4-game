// blue player input is 1
// red player input is 2
let board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];
let currentPlayer = 'blue';
let currentValue = 1;
const gameMode = 'AI';
let playMode = 'AI'
let winString1 = '1111';
let winString2 = '2222';
let iComp = 0;
let jComp = 0;
function checkPlayMode(event, iPos, jPos) {
  if (playMode === 'AI') {
    startTurnAI();
  } else {
    startTurnHuman(event, iPos, jPos)
  }
}

function startTurnHuman(event, iPos, jPos) {
  console.log(playMode);
  dropToBottom(iPos, board);
  checkStatus(winString1, winString2, 4, true);
  changePlayer();
  if (gameMode == 'AI') {
    startTurnAI();
  }
}

function dropToBottom(iPos, board) {
  for (let j = board.length - 1; j > 0; j--) {

    if (board[j][iPos] == '0') {
      board[j][iPos] = currentValue;
      updateBoard(j, iPos);
      return -1;
    }
  }
}
function checkStatus(str1, str2, len, isEndGame) {
  if (horizontalWin(str1, str2, isEndGame)) {
    return true;
  } else if (verticalWin(str1, str2, isEndGame)) {
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
      if ((count < len) && (iNew < board[0].length - 1)) {
        rowString = rowString.concat(board[j][iNew]);
        count++;
      }
      if ((count == len) && hasWin(rowString, str1, str2)) {
        if (isEndGame) { endGame(); }
        iComp = iNew;
        jComp = j;

        if (isSlotAvailable(jComp, iComp)) {
          board[jComp][iComp] = currentValue;
          updateBoard(jComp, iComp);
        } else {
          for (let x = 0; x < 4; x++) {
            jComp++; iComp++;
            if (board[jComp][iComp]) {
              board[jComp][iComp] = currentValue;
              updateBoard(jComp, iComp);
            }
          }
        }
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

        console.log('have to complete ', jComp, iComp);
        return true;
      }
      iNew--;
    }
    rowString = '';
    count = 0;
  }
}
function hasWin(rowString, str1, str2) {
  if (rowString.match(str1) == null) { // player 1 = no win
    if (rowString.match(str2) !== null) { // player 2 = win
      iComp = rowString.match(str2);
      return true;
    }
  } else { //player 1 = won
    return true;
  }
  return false;
}
function verticalWin(str1, str2, isEndGame) {
  for (let i = 0; i < board[0].length; i++) {
    let rowString = '';
    for (let j = board.length - 1; j >= 0; j--) {
      rowString = rowString.concat(board[j][i]);
    }

    if (hasWin(rowString, str1, str2)) {
      if (isEndGame) { endGame(); }
      iComp = i;
      jComp = board.length - 1;
      if (isSlotAvailable(jComp, iComp)) {
        board[jComp][iComp] = currentValue;
        updateBoard(jComp, iComp);
      } else {
        for (let x = 0; x < 4; x++) {
          jComp++;
          if (board[jComp][iComp]) {
            board[jComp][iComp] = currentValue;
            updateBoard(jComp, iComp);
          }
        }
      }
      return true;
    }
    rowString = '';
  }
}
function horizontalWin(str1, str2, isEndGame) {
  for (let j = board.length - 1; j >= 0; j--) {
    let rowString = board[j].join('');

    if (hasWin(rowString, str1, str2)) {
      if (isEndGame) { endGame(); }
      jComp = j;
      iComp = 0;
      if (isSlotAvailable(jComp, iComp)) {
        board[jComp][iComp] = currentValue;
        updateBoard(jComp, iComp);
      } else {
        for (let x = 0; x < 4; x++) {
          iComp++;
          if (board[jComp][iComp]) {
            board[jComp][iComp] = currentValue;
            updateBoard(jComp, iComp);
          }
        }
      }
      return true;
    }
    rowString = '';
  }
}

function endGame() {
  console.log('win');
}
function changePlayer() {
  if (currentPlayer === 'blue') {
    currentPlayer = 'red';
    currentValue = 2;
  } else {
    currentPlayer = 'blue';
    currentValue = 1;
  }
  if (playMode === 'AI') {
    playMode = 'HUMAN';
  } else {
    playMode = 'AI';
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

let openPositions = [];
let openPosition = [];
function findOpenPositions() {
  let boardCopy = [];
  boardCopy = boardCopy.concat(board);
  for (let j = board.length - 1; j >= 0; j--) {
    if (board[j].indexOf('0') == ! -1) {
      for (let i = 0; i < board[0].length; i++) {
        if (boardCopy[j][i] == '0') {
          openPosition[0] = i;
          openPosition[1] = j;
          openPositions = openPositions.concat(openPosition);
          openPosition = [];
          dropToBottom(i, boardCopy);
          checkStatus(len);
        }
      }
    }
  }
}
//1. check if AI has a winning move
//2. if not, play defensive
function startTurnAI() {
  console.log(playMode);
  // Control the center moves
  if (board[5][3] == '0') {
    board[5][3] = currentValue;
    updateBoard(5, 3);
  } else if (board[5][4] == '0') {
    board[5][4] = currentValue;
    updateBoard(5, 4);
  } else if (board[5][2] == '0') {
    board[5][2] = currentValue;
    updateBoard(5, 2);
  } else if (board[5][2] == '1') {
    board[4][2] = currentValue;
    updateBoard(4, 2);
  } else if (board[5][4] == '1') {
    board[4][4] = currentValue;
    updateBoard(4, 4);
  }
  else if (checkStatus('0111', '1110', false, 4)) { //Offensive Move
    return -1;
  } else if (checkStatus('1011', '1101', false, 4)) {
    return -1;
  }
  else { //Defensive Move
    if (checkStatus('0222', '2220', false, 4)) { //Offensive Move
      return -1;
    } else if (checkStatus('2022', '2202', false, 4)) {
      return -1;
    } else if (checkStatus('022', '220', false, 3)) {
      return -1;
    } else if (checkStatus('202', '220', false, 3)) {
      return -1;
    } else {
      let idx = Math.round(Math.random() * 7);
      dropToBottom(idx, board);
    }
  }
  changePlayer();
}
function isSlotAvailable(jPos, iPos) {
  if (board[jPos][iPos] == '0') {
    return true;
  }
  return false;
}

generateBoard();