import { game } from './game';
import { timer } from './timer';

export const display = {
  playgroundPanel(bool) {
    if (bool) {
      console.log('showing playground panels');
      document.getElementById('sidePanelRight').classList.remove('hide');
      document.getElementById('sidePanelLeft').classList.remove('hide');
      document.getElementById('playgroundContainer').classList.remove('hide');
    } else {
      console.log('hidding playground panels');
      document.getElementById('sidePanelRight').classList.add('hide');
      document.getElementById('sidePanelLeft').classList.add('hide');
      document.getElementById('playgroundContainer').classList.add('hide');
    }
  },
  mainMenu(bool) {
    if (bool) {
      console.log('showing main menu');
      document.getElementById('mainMenu').classList.remove('hide');
    } else {
      console.log('hidding main menu');
      document.getElementById('mainMenu').classList.add('hide');
    }
  },
  sidePanelInfo() {
    document.getElementById('speed').innerHTML = game.speed.toString();
    document.getElementById('timer').innerHTML = Math.floor(timer.value);
  },
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
