const w = 640;
const h = 480;

const cx = w / 2;
const cy = h / 2;

const radius = h / 2.5;
const d = radius * 2;

let angle = 0;
const delta_angle = 0.2;

function setup() {
  createCanvas(w, h);
  angleMode(DEGREES);
}


function draw() {
  background(170, 30, 50);
  noStroke();

  translate(cx, cy);
  push();
  rotate(-angle);
  fill(255);
  arc(0, 0, d, d, 90, 270);
  fill(0);
  arc(0, 0, d, d, 270, 90);
  pop();

  rotate(angle);
  ellipse(0, radius / 2, radius);
  fill(255);
  ellipse(0, radius / 2, 30);

  ellipse(0, -radius / 2, radius);
  fill(0);
  ellipse(0, -radius / 2, 30);

  angle += delta_angle;
}
