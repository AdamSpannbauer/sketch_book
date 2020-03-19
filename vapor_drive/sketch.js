const canvas_w = 512;
const canvas_h = 512;
const scl = 15;

const terrain = [];

const noise_scl = 0.2;

let cols;
let rows;
let t = 0;
const r = 30;

const fps = 15
const loop_sec = 50
const dt = (Math.PI * 2) / (fps * loop_sec)


function gen_row(y, t) {
  const row = [];
  const mp = cols / 2;
  const tz = r * sin(t);

  if (t < TWO_PI) {
  	background(0);
  }

  if (t > 2 * TWO_PI) {
  	background(0);
  }

  for (let x = 0; x < cols; x++) {
    let max_val;

    if (x > cols * 0.45 && x < cols * 0.55) {
      max_val = 30;
    } else {
      max_val = map(abs(mp - x), 0, mp, 0, 500);
    }

    let z = noise(x * noise_scl, y * noise_scl, tz);
    z = map(z, 0, 1, 0, max_val);

    row[x] = z;
  }

  return row;
}

function scale_x(x) {
  return x * scl - width / 2;
}


function scale_y(y) {
  return y * scl - height / 2;
}


function setup() {
  createCanvas(canvas_w, canvas_h, WEBGL);
  frameRate(fps);

  cols = floor(width * 2 / scl);
  rows = floor(height * 2 / scl);

  for (let y = 0; y < rows; y++) {
  	const row = gen_row(y, t);
  	terrain.push(row);
  }
}


function draw() {
  background(40, 0, 0);

  const b = 100;
  pointLight(b, b, b, -width / 2, 0, 100);
  pointLight(b, b, b, width / 2, 0, 100);

  pointLight(b, b, b, -width / 2, 100, 100);
  pointLight(b, b, b, width / 2, 100, 100);


  rotateX(PI * 0.45);
  translate(-width / 2, -height / 2);

  push();
  translate(width / 2, -700);
  noStroke();
  ambientMaterial(194, 109, 70);

  pointLight(b, b, b, 0, 10, 700);
  pointLight(b, b, b, -width / 2, 10, 700);
  pointLight(b, b, b, width / 2, 10, 700);

  pointLight(b, b, b, 0, 0, 1000);
  pointLight(b, b, b, -width / 2, 100, 1000);
  pointLight(b, b, b, width / 2, 100, 1000);

  sphere(500, 24, 24);
  pop();

  stroke(10, 190, 220);
  ambientMaterial(10, 190, 220);
  for (let y = 1; y < rows; y++) {
  	beginShape(TRIANGLE_STRIP);
  	for (let x = 1; x < cols; x++) {
  		const scl_x = scale_x(x);
  		const scl_y = scale_y(y);
  		const scl_y2 = scale_y(y + 1);

  		vertex(scl_x, scl_y, terrain[y - 1][x]);
  		vertex(scl_x, scl_y2, terrain[y][x]);
  	}
  	endShape();
  }

  t += dt;

  const new_row = gen_row(terrain.length, t);
  terrain.splice(terrain.length - 1, 1);
  terrain.unshift(new_row);
}
