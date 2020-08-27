export let sounds = {
  theme1: new Audio('./sound/origTheme.mp3'),
  land: new Audio('./sound/samples/land.mp3'),
  level: new Audio('./sound/samples/level.mp3'),
  move: new Audio('./sound/samples/move.mp3'),
  rotate: new Audio('./sound/samples/rotate.mp3'),
  smack: new Audio('./sound/samples/shift.mp3'),
  pause: new Audio('./sound/samples/pause.mp3'),
  justSmashed: false,
  playingTheme: 0,
  toggleSmash() {
    this.justSmashed = !this.justSmashed;
  },
  playSong(theme) {
    theme.play();
    theme.loop = true;
    theme.volume = 0.5;
  },
  play(theme) {
    this.stop(theme);
    theme.play();
  },
  stop(theme) {
    theme.pause();
    theme.currentTime = 0;
  },
  pause(theme) {
    theme.pause();
  },
};
