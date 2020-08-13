//--------------------------------//
//------------ TETRIS ------------//
//--------------------------------//

import createTetrominoes from './modules/tetrominoes';

let blockSize = 30;
let rows = 20;
let columns = 12;
let speed = 500;
let gameStatut = 'notStarted';

let timerId;
let blocks;
let currentPosition;
let randomTetrominoIndex;
let RotationIndex;
let currentTetromino;
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
  document.getElementById('startButton').innerHTML = 'Start Game';
  console.log('game have been reseted');
}

//---------------------------------------------------------

////////////////
// PLAYGROUND //
////////////////

// init Tetromino
function initTetromino() {
  theTetrominoes = createTetrominoes(columns);
  currentPosition = Math.floor(columns / 2 - 1);
  randomTetrominoIndex = Math.floor(Math.random() * theTetrominoes.length);
  RotationIndex = Math.floor(Math.random() * theTetrominoes[randomTetrominoIndex].length);
  currentTetromino = theTetrominoes[randomTetrominoIndex][RotationIndex];
}

// draw the tetromino
function draw() {
  currentTetromino.forEach((index) => {
    blocks[currentPosition + index].classList.add('tetromino');
  });
}

//undraw the tetromino
function undraw() {
  currentTetromino.forEach((index) => {
    blocks[currentPosition + index].classList.remove('tetromino');
  });
}

//make the current tetromino move down
function moveDown() {
  undraw();
  currentPosition += columns;
  draw();
  freeze();
}

function freeze() {
  const freezeCondition = currentTetromino.some((index) =>
    blocks[currentPosition + index + columns].classList.contains('taken')
  );
  if (freezeCondition) {
    console.log('TOUCH DOWN! new tetromino in the way');
    currentTetromino.forEach((index) => {
      blocks[index + currentPosition].classList.add('taken');
    });
    randomTetrominoIndex = Math.floor(Math.random() * theTetrominoes.length);
    RotationIndex = Math.floor(Math.random() * theTetrominoes[randomTetrominoIndex].length);
    currentTetromino = theTetrominoes[randomTetrominoIndex][RotationIndex];
    currentPosition = Math.floor(columns / 2 - 1);
    draw();
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

//---------------------------------------------------------

///////////////
// LISTENERS //
///////////////

// listen to configuration update from side configuration panel
document.getElementById('configPanel').addEventListener('change', handleConfigUpdate);

document.getElementById('resetButton').addEventListener('click', reset);
document.getElementById('startButton').addEventListener('click', startGame);
