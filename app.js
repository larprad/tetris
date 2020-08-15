//--------------------------------//
//------------ TETRIS ------------//
//--------------------------------//

//---------------------------------------------------------

import createTetrominoes from './modules/tetrominoes';

/////////////////
// GLOBAL VARS //
/////////////////

let blockSize = 30;
let rows = 20;
let columns = 12;
let speed = 500;
let gameStatut = 'notStarted';
let gameScore = 0;

let timerId;
let blocks;
let currentPosition;
let rotationIndex;
let currentTetromino;
let tetrominoNumber;
let theTetrominoes;

//---------------------------------------------------------

//////////////////
// INIT SCRIPTS //
//////////////////

displayInitialConfiguration(blockSize, columns, rows);
generatePlaygroundGrid(blockSize, columns, rows);
enableConfigurationPanel(true);

//---------------------------------------------------------

//////////////
// COMMANDS //
//////////////

function startGame() {
  if (gameStatut === 'notStarted') {
    console.log('new game is starting');
    gameScore = 0;
    score(0);
    initTetromino();
    enableConfigurationPanel(false);
    draw();
  }
  if (gameStatut === 'pause' || gameStatut === 'notStarted') {
    timerId = setInterval(moveDown, speed);
    document.getElementById('startButton').innerHTML = 'Pause Game';
    gameStatut = 'play';
  } else {
    console.log('game is pausing');
    pauseGame();
  }
}

function pauseGame() {
  gameStatut = 'pause';
  document.getElementById('startButton').innerHTML = 'Resume';
  clearInterval(timerId);
}

function reset() {
  cleanPlaygroundGrid();
  generatePlaygroundGrid(blockSize, columns, rows);
  initTetromino();
  pauseGame();
  gameStatut = 'notStarted';
  enableConfigurationPanel(true);
  gameScore = 0;
  score(0);
  document.getElementById('startButton').innerHTML = 'Start Game';
  console.log('game have been reseted');
}

function score(lines) {
  const addedScore = lines * lines * 10;
  gameScore += addedScore;
  document.getElementById('score').innerHTML = gameScore;
}

//---------------------------------------------------------

////////////////
// PLAYGROUND //
////////////////

// init Tetromino
function initTetromino() {
  console.log('init new tetromino');
  gameStatut === 'notStarted' ? (theTetrominoes = createTetrominoes(columns)) : null;
  currentPosition = Math.floor(columns / 2 - 1);
  tetrominoNumber = Math.floor(Math.random() * theTetrominoes.length);
  console.log('tetromino number', tetrominoNumber);
  rotationIndex = Math.floor(Math.random() * theTetrominoes[tetrominoNumber].length);
  currentTetromino = theTetrominoes[tetrominoNumber][rotationIndex];
}

// draw the tetromino while in play
function draw() {
  currentTetromino.forEach((index) => {
    blocks[currentPosition + index].classList.add('tetromino');
    blocks[currentPosition + index].classList.add('colorT' + tetrominoNumber.toString());
  });
}

// draw a new tetromino that will start on the top
function drawNew() {
  initTetromino();
  draw();
}

//undraw the current tetromino
function undraw() {
  currentTetromino.forEach((index) => {
    blocks[currentPosition + index].classList.remove('tetromino');
    blocks[currentPosition + index].classList.remove(
      'colorT0',
      'colorT1',
      'colorT2',
      'colorT3',
      'colorT4',
      'colorT5',
      'colorT6'
    );
  });
}

//make the current tetromino move down
function moveDown() {
  if (freeze()) {
    const lineToDelete = lineIsMade();
    deleteLine(lineToDelete);
    score(lineToDelete.length);
    drawNew();
  } else {
    undraw();
    currentPosition += columns;
    draw();
  }
}

