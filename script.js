//Select Html elements

const grid = document.querySelector(".grid");
const timer = document.querySelector(".timer");
const endGameScreen = document.querySelector(".end-game-screen");
const endGameText = document.querySelector(".end-game-text");
const playAgainBtn = document.querySelector(".play-again");

const gridMatrix = [
  ["", "", "", "", "", "", "", "", ""],
  [
    "river",
    "wood",
    "wood",
    "river",
    "wood",
    "river",
    "river",
    "river",
    "river",
  ],
  ["river", "river", "river", "wood", "wood", "river", "wood", "wood", "river"],
  ["", "", "", "", "", "", "", "", ""],
  ["road", "bus", "road", "road", "road", "car", "road", "road", "road"],
  ["road", "road", "road", "car", "road", "road", "road", "road", "bus"],
  ["road", "road", "car", "road", "road", "road", "bus", "road", "road"],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
];

//Initialise variables that control the game
const victoryRow = 0;
const riverRows = [1, 2];
const roadRows = [4, 5, 6];
const duckPosition = { x: 4, y: 8 };
let contentBeforeDuck = "";
let time = 15;

function drawGrid() {
  grid.innerHTML = "";

  gridMatrix.forEach(function (gridRow, gridRowIndex) {
    gridRow.forEach(function (cellContent, cellContentIndex) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (riverRows.includes(gridRowIndex)) {
        cell.classList.add("river");
      } else if (roadRows.includes(gridRowIndex)) {
        cell.classList.add("road");
      }

      if (cellContent) {
        cell.classList.add(cellContent);
      }

      grid.appendChild(cell);
    });
  });
}

function placeDuck() {
  contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];
  gridMatrix[duckPosition.y][duckPosition.x] = "duck";
}

//Arrows or "WASD"
function moveDuck(event) {
  const key = event.key;
  gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

  switch (key.toUpperCase()) {
    case "ARROWUP":
    case "W":
      if (duckPosition.y > 0) duckPosition.y--;
      break;
    case "ARROWDOWN":
    case "S":
      if (duckPosition.y < 8) duckPosition.y++;
      break;
    case "ARROWLEFT":
    case "A":
      if (duckPosition.x > 0) duckPosition.x--;
      break;
    case "ARROWRIGHT":
    case "D":
      if (duckPosition.x < 8) duckPosition.x++;
      break;
  }

  render();
}

//Animation functions
function moveRight(gridRowIndex) {
  const currentRow = gridMatrix[gridRowIndex];

  const lastElement = currentRow.pop();
  currentRow.unshift(lastElement);
}

function moveLeft(gridRowIndex) {
  const currentRow = gridMatrix[gridRowIndex];

  const firstElement = currentRow.shift();
  currentRow.push(firstElement);
}

function animateGame() {
  //River
  moveRight(1);
  moveLeft(2);

  //Road
  moveRight(4);
  moveRight(5);
  moveRight(6);
}

// Win/Loss logic
function endGame() {
  clearInterval(countdownLoop);
  clearInterval(renderLoop);

  document.removeEventListener("keyup", moveDuck);
  endGameScreen.classList.remove("hidden");
}

function countdown() {
  if (time !== 0) {
    time--;
    timer.innerText = time.toString().padStart(5, "0");
  }
  if (time === 0) {
    endGame();
  }
}

//Rendering
function render() {
  placeDuck();
  drawGrid();
}

const renderLoop = setInterval(function () {
  gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;
  animateGame();
  render();
}, 600);

const countdownLoop = setInterval(countdown, 1000);

//Event listeners
document.addEventListener("keyup", moveDuck);
