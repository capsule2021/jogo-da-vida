const game_cvs = document.getElementById("game_cnv");

const play_button = document.getElementById("play-button");
const stop_button = document.getElementById("stop-button");
const clear_button = document.getElementById("clear-button");

var start = true;
const chart_cvs = document.getElementById("chart_cnv");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const resolution = 5;
canvas.width = 800;
canvas.height = 600;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

function buildGrid() {
  return new Array(COLS)
    .fill(null)
    .map(() =>
      new Array(ROWS).fill(null).map(() => Math.floor(Math.random() * 2))
    );
}

let grid = buildGrid();

requestAnimationFrame(update);

function update() {
  grid = nextGen(grid);
  render(grid);
  if (!start) {
    return;
  }

  requestAnimationFrame(update);
}

function nextGen(grid) {
  const nextGen = grid.map((arr) => [...arr]);

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
            const currentNeighbour = grid[col + i][row + j];
            numNeighbours += currentNeighbour;
          }
        }
      }
      if (cell === 1 && numNeighbours < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbours > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbours === 3) {
        nextGen[col][row] = 1;
      }
    }
  }
  return nextGen;
}

function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];

      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell ? "white" : "black";
      ctx.fill();
      ctx.stroke();
    }
  }
}

play_button.addEventListener("click", () => {
  if (!start) {
    start = true;
    requestAnimationFrame(update);
  }
});

stop_button.addEventListener("click", () => {
  if(start){
    start = false;
    requestAnimationFrame(update);
  }

});

clear_button.addEventListener("click", () => {
  window.location.reload(false); 
});