function moveLeft() {
  const isAtLeftEdge = currentTetromino.some((index) => {
    return (index + currentPosition) % columns === 0;
  });
  if (!isAtLeftEdge && !lateralBlock('left')) {
    undraw();
    currentPosition--;
    draw();
  } else {
    console.log('left boudary prevents tetromino movement');
  }
}

function pushDown() {
  if (!freeze()) {
    undraw();
    currentPosition += columns;
    draw();
  } else {
    console.log('bottom boudary prevents tetromino movement');
  }
}

function moveRight() {
  const isAtRightEdge = currentTetromino.some((index) => {
    return (index + currentPosition + 1) % columns === 0;
  });
  if (!isAtRightEdge && !lateralBlock('right')) {
    undraw();
    currentPosition++;
    draw();
  } else {
    console.log('right boudary prevents tetromino movement');
  }
}

// rotate domino and check that nothing is on the way (should be updated to make it smoother)
function rotateTetromino(direction) {
  let tempRotationIndex = rotationIndex;
  direction === 'right' ? tempRotationIndex++ : tempRotationIndex--;
  tempRotationIndex >= theTetrominoes[tetrominoNumber].length ? (tempRotationIndex = 0) : null;
  tempRotationIndex < 0 ? (tempRotationIndex = theTetrominoes[tetrominoNumber].length - 1) : null;
  // testing boudaries
  const tempTetromino = theTetrominoes[tetrominoNumber][tempRotationIndex];
  const willTouchLimits = tempTetromino.some((index) => {
    return blocks[currentPosition + index + columns].classList.contains('taken');
  });

  const isAtRightEdge = tempTetromino.some((index) => {
    return (index + currentPosition) % columns === 0;
  });

  const isAtLeftEdge = tempTetromino.some((index) => {
    return (index + currentPosition + 1) % columns === 0;
  });
  if (willTouchLimits || (isAtRightEdge && isAtLeftEdge)) {
    console.log('rotation not possible due to boudaries conflict');
    // try again?
  } else {
    undraw();
    currentTetromino = tempTetromino;
    rotationIndex = tempRotationIndex;
    draw();
  }
}
// when the current tetromino encouters a boundary it will freeze and become part of the boudaries.
function freeze() {
  const freezeCondition = currentTetromino.some((index) =>
    blocks[currentPosition + index + columns].classList.contains('taken')
  );
  if (freezeCondition) {
    console.log('TOUCH DOWN! new tetromino in the way');
    currentTetromino.forEach((index) => {
      blocks[index + currentPosition].classList.add('taken');
    });
    return true;
  }
  return false;
}

function lateralBlock(side) {
  let checkSide;
  side === 'right' ? (checkSide = 1) : (checkSide = -1);
  return currentTetromino.some((index) =>
    blocks[currentPosition + index + checkSide].classList.contains('taken')
  );
}

function lineIsMade() {
  let checkLine = [];
  let lineToDelete = [];
  for (let i = 0; i < columns; i++) {
    checkLine.push(i);
  }
  for (let i = 0; i < rows; i++) {
    const lineTaken = checkLine.every((index) => {
      return blocks[i * columns + index].classList.contains('taken');
    });
    lineTaken ? lineToDelete.push(i) : null;
  }
  console.log('line complete', lineToDelete);
  return lineToDelete;
}

function deleteLine(lineArray) {
  for (let j = 0; j < lineArray.length; j++) {
    let saveUpperBlockStyle = [];
    console.log(`deleting line ${lineArray[j]}`);
    for (let i = 0; i < lineArray[j] * columns; i++) {
      saveUpperBlockStyle.push(blocks[i].className);
      blocks[i].className = 'playgroundBlock';
    }
    for (let i = 0; i < lineArray[j] * columns; i++) {
      let bottomCheck = blocks[i + columns].className;
      !bottomCheck.includes('playgroundBottom')
        ? (blocks[i + columns].className = saveUpperBlockStyle[i])
        : null;
    }
  }
}

//---------------------------------------------------------

