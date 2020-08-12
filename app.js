////////////// TETRIS //////////////

// Game configuration

const blockSize = 20;
const rows = 20;
const columns = 10;

////////////////////////////////////

// Game init scripts

generatePlaygroundGrid(blockSize, columns, rows);

////////////////////////////////////

// Game functions

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
