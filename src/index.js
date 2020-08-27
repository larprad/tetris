//--------------------------------//
//------------ TETRIS ------------//
//--------------------------------//

//---------------------------------------------------------

/////////////
// IMPORTS //
/////////////

import { menu } from './modules/menu';
import { init } from './modules/config';
import { display } from './modules/display';

//---------------------------------------------------------

//////////////////
// INIT SCRIPTS //
//////////////////

document.getElementById('enduranceMode').addEventListener('click', () => menu.enduranceMode());
document.getElementById('rushMode').addEventListener('click', () => menu.rushMode());
document.getElementById('sprintMode').addEventListener('click', () => menu.sprintMode());

init.detectDevice() === 'mobile' ? display.touchControl(true) : display.touchControl(false);

//---------------------------------------------------------
