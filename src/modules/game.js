import { init, configPanel } from './config';
import { tetromino } from './tetrominoes';
import { display } from './display';
import { playground } from './playground';
import { inputs } from './inputs';
import { menu } from './menu';

export const game = {
  gameScore: 0,
  timerId: 0,
  gameStatut: 'notStarted',
  gameMode: '',
  init() {
    // configPanel.displayInitialConfiguration();
    // configPanel.enableDisplay(true);
    playground.generateAllGrid();
    tetromino.initSaved();
    inputs.setListener(true);
    console.log('game statut from init', this.gameStatut);
  },
  quit() {
    this.restore();
    playground.removeAllGrid();
    document.getElementById('startButton').innerHTML = 'Start Game';
    inputs.setListener(false);
  },
  restore() {
    console.log('restoring game');
    this.gameScore = 0;
    this.updateScore(0);
    this.gameStatut = 'notStarted';
    display.endGame(false);
    display.pause(false);
    playground.deletingAnimation = 'init';
    clearInterval(this.timerId);
  },
  start() {
    if (this.gameStatut === 'lost') {
      this.reset();
    }
    if (this.gameStatut === 'notStarted') {
      console.log('new game is starting');
      tetromino.drawNew();
    }
    if (this.gameStatut === 'pause' || this.gameStatut === 'notStarted') {
      this.timerId = setInterval(this.run.bind(this), init.speed);
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
    console.log('reseting game');
    playground.cleanAllGrid();
    playground.generatePlaygroundGrid();
    this.restore();
    tetromino.initSaved();
    this.gameStatut = 'notStarted';
    // configPanel.enableDisplay(true);
    document.getElementById('startButton').innerHTML = 'Start Game';
    console.log('game have been reseted');
  },
  backMenu() {
    this.quit();
    menu.showMenu();
  },
  saveTetromino() {
    if (tetromino.canBeSaved) {
      if (tetromino.saved.tetromino.length > 0) {
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
      console.log('already saved one tetromino wait for next');
    }
  },
  updateScore(lines) {
    const addedScore = lines * lines * 10;
    this.gameScore += addedScore;
    document.getElementById('score').innerHTML = this.gameScore;
  },
  run() {
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
