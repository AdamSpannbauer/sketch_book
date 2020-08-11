const canvas_w = 512;
const canvas_h = 512;

const balls = [];
const n_rows = 5;
const n_cols = 5;

const min_r = 20;
const max_r = 100;

const t_off = 0.01
const p_off = 0.001


function setup() {
  createCanvas(canvas_w, canvas_h);

  const r = min_r * 0.8 + max_r * 0.2

  const x1 = width / 2 - r * (n_cols - 1)
  const y1 = height / 2 - r * (n_rows - 1)
  for (let row = 0; row < n_rows; row++) {
    for (let col = 0; col < n_cols; col++) {
      const x = x1 + r * 2 * col
      const y = y1 + r * 2 * row
      const ball = new Ball(x, y)

      balls.push(ball)
    }
  }
}


function draw() {
  background(250);
  strokeWeight(3);
  for (const ball of balls) {
    ball.draw()
    ball.update()
  }
}


class Ball {
  constructor(x, y) {
    this.p = createVector(x, y)
    this.r = null

    this.hist = []
    this.max_hist = 10

    this.update()
  }

  update() {
    this.r = noise(
      this.p.x * p_off, this.p.y * p_off, frameCount * t_off
    )
    this.r = map(this.r, 0, 1, min_r, max_r)

    this.hist.push(this.r)
    if (this.hist.length >= this.max_hist) {
      this.hist.shift()
    }
  }

  draw() {
    push()
    noFill()
    translate(this.p.x, this.p.y)
    for (const r of this.hist) {
      stroke(0, 0, 255)
      ellipse(0, 0, r * 2 * 0.99, r * 2 * 0.99)
      stroke(255, 0, 0)
      ellipse(0, 0, r * 2 * 1.01, r * 2 * 1.01)
      stroke(0)
      ellipse(0, 0, r * 2, r * 2)
    }
    pop()
  }
}