const { display } = require('./display');
const { game } = require('./game');

export const menu = {
  showMenu() {
    display.mainMenu(true);
    display.playgroundPanel(false);
  },
  enduranceMode() {
    display.mainMenu(false);
    display.playgroundPanel(true);
    game.init();
  },
};
