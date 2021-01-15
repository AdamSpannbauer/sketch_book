const canvasW = 512;
const canvasH = 512;

let grid;

const makeGrid = (x1, x2, y1, y2, xGap = 30, yGap = 30) => {
  const gridPts = [];
  for (let y = y1; y <= y2; y += yGap) {
    const gridRow = [];
    for (let x = x1; x <= x2; x += xGap) {
      gridRow.push({ x, y });
    }
    gridPts.push(gridRow);
  }

  return gridPts;
};


function setup() {
  createCanvas(canvasW, canvasH, WEBGL);

  grid = makeGrid(0, width, 0, height);
}

function draw() {
  background(200);
  translate(-width / 2, -height / 3);
  rotateX(QUARTER_PI);

  grid.forEach((row, i) => {
    if (i === grid.length - 1) {
      return;
    }

    const { y } = row[i];
    const { y: nextY } = grid[i + 1][0];

    beginShape(TRIANGLE_STRIP);
    row.forEach(({ x }) => {
      vertex(x, y);
      vertex(x, nextY);
    });
    endShape();
  });
}

window.setup = setup;
window.draw = draw;
