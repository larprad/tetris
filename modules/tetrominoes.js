function createTetrominoes(columns) {
  const iTetromino = [
    [1, columns + 1, columns * 2 + 1, columns * 3 + 1],
    [0, 1, 2, 3],
    [1, columns + 1, columns * 2 + 1, columns * 3 + 1],
    [0, 1, 2, 3],
  ];
  const llTetromino = [
    [0, columns, columns + 1, columns + 2],
    [1, 2, columns + 1, columns * 2 + 1],
    [0, 1, 2, columns + 2],
    [1, columns + 1, columns * 2, columns * 2 + 1],
  ];
  const lrTetromino = [
    [2, columns, columns + 1, columns + 2],
    [1, columns + 1, columns * 2 + 1, columns * 2 + 2],
    [0, 1, 2, columns],
    [0, 1, columns + 1, columns * 2 + 1],
  ];
  const oTetromino = [
    [1, 2, columns + 1, columns + 2],
    [1, 2, columns + 1, columns + 2],
    [1, 2, columns + 1, columns + 2],
    [1, 2, columns + 1, columns + 2],
  ];
  const sTetromino = [
    [1, 2, columns, columns + 1],
    [1, columns + 1, columns + 2, columns * 2 + 2],
    [1, 2, columns, columns + 1],
    [1, columns + 1, columns + 2, columns * 2 + 2],
  ];
  const zTetromino = [
    [0, 1, columns + 1, columns + 2],
    [2, columns + 1, columns + 2, columns * 2 + 1],
    [0, 1, columns + 1, columns + 2],
    [2, columns + 1, columns + 2, columns * 2 + 1],
  ];
  const tTetromino = [
    [1, columns, columns + 1, columns + 2],
    [1, columns + 1, columns + 2, columns * 2 + 1],
    [0, 1, 2, columns + 1],
    [2, columns + 1, columns + 2, columns * 2 + 2],
  ];

  return [iTetromino, llTetromino, lrTetromino, oTetromino, sTetromino, zTetromino, tTetromino];
}

// const tetrominoesColors = ['#f27f6f', '#9381ff', '#317B22', '#FFEE88', '#CC4BC2'];

export default createTetrominoes;
