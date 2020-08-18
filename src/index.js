//--------------------------------//
//------------ TETRIS ------------//
//--------------------------------//

//---------------------------------------------------------

import { init, configPanel } from './modules/config';
import { playground } from './modules/playground';
import { tetromino } from './modules/tetrominoes';

/////////////////
// GLOBAL VARS //
/////////////////

let timerId;
let deletingAnimation = 'init';
let deletionAnimationSpeed = 500;

//---------------------------------------------------------

//////////////////
// INIT SCRIPTS //
//////////////////

configPanel.displayInitialConfiguration();
configPanel.enableConfigurationPanel(true);
playground.generatePlaygroundGrid();

//---------------------------------------------------------

//////////////
// COMMANDS //
//////////////

function startGame() {
  if (init.gameStatut === 'lost') {
    reset();
  }
  if (init.gameStatut === 'notStarted') {
    console.log('new game is starting');
    init.gameScore = 0;
    score(0);
    displayEndGame(false);
    tetromino.initTetromino();
    configPanel.enableConfigurationPanel(false);
    tetromino.draw();
  }
  if (init.gameStatut === 'pause' || init.gameStatut === 'notStarted') {
    timerId = setInterval(moveDown, init.speed);
    document.getElementById('startButton').innerHTML = 'Pause Game';
    displayPause(false);
    init.gameStatut = 'play';
  } else {
    console.log('game is pausing');
    pauseGame();
  }
}

function pauseGame() {
  init.gameStatut = 'pause';
  displayPause(true);
  document.getElementById('startButton').innerHTML = 'Resume';
  clearInterval(timerId);
}

function reset() {
  playground.cleanPlaygroundGrid();
  playground.generatePlaygroundGrid();
  tetromino.initTetromino();
  clearInterval(timerId);
  displayPause(false);
  displayEndGame(false);
  init.gameStatut = 'notStarted';
  deletingAnimation = 'init';
  configPanel.enableConfigurationPanel(true);
  init.gameScore = 0;
  score(0);
  document.getElementById('startButton').innerHTML = 'Start Game';
  console.log('game have been reseted');
}

function score(lines) {
  const addedScore = lines * lines * 10;
  init.gameScore += addedScore;
  document.getElementById('score').innerHTML = init.gameScore;
}

//---------------------------------------------------------

////////////////
// PLAYGROUND //
////////////////

//make the current tetromino move down
function moveDown() {
  const lineToDelete = lineIsMade();
  if (deletingAnimation === 'onGoing') {
    return;
  }
  console.log('freeze', freeze());
  if (freeze() && lineToDelete.length && deletingAnimation !== 'done') {
    console.log('I am here');
    score(lineToDelete.length);
    animateDeleteLine(lineToDelete);
    deletingAnimation = 'onGoing';
    setTimeout(() => {
      deletingAnimation = 'done';
    }, deletionAnimationSpeed);
    return;
  }
  if (freeze()) {
    deleteLine(lineToDelete);
    deletingAnimation = 'init';
    tetromino.drawNew();
    const gameLost = LoseCondition();
    if (gameLost) {
      clearInterval(timerId);
      init.gameStatut = 'lost';
      document.getElementById('startButton').innerHTML = 'Restart';
      console.log('GAME LOST');
      displayEndGame(true);
    }
  } else {
    tetromino.undraw();
    tetromino.position += init.columns;
    tetromino.draw();
  }
}

function moveLeft() {
  const isAtLeftEdge = tetromino.current.some((index) => {
    return (index + tetromino.position) % init.columns === 0;
  });
  if (!isAtLeftEdge && !lateralBlock('left')) {
    tetromino.undraw();
    tetromino.position--;
    tetromino.draw();
  } else {
    console.log('left boudary prevents tetromino movement');
  }
}

function pushDown() {
  if (deletingAnimation !== 'init') {
    return;
  }
  if (!freeze()) {
    tetromino.undraw();
    tetromino.position += init.columns;
    tetromino.draw();
  } else {
    console.log('bottom boudary prevents tetromino movement');
  }
}

