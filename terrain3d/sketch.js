const canvasW = 512;
const canvasH = 512;

let zNoiseGrid;

const DEFAULT_NCOLS = 50;
const DEFAULT_NROWS = 50;
const DEFAULT_NOISE_STEP = 0.01;

let fpsDisplay;

/**
 * Make a 'row' of noise values (range `[0, 1]`).  All noise values will
 * be seeded with `noise(i * noiseStep, j * noiseStep)`; where `i` is
 * intened to represent row index a j represents column index.
 *
 * @param {number} i row index
 * @param {number} nCols how many noise values to generate for row
 * @param {number} noiseStep how far to space noise values
 *                           (i.e. `z = noise(i * noiseStep, j * noiseStep)`)
 */
const makeGridRow = (i, nCols = DEFAULT_NCOLS, noiseStep = DEFAULT_NOISE_STEP) => {
  const gridRow = [];
  for (let j = 0; j < nCols; j += 1) {
    const zNoise = noise(i * noiseStep, j * noiseStep);
    gridRow.push(zNoise);
  }
  return gridRow;
};

/**
 * Make a grid of noise values (range `[0, 1]`).  All noise values will
 * be seeded with `noise(i * noiseStep, j * noiseStep)`; where `i` represents
 * row index a j represents column index.
 *
 * @param {number} nRows how many rows of noise values to generate
 * @param {number} nCols how many noise values to generate per row
 * @param {number} noiseStep how far to space noise values
 *                           (i.e. `z = noise(i * noiseStep, j * noiseStep)`)
 */
const makeGrid = (nRows = DEFAULT_NROWS, nCols = DEFAULT_NCOLS, noiseStep = DEFAULT_NOISE_STEP) => {
  const gridArr = [];
  for (let i = 0; i < nRows; i += 1) {
    const gridRow = makeGridRow(i, nCols, noiseStep);
    gridArr.push(gridRow);
  }

  return gridArr;
};

/**
 *
 * @param {array} grid a 2d array of noise values (i.e. output of `makeGrid()`)
 * @param {number} x1 min x value of grid
 * @param {number} x2 max x value of grid
 * @param {number} y1 min y value of grid
 * @param {number} y2 max y value of grid
 * @param {number} z1 min z value. Noise values in grid are assumed to be `[0, 1]`;
 *                    these values will be mapped to `[z1, z2]` before draw
 * @param {number} z2 min z value. Noise values in grid are assumed to be `[0, 1]`;
 *                    these values will be mapped to `[z1, z2]` before draw
 */
const drawGrid = (grid, x1, x2, y1, y2, z1 = -100, z2 = 100) => {
  // Assuming all rows of grid are same len
  const nRows = grid.length;
  const nCols = grid[0].length;

  // Assuming y1 < y2 && x1 < x2
  const yGap = (y2 - y1) / nRows;
  const xGap = (x2 - x1) / nCols;

  for (let i = 0; i < nRows - 1; i += 1) {
    beginShape(TRIANGLE_STRIP);

    // Use row indices to calc y positions
    const y = i * yGap;
    const nextY = (i + 1) * yGap;

    for (let j = 0; j < nCols; j += 1) {
      // Use col index to calc x position
      const x = j * xGap;

      // Look up and map z values for heights
      const z = map(grid[i][j], 0, 1, z1, z2);
      const nextZ = map(grid[i + 1][j], 0, 1, z1, z2);

      vertex(x, y, z);
      vertex(x, nextY, nextZ);
    }
    endShape();
  }
};


function setup() {
  createCanvas(canvasW, canvasH, WEBGL);

  // eslint-disable-next-line no-undef
  fpsDisplay = createP();

  zNoiseGrid = makeGrid();
}

function draw() {
  // Display current fps
  fpsDisplay.html(frameRate().toFixed(2));


  background(200);
  rotateX(QUARTER_PI);
  translate(-width / 2, -height / 3);

  drawGrid(zNoiseGrid, 0, width, 0, height);

  // Add new row to top of grid
  // Top of grid originates at i=0; using -frameCount
  // will decrement from 0 -> -1 -> -2 -> etc.
  zNoiseGrid.pop();
  zNoiseGrid.splice(0, 0, makeGridRow(-frameCount));
}

window.setup = setup;
window.draw = draw;
