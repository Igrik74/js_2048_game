'use strict';
/* eslint-disable function-paren-newline */

const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
};

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = GAME_STATUS.IDLE;

    if (initialState && initialState.length === this.size) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = this.createEmptyBoard();
    }

    this.initialBoard = this.board.map((row) => [...row]);
    this.initialScore = 0;
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== GAME_STATUS.IDLE) {
      return;
    }

    this.status = GAME_STATUS.PLAYING;
    this.board = this.initialBoard.map((row) => [...row]);
    this.score = 0;

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.initialBoard.map((row) => [...row]);
    this.score = 0;
    this.status = GAME_STATUS.IDLE;
  }

  addRandomTile() {
    const empty = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          empty.push({ r: row, c: col });
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[r][c] = value;
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  move(direction) {
    if (this.status !== GAME_STATUS.PLAYING) {
      return false;
    }

    const prev = this.getState();

    switch (direction) {
      case 'left':
        this.board = this.board.map((row) => this.mergeRow(row));
        break;

      case 'right':
        this.board = this.board.map((row) =>
          this.mergeRow([...row].reverse()).reverse(),
        );
        break;

      case 'up': {
        const t = this.transpose(this.board);
        const merged = t.map((row) => this.mergeRow(row));

        this.board = this.transpose(merged);
        break;
      }

      case 'down': {
        const t = this.transpose(this.board);
        const merged = t.map((row) =>
          this.mergeRow([...row].reverse()).reverse(),
        );

        this.board = this.transpose(merged);
        break;
      }

      default:
        return false;
    }

    const changed = !this.boardsEqual(prev, this.board);

    if (changed) {
      this.addRandomTile();
      this.updateStatus();
    }

    return changed;
  }

  mergeRow(row) {
    const filtered = row.filter((v) => v !== 0);
    const result = [];
    let i = 0;

    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        this.score += merged;
        i += 2;
      } else {
        result.push(filtered[i]);
        i++;
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return result;
  }

  transpose(matrix) {
    const res = this.createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        res[r][c] = matrix[c][r];
      }
    }

    return res;
  }

  boardsEqual(a, b) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (a[r][c] !== b[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  has2048() {
    return this.board.some((row) => row.includes(2048));
  }

  hasMoves() {
    if (this.board.some((row) => row.includes(0))) {
      return true;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const v = this.board[r][c];

        if (r + 1 < this.size && this.board[r + 1][c] === v) {
          return true;
        }

        if (c + 1 < this.size && this.board[r][c + 1] === v) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.has2048()) {
      this.status = GAME_STATUS.WIN;

      return;
    }

    if (!this.hasMoves()) {
      this.status = GAME_STATUS.LOSE;
    }
  }
}

// CommonJS for tests
module.exports = Game;
module.exports.GAME_STATUS = GAME_STATUS;

// Browser global for main.js
if (typeof window !== 'undefined') {
  window.Game = Game;
  window.GAME_STATUS = GAME_STATUS;
}
