const canvasW = 512;
const canvasH = 512;

let grid;

const makeGridRow = (y, x1, x2, xGap = 30, z1 = 0, z2 = 50) => {
  const gridRow = [];
  for (let x = x1; x <= x2; x += xGap) {
    gridRow.push({ x, y, z: map(noise(x, y), 0, 1, z1, z2) });
  }
  return gridRow;
};

const makeGrid = (x1, x2, y1, y2, xGap = 30, yGap = 30) => {
  const gridPts = [];
  for (let y = y1; y <= y2; y += yGap) {
    const gridRow = makeGridRow(y, x1, x2, xGap);
    gridPts.push(gridRow);
  }

  return gridPts;
};


function setup() {
  createCanvas(canvasW, canvasH, WEBGL);

  grid = makeGrid(-width, width * 1.5, 0, height);
}

function draw() {
  background(200);
  rotateX(QUARTER_PI);
  translate(-width / 2, -height / 3);

  grid.forEach((row, i) => {
    if (i === grid.length - 1) {
      return;
    }

    const { y } = row[i];
    const { y: nextY, z: nextZ } = grid[i + 1][0];

    beginShape(TRIANGLE_STRIP);
    row.forEach(({ x, z }) => {
      vertex(x, y, z);
      vertex(x, nextY, nextZ);
    });
    endShape();
  });

  // grid.pop();
  // grid.splice(0, 0, makeGridRow(x1, x2));
}

window.setup = setup;
window.draw = draw;
