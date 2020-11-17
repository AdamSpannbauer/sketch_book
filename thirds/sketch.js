const canvasW = 512;
const canvasH = 512;

const step = 8;
const nLines = 40;
const radius = 200;
const D_ANGLE = Math.PI * (2 / 3);
let ANGLE = 0;

// const palette = [
//   [0, 0, 255],
//   [255, 0, 0],
//   [0, 200, 0],
//   220,
// ];

const palette = [
  [255, 51, 102],
  [46, 196, 182],
  [246, 247, 248],
  [1, 22, 39],
];

let fpsP;


function startPos(cx, cy, r, ra) {
  const x = cos(ra) * r + cx;
  const y = sin(ra) * r + cy;
  return [x, y];
}


function limitAngle(p, minA, maxA) {
  const currentA = p.heading();
  let da = 0;
  if (currentA < minA) {
    da = minA - currentA;
  } else if (currentA > maxA) {
    da = maxA - currentA;
  }

  p.rotate(da);
}


function wavyLine(x1, y1, x2, y2, noiseScale, r) {
  const nPts = 40;
  push();
  noFill();
  beginShape();
  let xi;
  let yi;
  const pt = createVector();
  for (let i = 0; i <= nPts; i += 1) {
    xi = map(i, 0, nPts, x1, x2);
    // yi = map(i, 0, nPts, y1, y2); // useless in case of constant y
    yi = y2;
    pt.x = xi;
    pt.y = yi;
    if (i > 0 && i < nPts - 1) {
      // Base noise off angle (asymmetric)
      // let n = noise(pt.heading() + ANGLE, yi * 0.01, frameCount * 0.01);
      // Base noise off x symmetric
      let n = noise(xi * 0.01, yi * 0.01, frameCount * 0.01);
      n = map(n, 0, 1, -noiseScale, noiseScale);
      pt.y += n;
    }
    limitAngle(pt, 0, D_ANGLE);
    pt.limit(r);
    vertex(pt.x, pt.y);
  }
  endShape();
  pop();
}


function drawLines(startA, stepSize, nSteps, r) {
  let x1 = 0;
  let y1 = 0;
  for (let i = 0; i < nSteps; i += 1) {
    [x1, y1] = startPos(0, 0, stepSize * i, startA);
    wavyLine(x1, y1, r, y1, i * 3.5, r);
  }
}

function drawWedge(startA, stepSize, nSteps, r) {
  drawLines(startA, stepSize, nSteps, r);
  arc(0, 0, r * 2, r * 2, 0, D_ANGLE);
}


function setup() {
  createCanvas(canvasW, canvasH);
  fpsP = createP();
}

function draw() {
  background(palette[3]);
  strokeWeight(2);
  fpsP.html(`fps: ${frameRate().toFixed(2)}`);

  noFill();
  translate(width / 2, height / 2);
  rotate(frameCount * 0.001);

  push();
  ANGLE = 0;
  stroke(palette[0]);
  drawWedge(D_ANGLE, step, nLines, radius);

  rotate(D_ANGLE);
  ANGLE += D_ANGLE;
  stroke(palette[1]);
  drawWedge(D_ANGLE, step, nLines, radius);

  rotate(D_ANGLE);
  ANGLE += D_ANGLE;
  stroke(palette[2]);
  drawWedge(D_ANGLE, step, nLines, radius);
  pop();

  stroke(palette[0]);
  drawLines(D_ANGLE, step, 1, radius);
}


window.draw = draw;
window.setup = setup;
