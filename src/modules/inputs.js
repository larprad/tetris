import { game } from './game';
import { playground } from './playground';
import { tetromino } from './tetrominoes';
import { init } from './config';

export const inputs = {
  handleKeyPress(e) {
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
  },
  initListener() {
    document
      .getElementById('configPanel')
      .addEventListener('change', () => playground.handleConfigUpdate());
    document.getElementById('resetButton').addEventListener('click', () => game.reset());
    document.getElementById('startButton').addEventListener('click', () => game.start());
    document.addEventListener('keydown', this.handleKeyPress);
  },
  removeListener() {
    document
      .getElementById('configPanel')
      .removeEventListener('change', () => playground.handleConfigUpdate());
    document.getElementById('resetButton').removeEventListener('click', () => game.reset());
    document.getElementById('startButton').removeEventListener('click', () => game.start());
    document.removeEventListener('keydown', this.handleKeyPress);
  },
};
