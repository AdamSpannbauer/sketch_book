const canvas_w = 512;
const canvas_h = 512;

const min_border = canvas_w * 0.05;
const max_border = canvas_w * 0.35;
let border = min_border;
let delta_border = -0.5;

let box_w = canvas_w - border * 2;
let box_h = canvas_h - border * 2;

const nballs = 5;
const balls = [];

const rotate_every = 1;
let rotate_count = 0;

let angle = 0;
const delta_angle = 90;
const angle_step = 1;
let cum_angle = 0;

function setup() {
  createCanvas(canvas_w, canvas_h);
  rectMode(CENTER);
  angleMode(DEGREES);

  for (let i = 0; i < nballs; i++) {
    const x = random(-box_w / 2 + 50, box_w / 2 - 50);
    const y = random(-box_h / 2 + 50, box_h / 4);
    const r = random(canvas_w * 0.02, canvas_w * 0.09);
    const ball = new BouncyBall(x, y, r);

    balls.push(ball);
  }

  balls[0].fill = [70, 140, 140, 180];
}


function draw() {
  clear();
  translate(width / 2, height / 2);
  rotate(angle);

  background(180, 100, 70);

  fill(120, 40, 10);
  noStroke();
  rect(0, 0, box_w, box_h);

  for (const ball of balls) {
    ball.ax = sin(angle);
    ball.ay = cos(angle);

    ball.update();
    ball.draw();
  }

  if (rotate_count >= rotate_every) {
    if (cum_angle < delta_angle) {
      angle += angle_step;
      cum_angle += angle_step;
    } else {
      cum_angle = 0;
      rotate_count = 0;
    }
  }

  border += delta_border;
  if (border <= min_border | border >= max_border) {
    delta_border *= -1;
    border += 2 * delta_border;
  }

  box_w = canvas_w - border * 2;
  box_h = canvas_h - border * 2;

  rotate_count++;
}

class BouncyBall {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.ax = 0;
    this.ay = 0;
    this.vx = 10;
    this.vy = 10;

    this.max_v = 20;
    this.decay = 0.999;

    this.fill = [random(90, 110), random(170, 190), random(60, 80), 100];
  }

  update() {
    if (this.y + this.r > box_h / 2) {
      this.vy *= -1;
      this.y = box_h / 2 - this.r * 1.2;
    } else if (this.y - this.r < -box_h / 2) {
      this.vy *= -1;
      this.y = -box_h / 2 + this.r * 1.2;
    }

    if (this.x + this.r > box_w / 2) {
      this.vx *= -1;
      this.x = box_h / 2 - this.r * 1.2;
    } else if (this.x - this.r < -box_w / 2) {
      this.vx *= -1;
      this.x = -box_h / 2 + this.r * 1.2;
    }

    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.decay;
    this.vy *= this.decay;

    this.vx = this.vx / abs(this.vx) * min([abs(this.vx), this.max_v]);
    this.vy = this.vy / abs(this.vy) * min([abs(this.vy), this.max_v]);

    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    push();
    fill(this.fill);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
    pop();
  }
}
