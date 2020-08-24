export const init = {
  blockSize: 25,
  rows: 20,
  columns: 10,
  timerCountPrecision: 10, // one tick each centisecond
  timerDisplayPrecision: 1000, // one display each seconds
  speedArray: [
    2360,
    1460,
    920,
    590,
    388,
    259.8,
    177.5,
    123.6,
    87.9,
    63.61,
    46.93,
    35.256,
    26.977,
    21.017,
    16.67,
  ],
  devMode: false,
  deletionAnimationSpeed: 500,
  previewSize: 4,
  gameMode: {
    enduro: {
      initSpeed: 3,
    },
    rush: { initSpeed: 8, initTimer: 60 },
  },
};

export const configPanel = {
  // updateGameConfiguration() {
  //   const newRowNumber = document.getElementById('rowNumber');
  //   const newColumnNumber = document.getElementById('columnNumber');
  //   const newBlockSize = document.getElementById('blockSize');
  //   const newSpeed = document.getElementById('blockSpeed');
  //   const dimUpdate =
  //     init.rows === parseInt(newRowNumber.value, 10) &&
  //     init.columns === parseInt(newColumnNumber.value, 10) &&
  //     init.blockSize === parseInt(newBlockSize.value, 10);
  //   init.rows = parseInt(newRowNumber.value, 10);
  //   init.columns = parseInt(newColumnNumber.value, 10);
  //   init.blockSize = parseInt(newBlockSize.value, 10);
  //   game.speed = parseInt(newSpeed.value, 10) * 100;
  //   return !dimUpdate;
  // },
};
