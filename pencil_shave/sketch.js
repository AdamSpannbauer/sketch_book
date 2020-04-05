const canvas_w = 512;
const canvas_h = 512;
let fps_p;

let shaving;


function setup() {
  createCanvas(canvas_w, canvas_h);
  fps_p = createP();

  shaving = new Shaving();
}


function draw() {
  fps_p.html(frameRate().toFixed(1));

  background(50, 80, 130);

  shaving.update();
  shaving.draw();

  if (shaving.done) {
    shaving = new Shaving();
  }

  stroke(0);
  strokeWeight(5);
  const dx = width * 0.2
  const y = height * 0.1
  line(width / 2 - dx, y, width / 2 + dx, y);
}


class Shaving {
  constructor() {
    this.r = random(70, 120);

    this.cp = createVector(width / 2 - this.r, height * 0.1);

    this.p = createVector();
    this.l = random(width * 0.1, width * 0.25);

    this.x1 = -this.l / 2;
    this.x2 = this.l / 2;

    this.min_x2 = this.x2 - 10;
    this.max_x2 = this.x2;
    this.dx2 = -1;

    this.c = [random(255), random(255), random(255)];
    this.wc = [252, 208, 157];

    this.a = 0;

    this.da = TWO_PI / 400;
    this.da_cum = 0;
    this.max_da = random(TWO_PI * 0.05, TWO_PI * 0.3);

    if (random() > 0.5) {
      this.a = PI;
      this.da *= -1;
      this.cp.x += 2 * this.r;
    }

    this.hist = [];
    this.done = false;
    this.update();
  }

  update() {
    if (this.da_cum >= this.max_da) {
      this.done = true;
      return;
    }

    this.a += this.da;
    this.da_cum += abs(this.da);

    const x = cos(this.a) * this.r;
    const y = sin(this.a) * this.r;
    this.p.set(x + this.cp.x, y + this.cp.y);

    this.x2 += this.dx2;
    if (this.x2 <= this.min_x2 || this.x2 >= this.max_x2) {
      this.dx2 *= -1;
    }

    const [r, g, b] = this.c;
    const [wr, wg, wb] = this.wc;

    const dr = map(noise(r, this.a), 0, 1, -1, 1) * 30;
    const dg = map(noise(g, this.a), 0, 1, -1, 1) * 30;
    const db = map(noise(b, this.a), 0, 1, -1, 1) * 30;

    const info = {
      p: this.p.copy(),
      wc: [wr + dr, wg + dg, wb + db],
      c: [r + dr, g + g, b + db],
      a: this.a,
      x2: this.x2,
    }

    this.hist.push(info)
  }

  draw() {
    for (let h of this.hist) {
      push();
      translate(h.p.x, h.p.y);
      rotate(h.a);

      strokeWeight(5);

      stroke(h.wc);
      line(this.x1, 0, h.x2, 0);

      stroke(h.c);
      line(h.x2 - this.l * 0.1, 0, h.x2, 0);
      line(this.x1 - 1, 0, this.x1, 0);
      pop();
    }
  }
}
