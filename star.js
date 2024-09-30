var cols = 60;
var rows = 40;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var endSet = false;
var resetButton;
var path = [];
var noSolution = false;

function heuristic(a, b) {
  // var d = dist(a.i, a.j, b.i, b.j);
  var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

function removeFromArr(arr, element) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === element) {
      arr.splice(i, 1);
    }
  }
}
function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbours = [];
  this.previous = undefined;

  this.wall = false;
  if (random(1) < 0.2) {
    this.wall = true;
  }

  this.show = function (col) {
    fill(col);
    if (this.wall) {
      fill(255, 255, 255);
    }

    noStroke();
    rect(this.i * w, this.j * h, w, h);
    stroke(0);
    strokeWeight(2);
    if (this.i === 0) {
      line(this.i * w, this.j * h, this.i * w, (this.j + 1) * h);
    }
    if (this.j === 0) {
      line(this.i * w, this.j * h, (this.i + 1) * w, this.j * h);
    }
    if (this.i === cols - 1) {
      line((this.i + 1) * w, this.j * h, (this.i + 1) * w, (this.j + 1) * h);
    }
    if (this.j === rows - 1) {
      line(this.i * w, (this.j + 1) * h, (this.i + 1) * w, (this.j + 1) * h);
    }
  };

  this.addNeighbours = function (grid) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) {
      this.neighbours.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbours.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbours.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbours.push(grid[i][j - 1]);
    }

    // Diagonals path
    if (i > 0 && j > 0) {
      this.neighbours.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbours.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbours.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbours.push(grid[i + 1][j + 1]);
    }
  };
}

function setup() {
  createCanvas(600, 400);
  w = width / cols;
  h = height / rows;
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }

  start = grid[0][0];

  resetButton = createButton("Reset");
  resetButton.position(10, height + 10);
  resetButton.mousePressed(resetGrid);
}

function draw() {
  background(184, 184, 185);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(184, 184, 185));
    }
  }
  if (endSet) {
    if (openSet.length > 0) {
      // keep going
      var winner = 0;
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }

      var current = openSet[winner];

      if (current === end) {
        var length = path.length * 10;
        var cost = length * 0.03;
        console.log("Total meters =", length);
        console.log("Total cost =", cost);
        noLoop();
      }

      closedSet.push(current);
      removeFromArr(openSet, current);

      var neighbours = current.neighbours;
      for (var i = 0; i < neighbours.length; i++) {
        var neighbour = neighbours[i];

        if (!closedSet.includes(neighbour) && !neighbour.wall) {
          var tempG = current.g + 1;

          var newPath = false;
          if (openSet.includes(neighbour)) {
            if (tempG < neighbour.g) {
              neighbour.g = tempG;
              newPath = true;
            }
          } else {
            neighbour.g = tempG;
            newPath = true;
            openSet.push(neighbour);
          }
          if (newPath) {
            neighbour.h = heuristic(neighbour, end);
            neighbour.f = neighbour.g + neighbour.h;
            neighbour.previous = current;
          }
        }
      }
    } else {
      // stop/no solution
      console.log("NOPE");
      noSolution = true;
      noLoop();
    }
    if (!noSolution) {
      path = [];
      var temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }
    }

    for (var i = 0; i < path.length; i++) {
      path[i].show(color(0, 0, 255));
    }

    // stroke(0, 0, 255);
    // strokeWeight(w);
    // noFill();
    // beginShape();
    // for (var i = 0; i < path.length; i++) {
    //   vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
    // }
    endShape();
    if (end) {
      end.show(color(255, 255, 0));
    }
  }
  start.show(color(0, 255, 0));
}
function mousePressed() {
  var i = floor(mouseX / w);
  var j = floor(mouseY / h);
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    var clickedSpot = grid[i][j];
    if (!endSet) {
      if (!clickedSpot.wall) {
        end = clickedSpot;
        endSet = true;
        openSet = [];
        closedSet = [];
        openSet.push(start);
        loop();
      }
    }
  }
}

function resetGrid() {
  closedSet = [];
  openSet = [];
  openSet.push(start);
  end = undefined;
  endSet = false;
  loop();
}
