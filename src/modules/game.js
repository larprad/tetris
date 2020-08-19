import { init, configPanel } from './config';
import { tetromino } from './tetrominoes';
import { display } from './display';
import { playground } from './playground';
import { inputs } from './inputs';

export const game = {
  gameScore: 0,
  timerId: 0,
  init() {
    configPanel.displayInitialConfiguration();
    configPanel.enableDisplay(true);
    playground.generatePlaygroundGrid();
    inputs.initListener();
  },
  start() {
    if (init.gameStatut === 'lost') {
      this.reset();
    }
    if (init.gameStatut === 'notStarted') {
      console.log('new game is starting');
      this.gameScore = 0;
      this.updateScore(0);
      display.endGame(false);
      tetromino.initTetromino();
      configPanel.enableDisplay(false);
      tetromino.draw();
    }
    if (init.gameStatut === 'pause' || init.gameStatut === 'notStarted') {
      this.timerId = setInterval(this.gameActive.bind(this), init.speed);
      document.getElementById('startButton').innerHTML = 'Pause Game';
      display.pause(false);
      init.gameStatut = 'play';
    } else {
      console.log('game is pausing');
      this.pause();
    }
  },
  pause() {
    init.gameStatut = 'pause';
    display.pause(true);
    document.getElementById('startButton').innerHTML = 'Resume';
    clearInterval(this.timerId);
  },
  reset() {
    playground.cleanPlaygroundGrid();
    playground.generatePlaygroundGrid();
    tetromino.initTetromino();
    clearInterval(this.timerId);
    display.pause(false);
    display.endGame(false);
    init.gameStatut = 'notStarted';
    playground.deletingAnimation = 'init';
    configPanel.enableDisplay(true);
    this.gameScore = 0;
    this.updateScore(0);
    document.getElementById('startButton').innerHTML = 'Start Game';
    console.log('game have been reseted');
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
        init.gameStatut = 'lost';
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
