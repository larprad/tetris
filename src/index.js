//--------------------------------//
//------------ TETRIS ------------//
//--------------------------------//

//---------------------------------------------------------

/////////////
// IMPORTS //
/////////////

import { menu } from './modules/menu';

//---------------------------------------------------------

//////////////////
// INIT SCRIPTS //
//////////////////

document.getElementById('enduranceMode').addEventListener('click', () => menu.enduranceMode());
document.getElementById('rushMode').addEventListener('click', () => menu.rushMode());
document.getElementById('sprintMode').addEventListener('click', () => menu.sprintMode());

//---------------------------------------------------------
