import { init, configPanel } from './config';
import { tetromino } from './tetrominoes';
import { display } from './display';
import { playground } from './playground';
import { inputs } from './inputs';

export const game = {
  gameScore: 0,
  timerId: 0,
  gameStatut: 'notStarted',
  init() {
    configPanel.displayInitialConfiguration();
    configPanel.enableDisplay(true);
    playground.generateAllGrid();
    tetromino.initSaved();
    inputs.initListener();
  },
  // restore() {
  //   playground.cleanAllGrid();
  //   playground.generateAllGrid();
  //   this.gameScore = 0;
  //   this.updateScore(0);
  //   display.endGame(false);
  //   display.pause(false);
  //   configPanel.enableDisplay(false);
  //   clearInterval(this.timerId);
  // },
  start() {
    if (this.gameStatut === 'lost') {
      this.reset();
    }
    if (this.gameStatut === 'notStarted') {
      console.log('new game is starting');
      this.gameScore = 0;
      this.updateScore(0);
      display.endGame(false);
      configPanel.enableDisplay(false);
      tetromino.drawNew();
    }
    if (this.gameStatut === 'pause' || this.gameStatut === 'notStarted') {
      this.timerId = setInterval(this.gameActive.bind(this), init.speed);
      document.getElementById('startButton').innerHTML = 'Pause Game';
      display.pause(false);
      this.gameStatut = 'play';
    } else {
      console.log('game is pausing');
      this.pause();
    }
  },
  pause() {
    this.gameStatut = 'pause';
    display.pause(true);
    document.getElementById('startButton').innerHTML = 'Resume';
    clearInterval(this.timerId);
  },
  reset() {
    playground.cleanAllGrid();
    playground.generatePlaygroundGrid();
    tetromino.initTetromino();
    tetromino.initSaved();
    clearInterval(this.timerId);
    display.pause(false);
    display.endGame(false);
    this.gameStatut = 'notStarted';
    playground.deletingAnimation = 'init';
    configPanel.enableDisplay(true);
    this.gameScore = 0;
    this.updateScore(0);
    document.getElementById('startButton').innerHTML = 'Start Game';
    console.log('game have been reseted');
  },
  saveTetromino() {
    //if a tetromino have been saved already

    if (tetromino.canBeSaved) {
      if (tetromino.saved.tetromino.length > 0) {
        console.log('Swwwwitch');
        tetromino.undraw();
        tetromino.switchSaved();
        tetromino.drawSaved();
        tetromino.undraw();
        tetromino.draw();
      } else {
        tetromino.saveTetromino();
        tetromino.drawSaved();
        tetromino.undraw();
        tetromino.drawNew();
      }
    } else {
      console.log('already saved one tetromino');
    }
  },
  updateScore(lines) {
    const addedScore = lines * lines * 10;
    this.gameScore += addedScore;
    document.getElementById('score').innerHTML = this.gameScore;
  },
  gameActive() {
    if (playground.deletingAnimation === 'onGoing') {
      // animation onGoing, nothing will happen
      return;
    }
    const lineToDelete = playground.lineIsMade();
    const tetrominoTouchDown = tetromino.freeze();
    if (tetrominoTouchDown && lineToDelete.length && playground.deletingAnimation !== 'done') {
      console.log();
      this.updateScore(lineToDelete.length);
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
      const lose = this.loseCondition();
      if (lose) {
        clearInterval(this.timerId);
        this.gameStatut = 'lost';
        document.getElementById('startButton').innerHTML = 'Restart';
        console.log('GAME LOST');
        display.endGame(true);
      }
    } else {
      tetromino.moveDown();
    }
  },
  loseCondition() {
    const gameLost = tetromino.current.some((index) => {
      return playground.blocks[tetromino.position + index].classList.contains('taken');
    });
    return gameLost;
  },
};
