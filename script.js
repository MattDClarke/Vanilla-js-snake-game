import { randomElementFromArray, wait } from './utils.js';

export const foodItemsArray = [
  '🐁',
  '🍇',
  '🍉',
  '🍈',
  '🍓',
  '🍍',
  '🍌',
  '🥝',
  '🍏',
  '🍎',
  '🍔',
  '🍅',
  '🥚',
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.querySelector('span');
  const startBtn = document.querySelector('.start-btn');
  const keyBtns = document.querySelectorAll('.keys--container button');

  const width = 10;
  const numCells = width * width;
  grid.style.width = `${width * 10 * 2}px`;
  grid.style.height = `${width * 10 * 2}px`;
  let foodItemIndex = 0; // first cell
  let currentSnake = [2, 1, 0];
  let direction = 1;
  let score = 0;
  let intervalTime = 200; // determines speed - frequency of game loop calls
  let interval = 0;
  let snakeColor = Math.floor(Math.random() * 360);
  let snakeColorIncrement = 10;

  // create grid cells
  for (let i = 0; i < width * width; i++) {
    const cell = document.createElement('div');
    cell.style.width = `${width * 2}px`;
    cell.style.height = `${width * 2}px`;
    grid.appendChild(cell);
  }
  const cells = document.querySelectorAll('.grid div');

  async function createFood() {
    foodItemIndex = Math.floor(Math.random() * numCells);
    if (currentSnake.includes(foodItemIndex)) {
      await wait(100);
      createFood();
    } else {
      cells[foodItemIndex].classList.add('food-item');
      cells[foodItemIndex].innerText = randomElementFromArray(foodItemsArray);
    }
  }

  function startGame() {
    grid.classList.remove('shake');
    currentSnake.forEach((i) => {
      cells[i].style.background = 'none';
      cells[i].classList.remove('snake');
      cells[i].innerText = '';
    });
    cells[foodItemIndex].classList.remove('food-item');
    cells[foodItemIndex].innerText = '';
    clearInterval(interval);
    score = 0;
    direction = 1;
    scoreDisplay.innerHTML = score;
    currentSnake = [2, 1, 0];
    createFood();
    currentSnake.forEach((i) => {
      snakeColor += snakeColorIncrement % 360;
      cells[i].style.background = `hsl(${snakeColor}, 100%, 50%)`;
      cells[i].classList.add('snake');
    });
    interval = setInterval(gameLoop, intervalTime);
  }

  async function gameLoop() {
    cells[currentSnake[0]].innerText = '';
    /*
    Direction:
        right: +1
        left: -1
        up: +10
        down: -10
    */
    if (
      (currentSnake[0] + width >= width * width && direction === width) || // hits bottom wall
      (currentSnake[0] % width === width - 1 && direction === 1) || // hits right wall
      (currentSnake[0] % width === 0 && direction === -1) || // hits left wall
      (currentSnake[0] - width < 0 && direction === -width) || // hits the top wall
      cells[currentSnake[0] + direction].classList.contains('snake') // hits itself
    ) {
      grid.classList.add('shake');
      clearInterval(interval);
      return;
    }

    const tail = currentSnake.pop();
    cells[tail].classList.remove('snake');
    cells[tail].style.background = 'none';
    currentSnake.unshift(currentSnake[0] + direction); // gives direction to the head
    //deals with snake getting food-item
    if (cells[currentSnake[0]].classList.contains('food-item')) {
      cells[currentSnake[0]].classList.remove('food-item');
      cells[tail].classList.add('snake');
      snakeColor += snakeColorIncrement % 360;
      cells[tail].style.background = `hsl(${snakeColor}, 100%, 50%)`;
      currentSnake.push(tail);
      score++;
      scoreDisplay.textContent = score;
      createFood();
    }
    cells[currentSnake[0]].classList.add('snake');
    cells[currentSnake[0]].innerText = '👀';
    snakeColor += snakeColorIncrement % 360;
    cells[currentSnake[0]].style.background = `hsl(${snakeColor}, 100%, 50%)`;
  }

  function moveSnake(moveDirection) {
    if (
      !['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(
        moveDirection
      )
    )
      return;
    if (moveDirection === 'ArrowRight' && direction !== -1) {
      direction = 1;
    }
    if (moveDirection === 'ArrowLeft' && direction !== 1) {
      direction = -1;
    }
    if (moveDirection === 'ArrowUp' && direction !== width) {
      direction = -width;
    }
    if (moveDirection === 'ArrowDown' && direction !== -width) {
      direction = width;
    }
  }

  function handleKeyMove(e) {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key))
      return;
    moveSnake(e.key);
  }

  function handleButtonKeyMove(e) {
    const { id } = e.currentTarget;
    moveSnake(id);
  }

  document.addEventListener('keydown', handleKeyMove);
  startBtn.addEventListener('click', startGame);

  // moving snake - mobile - using screen btns
  keyBtns.forEach((keyBtn) => {
    keyBtn.addEventListener('mousedown', handleButtonKeyMove);
    keyBtn.addEventListener('touchstart', handleButtonKeyMove);
  });
});
