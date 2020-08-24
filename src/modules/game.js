import { init } from './config';
import { timer } from './timer';
import { tetromino } from './tetrominoes';
import { display } from './display';
import { playground } from './playground';
import { inputs } from './inputs';
import { menu } from './menu';

export const game = {
  gameScore: 0,
  lines: 8,
  timerId: 0,
  gameStatut: 'notStarted',
  gameMode: '',
  speed: 0,
  init() {
    playground.generateAllGrid();
    inputs.setListener(true);
    this.restore();
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
    this.lines = 0;
    this.speed = init.gameMode[this.gameMode].initSpeed;
    timer.value = init.gameMode[this.gameMode].initTimer;
    timer.reset();
    this.updateScore(0);
    this.gameStatut = 'notStarted';
    display.endGame(false);
    display.pause(false);
    display.sidePanelInfo();
    tetromino.initSaved();
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
      this.timerId = setInterval(this.run.bind(this), init.speedArray[this.speed - 1]);
      console.log('game mode', this.gameMode);
      if (this.gameMode === 'rush') {
        timer.decrement();
        timer.display();
      }
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
    this.gameMode === 'rush' ? timer.pause() : null;
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
    document.getElementById('startButton').innerHTML = 'Start Game';
    console.log('game have been reseted');
  },
  backMenu() {
    this.quit();
    menu.showMenu(true);
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
  updateScore() {
    const addedScore = this.lines * this.lines * 10;
    this.gameScore += addedScore;
    document.getElementById('score').innerHTML = this.gameScore;
    document.getElementById('lines').innerHTML = this.lines;
  },
  increaseSpeed() {
    console.log('increasing speed');
    clearInterval(this.timerId);
    this.speed++;
    this.timerId = setInterval(this.run.bind(this), init.speedArray[this.speed - 1]);
    document.getElementById('speed').innerHTML = this.speed;
  },
  run() {
    if (playground.deletingAnimation === 'onGoing') {
      // animation onGoing, nothing will happen
      return;
    }
    const lineToDelete = playground.lineIsMade();
    const tetrominoTouchDown = tetromino.freeze();
    if (tetrominoTouchDown && lineToDelete.length && playground.deletingAnimation !== 'done') {
      if (this.gameMode === 'enduro') {
        const speedShouldIncrease = lineToDelete.some((x, index) => {
          return (this.lines + index + 1) % 10 === 0 && this.lines > 0;
        });
        if (speedShouldIncrease) {
          console.log('10 lines have been made, speed is increasing');
          this.increaseSpeed();
        }
      }
      this.lines += lineToDelete.length;
      this.updateScore();
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
        if (this.gameMode === 'rush' || this.gameMode === 'sprint') {
          timer.pause();
        }
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
