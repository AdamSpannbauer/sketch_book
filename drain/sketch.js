const canvas_w = 512;
const canvas_h = 512;

const balls = [];
const n_balls = 100;

let palette;

function setup() {
  createCanvas(canvas_w, canvas_h);
  fps_p = createP();

  palette = [
    color('#f9c80e'),
    color('#f86624'),
    color('#ea3546'),
    color('#662e9b'),
    color('#43bccd'),
  ];

  for (let i = 0; i < n_balls; i++) {
    const ball = new Ball();
    balls.push(ball);
  }
}


function draw() {
  gradient_background(color(250), color(100));
  fps_p.html(frameRate().toFixed(1));

  for (const ball of balls) {
    ball.draw();
    ball.update();
  }

  push();
  noStroke();
  fill(0, 50);
  rect(0, height / 2, width, height / 2);
  pop();
}


function gradient_background(c1, c2) {
  push();
  noFill();
  for (let y = 0; y <= height; y++) {
    const inter = map(y, 0, height, 0, 1);
    const c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
  pop();
}


function rand_color(colors) {
  let c;
  if (!colors) {
    c = [random(100, 255), random(100, 255), random(100, 255)];
  } else {
    const off = 3;
    c = random(colors);
    c.levels[0] += random(-off, off);
    c.levels[1] += random(-off, off);
    c.levels[2] += random(-off, off);
  }

  return color(c);
}


class Ball {
  constructor(r) {
    const min_r = 1;
    const max_r = 40;
    this.r = random(min_r, max_r);
    this.scl = map(this.r, min_r, max_r, 1.5, 0.3);

    this.x_noise = random(100);
    this.y_noise = random(100);
    this.offset = null;

    this.p = createVector();

    this.fill = rand_color(palette);
    this.dull = color(random(0, 40));
    this.fill_i = color(0);

    this.update();
  }

  map_color(color_a, color_b) {
    const buffer = 150;

    const [r1, g1, b1, a1] = color_a.levels;
    const [r2, g2, b2, a2] = color_b.levels;

    const r = map(this.p.y, buffer, height - buffer, r1, r2, true);
    const g = map(this.p.y, buffer, height - buffer, g1, g2, true);
    const b = map(this.p.y, buffer, height - buffer, b1, b2, true);

    return color([r, g, b]);
  }

  update() {
    const buffer = height * 0.75;
    this.p.x = noise(this.x_noise) * (width + buffer) - (buffer / 2);
    this.p.y = noise(this.y_noise) * (height + buffer) - (buffer / 2);

    this.offset = map(this.p.y, 0, height, 0.005, 0.0005);
    this.offset *= this.scl;

    if (this.p.y > height / 2) {
      this.offset *= 0.75;
    } else {
      this.offset *= 1.2;
    }

    this.x_noise += this.offset;
    this.y_noise += this.offset;

    this.fill_i = this.map_color(this.fill, this.dull);
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    fill(this.fill_i);
    noStroke();
    ellipse(0, 0, this.r * 2, this.r * 2);
    pop();
  }
}
