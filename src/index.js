//--------------------------------//
//------------ TETRIS ------------//
//--------------------------------//

//---------------------------------------------------------

/////////////
// IMPORTS //
/////////////

import { init, configPanel } from './modules/config';
import { playground } from './modules/playground';
import { tetromino } from './modules/tetrominoes';

/////////////////
// GLOBAL VARS //
/////////////////

let timerId;

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
    timerId = setInterval(gameActive, init.speed);
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
  playground.deletingAnimation = 'init';
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

// to facto & debug
function gameActive() {
  if (playground.deletingAnimation === 'onGoing') {
    // animation onGoing, nothing will happen
    return;
  }
  const lineToDelete = playground.lineIsMade();
  const tetrominoTouchDown = tetromino.freeze();
  if (tetrominoTouchDown && lineToDelete.length && playground.deletingAnimation !== 'done') {
    console.log();
    score(lineToDelete.length);
    playground.animateDeleteLine(lineToDelete);
    playground.deletingAnimation = 'onGoing';
    setTimeout(() => {
      playground.deletingAnimation = 'done';
    }, init.deletionAnimationSpeed);
    return;
  }
  if (tetrominoTouchDown) {
    playground.deleteLine(lineToDelete);
    playground.deletingAnimation = 'init';
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
    tetromino.moveDown();
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
      tetromino.moveLeft();
    }
    if (e.keyCode === 39) {
      console.log('moving tetromino right');
      tetromino.moveRight();
    }
    if (e.keyCode === 40) {
      console.log('moving tetromino down');
      tetromino.pushDown();
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
