const canvas_w = 512;
const canvas_h = 512;

let shape;
let angle = 0;

let bg_color = "#475C7A"
let fill_color = "#AB6C82"

function setup() {
  createCanvas(canvas_w, canvas_h);
  
  background(bg_color);
  fill(fill_color);
  stroke("#FCBB6D");

  shape = new Shape(0, 0, 0, random([4, 5, 6, 8]));
}


function draw() {
  translate(width / 2, height / 2);
  rotate(angle);
  angle -= 0.01;

  shape.update();
  shape.draw();

  if (shape.has_grown && shape.r > width * 0.9) {
    [bg_color, fill_color] = [fill_color, bg_color];

    background(bg_color);
    fill(fill_color);

    shape = new Shape(0, 0, 0, random([4, 5, 6, 8]));
  }
}


class Shape {
  constructor(x, y, r, n_pts) {
    this.p = createVector(x, y);
    this.r = r;
    this.dr = 1.3;
    this.min_r = 0;
    this.max_r = width / 2.2;

    this.off = 0.1;
    this.noise_min = -15;
    this.noise_max = 15;

    this.n_pts = n_pts;
    this.noise_locs = [];
    this.set_noise_locs();

    this.pts = [];
    this.update();

    this.has_grown = false;
  }

  set_noise_locs() {
    this.noise_locs = [];
    for (let i = 0; i < this.n_pts; i++) {
      this.noise_locs.push(random(100));
    }
  }

  update() {
    this.r += this.dr;
    if (this.r > this.max_r && !this.has_grown) {
      this.has_grown = true;
      this.dr *= -1;
    } else if (this.r < this.min_r) {
      this.dr *= -1;
    }

    if (this.r < this.min_r) {
      this.n_pts = random([4, 5, 6, 8]);
      this.set_noise_locs();
    }

    this.pts = [];
    const step = TWO_PI / this.n_pts;
    for (let i = 0; i < this.n_pts; i++) {
      const a = i * step;

      let dr = noise(this.noise_locs[i]);
      dr = map(dr, 0, 1, this.noise_min, this.noise_max);
      const r = this.r + dr;

      const x = this.p.x + cos(a) * r;
      const y = this.p.y + sin(a) * r;

      const pt = createVector(x, y);
      this.pts.push(pt);

      this.noise_locs[i] += this.off;
    }
  }

  draw() {
    push();
    const wt = map(this.r, this.min_r, this.max_r, 0.1, 1);
    strokeWeight(wt);

    beginShape();
    for (const pt of this.pts) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    pop();
  }
}
