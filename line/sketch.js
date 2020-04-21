const canvas_w = 512;
const canvas_h = 512;

let pts = [];
const n_pts = 75;
const seg_len = 5;
const len = (n_pts - 1) * seg_len;

const bc = [10, 20, 30];

const bc_alpha = [10, 10, 10, 3];
const pc_alpha = [250, 250, 250, 0.75];
const colors = [pc_alpha, bc_alpha];
let stroke_c = colors[0];

let fps_p;

function setup() {
  createCanvas(canvas_w, canvas_h);
  fps_p = createP();

  const y = 0;
  const x = -len / 2;
  for (let i = 0; i < n_pts; i++) {
    const xi = x + i * seg_len;
    const p = createVector(xi, y);
    const pt = new Ball(p, 2);

    pts.push(pt);
  }

  background(bc);
}


let t = 0;
let g = 0;
function draw() {
  fps_p.html(frameRate().toFixed(1));
  translate(width / 2, height / 2);

  for (let i = 1; i < pts.length; i++) {
    const p1 = pts[i - 1];
    const p2 = pts[i];

    stroke(stroke_c);
    line(p1.p.x, p1.p.y, p2.p.x, p2.p.y);

    p1.update();

    if (i == pts.length - 1) {
      p2.update();
    }
  }

  if (t > 2000) {
    t = 0;
    g++;
    stroke_c = colors[g % 2];

    pts = [];
    const y = 0;
    const x = -len / 2;
    for (let i = 0; i < n_pts; i++) {
      const xi = x + i * seg_len;
      const p = createVector(xi, y);
      const pt = new Ball(p, 2);

      pts.push(pt);
    }
  }
  t++;
}


class Ball {
  constructor(p, r) {
    this.p = p;
    this.v = createVector();
    this.a = createVector();
    this.r = r;
  }

  update() {
    this.ax_seed += this.a_off;
    this.ay_seed += this.a_off;

    const a = 0.01;
    const ax = map(random(), 0, 1, -a, a);
    const ay = map(random(), 0, 1, -a, a);

    this.a.set(ax, ay);

    this.v.add(this.a);
    this.v.limit(30);

    this.p.add(this.v);
    this.p.limit(200);
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    ellipse(0, 0, this.r * 2, this.r * 2);
    pop();
  }
}
