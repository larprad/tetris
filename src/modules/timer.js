import { init } from './config';

function millisToMinutesAndSeconds(millis) {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export const timer = {
  value: 0,
  timerCount: 0,
  timerDisplay: 0,
  init() {},
  display() {
    this.timerDisplay = setInterval(() => {
      console.log('DISPLAYING TIMER');
      console.log(this.value);
      document.getElementById('timer').innerHTML = Math.floor(this.value);
    }, init.timerDisplayPrecision);
  },
  increment() {
    this.timerCount = setInterval(() => {
      this.value += init.timerCountPrecision / 1000;
    }, init.timerCountPrecision);
  },
  decrement() {
    this.timerCount = setInterval(() => {
      this.value -= init.timerCountPrecision / 1000;
    }, init.timerCountPrecision);
  },
  pause() {
    console.log('pausing timer');
    clearInterval(this.timerCount);
    clearInterval(this.timerDisplay);
  },
  reset() {
    console.log('reseting timer');
    clearInterval(this.timerCount);
    clearInterval(this.timerDisplay);
  },
};
