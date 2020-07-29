const canvas_w = 512;
const canvas_h = 512;

let rp;

const f1 = [0, 200, 100, 15];
const f2 = [100, 0, 200, 15];

function setup() {
  createCanvas(canvas_w, canvas_h);
  background(100);

  const cx = width / 2;
  const cy = height / 2;
  rp = new RectPrism(cx, cy - 100, 30, 60, cy - 100, cy + 100);
  rp.draw_column();
}


function draw() {
  rp.update();
  rp.draw();
}


class RectPrism {
  constructor(x, y, h, w, min_y, max_y) {
    this.p = createVector(x, y);
    this.h = h;
    this.w = w;
    this.min_y = min_y;
    this.max_y = max_y;
    this.dy = 1;
  }

  update() {
    this.p.y += this.dy;
    if (this.p.y >= this.max_y || this.p.y <= this.min_y) {
      this.dy *= -1;
    }
  }

  draw_square() {
    beginShape();
    vertex(-this.w / 2, 0);
    vertex(0, -this.h / 2);
    vertex(this.w / 2, 0);
    vertex(0, this.h / 2);
    endShape(CLOSE);
  }

  draw_column() {
    for (let y = this.min_y; y <= this.max_y; y += abs(this.dy)) {
      push();
      const r = map(y, this.min_y, this.max_y, f1[0], f2[0]);
      const g = map(y, this.min_y, this.max_y, f1[1], f2[1]);
      const b = map(y, this.min_y, this.max_y, f1[2], f2[2]);
      fill(r, g, b, f1[3]);
      noStroke();
      translate(this.p.x, y);
      this.draw_square();
      pop();
    }
  }

  draw() {
    push();
    noFill();
    stroke(30, 10);
    translate(this.p.x, this.p.y);
    this.draw_square();
    pop();
  }
}
