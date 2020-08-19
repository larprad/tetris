import { game } from './game';

export const display = {
  endGame(bool) {
    const displayValue = bool ? 'flex' : 'none';
    document.getElementById('endGame').style.display = displayValue;
    if (bool) {
      document.getElementById('finalScore').innerHTML = game.gameScore;
    }
  },

  pause(bool) {
    const displayValue = bool ? 'block' : 'none';
    document.getElementById('gamePaused').style.display = displayValue;
  },
};
