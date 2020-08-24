import { game } from './game';
import { tetromino } from './tetrominoes';

let keys = {
  left: 37,
  right: 39,
  down: 40,
  smackDown: 38,
  rotLeft: 65,
  rotRight: 90,
  save: 69,
};

export const inputs = {
  handleKeyPress(e) {
    if (game.gameStatut === 'play') {
      if (e.keyCode === keys.left) {
        console.log('moving tetromino left');
        tetromino.moveLeft();
      }
      if (e.keyCode === keys.right) {
        console.log('moving tetromino right');
        tetromino.moveRight();
      }
      if (e.keyCode === keys.down) {
        console.log('moving tetromino down');
        tetromino.pushDown();
      }
      if (e.keyCode === keys.smackDown) {
        console.log('smack tetromino down');
        tetromino.smackDown();
      }
      if (e.keyCode === keys.rotLeft) {
        console.log('rotating tetromino to the left');
        tetromino.rotateTetromino('left');
      }
      if (e.keyCode === keys.rotRight) {
        console.log('rotating tetromino to the right');
        tetromino.rotateTetromino('right');
      }
      if (e.keyCode === keys.save) {
        console.log('saving tetromino');
        game.saveTetromino();
      }
    }
  },
  handleStart() {
    game.start();
  },
  handleReset() {
    game.reset();
  },
  handleBackMenu() {
    game.backMenu();
  },
  handleStart() {
    game.start();
  },
  setListener(bool) {
    if (bool) {
      console.log('setting event listeners');
      document.getElementById('resetButton').addEventListener('click', this.handleReset);
      document.getElementById('startButton').addEventListener('click', this.handleStart);
      document.getElementById('backMenu').addEventListener('click', this.handleBackMenu);
      document.addEventListener('keydown', this.handleKeyPress);
    } else {
      console.log('removing event listeners');

      document.getElementById('resetButton').removeEventListener('click', this.handleReset);
      document.getElementById('startButton').removeEventListener('click', this.handleReset);
      document.getElementById('backMenu').removeEventListener('click', this.handleReset);
      document.removeEventListener('keydown', this.handleKeyPress);
    }
  },
};
