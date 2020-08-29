const canvas_w = 512;
const canvas_h = 512;

let balls = [];

const r = 512 / 20;
const n_rows = 12;
const n_cols = 12;
let n_segs = 2

function make_grid(n_segments) {
  const x1 = width / 2 - r * (n_cols - 1)
  const y1 = height / 2 - r * (n_rows - 1)
  for (let row = 0; row < n_rows; row++) {
    for (let col = 0; col < n_cols; col++) {
      const x = x1 + r * 2 * col
      const y = y1 + r * 2 * row
      const ball = new Ball(x, y, r, n_segments)

      balls.push(ball)
    }
  }
}

function setup() {
  createCanvas(canvas_w, canvas_h);
  make_grid(n_segs)
  noStroke()
  fill(255, 100)
}

let a = 0

function draw() {
  background(43, 143, 100);

  translate(width / 2, height / 2)
  rotate(a)
  translate(-width / 2, -height / 2)

  let moving = false
  let reset = false

  for (const ball of balls) {
    ball.draw()
    ball.update()
    moving = moving || ball.moving
    reset = reset || ball.reset
  }

  if (!moving && !reset) {
    // const i = floor(random(n_segs))
    const i = 1

    let d = r * 2
    if (random() > 0.5) {
      // d *= -1
    }

    if (a == 0) {
      a = PI / 2
    } else {
      a = 0
    }
    // a = 0
    // if (random() > 0.5) {
    //   a = PI / 2
    // }
    for (const ball of balls) {
      const seg = ball.segs[i]
      seg.set_p2(seg.p.x + d, seg.p.y, 100)
    }
    reset = true
  } else if (reset) {
    balls = [];
    n_segs = ceil(random(1, 10))
    n_segs = 2
    make_grid(n_segs)
    reset = false
  }
}


class Ball {
  constructor(x, y, r, n_seg) {
    this.p = createVector(x, y)
    this.r = r
    this.n_seg = n_seg || 2.0
    this.segs = []
    this.moving = false

    const a_step = TWO_PI / this.n_seg
    for (let i = 0; i < this.n_seg; i++) {
      const a1 = i * a_step
      const a2 = (i + 1) * a_step

      const seg = new BallSeg(this.p.x, this.p.y, this.r, a1, a2)
      this.segs.push(seg)
    }
  }

  update() {
    this.moving = false
    this.reset = false
    for (const seg of this.segs) {
      seg.update()
      this.moving = this.moving || seg.moving
      this.reset = this.reset || seg.reset
    }
  }

  draw() {
    push()
    for (const seg of this.segs) {
      seg.draw()
    }
    pop()
  }
}

class BallSeg {
  constructor(x, y, r, a1, a2) {
    this.p = createVector(x, y)
    this.r = r
    this.a1 = a1
    this.a2 = a2

    this.p1 = this.p.copy()
    this.p2 = createVector()
    this.n_steps = 0
    this.step = 0
    this.moving = false
  }

  set_p2(x, y, n_steps) {
    this.p1 = this.p.copy()
    this.p2.x = x
    this.p2.y = y
    this.n_steps = n_steps
    this.step = 0
    this.moving = true
  }

  update() {
    if (this.n_steps > 0 && this.step <= this.n_steps) {
      this.moving = true

      this.p.x = map(this.step, 0, this.n_steps, this.p1.x, this.p2.x, true)
      this.p.y = map(this.step, 0, this.n_steps, this.p1.y, this.p2.y, true)
      this.step++
    } else {
      this.moving = false
    }

    this.reset = this.p.x == this.p2.x && this.p.y == this.p2.y
  }

  draw() {
    push()
    translate(this.p.x, this.p.y)

    const f = map(
      dist(width / 2, height / 2, this.p.x, this.p.y), 0, width * 0.7, 250, 30
    )
    fill(f, 100)

    arc(0, 0, this.r * 2, this.r * 2, this.a1, this.a2)
    pop()
  }
}