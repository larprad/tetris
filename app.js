////////////// TETRIS //////////////

// Game initial configuration

let blockSize = 15;
let rows = 20;
let columns = 10;

////////////////////////////////////

// Game init scripts
displayInitialConfiguration(blockSize, columns, rows);
generatePlaygroundGrid(blockSize, columns, rows);

////////////////////////////////////

// Game functions

function displayInitialConfiguration(blockSize, columns, rows) {
  document.getElementById('rowNumber').value = rows;
  document.getElementById('columnNumber').value = columns;
  document.getElementById('blockSize').value = blockSize;
}

// init playground divs
function generatePlaygroundGrid(blocksWidth, playgroundColumns, playgroundRows) {
  console.log('generating playground blocks');
  const playground = document.getElementById('playground');
  const root = document.querySelector('html');
  root.style.setProperty('--columns', playgroundColumns);
  root.style.setProperty('--rows', playgroundRows);
  root.style.setProperty('--block-width', blocksWidth + 'px');
  const numberOfBlocks = playgroundRows * playgroundColumns;
  for (let i = 0; i < numberOfBlocks; i++) {
    let div = document.createElement('div');
    div.className = 'playgroundBlock';
    playground.appendChild(div);
  }
  console.log(`${numberOfBlocks} blocks have been generated`);
}

// delete all divs from the playground
function cleanPlaygroundGrid() {
  const playground = document.getElementById('playground');
  while (playground.firstChild) {
    playground.removeChild(playground.firstChild);
  }
}

// updating global variables blockSize, rows & columns
function updateGameConfiguration() {
  const newRowNumber = document.getElementById('rowNumber');
  const newColumnNumber = document.getElementById('columnNumber');
  const newBlockSize = document.getElementById('blockSize');
  rows = parseInt(newRowNumber.value, 10);
  columns = parseInt(newColumnNumber.value, 10);
  blockSize = parseInt(newBlockSize.value, 10);
}

// handling grid update from global variables blockSize, rows & columns
function handleConfigUpdate() {
  updateGameConfiguration();
  cleanPlaygroundGrid();
  generatePlaygroundGrid(blockSize, columns, rows);
}

////////////////////////////////////

// Listener

document.getElementById('configPanel').addEventListener('change', handleConfigUpdate);
