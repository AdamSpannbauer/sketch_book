const canvas_w = 512;
const canvas_h = 512;


let girl_im;
const girl_im_w = 100;
let girl_im_h;


const red = [217, 18, 23];
const yellow = [240, 243, 94];
const blue = [1, 147, 170];
const orange = [230, 102, 27];
const brown = [203, 150, 108];
const white = [250, 250, 250];
const green = [90, 165, 162];

const petals = [];
const n_petals = 5;

const line_colors = [red, yellow, blue, orange, brown, white, green];
let ball_lines = [];


function preload() {
  girl_im = loadImage('girl_brown.png');
}


function setup() {
  createCanvas(canvas_w, canvas_h);
  imageMode(CENTER);

  girl_im_h = girl_im.height * girl_im_w / girl_im.width;

  const r = 15;
  for (let i = 0; i < line_colors.length; i++) {
    const c = line_colors[i];
    const y = height * 0.5 + r * 2 * i;
    const ball_line = new BallLine(y, c, r);
    ball_lines.push(ball_line);
  }

  let x = width / 2 - 150;
  for (let i = 0; i < n_petals; i++) {
    const dir = i % 2 == 0 ? 1 : -1;
    const petal = new Petal(x + dir * 10, height / 2 - 50 * i, dir);
    petals.push(petal);
  }

  x = width / 2 + 150;
  for (let i = 0; i < n_petals; i++) {
    const dir = i % 2 == 0 ? 1 : -1;
    const petal = new Petal(x + dir * 10, height / 2 - 50 * i, dir);
    petals.push(petal);
  }

  background(brown);
}


function draw() {
  let n_done = false;
  for (const bl of ball_lines) {
    bl.draw();
    bl.update();
    n_done += bl.done;
  }

  if (n_done == ball_lines.length) {
    const b1 = ball_lines[0];
    const b2 = ball_lines[ball_lines.length - 1];

    ball_lines = [];

    const new_b1 = new BallLine(b1.y - b1.r * 2, b1.fill, b1.r * 1.8, b1.v * -1);
    ball_lines.push(new_b1);

    const new_b2 = new BallLine(b2.y + b2.r * 2, b2.fill, b2.r * 1.8, b2.v * -1);
    ball_lines.push(new_b2);
  }

  for (const petal of petals) {
    petal.draw();
    petal.update();
  }

  image(girl_im, width / 2, height / 2, girl_im_w, girl_im_h);
}


class BallLine {
  constructor(y, f, r, v) {
    this.y = y;
    this.fill = f;
    this.r = r || 10;

    this.v = v || 1;
    if (this.v > 0) {
      this.x = 0 - this.r;
      this.x2 = width + this.r;
    } else {
      this.x = width + this.r;
      this.x2 = 0 - this.r;
    }

    this.done = false;
  }

  update() {
    this.x += this.v;
    if ((this.v > 0 && this.x > this.x2) || (this.v < 0 && this.x < this.x2)) {
      this.done = true;
    }
  }

  draw() {
    push();
    stroke(this.fill);
    strokeWeight(2);
    fill(this.fill);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
    pop();
  }
}


class Petal {
  constructor(x, y, dir) {
    this.p = createVector(x, y);
    this.dir = dir;
    this.min_r = 2;
    this.max_r = 20;
    this.r = this.min_r;

    this.t = 0;
    this.max_t = 400;

    this.fill = red.map((x) => x + 15);

    this.p_hist = [];
    this.p_hist.push(this.p.copy());

    this.r_hist = [];
    this.r_hist.push(this.r);
  }

  update() {
    if (this.t > this.max_t) {
      return;
    }

    if (this.dir > 0) {
      this.p.x += this.t * 0.0005;
    } else {
      this.p.x -= this.t * 0.0005;
    }

    this.p.y-=0.2;
    this.p_hist.push(this.p.copy());

    this.t++;
    this.r = map(this.t, 0, this.max_t, this.min_r, this.max_r);
    this.r_hist.push(this.r);
  }

  draw() {
    push();
    noStroke();
    fill(this.fill);
    for (let i = 0; i < this.p_hist.length; i++) {
      const p = this.p_hist[i];
      const r = this.r_hist[i];
      ellipse(p.x, p.y, r * 2, r * 2);
    }
    pop();
  }
}
