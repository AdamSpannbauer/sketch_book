const canvas_w = 512;
const canvas_h = 512;
const canvas_d = 512;

const pts = [];
const n_pts = 2;
const seg_len = 20;
const len = (n_pts - 1) * seg_len;

const bc = [10, 20, 30];

const bc_alpha = [10, 10, 10];
const pc_alpha = [250, 250, 250];
const colors = [pc_alpha, bc_alpha];
const stroke_c = colors[0];

let fps_p;

function setup() {
  createCanvas(canvas_w, canvas_h, WEBGL);
  fps_p = createP();

  const y = 0;
  const x = -len / 2;
  for (let i = 0; i < n_pts; i++) {
    const xi = x + i * seg_len;
    const p = createVector(xi, y);
    const pt = new Ball(p, 10);

    pts.push(pt);
  }
}


let a = 0;
const da = 0.001;
function draw() {
  fps_p.html(frameRate().toFixed(1));
  background(bc);
  
  rotateX(a);
  rotateY(a);
  rotateZ(a);
  a += da;

  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];

    stroke(stroke_c);
    fill(stroke_c);

    p.update();
    p.draw();
  }
}


class Ball {
  constructor(p, r) {
    this.p = p;
    this.v = createVector();
    this.a = createVector();
    this.r = r;

    this.hist = [];
    this.max_hist = 300;
  }

  update() {
    const a = 0.1;
    const ax = map(random(), 0, 1, -a, a);
    const ay = map(random(), 0, 1, -a, a);
    const az = map(random(), 0, 1, -a, a);

    this.a.set(ax, ay, az);

    this.v.add(this.a);
    this.v.limit(30);

    this.p.add(this.v);
    this.p.limit(200);

    this.hist.push(this.p.copy());
    if (this.hist.length > this.max_hist) {
      this.hist.splice(0, 1);
    }
  }

  draw() {
    for (let p of this.hist) {
      push()
      translate(p.x, p.y, p.z);
      sphere(this.r * 2, this.r * 2);
      pop()
    }
  }
}
