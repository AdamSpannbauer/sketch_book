const canvas_w = 512;
const canvas_h = 512;

const yellow = [247, 174, 54];
const blue = [81, 157, 249];
const orange = [248, 119, 51];

const ells = [];

function setup() {
  createCanvas(canvas_w, canvas_h);

  ells.push(new NoisyEllipse(-50, 0, 50, 50, yellow, orange));
  ells.push(new NoisyEllipse(0, 0, 50, 50, blue));
  ells.push(new NoisyEllipse(50, 0, 50, 50, orange, yellow));
}


function draw() {
  background(40);

  translate(width / 2, height / 2);
  rotate(frameCount * 0.01);

  for (const ell of ells) {
    ell.draw();
    ell.update();
  }
}


class NoisyEllipse {
  constructor(x, y, rx, ry, f, f2, n_pts) {
    this.p = createVector(x, y);
    this.rx = rx;
    this.ry = ry;
    this.fill = f;
    this.fill2 = f2 || f;
    this.fill_i = this.fill;
    this.n_pts = n_pts || 50;

    this.x_seed = random(100);
    this.y_seed = random(100);
    this.noise_r = 1.5;
    this.p_off = 0.01;

    this.noise_mag = min([this.rx, this.ry]) * 0.2;

    this.rx_i = this.rx;
    this.ry_i = this.ry;
    this.nm_i = null;

    this.t = 0;
    this.pause = false;
    this.pause_t = 0;
    this.pause_len = 10;

    this.update();
  }

  update() {
    this.x_seed += this.p_off;
    this.y_seed += this.p_off;
    this.nm_i = sin(this.t * 0.005) * this.noise_mag;

    if (abs(this.nm_i) < 1 && this.pause_len > this.pause_t) {
      this.pause_t++;
    } else {
      if (this.nm_i > 0) {
        this.rx_i = map(abs(this.nm_i), 0, this.noise_mag, this.rx, this.rx * 1);
        this.ry_i = this.ry;
      } else {
        this.rx_i = this.rx;
        this.ry_i = map(abs(this.nm_i), 0, this.noise_mag, this.ry, this.ry * 1);
      }

      const r = map(abs(this.nm_i), 0, this.noise_mag, this.fill[0], this.fill2[0]);
      const g = map(abs(this.nm_i), 0, this.noise_mag, this.fill[1], this.fill2[1]);
      const b = map(abs(this.nm_i), 0, this.noise_mag, this.fill[2], this.fill2[2]);
      this.fill_i = [r, g, b];

      this.t++;
      this.pause_t = 0;
    }
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    fill(this.fill_i);

    beginShape();
    for (let a = 0; a <= TWO_PI; a += TWO_PI / this.n_pts) {
      let x_noise = noise(this.noise_r * cos(a) + this.x_seed);
      let y_noise = noise(this.noise_r * sin(a) + this.y_seed);
      x_noise = map(x_noise, 0, 1, -this.nm_i, this.nm_i);
      y_noise = map(y_noise, 0, 1, -this.nm_i, this.nm_i);

      const x = this.rx_i * cos(a) + x_noise;
      const y = this.ry_i * sin(a) + y_noise;

      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}
