const canvas_w = 512;
const canvas_h = 512;

const r = 400;
const a = 0;

let e;

function setup() {
  createCanvas(canvas_w, canvas_h);
  background(80, 30, 30);

  e = new PulseEllipse(width / 2, height / 2, 200);
}


function draw() {
  e.update();
  e.draw();
}


class PulseEllipse {
  constructor(x, y, r) {
    this.p = createVector(x, y);
    this.r = r;
    this.a = 0;
    this.da = TWO_PI * 0.0002;
    this.update();
  }

  update() {
    this.xr = sin(frameCount / 100) * this.r;
    this.yr = cos(frameCount / 100) * this.r;
    this.a += TWO_PI * 0.0002;
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    rotate(this.a);
    ellipse(0, 0, this.xr, this.yr);
    pop();
  }
}
