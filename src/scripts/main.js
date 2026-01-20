'use strict';

const Game = window.Game;
const GAME_STATUS = window.GAME_STATUS;

const game = new Game();

const field = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');
const startMsg = document.querySelector('.message-start');

function render() {
  const state = game.getState();
  const rows = field.querySelectorAll('.field-row');

  rows.forEach((rowEl, r) => {
    const cells = rowEl.querySelectorAll('.field-cell');

    cells.forEach((cellEl, c) => {
      const value = state[r][c];

      cellEl.textContent = value === 0 ? '' : value;
      cellEl.className = 'field-cell';

      if (value !== 0) {
        cellEl.classList.add(`field-cell--${value}`);
      }
    });
  });

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  winMsg.classList.toggle('hidden', gameStatus !== GAME_STATUS.WIN);
  loseMsg.classList.toggle('hidden', gameStatus !== GAME_STATUS.LOSE);
  startMsg.classList.toggle('hidden', gameStatus !== GAME_STATUS.IDLE);

  if (gameStatus === GAME_STATUS.PLAYING) {
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    startBtn.textContent = 'Start';
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== GAME_STATUS.PLAYING) {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    render();
  }
});

startBtn.addEventListener('click', () => {
  if (game.getStatus() === GAME_STATUS.IDLE) {
    game.start();
  } else {
    game.restart();
  }

  render();
});

render();
