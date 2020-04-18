const canvas_w = 512;
const canvas_h = 512;


const circles = [];
const n_circles = 20;

const min_r = 15;


function setup() {
  createCanvas(canvas_w, canvas_h);

  let parent_r = 0;
  let parent_cp = createVector(width / 2, height / 2);
  let r = min_r;
  for (let i = 0; i < n_circles; i++) {
    const c = new Circle(r, parent_cp, parent_r);
    circles.push(c);

    parent_r = r;
    parent_cp = c.p;
    r *= 1.1;
  }
}


function draw() {
  background(250);

  for (let i = 0; i < circles.length; i++) {
    const c = circles[i];

    c.draw();
    c.update();
  }
}


class NoiseLoop {
  constructor(r, len) {
    this.r = r;
    this.len = len;
    this.a = 0;

    // assumes 60 fps and that this.update() is being once per frame
    this.da = TWO_PI / (60 * this.len);

    this.cx = random(100);
    this.cy = random(100);

    this.loop_i = 0;
    this.i;

    this.v = 0;
    this.set_v();
  }

  set_v() {
    const x = cos(this.a) * this.r + this.cx;
    const y = sin(this.a) * this.r + this.cy;
    this.v = noise(x, y);
  }

  update() {
    this.a += this.da;
    this.i++;

    if (this.a >= TWO_PI) {
      this.loop_i++;
      this.a -= TWO_PI;
    }

    this.set_v();
  }
}


class Circle {
  constructor(r, parent_cp, parent_r, a_seed) {
    this.r = r;
    this.pr = parent_r || 0;

    this.pcp = parent_cp || createVector(width / 2, height / 2);

    this.noise_loop = new NoiseLoop(0.1, 20);

    this.r_diff = 0;
    this.a = 0;
    this.sw = 0;
    this.p = createVector();

    this.set_r_diff();
    this.set_a();
    this.set_sw();
    this.set_p();

    this.t = 0;
    this.dt = 1;
  }

  set_r_diff() {
    if (this.pr) {
      this.dt = 1;
      if (this.noise_loop.loop_i % 2) {
        this.dt = -1;
      } else if(this.noise_loop.loop_i > 1) {
        background(255)
      }

      this.r_diff = abs(this.r - this.pr) * this.t * 0.01;
    } else {
      this.r_diff = 0;
    }
  }

  set_sw() {
    const offset = (this.noise_loop.v - 0.5) * 100;
    const scl = map(this.r, min_r, width, 20, 0.5);

    let sw = map(this.r, min_r, width, 1, 35);
    sw += offset;

    sw = constrain(sw, 0.5, this.r / scl);

    this.sw = sw;
  }

  set_a() {
    this.a = this.noise_loop.v * TWO_PI * 2;
  }

  set_p() {
    const x = cos(this.a) * this.r_diff + this.pcp.x;
    const y = sin(this.a) * this.r_diff + this.pcp.y;

    this.p.set(x, y);
  }

  update() {
    this.t += this.dt;
    this.noise_loop.update();

    this.set_r_diff();
    this.set_a();
    this.set_sw();
    this.set_p();
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    noFill();
    strokeWeight(this.sw);
    ellipse(0, 0, this.r * 2, this.r * 2);

    strokeWeight(this.sw * 2);
    ellipse(0, 0, this.r * 2, this.r * 2);

    pop();
  }
}
