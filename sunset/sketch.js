const canvasW = 512;
const canvasH = 512;

// sunset ordered from sun to night ocean
const colors = [
  [232, 159, 6], // orange
  [238, 196, 124], // light orange
  [205, 93, 45], // orange
  [81, 134, 130], // light blue
  [27, 48, 98], // dark blue
  [18, 23, 47], // ocean at night
];


// eslint-disable-next-line no-unused-vars
function setup() {
  createCanvas(canvasW, canvasH);
}


// eslint-disable-next-line no-unused-vars
const da = 0.001;
let a = 0;
function draw() {
  background(10, 10, 10);
  randomSeed(1337);

  translate(width / 2, height / 3);

  // Sun
  const sunD = 100;
  noStroke();
  fill(colors[0]);
  ellipse(0, 0, sunD, sunD);

  // Sun circles
  noFill();
  strokeWeight(2);

  const step = 8;
  let start;
  let nRings;
  const minRings = 5;
  const maxRings = 13;

  // Sun circles 1
  push();
  rotate(a);
  stroke(colors[1]);
  start = sunD + step;
  nRings = random(minRings, maxRings);
  dottedArcs(start, nRings, step, colors[1]);
  pop();

  // Sun circles 2
  push();
  rotate(-a * 0.5);
  start += step * nRings + step;
  nRings = random(minRings, maxRings);
  dottedArcs(start, nRings, step, colors[2]);
  pop();

  // Sun circles 3
  push();
  rotate(a * 0.5 * 0.5);
  start += step * nRings + step;
  nRings = random(minRings, maxRings);
  dottedArcs(start, nRings, step, colors[3]);
  pop();

  // Sun circles 4
  push();
  rotate(-a * 0.5 * 0.5 * 0.5);
  start += step * nRings + step;
  nRings = random(minRings, maxRings);
  dottedArcs(start, nRings, step, colors[4]);
  pop();

  // Sun circles 5
  push();
  rotate(a * 0.5 * 0.5 * 0.5 * 0.5);
  start += step * nRings + step;
  nRings = random(minRings, maxRings);
  dottedArcs(start, nRings, step, colors[5]);
  pop();

  // ocean
  const c = colors[3];
  translate(-width / 2, 0);

  noStroke();
  fill(10, 170);
  rect(0, 0, width, height);

  strokeWeight(3);
  for (let y = 0; y < height + 10; y += 5) {
    wavyLine(-10, y, width + 10, y, c);
  }

  a += da;
}

function wavyLine(x1, y1, x2, y2, c) {
  const nSteps = 10;
  const step = (x2 - x1) / nSteps;

  const cc = color(c);
  cc.levels[0] += map(y1, 0, height, 30, -300);
  cc.levels[1] += map(y1, 0, height, 30, -300);
  cc.levels[2] += map(y1, 0, height, 30, -300);

  push();
  noFill();
  stroke(cc);
  beginShape();
  curveVertex(x1, y1);
  curveVertex(x1, y1);
  let x;
  let y;
  let offset;
  for (let i = 0; i < nSteps; i++) {
    x = map(i, 0, nSteps, x1, x2);
    y = map(i, 0, nSteps, y1, y2);
    offset = map(noise(x * 0.1, y * 0.1, frameCount * 0.008), 0.2, 0.8, -10, 10);

    curveVertex(x, y + offset);
  }
  curveVertex(x2, y2);
  curveVertex(x2, y2);
  endShape();
  pop();
}

function dottedArc(cx, cy, rx, ry, a1, a2, seed) {
  if (seed) {
    randomSeed(seed);
  }

  const da = 0.1;
  const chance = 0.3;

  for (let a = a1 + da; a < a2; a += da) {
    if (random() > chance) {
      arc(cx, cy, rx, ry, a - da, a);
    }
  }
}

function dottedArcs(start, nRings, step, c) {
  push();
  noFill();
  stroke(c);

  let d;
  let startA;
  for (let i = 0; i < nRings; i++) {
    d = start + i * step;
    startA = random(0, TWO_PI);
    dottedArc(0, 0, d, d, startA, startA + TWO_PI, i * d * startA);
  }
  pop();
}
