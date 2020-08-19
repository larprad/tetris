export const init = {
  blockSize: 30,
  rows: 18,
  columns: 10,
  speed: 400,
  gameStatut: 'notStarted',
  devMode: false,
  deletionAnimationSpeed: 500,
  previewSize: 4,
};

export const configPanel = {
  updateGameConfiguration() {
    const newRowNumber = document.getElementById('rowNumber');
    const newColumnNumber = document.getElementById('columnNumber');
    const newBlockSize = document.getElementById('blockSize');
    const newSpeed = document.getElementById('blockSpeed');
    const dimUpdate =
      init.rows === parseInt(newRowNumber.value, 10) &&
      init.columns === parseInt(newColumnNumber.value, 10) &&
      init.blockSize === parseInt(newBlockSize.value, 10);
    init.rows = parseInt(newRowNumber.value, 10);
    init.columns = parseInt(newColumnNumber.value, 10);
    init.blockSize = parseInt(newBlockSize.value, 10);
    init.speed = parseInt(newSpeed.value, 10) * 100;
    return !dimUpdate;
  },

  displayInitialConfiguration() {
    document.getElementById('rowNumber').value = init.rows;
    document.getElementById('columnNumber').value = init.columns;
    document.getElementById('blockSize').value = init.blockSize;
    document.getElementById('blockSpeed').value = init.speed / 100;
  },

  enableDisplay(bool) {
    document.getElementById('rowNumber').disabled = !bool;
    document.getElementById('columnNumber').disabled = !bool;
    document.getElementById('blockSize').disabled = !bool;
    document.getElementById('blockSpeed').disabled = !bool;
  },
};
