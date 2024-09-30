let cols;
let rows;
let grid = [];
let w, h;
let drawingMode = false;
let isDragging = false;
let drawButton;

function setup() {
  cols = prompt("Enter number of rows:", 60);
  rows = prompt("Enter number of cols:", 50);

  cols = parseInt(cols);
  rows = parseInt(rows);

  createCanvas(600, 400);

  w = width / cols;
  h = height / rows;

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 1;
    }
  }

  drawButton = createButton("Toggle Drawing Mode");
  drawButton.position(10, height + 10);
  drawButton.mousePressed(toggleDrawingMode);
  copyButton = createButton("Copy Grid to Clipboard");
  copyButton.position(10, height + 40);
  copyButton.mousePressed(copyGridToClipboard);

  drawGrid();
}

function draw() {
  drawGrid();

  if (isDragging && mouseX < width && mouseY < height) {
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);

    if (drawingMode) {
      grid[i][j] = 0;
    } else {
      grid[i][j] = 1;
    }
  }
}

function drawGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        fill(255, 255, 255);
      } else {
        fill(0);
      }
      stroke(0);
      rect(i * w, j * h, w, h);
    }
  }
}

function toggleDrawingMode() {
  drawingMode = !drawingMode;
  if (drawingMode) {
    drawButton.html("Path");
  } else {
    drawButton.html("Wall");
  }
}

function mousePressed() {
  isDragging = true;
}

function mouseReleased() {
  isDragging = false;

  console.log(grid);
}

function copyGridToClipboard() {
  const gridString = JSON.stringify(grid);
  navigator.clipboard
    .writeText(gridString)
    .then(() => {
      console.log("Grid copied to clipboard!");
      alert("Grid copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy grid: ", err);
    });
}
