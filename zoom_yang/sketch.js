const canvas_w = 512;
const canvas_h = 512;

const zoomers = [];
const n_zoomers = 10;

let p;
const r_scale = 1.11;

let noise_loop;


function setup() {
  createCanvas(canvas_w, canvas_h);
  p = createVector(width / 2, height / 2);

  noise_loop = new NoiseLoop(4, 1 / 2);

  let prev_r = width / 2;

  for (let i = 0; i < n_zoomers; i++) {
    const r = prev_r * r_scale;
    prev_r = r;

    const zoomer = new Zoomer(p, r, noise_loop.noise());
    zoomers.push(zoomer);
  }
}


function draw() {
  background(200);

  for (let i = zoomers.length - 1; i >= 0; i--) {
    const zoomer = zoomers[i];

    zoomer.update();
    zoomer.draw();

    if (zoomer.done) {
      zoomers.splice(i, 1);

      if (zoomers.length > 0) {
        const r = zoomers[zoomers.length - 1].r * r_scale;

        if (r > 5) {
          const zoomer = new Zoomer(p, r, noise_loop.noise());
          zoomers.push(zoomer);
        }
      }
    }
  }
}


class NoiseLoop {
  constructor(r, len) {
    this.r = r;
    this.len = len;
    this.a = 0;

    // assumes 60 fps and that noise is being called every frame
    this.da = TWO_PI / (60 * this.len);

    this.cx = random(100);
    this.cy = random(100);
  }

  noise() {
    const x = cos(this.a) * this.r + this.cx;
    const y = sin(this.a) * this.r + this.cy;
    const val = noise(x, y);

    this.a += this.da;
    
    if (this.a >= TWO_PI) {
      this.a -= TWO_PI
      // print('loop restart')
      background(255)
    }

    return val;
  }
}


class Zoomer {
  constructor(p, r, g) {
    this.p = p;

    this.r = r;
    this.dr = -0.8;

    this.angle = noise(g * 0.3) * TWO_PI;

    const b = 80
    this.black = noise(g * 5) * b;
    this.white = noise(g * 5) * b + (255 - b);

    this.done = false;
  }

  update() {
    if (this.done) {
      return;
    }

    this.r += this.dr;
    if (this.r <= 0) {
      this.done = true;
    }
  }

  draw() {
    if (this.done) {
      return;
    }

    push();
    noStroke();
    translate(this.p.x, this.p.y);
    rotate(this.angle);

    fill(this.black);
    arc(0, 0, this.r * 2, this.r * 2, PI, TWO_PI);

    fill(this.white);
    arc(0, 0, this.r * 2, this.r * 2, TWO_PI, PI);

    // ellipse(0, -this.r / 2, this.r, this.r);

    // fill(this.black);
    // ellipse(0, this.r / 2, this.r, this.r);

    pop();
  }
}
