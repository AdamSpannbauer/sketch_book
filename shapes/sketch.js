const canvas_w = 1024;
const canvas_h = 1024;

let morph;
let c;

const r = canvas_w * 0.46875;
const n = 10;

let t = 0;
const rt_scl = canvas_w * 0.05859375;
const nt_scl = 1;

let a = 0;
const da = 2 * Math.PI / 500;

function setup() {
  createCanvas(canvas_w, canvas_h);
  // background(200);
  background(240, 190, 120);

  const c1 = new Circle(r - t * rt_scl, n - t * nt_scl);
  t++;

  const c2 = new Circle(r - t * rt_scl, n - t * nt_scl);
  t++;

  morph = new Morph(c1.pts, c2.pts);

  c = new Circle();
  c.pts = morph.morphed_pts;

  noFill();
  stroke(0, 50);
  strokeWeight(3);
}


function draw() {
  translate(width / 2, height / 2);
  rotate(a);
  a += da;
  translate(-width / 2, -height / 2);

  c.draw();
  morph.morph();
  c.pts = morph.morphed_pts;

  if (!morph.morphing) {
    if (r - t * rt_scl >= 5 && n - t * nt_scl >= 3) {
      const c2 = new Circle(r - t * rt_scl, n - t * nt_scl);
      morph = new Morph(c.pts, c2.pts);

      t++;
    } else {
      noLoop();
    }
  }
}