////////////////////
// GAME FUNCTIONS //
////////////////////

// display initial configuration on inputs elements in the configuration panel
function displayInitialConfiguration(blockSize, columns, rows) {
  document.getElementById('rowNumber').value = rows;
  document.getElementById('columnNumber').value = columns;
  document.getElementById('blockSize').value = blockSize;
  document.getElementById('blockSpeed').value = speed / 100;
}

function enableConfigurationPanel(bool) {
  document.getElementById('rowNumber').disabled = !bool;
  document.getElementById('columnNumber').disabled = !bool;
  document.getElementById('blockSize').disabled = !bool;
  document.getElementById('blockSpeed').disabled = !bool;
}

// init playground divs
function generatePlaygroundGrid(blocksWidth, playgroundColumns, playgroundRows) {
  console.log('generating playground blocks');
  const playground = document.getElementById('playground');
  const root = document.querySelector('html');
  root.style.setProperty('--columns', playgroundColumns);
  root.style.setProperty('--rows', playgroundRows);
  root.style.setProperty('--block-width', blocksWidth + 'px');
  const numberOfBlocks = playgroundRows * playgroundColumns;
  for (let i = 0; i < numberOfBlocks; i++) {
    let div = document.createElement('div');
    div.className = 'playgroundBlock';
    // div.innerHTML = i;
    playground.appendChild(div);
  }
  for (let i = 0; i < playgroundColumns; i++) {
    let div = document.createElement('div');
    div.className = 'playgroundBottom taken';
    playground.appendChild(div);
  }
  blocks = Array.from(document.querySelectorAll('.grid div'));
  console.log(`${numberOfBlocks} blocks have been generated`);
}

// delete all divs from the playground
function cleanPlaygroundGrid() {
  const playground = document.getElementById('playground');
  while (playground.firstChild) {
    playground.removeChild(playground.firstChild);
  }
}

// updating global variables blockSize, rows & columns
function updateGameConfiguration() {
  const newRowNumber = document.getElementById('rowNumber');
  const newColumnNumber = document.getElementById('columnNumber');
  const newBlockSize = document.getElementById('blockSize');
  const newSpeed = document.getElementById('blockSpeed');
  const dimUpdate =
    rows === parseInt(newRowNumber.value, 10) &&
    columns === parseInt(newColumnNumber.value, 10) &&
    blockSize === parseInt(newBlockSize.value, 10);
  rows = parseInt(newRowNumber.value, 10);
  columns = parseInt(newColumnNumber.value, 10);
  blockSize = parseInt(newBlockSize.value, 10);
  speed = parseInt(newSpeed.value, 10) * 100;
  return !dimUpdate;
}

// handling grid update from global variables blockSize, rows & columns
function handleConfigUpdate() {
  const haveRowsAndColumnsChanged = updateGameConfiguration();
  if (haveRowsAndColumnsChanged) {
    cleanPlaygroundGrid();
    generatePlaygroundGrid(blockSize, columns, rows);
  }
}

// log keyboard input
function handleKeyPress(e) {
  if (gameStatut === 'play') {
    if (e.keyCode === 37) {
      console.log('moving tetromino left');
      moveLeft();
    }
    if (e.keyCode === 39) {
      console.log('moving tetromino right');
      moveRight();
    }
    if (e.keyCode === 40) {
      console.log('moving tetromino down');
      pushDown();
    }
    if (e.keyCode === 65) {
      console.log('rotating tetromino to the left');
      rotateTetromino('left');
    }
    if (e.keyCode === 90) {
      console.log('rotating tetromino to the right');
      rotateTetromino('right');
    }
  }
}
//---------------------------------------------------------

///////////////
// LISTENERS //
///////////////

// listen to configuration update from side configuration panel
document.getElementById('configPanel').addEventListener('change', handleConfigUpdate);
document.getElementById('resetButton').addEventListener('click', reset);
document.getElementById('startButton').addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyPress);
