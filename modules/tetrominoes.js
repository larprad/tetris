function createTetrominoes(columns) {
  const lTetromino = [
    [1, columns + 1, columns * 2 + 1, 2],
    [columns, columns + 1, columns + 2, columns * 2 + 2],
    [columns * 2, 1, columns + 1, columns * 2 + 1],
    [columns, columns * 2, columns * 2 + 1, columns * 2 + 2],
  ];
  const zTetromino = [
    [0, columns, columns + 1, columns * 2 + 1],
    [columns + 1, columns + 2, columns * 2, columns * 2 + 1],
    [0, columns, columns + 1, columns * 2 + 1],
    [columns + 1, columns + 2, columns * 2, columns * 2 + 1],
  ];
  const tTetromino = [
    [1, columns, columns + 1, columns + 2],
    [1, columns + 1, columns + 2, columns * 2 + 1],
    [columns, columns + 1, columns + 2, columns * 2 + 1],
    [1, columns, columns + 1, columns * 2 + 1],
  ];
  const oTetromino = [
    [0, 1, columns, columns + 1],
    [0, 1, columns, columns + 1],
    [0, 1, columns, columns + 1],
    [0, 1, columns, columns + 1],
  ];
  const iTetromino = [
    [1, columns + 1, columns * 2 + 1, columns * 3 + 1],
    [columns, columns + 1, columns + 2, columns + 3],
    [1, columns + 1, columns * 2 + 1, columns * 3 + 1],
    [columns, columns + 1, columns + 2, columns + 3],
  ];

  return [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
}
export default createTetrominoes;