function moveRight() {
  const isAtRightEdge = tetromino.current.some((index) => {
    return (index + tetromino.position + 1) % init.columns === 0;
  });
  if (!isAtRightEdge && !lateralBlock('right')) {
    tetromino.undraw();
    tetromino.position++;
    tetromino.draw();
  } else {
    console.log('right boudary prevents tetromino movement');
  }
}

// when the current tetromino encouters a boundary it will freeze and become part of the boudaries.
function freeze() {
  const freezeCondition = tetromino.current.some((index) =>
    playground.blocks[tetromino.position + index + init.columns].classList.contains('taken')
  );
  if (freezeCondition) {
    console.log('TOUCH DOWN! new tetromino in the way');
    tetromino.current.forEach((index) => {
      playground.blocks[index + tetromino.position].classList.add('taken');
    });
    return true;
  }
  return false;
}

function lateralBlock(side) {
  let checkSide;
  side === 'right' ? (checkSide = 1) : (checkSide = -1);
  return tetromino.current.some((index) =>
    playground.blocks[tetromino.position + index + checkSide].classList.contains('taken')
  );
}

function lineIsMade() {
  let checkLine = [];
  let lineToDelete = [];
  for (let i = 0; i < init.columns; i++) {
    checkLine.push(i);
  }
  for (let i = 0; i < init.rows; i++) {
    const lineTaken = checkLine.every((index) => {
      return (
        playground.blocks[i * init.columns + index].classList.contains('taken') ||
        playground.blocks[i * init.columns + index].classList.contains('tetromino')
      );
    });
    lineTaken ? lineToDelete.push(i) : null;
  }
  lineToDelete ? console.log('line complete', lineToDelete) : 0;
  return lineToDelete;
}

function animateDeleteLine(lineToDelete) {
  for (let i = 0; i < init.columns; i++) {
    lineToDelete.forEach(
      (index) =>
        (playground.blocks[init.columns * index + i].className = 'playgroundBlock taken erasing')
    );
  }
}

function deleteLine(lineArray) {
  for (let j = 0; j < lineArray.length; j++) {
    let saveUpperBlockStyle = [];
    console.log(`deleting line ${lineArray[j]}`);
    for (let i = 0; i < lineArray[j] * init.columns; i++) {
      saveUpperBlockStyle.push(playground.blocks[i].className);
      playground.blocks[i].className = 'playgroundBlock';
    }
    for (let i = 0; i < lineArray[j] * init.columns; i++) {
      let bottomCheck = playground.blocks[i + init.columns].className;
      !bottomCheck.includes('playgroundBottom')
        ? (playground.blocks[i + init.columns].className = saveUpperBlockStyle[i])
        : null;
    }
  }
}

function LoseCondition() {
  const gameLost = tetromino.current.some((index) => {
    return playground.blocks[tetromino.position + index].classList.contains('taken');
  });
  return gameLost;
}

function displayEndGame(bool) {
  const displayValue = bool ? 'flex' : 'none';
  document.getElementById('endGame').style.display = displayValue;
  if (bool) {
    document.getElementById('finalScore').innerHTML = init.gameScore;
  }
}

function displayPause(bool) {
  const displayValue = bool ? 'block' : 'none';
  document.getElementById('gamePaused').style.display = displayValue;
}

//---------------------------------------------------------

////////////////////
// GAME FUNCTIONS //
////////////////////

// log keyboard input
function handleKeyPress(e) {
  if (init.gameStatut === 'play') {
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
      tetromino.rotateTetromino('left');
    }
    if (e.keyCode === 90) {
      console.log('rotating tetromino to the right');
      tetromino.rotateTetromino('right');
    }
  }
}
//---------------------------------------------------------

///////////////
// LISTENERS //
///////////////

// listen to configuration update from side configuration panel
document
  .getElementById('configPanel')
  .addEventListener('change', () => playground.handleConfigUpdate());
document.getElementById('resetButton').addEventListener('click', reset);
document.getElementById('startButton').addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyPress);
